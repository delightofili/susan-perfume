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

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      console.error("Invalid Paystack signature");
      return res.sendStatus(401);
    }

    //  Parse event data
    const event = JSON.parse(req.body.toString());

    // Only handle successful payments
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const ref = event.data.reference;
    const amountPaid = event.data.amount / 100;

    console.log("💰 Payment received:", reference);

    // Get order from database
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("reference", ref)
      .single();

    if (error || !order) {
      console.error("Order not found:", ref);
      return res.sendStatus(404);
    }

    //to Prevent duplicate processing
    if (order.status === "Paid") {
      console.log("⚠️ Already processed:", ref);
      return res.sendStatus(200);
    }

    // Validate amount
    if (Number(order.total) !== Number(amountPaid)) {
      console.error("❌ Amount mismatch:", {
        expected: order.total,
        paid: amountPaid,
      });
      return res.sendStatus(400);
    }

    // Reduce stock (if items array exists)
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

    //  Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "Paid",
      })
      .eq("reference", reference);

    if (updateError) {
      console.error("❌ Failed to update order:", updateError);
      return res.sendStatus(500);
    }

    console.log(`✅ Order ${reference} marked as PAID`);

    return res.sendStatus(200);
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return res.sendStatus(500);
  }
};
