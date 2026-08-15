"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext.js";
import { useToast } from "../../context/ToastContext.js";
import { createOrderApi } from "../../lib/api.js";
import OrderSummary from "../../components/OrderSummary.js";
import { SectionDivider } from "../../components/SectionDivider.js";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxx";

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !email || !address) {
      addToast("Please complete all customer details.", "error");
      return;
    }

    if (cart.length === 0) {
      addToast("Your cart is empty.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderRef = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // Create order in backend API first
      await createOrderApi({
        reference: orderRef,
        customer: customerName,
        email,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        status: "Pending",
        total: totalPrice,
      });

      // Paystack Inline Pop Setup
      if (typeof window !== "undefined" && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email,
          amount: Math.round(totalPrice * 100), // Paystack accepts amount in kobo/cents
          currency: "USD",
          ref: orderRef,
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: customerName },
              { display_name: "Delivery Address", variable_name: "address", value: address },
            ],
          },
          callback: function (response: any) {
            addToast("Payment successful! Processing order...", "success");
            clearCart();
            router.push(`/order-confirmation?ref=${encodeURIComponent(orderRef)}`);
          },
          onClose: function () {
            setIsSubmitting(false);
            addToast("Payment window closed. Order reference saved.", "info");
          },
        });

        handler.openIframe();
      } else {
        // Fallback simulated payment flow if Paystack JS script fails to load
        addToast("Paystack SDK unavailable. Simulating order placement...", "info");
        setTimeout(async () => {
          await clearCart();
          router.push(`/order-confirmation?ref=${encodeURIComponent(orderRef)}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      addToast(err.message || "Failed to initialize order payment.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <SectionDivider
          title="Atelier Checkout"
          subtitle="Complete your shipping details to complete your private order."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Details Form */}
          <form onSubmit={handlePaystackPayment} className="lg:col-span-2 space-y-6 bg-[#fff8fb] dark:bg-[#0d1526] p-8 rounded-3xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-md">
            <h3 className="font-cinzel text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10 pb-4">
              Shipping & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Lady Victoria"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Country"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
              <div className="p-4 rounded-xl bg-[#e91e8c]/5 dark:bg-[#c9a84c]/5 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#e91e8c] dark:text-[#c9a84c]" />
                  <div>
                    <p className="font-cinzel text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">
                      Paystack Secure Gateway
                    </p>
                    <p className="font-inter text-xs text-gray-500">Supports Card, Apple Pay, Bank Transfer</p>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-green-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg transition-all ${
                isSubmitting || cart.length === 0
                  ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed text-gray-200"
                  : "bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] hover:opacity-90 cursor-pointer animate-pink-glow dark:animate-gold-glow"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? "Initializing Paystack..." : `Pay Now • $${totalPrice.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary Side Panel */}
          <div className="lg:col-span-1">
            <OrderSummary showCheckoutBtn={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
