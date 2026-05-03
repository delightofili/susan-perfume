// src/admin/components/ProductsSection.jsx

import { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import AddProductModal from "./AddProductModal";
import { getProducts, deleteProduct } from "../../api/index.js";

const CATEGORIES = [
  "All",
  "Floral",
  "Oud",
  "Amber",
  "Woody",
  "Fresh",
  "Oriental",
  "Unisex",
];

function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [editingProduct, setEditingProduct] = useState(null);

  // ── Fetch products ──
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ── Delete ──
  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  //add or edit product in the list
  const handleAddOrEdit = (product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
  };

  // ── Filter + Search + Sort (FIXED CLEAN) ──
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-low":
        result.sort((a, b) => a.stock - b.stock);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  // ── Stats ──
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 10,
  ).length;

  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#e91e8c] dark:text-[#c9a84c] font-playfair text-xl animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#e91e8c] dark:text-white font-playfair">
            Product Management
          </h1>
          <p className="font-inter text-[#1a0a10]/50 dark:text-white/20 mt-1 text-sm">
            {products.length} products total
            {lowStockCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">{" "}· {lowStockCount} low stock</span>
            )}
            {outOfStockCount > 0 && (
              <span className="text-red-500 dark:text-red-400">{" "}· {outOfStockCount} out of stock</span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-white/5 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl px-3 py-2">
            <span className="text-[#1a0a10]/40 dark:text-white/30 text-sm">🔍</span>
            <input
              className="bg-transparent text-sm text-[#1a0a10] dark:text-white/60 outline-none w-40 placeholder:text-[#1a0a10]/30 dark:placeholder:text-white/30"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 text-sm bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-black rounded-xl font-bold hover:bg-[#c2185b] dark:hover:bg-[#b8942e] transition-all"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Category + Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              activeCategory === cat
                ? "bg-[#e91e8c]/15 dark:bg-[#c9a84c]/20 text-[#e91e8c] dark:text-[#c9a84c] border-[#e91e8c]/30 dark:border-[#c9a84c]/40"
                : "text-[#1a0a10]/50 dark:text-white/40 border-[#1a0a10]/15 dark:border-white/10 hover:border-[#e91e8c]/30 dark:hover:border-[#c9a84c]/30"
            }`}
          >
            {cat}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto bg-white/80 dark:bg-white/5 text-xs text-[#1a0a10]/70 dark:text-white/60 border border-[#e91e8c]/15 dark:border-transparent px-3 py-1 rounded-lg outline-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price Low–High</option>
          <option value="price-desc">Price High–Low</option>
          <option value="stock-low">Low Stock</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => handleDelete(product.id)}
            onEdit={(product) => {
              setEditingProduct(product);
              setShowAddModal(true);
            }}
          />
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onAdd={handleAddOrEdit}
          editingProduct={editingProduct}
        />
      )}
    </div>
  );
}

export default ProductsSection;
