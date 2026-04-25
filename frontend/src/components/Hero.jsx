import { Link } from "react-router";
import PerfumeBottle from "./PerfumeBottle";
import { useEffect } from "react";

// Reusable IntersectionObserver hook for scroll reveals
function useScrollReveal() {
  useEffect(() => {
    const selectors = [
      "[data-reveal]",
      "[data-reveal-left]",
      "[data-reveal-right]",
      "[data-reveal-scale]",
    ];
    const elements = document.querySelectorAll(selectors.join(", "));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Hero() {
  useScrollReveal();

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      {/* ── Backgrounds ── */}

      {/* dark mode */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]"
      />

      {/* light mode */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#fcd6eb_0%,#fdf2f8_45%,#fff8f0_100%)]"
      />

      {/* gold orb top-right — animated drift */}
      <div
        className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full pointer-events-none animate-orb-drift
        bg-[radial-gradient(circle,rgba(201,168,76,0.20)_0%,transparent_70%)]"
      />

      {/* pink orb bottom-left — animated drift reverse */}
      <div
        className="absolute bottom-0 left-1/4 w-[340px] h-[340px] rounded-full pointer-events-none animate-orb-drift-reverse
        bg-[radial-gradient(circle,rgba(233,30,140,0.18)_0%,transparent_70%)]"
      />

      {/* extra pink orb top-left — light mode only */}
      <div
        className="absolute -top-10 left-10 w-[200px] h-[200px] rounded-full pointer-events-none animate-float-slow opacity-100 dark:opacity-0
        bg-[radial-gradient(circle,rgba(233,30,140,0.12)_0%,transparent_70%)]"
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 min-h-[90vh] flex items-center">
        <div
          className="px-6 md:px-16 w-full max-w-7xl mx-auto py-20
          flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10"
        >
          {/* ── LEFT: Text ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5" data-reveal="1">
              <span className="block w-8 h-px bg-pink-blush dark:bg-[#c9a84c]" />
              <span className="font-cinzel text-pink-blush dark:text-[#c9a84c] text-[11px] tracking-[4px] uppercase">
                New Collection 2026
              </span>
            </div>

            {/* Headline */}
            <p
              data-reveal="2"
              className="font-playfair italic text-4xl md:text-5xl lg:text-6xl leading-tight mb-2
              text-pink-blush dark:text-white/90"
            >
              Discover the Essence
            </p>
            <p
              data-reveal="3"
              className="font-playfair font-bold text-5xl md:text-7xl lg:text-8xl leading-tight
              text-[#1a0a10] dark:text-white"
            >
              of Elegance
            </p>

            {/* Body */}
            <p
              data-reveal="4"
              className="mt-5 text-base md:text-lg font-inter leading-relaxed max-w-md
              text-[#7a4a5a] dark:text-white/55"
            >
              Exquisite fragrances that captivate the senses and leave a lasting
              impression on every soul you encounter.
            </p>

            {/* CTA Buttons */}
            <div
              data-reveal="5"
              className="mt-8 flex items-center gap-4 flex-wrap justify-center lg:justify-start"
            >
              <Link
                to="/shop"
                className="relative dark:bg-(image:--luxury-gold-gradient) bg-(image:--pinky) rounded-sm
                  dark:text-primary-charcoal-black px-8 py-3.5 text-pure-white
                  font-bold font-inter text-sm tracking-widest uppercase
                  animate-pink-glow dark:animate-none gold-hover transition hover:cursor-pointer
                  hover:opacity-90 hover:scale-105 active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="border-2 border-pink-blush text-pink-blush dark:border-[#c9a84c]/50 dark:text-[#c9a84c]
                  font-cinzel text-[11px] tracking-[2px] uppercase
                  px-7 py-3.5 rounded-sm hover:bg-pink-blush hover:text-white dark:hover:bg-[#c9a84c]/10
                  transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* ── CENTER: Bottle — large screens only ── */}
          <div className="hidden lg:flex items-end justify-center flex-1 self-end animate-float">
            <PerfumeBottle className="w-[240px] xl:w-[280px] drop-shadow-2xl" />
          </div>

          {/* ── RIGHT: Floating Cards ── */}
          <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-auto lg:min-w-[220px]">
            {/* ⭐ Review Card */}
            <div
              data-reveal-right="1"
              className="flex-1 lg:flex-none backdrop-blur-md rounded-xl p-4 flex flex-col gap-1 shadow-xl
              bg-white/70 dark:bg-white/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30
              hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-[#c9a84c]"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p
                className="font-playfair text-3xl font-bold leading-none
                text-[#1a0a10] dark:text-white"
              >
                4.9
              </p>
              <p
                className="font-inter text-[11px] tracking-wide
                text-[#7a4a5a] dark:text-white/50"
              >
                2,400+ Verified Reviews
              </p>
            </div>

            {/* 🏆 Best Seller Card */}
            <div
              data-reveal-right="2"
              className="flex-1 lg:flex-none backdrop-blur-md rounded-xl p-4 shadow-xl
              bg-white/70 dark:bg-white/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30
              hover:-translate-y-1 transition-transform duration-300"
            >
              <p className="font-cinzel text-[#e91e8c]/70 dark:text-[#c9a84c]/70 text-[9px] tracking-[3px] uppercase mb-1">
                Best Seller
              </p>
              <p
                className="font-playfair text-xl font-semibold
                text-[#1a0a10] dark:text-white"
              >
                Rose Noir
              </p>
              <p className="font-inter text-[#c9a84c] text-lg font-bold mt-1">
                ₦18,000
              </p>
              <p
                className="font-inter text-[10px] mt-1 line-through
                text-[#7a4a5a] dark:text-white/40"
              >
                ₦22,500
              </p>
            </div>

            {/* 🔴 Just Dropped — desktop only */}
            <div
              data-reveal-right="3"
              className="hidden lg:flex backdrop-blur-md rounded-xl p-4 items-center gap-3 shadow-xl
              bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/25 dark:border-[#c9a84c]/30
              hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] animate-pulse shrink-0" />
              <div>
                <p className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-[10px] tracking-[2px] uppercase">
                  Just Dropped
                </p>
                <p className="font-playfair text-sm mt-[2px] text-[#1a0a10] dark:text-white">
                  Mystique Oud · ₦12,000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MarqueeStrip />
    </section>
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
    <div className="w-full overflow-hidden bg-[#e91e8c] dark:bg-[#c9a84c] py-[10px] z-40 relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 font-cinzel text-[11px] tracking-[3px] uppercase text-white dark:text-[#0a0f1a] mx-0"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-white/60 dark:bg-[#0a0f1a]/60 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Hero;
