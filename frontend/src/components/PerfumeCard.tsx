"use client";

import React from "react";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { Product } from "../types/index.js";
import { useCart } from "../context/CartContext.js";

interface PerfumeCardProps {
  product: Product;
  onOpenModal?: (product: Product) => void;
}

export default function PerfumeCard({ product, onOpenModal }: PerfumeCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group relative bg-white/80 dark:bg-[#0d1526]/80 rounded-2xl p-5 border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between shimmer-card">
      <div>
        {/* Category Tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
            {product.category || "Luxury"}
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-xs font-inter font-semibold text-gray-700 dark:text-gray-300">4.9</span>
          </div>
        </div>

        {/* Product Image */}
        <div
          onClick={() => onOpenModal?.(product)}
          className="relative w-full h-56 rounded-xl overflow-hidden bg-gradient-to-b from-[#fff8fb] to-[#fce4ec] dark:from-[#131b2e] dark:to-[#090e18] flex items-center justify-center p-4 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain drop-shadow-xl"
            />
          ) : (
            <div className="w-24 h-36 border-2 border-dashed border-[#e91e8c]/30 dark:border-[#c9a84c]/30 rounded-lg flex items-center justify-center text-xs font-cinzel text-gray-400">
              No Image
            </div>
          )}

          {/* Quick View Overlay Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal?.(product);
            }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/90 dark:bg-[#0a0f1a]/90 text-[#e91e8c] dark:text-[#c9a84c] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:scale-110"
            aria-label="Quick view product"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <h3
            onClick={() => onOpenModal?.(product)}
            className="font-cinzel text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#e91e8c] dark:group-hover:text-[#c9a84c] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="font-playfair italic text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {product.description || "An enchanting blend crafted for true connoisseurs."}
          </p>
        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className="mt-6 pt-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 flex items-center justify-between">
        <div>
          <p className="font-inter text-xs text-gray-500 uppercase tracking-wider">Price</p>
          <p className="font-inter font-bold text-lg text-[#e91e8c] dark:text-[#c9a84c]">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => addItem(product)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity shadow-md cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}
