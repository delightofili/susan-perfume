import { useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import { useToast } from "../hook/useToast";

function PerfumeCard({
  imageUrl,
  image,
  name,
  price,
  discount,
  originalPrice, // e.g. "₦22,500" — show struck-through when provided
  size,
  category,
  id,
  onClick,
}) {
  const navigate = useNavigate();
  const { cart, addItem, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const cartItem = cart.find((item) => String(item.product_id) === String(id));
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
      showToast({ message: `${quantity - 1} ${name} in cart`, type: "success" });
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/shop/${id}`);
  };

  const displayPrice =
    typeof price === "number" ? `₦${price.toLocaleString()}` : price;

  // Derive a numeric discount % if discount is something like "20%" or 20
  const discountLabel =
    discount != null && discount !== ""
      ? typeof discount === "number"
        ? `${discount}% OFF`
        : String(discount).includes("%")
        ? `${discount} OFF`
        : discount
      : null;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer
                 bg-white dark:bg-[#0d0818]
                 border border-[#e91e8c]/12 dark:border-[#c9a84c]/12
                 hover:border-[#e91e8c]/50 dark:hover:border-[#c9a84c]/40
                 shadow-sm hover:shadow-2xl hover:shadow-[#e91e8c]/12 dark:hover:shadow-[#c9a84c]/8
                 hover:-translate-y-2
                 transition-all duration-400 h-full"
    >
      {/* ══════════════════════════════════════
          IMAGE AREA
      ══════════════════════════════════════ */}
      <div className="relative overflow-hidden h-[230px] md:h-[255px]">

        {/* Layered background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fce4f3] via-[#fff4fb] to-[#fff8f0]
                        dark:from-[#1a0410] dark:via-[#0d0818] dark:to-[#0a0f1a] z-0" />

        {/* Diagonal accent stripe — subtle */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(233,30,140,0.10) 0%, transparent 50%, rgba(201,168,76,0.10) 100%)",
          }}
        />

        {/* Soft inner glow ring behind image */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(233,30,140,0.12) 0%, transparent 65%)",
          }}
        />

        {/* ── Actual image ── */}
        <div className="absolute inset-0 z-10 transition-transform duration-500 group-hover:scale-107">
          {image}
        </div>

        {/* ── Top-left: Discount ribbon ── */}
        {discountLabel && (
          <div className="absolute top-0 left-0 z-20">
            <div
              className="font-inter font-extrabold text-[10px] tracking-[1px] uppercase
                         text-white px-3 py-1.5 leading-none"
              style={{
                background: "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)",
                clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
                paddingRight: "18px",
              }}
            >
              {discountLabel}
            </div>
          </div>
        )}

        {/* ── Top-right: Cart quantity badge ── */}
        {inCart && (
          <span
            className="absolute top-3 right-3 z-20 min-w-[22px] h-[22px] px-1.5 rounded-full
                       bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a]
                       text-[10px] font-bold font-inter flex items-center justify-center
                       shadow-lg shadow-[#e91e8c]/30 dark:shadow-[#c9a84c]/30"
          >
            {quantity}
          </span>
        )}

        {/* ── Bottom: category + size pill ── */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
          {category && (
            <span
              className="font-cinzel text-[8px] tracking-[2px] uppercase px-2.5 py-1 rounded-full
                         backdrop-blur-md border
                         bg-white/60 dark:bg-black/40
                         border-[#e91e8c]/25 dark:border-[#c9a84c]/25
                         text-[#e91e8c] dark:text-[#c9a84c]"
            >
              {category}
            </span>
          )}
          {size && (
            <span
              className="font-inter text-[8px] tracking-[1px] uppercase px-2.5 py-1 rounded-full
                         backdrop-blur-md border
                         bg-white/60 dark:bg-black/40
                         border-[#e91e8c]/20 dark:border-[#c9a84c]/20
                         text-[#7a4a5a] dark:text-white/50"
            >
              {size}ml
            </span>
          )}
        </div>

        {/* ── Bottom-right: "View" hint on hover ── */}
        <div
          className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100
                     transition-opacity duration-300"
        >
          <span
            className="font-cinzel text-[8px] tracking-[2px] uppercase px-2.5 py-1 rounded-full
                       bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] shadow"
          >
            View →
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CARD BODY
      ══════════════════════════════════════ */}
      <div
        className="relative flex flex-col flex-1 px-4 pt-4 pb-4 gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top separator line */}
        <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#e91e8c]/20 dark:via-[#c9a84c]/15 to-transparent" />

        {/* Name */}
        <p className="font-playfair text-[#1a0a10] dark:text-white text-[1.05rem] font-semibold leading-snug mt-1">
          {name}
        </p>

        {/* Scent descriptor — small decorative text */}
        <p className="font-inter text-[10px] tracking-[1.5px] uppercase text-[#e91e8c]/50 dark:text-[#c9a84c]/45">
          ✦ Luxury Fragrance
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-inter text-[#e91e8c] dark:text-[#c9a84c] font-extrabold text-[1.1rem] leading-none">
            {displayPrice}
          </span>
          {originalPrice && (
            <span className="font-inter text-[#7a4a5a]/55 dark:text-white/30 text-[0.75rem] line-through leading-none">
              {originalPrice}
            </span>
          )}
          {discountLabel && (
            <span className="font-inter text-[10px] font-bold text-[#e91e8c] dark:text-[#c9a84c] bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 px-1.5 py-0.5 rounded-md leading-none">
              {discountLabel}
            </span>
          )}
        </div>

        {/* ── Add to Cart / Stepper ── */}
        <div className="mt-3">
          {!inCart ? (
            <button
              className="w-full py-2.5 font-cinzel text-[10px] tracking-[2.5px] uppercase rounded-xl
                         relative overflow-hidden group/btn
                         bg-[#e91e8c] dark:bg-transparent
                         text-white dark:text-[#c9a84c]
                         border border-[#e91e8c] dark:border-[#c9a84c]/40
                         hover:border-[#c2185b]
                         dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a] dark:hover:border-[#c9a84c]
                         transition-all duration-300 hover:scale-[1.02] active:scale-95
                         shadow-md shadow-[#e91e8c]/20 dark:shadow-none
                         animate-pink-glow dark:animate-none"
              onClick={handleAddToCart}
            >
              {/* Shimmer sweep on hover — light mode */}
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%]
                           transition-transform duration-500
                           bg-gradient-to-r from-transparent via-white/20 to-transparent
                           pointer-events-none"
              />
              <span className="relative z-10">Add to Cart</span>
            </button>
          ) : (
            <div
              className="flex items-center rounded-xl overflow-hidden
                         border border-[#e91e8c]/30 dark:border-[#c9a84c]/30"
            >
              <button
                className="flex-1 py-2.5 font-bold text-lg leading-none
                           text-[#e91e8c] dark:text-[#c9a84c]
                           bg-[#fff0f7] dark:bg-[#c9a84c]/10
                           hover:bg-red-50 hover:text-red-500
                           dark:hover:bg-red-900/40 dark:hover:text-red-400
                           transition-all duration-200"
                onClick={handleDecrease}
              >
                −
              </button>
              <div
                className="flex-1 py-2.5 text-center font-inter font-bold text-sm
                           text-[#e91e8c] dark:text-[#c9a84c]
                           bg-[#fce4f3]/50 dark:bg-[#c9a84c]/5
                           border-x border-[#e91e8c]/20 dark:border-[#c9a84c]/20"
              >
                {quantity}
              </div>
              <button
                className="flex-1 py-2.5 font-bold text-lg leading-none
                           text-[#e91e8c] dark:text-[#c9a84c]
                           bg-[#fff0f7] dark:bg-[#c9a84c]/10
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

      {/* Bottom accent line — animates in on hover */}
      <div
        className="absolute bottom-0 inset-x-0 h-[3px] scale-x-0 group-hover:scale-x-100
                   origin-left transition-transform duration-500 rounded-b-2xl"
        style={{
          background: "linear-gradient(to right, #e91e8c, #ff6ec7, #c9a84c)",
        }}
      />
    </div>
  );
}

export default PerfumeCard;
