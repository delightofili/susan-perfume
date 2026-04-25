import { useEffect } from "react";

function NewArrivals() {
  // Scroll reveal
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
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-[#e91e8c] dark:bg-[#0a0f1a]/95 px-6 md:px-16 w-full overflow-hidden">
      {/* Background circles */}
      <div className="w-60 h-60 rounded-full bg-white/10 absolute top-0 right-0 translate-x-20 -translate-y-3 md:w-[400px] md:h-[400px] md:translate-x-4 md:-translate-y-30 animate-float-slow" />
      <div className="w-40 h-40 rounded-full bg-white/5 absolute bottom-0 left-0 -translate-x-10 translate-y-10 animate-float" />

      <div className="flex flex-col w-full items-center justify-center gap-5 text-center z-30 relative py-20">
        <p
          data-reveal="1"
          className="font-playfair text-white/60 text-lg"
        >
          Stay in the loop
        </p>
        <h2
          data-reveal="2"
          className="text-pure-white text-4xl md:text-6xl font-playfair leading-tight"
        >
          Get Updates on{" "}
          <span className="text-[#ffd670] dark:text-[#c9a84c]">New Arrivals</span>
        </h2>
        <p
          data-reveal="3"
          className="text-pure-white/70 font-inter text-base max-w-md leading-relaxed"
        >
          Subscribe and be the first to know about exclusive drops, discounts,
          and limited editions.
        </p>
        <form
          data-reveal="4"
          className="w-full gap-3 md:w-auto flex flex-col md:flex-row items-center justify-center mt-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 md:px-6 md:py-3 rounded-sm border bg-white/15 backdrop-blur-sm text-white placeholder:text-white/50
              focus:outline-none focus:ring-2 focus:ring-white/40 border-white/30
              font-inter text-sm md:w-72 transition-all duration-200"
          />
          <button
            className="rounded-sm px-6 py-3 bg-white text-[#e91e8c] uppercase font-cinzel text-[13px] font-bold
              hover:bg-[#ffd670] hover:text-[#7a0000] border border-white
              transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg
              mt-4 md:mt-0 md:ml-2"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewArrivals;
