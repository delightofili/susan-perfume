import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext.js";
import { AuthProvider } from "../context/AuthContext.js";
import { CartProvider } from "../context/CartContext.js";
import { ToastProvider } from "../context/ToastContext.js";
import NavBar from "../components/NavBar.js";
import Footer from "../components/Footer.js";
import ToastContainer from "../components/Toast.js";

export const metadata: Metadata = {
  title: "Susan Luxury Perfumes | Haute Parfumerie Royale",
  description: "Handcrafted, unrepeatable luxury fragrances infused with precious botanical oils and authentic oud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Paystack Inline JS */}
        <script src="https://js.paystack.co/v1/inline.js" async />
      </head>
      <body className="bg-white dark:bg-[#070b14] text-gray-900 dark:text-white transition-colors duration-300 min-h-screen flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <NavBar />
                <main className="flex-1">{children}</main>
                <Footer />
                <ToastContainer />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
