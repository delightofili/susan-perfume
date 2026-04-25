import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { useProduct } from "../hook/useProduct";
import PerfumeCard from "./PerfumeCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Bestseller() {
  const { products, loading } = useProduct();
  const scrollRef = useRef(null);

  console.log("Bestseller mounted");
  console.log("Products:", products);
  console.log("Loading:", loading);

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
      { threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-20 overflow-hidden bg-white dark:bg-[#0a0f1a] transition-colors duration-300">
      {/* ── Section Header ── */}
      <div
        data-reveal
        className="flex flex-col items-center justify-center gap-4 mb-12 px-4 text-center"
      >
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <svg
            width="60"
            height="10"
            viewBox="0 0 60 10"
            className="hidden sm:block"
          >
            <path
              d="M0 5 H60"
              className="stroke-[#e91e8c] dark:stroke-[#c9a84c]"
              strokeWidth="1"
            />
          </svg>
          <h2 className="uppercase font-inter text-[#e91e8c] dark:text-[#c9a84c]/70 text-[10px] md:text-[11px] tracking-[3px]">
            hand picked for you
          </h2>
          <svg
            width="60"
            height="10"
            viewBox="0 0 60 10"
            className="hidden sm:block"
          >
            <path
              d="M0 5 H60"
              className="stroke-[#e91e8c] dark:stroke-[#c9a84c]"
              strokeWidth="1"
            />
          </svg>
        </div>

        <h2 className="text-3xl md:text-5xl font-playfair text-[#1a0a10] dark:text-[#f5e6a8]">
          Best{" "}
          <span className="text-[#e91e8c] dark:text-[#c9a84c]">Sellers</span>
        </h2>
      </div>

      {/* ── Carousel Wrapper ── */}
      <div className="relative group max-w-[1400px] mx-auto">
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full
            bg-white dark:bg-[#0a0f1a] border border-[#e91e8c]/30 dark:border-[#c9a84c]/30
            items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] shadow-xl
            opacity-0 group-hover:opacity-100 transition-all duration-300
            hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c]
            dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a] hover:scale-110"
        >
          <IoIosArrowBack size={20} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full
            bg-white dark:bg-[#0a0f1a] border border-[#e91e8c]/30 dark:border-[#c9a84c]/30
            items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] shadow-xl
            opacity-0 group-hover:opacity-100 transition-all duration-300
            hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c]
            dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a] hover:scale-110"
        >
          <IoIosArrowForward size={20} />
        </button>

        {/* ── Scrollable Track ── */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none px-6 md:px-16 snap-x snap-mandatory pb-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] md:min-w-[320px] h-[400px] rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse"
              />
            ))
          ) : products?.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                data-reveal={String((index % 5) + 1)}
                className="min-w-[280px] md:min-w-[320px] snap-start"
              >
                <PerfumeCard
                  id={product.id}
                  name={product.name}
                  imageUrl={product.image}
                  image={
                    product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-44 flex items-center justify-center text-5xl">
                        🧴
                      </div>
                    )
                  }
                  price={`₦${product.price.toLocaleString()}`}
                  discount={product.discount}
                  category={product.category}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 font-inter text-sm px-4">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* ── Footer Link ── */}
      <div data-reveal className="flex items-center justify-center gap-6 mt-8">
        <Link
          to="/shop"
          className="font-cinzel text-[11px] tracking-[2px] uppercase px-8 py-3.5
            bg-transparent text-[#e91e8c] dark:text-[#c9a84c]
            border-2 border-[#e91e8c] dark:border-[#c9a84c]/30 rounded-sm
            hover:bg-[#e91e8c] hover:text-white hover:shadow-lg hover:shadow-[#e91e8c]/25
            dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
            transition-all duration-300 hover:scale-105 active:scale-95"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}

export default Bestseller;
