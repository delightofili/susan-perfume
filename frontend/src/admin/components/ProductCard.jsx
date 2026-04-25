const getStockStatus = (stock) => {
  if (stock === 0)
    return {
      label: "Out of Stock",
      style: "bg-red-500/10 text-red-400 border border-red-500/15",
    };
  if (stock <= 10)
    return {
      label: "Low Stock",
      style: "bg-yellow-500/12 text-yellow-400 border border-yellow-500/20",
    };
  return {
    label: "In Stock",
    style: "bg-green-500/15 text-green-400 border border-green-500/25",
  };
};

function ProductCard({ product, onDelete, onEdit }) {
  const { label, style } = getStockStatus(product.stock);
  return (
    <div className="bg-white/4 border border-[#c9a84c]/15 rounded-2xl overflow-hidden hover:border-[#c9a84c]/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer">
      {/* Image area */}
      <div className="h-44 relative flex items-center justify-center bg-linear-to-br from-[#2a1e0e] to-[#1a1208]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover opacity-40"
        />

        {/* Stock badge - top LEFT */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${style}`}
        >
          {label}
        </span>

        {/* Edit/Delete - top RIGHT */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            className="w-7 h-7 rounded-lg bg-black/70 border border-[#c9a84c]/20 flex items-center justify-center text-xs hover:bg-[#c9a84c] transition-all"
            onClick={onEdit}
          >
            ✏️
          </button>
          <button
            className="w-7 h-7 rounded-lg bg-black/70 border border-red-500/20 flex items-center justify-center text-xs hover:bg-red-600 transition-all"
            onClick={onDelete}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-playfair text-[#f5e6a8] text-base mb-0.5">
          {product.name}
        </h3>
        <p className="text-[9px] text-[#f5e6a8]/30 uppercase tracking-wider mb-3">
          {product.category} · {product.size}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-playfair text-[#c9a84c] text-base font-semibold">
              ₦{product.price.toLocaleString()}
            </div>
            <div
              className={`text-[10px] mt-0.5 ${product.stock <= 10 ? "text-yellow-400" : "text-[#f5e6a8]/30"}`}
            >
              {product.stock === 0
                ? "Out of stock"
                : `${product.stock} units left`}
            </div>
          </div>
          <button
            className="px-3 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-lg text-[10px] text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-all font-inter"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
