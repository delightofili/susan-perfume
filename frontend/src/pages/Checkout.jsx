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

  const discountAmount = totalPrice * 0.15;
  const finalTotal = totalPrice - discountAmount;

  // Empty cart guard
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-6xl">🛒</p>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/shop")}>Browse Perfumes</button>
      </div>
    );
  }

  // -----------------------------
  // 🟢 WHATSAPP ORDER
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!form.customer.trim()) return setError("Enter your full name.");
    if (!form.phone.trim()) return setError("Enter your phone number.");
    if (!form.address.trim()) return setError("Enter your address.");

    setLoading(true);
    setError("");

    try {
      const reference = generateReference();

      await supabase.from("orders").insert([
        {
          customer: form.customer.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim(),
          address: form.address.trim(),
          reference,
          items: cart, // ✅ store full cart
          total: finalTotal,
          status: "Pending",
          payment_method: "whatsapp",
          date: new Date().toISOString(),
        },
      ]);

      // Build WhatsApp message
      const itemsList = cart
        .map(
          (i) =>
            `• ${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`,
        )
        .join("\n");

      const message = `
🧴 *New Order — Susan's Luxury Perfume*

Ref: ${reference}
Customer: ${form.customer}
Phone: ${form.phone}
${form.email ? `Email: ${form.email}` : ""}
Address: ${form.address}

Items:
${itemsList}

Total: ₦${finalTotal.toLocaleString()}
      `.trim();

      await clearCart();

      navigate("/order-confirmation", {
        state: { reference },
      });

      setTimeout(() => {
        window.open(
          `https://wa.me/2349066188842?text=${encodeURIComponent(message)}`,
          "_blank",
        );
      }, 400);
    } catch (err) {
      console.error(err);
      setError("Order failed.");
      setLoading(false);
    }
  };

  // -----------------------------
  // 🔵 PAYSTACK PAYMENT
  // -----------------------------
  const handlePayNow = async () => {
    if (!form.customer || !form.phone || !form.address) {
      return setError("Fill all required fields.");
    }

    setLoading(true);
    setError("");

    try {
      const reference = generateReference();

      // Save order first
      await supabase.from("orders").insert([
        {
          customer: form.customer,
          email: form.email || null,
          phone: form.phone,
          address: form.address,
          reference,
          items: cart,
          total: finalTotal,
          status: "Pending Payment",
          payment_method: "paystack",
          date: new Date().toISOString(),
        },
      ]);

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email || `${form.phone}@temp.com`,
        amount: Math.round(finalTotal * 100),
        currency: "NGN",
        ref: reference,

        onSuccess: () => {
          // webhook will handle verification

          clearCart();

          navigate("/order-confirmation", {
            state: { reference },
          });

          setLoading(false);
        },

        onCancel: () => {
          setLoading(false);
          setError("Payment cancelled.");
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
