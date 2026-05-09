import { useState, useEffect } from "react";
import CartList from "../components/CartList";
import GoldDividerDot from "../components/GoldDividerDot";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../hook/useCart";
import { Link } from "react-router";
import StatusBadge from "../admin/components/StatusBadge";
import supabase from "../api/supabaseClient";

function Cart() {
  const { totalItems, cart, loading, error } = useCart();

  const [activeTab, setActiveTab] = useState("cart");

  /*   const [pastOrders, setPastOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("my_orders") || "[]");
  }); */

  const [pastOrders, setPastOrders] = useState([]);
  /* 
  useEffect(() => {
    const handler = () => {
      setPastOrders(JSON.parse(localStorage.getItem("my_orders") || "[]"));
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []); */

  const guestId = localStorage.getItem("guest_id") || crypto.randomUUID();
  localStorage.setItem("guest_id", guestId);

  const getItemCount = (order) => {
    if (typeof order.item_count === "number") return order.item_count;

    if (Array.isArray(order.items)) return order.items.length;

    // handle JSON string from DB
    if (typeof order.items === "string") {
      try {
        const parsed = JSON.parse(order.items);
        return Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        return 0;
      }
    }

    return 0;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const guestId = localStorage.getItem("guest_id");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("guest_id", guestId)
        .order("created_at", { ascending: false });

      if (!error) setPastOrders(data || []);
    };

    fetchOrders();
  }, []);

  return (
    <section className="min-h-screen w-full relative overflow-hidden">
      {/* backgroundsss */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]"
      />

      <div
        className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#fcd6eb_0%,#fdf2f8_45%,#fff8f0_100%)]"
      />

      <div
        className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none
        bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_70%)]"
      />

      <div
        className="absolute bottom-0 left-1/3 w-[280px] h-[280px] rounded-full pointer-events-none animate-orb-drift-reverse
        bg-[radial-gradient(circle,rgba(233,30,140,0.15)_0%,transparent_70%)]"
      />

      <div className="relative z-40">
        {/* title */}
        <div className="flex flex-col items-center py-8">
          <h1 className="text-pink-blush dark:text-[#f5e6a8] text-3xl md:text-4xl font-playfair mb-4">
            {activeTab === "cart" ? "Your Shopping Cart" : "My Orders"}
          </h1>

          <GoldDividerDot />

          {/* keep original cart count ONLY on cart tab */}
          {activeTab === "cart" && (
            <p className="text-warm-cream text-xl mt-4">
              {totalItems === 0
                ? "Cart is empty"
                : `${totalItems} item${totalItems > 1 ? "s" : ""}`}
            </p>
          )}
        </div>

        {/* Tabs  */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("cart")}
            className={`px-5 py-2 text-sm border rounded-full transition ${
              activeTab === "cart"
                ? "bg-pink-blush text-white"
                : "text-pink-blush border-pink-blush/40"
            }`}
          >
            Cart ({totalItems})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 text-sm border rounded-full transition ${
              activeTab === "orders"
                ? "bg-pink-blush text-white"
                : "text-pink-blush border-pink-blush/40"
            }`}
          >
            Orders ({pastOrders.length})
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-8 pb-16">
          {/* ───────── CART TAB ───────── */}
          {activeTab === "cart" && (
            <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-10">
              <div>
                {loading && (
                  <p className="text-warm-cream text-center py-12">
                    Loading...
                  </p>
                )}

                {error && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <p className="text-4xl">🛒</p>
                    <p className="text-warm-cream/60 font-inter text-sm text-center">
                      Having trouble loading your cart. Please{" "}
                      <Link>refresh</Link>.
                    </p>
                  </div>
                )}

                {cart.length > 0 ? (
                  <CartList cartItems={cart} />
                ) : (
                  <div className="bg-primary-black/5 dark:bg-primary-black/20 rounded-2xl p-16 text-center border border-pink-blush/10 dark:border-[#c9a84c]/10">
                    <p className="text-pink-blush/60 dark:text-warm-cream/60 text-xl mb-6">
                      Your cart is empty
                    </p>

                    <Link
                      to="/shop"
                      className="inline-block px-8 py-3 rounded-xl font-bold uppercase text-white bg-[#e91e8c] dark:text-[#0a0f1a] dark:bg-[#c9a84c] hover:scale-[1.02] transition-all"
                    >
                      Start Shopping
                    </Link>

                    {/* small upgrade */}
                    {pastOrders.length > 0 && (
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="block mx-auto mt-6 text-sm underline text-pink-blush dark:text-[#c9a84c]"
                      >
                        View past orders →
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="md:block">
                <OrderSummary />
              </div>
            </div>
          )}

          {/* ───────── ORDERS TAB (NEW FEATURE) ───────── */}
          {activeTab === "orders" && (
            <>
              {pastOrders.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-warm-cream/60">No orders yet</p>

                  <Link
                    to="/shop"
                    className="inline-block mt-6 px-6 py-2 border border-pink-blush text-pink-blush rounded"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                  {pastOrders.map((o) => {
                    console.log("ORDER", o);
                    return (
                      <div
                        key={o.reference}
                        className="rounded-2xl border border-[#c9a84c]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden"
                      >
                        <div className="px-5 py-4 flex justify-between border-b border-[#c9a84c]/10">
                          <div>
                            <p className="text-xs opacity-50">Reference</p>
                            <p className="font-bold text-pink-blush dark:text-[#c9a84c]">
                              {o.reference}
                            </p>
                            <p className="text-xs opacity-50 mt-1">
                              {o.date ? new Date(o.date).toLocaleDateString() : ""}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={o.status || "Pending"} />
                            <p className="font-bold text-pink-blush dark:text-[#c9a84c]">
                              ₦{Number(o.total).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-wider mb-3 opacity-70">
                            {getItemCount(o)} item(s)
                          </p>
                          
                          <div className="flex flex-col gap-3">
                            {(() => {
                              let items = [];
                              if (Array.isArray(o.items)) items = o.items;
                              else if (typeof o.items === "string") {
                                try { items = JSON.parse(o.items) || []; } catch {}
                              }
                              
                              return items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-md bg-[#e91e8c]/5 dark:bg-black overflow-hidden flex-shrink-0 border border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-sm">🧴</div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-playfair text-sm dark:text-white truncate">{item.name}</p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-[#e91e8c]/5 dark:bg-black/20 flex justify-end">
                          <Link
                            to="/track-order"
                            state={{ reference: o.reference }}
                            className="text-xs font-bold text-[#e91e8c] dark:text-[#c9a84c] hover:underline"
                          >
                            Track Order →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Cart;
