import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../hook/useCart";
import { useProduct } from "../hook/useProduct";
import { useEffect } from "react";

function ProductModal({ productId, onClose }) {
  const { addItem, updateQuantity, removeItem, cart } = useCart();
  const { currentProduct, loading, fetchCurrentProduct, error } = useProduct();

  const currentItem = cart.find((item) => item.product_id === productId);
  const quantity = currentItem?.quantity || 0;

  const handleIncrease = () => {
    if (!currentItem) {
      const finalPrice = currentProduct.discount > 0 
        ? currentProduct.price - (currentProduct.price * (currentProduct.discount / 100)) 
        : currentProduct.price;
        
      addItem({
        ...currentProduct,
        price: finalPrice
      });
    } else {
      updateQuantity(currentItem.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (!currentItem) return;
    if (quantity > 1) {
      updateQuantity(currentItem.id, quantity - 1);
    } else {
      removeItem(currentItem.id);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchCurrentProduct(productId);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [productId]);

  if (!productId) return null;

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 dark:border-zinc-800 dark:border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl text-center shadow-2xl border border-red-100 dark:border-red-900/30">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 text-sm underline opacity-70"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!currentProduct) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 bg-white dark:bg-neutral-950 rounded-[2rem] overflow-hidden max-w-lg w-full shadow-2xl border border-pink-50 dark:border-zinc-800 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-black/50 text-neutral-800 dark:text-gold-400 hover:scale-110 transition-transform"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div className="relative h-72 overflow-hidden">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
              {currentProduct.name}
            </h2>
            <div className="text-right">
              <p className="text-xl font-semibold text-pink-600 dark:text-gold-500">
                ₦{Number(currentProduct.discount > 0 ? currentProduct.price - (currentProduct.price * (currentProduct.discount / 100)) : currentProduct.price).toLocaleString()}
              </p>
              {currentProduct.discount > 0 && (
                <p className="text-sm line-through text-neutral-400">
                  ₦{Number(currentProduct.price).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8">
            {currentProduct.description}
          </p>

          <div className="flex flex-col gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-neutral-50 dark:bg-zinc-900/50 p-2 rounded-2xl border border-neutral-100 dark:border-zinc-800">
              <span className="ml-4 text-sm font-medium text-neutral-400 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrease}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm text-neutral-600 dark:text-gold-400 hover:bg-pink-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-lg min-w-[20px] text-center dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm text-neutral-600 dark:text-gold-400 hover:bg-pink-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => {
                const finalPrice = currentProduct.discount > 0 
                  ? currentProduct.price - (currentProduct.price * (currentProduct.discount / 100)) 
                  : currentProduct.price;
                  
                addItem({
                  ...currentProduct,
                  price: finalPrice
                });
              }}
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200 
                dark:bg-gold-500 dark:hover:bg-gold-600 dark:text-black dark:shadow-gold-900/20 shadow-lg"
            >
              <ShoppingBag size={18} />
              {quantity > 0 ? "Add More to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
