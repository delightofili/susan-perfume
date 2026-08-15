"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  Users,
  DollarSign,
  Menu,
  X,
  LogOut,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  Settings,
  Package,
  RefreshCw,
} from "lucide-react";
import { Product, Order } from "../../../types/index.js";
import {
  getProducts,
  getOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderApi,
} from "../../../lib/api.js";
import { useAuth } from "../../../context/AuthContext.js";
import { useToast } from "../../../context/ToastContext.js";
import ProtectedRoute from "../../../components/ProtectedRoute.js";

// ── Types ─────────────────────────────────────────────────────────────────────
type AdminView = "dashboard" | "products" | "orders" | "settings";

interface ProductForm {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
  image: string;
  size: string;
}

const ORDER_STATUSES = [
  "Pending",
  "Pending Payment",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Refunded",
];

const CATEGORIES = ["All", "Floral", "Oud", "Amber", "Woody", "Fresh", "Oriental", "Unisex"];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  growth,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  growth?: number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c]">
          {icon}
        </div>
        {growth !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-inter font-bold ${
              positive ? "text-green-500" : "text-red-500"
            }`}
          >
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(growth).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="font-inter text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h2 className="font-playfair text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {value}
        </h2>
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Pending Payment": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full font-inter text-[10px] font-bold uppercase tracking-wider ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

// ── Add / Edit Product Modal ───────────────────────────────────────────────────
function ProductModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const { addToast } = useToast();
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
    size: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        price: String(editing.price || ""),
        category: editing.category || "",
        stock: String(editing.stock || ""),
        description: editing.description || "",
        image: editing.image || "",
        size: "",
      });
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        description: form.description,
        image: form.image,
      };

      let result: Product;
      if (editing) {
        result = await updateProduct(editing.id, payload);
        addToast(`"${result.name}" updated successfully`, "success");
      } else {
        result = await createProduct(payload);
        addToast(`"${result.name}" added to catalog`, "success");
      }
      onSave(result);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm font-inter text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90dvh] bg-white dark:bg-[#0d1526] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10 shrink-0">
          <h3 className="font-playfair text-xl font-bold text-[#e91e8c] dark:text-[#c9a84c]">
            {editing ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a2336] text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Product Name <span className="text-[#e91e8c]">*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Oud Royale" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Price ($) <span className="text-[#e91e8c]">*</span>
              </label>
              <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Stock <span className="text-[#e91e8c]">*</span>
              </label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="0" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Category <span className="text-[#e91e8c]">*</span>
            </label>
            <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
              <option value="" disabled>Select category</option>
              {["Floral", "Oud", "Amber", "Woody", "Fresh", "Oriental", "Unisex"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Image URL
            </label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputCls} />
            {form.image && (
              <img src={form.image} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
            )}
          </div>

          <div>
            <label className="block text-xs font-cinzel font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the fragrance..." className={inputCls + " resize-none"} />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-inter font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2336] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-sm font-cinzel font-bold tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Saving..." : editing ? "Update Product" : "+ Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Products Section ───────────────────────────────────────────────────────────
function ProductsSection() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => addToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast("Product deleted", "info");
    } catch (e: any) {
      addToast(e.message, "error");
    }
  };

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "All") result = result.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "stock-low") result.sort((a, b) => a.stock - b.stock);
    return result;
  }, [products, activeCategory, search, sortBy]);

  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-3xl font-bold text-[#e91e8c] dark:text-[#f5e6a8]">Product Management</h2>
          <p className="font-inter text-xs text-gray-500 mt-1">
            {products.length} products total
            {lowStock > 0 && <span className="text-amber-500"> · {lowStock} low stock</span>}
            {outOfStock > 0 && <span className="text-red-500"> · {outOfStock} out of stock</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#0d1526] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] w-48"
            />
          </div>
          <button
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-black rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all font-inter font-semibold ${
              activeCategory === cat
                ? "bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] border-[#e91e8c]/30 dark:border-[#c9a84c]/30"
                : "text-gray-500 border-gray-200 dark:border-gray-700 hover:border-[#e91e8c]/30 dark:hover:border-[#c9a84c]/30"
            }`}
          >
            {cat}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto text-xs bg-white dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 rounded-xl px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low–High</option>
          <option value="price-desc">Price: High–Low</option>
          <option value="stock-low">Low Stock</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/10 dark:border-[#c9a84c]/10 shadow-sm overflow-hidden group"
          >
            <div className="h-36 bg-gradient-to-b from-[#fff8fb] to-[#fce4ec] dark:from-[#131b2e] dark:to-[#090e18] flex items-center justify-center p-3">
              {product.image ? (
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <Package className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className="p-3 space-y-2">
              <p className="font-cinzel text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs font-bold text-[#e91e8c] dark:text-[#c9a84c]">${Number(product.price).toFixed(2)}</span>
                <span className={`text-[10px] font-inter font-semibold px-1.5 py-0.5 rounded-full ${
                  product.stock === 0 ? "bg-red-100 text-red-600" :
                  product.stock <= 10 ? "bg-amber-100 text-amber-600" :
                  "bg-green-100 text-green-600"
                }`}>
                  {product.stock === 0 ? "Out" : `${product.stock} left`}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setEditingProduct(product); setShowModal(true); }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-[#e91e8c] dark:text-[#c9a84c] text-xs hover:bg-[#e91e8c]/5 dark:hover:bg-[#c9a84c]/5 transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-inter text-sm">No products found</div>
      )}

      {showModal && (
        <ProductModal
          editing={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ── Orders Section ─────────────────────────────────────────────────────────────
function OrdersSection() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => addToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderApi(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      addToast("Order status updated", "success");
    } catch (e: any) {
      addToast(e.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders
    .filter((o) => activeTab === "All" || o.status === activeTab)
    .filter((o) => {
      const q = search.toLowerCase();
      return (
        o.customer?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.reference?.toLowerCase().includes(q)
      );
    });

  const tabs = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Refunded"];

  const getItemCount = (order: Order) => {
    if (Array.isArray(order.items)) return order.items.length;
    return 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-3xl font-bold text-[#e91e8c] dark:text-[#f5e6a8]">Orders</h2>
          <p className="font-inter text-xs text-gray-500 mt-1">{orders.length} orders total</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ref..."
            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#0d1526] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none w-64"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: orders.length, color: "text-[#e91e8c] dark:text-[#c9a84c]" },
          { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: orders.filter((o) => o.status === "Pending").length, color: "text-orange-500" },
          { label: "Total Revenue", value: `$${orders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(0)}`, color: "text-[#e91e8c] dark:text-[#c9a84c]" },
        ].map((stat) => (
          <div key={stat.label} className="py-4 px-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#e91e8c]/10 dark:border-[#c9a84c]/15 shadow-sm">
            <p className="font-inter text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`font-playfair text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-[#e91e8c]/15 dark:border-[#c9a84c]/15">
        {tabs.map((tab) => {
          const count = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-inter whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? "border-[#e91e8c] dark:border-[#c9a84c] text-[#e91e8c] dark:text-[#c9a84c] font-bold"
                  : "border-transparent text-gray-400 hover:text-[#e91e8c] dark:hover:text-[#c9a84c]"
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab
                  ? "bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]"
                  : "bg-gray-100 dark:bg-white/5 text-gray-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/10 dark:border-[#c9a84c]/10 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
              {["Reference", "Customer", "Date", "Items", "Total", "Status", "Action"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-cinzel font-bold text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, i) => (
              <tr
                key={order.id}
                className={`border-b border-[#e91e8c]/5 dark:border-[#c9a84c]/5 hover:bg-[#e91e8c]/3 dark:hover:bg-[#c9a84c]/3 transition-colors ${
                  i % 2 !== 0 ? "bg-gray-50/50 dark:bg-white/[0.01]" : ""
                }`}
              >
                <td className="px-5 py-4 font-inter text-xs text-gray-500 max-w-[140px] truncate">{order.reference}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-xs font-playfair font-bold shrink-0">
                      {order.customer?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-inter text-sm font-semibold text-gray-800 dark:text-gray-200">{order.customer}</p>
                      <p className="font-inter text-xs text-gray-400">{order.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-inter text-xs text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </td>
                <td className="px-5 py-4 font-inter text-xs text-gray-500">
                  {getItemCount(order)} {getItemCount(order) === 1 ? "item" : "items"}
                </td>
                <td className="px-5 py-4 font-inter text-sm font-bold text-[#e91e8c] dark:text-[#c9a84c]">
                  ${Number(order.total).toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs font-inter text-gray-700 dark:text-gray-300 cursor-pointer disabled:opacity-50 focus:outline-none"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-[#0a0f1a]">{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-12 font-inter text-sm text-gray-400">No orders found</p>
        )}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
          <p className="text-xs font-inter text-gray-400">Showing {filtered.length} of {orders.length} orders</p>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/10 dark:border-[#c9a84c]/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs text-gray-400 truncate max-w-[140px]">{order.reference}</span>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 text-[#e91e8c] dark:bg-[#c9a84c]/10 dark:text-[#c9a84c] flex items-center justify-center text-sm font-bold">
                  {order.customer?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-inter text-sm font-bold text-gray-800 dark:text-gray-200">{order.customer}</p>
                  <p className="font-inter text-xs text-gray-400">{order.email}</p>
                </div>
              </div>
              <p className="font-inter font-bold text-sm text-[#e91e8c] dark:text-[#c9a84c]">${Number(order.total).toFixed(2)}</p>
            </div>
            <select
              value={order.status}
              disabled={updatingId === order.id}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className="w-full bg-[#e91e8c]/5 dark:bg-white/5 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 rounded-xl px-3 py-2 text-xs font-inter text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-[#0a0f1a]">{s}</option>
              ))}
            </select>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-12 font-inter text-sm text-gray-400">No orders found</p>
        )}
      </div>
    </div>
  );
}

// ── Settings Section ───────────────────────────────────────────────────────────
function SettingsSection({ userEmail }: { userEmail?: string }) {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    addToast("Signed out of Admin Portal", "info");
    router.push("/admin/login");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-playfair text-3xl font-bold text-[#e91e8c] dark:text-[#f5e6a8]">Settings</h2>

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm space-y-4">
        <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-3">
          Admin Profile
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 flex items-center justify-center text-2xl font-playfair font-bold text-[#e91e8c] dark:text-[#c9a84c]">
            S
          </div>
          <div>
            <p className="font-inter font-semibold text-gray-900 dark:text-white">Susan Admin</p>
            <p className="font-inter text-xs text-gray-500">{userEmail || "admin@susanperfume.com"}</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] font-cinzel font-bold uppercase tracking-wider mt-1 inline-block">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-sm space-y-4">
        <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 pb-3">
          Store Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-inter text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider font-cinzel mb-1">API Endpoint</p>
            <p className="text-xs bg-gray-50 dark:bg-[#131b2e] rounded-lg px-3 py-2 font-mono">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}
            </p>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider font-cinzel mb-1">Environment</p>
            <p className="text-xs bg-gray-50 dark:bg-[#131b2e] rounded-lg px-3 py-2 font-mono">
              {process.env.NODE_ENV || "development"}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 shadow-sm space-y-4">
        <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="font-inter text-xs text-red-600 dark:text-red-400">
          Signing out will clear your admin session. You will need to log in again to access this portal.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-cinzel font-bold text-xs tracking-wider uppercase hover:bg-red-700 transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Admin Portal
        </button>
      </div>
    </div>
  );
}

// ── Dashboard Overview ─────────────────────────────────────────────────────────
function DashboardOverview({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = new Set(orders.map((o) => o.email || o.customer).filter(Boolean)).size;

  const last7 = orders.slice(-7);
  const prev7 = orders.slice(-14, -7);
  const last7Total = last7.reduce((s, o) => s + Number(o.total || 0), 0);
  const prev7Total = prev7.reduce((s, o) => s + Number(o.total || 0), 0);
  const revenueGrowth = prev7Total === 0 ? 100 : ((last7Total - prev7Total) / prev7Total) * 100;

  const latestOrders = [...orders].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <h2 className="font-playfair text-3xl font-bold text-[#e91e8c] dark:text-[#f5e6a8]">Dashboard Overview</h2>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<DollarSign className="w-5 h-5" />} label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} growth={revenueGrowth} positive={revenueGrowth >= 0} />
            <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total Orders" value={totalOrders} growth={12.5} positive={true} />
            <StatCard icon={<Users className="w-5 h-5" />} label="Customers" value={totalCustomers} growth={8.2} positive={true} />
            <StatCard icon={<Package className="w-5 h-5" />} label="Paid Orders" value={orders.filter((o) => o.status === "Paid").length} />
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-[#e91e8c] dark:text-[#f5e6a8] mb-4">Latest Orders</h3>
            <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-[#e91e8c]/10 dark:border-[#c9a84c]/10 overflow-hidden shadow-sm">
              {latestOrders.length === 0 ? (
                <p className="text-center py-12 text-gray-400 font-inter text-sm">No orders yet</p>
              ) : (
                <div className="divide-y divide-[#e91e8c]/5 dark:divide-[#c9a84c]/5">
                  {latestOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm font-playfair font-bold">
                          {order.customer?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-inter text-sm font-semibold text-gray-800 dark:text-gray-200">{order.customer}</p>
                          <p className="font-inter text-xs text-gray-400 truncate max-w-[120px]">{order.reference}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <span className="font-inter text-sm font-bold text-[#e91e8c] dark:text-[#c9a84c] hidden sm:block">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Admin Dashboard Page ──────────────────────────────────────────────────
function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [view, setView] = useState<AdminView>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((e) => console.error("Stats fetch error:", e))
      .finally(() => setLoadingStats(false));
  }, []);

  const handleLogout = () => {
    logout();
    addToast("Signed out successfully", "info");
    router.push("/admin/login");
  };

  const navLinks = [
    { id: "dashboard" as AdminView, label: "Dashboard", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "products" as AdminView, label: "Products", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "orders" as AdminView, label: "Orders", icon: <Package className="w-5 h-5" /> },
    { id: "settings" as AdminView, label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <section className="min-h-screen">
      {/* Background Light */}
      <div className="fixed inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at top right, #fce4f3 0%, #fdf0f7 45%, #fff8f0 100%)" }} />
      {/* Background Dark */}
      <div className="fixed inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 bg-[#070b14]" />

      <div className="relative z-10 md:grid md:grid-cols-[260px_1fr] min-h-dvh">
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/90 dark:bg-black/70 backdrop-blur-md border-b border-[#e91e8c]/20 dark:border-[#c9a84c]/20 md:hidden">
          <h1 className="font-playfair text-xl font-bold text-[#e91e8c] dark:text-[#c9a84c]">Admin Dashboard</h1>
          <button
            onClick={() => setNavOpen((p) => !p)}
            className="p-2 rounded-xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c]"
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Overlay */}
        {navOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" onClick={() => setNavOpen(false)} />
        )}

        {/* Sidebar Nav */}
        <nav className={`fixed top-16 md:top-0 left-0 md:h-screen w-64 flex flex-col justify-between
          bg-white/95 dark:bg-[#0a0f1a]/95 backdrop-blur-xl
          border-r border-[#e91e8c]/20 dark:border-[#c9a84c]/20 shadow-2xl
          transform transition-transform duration-300 ease-in-out z-40
          ${navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:relative md:translate-x-0 md:z-auto`
        }>
          {/* Logo */}
          <div>
            <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
              <div className="w-4 h-4 bg-[#e91e8c] dark:bg-[#c9a84c] rotate-45 shrink-0" />
              <div>
                <p className="font-cinzel text-[#e91e8c] dark:text-[#c9a84c] text-sm font-bold tracking-widest uppercase">Susan</p>
                <p className="font-cinzel text-[#e91e8c]/60 dark:text-[#c9a84c]/60 text-[8px] tracking-[3px] uppercase">Admin Portal</p>
              </div>
            </div>
            {/* Nav Links */}
            <div className="p-4 space-y-1 mt-2">
              {navLinks.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => { setView(id); setNavOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-sm font-semibold transition-all duration-200 ${
                    view === id
                      ? "bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#e91e8c] dark:hover:text-[#c9a84c]"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] font-playfair font-bold">
                S
              </div>
              <div>
                <p className="font-inter text-sm font-semibold text-gray-900 dark:text-white">Susan Admin</p>
                <p className="font-inter text-xs text-gray-400 truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-[#e91e8c] dark:text-[#c9a84c] font-inter text-sm hover:bg-[#e91e8c]/5 dark:hover:bg-[#c9a84c]/5 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6 bg-white/30 dark:bg-transparent backdrop-blur-sm overflow-x-hidden">
          {view === "dashboard" && <DashboardOverview orders={orders} loading={loadingStats} />}
          {view === "products" && <ProductsSection />}
          {view === "orders" && <OrdersSection />}
          {view === "settings" && <SettingsSection userEmail={user?.email} />}
        </main>
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
