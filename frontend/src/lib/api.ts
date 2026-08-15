import { Product, CartItem, Order, User } from "../types/index.js";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

// ── PRODUCTS ────────────────────────────────────────────────────────
export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create product" }));
    throw new Error(err.error || "Failed to create product");
  }
  return res.json();
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
};

// ── CART ────────────────────────────────────────────────────────────
export const getCart = async (cartId: string): Promise<CartItem[]> => {
  const res = await fetch(`${BASE_URL}/cart?cartId=${encodeURIComponent(cartId)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

export const addToCartApi = async (payload: {
  cartId: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
}): Promise<CartItem> => {
  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add item to cart");
  return res.json();
};

export const updateCartQtyApi = async (id: string, quantity: number): Promise<CartItem> => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  return res.json();
};

export const removeFromCartApi = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/cart/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove item from cart");
};

export const clearCartApi = async (cartId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/cart/clear/${cartId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to clear cart");
};

// ── ORDERS ──────────────────────────────────────────────────────────
export const getOrders = async (): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders`, { headers: getHeaders(), cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

export const getOrderByRef = async (reference: string): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/orders/reference/${encodeURIComponent(reference)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Order reference not found");
  return res.json();
};

export const createOrderApi = async (orderData: Partial<Order>): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const updateOrderApi = async (id: string, updates: Partial<Order>): Promise<Order> => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
};

// ── AUTH ────────────────────────────────────────────────────────────
export const loginApi = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Invalid credentials" }));
    throw new Error(err.error || "Invalid credentials");
  }
  return res.json();
};

export const meApi = async (): Promise<{ user: User }> => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};
