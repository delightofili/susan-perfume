
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { getOrders } from "../../api/index.js";

const BASE_URL = import.meta.env.VITE_API_URL;

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setOrdersLoading(false);
      });
  }, []);

  // ── Update order status ──────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Filter ──────────────────────────────────────
  const filtered = orders
    .filter((o) => activeTab === "All" || o.status === activeTab)
    .filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        o.customer?.toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.email?.toLowerCase().includes(q)
      );
    });

  const statuses = ["Pending", "Processing", "Shipped", "Completed", "Refunded"];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-playfair">Orders</h1>
          <p className="font-inter text-white/20 mt-1 text-sm">
            {orders.length} orders total
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-[#c9a84c]/20 rounded-xl px-3 py-2">
          <span className="text-white/30 text-sm">🔍</span>
          <input
            className="bg-transparent text-sm text-white/60 font-inter outline-none w-48 placeholder:text-white/20"
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-white/20 hover:text-white/50 text-xs transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: orders.length, color: "text-[#f5e6a8]" },
          { label: "Completed", value: orders.filter((o) => o.status === "Completed").length, color: "text-green-400" },
          { label: "Pending", value: orders.filter((o) => o.status === "Pending").length, color: "text-orange-400" },
          {
            label: "Revenue",
            value: "₦" + (orders.reduce((sum, o) => sum + Number(o.total || 0), 0) / 1000).toFixed(0) + "k",
            color: "text-[#c9a84c]",
          },
        ].map((stat) => (
          <div key={stat.label} className="py-4 px-4 rounded-2xl bg-white/5 shadow shadow-[#c9a84c]/30 border border-[#c9a84c]/10">
            <p className="text-[#f5e6a8]/50 font-inter text-xs mb-1">{stat.label}</p>
            <h2 className={`font-playfair text-2xl ${stat.color}`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none border-b border-[#c9a84c]/15">
        {["All", "Completed", "Pending", "Processing", "Shipped", "Refunded"].map((tab) => {
          const count = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-inter whitespace-nowrap border-b-2 transition-all ${activeTab === tab
                ? "border-[#c9a84c] text-[#c9a84c]"
                : "border-transparent text-[#f5e6a8]/40 hover:text-[#f5e6a8]/70"
                }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-white/5 text-white/30"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Loading ── */}
      {ordersLoading ? (
        <div className="text-[#c9a84c] font-playfair text-xl animate-pulse text-center py-10">
          Loading orders...
        </div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="hidden md:block rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#c9a84c]/10">
                  {["Order ID", "Customer", "Date", "Items", "Status", "Total", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-[#f5e6a8]/30 font-inter">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} className={`border-b border-[#c9a84c]/5 hover:bg-[#c9a84c]/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}>
                    <td className="px-5 py-4 text-[#f5e6a8]/40 font-inter text-xs">
                      #{order.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-sm font-playfair shrink-0">
                          {order.customer?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-[#f5e6a8] text-sm font-inter">{order.customer}</p>
                          <p className="text-[#f5e6a8]/30 text-xs font-inter">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#f5e6a8]/40 font-inter text-xs">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-[#f5e6a8]/40 font-inter text-xs">
                      {order.items} {order.items === 1 ? "item" : "items"}
                    </td>
                    <td className="px-5 py-4">
                      {/* Clickable status dropdown */}
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-transparent border-none outline-none cursor-pointer text-xs font-inter"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-[#0a0f1a]">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[#c9a84c] font-inter text-sm font-medium">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#f5e6a8]/20 font-inter text-sm">
                No orders found
              </div>
            )}

            <div className="flex items-center justify-between px-5 py-4 border-t border-[#c9a84c]/10">
              <p className="text-xs text-[#f5e6a8]/20 font-inter">
                Showing {filtered.length} of {orders.length} orders
              </p>
            </div>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#f5e6a8]/30 font-inter text-xs">#{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] text-sm font-playfair">
                      {order.customer?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-[#f5e6a8] text-sm font-inter">{order.customer}</p>
                      <p className="text-[#f5e6a8]/30 text-xs font-inter">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-NG") : "—"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#c9a84c] font-inter font-medium text-sm">
                    ₦{Number(order.total).toLocaleString()}
                  </p>
                </div>
                {/* Mobile status update */}
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="bg-white/5 border border-[#c9a84c]/20 text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer font-inter w-full"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="bg-[#0a0f1a]">{s}</option>
                  ))}
                </select>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#f5e6a8]/20 font-inter text-sm">
                No orders found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersSection;