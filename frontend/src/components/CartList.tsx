"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.js";
import CartCard from "./CartCard.js";

export default function CartList() {
  const { cart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-[#0d1526] rounded-3xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="font-cinzel text-xl font-bold text-gray-900 dark:text-white">Your Cart is Empty</h3>
        <p className="font-playfair italic text-sm text-gray-500 max-w-sm mx-auto">
          Explore our private collection to select your signature luxury fragrance.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-opacity"
        >
          Browse Perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
        <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-gray-500">
          Items in Cart ({cart.length})
        </span>
        <button
          onClick={clearCart}
          className="font-cinzel text-xs text-red-500 hover:underline uppercase tracking-wider font-bold"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-3">
        {cart.map((item) => (
          <CartCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
