"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext.js";

export default function OrderSummary({ showCheckoutBtn = true }: { showCheckoutBtn?: boolean }) {
  const { totalPrice, totalItems } = useCart();
  const shipping = totalPrice > 0 ? 0 : 0; // Free complimentary express shipping
  const grandTotal = totalPrice + shipping;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-md space-y-6">
      <h3 className="font-cinzel text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10 pb-4">
        Order Summary
      </h3>

      <div className="space-y-3 font-inter text-sm">
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-semibold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>Complimentary Express Shipping</span>
          <span className="font-semibold text-green-600 dark:text-green-400">FREE</span>
        </div>

        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
          <span>Estimated Taxes</span>
          <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between font-bold text-base">
          <span className="font-cinzel uppercase text-gray-900 dark:text-white">Total</span>
          <span className="font-inter text-xl text-[#e91e8c] dark:text-[#c9a84c]">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {showCheckoutBtn && (
        <Link
          href={totalItems > 0 ? "/checkout" : "#"}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg transition-all ${
            totalItems > 0
              ? "bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] hover:opacity-90 cursor-pointer"
              : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      <div className="flex items-center gap-2 justify-center text-xs font-inter text-gray-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
        <span>Encrypted 256-bit Secure Checkout</span>
      </div>
    </div>
  );
}
