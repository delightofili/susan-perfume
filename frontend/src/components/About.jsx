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
      { threshold: 0.12 },
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
              Welcome to <span className="gold-text">Susan Luxury Perfume</span>
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
                ["5+", "Years crafting"],
                ["80+", "Fragrances"],
                ["50+", "Happy clients"],
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
          </div>

          {/* RIGHT — Layered Visual Showcase */}
          <div
            data-reveal-right="1"
            className="lg:basis-1/2 w-full flex items-center justify-center"
          >
            <div className="relative w-[340px] h-[460px] sm:w-[390px] sm:h-[510px] lg:w-[460px] lg:h-[580px]">
              {/* ── Layer 1 — back-most, rotated left, gold zigzag ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: "rotate(-9deg) translate(-22px, 18px)",
                  background:
                    "linear-gradient(140deg, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.06) 55%, transparent 100%)",
                  clipPath:
                    "polygon(0% 7%, 7% 0%, 93% 0%, 100% 7%, 100% 87%, 93% 100%, 7% 100%, 0% 87%)",
                  borderRadius: "2.5rem",
                }}
              />

              {/* ── Layer 2 — mid, rotated right, pink ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: "rotate(6deg) translate(18px, 12px)",
                  background:
                    "linear-gradient(220deg, rgba(233,30,140,0.28) 0%, rgba(233,30,140,0.08) 50%, transparent 100%)",
                  clipPath:
                    "polygon(5% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%, 0% 5%)",
                  borderRadius: "2rem",
                }}
              />

              {/* ── Layer 3 — slight tilt, gold border accent ── */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: "rotate(-3deg) translate(-8px, 6px) scale(0.96)",
                  border: "1.5px solid rgba(201,168,76,0.25)",
                  clipPath:
                    "polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)",
                  borderRadius: "1.8rem",
                }}
              />

              {/* ── Main card — top layer ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: "2rem",
                  clipPath:
                    "polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)",
                  background:
                    "linear-gradient(160deg, #1a0410 0%, #0d0818 45%, #0a0f1a 100%)",
                  border: "1px solid rgba(201,168,76,0.15)",
                }}
              >
                {/* Inner grid background — decorative quadrant blocks */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1 opacity-80">
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(233,30,140,0.18) 0%, transparent 100%)",
                      borderRadius: "1.4rem 0.4rem 0.4rem 0.4rem",
                    }}
                  />
                  <div
                    style={{
                      background:
                        "linear-gradient(225deg, rgba(201,168,76,0.16) 0%, transparent 100%)",
                      borderRadius: "0.4rem 1.4rem 0.4rem 0.4rem",
                    }}
                  />
                  <div
                    style={{
                      background:
                        "linear-gradient(45deg, rgba(201,168,76,0.12) 0%, transparent 100%)",
                      borderRadius: "0.4rem 0.4rem 0.4rem 1.4rem",
                    }}
                  />
                  <div
                    style={{
                      background:
                        "linear-gradient(315deg, rgba(233,30,140,0.14) 0%, transparent 100%)",
                      borderRadius: "0.4rem 0.4rem 1.4rem 0.4rem",
                    }}
                  />
                </div>

                {/* Diagonal shimmer line */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "-20%",
                    left: "-10%",
                    width: "60%",
                    height: "200%",
                    transform: "rotate(25deg)",
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,168,76,0.06), transparent)",
                  }}
                />

                {/* ── Corner scent badges ── */}
                {/* Top-left */}
                <div className="absolute top-5 left-5 z-20">
                  <div className="flex flex-col gap-0.5 backdrop-blur-sm bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2">
                    <span className="font-cinzel text-[#c9a84c] text-[8px] tracking-[2px] uppercase">
                      Bestseller
                    </span>
                    <span className="font-playfair text-white text-sm font-semibold">
                      Rose Noir
                    </span>
                  </div>
                </div>
                {/* Top-right */}
                <div className="absolute top-5 right-5 z-20">
                  <div className="flex flex-col gap-0.5 backdrop-blur-sm bg-white/5 border border-[#e91e8c]/20 rounded-xl px-3 py-2 items-end">
                    <span className="font-cinzel text-[#e91e8c]/80 text-[8px] tracking-[2px] uppercase">
                      New Arrival
                    </span>
                    <span className="font-playfair text-white text-sm font-semibold">
                      Amber Dusk
                    </span>
                  </div>
                </div>
                {/* Bottom-left */}
                <div className="absolute bottom-5 left-5 z-20">
                  <div className="flex flex-col gap-0.5 backdrop-blur-sm bg-white/5 border border-[#e91e8c]/20 rounded-xl px-3 py-2">
                    <span className="font-cinzel text-[#e91e8c]/80 text-[8px] tracking-[2px] uppercase">
                      Limited
                    </span>
                    <span className="font-playfair text-white text-sm font-semibold">
                      Mystic Oud
                    </span>
                  </div>
                </div>
                {/* Bottom-right */}
                <div className="absolute bottom-5 right-5 z-20">
                  <div className="flex flex-col gap-0.5 backdrop-blur-sm bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2 items-end">
                    <span className="font-cinzel text-[#c9a84c] text-[8px] tracking-[2px] uppercase">
                      Signature
                    </span>
                    <span className="font-playfair text-white text-sm font-semibold">
                      Velvet Bloom
                    </span>
                  </div>
                </div>

                {/* Centre glow ring behind bottle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="w-52 h-52 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(233,30,140,0.10) 45%, transparent 72%)",
                      filter: "blur(8px)",
                    }}
                  />
                </div>

                {/* Outer shimmer ring */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(201,168,76,0.07) 80%, transparent 100%)",
                  }}
                />
              </div>

              {/* ── Bottle — floats on top of everything ── */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-float">
                <PerfumeBottle className="w-[180px] lg:w-[210px] drop-shadow-2xl" />
              </div>

              {/* ── Floating glow accents outside the card ── */}
              <div
                className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full pointer-events-none animate-orb-drift-reverse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(233,30,140,0.30) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-full pointer-events-none animate-float-slow"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,168,76,0.28) 0%, transparent 70%)",
                }}
              />

              {/* ── Gold divider line accent top ── */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #c9a84c, transparent)",
                }}
              />
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
