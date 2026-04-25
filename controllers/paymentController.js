import crypto from "crypto";
import supabase from "../supabaseClient.js";

export const handleWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  try {
    // 1️⃣ Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body) // raw body
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.error("Invalid Paystack signature");
      return res.sendStatus(401);
    }

    const event = JSON.parse(req.body.toString());

    // 2️⃣ Only handle successful payments
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const ref = event.data.reference;
    const amountPaid = event.data.amount / 100;

    // 3️⃣ Get order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("reference", ref)
      .single();

    if (error || !order) {
      console.error("Order not found:", ref);
      return res.sendStatus(404);
    }

    // 4️⃣ Prevent duplicate processing
    if (order.status === "Paid") {
      console.log("Already processed:", ref);
      return res.sendStatus(200);
    }

    // 5️⃣ Validate amount
    if (order.total !== amountPaid) {
      console.error("Amount mismatch:", {
        expected: order.total,
        paid: amountPaid,
      });
      return res.sendStatus(400);
    }

    // 6️⃣ Reduce stock (if items array exists)
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          row_id: item.id,
          quantity: item.quantity,
        });

        if (stockError) {
          console.error("Stock update failed:", stockError);
        }
      }
    }

    // 7️⃣ Mark order as paid
    await supabase
      .from("orders")
      .update({ status: "Paid" })
      .eq("reference", ref);

    console.log(`Order ${ref} successfully processed`);

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
};
