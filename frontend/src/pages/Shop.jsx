import { useEffect, useMemo, useRef, useState } from "react";
import SortBy from "../components/SortBy";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PerfumeCard from "../components/PerfumeCard";
import ProductModal from "../components/ProductModal";
import { useCart } from "../hook/useCart";
import { useProduct } from "../hook/useProduct";

// --- Shared checkbox component ---
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
          <svg
            className="w-3 h-3 stroke-white"
            viewBox="0 0 20 20"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
  const { id } = useParams();
  const navigate = useNavigate();

  const [navIsOpen, setNavIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 1000, max: 5000000 });
  const [categories, setCategories] = useState({
    Floral: false,
    Oud: false,
    Amber: false,
    Woody: false,
    Fresh: false,
    Unisex: false,
  });
  const [size, setSize] = useState({
    "30ml": false,
    "50ml": false,
    "100ml": false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const productsRef = useRef(null);

  // Smooth scroll to product grid top on page change
  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCategory = (cat) => {
    setCategories((p) => {
      const updated = { ...p, [cat]: !p[cat] };
      return updated;
    });
    setCurrentPage(1);
  };
  const toggleSize = (s) => {
    setSize((p) => {
      const updated = { ...p, [s]: !p[s] };
      return updated;
    });
    setCurrentPage(1);
  };

  // Derived state for filters
  const activeCategories = useMemo(
    () => Object.keys(categories).filter((k) => categories[k]),
    [categories],
  );
  const activeSizes = useMemo(
    () => Object.keys(size).filter((k) => size[k]),
    [size],
  );

  //  FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((p) => {
        const matchesSearch =
          !search.trim() ||
          p.name?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          activeCategories.length === 0 ||
          (p.category &&
            activeCategories.some((cat) =>
              p.category.toLowerCase().includes(cat.toLowerCase()),
            ));

        const matchesSize =
          activeSizes.length === 0 ||
          (p.size != null &&
            activeSizes.some((s) =>
              String(p.size).toLowerCase().includes(s.replace("ml", "").toLowerCase())
            ));

        const price = Number(p.price || 0);
        const matchesPrice = price >= priceRange.min && price <= priceRange.max;

        return matchesSearch && matchesCategory && matchesSize && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [products, search, activeCategories, activeSizes, priceRange, sort]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // 2. FIXED SCROLL REVEAL (Re-observes when products change)

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = navIsOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navIsOpen]);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]" />
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_right,#fcd6eb_0%,#fdf2f8_45%,#fff8f0_100%)]" />

      <div className="z-40 relative md:grid md:grid-cols-[300px_1fr]">
        {/* FILTER SIDEBAR */}
        <nav
          className={`fixed top-24 md:top-0 left-0 px-8 py-6 overflow-y-auto bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-md scrollbar-none md:static w-75 h-[calc(100dvh-6rem)] md:h-full z-50 transition-transform duration-300 ease-in-out border-r border-[#e91e8c]/10 dark:border-[#c9a84c]/10 ${navIsOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0 md:block`}
        >
          <h2 className="font-cinzel font-bold py-4 px-2 text-[#e91e8c] dark:text-[#c9a84c] tracking-[3px] uppercase text-sm">
            Filters
          </h2>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg py-3 px-2">
              Price
            </h3>
            <div className="shop-range-wrap relative w-full mt-3 px-2">
              <div className="absolute inset-x-2 h-1 top-1/2 -translate-y-1/2 bg-[#e91e8c]/15 dark:bg-[#c9a84c]/15 rounded-full" />
              <div
                className="absolute h-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#e91e8c] to-[#ff6ec7] dark:from-[#c9a84c] dark:to-[#f5e6a8]"
                style={{
                  left: `${((priceRange.min - 100) / (5000000 - 100)) * 100}%`,
                  width: `${((priceRange.max - priceRange.min) / (5000000 - 100)) * 100}%`,
                }}
              />
              <input
                type="range"
                min="100"
                max="5000000"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange((p) => ({
                    ...p,
                    min: Number(e.target.value),
                  }));
                  setCurrentPage(1);
                }}
                className="absolute inset-x-2 w-auto h-full appearance-none bg-transparent pointer-events-auto z-20"
              />
              <input
                type="range"
                min="100"
                max="5000000"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange((p) => ({
                    ...p,
                    max: Number(e.target.value),
                  }));
                  setCurrentPage(1);
                }}
                className="absolute inset-x-2 w-auto h-full appearance-none bg-transparent pointer-events-auto z-30"
              />
            </div>
            <div className="flex justify-between text-[#e91e8c] dark:text-[#c9a84c] text-sm mt-7 px-2 font-semibold">
              <span>₦{priceRange.min.toLocaleString()}</span>
              <span>₦{priceRange.max.toLocaleString()}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3 px-2">
              Categories
            </h3>
            <div className="space-y-2 px-2">
              {Object.keys(categories).map((cat) => (
                <FilterCheckbox
                  key={cat}
                  label={cat}
                  checked={categories[cat]}
                  onChange={() => toggleCategory(cat)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3 px-2">
              Size
            </h3>
            <div className="space-y-2 px-2">
              {Object.keys(size).map((s) => (
                <FilterCheckbox
                  key={s}
                  label={s}
                  checked={size[s]}
                  onChange={() => toggleSize(s)}
                />
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6 px-2">
            <h3 className="font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c] text-lg mb-3">
              Sort By
            </h3>
            <SortBy
              onSortChange={(value) => {
                setSort(value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            className="w-full py-3 px-7 rounded-sm font-bold uppercase text-white bg-[#e91e8c] dark:text-[#c9a84c] dark:border-2 dark:border-[#c9a84c]/50 dark:bg-transparent hover:scale-[1.02] transition-all"
            onClick={() => {
              setCategories({
                Floral: false,
                Oud: false,
                Amber: false,
                Woody: false,
                Fresh: false,
                Unisex: false,
              });
              setSize({ "30ml": false, "50ml": false, "100ml": false });
              setPriceRange({ min: 5000, max: 500000 });
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden fixed top-24 left-2 z-[60] text-white bg-[#e91e8c] dark:bg-[#c9a84c] dark:text-[#0a0f1a] p-2 rounded-lg shadow-lg"
          onClick={() => setNavIsOpen(!navIsOpen)}
        >
          {navIsOpen ? (
            <MdFilterListOff className="h-8 w-8" />
          ) : (
            <MdFilterList className="h-8 w-8" />
          )}
        </button>

        {navIsOpen && (
          <div
            onClick={() => setNavIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}

        {/* MAIN AREA */}
        <main>
          <div
            data-reveal
            className="py-8 px-4 flex flex-col items-center w-full"
          >
            <h1 className="font-playfair text-4xl md:text-5xl bg-gradient-to-r from-[#e91e8c] to-[#c2185b] dark:from-[#f5e6a8] dark:to-[#bfa24a] bg-clip-text text-transparent">
              Shop
            </h1>
            <p className="text-[#e91e8c]/70 dark:text-white/50 mt-3 text-center">
              Explore our collection of exquisite fragrances.
            </p>
          </div>

          <div className="flex justify-center px-4 mb-10">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-xl border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 bg-white/70 dark:bg-black/30 text-[#1a0a10] dark:text-[#f5e6a8] outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c]"
            />
          </div>

          <section className="min-h-[400px]" ref={productsRef}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-[#e91e8c]/30 border-t-[#e91e8c] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3 p-3 lg:px-8">
                {filteredProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <div key={product.id}>
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
                        size={product.size}
                        discount={product.discount}
                        category={product.category}
                        onClick={() => navigate(`/shop/${product.id}`)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-[#e91e8c]/60 dark:text-[#c9a84c]/60 font-inter text-xl">
                      No perfumes found matching your filters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 m-10">
            <div className="flex items-center gap-3 justify-center">
              {/* previous page button */}
              <button
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 border-2 border-[#e91e8c]/40 rounded-lg text-[#e91e8c] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  scrollToProducts();
                }}
              >
                <IoIosArrowBack />
              </button>
              <span className="flex items-center justify-center text-center w-10 h-10 bg-[#e91e8c] rounded-lg text-white font-bold">
                {currentPage}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  scrollToProducts();
                }}
                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 border-2 border-[#e91e8c]/40 rounded-lg text-[#e91e8c] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <IoIosArrowForward />
              </button>
            </div>
            <div>
              <p className="text-[#e91e8c]/60 dark:text-[#c9a84c]/60 font-inter text-sm">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          {id && (
            <ProductModal
              productId={id}
              onClose={() => navigate("/shop")}
              cartItems={cart}
            />
          )}
        </main>
      </div>
    </section>
  );
}

export default Shop;
