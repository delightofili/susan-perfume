// src/context/ProductContext.jsx

import { createContext, useEffect, useReducer } from "react";

const ProductContext = createContext();
export default ProductContext;

// ──  ──
/* const BASE_URL = import.meta.env.VITE_API_URL || ""; */

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
        error: null,
      };
    case "SET_CURRENT_PRODUCT":
      return {
        ...state,
        currentProduct: action.payload,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      /* const res = await fetch(`${BASE_URL}/products`); */
      const res = await fetch(`/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      dispatch({ type: "SET_PRODUCTS", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const fetchCurrentProduct = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await fetch(`/api/products/${id}`);
      /*  const res = await fetch(`${BASE_URL}/products/${id}`); */
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      dispatch({ type: "SET_CURRENT_PRODUCT", payload: data });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        currentProduct: state.currentProduct,
        loading: state.loading,
        error: state.error,
        fetchProducts,
        fetchCurrentProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
