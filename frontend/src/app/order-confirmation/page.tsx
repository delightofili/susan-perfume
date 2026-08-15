"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PackageCheck, Copy, ArrowRight } from "lucide-react";
import { Order } from "../../types/index.js";
import { getOrderByRef } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.js";
import { SectionDivider } from "../../components/SectionDivider.js";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");
  const { addToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (refParam) {
      getOrderByRef(refParam)
        .then((data) => setOrder(data))
        .catch((err) => console.error("Error fetching order by ref:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refParam]);

  const copyRefToClipboard = () => {
    if (order?.reference) {
      navigator.clipboard.writeText(order.reference);
      addToast("Order reference copied to clipboard!", "success");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full mx-auto" />
        <p className="font-cinzel text-xs text-gray-500 mt-4 uppercase tracking-widest">
          Retrieving Order Confirmation...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <SectionDivider
        title="Order Confirmed"
        subtitle="Your private fragrance order has been received at the Susan Atelier."
      />

      <div className="p-8 rounded-3xl bg-[#fff8fb] dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="font-cinzel text-2xl font-bold text-gray-900 dark:text-white">
            Thank You For Your Order!
          </h2>
          <p className="font-playfair italic text-sm text-gray-600 dark:text-gray-300">
            A confirmation receipt and live tracking details have been sent to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {order?.email || "your email"}
            </span>
            .
          </p>
        </div>

        {/* Reference Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 inline-flex items-center gap-3 shadow-inner">
          <PackageCheck className="w-5 h-5 text-[#e91e8c] dark:text-[#c9a84c]" />
          <div>
            <p className="font-cinzel text-[10px] font-bold uppercase text-gray-500">Order Reference</p>
            <p className="font-inter text-sm font-extrabold text-[#e91e8c] dark:text-[#c9a84c]">
              {order?.reference || refParam || "ORD-PENDING"}
            </p>
          </div>
          <button
            onClick={copyRefToClipboard}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a253d] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Copy reference"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Order Details Table */}
        {order && (
          <div className="text-left pt-6 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 space-y-4">
            <div className="flex items-center justify-between font-cinzel text-xs font-bold uppercase tracking-wider text-gray-500">
              <span>Customer: {order.customer}</span>
              <span className="px-3 py-1 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
                Status: {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.isArray(order.items) &&
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between font-inter text-sm">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between font-bold text-base">
              <span className="font-cinzel text-gray-900 dark:text-white">Total Amount</span>
              <span className="font-inter text-[#e91e8c] dark:text-[#c9a84c] text-lg">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track-order?ref=${encodeURIComponent(order?.reference || refParam || "")}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-opacity"
          >
            Track Order Live
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 font-cinzel text-xs tracking-wider uppercase text-gray-700 dark:text-gray-300 hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="py-12 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen">
      <Suspense fallback={
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full mx-auto" />
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
}
