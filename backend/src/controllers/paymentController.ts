import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../config/db.js";

export const handleWebhook = async (req: Request, res: Response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";

  try {
    // 1️⃣ Verify Paystack signature using raw body buffer
    const rawBody = req.body;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.error("❌ Invalid Paystack signature");
      return res.status(401).send("Invalid signature");
    }

    // 2️⃣ Parse event data
    const event = JSON.parse(rawBody.toString("utf8"));

    if (event.event !== "charge.success") {
      return res.status(200).send("Event ignored");
    }

    const ref = event.data.reference;
    const amountPaid = event.data.amount / 100;

    console.log("💰 Paystack payment webhook received for ref:", ref);

    // 3️⃣ Find matching order
    const order = await prisma.order.findUnique({
      where: { reference: ref },
    });

    if (!order) {
      console.error("❌ Order not found for reference:", ref);
      return res.status(404).send("Order not found");
    }

    if (order.status === "Paid") {
      console.log("⚠️ Order already marked as Paid:", ref);
      return res.status(200).send("Already processed");
    }

    // Validate amount paid
    if (Math.abs(order.total - amountPaid) > 0.01) {
      console.error("❌ Amount mismatch:", { expected: order.total, paid: amountPaid });
      return res.status(400).send("Amount mismatch");
    }

    // 4️⃣ Decrement stock for ordered items
    const items = order.items as Array<{ id?: string; productId?: string; quantity: number }>;
    if (Array.isArray(items)) {
      for (const item of items) {
        const prodId = item.productId || item.id;
        if (prodId && item.quantity > 0) {
          try {
            await prisma.product.update({
              where: { id: prodId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
            console.log(`📉 Decremented stock for product ${prodId} by ${item.quantity}`);
          } catch (err) {
            console.error(`⚠️ Failed to update stock for product ${prodId}:`, err);
          }
        }
      }
    }

    // 5️⃣ Update order status to Paid
    await prisma.order.update({
      where: { reference: ref },
      data: { status: "Paid" },
    });

    console.log(`✅ Order ${ref} marked as PAID`);
    return res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("🔥 Webhook processing error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
