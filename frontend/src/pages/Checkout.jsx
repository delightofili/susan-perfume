import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import supabase from "../api/supabaseClient";
import GoldDividerDot from "../components/GoldDividerDot";
import PaystackPop from "@paystack/inline-js";

// ✅ Strong reference generator
const generateReference = () => {
  return `SUS-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const finalTotal = totalPrice - totalPrice * 0.15;

  if (!cart || cart.length === 0) {
    return <p>Your cart is empty</p>;
  }

  // ✅ Save order helper
  const createOrder = async (reference, payment_method, status) => {
    const { error } = await supabase.from("orders").insert([
      {
        customer: form.customer,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        reference,
        items: cart,
        item_count: cart.length,
        total: finalTotal,
        status,
        payment_method,
        date: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  };

  // 🟢 WhatsApp
  const handlePlaceOrder = async () => {
    if (!form.customer || !form.phone || !form.address) {
      return setError("Fill all required fields.");
    }

    setLoading(true);
    setError("");

    try {
      const reference = generateReference();

      await createOrder(reference, "whatsapp", "Pending");

      const orderData = {
        reference,
        customer: form.customer,
        phone: form.phone,
        total: finalTotal,
        items: cart.length,
      };

      clearCart();

      navigate("/order-confirmation", { state: orderData });

      setTimeout(() => {
        window.open(
          `https://wa.me/2349066188842?text=Order Ref: ${reference}`,
          "_blank",
        );
      }, 400);
    } catch (err) {
      console.error("Full Error", err);
      setError(err.message || "Order failed.");
    }

    setLoading(false);
  };

  // 🔵 Paystack
  const handlePayNow = async () => {
    if (!form.customer || !form.phone || !form.address) {
      return setError("Fill all required fields.");
    }

    setLoading(true);

    try {
      const reference = generateReference();

      await createOrder(reference, "paystack", "Pending Payment");

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email || `${form.phone}@temp.com`,
        amount: Math.round(finalTotal * 100),
        currency: "NGN",
        ref: reference,

        onSuccess: () => {
          clearCart();

          navigate("/order-confirmation", {
            state: {
              reference,
              customer: form.customer,
              phone: form.phone,
              total: finalTotal,
              items: cart.length,
            },
          });

          setLoading(false);
        },

        onCancel: () => {
          setError("Payment cancelled.");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setError("Payment failed.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl text-center mb-6">Checkout</h1>

        {/* FORM */}
        <div className="flex flex-col gap-4 mb-6">
          <input
            name="customer"
            placeholder="Full Name"
            onChange={handleChange}
          />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input
            name="email"
            placeholder="Email (optional)"
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />
        </div>

        {/* ERROR */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Processing..." : "Order via WhatsApp"}
          </button>

          <button onClick={handlePayNow} disabled={loading}>
            Pay Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
