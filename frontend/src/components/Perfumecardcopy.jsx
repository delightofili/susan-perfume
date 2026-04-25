import { useNavigate } from "react-router";

function PerfumeCard({ image, name, price, discount, category, id, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/shop/${id}`);
    }
  };

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden
                 border border-pink-blush/15  dark:border-[#c9a84c]/10
                 bg-white dark:bg-white/3
                 dark:hover:border-[#c9a84c]/40 hover:border-pink-blush/40 hover:shadow-xl
                 hover:-translate-y-1
                 transition-all duration-300 h-full"
    >
      {/* ── Image Area ── */}
      <div
        className="relative flex items-center justify-center
                   bg-gradient-to-b from-[#fdf0f5] to-[#fff8f0]
                   dark:from-[#1a0a10]/60 dark:to-[#0a0f1a]
                   h-[200px] md:h-[220px]"
      >
        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 font-inter bg-[#c2185b] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] text-[10px] font-bold px-2 py-1 rounded-sm tracking-wide z-10">
            {discount}
          </span>
        )}

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white dark:bg-white/10 border border-[#c9a84c]/25 flex items-center justify-center text-[#c2185b] dark:text-[#c9a84c]/70 hover:scale-110 transition text-sm z-10">
          ♡
        </button>

        {/* Product image */}
        <div className="w-full h-full flex items-center justify-center p-4">
          {image}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        {category && (
          <p className="font-inter text-[#7a4a5a] dark:text-white/40 text-[10px] tracking-[1.5px] uppercase">
            {category}
          </p>
        )}

        {/* Name */}
        <p className="font-playfair text-[#1a0a10] dark:text-white text-base font-medium leading-tight">
          {name}
        </p>

        {/* Price */}
        <div className="mt-auto pt-2">
          <span className="font-inter text-pink-blush dark:text-[#c9a84c] font-bold text-base">
            {price}
          </span>
        </div>

        {/* Button */}
        <button
          className="w-full mt-2 py-2.5 font-cinzel text-[11px] tracking-[2px] uppercase
                     bg-pure-white dark:bg-[#c9a84c]/15 text-pink-600 font-bold
                     dark:text-[#c9a84c] border border-pink dark:border-[#c9a84c]/30
                     rounded-sm
                     hover:bg-pink-blush hover:border-pink-blush hover:text-white
                     dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1a]
                     transition-all duration-200 cursor-pointer"
          onClick={handleClick}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default PerfumeCard;
