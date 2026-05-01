import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import NewArrivals from "./components/NerArrivals";
import Bestseller from "./components/Bestseller";
import { Routes, Route, Navigate } from "react-router";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import { getOrCreateCartId } from "../utils/cartId";

//admin
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./admin/context/AuthContext";
import ClientLayout from "./components/ClientLayout";
import AdminLayout from "./components/AdminLayout";
import { useEffect } from "react";
import OrderConfirmation from "./pages/Orderconfirmation";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";

import ScrollToTop from "../utils/ScrollToTop";
import Contact from "./components/Contact";

function App() {
  useEffect(() => {
    getOrCreateCartId();
  }, []);
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* CLIENT ROUTES */}
          <Route element={<ClientLayout />}>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Bestseller />
                  <About />
                  <NewArrivals />
                </>
              }
            />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
          </Route>

          {/* ADMIN LOGIN — public */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN ROUTES — all protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect /admin → /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<div>404</div>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
