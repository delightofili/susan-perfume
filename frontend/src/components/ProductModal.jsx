import { X } from "lucide-react";
import { useCart } from "../hook/useCart";
import { useProduct } from "../hook/useProduct";
import { useEffect } from "react";

function ProductModal({ productId, onClose }) {
  const { addItem, updateQuantity, removeItem, cart } = useCart();
  const { currentProduct, loading, fetchCurrentProduct, error } = useProduct();

  // ✅ Find this product inside cart
  const currentItem = cart.find((item) => item.product_id === productId);

  const quantity = currentItem?.quantity || 0;

  const handleIncrease = () => {
    if (!currentItem) {
      addItem(currentProduct);
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
    }
  }, [productId]);

  if (!productId) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!currentProduct) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 bg-white rounded-2xl p-6 max-w-xl w-full">
        <img
          src={currentProduct.image}
          alt={currentProduct.name}
          className="w-full h-60 object-cover rounded-xl"
        />

        <h2 className="text-xl font-bold mt-4">{currentProduct.name}</h2>

        <p className="text-lg mt-2">
          ₦{Number(currentProduct.price).toLocaleString()}
        </p>

        {/* ✅ Quantity Control */}
        <div className="flex items-center gap-3 mt-4">
          <button onClick={handleDecrease}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrease}>+</button>
        </div>

        <button
          onClick={() => addItem(currentProduct)}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>
      </div>
    </div>
  );
}

export default ProductModal;
