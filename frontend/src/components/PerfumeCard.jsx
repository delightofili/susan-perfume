import { useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import { useToast } from "../hook/useToast";

function PerfumeCard({
  imageUrl,
  image,
  name,
  price,
  discount,
  size,
  category,
  id,
  onClick,
}) {
  const navigate = useNavigate();
  const { cart, addItem, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  // Find if this product is already in cart
  const cartItem = cart.find((item) => {
    return String(item.product_id) === String(id);
  });
  const quantity = cartItem?.quantity || 0;
  const inCart = quantity > 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addItem({
      id,
      name,
      price: Number(String(price).replace(/[₦,]/g, "")),
      image: imageUrl || null,
      category,
      size,
    });
    showToast({ message: `${name} added to cart`, type: "success" });
  };

  const handleIncrease = async (e) => {
    e.stopPropagation();
    await updateQuantity(cartItem.id, quantity + 1);
    showToast({ message: `${quantity + 1} ${name} in cart`, type: "success" });
  };

  const handleDecrease = async (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      await removeItem(cartItem.id);
      showToast({ message: `${name} removed from cart`, type: "remove" });
    } else {
      await updateQuantity(cartItem.id, quantity - 1);
      showToast({
        message: `${quantity - 1} ${name} in cart`,
        type: "success",
      });
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/shop/${id}`);
  };

  const displayPrice =
    typeof price === "number" ? `₦${price.toLocaleString()}` : price;

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer shimmer-card
                 border border-[#e91e8c]/15 dark:border-[#c9a84c]/10
                 bg-white dark:bg-white/[0.03]
                 hover:border-[#e91e8c]/40 dark:hover:border-[#c9a84c]/40
                 hover:shadow-xl hover:shadow-[#e91e8c]/10 dark:hover:shadow-[#c9a84c]/5
                 hover:-translate-y-1.5
                 transition-all duration-300 h-full"
      onClick={handleCardClick}
    >
      {/* ── Image Area ── */}
      <div className="relative flex items-center justify-center bg-gradient-to-b from-[#fce4f3] to-[#fff8f0] dark:from-[#1a0a10]/60 dark:to-[#0a0f1a] h-[200px] md:h-[220px] overflow-hidden">
        {discount && (
          <span className="absolute top-3 left-3 font-inter bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-[10px] font-bold px-2 py-1 rounded-sm tracking-wide z-10">
            {discount}
          </span>
        )}

        {/* Cart quantity badge on image */}
        {inCart && (
          <span className="absolute top-3 right-3 min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-[10px] font-bold font-inter flex items-center justify-center z-10">
            {quantity}
          </span>
        )}

        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
          {image}
        </div>
      </div>

      {/* ── Info ── */}
      <div
        className="flex flex-col flex-1 p-4 gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {category && (
            <p className="font-inter text-[#e91e8c]/60 dark:text-white/40 text-[10px] tracking-[1.5px] uppercase">
              {category} .
            </p>
          )}{" "}
          {size && (
            <span className="font-inter text-[#e91e8c]/60 dark:text-white/40 text-[10px] tracking-[1.5px] uppercase">
              ({size}Ml)
            </span>
          )}
        </div>

        <p className="font-playfair text-[#1a0a10] dark:text-white text-base font-medium leading-tight">
          {name}
        </p>

        <div className="mt-auto pt-2">
          <span className="font-inter text-[#e91e8c] dark:text-[#c9a84c] font-bold text-base">
            {displayPrice}
          </span>
        </div>

        {/* Button transforms into controls */}
        {!inCart ? (
          <button
            className="w-full mt-2 py-2.5 font-cinzel text-[11px] tracking-[2px] uppercase rounded-sm
                       bg-[#e91e8c] dark:bg-[#c9a84c]/15
                       text-white dark:text-[#c9a84c]
                       border border-[#e91e8c] dark:border-[#c9a84c]/30
                       hover:bg-[#c2185b] hover:border-[#c2185b]
                       dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
                       transition-all duration-200 hover:scale-[1.02] active:scale-95
                       shadow-md shadow-[#e91e8c]/20 dark:shadow-none"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center mt-2 rounded-sm overflow-hidden border border-[#e91e8c]/30 dark:border-[#c9a84c]/30">
            <button
              className="flex-1 py-2.5 font-bold text-lg leading-none
                         text-[#e91e8c] dark:text-[#c9a84c] bg-[#fff0f7] dark:bg-[#c9a84c]/10
                         hover:bg-red-50 hover:text-red-500
                         dark:hover:bg-red-900/40 dark:hover:text-red-400
                         transition-all duration-200"
              onClick={handleDecrease}
            >
              −
            </button>
            <div
              className="flex-1 py-2.5 text-center font-inter font-bold text-sm
                            text-[#e91e8c] dark:text-[#c9a84c] bg-[#fce4f3]/50 dark:bg-[#c9a84c]/5
                            border-x border-[#e91e8c]/20 dark:border-[#c9a84c]/20"
            >
              {quantity}
            </div>
            <button
              className="flex-1 py-2.5 font-bold text-lg leading-none
                         text-[#e91e8c] dark:text-[#c9a84c] bg-[#fff0f7] dark:bg-[#c9a84c]/10
                         hover:bg-[#e91e8c] hover:text-white
                         dark:hover:bg-[#c9a84c]/20
                         transition-all duration-200"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfumeCard;
