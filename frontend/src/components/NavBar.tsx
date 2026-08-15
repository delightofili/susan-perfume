"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, X, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle.js";
import { useCart } from "../context/CartContext.js";

function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0 group">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#e91e8c] dark:border-[#c9a84c]/60 group-hover:border-[#d81b8a] dark:group-hover:border-[#c9a84c] transition-colors duration-300" />
        <div
          className="w-4 h-4 bg-[#e91e8c] dark:bg-[#c9a84c] rotate-45 shrink-0 transition-transform duration-300 group-hover:rotate-[90deg]"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />
      </div>
      <div className="leading-none">
        <p className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-[15px] tracking-[3px] uppercase leading-tight font-bold">
          Susan
        </p>
        <p className="font-cinzel text-[#e91e8c]/60 dark:text-[#c9a84c]/80 text-[8px] tracking-[3.5px] uppercase mt-[2px]">
          Luxury Perfume
        </p>
      </div>
    </Link>
  );
}

const marqueeItems = [
  "Rose Noir",
  "Mystique Oud",
  "Velvet Bloom",
  "Amber Dusk",
  "Saffron Kiss",
  "Cedarwood Luxe",
  "Cherry Blossom",
  "Oud Royale",
];

function MarqueeStrip() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="w-full overflow-hidden bg-[#e91e8c] dark:bg-[#c9a84c] py-2.5 z-40 relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 font-cinzel text-[11px] tracking-[3px] uppercase text-white dark:text-[#0a0f1a] mx-0"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-white/50 dark:bg-[#0a0f1a]/50 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Track Order", to: "/track-order" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-white/90 dark:bg-[#0a0f1a]/95 backdrop-blur-md shadow-sm border-b border-[#e91e8c]/15 dark:border-[#c9a84c]/10">
        <LogoMark />

        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                href={to}
                className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-[13px] tracking-[2px] uppercase
                  hover:text-[#c2185b] dark:hover:text-white transition-colors duration-200
                  relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px]
                  after:bg-[#e91e8c] dark:after:bg-[#c9a84c] after:transition-all after:duration-300
                  hover:after:w-full font-semibold"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Link href="/cart" className="relative group p-1">
            <ShoppingCart className="h-5.5 w-5.5 text-[#e91e8c] dark:text-[#c9a84c] group-hover:scale-110 transition-transform duration-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-[10px] font-bold font-inter flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-1 rounded-md transition-colors text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </nav>

      <div className="h-16" />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/55 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 w-72 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } bg-[#fff8fb] dark:bg-[#0a0804] border-l border-[#e91e8c]/15 dark:border-[#c9a84c]/15 min-h-[100dvh]`}
      >
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-[#e91e8c]/12 dark:border-[#c9a84c]/12"
        >
          <span className="font-cinzel text-[18px] tracking-[3px] font-bold uppercase text-[#e91e8c]/70 dark:text-[#c9a84c]/70">
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-[#e91e8c] dark:text-[#c9a84c] p-1 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col flex-1 px-4 py-6 gap-1">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                href={to}
                onClick={() => setIsOpen(false)}
                className="block font-cinzel text-[13px] tracking-[2.5px] uppercase text-[#e91e8c] dark:text-[#c9a84c] p-3 rounded-md border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/20 transition-all hover:bg-[#e91e8c] dark:hover:bg-[#c9a84c] hover:text-white dark:hover:text-black font-semibold"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-5 border-t border-[#e91e8c]/12 dark:border-[#c9a84c]/12 sm:hidden mb-6">
          <p className="font-cinzel text-[9px] tracking-[2px] uppercase text-[#e91e8c]/50 dark:text-[#c9a84c]/50 mb-3">
            Appearance
          </p>
          <ThemeToggle />
        </div>
      </div>

      <MarqueeStrip />
    </>
  );
}
