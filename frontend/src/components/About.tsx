"use client";

import React from "react";
import { Sparkles, Crown, Feather, Award } from "lucide-react";
import { SectionDivider } from "./SectionDivider.js";

export default function About() {
  return (
    <section className="py-20 px-6 md:px-12 bg-white dark:bg-[#070b14] transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-16">
        <SectionDivider
          title="The House of Susan"
          subtitle="A heritage of crafting unrepeatable, royal scents since inception."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-cinzel text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Where Pure Chemistry Meets <span className="gold-text">High Artistry</span>
            </h3>
            <p className="font-playfair italic text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              Every bottle of Susan Perfume is born in our private master laboratory. We source rare Damascus rose petals, wild Taif jasmine, and aged Cambodian oud oil to synthesize fragrances that linger like fond memories.
            </p>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Our philosophy combines old-world French perfumery traditions with Eastern botanical wisdom, creating multi-layered notes that evolve uniquely on each wearer’s skin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#fff8fb] dark:bg-[#0f172a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 text-center space-y-3">
              <Crown className="w-8 h-8 mx-auto text-[#e91e8c] dark:text-[#c9a84c]" />
              <h4 className="font-cinzel font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                Royal Ingredients
              </h4>
              <p className="font-inter text-xs text-gray-500">Hand-picked rare extracts</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fff8fb] dark:bg-[#0f172a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 text-center space-y-3">
              <Feather className="w-8 h-8 mx-auto text-[#e91e8c] dark:text-[#c9a84c]" />
              <h4 className="font-cinzel font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                Artisanal Distillation
              </h4>
              <p className="font-inter text-xs text-gray-500">Slow-matured elixir batches</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fff8fb] dark:bg-[#0f172a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 text-center space-y-3">
              <Award className="w-8 h-8 mx-auto text-[#e91e8c] dark:text-[#c9a84c]" />
              <h4 className="font-cinzel font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                Sustainable Luxury
              </h4>
              <p className="font-inter text-xs text-gray-500">100% cruelty-free & ethical</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fff8fb] dark:bg-[#0f172a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 text-center space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-[#e91e8c] dark:text-[#c9a84c]" />
              <h4 className="font-cinzel font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                Signature Sillage
              </h4>
              <p className="font-inter text-xs text-gray-500">Long-lasting 24h projection</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
