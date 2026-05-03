const getStockStatus = (stock) => {
  if (stock === 0) return { label: "Out of Stock", style: "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20" };
  if (stock <= 10) return { label: "Low Stock",    style: "bg-yellow-500/12 text-yellow-600 dark:text-yellow-400 border border-yellow-500/25" };
  return              { label: "In Stock",         style: "bg-green-500/12 text-green-600 dark:text-green-400 border border-green-500/20" };
};

function ProductCard({ product, onDelete, onEdit }) {
  const { label, style } = getStockStatus(product.stock);

  return (
    <div className="bg-white/80 dark:bg-white/4 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 rounded-2xl overflow-hidden hover:border-[#e91e8c]/40 dark:hover:border-[#c9a84c]/40 hover:-translate-y-1 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#e91e8c]/8 dark:hover:shadow-[#c9a84c]/8">

      {/* Image area */}
      <div className="h-40 relative flex items-center justify-center bg-gradient-to-br from-[#fce4f3] to-[#fff0f7] dark:from-[#2a1e0e] dark:to-[#1a1208]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-80 dark:opacity-40" />

        {/* Stock badge */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${style}`}>
          {label}
        </span>

        {product.isBestSeller && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e91e8c]/15 text-[#e91e8c] dark:bg-pink-500/20 dark:text-pink-300 border border-[#e91e8c]/25 dark:border-pink-500/30">
            Bestseller
          </span>
        )}

        {/* Delete button */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button
            className="w-7 h-7 rounded-lg bg-white/80 dark:bg-black/70 border border-red-300 dark:border-red-500/20 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-all"
            onClick={onDelete}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-playfair text-[#1a0a10] dark:text-[#f5e6a8] text-sm font-semibold mb-0.5 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[9px] text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 uppercase tracking-wider mb-3">
          {product.category} · {product.size}ml
        </p>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-playfair text-[#e91e8c] dark:text-[#c9a84c] text-sm font-semibold">
              ₦{product.price.toLocaleString()}
            </div>
            <div className={`text-[10px] mt-0.5 ${product.stock <= 10 ? "text-yellow-600 dark:text-yellow-400" : "text-[#1a0a10]/30 dark:text-[#f5e6a8]/30"}`}>
              {product.stock === 0 ? "Out of stock" : `${product.stock} units left`}
            </div>
          </div>
          <button
            className="px-3 py-1.5 bg-[#e91e8c]/8 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/25 dark:border-[#c9a84c]/25 rounded-lg text-[10px] text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/15 dark:hover:bg-[#c9a84c]/20 transition-all font-inter font-semibold"
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
