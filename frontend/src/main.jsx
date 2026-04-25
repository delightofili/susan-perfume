import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { CartProvider } from "./context/CartContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
