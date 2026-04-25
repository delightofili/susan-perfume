import imageCompression from "browser-image-compression";
import supabase from "../../api/supabaseClient";
import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../api/index.js";

function AddProductModal({ onClose, onAdd, editingProduct }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ FIX: handle edit + reset
  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
      });
    }
  }, [editingProduct]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ FIXED SUBMIT (numbers + edit/create)
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category || !form.stock) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isNaN(form.price) || isNaN(form.stock)) {
      setError("Price and stock must be numbers.");
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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#0a0f1a] border border-[#c9a84c]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#c9a84c]/10">
            <div>
              <h2 className="text-lg font-playfair text-[#f5e6a8]">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-[#f5e6a8]/30 font-inter mt-0.5">
                Fill in the details below
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 border border-[#c9a84c]/15 flex items-center justify-center text-[#f5e6a8]/40 hover:text-[#f5e6a8] hover:border-[#c9a84c]/40 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto scrollbar-none">
            {/* (ALL YOUR INPUTS — UNCHANGED) */}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#f5e6a8]/40 font-inter">
                Product Name <span className="text-[#c9a84c]">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Oud Royale"
                className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8] font-inter outline-none focus:border-[#c9a84c]/50 transition-all placeholder:text-white/15"
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="45000"
                className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]"
              />
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="20"
                className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]"
              />
            </div>

            {/* Category */}
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]"
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

            {/* Image */}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]"
            />

            {form.image && (
              <img
                src={form.image}
                className="h-20 w-20 object-cover rounded-xl"
              />
            )}

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="px-6 py-4 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm bg-[#c9a84c] text-black rounded-xl font-bold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm bg-[#c9a84c] text-black rounded-xl font-bold"
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
