import { useContext } from "react";
import ProductContext from "../context/ProductContext";

export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProvider must be within a ProductProvider");
  }
  return context;
}
