"use client";

import React from "react";

export function GoldDividerDot() {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#e91e8c] dark:to-[#c9a84c]" />
      <div className="w-2 h-2 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] shadow-[0_0_8px_#e91e8c] dark:shadow-[0_0_8px_#c9a84c]" />
      <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#e91e8c] dark:to-[#c9a84c]" />
    </div>
  );
}

export function SectionDivider({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center my-10 px-4">
      {title && (
        <h2 className="font-cinzel text-2xl md:text-3xl font-bold tracking-widest text-[#e91e8c] dark:text-[#c9a84c] uppercase">
          {title}
        </h2>
      )}
      <GoldDividerDot />
      {subtitle && (
        <p className="font-playfair italic text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
