import { Link } from "react-router";
import PerfumeBottle from "./PerfumeBottle";
import { useEffect } from "react";

// ─── Why Choose Us features ───────────────────────────────────────────────────
const features = [
  {
    icon: "🌸",
    title: "Rare Ingredients",
    desc: "Sourced from the finest gardens and distilleries worldwide",
  },
  {
    icon: "⏳",
    title: "Long Lasting",
    desc: "Formulated to stay vibrant for 12+ hours on your skin",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Same-day dispatch across Owerri, next-day nationwide",
  },
  {
    icon: "🎁",
    title: "Luxury Packaging",
    desc: "Every order arrives in our signature gold-ribbon gift box",
  },
];

function About() {
  // Scroll reveal observer
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

  return (
    <>
      {/* ══════════════════════════════════════════
          ABOUT SECTION
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-[#0a0f1a] py-24 px-6 md:px-16">
        {/* Background orbs */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none animate-orb-drift
          bg-[radial-gradient(circle,_rgba(233,30,140,0.10)_0%,_transparent_70%)]"
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none animate-orb-drift-reverse
          bg-[radial-gradient(circle,_rgba(201,168,76,0.07)_0%,_transparent_70%)]"
        />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* LEFT — Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:basis-1/2">
            {/* eyebrow */}
            <div data-reveal-left="1" className="flex items-center gap-3 mb-5">
              <span className="block w-8 h-[1px] bg-[#c9a84c]" />
              <span className="font-cinzel text-[#c9a84c] text-[11px] tracking-[4px] uppercase">
                Our Heritage
              </span>
            </div>

            <h2
              data-reveal-left="2"
              className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6"
            >
              Welcome to{" "}
              <span className="gold-text">Susan Luxury Perfume</span>
            </h2>

            <p
              data-reveal-left="3"
              className="text-white/55 font-inter text-base md:text-lg leading-relaxed max-w-md mb-8"
            >
              At Susan Luxury Perfume, we craft timeless fragrances designed to
              elevate your presence and leave a lasting impression. Each scent
              is carefully blended to complement your style, confidence, and
              individuality.
            </p>

            {/* Stats row */}
            <div data-reveal-left="4" className="flex gap-10 mb-10">
              {[
                ["12+", "Years crafting"],
                ["80+", "Fragrances"],
                ["50K+", "Happy clients"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-playfair text-[#c9a84c] text-3xl font-light">
                    {num}
                  </p>
                  <p className="font-inter text-white/40 text-[11px] tracking-wide mt-1 uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              data-reveal-left="5"
              to="/about"
              className="inline-block bg-(image:--luxury-gold-gradient) gold-hover rounded-sm
                text-primary-charcoal-black px-7 py-3.5
                font-bold font-inter text-sm tracking-widest uppercase
                transition hover:cursor-pointer hover:scale-105 active:scale-95"
            >
              Learn More
            </Link>
          </div>

          {/* RIGHT — Bottle + image grid */}
          <div
            data-reveal-right="1"
            className="lg:basis-1/2 w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* 2x2 colour block grid */}
              <div className="grid grid-cols-2 gap-3 h-[380px]">
                <div className="rounded-lg bg-gradient-to-br from-[#e91e8c]/30 to-[#e91e8c]/10 flex items-end p-4 hover:from-[#e91e8c]/50 hover:to-[#e91e8c]/20 transition-all duration-500">
                  <span className="font-cinzel text-[#c9a84c]/60 text-[10px] tracking-[2px] uppercase">
                    Rose Noir
                  </span>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#c9a84c]/25 to-[#c9a84c]/08 flex items-end p-4 mt-6 hover:from-[#c9a84c]/40 transition-all duration-500">
                  <span className="font-cinzel text-[#c9a84c]/60 text-[10px] tracking-[2px] uppercase">
                    Amber Dusk
                  </span>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#c9a84c]/15 to-[#e91e8c]/20 flex items-end p-4 -mt-6 hover:to-[#e91e8c]/40 transition-all duration-500">
                  <span className="font-cinzel text-[#c9a84c]/60 text-[10px] tracking-[2px] uppercase">
                    Mystic Oud
                  </span>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#e91e8c]/20 to-[#c9a84c]/15 flex items-end p-4 hover:from-[#e91e8c]/40 transition-all duration-500">
                  <span className="font-cinzel text-[#c9a84c]/60 text-[10px] tracking-[2px] uppercase">
                    Velvet Bloom
                  </span>
                </div>
              </div>

              {/* Bottle overlaid in center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-float">
                <PerfumeBottle className="w-[160px] drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════ */}
      <section className="w-full bg-[#fff5fb] dark:bg-[#0d0d14] py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div data-reveal className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="block w-10 h-[1px] bg-[#c9a84c]/50" />
              <span className="font-cinzel text-[#c9a84c] text-[11px] tracking-[4px] uppercase">
                Why choose us
              </span>
              <span className="block w-10 h-[1px] bg-[#c9a84c]/50" />
            </div>
            <h2
              className="font-playfair text-3xl md:text-4xl font-light
              text-[#1a0a10] dark:text-white"
            >
              The Susan{" "}
              <em className="text-[#e91e8c] dark:text-[#c9a84c] not-italic font-semibold">
                Promise
              </em>
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                data-reveal={String(i + 1)}
                className="flex flex-col gap-4 p-6 rounded-xl
                  bg-white dark:bg-white/5
                  border border-[#e91e8c]/15 dark:border-[#c9a84c]/10
                  hover:border-[#e91e8c]/40 dark:hover:border-[#c9a84c]/40
                  hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e91e8c]/10
                  transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  bg-[#e91e8c]/08 dark:bg-[#c9a84c]/08
                  border border-[#e91e8c]/20 dark:border-[#c9a84c]/15"
                >
                  {icon}
                </div>

                <div>
                  <p className="font-cinzel text-[#1a0a10] dark:text-white text-[13px] tracking-wide mb-2">
                    {title}
                  </p>
                  <p className="font-inter text-[#7a4a5a] dark:text-white/45 text-[12px] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
