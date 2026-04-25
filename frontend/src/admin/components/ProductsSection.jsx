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

  // ── Add + Edit (FIXED) ──
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
        <div className="text-[#c9a84c] font-playfair text-xl animate-pulse">
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
          <h1 className="text-3xl font-bold text-white font-playfair">
            Product Management
          </h1>
          <p className="font-inter text-white/20 mt-1 text-sm">
            {products.length} products total
            {lowStockCount > 0 && (
              <span className="text-yellow-400/70">
                {" "}
                · {lowStockCount} low stock
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="text-red-400/70">
                {" "}
                · {outOfStockCount} out of stock
              </span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2">
            <span className="text-white/30 text-sm">🔍</span>
            <input
              className="bg-transparent text-sm text-white/60 outline-none w-40"
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
            className="px-4 py-2 text-sm bg-[#c9a84c] text-black rounded-xl font-bold"
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
            className={`px-3 py-1 text-xs rounded-full border ${
              activeCategory === cat
                ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                : "text-white/40"
            }`}
          >
            {cat}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto bg-white/5 text-xs px-3 py-1 rounded"
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
