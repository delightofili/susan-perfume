"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Product } from "../types/index.js";
import { useCart } from "../context/CartContext.js";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const handleAddToCart = async () => {
    for (let i = 0; i < qty; i++) {
      await addItem(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeInPage">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1324] rounded-3xl overflow-hidden shadow-2xl border border-[#e91e8c]/20 dark:border-[#c9a84c]/30 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-[#1a2336] text-gray-700 dark:text-gray-300 hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 p-8 bg-gradient-to-b from-[#fff8fb] to-[#fce4ec] dark:from-[#11192b] dark:to-[#070c17] flex items-center justify-center relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="w-32 h-48 border-2 border-dashed border-[#e91e8c]/30 dark:border-[#c9a84c]/30 rounded-xl flex items-center justify-center font-cinzel text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto custom-scroll">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]">
                {product.category || "Luxury"}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-inter font-bold text-gray-700 dark:text-gray-300">4.9 (128 reviews)</span>
              </div>
            </div>

            <h2 className="font-cinzel text-2xl font-extrabold text-gray-900 dark:text-white">
              {product.name}
            </h2>

            <p className="font-inter font-bold text-2xl text-[#e91e8c] dark:text-[#c9a84c]">
              ${Number(product.price).toFixed(2)}
            </p>

            <p className="font-playfair italic text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description || "An exquisite composition of notes hand-blended for timeless elegance."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-gray-500">
                Quantity:
              </span>
              <div className="flex items-center border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-gray-100 dark:bg-[#162032] text-gray-800 dark:text-gray-200 hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 font-inter font-bold text-sm text-gray-800 dark:text-gray-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-1 bg-gray-100 dark:bg-[#162032] text-gray-800 dark:text-gray-200 hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-inter text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Bag • ${(Number(product.price) * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
