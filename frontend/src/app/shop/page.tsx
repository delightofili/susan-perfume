"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Product } from "../../types/index.js";
import { getProducts } from "../../lib/api.js";
import PerfumeCard from "../../components/PerfumeCard.js";
import ProductModal from "../../components/ProductModal.js";
import SortBy from "../../components/SortBy.js";
import { SectionDivider } from "../../components/SectionDivider.js";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    result = result.filter((p) => p.price <= priceRange);

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [search, category, priceRange, sortBy, products]);

  const categories = ["All", "Floral", "Woody", "Oud", "Fresh", "Orient"];

  return (
    <div className="py-12 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <SectionDivider
          title="Perfume Catalog"
          subtitle="Explore our full collection of bespoke luxury fragrances."
        />

        {/* Filter Controls Bar */}
        <div className="p-6 rounded-3xl bg-[#fff8fb] dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scent notes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-xs font-inter text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c]"
              />
            </div>

            {/* Sort & Category Dropdown */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <SortBy sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {/* Category Tabs & Price Slider */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scroll w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                    category === cat
                      ? "bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] shadow-md"
                      : "bg-white dark:bg-[#131b2e] text-gray-700 dark:text-gray-300 hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Max Price Slider */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                Max Price: ${priceRange}
              </span>
              <input
                type="range"
                min={50}
                max={1000}
                step={25}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-44 accent-[#e91e8c] dark:accent-[#c9a84c] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full mx-auto" />
            <p className="font-cinzel text-sm text-gray-500 mt-4 uppercase tracking-widest">
              Fetching Atelier Catalog...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#0d1526] rounded-3xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20">
            <p className="font-cinzel text-lg font-bold text-gray-800 dark:text-gray-200">
              No Perfumes Found
            </p>
            <p className="font-playfair italic text-sm text-gray-500 mt-1">
              Try adjusting your search criteria or price filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <PerfumeCard key={p.id} product={p} onOpenModal={setSelectedProduct} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
