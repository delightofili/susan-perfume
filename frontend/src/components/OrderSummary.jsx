import { useCart } from "../hook/useCart";
import GoldDividerDot from "./GoldDividerDot";
import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

function OrderSummary() {
  const navigate = useNavigate();
  const { totalItems, totalPrice, cart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // 15% discount
  const discountPercent = 0.15;
  const discountAmount = totalPrice * discountPercent;
  const finalTotal = totalPrice - discountAmount;

  const handlePromo = () => {
    if (promoCode.toLowerCase() === "susan15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="sticky top-4 rounded-2xl overflow-hidden border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 bg-white/70 dark:bg-black/60 backdrop-blur-sm mt-6 lg:mt-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#c9a84c]/15">
        <h2 className="font-playfair text-xl text-[#1a0a10] dark:text-[#f5e6a8]">
          Order Summary
        </h2>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Line items */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <p className="font-inter text-sm text-[#1a0a10]/60 dark:text-warm-cream/60">
              Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </p>
            <p className="font-inter text-sm font-semibold text-[#1a0a10] dark:text-warm-cream">
              ₦{totalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-inter text-sm text-[#1a0a10]/60 dark:text-warm-cream/60">
              Discount (15%)
            </p>
            <p className="font-inter text-sm font-semibold text-green-600 dark:text-green-400">
              − ₦{discountAmount.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-inter text-sm text-[#1a0a10]/60 dark:text-warm-cream/60">
              Shipping
            </p>
            <p className="font-inter text-sm font-semibold text-[#1a0a10] dark:text-warm-cream">
              Free
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <p className="font-playfair text-base text-[#1a0a10] dark:text-[#f5e6a8] font-semibold">
            Total
          </p>
          <p className="font-playfair text-xl text-pink-blush dark:text-[#c9a84c] font-bold">
            ₦{finalTotal.toLocaleString()}
          </p>
        </div>

        {/* Promo code */}
        <div className="flex flex-col gap-2">
          <p className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
            Promo Code
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoError("");
              }}
              placeholder="Enter code..."
              className="flex-1 px-3 py-2 rounded-lg text-sm font-inter
                         bg-white/50 dark:bg-black/30
                         border border-[#c9a84c]/20
                         text-[#1a0a10] dark:text-warm-cream
                         placeholder:text-[#1a0a10]/30 dark:placeholder:text-warm-cream/20
                         outline-none focus:border-[#c9a84c]/50 transition-all"
            />
            <button
              onClick={handlePromo}
              className="px-4 py-2 text-xs font-cinzel tracking-wider uppercase
                         border border-[#c9a84c]/40 rounded-lg
                         text-[#c9a84c] hover:bg-[#c9a84c]/10
                         transition-all"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="text-xs text-red-400 font-inter">{promoError}</p>
          )}
          {promoApplied && (
            <p className="text-xs text-green-500 font-inter">
              ✓ Promo code applied!
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        {/* Checkout button */}
        <button
          className="w-full py-4 font-cinzel text-sm tracking-[2px] uppercase
                     bg-[image:--luxury-gold-gradient]
                     text-[#1a0a10] dark:text-white font-bold
                     rounded-xl
                     hover:opacity-90 hover:shadow-lg hover:shadow-[#c9a84c]/20
                     transition-all duration-200 cursor-pointer"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>

        {/* Continue shopping */}
        <Link
          to="/shop"
          className="text-center font-inter text-xs text-[#1a0a10]/40 dark:text-white/40 hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors duration-200"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSummary;
