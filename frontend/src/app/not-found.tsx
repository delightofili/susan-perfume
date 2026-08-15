import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-white dark:bg-[#070b14]">
      <div className="text-center space-y-8 max-w-lg">
        {/* Decorative orbs */}
        <div className="relative flex items-center justify-center h-40">
          <div className="absolute w-52 h-52 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 blur-3xl animate-orb-drift" />
          <div className="relative z-10 font-cinzel text-[96px] font-extrabold leading-none gold-text select-none">
            404
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
            <h1 className="font-cinzel text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              Page Not Found
            </h1>
            <Sparkles className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
          </div>
          <p className="font-playfair italic text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            The scent trail has led you astray. This page does not exist in our atelier.
          </p>
        </div>

        {/* Gold divider */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#e91e8c] dark:to-[#c9a84c]" />
          <div className="w-2 h-2 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] shadow-[0_0_8px_#e91e8c] dark:shadow-[0_0_8px_#c9a84c]" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#e91e8c] dark:to-[#c9a84c]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 font-cinzel text-xs tracking-widest uppercase text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/5 dark:hover:bg-[#c9a84c]/5 transition-colors"
          >
            Browse Perfumes
          </Link>
        </div>
      </div>
    </div>
  );
}
