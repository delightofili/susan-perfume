"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { CartItem, Product } from "../types/index.js";
import {
  getCart,
  addToCartApi,
  updateCartQtyApi,
  removeFromCartApi,
  clearCartApi,
} from "../lib/api.js";
import { useToast } from "./ToastContext.js";

const getOrCreateCartId = (): string => {
  if (typeof window === "undefined") return "guest-cart-ssr";
  let cartId = localStorage.getItem("cart_id");
  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cart_id", cartId);
  }
  return cartId;
};

interface CartState {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string };

const initialState: CartState = {
  cart: [],
  loading: false,
  error: null,
};

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload, loading: false };
    case "ADD_ITEM": {
      const existing = state.cart.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id ? action.payload : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case "REMOVE_ITEM":
      return { ...state, cart: state.cart.filter((i) => i.id !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [], loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: true };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  loading: false,
  error: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { addToast } = useToast();

  const fetchCartItems = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const cartId = getOrCreateCartId();
      const items = await getCart(cartId);
      dispatch({ type: "SET_CART", payload: items });
    } catch (err: any) {
      console.error("Fetch cart error:", err);
      dispatch({ type: "SET_ERROR", payload: err.message });
    }
  };

  const addItem = async (product: Product) => {
    try {
      const cartId = getOrCreateCartId();
      const item = await addToCartApi({
        cartId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      dispatch({ type: "ADD_ITEM", payload: item });
      addToast(`Added "${product.name}" to cart!`, "success");
    } catch (err: any) {
      addToast(err.message || "Could not add item to cart", "error");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await removeFromCartApi(id);
      dispatch({ type: "REMOVE_ITEM", payload: id });
      addToast("Item removed from cart", "info");
    } catch (err: any) {
      addToast(err.message || "Failed to remove item", "error");
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await updateCartQtyApi(id, quantity);
      dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });
    } catch (err: any) {
      addToast(err.message || "Failed to update quantity", "error");
    }
  };

  const clearCart = async () => {
    try {
      const cartId = getOrCreateCartId();
      await clearCartApi(cartId);
      dispatch({ type: "CLEAR_CART" });
    } catch (err: any) {
      console.error("Clear cart error:", err);
    }
  };

  const totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        loading: state.loading,
        error: state.error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
