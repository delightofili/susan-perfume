import { Link } from "react-router";
import { useEffect, useState, useCallback } from "react";

// ─── Scroll Reveal ─────────────────────────────────────────────────────────────
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
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Slide data — replace src with real image paths when ready ─────────────────
const slides = [
  {
    id: 1,
    src: "/images/RosePerf.png",
    label: "Rose Noir",
    tag: "Bestseller",
  },
  {
    id: 2,
    src: "/images/OudPerf.png",
    label: "Mystique Oud",
    tag: "New Arrival",
  },
];

// ─── Hero Image Slider ──────────────────────────────────────────────────────────
function HeroImageSlider() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (idx) => {
      if (idx === active) return;
      setFading(true);
      setTimeout(() => {
        setActive(idx);
        setFading(false);
      }, 350);
    },
    [active],
  );

  // Auto-slide every 4 seconds
  useEffect(() => {
    const t = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [active, goTo]);

  const slide = slides[active];

  return (
    <div
      data-reveal-right="1"
      className="relative flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end"
    >
      {/* ── Outer wrapper — controls overall size ── */}
      <div className="relative w-[300px] h-[400px] sm:w-[340px] sm:h-[450px] lg:w-[400px] lg:h-[520px] xl:w-[440px] xl:h-[570px]">
        {/* ── Decorative Layer 1 — back-most, rotated left ── */}
        <div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{
            transform: "rotate(-8deg) translate(-18px, 14px)",
            background:
              "linear-gradient(135deg, rgba(233,30,140,0.22) 0%, rgba(233,30,140,0.08) 60%, transparent 100%)",
            clipPath:
              "polygon(0% 8%, 6% 0%, 94% 0%, 100% 6%, 100% 88%, 94% 100%, 6% 100%, 0% 92%)",
          }}
        >
          {/* dark mode overlay */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 rounded-[2.5rem]"
            style={{
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.07) 60%, transparent 100%)",
              clipPath:
                "polygon(0% 8%, 6% 0%, 94% 0%, 100% 6%, 100% 88%, 94% 100%, 6% 100%, 0% 92%)",
            }}
          />
        </div>

        {/* ── Decorative Layer 2 — middle, rotated right ── */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            transform: "rotate(5deg) translate(14px, 10px)",
            background:
              "linear-gradient(225deg, rgba(233,30,140,0.30) 0%, rgba(255,110,199,0.12) 55%, transparent 100%)",
            clipPath:
              "polygon(4% 0%, 100% 0%, 100% 96%, 96% 100%, 0% 100%, 0% 4%)",
          }}
        >
          {/* dark mode overlay */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 rounded-[2rem]"
            style={{
              background:
                "linear-gradient(225deg, rgba(201,168,76,0.28) 0%, rgba(230,199,106,0.10) 55%, transparent 100%)",
              clipPath:
                "polygon(4% 0%, 100% 0%, 100% 96%, 96% 100%, 0% 100%, 0% 4%)",
            }}
          />
        </div>

        {/* ── Main image card — top layer ── */}
        <div
          className="absolute inset-0 overflow-hidden shadow-2xl border border-white/20 dark:border-[#c9a84c]/20"
          style={{
            borderRadius: "2rem",
            clipPath:
              "polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)",
          }}
        >
          {/* Gradient backdrop (always visible, image sits on top) */}
          <div
            className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(160deg, #fcd6eb 0%, #fdf2f8 40%, #ffe4f5 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(160deg, #1a0410 0%, #0d0a1a 50%, #0a0f1a 100%)",
            }}
          />

          {/* ── Slide image / placeholder ── */}
          <div
            className="absolute inset-0 transition-all duration-350"
            style={{
              opacity: fading ? 0 : 1,
              transform: fading ? "scale(1.04)" : "scale(1)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {slide.src ? (
              <img
                src={slide.src}
                alt={slide.label}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              /* ── Placeholder shown until real image is added ── */
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-8">
                {/* Silhouette SVG placeholder */}
                <svg
                  viewBox="0 0 200 280"
                  className="w-40 h-auto opacity-20 dark:opacity-10"
                  fill="currentColor"
                >
                  {/* Head */}
                  <ellipse
                    cx="100"
                    cy="45"
                    rx="30"
                    ry="34"
                    className="text-pink-blush dark:text-[#c9a84c]"
                  />
                  {/* Shoulders / body */}
                  <path
                    d="M40 130 Q50 90 100 85 Q150 90 160 130 L165 200 Q140 210 100 212 Q60 210 35 200 Z"
                    className="text-pink-blush dark:text-[#c9a84c]"
                  />
                  {/* Arm left */}
                  <path
                    d="M40 130 Q20 150 25 190 Q30 195 38 185 Q35 155 55 138 Z"
                    className="text-pink-blush dark:text-[#c9a84c]"
                  />
                  {/* Arm right holding bottle */}
                  <path
                    d="M160 130 Q178 148 174 185 Q168 192 162 183 Q164 155 145 138 Z"
                    className="text-pink-blush dark:text-[#c9a84c]"
                  />
                  {/* Perfume bottle in hand */}
                  <rect
                    x="158"
                    y="155"
                    width="18"
                    height="34"
                    rx="4"
                    className="text-[#c9a84c]"
                    fill="#c9a84c"
                    opacity="0.7"
                  />
                  <rect
                    x="163"
                    y="147"
                    width="8"
                    height="10"
                    rx="2"
                    fill="#c9a84c"
                    opacity="0.5"
                  />
                </svg>
                <p className="font-cinzel text-[10px] tracking-[3px] uppercase text-pink-blush/50 dark:text-[#c9a84c]/40 text-center">
                  Image coming soon
                </p>
                <p className="font-playfair text-lg font-semibold text-[#1a0a10]/40 dark:text-white/20 text-center">
                  {slide.label}
                </p>
              </div>
            )}
          </div>

          {/* ── Tag badge top-left ── */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className="font-cinzel text-[9px] tracking-[2.5px] uppercase px-3 py-1.5 rounded-full
              bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] shadow-lg"
            >
              {slide.tag}
            </span>
          </div>

          {/* ── Bottom label bar ── */}
          <div
            className="absolute bottom-0 inset-x-0 z-10 px-5 pb-4 pt-10"
            style={{
              background:
                "linear-gradient(to top, rgba(10,5,15,0.70) 0%, transparent 100%)",
            }}
          >
            <p className="font-playfair text-white text-lg font-semibold leading-tight">
              {slide.label}
            </p>
            <p className="font-inter text-white/55 text-[11px] tracking-wide mt-0.5">
              Susan Perfume Collection
            </p>
          </div>

          {/* ── Shimmer overlay on hover ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* ── Dot indicators ── */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-300 rounded-full focus:outline-none"
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                background:
                  i === active
                    ? "var(--pinky, #e91e8c)"
                    : "rgba(233,30,140,0.28)",
              }}
            />
          ))}
        </div>

        {/* ── Floating accent glow ── */}
        <div
          className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full pointer-events-none animate-orb-drift-reverse opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(233,30,140,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-4 -left-4 w-20 h-20 rounded-full pointer-events-none animate-float-slow opacity-0 dark:opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────────
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

      {/* gold orb top-right */}
      <div
        className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full pointer-events-none animate-orb-drift
        bg-[radial-gradient(circle,rgba(201,168,76,0.20)_0%,transparent_70%)]"
      />

      {/* pink orb bottom-left */}
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
          flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-10"
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

          {/* ── RIGHT: Image Slider ── */}
          <HeroImageSlider />
        </div>
      </div>

      <MarqueeStrip />
    </section>
  );
}

// ─── Marquee Strip ─────────────────────────────────────────────────────────────
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
