"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fff8fb] dark:bg-[#070b12] border-t border-[#e91e8c]/15 dark:border-[#c9a84c]/15 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#e91e8c] dark:bg-[#c9a84c] rotate-45" />
              <span className="font-cinzel text-xl tracking-[3px] font-bold text-[#e91e8c] dark:text-[#c9a84c] uppercase">
                Susan
              </span>
            </div>
            <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Crafting extraordinary olfactory experiences with pure, hand-picked ingredients for royalty and connoisseurs worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-cinzel text-sm tracking-[2px] font-bold text-[#e91e8c] dark:text-[#c9a84c] uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2 font-inter text-xs text-gray-600 dark:text-gray-400">
              <li><Link href="/shop" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">All Perfumes</Link></li>
              <li><Link href="/shop" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Bestsellers</Link></li>
              <li><Link href="/about" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Our Legacy</Link></li>
              <li><Link href="/contact" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Contact Atelier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel text-sm tracking-[2px] font-bold text-[#e91e8c] dark:text-[#c9a84c] uppercase mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2 font-inter text-xs text-gray-600 dark:text-gray-400">
              <li><Link href="/track-order" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Track Order</Link></li>
              <li><Link href="/cart" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin/login" className="hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel text-sm tracking-[2px] font-bold text-[#e91e8c] dark:text-[#c9a84c] uppercase mb-4">
              Atelier Newsletter
            </h4>
            <p className="font-inter text-xs text-gray-600 dark:text-gray-400 mb-3">
              Subscribe to receive private invitations to new scent reveals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#121927] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-md focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
              />
              <button className="px-4 py-2 text-xs font-cinzel tracking-wider uppercase font-bold text-white bg-[#e91e8c] dark:bg-[#c9a84c] dark:text-[#0a0f1a] rounded-md hover:opacity-90 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-inter text-gray-500 dark:text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Susan Luxury Perfumes. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
