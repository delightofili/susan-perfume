"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import PerfumeBottle from "./PerfumeBottle.js";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff8fb] via-white to-[#fff0f6] dark:from-[#080d1a] dark:via-[#0b1326] dark:to-[#070b14] transition-colors duration-500 py-16 px-6 md:px-12">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#e91e8c]/15 dark:bg-[#c9a84c]/10 blur-3xl pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pink-400/10 dark:bg-[#c9a84c]/15 blur-3xl pointer-events-none animate-orb-drift-reverse" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Copy */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30">
            <Sparkles className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
            <span className="font-cinzel text-xs tracking-[2px] uppercase font-bold text-[#e91e8c] dark:text-[#c9a84c]">
              Haute Parfumerie Royale
            </span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight text-gray-900 dark:text-white">
            Essence of <br />
            <span className="gold-text">Timeless Luxury</span>
          </h1>

          <p className="font-playfair italic text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Immerse yourself in hand-crafted olfactory masterpieces, blended with rare rare botanicals and precious oud from ancient groves.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-sm tracking-[2px] uppercase shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pink-glow dark:animate-gold-glow"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#e91e8c]/40 dark:border-[#c9a84c]/40 font-cinzel text-sm tracking-[2px] uppercase text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Perfume Bottle */}
        <div className="flex items-center justify-center relative">
          <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
            <PerfumeBottle className="w-full h-full object-contain animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}
