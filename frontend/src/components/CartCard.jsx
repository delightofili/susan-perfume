import { RiDeleteBin6Line } from "react-icons/ri";
import OrderSummary from "./OrderSummary";

function CartCard({ item }) {
  return (
    <div className="bg-primary-black/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid md:grid-cols-6 grid-cols-3  text-[#f5e6a8] font-inter px-6 py-3 text-sm">
        <p className="md:col-span-2">Product</p>
        <p className="text-center">Price</p>
        <p className="text-center">Quantity</p>
        <p className="text-center md:block hidden">Subtotal</p>
        <p className="text-center md:block hidden"></p>
      </div>

      <div className="h-px w-full bg-solid-gold/20" />

      {/* Cart Row */}
      <div className="grid md:grid-cols-6 grid-cols-3 items-center px-6 py-5 font-playfair ">
        {/* Product */}
        <div className="md:col-span-2 md:flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/10" />
          <div>
            <p className="text-warm-cream">{item.name}</p>
            <p className="text-warm-cream/40 text-sm">{item.size}</p>
          </div>
        </div>

        {/* Price */}
        <p className="text-warm-cream text-center">
          ₦{(item.price * item.quantity).toLocaleString()}
        </p>

        {/* Quantity */}
        <div>
          <div className="flex items-center">
            <button className="px-3 py-1 text-solid-gold bg-primary-charcoal-black/40 border border-solid-gold/30 rounded-l-md">
              –
            </button>
            <span className="px-4 py-1 text-warm-cream bg-primary-charcoal-black/40 border-y border-solid-gold/30">
              {item.quantity}
            </span>
            <button className="px-3 py-1 text-solid-gold bg-primary-charcoal-black/40 border border-solid-gold/30 rounded-r-md">
              +
            </button>
          </div>
        </div>

        {/* Subtotal + delete */}
        <div className="md:flex items-center justify-center  hidden ">
          <p className="text-warm-cream">{item.price}</p>
        </div>

        <div className="flex items-center justify-end">
          <RiDeleteBin6Line className=" text-solid-gold h-8 w-8 hover:text-red-500 transition cursor-pointer hidden md:flex items-center" />
        </div>
      </div>

      <div className="h-px w-full bg-solid-gold/10" />
      <div className="md:hidden block p-4">
        <OrderSummary />
      </div>
    </div>
  );
}

export default CartCard;
