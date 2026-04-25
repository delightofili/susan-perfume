// src/components/NavBar.jsx
import { Link } from "react-router";
import { ShoppingCart, X, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../hook/useCart";

// ─── Diamond Logo Mark ────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0 group">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#e91e8c] dark:border-[#c9a84c]/60 group-hover:border-[#d81b8a] dark:group-hover:border-[#c9a84c] transition-colors duration-300" />
        <div
          className="w-4 h-4 bg-[#e91e8c] dark:bg-[#c9a84c] rotate-45 shrink-0 transition-transform duration-300 group-hover:rotate-[90deg]"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />
      </div>
      <div className="leading-none">
        <p className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-[15px] tracking-[3px] uppercase leading-tight">
          Susan
        </p>
        <p className="font-cinzel text-[#e91e8c]/60 dark:text-[#c9a84c] text-[8px] tracking-[3.5px] uppercase mt-[2px]">
          Luxury Perfume
        </p>
      </div>
    </Link>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
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
  ];

  return (
    <>
      {/* ── Main Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-17 bg-white/90 dark:bg-[#0a0f1a]/95 backdrop-blur-md shadow-sm border-b border-[#e91e8c]/15 dark:border-[#c9a84c]/10">
        <LogoMark />

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-[13px] tracking-[2px] uppercase
                  hover:text-[#c2185b] dark:hover:text-white transition-colors duration-200
                  relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px]
                  after:bg-[#e91e8c] dark:after:bg-[#c9a84c] after:transition-all after:duration-300
                  hover:after:w-full"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-5">
          {/* Cart icon with badge */}
          <Link to="/cart" className="relative group">
            <ShoppingCart className="h-5 w-5 text-[#e91e8c] dark:text-[#c9a84c] group-hover:scale-110 transition-transform duration-200" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-[10px] font-bold font-inter flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-1 rounded-md transition-colors text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-7 w-7" />
        </button>
      </nav>

      <div className="h-17" />

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-60 md:hidden bg-black/55 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-70 w-72 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "#fff8fb",
          borderLeft: "1px solid rgba(233, 30, 140, 0.15)",
          minHeight: "100dvh",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(233, 30, 140, 0.12)" }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "18px",
              letterSpacing: "3px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#e91e8c",
              opacity: 0.7,
            }}
          >
            Menu
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            style={{ color: "#e91e8c", padding: "4px", cursor: "pointer" }}
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col flex-1 px-4 py-6 gap-1">
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setIsOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "Cinzel, serif",
                  fontSize: "13px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "#e91e8c",
                  padding: "12px",
                  borderRadius: "6px",
                  borderBottom: "1px solid rgba(233,30,140,0.08)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e91e8c";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#e91e8c";
                }}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Cart with badge */}
          <li className="mt-3">
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Cinzel, serif",
                fontSize: "13px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#e91e8c",
                padding: "12px",
                borderRadius: "6px",
                borderBottom: "1px solid rgba(233,30,140,0.08)",
                transition: "all 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e91e8c";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#e91e8c";
              }}
            >
              <ShoppingCart size={15} />
              Cart
              {totalItems > 0 && (
                <span className="ml-auto min-w-[20px] h-[20px] px-1 rounded-full bg-[#e91e8c] text-white text-[10px] font-bold font-inter flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>

        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(233,30,140,0.12)",
          }}
        >
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#e91e8c",
              opacity: 0.5,
              marginBottom: "10px",
            }}
          >
            Appearance
          </p>
          <ThemeToggle />
        </div>
      </div>

      <MarqueeStrip />
    </>
  );
}

// ─── Marquee Strip ────────────────────────────────────────────────────────────
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

export default NavBar;
