import { useEffect, useState } from "react";
import SortBy from "../components/SortBy";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PerfumeCard from "../components/PerfumeCard";
import ProductModal from "../components/ProductModal";
import { useCart } from "../hook/useCart";
import { useProduct } from "../hook/useProduct";

// ── Shared checkbox component to avoid repetition ────────────
function FilterCheckbox({ checked, onChange, label }) {
  return (
    <label className="group flex items-center gap-3 cursor-pointer py-1 hover:opacity-80 transition-opacity">
      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className="w-5 h-5 rounded-md border-2 border-[#e91e8c] dark:border-solid-gold/80
            bg-transparent transition-all duration-200
            peer-checked:bg-[#e91e8c] dark:peer-checked:bg-[#c9a84c]
            peer-checked:border-[#e91e8c] dark:peer-checked:border-[#c9a84c]
            peer-checked:shadow-[0_0_10px_rgba(233,30,140,0.4)] dark:peer-checked:shadow-[0_0_10px_rgba(201,168,76,0.4)]"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
          <svg className="w-3 h-3 stroke-white" viewBox="0 0 20 20" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10.5l4.5 4.5 8-8" />
          </svg>
        </div>
      </div>
      <span className="font-inter font-semibold text-sm text-[#e91e8c] dark:text-[#c9a84c]">
        {label}
      </span>
    </label>
  );
}

function Shop() {
  const { cart } = useCart();
  const { products, loading } = useProduct();
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 5000, max: 500000 });
  const [categories, setcategories] = useState({
    Floral: false, Oud: false, Amber: false, Woody: false, Fresh: false, Unisex: false,
  });
  const [size, setSize] = useState({ "30ml": false, "50ml": false, "100ml": false });

  const toogleCategory = (cat) => setcategories((p) => ({ ...p, [cat]: !p[cat] }));
  const toogleSize = (s) => setSize((p) => ({ ...p, [s]: !p[s] }));

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = navIsOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navIsOpen]);

  // Scroll reveal
  useEffect(() => {
    const selectors = ["[data-reveal]", "[data-reveal-left]", "[data-reveal-right]", "[data-reveal-scale]"];
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
      { threshold: 0.08 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const categoryList = ["Floral", "Oud", "Amber", "Woody", "Fresh", "Unisex"];
  const sizeList = ["30ml", "50ml", "100ml"];

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* ── Backgrounds ── */}

      {/* dark mode */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]" />

      {/* light mode */}
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#fcd6eb_0%,#fdf2f8_45%,#fff8f0_100%)]" />

      {/* gold orb top-right */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none animate-orb-drift
        bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_70%)]" />

      {/* pink orb bottom-left */}
      <div className="absolute bottom-0 left-1/3 w-[280px] h-[280px] rounded-full pointer-events-none animate-orb-drift-reverse
        bg-[radial-gradient(circle,rgba(233,30,140,0.14)_0%,transparent_70%)]" />

      <div className="z-40 relative md:grid md:grid-cols-[300px_1fr]">

        {/* ── FILTER SIDEBAR ── */}
        <nav className={`fixed top-24 md:top-0 left-0 px-8 py-6 overflow-y-auto
            bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-md scrollbar-none touch-pan-y
            md:static w-75 h-[calc(100dvh-6rem)] md:h-full
            z-50 transition-transform duration-300 ease-in-out border-r border-[#e91e8c]/10 dark:border-[#c9a84c]/10
            ${navIsOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
            md:translate-x-0 md:block`}
        >
          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/40 dark:via-[#c9a84c]/40 to-transparent" />

          <h2 className="font-cinzel font-bold py-4 px-2 text-[#e91e8c] dark:text-[#c9a84c] tracking-[3px] uppercase text-sm">
            Filters
          </h2>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/30 dark:via-[#c9a84c]/30 to-transparent mb-4" />

          {/* ── Price Range ── */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg py-3 px-2">
              Price
            </h3>

            <div className="relative w-full mt-3 px-2">
              {/* Track background */}
              <div className="absolute inset-x-2 h-1 top-1/2 -translate-y-1/2 bg-[#e91e8c]/15 dark:bg-[#c9a84c]/15 rounded-full" />
              {/* Active fill */}
              <div
                className="absolute h-1 top-1/2 -translate-y-1/2 rounded-full
                  bg-gradient-to-r from-[#e91e8c] to-[#ff6ec7]
                  dark:from-[#c9a84c] dark:to-[#f5e6a8]
                  shadow-[0_0_10px_rgba(233,30,140,0.5)] dark:shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                style={{
                  left: `${((priceRange.min - 5000) / (500000 - 5000)) * 100}%`,
                  width: `${((priceRange.max - priceRange.min) / (500000 - 5000)) * 100}%`,
                }}
              />
              <input
                type="range" min="5000" max="500000" value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-auto z-20
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:bg-[#e91e8c] dark:[&::-webkit-slider-thumb]:bg-[#c9a84c]
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(233,30,140,0.8)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(201,168,76,0.8)]"
              />
              <input
                type="range" min="5000" max="500000" value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-auto z-30
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:bg-[#e91e8c] dark:[&::-webkit-slider-thumb]:bg-[#c9a84c]
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(233,30,140,0.8)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(201,168,76,0.8)]"
              />
            </div>

            <div className="flex justify-between text-[#e91e8c] dark:text-[#c9a84c] text-sm mt-7 py-2 px-2 font-inter font-semibold">
              <span>₦{priceRange.min.toLocaleString()}</span>
              <span>₦{priceRange.max.toLocaleString()}</span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/20 dark:via-[#c9a84c]/20 to-transparent mb-4" />

          {/* ── Categories ── */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3 px-2">
              Categories
            </h3>
            <div className="space-y-2 px-2">
              {categoryList.map((cat) => (
                <FilterCheckbox
                  key={cat}
                  checked={categories[cat]}
                  onChange={() => toogleCategory(cat)}
                  label={cat}
                />
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/20 dark:via-[#c9a84c]/20 to-transparent mb-4" />

          {/* ── Size ── */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3 px-2">
              Size
            </h3>
            <div className="space-y-2 px-2">
              {sizeList.map((s) => (
                <FilterCheckbox
                  key={s}
                  checked={size[s]}
                  onChange={() => toogleSize(s)}
                  label={s}
                />
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/20 dark:via-[#c9a84c]/20 to-transparent mb-4" />

          {/* ── Sort By ── */}
          <div className="mb-6 px-2">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3">
              Sort By
            </h3>
            <SortBy onSortChange={(value) => console.log("Sort By:", value)} />
          </div>

          {/* ── Clear Filters ── */}
          <button
            className="w-full py-3 px-7 rounded-sm font-bold font-inter text-sm tracking-widest uppercase
              text-white bg-[#e91e8c] dark:bg-transparent dark:text-[#c9a84c]
              dark:border-2 dark:border-[#c9a84c]/50 dark:bg-(image:--luxury-gold-gradient)
              hover:bg-[#c2185b] dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
              transition-all duration-200 hover:scale-[1.02] active:scale-95
              shadow-md shadow-[#e91e8c]/20 dark:shadow-none mt-2"
            onClick={() => {
              setcategories({ Floral: false, Oud: false, Amber: false, Woody: false, Fresh: false, Unisex: false });
              setSize({ "30ml": false, "50ml": false, "100ml": false });
              setPriceRange({ min: 5000, max: 500000 });
            }}
          >
            Clear Filters
          </button>
        </nav>

        {/* Mobile filter toggle */}
        <button
          className="md:hidden fixed top-24 left-2 z-60
             text-white bg-[#e91e8c] dark:bg-[#c9a84c] dark:text-[#0a0f1a] p-2 rounded-lg shadow-lg
             hover:scale-110 transition-transform duration-200"
          onClick={() => setNavIsOpen(!navIsOpen)}
        >
          {navIsOpen ? (
            <MdFilterListOff className="h-8 w-8 rotate-180 transition-transform" />
          ) : (
            <MdFilterList className="h-8 w-8 transition-transform" />
          )}
        </button>

        {navIsOpen && (
          <div
            onClick={() => setNavIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}

        {/* ── MAIN PRODUCT AREA ── */}
        <main>
          {/* Page title */}
          <div data-reveal className="py-8 px-4 md:px-8 flex flex-col items-center w-full">
            <h1 className="font-playfair text-4xl md:text-5xl bg-gradient-to-r from-[#e91e8c] via-[#d81b8a] to-[#c2185b]
              dark:from-[#f5e6a8] dark:via-[#ebc76a] dark:to-[#bfa24a]
              bg-clip-text text-transparent">
              Shop
            </h1>
            <p className="text-[#e91e8c]/70 dark:text-white/50 font-inter mt-3 text-center max-w-md">
              Explore our collection of exquisite fragrances.
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/40 dark:via-[#c9a84c]/40 to-transparent" />

          <section>
            {/* Loading spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-16 h-16 border-4 border-[#e91e8c]/30 dark:border-[#c9a84c]/30 border-t-[#e91e8c] dark:border-t-[#c9a84c] rounded-full animate-spin mb-6" />
                <p className="text-[#e91e8c] dark:text-[#c9a84c] font-inter font-semibold text-lg">
                  Loading fragrances...
                </p>
              </div>
            )}

            <div>
              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 lg:px-10">
                {products?.map((product, index) => (
                  <div
                    key={product.id}
                    data-reveal={String((index % 6) + 1)}
                  >
                    <PerfumeCard
                      id={product.id}
                      product={product}
                      name={product.name}
                      imageUrl={product.image}
                      image={
                        product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-40 w-full flex items-center justify-center text-5xl">🧴</div>
                        )
                      }
                      price={product.price}
                      discount={product.discount}
                      onClick={() => navigate(`/shop/${product.id}`)}
                    />
                  </div>
                )) || <p className="px-4 text-[#e91e8c]/60 font-inter">No perfumes found</p>}
              </div>

              {/* Pagination */}
              <div data-reveal className="flex items-center justify-center gap-3 m-10">
                <button className="w-10 h-10 flex items-center justify-center
                  bg-white dark:bg-white/10 border-2 border-[#e91e8c]/40 dark:border-[#c9a84c]/40
                  rounded-lg text-[#e91e8c] dark:text-[#c9a84c]
                  hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c]
                  dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
                  transition-all duration-200 hover:scale-110">
                  <IoIosArrowBack />
                </button>
                <button className="w-10 h-10 flex items-center justify-center
                  bg-[#e91e8c] dark:bg-[#c9a84c]/20 border-2 border-[#e91e8c] dark:border-[#c9a84c]/50
                  rounded-lg text-white dark:text-[#c9a84c] font-bold font-inter
                  shadow-md shadow-[#e91e8c]/25 dark:shadow-none">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center
                  bg-white dark:bg-white/10 border-2 border-[#e91e8c]/40 dark:border-[#c9a84c]/40
                  rounded-lg text-[#e91e8c] dark:text-[#c9a84c]
                  hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c]
                  dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
                  transition-all duration-200 hover:scale-110">
                  <IoIosArrowForward />
                </button>
              </div>

              {id && (
                <ProductModal
                  productId={id}
                  onClose={() => navigate("/shop")}
                  cartItems={cart}
                />
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default Shop;
