"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.js";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-14 h-7 p-1 rounded-full bg-pink-100 dark:bg-[#1a2333] border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 transition-colors duration-300 shadow-inner cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 text-amber-500 z-10 ml-0.5" />
      <Moon className="w-4 h-4 text-[#c9a84c] z-10 mr-0.5" />
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-[#c9a84c] shadow-md transition-transform duration-300 ${
          darkMode ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}
