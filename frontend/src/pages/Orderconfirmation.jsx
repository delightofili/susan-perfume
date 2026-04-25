// src/pages/OrderConfirmation.jsx

import { useLocation, useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { useCart } from "../hook/useCart";
import GoldDividerDot from "../components/GoldDividerDot";

function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, removeItem } = useCart();
    const order = location.state;

    useEffect(() => {
        if (!order) return;

        // Save order to localStorage for My Orders tab
        const existing = JSON.parse(localStorage.getItem("past_orders") || "[]");
        const alreadySaved = existing.find((o) => o.reference === order.reference);
        if (!alreadySaved) {
            const updated = [
                {
                    reference: order.reference,
                    customer: order.customer,
                    total: order.total,
                    items: order.items,
                    status: "Pending",
                    date: new Date().toISOString(),
                },
                ...existing,
            ];
            localStorage.setItem("past_orders", JSON.stringify(updated));
        }

        // Clear cart
        if (cart.length > 0) {
            cart.forEach((item) => removeItem(item.id));
        }
    }, []);

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,#0a0f1a,#1a0410)]">
                <p className="text-[#f5e6a8]/50 font-inter">No order found.</p>
                <Link to="/shop" className="text-[#c9a84c] font-cinzel text-sm tracking-widest uppercase border border-[#c9a84c]/30 px-6 py-2 rounded-sm hover:bg-[#c9a84c]/10 transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <section className="min-h-screen w-full relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-[radial-gradient(ellipse_at_top,#0d1a0a_0%,#0a0f1a_60%)]" />
            <div className="absolute inset-0 opacity-100 dark:opacity-0 bg-[radial-gradient(ellipse_at_top,#f0fdf4_0%,#fdf0f5_50%,#fff8f0_100%)]" />

            <div className="relative z-40 w-full max-w-lg mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>

                <h1 className="font-playfair text-3xl md:text-4xl text-[#1a0a10] dark:text-[#f5e6a8] mb-4">
                    Order Placed!
                </h1>
                <GoldDividerDot />

                <p className="font-inter text-sm text-[#1a0a10]/60 dark:text-warm-cream/60 mt-4 mb-8">
                    Thank you, <span className="font-semibold text-[#1a0a10] dark:text-[#f5e6a8]">{order.customer}</span>! Your order has been received.
                </p>

                {/* Reference card */}
                <div className="rounded-2xl border border-[#c9a84c]/25 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm p-6 mb-6">
                    <p className="font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40 uppercase tracking-widest mb-2">
                        Order Reference
                    </p>
                    <p className="font-playfair text-2xl text-pink-blush dark:text-[#c9a84c] font-bold mb-1">
                        {order.reference}
                    </p>
                    <p className="font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40 mb-4">
                        Screenshot this to track your order anytime
                    </p>

                    <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent my-4" />

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 uppercase tracking-wider mb-1">Items</p>
                            <p className="font-inter text-sm text-[#1a0a10] dark:text-[#f5e6a8] font-semibold">
                                {order.items} item{order.items !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div>
                            <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 uppercase tracking-wider mb-1">Total</p>
                            <p className="font-inter text-sm text-pink-blush dark:text-[#c9a84c] font-bold">
                                ₦{Number(order.total).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 uppercase tracking-wider mb-1">Status</p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-inter text-orange-500 dark:text-orange-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                                Pending
                            </span>
                        </div>
                        <div>
                            <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 uppercase tracking-wider mb-1">Contact</p>
                            <p className="font-inter text-sm text-[#1a0a10] dark:text-[#f5e6a8]">{order.phone}</p>
                        </div>
                    </div>
                </div>

                {/* WhatsApp notice */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-left mb-6">
                    <span className="text-xl shrink-0">💬</span>
                    <div>
                        <p className="font-inter text-xs text-green-600 dark:text-green-400 font-semibold mb-1">
                            WhatsApp should have opened
                        </p>
                        <p className="font-inter text-xs text-green-600/70 dark:text-green-400/70">
                            If it didn't, send your reference <strong>{order.reference}</strong> to Susan on WhatsApp to confirm.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        to="/track-order"
                        state={{ reference: order.reference }}
                        className="w-full py-3 font-cinzel text-sm tracking-[2px] uppercase bg-[image:--luxury-gold-gradient] text-[#1a0a10] font-bold rounded-xl hover:opacity-90 transition-all block text-center"
                    >
                        Track My Order
                    </Link>
                    <Link
                        to="/cart"
                        className="w-full py-3 font-cinzel text-sm tracking-[2px] uppercase border border-[#c9a84c]/30 text-pink-blush dark:text-[#c9a84c] rounded-xl hover:bg-[#c9a84c]/10 transition-all block text-center"
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/shop"
                        className="font-inter text-xs text-[#1a0a10]/40 dark:text-warm-cream/40 hover:text-pink-blush dark:hover:text-[#c9a84c] transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default OrderConfirmation;