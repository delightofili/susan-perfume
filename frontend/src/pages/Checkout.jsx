

import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import supabase from "../api/supabaseClient";
import GoldDividerDot from "../components/GoldDividerDot";
import PaystackPop from "@paystack/inline-js"; 

// Generate unique order reference
const generateReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SUS-${year}-${random}`;
};

function Checkout() {
    const navigate = useNavigate();
    const { cart, totalPrice, totalItems, clearCart } = useCart();
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

    // Discount 15%
    const discountAmount = totalPrice * 0.15;
    const finalTotal = totalPrice - discountAmount;

    // Redirect if cart is empty
    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]">
                <p className="text-6xl">🛒</p>
                <h2 className="font-playfair text-2xl text-[#f5e6a8]">
                    Your cart is empty
                </h2>
                <button
                    onClick={() => navigate("/shop")}
                    className="font-cinzel text-[11px] tracking-[2px] uppercase px-8 py-3 border border-[#c9a84c]/50 text-[#c9a84c] rounded-sm hover:bg-[#c9a84c]/10 transition-all"
                >
                    Browse Perfumes
                </button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        // Validate
        if (!form.customer.trim()) {
            setError("Please enter your full name.");
            return;
        }
        if (!form.phone.trim()) {
            setError("Please enter your WhatsApp number.");
            return;
        }
        if (!form.address.trim()) {
            setError("Please enter your delivery address.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const reference = generateReference();
            const cartId = localStorage.getItem("cart_id");

            // ── Save order to Supabase ──
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert([
                    {
                        customer: form.customer.trim(),
                        email: form.email.trim() || null,
                        phone: form.phone.trim(),
                        address: form.address.trim(),
                        reference,
                        cart_id: cartId,
                        items: totalItems,
                        total: finalTotal,
                        status: "Pending", //whatsapp
                        status: "Paid", //Paystack
                        date: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            // ── Build WhatsApp message ──
            const itemsList = cart
                .map((i) => `• ${i.name} x${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`)
                .join("\n");

            const message = `
🧴 *New Order — Susan's Luxury Perfume*

*Ref:* ${reference}
*Customer:* ${form.customer}
*Phone:* ${form.phone}
${form.email ? `*Email:* ${form.email}` : ""}
*Address:* ${form.address}

*Items:*
${itemsList}

*Subtotal:* ₦${totalPrice.toLocaleString()}
*Discount (15%):* − ₦${discountAmount.toLocaleString()}
*Total:* ₦${finalTotal.toLocaleString()}

_Please confirm this order and provide delivery timeline._
      `.trim();

            const susanNumber = "2349066188842";
            const encoded = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${susanNumber}?text=${encoded}`;

            // ── Navigate to confirmation BEFORE opening WhatsApp ──
            navigate("/order-confirmation", {
                state: {
                    reference,
                    customer: form.customer,
                    total: finalTotal,
                    items: totalItems,
                    phone: form.phone,
                },
            });

            await clearCart();

            // Open WhatsApp after short delay
            setTimeout(() => {
                window.open(whatsappUrl, "_blank");
            }, 500);

        } catch (err) {
            console.error("Order failed:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    const handlePayNow = async () => {
  if (!form.customer || !form.phone || !form.address) {
    setError("Please fill in all fields.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    // ✅ 1. Generate reference FIRST
    const reference = generateReference();

    // ✅ 2. Save order BEFORE payment
    const { error } = await supabase.from("orders").insert([
      {
        customer: form.customer,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        reference,
        items: totalItems,
        total: finalTotal,
        status: "Pending Payment",
        date: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    // ✅ 3. Open Paystack
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: "pk_test_173360b9dac2e8fc71a350db15bcb766a61239e7",
      email: form.email ? form.email : `${form.phone}@temp.com`,
      amount: Math.round(finalTotal * 100),
      currency: "NGN",
      ref: reference,

     onSuccess: async (transaction) => {
  setLoading(true); // Keep loading state active
  
  try {
    // Call your new Supabase Edge Function
    const response = await fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference: reference }),
    });

    if (response.ok) {
        //clear cart
        await clearCart();
      // ONLY NOW do we show the success screen
      navigate("/order-confirmation", {
        state: { reference, customer: form.customer, total: finalTotal, items: totalItems, phone: form.phone }
      });
    } else {
      setError("Payment verification failed. Please contact support.");
    }
  } catch (err) {
    setError("Error connecting to verification server.");
  } finally {
    setLoading(false);
  }
},

      onCancel: () => {
        setLoading(false);
        setError("Payment cancelled. Please try again.");
      },
    });

  } catch (err) {
    console.error(err);
    setError("Could not start payment.");
    setLoading(false);
  }
};

    return (
        <section className="min-h-screen w-full relative">
            {/* ── Backgrounds ── */}
            <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]" />
            <div className="absolute inset-0 opacity-100 dark:opacity-0 bg-[radial-gradient(ellipse_at_top_right,#f8c8da_0%,#fdf0f5_45%,#fff8f0_100%)]" />
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_70%)]" />

            <div className="relative z-40 max-w-5xl mx-auto px-4 py-10">

                {/* ── Title ── */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-playfair text-[#1a0a10] dark:text-[#f5e6a8] mb-4">
                        Checkout
                    </h1>
                    <GoldDividerDot />
                    <p className="text-[#1a0a10]/50 dark:text-warm-cream/50 font-inter text-sm mt-4">
                        Complete your order below
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8">

                    {/* ── Left — Customer Details ── */}
                    <div className="flex flex-col gap-6">

                        {/* Contact info */}
                        <div className="rounded-2xl overflow-hidden border border-[#c9a84c]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm">
                            <div className="px-6 py-4 border-b border-[#c9a84c]/15">
                                <h2 className="font-playfair text-lg text-[#1a0a10] dark:text-[#f5e6a8]">
                                    Your Details
                                </h2>
                                <p className="font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40 mt-1">
                                    We'll use these to confirm your order
                                </p>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                {/* Full name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
                                        Full Name <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                                    </label>
                                    <input
                                        name="customer"
                                        value={form.customer}
                                        onChange={handleChange}
                                        placeholder="e.g. Amaka Johnson"
                                        className="px-4 py-3 rounded-xl text-sm font-inter
                               bg-white/50 dark:bg-black/30
                               border border-[#c9a84c]/20
                               text-[#1a0a10] dark:text-[#f5e6a8]
                               placeholder:text-[#1a0a10]/25 dark:placeholder:text-warm-cream/20
                               outline-none focus:border-[#c9a84c]/60 transition-all"
                                    />
                                </div>

                                {/* WhatsApp number */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
                                        WhatsApp Number <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                                    </label>
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. 08012345678"
                                        className="px-4 py-3 rounded-xl text-sm font-inter
                               bg-white/50 dark:bg-black/30
                               border border-[#c9a84c]/20
                               text-[#1a0a10] dark:text-[#f5e6a8]
                               placeholder:text-[#1a0a10]/25 dark:placeholder:text-warm-cream/20
                               outline-none focus:border-[#c9a84c]/60 transition-all"
                                    />
                                    <p className="text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 font-inter">
                                        We'll send your order confirmation via WhatsApp
                                    </p>
                                </div>

                                {/* Email (optional) */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
                                        Email <span className="text-[#1a0a10]/25 dark:text-warm-cream/30 normal-case">(optional)</span>
                                    </label>
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="your@email.com"
                                        className="px-4 py-3 rounded-xl text-sm font-inter
                               bg-white/50 dark:bg-black/30
                               border border-[#c9a84c]/20
                               text-[#1a0a10] dark:text-[#f5e6a8]
                               placeholder:text-[#1a0a10]/25 dark:placeholder:text-warm-cream/20
                               outline-none focus:border-[#c9a84c]/60 transition-all"
                                    />
                                </div>

                                {/* Delivery address */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
                                        Delivery Address <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="House number, street, city, state..."
                                        className="px-4 py-3 rounded-xl text-sm font-inter
                               bg-white/50 dark:bg-black/30
                               border border-[#c9a84c]/20
                               text-[#1a0a10] dark:text-[#f5e6a8]
                               placeholder:text-[#1a0a10]/25 dark:placeholder:text-warm-cream/20
                               outline-none focus:border-[#c9a84c]/60 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: "🔒", text: "Secure Order" },
                                { icon: "📦", text: "Fast Delivery" },
                                { icon: "💬", text: "WhatsApp Support" },
                            ].map(({ icon, text }) => (
                                <div
                                    key={text}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#c9a84c]/15 bg-white/40 dark:bg-white/2 text-center"
                                >
                                    <span className="text-xl">{icon}</span>
                                    <p className="font-inter text-[10px] text-[#1a0a10]/50 dark:text-warm-cream/40 uppercase tracking-wider">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right — Order Summary ── */}
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl overflow-hidden border border-[#c9a84c]/20 bg-white/60 dark:bg-white/3 backdrop-blur-sm">
                            <div className="px-6 py-4 border-b border-[#c9a84c]/15">
                                <h2 className="font-playfair text-lg text-[#1a0a10] dark:text-[#f5e6a8]">
                                    Order Summary
                                </h2>
                            </div>

                            {/* Cart items */}
                            <div className="divide-y divide-[#c9a84c]/10">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 px-6 py-3">
                                        {/* Image */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-linear-to-br from-[#fdf0f5] to-[#fff8f0] dark:from-[#1a0a10] dark:to-[#0a0f1a] border border-[#c9a84c]/15 flex items-center justify-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl">🧴</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-playfair text-sm text-[#1a0a10] dark:text-[#f5e6a8] truncate">
                                                {item.name}
                                            </p>
                                            <p className="font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40">
                                                x{item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-inter text-sm font-bold text-pink-blush dark:text-[#c9a84c] shrink-0">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="px-6 py-4 flex flex-col gap-3 border-t border-[#c9a84c]/15">
                                <div className="flex justify-between text-sm font-inter text-[#1a0a10]/60 dark:text-warm-cream/60">
                                    <span>Subtotal</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-inter text-green-600 dark:text-green-400">
                                    <span>Discount (15%)</span>
                                    <span>− ₦{discountAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-inter text-[#1a0a10]/60 dark:text-warm-cream/60">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
                                <div className="flex justify-between font-playfair text-lg text-[#1a0a10] dark:text-[#f5e6a8]">
                                    <span>Total</span>
                                    <span className="text-pink-blush dark:text-[#c9a84c] font-bold">
                                        ₦{finalTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-inter text-xs">
                                ⚠ {error}
                            </div>
                        )}

                        {/* WhatsApp notice */}
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <span className="text-xl shrink-0">💬</span>
                            <p className="font-inter text-xs text-green-600 dark:text-green-400">
                                After confirming, WhatsApp will open with your order details pre-filled. Send it to complete your order.
                            </p>
                        </div>

                        {/* Place order button */}
                        <div className="flex gap-3 justify-center w-full p-3 items-center">
                            <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full py-4 font-cinzel text-sm tracking-[2px] uppercase
                         bg-[image:--luxury-gold-gradient]
                         text-[#1a0a10] font-bold rounded-xl
                         hover:opacity-90 hover:shadow-lg hover:shadow-[#c9a84c]/20
                         transition-all duration-200 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-[#1a0a10]/30 border-t-[#1a0a10] rounded-full animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                "Order via WhatsApp"
                            )}
                        </button>
                        <button className="w-full py-4 font-cinzel text-sm tracking-[2px] uppercase
                         bg-[image:--luxury-gold-gradient]
                         text-[#1a0a10] font-bold rounded-xl
                         hover:opacity-90 hover:shadow-lg hover:shadow-[#c9a84c]/20
                         transition-all duration-200 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3" onClick={handlePayNow}>Pay Now</button>
                        </div>

                        {/* Back to cart */}
                        <button
                            onClick={() => navigate("/cart")}
                            className="text-center font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40 hover:text-pink-blush dark:hover:text-[#c9a84c] transition-colors"
                        >
                            ← Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Checkout;