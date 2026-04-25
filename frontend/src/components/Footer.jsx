import { Link } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

function FooterLogo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 rounded-full border border-[#c9a84c]/40 group-hover:border-[#c9a84c] transition-colors duration-300" />
        <div
          className="w-4 h-4 bg-[#c9a84c] rotate-45 shrink-0"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />
      </div>
      <div className="leading-none">
        <p className="font-cinzel text-[#c9a84c] text-[14px] tracking-[3px] uppercase leading-tight">
          Susan
        </p>
        <p className="font-cinzel text-[#c9a84c]/50 text-[8px] tracking-[3px] uppercase mt-[2px]">
          Luxury Perfume
        </p>
      </div>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="relative w-full bg-[#050208] overflow-hidden">
      {/* subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px]
        bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent"
      />

      {/* background orbs */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none
        bg-[radial-gradient(circle,_rgba(194,24,91,0.05)_0%,_transparent_70%)]"
      />
      <div
        className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none
        bg-[radial-gradient(circle,_rgba(201,168,76,0.04)_0%,_transparent_70%)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-8">
        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <FooterLogo />
            <p className="font-inter text-white/35 text-[13px] leading-relaxed max-w-[220px]">
              Crafting timeless fragrances that elevate your presence. Every
              bottle holds a story of elegance.
            </p>
            {/* Social row */}
            <div className="flex gap-3 mt-1">
              {["in", "ig", "tw", "wa"].map((s) => (
                <button
                  key={s}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                    border border-[#c9a84c]/20 text-[#c9a84c]/50
                    hover:border-[#c9a84c]/60 hover:text-[#c9a84c]
                    font-inter text-[10px] uppercase tracking-wide
                    transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="font-cinzel text-[#c9a84c] text-[12px] tracking-[3px] uppercase mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map(({ label, to }) => (
                <li key={label} className="flex items-center gap-2">
                  <IoIosArrowForward className="text-[#c9a84c] text-[11px] shrink-0" />
                  <Link
                    to={to}
                    className="font-inter text-white/40 text-[13px] hover:text-[#c9a84c] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 className="font-cinzel text-[#c9a84c] text-[12px] tracking-[3px] uppercase mb-5">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#c9a84c] text-[13px] shrink-0" />
                <a
                  href="tel:+234959869594"
                  className="font-inter text-white/40 text-[13px] hover:text-[#c9a84c] transition-colors"
                >
                  +234 959 869 594
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-[#c9a84c] text-[14px] shrink-0" />
                <a
                  href="https://wa.me/234959869594"
                  className="font-inter text-white/40 text-[13px] hover:text-[#c9a84c] transition-colors"
                >
                  Order via WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <IoLocationSharp className="text-[#c9a84c] text-[14px] shrink-0" />
                <p className="font-inter text-white/40 text-[13px]">
                  Owerri, Nigeria
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent mb-6" />

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-inter text-white/20 text-[12px] text-center md:text-left">
            © 2026 Susan Luxury Perfume. All rights reserved.
          </p>
          <div
            className="font-cinzel text-[#c9a84c]/30 text-[10px] tracking-[2px] uppercase
            border border-[#c9a84c]/10 px-3 py-1 rounded-sm"
          >
            Made with ♡ in Nigeria
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
