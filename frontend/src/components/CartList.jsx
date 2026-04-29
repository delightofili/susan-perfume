import { useCart } from "../hook/useCart";
import { RiDeleteBin6Line } from "react-icons/ri";

function CartList({ cartItems }) {
  const { removeItem, updateQuantity } = useCart();

  const handleDecrease = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem?.quantity && currentItem.quantity > 1) {
      updateQuantity(id, currentItem.quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleIncrease = (id) => {
    const currentItem = cartItems.find((item) => item.id === id);
    updateQuantity(id, (currentItem?.quantity || 1) + 1);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e91e8c]/15 dark:border-[#c9a84c]/10 bg-white/70 dark:bg-black/40 backdrop-blur-sm">
      {/* ── Header — desktop only ── */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr] px-6 py-4 border-b border-[#e91e8c]/15 dark:border-[#c9a84c]/20 bg-[#fce4f3]/50 dark:bg-black/60">
        {["Product", "Price", "Quantity", "Subtotal"].map((h, i) => (
          <p
            key={h}
            className={`font-inter text-xs uppercase tracking-widest text-[#e91e8c]/60 dark:text-[#c9a84c]/50 font-semibold ${
              i === 0 ? "" : "text-center"
            } ${i === 3 ? "text-right" : ""}`}
          >
            {h}
          </p>
        ))}
      </div>

      {/* ── Items ── */}
      <div className="divide-y divide-[#e91e8c]/08 dark:divide-[#c9a84c]/10">
        {cartItems.map((item) => {
          const quantity = item.quantity || 1;
          const subTotal = Number(item.price) * quantity;

          return (
            <div
              key={item.id}
              className="px-4 md:px-6 py-5 hover:bg-[#fce4f3]/30 dark:hover:bg-[#c9a84c]/3 transition-colors duration-200"
            >
              {/* Mobile layout */}
              <div className="flex gap-4 md:hidden">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#fce4f3] to-[#fff8f0] dark:from-[#1a0a10] dark:to-[#0a0f1a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/15">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🧴
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-playfair text-[#1a0a10] dark:text-white font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <RiDeleteBin6Line
                      className="text-[#e91e8c]/40 hover:text-red-500 transition h-5 w-5 cursor-pointer flex-shrink-0"
                      onClick={() => removeItem(item.id)}
                    />
                  </div>
                  <p className="text-[#e91e8c] dark:text-[#c9a84c] font-inter font-bold text-sm mt-1">
                    ₦{Number(item.price).toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty control */}
                    <div className="flex items-center border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 rounded-lg overflow-hidden">
                      <button
                        className="px-3 py-1.5 text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 transition text-sm font-bold"
                        onClick={() => handleDecrease(item.id)}
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-[#1a0a10] dark:text-white font-bold text-sm min-w-8 text-center border-x border-[#e91e8c]/15 dark:border-[#c9a84c]/20">
                        {quantity}
                      </span>
                      <button
                        className="px-3 py-1.5 text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 transition text-sm font-bold"
                        onClick={() => handleIncrease(item.id)}
                        disabled={quantity >= (item.stock || 99)}
                      >
                        +
                      </button>
                    </div>

                    <p className="font-inter font-bold text-sm text-[#1a0a10] dark:text-[#f5e6a8]">
                      ₦{subTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr] items-center">
                {/* Product */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#fce4f3] to-[#fff8f0] dark:from-[#1a0a10] dark:to-[#0a0f1a] border border-[#e91e8c]/15 dark:border-[#c9a84c]/15">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        🧴
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-playfair text-[#1a0a10] dark:text-white font-semibold text-sm">
                      {item.name}
                    </p>
                    <p className="text-[#e91e8c]/50 dark:text-white/40 text-xs font-inter mt-0.5">
                      {item.category || "Perfume"}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <p className="text-center font-inter text-sm font-semibold text-[#e91e8c] dark:text-[#c9a84c]">
                  ₦{Number(item.price).toLocaleString()}
                </p>

                {/* Quantity */}
                <div className="flex justify-center">
                  <div className="flex items-center border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-2 text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10 transition font-bold"
                      onClick={() => handleDecrease(item.id)}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-[#1a0a10] dark:text-white font-bold min-w-8 text-center border-x border-[#e91e8c]/15 dark:border-[#c9a84c]/20 text-sm">
                      {quantity}
                    </span>
                    <button
                      className="px-3 py-2 text-[#e91e8c] dark:text-[#c9a84c] hover:bg-[#e91e8c]/10 dark:hover:bg-[#c9a84c]/10 transition font-bold"
                      onClick={() => handleIncrease(item.id)}
                      disabled={quantity >= (item.stock || 99)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + Delete */}
                <div className="flex items-center justify-end gap-4">
                  <p className="font-inter font-bold text-sm text-[#1a0a10] dark:text-[#f5e6a8]">
                    ₦{subTotal.toLocaleString()}
                  </p>
                  <RiDeleteBin6Line
                    className="text-[#e91e8c]/40 dark:text-[#c9a84c]/50 hover:text-red-500 transition h-5 w-5 cursor-pointer hover:bg-red-500/10 rounded p-0.5"
                    onClick={() => removeItem(item.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartList;
