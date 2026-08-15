"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface SortByProps {
  sortBy: string;
  onSortChange: (val: string) => void;
}

export default function SortBy({ sortBy, onSortChange }: SortByProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
      <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hidden sm:inline">
        Sort By:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 rounded-xl bg-white dark:bg-[#0f172a] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 font-inter text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] cursor-pointer shadow-sm"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>
    </div>
  );
}
