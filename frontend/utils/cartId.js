export const getOrCreateCartId = () => {
  let cartId = localStorage.getItem("cart_id");

  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cart_id", cartId);
    console.log("🆕 New cart created:", cartId);
  }

  return cartId;
};
