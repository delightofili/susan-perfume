"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { CartItem } from "../types/index.js";
import { useCart } from "../context/CartContext.js";

export default function CartCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm">
      {/* Image */}
      <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-b from-[#fff8fb] to-[#fce4ec] dark:from-[#131b2e] dark:to-[#090e18] p-2 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-[10px] font-cinzel text-gray-400">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-cinzel text-sm font-bold text-gray-900 dark:text-white truncate">
          {item.name}
        </h4>
        <p className="font-inter text-xs font-semibold text-[#e91e8c] dark:text-[#c9a84c] mt-0.5">
          ${Number(item.price).toFixed(2)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="px-2.5 py-0.5 bg-gray-100 dark:bg-[#162032] text-xs font-bold hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white transition-colors"
            >
              -
            </button>
            <span className="px-3 py-0.5 font-inter text-xs font-bold text-gray-800 dark:text-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-2.5 py-0.5 bg-gray-100 dark:bg-[#162032] text-xs font-bold hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Item Subtotal & Delete */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-inter text-sm font-extrabold text-gray-900 dark:text-white">
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
