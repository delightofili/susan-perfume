"use client";

import React, { useEffect, useState } from "react";
import { Product } from "../types/index.js";
import { getProducts } from "../lib/api.js";
import PerfumeCard from "./PerfumeCard.js";
import ProductModal from "./ProductModal.js";
import { SectionDivider } from "./SectionDivider.js";

export default function Bestseller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.error("Error fetching bestsellers:", err));
  }, []);

  return (
    <section className="py-16 px-6 md:px-12 bg-white dark:bg-[#070b14]">
      <div className="max-w-7xl mx-auto">
        <SectionDivider
          title="Bestseller Collection"
          subtitle="Our most celebrated scents cherished by connoisseurs around the world."
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
