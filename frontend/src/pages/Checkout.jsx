import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import supabase from "../api/supabaseClient";
import GoldDividerDot from "../components/GoldDividerDot";
import PaystackPop from "@paystack/inline-js";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";

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

  // finalTotal is exactly the totalPrice, because cart items already have discounts factored in
  const finalTotal = totalPrice;

  // ✅ Save order helper
  const createOrder = async (reference, payment_method, status) => {
    const { error } = await supabase.from("orders").insert([
      {
        customer: form.customer,
        email: form.email, // now required
        phone: form.phone,
        address: form.address,
        reference,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price
        })),
        item_count: cart.length,
        total: finalTotal,
        status,
        payment_method,
        date: new Date().toISOString(),
        guest_id: localStorage.getItem("guest_id"),
      },
    ]);

    if (error) throw error;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (!cart || cart.length === 0) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-playfair mb-6 dark:text-white">Checkout</h1>
        <div className="bg-primary-black/5 dark:bg-primary-black/20 rounded-2xl p-16 text-center border border-pink-blush/10 dark:border-[#c9a84c]/10">
          <p className="text-pink-blush/60 dark:text-warm-cream/60 text-xl mb-6">
            Your cart is empty. Please add items to checkout.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-block px-8 py-3 rounded-xl font-bold uppercase text-white bg-[#e91e8c] dark:text-[#0a0f1a] dark:bg-[#c9a84c] hover:scale-[1.02] transition-all"
          >
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  const guestId = localStorage.getItem("guest_id");

  const validateForm = () => {
    if (!form.customer || !form.phone || !form.address || !form.email) {
      setError("Please fill all required fields, including email.");
      return false;
    }
    // simple email validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  // 🟢 WhatsApp
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

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
        guest_id: guestId,
        date: new Date().toLocaleString(),
      };

      clearCart();

      navigate("/order-confirmation", { state: orderData });

      let text = `Hello, I'd like to place an order!\n\nOrder Ref: *${reference}*\n\n*Items:*\n`;
      cart.forEach(item => {
        text += `- ${item.quantity}x ${item.name} (₦${Number(item.price).toLocaleString()})\n`;
      });
      text += `\n*Total: ₦${finalTotal.toLocaleString()}*\n\n*Customer Details:*\nName: ${form.customer}\nPhone: ${form.phone}\nEmail: ${form.email}\nAddress: ${form.address}`;
      
      const encodedText = encodeURIComponent(text);

      setTimeout(() => {
        window.open(
          `https://wa.me/2348100541423?text=${encodedText}`,
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
    if (!validateForm()) return;

    setLoading(true);

    try {
      const reference = generateReference();

      await createOrder(reference, "paystack", "Pending Payment");

      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(finalTotal * 100),
        currency: "NGN",
        ref: reference,

        onSuccess: () => {
          const orderData = {
            reference,
            customer: form.customer,
            phone: form.phone,
            total: finalTotal,
            items: cart.length,
            guest_id: guestId,
            date: new Date().toISOString(),
          };

          clearCart();

          navigate("/order-confirmation", {
            state: orderData,
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
    <section className="min-h-screen bg-[#fdf2f8] dark:bg-[#0a0f1a] py-16 px-4 transition-colors duration-500 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#e91e8c]/5 dark:bg-[#c9a84c]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#e91e8c]/5 dark:bg-[#c9a84c]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1a0a10] dark:text-[#f5e6a8] mb-3">
            Secure Checkout
          </h1>
          <p className="text-[#e91e8c]/70 dark:text-[#c9a84c]/70 font-inter">
            Complete your order and step into luxury.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* LEFT: FORM */}
          <div className="md:col-span-3 bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 shadow-xl shadow-[#e91e8c]/5 dark:shadow-black/50">
            <h2 className="font-playfair text-2xl text-[#1a0a10] dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] flex items-center justify-center text-sm font-bold">1</span>
              Delivery Details
            </h2>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-[#e91e8c]/70 dark:text-[#c9a84c]/70 uppercase tracking-widest mb-1.5 ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="customer"
                  placeholder="e.g. Susan Doe"
                  value={form.customer}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-black/50 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] focus:ring-1 focus:ring-[#e91e8c]/30 dark:focus:ring-[#c9a84c]/30 transition-all text-[#1a0a10] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#e91e8c]/70 dark:text-[#c9a84c]/70 uppercase tracking-widest mb-1.5 ml-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black/50 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] focus:ring-1 focus:ring-[#e91e8c]/30 dark:focus:ring-[#c9a84c]/30 transition-all text-[#1a0a10] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e91e8c]/70 dark:text-[#c9a84c]/70 uppercase tracking-widest mb-1.5 ml-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="0800 000 0000"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black/50 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] focus:ring-1 focus:ring-[#e91e8c]/30 dark:focus:ring-[#c9a84c]/30 transition-all text-[#1a0a10] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#e91e8c]/70 dark:text-[#c9a84c]/70 uppercase tracking-widest mb-1.5 ml-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  placeholder="Full street address..."
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-black/50 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] focus:ring-1 focus:ring-[#e91e8c]/30 dark:focus:ring-[#c9a84c]/30 transition-all text-[#1a0a10] dark:text-white resize-none"
                />
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY & BUTTONS */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 shadow-xl shadow-[#e91e8c]/5 dark:shadow-black/50">
              <h2 className="font-playfair text-2xl text-[#1a0a10] dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] flex items-center justify-center text-sm font-bold">2</span>
                Order Summary
              </h2>

              <div className="max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#e91e8c]/20 dark:scrollbar-thumb-[#c9a84c]/20 flex flex-col gap-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-[#e91e8c]/5 dark:bg-black overflow-hidden flex-shrink-0 border border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🧴</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-sm dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm text-[#e91e8c] dark:text-[#c9a84c]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e91e8c]/15 dark:border-[#c9a84c]/15 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Subtotal</span>
                  <span className="text-sm dark:text-white">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Shipping</span>
                  <span className="text-sm text-green-500">Calculated on WhatsApp</span>
                </div>
                <div className="flex justify-between items-end border-t border-dashed border-[#e91e8c]/20 dark:border-[#c9a84c]/20 pt-4">
                  <span className="font-bold text-lg dark:text-white">Total</span>
                  <span className="font-playfair font-bold text-2xl text-[#e91e8c] dark:text-[#c9a84c]">
                    ₦{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2
                           bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-[#25D366]/20 
                           transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FaWhatsapp className="text-xl" />
                {loading ? "Processing..." : "Order via WhatsApp"}
              </button>

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2
                           bg-[#1a0a10] text-white hover:bg-[#2c131d] 
                           dark:bg-[#c9a84c] dark:text-black dark:hover:bg-[#dfbc5b]
                           shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdOutlinePayment className="text-xl" />
                Pay Now (Card/Bank)
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Checkout;
