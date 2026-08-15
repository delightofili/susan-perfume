"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../types/index.js";
import { getProducts } from "../lib/api.js";
import PerfumeCard from "./PerfumeCard.js";
import ProductModal from "./ProductModal.js";
import { SectionDivider } from "./SectionDivider.js";

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.error("Error fetching new arrivals:", err));
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#fff0f6] to-white dark:from-[#090e1b] dark:to-[#070b14]">
      <div className="max-w-7xl mx-auto">
        <SectionDivider
          title="New Arrivals"
          subtitle="Explore our latest fragrance compositions newly unveiled at the atelier."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {products.map((p) => (
            <PerfumeCard key={p.id} product={p} onOpenModal={setSelectedProduct} />
          ))}
        </div>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
