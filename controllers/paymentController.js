import crypto from "crypto";
import supabase from "../supabaseClient.js";

export const handleWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // 1. Verify the signature (The "Crypto Stuff")
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;

    if (event.event === "charge.success") {
      const ref = event.data.reference;

      // Paystack sends the items in the 'metadata' if you passed them during checkout
      // Otherwise, we fetch the items associated with this order reference
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("items") // Assuming your orders table stores the list of items
        .eq("reference", ref)
        .single();

      if (order && order.items) {
        // 2. Loop through items and reduce stock for each
        for (const item of order.items) {
          const { error: stockError } = await supabase.rpc("decrement_stock", {
            row_id: item.id,
            quantity: item.quantity,
          });

          if (stockError)
            console.error(`Stock reduction failed for ${item.id}:`, stockError);
        }
      }

      // 3. Mark the Order as Paid
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("reference", ref);

      console.log(`Inventory updated and order ${ref} confirmed!`);
    }
  }

  res.sendStatus(200);
};
