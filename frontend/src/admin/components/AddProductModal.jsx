import imageCompression from "browser-image-compression";
import supabase from "../../api/supabaseClient";
import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../api/index.js";

function AddProductModal({ onClose, onAdd, editingProduct }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    size: "",
    stock: "",
    description: "",
    image: "",
    isBestSeller: false,
    discount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Populate form if editing an existing product
  useEffect(() => {
    if (editingProduct) {
      setForm({
        ...editingProduct,
        isBestSeller: editingProduct.isBestSeller || false,
        discount: editingProduct.discount || 0,
      });
    } else {
      setForm({
        name: "",
        price: "",
        size: "",
        category: "",
        stock: "",
        description: "",
        image: "",
        isBestSeller: false,
        discount: 0,
      });
    }
  }, [editingProduct]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleToggle = () => {
    setForm((prev) => ({
      ...prev,
      isBestSeller: !prev.isBestSeller,
    }));
  };

  // Form validation + submit
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isNaN(form.price) || isNaN(form.stock)) {
      setError("Price and stock must be numbers.");
      return;
    }

    if (!form.size || isNaN(Number(form.size))) {
      setError("Size must be a number!");
      return;
    }

    if (!form.image) {
      setError("Please upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        size: Number(form.size),
        discount: Number(form.discount || 0),
        isBestSeller: form.isBestSeller,
      };

      if (editingProduct) {
        result = await updateProduct(editingProduct.id, payload);
      } else {
        result = await createProduct(payload);
      }

      onAdd(result);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ IMAGE UPLOAD (clean + safe)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG or WEBP allowed");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const fileName = `product-${Date.now()}.webp`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, compressedFile);

      if (error) throw error;

      const { data } = supabase.storage.from("products").getPublicUrl(fileName);

      setForm((prev) => ({
        ...prev,
        image: data.publicUrl,
      }));
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-70"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-80 flex items-center justify-center p-2 sm:p-4 ">
        <div className="w-full max-w-lg max-h-[85dvh]  dark:bg-[#0a0f1a] bg-warm-cream border dark:border-[#c9a84c]/20 border-pink-blush/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
          <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-pink-blush/10 dark:border-[#c9a84c]/10">
            <div>
              <h2 className="text-lg font-playfair text-pink-blush dark:text-[#f5e6a8]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="text-xs dark:text-[#f5e6a8]/30 text-pink-blush/30 font-inter mt-0.5">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 border dark:border-[#c9a84c]/15 border-pink-blush/15 flex items-center justify-center text-pink-blush/40 dark:text-[#f5e6a8]/40 dark:hover:text-[#f5e6a8] hover:text-pink-400 dark:hover:border-[#c9a84c]/40 hover:border-pink-blush/40 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-none pb-2">
            {/* (ALL YOUR INPUTS — UNCHANGED) */}

            {/*  BESTSELLER TOGGLE */}
            <label className="flex items-center gap-3 text-sm dark:text-[#f5e6a8] text-pink-blush">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={handleToggle}
                className="w-5 h-5 rounded-md bg-white/30 dark:bg-black/30 border border-pink-blush/15 dark:border-[#c9a84c]/15 text-pink-blush dark:text-[#c9a84c] focus:ring-0"
              />
              Mark as Bestseller
            </label>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                Product Name{" "}
                <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Oud Royale"
                className="dark:bg-black/30 bg-white/30 border dark:border-[#c9a84c]/15 border-pink-blush/15 rounded-xl px-4 py-2.5 text-sm dark:text-[#f5e6a8] text-pink-blush font-inter outline-none dark:focus:border-[#c9a84c]/50 focus:border-pink-blush/50  transition-all placeholder:text-white/15"
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                  Price{" "}
                  <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                </label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  placeholder="enter price"
                  className="dark:bg-black/30 bg-white/30 border border-pink-blush/15 dark:border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-pink-blush dark:text-[#f5e6a8]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                  Stock{" "}
                  <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                </label>

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  type="number"
                  placeholder="number of perf available (20)"
                  className="dark:bg-black/30 bg-white/30 border border-pink-blush/15 dark:border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-pink-blush dark:text-[#f5e6a8]"
                />
              </div>
            </div>

            {/* Discount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                Discount (%) (Optional)
              </label>
              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 15 for 15% off"
                className="dark:bg-black/30 bg-white/30 border dark:border-[#c9a84c]/15 border-pink-blush/15 rounded-xl px-4 py-2.5 text-sm dark:text-[#f5e6a8] text-pink-blush"
              />
            </div>

            {/* size */}

            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                  enter size - 30/50/100 ml{" "}
                  <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
                </label>
                <input
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  type="number"
                  placeholder="50ml"
                  className="dark:bg-black/30 bg-white/30 border border-pink-blush/15 dark:border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-pink-blush dark:text-[#f5e6a8]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                select category of product{" "}
                <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="dark:bg-black/30 bg-white/30 border dark:border-[#c9a84c]/15 border-pink-blush/15 rounded-xl px-4 py-2.5 text-sm dark:text-[#f5e6a8] text-pink-blush"
              >
                <option value="" disabled>
                  Select category
                </option>
                {["Floral", "Oud", "Amber", "Woody", "Fresh", "Oriental"].map(
                  (cat) => (
                    <option key={cat}>{cat}</option>
                  ),
                )}
              </select>
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                upload perfume image{" "}
                <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
                className="dark:bg-black/30 bg-white/30 border dark:border-[#c9a84c]/15 border-pink-blush/15 rounded-xl px-4 py-2.5 text-sm text-pink-blush dark:text-[#f5e6a8]"
              />

              {form.image && (
                <img
                  src={form.image}
                  className="h-20 w-20 object-cover rounded-xl"
                />
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-solid-pink/40 dark:text-[#f5e6a8]/40 font-inter">
                Description{" "}
                <span className="text-pink-blush dark:text-[#c9a84c]">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe your product here...*"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="dark:bg-black/30 bg-white/30 border dark:border-[#c9a84c]/15 border-pink-blush/15 rounded-xl px-4 py-2.5 text-sm text-pink-blush dark:text-[#f5e6a8] resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="shrink-0 px-6 py-4 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm dark:bg-[#c9a84c] bg-pink-blush dark:text-black text-white rounded-xl font-bold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm dark:bg-[#c9a84c] bg-pink-blush dark:text-black text-white rounded-xl font-bold"
              onClick={handleSubmit}
              disabled={loading || uploading}
            >
              {uploading
                ? "Uploading..."
                : loading
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "+ Add Product"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProductModal;
