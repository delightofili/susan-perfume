import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { getOrders } from "../../api/index.js";
import supabase from "../../api/supabaseClient.js";

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getOrders()
      .then((data) => { setOrders(data); setOrdersLoading(false); })
      .catch((err) => { console.error(err); setOrdersLoading(false); });
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data, error } = await supabase.from("orders").update({ status: newStatus }).eq("id", Number(orderId)).select();
      if (error) { console.error("Supabase error:", error); return; }
      if (!data || data.length === 0) { console.error("⚠️ No rows updated — check RLS policies."); return; }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data[0] : o)));
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getItemCount = (order) => {
    if (typeof order.item_count === "number") return order.item_count;
    if (Array.isArray(order.items)) return order.items.length;
    if (typeof order.items === "string") {
      try { const parsed = JSON.parse(order.items); return Array.isArray(parsed) ? parsed.length : 0; } catch { return 0; }
    }
    return 0;
  };

  const filtered = orders
    .filter((o) => activeTab === "All" || o.status === activeTab)
    .filter((o) => {
      const q = searchQuery.toLowerCase();
      return o.customer?.toLowerCase().includes(q) || String(o.id).includes(q) || o.email?.toLowerCase().includes(q);
    });

  const statuses = ["Pending", "Pending Payment", "Paid", "Processing", "Shipped", "Delivered", "Refunded"];

  // ── shared classes ──
  const txt     = "text-[#1a0a10] dark:text-[#f5e6a8]";
  const txtMid  = "text-[#1a0a10]/60 dark:text-[#f5e6a8]/50";
  const txtFaint= "text-[#1a0a10]/40 dark:text-[#f5e6a8]/30";
  const accent  = "text-[#e91e8c] dark:text-[#c9a84c]";
  const cardBg  = "bg-white/80 dark:bg-white/5";
  const borderA = "border-[#e91e8c]/20 dark:border-[#c9a84c]/15";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold font-playfair ${accent}`}>Orders</h1>
          <p className={`font-inter mt-1 text-sm ${txtFaint}`}>{orders.length} orders total</p>
        </div>
        <div className={`flex items-center gap-2 ${cardBg} border ${borderA} rounded-xl px-3 py-2`}>
          <span className={`text-sm ${txtFaint}`}>🔍</span>
          <input
            className={`bg-transparent text-sm font-inter outline-none w-48 placeholder:text-[#1a0a10]/25 dark:placeholder:text-white/20 ${txt}`}
            placeholder="Search by name, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={`${txtFaint} hover:text-[#e91e8c] dark:hover:text-white text-xs transition-all`}>✕</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Orders",     value: orders.length,                                         color: accent },
          { label: "Delivered",        value: orders.filter((o) => o.status === "Delivered").length,  color: "text-green-600 dark:text-green-400" },
          { label: "Pending",          value: orders.filter((o) => o.status === "Pending").length,    color: "text-orange-500 dark:text-orange-400" },
          { label: "Pending Payment",  value: orders.filter((o) => o.status === "Pending Payment").length, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Processing",       value: orders.filter((o) => o.status === "Processing").length, color: "text-blue-600 dark:text-blue-400" },
          { label: "Shipped",          value: orders.filter((o) => o.status === "Shipped").length,    color: "text-purple-600 dark:text-purple-400" },
          {
            label: "Revenue",
            value: "₦" + (orders.reduce((sum, o) => sum + Number(o.total || 0), 0) / 1000).toFixed(0) + "k",
            color: accent,
          },
        ].map((stat) => (
          <div key={stat.label} className={`py-4 px-4 rounded-2xl ${cardBg} shadow shadow-[#e91e8c]/10 dark:shadow-[#c9a84c]/20 border ${borderA}`}>
            <p className={`font-inter text-xs mb-1 ${txtFaint}`}>{stat.label}</p>
            <h2 className={`font-playfair text-2xl ${stat.color}`}>{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex gap-1 overflow-x-auto scrollbar-none border-b border-[#e91e8c]/15 dark:border-[#c9a84c]/15`}>
        {["All", "Completed", "Pending", "Processing", "Shipped", "Refunded"].map((tab) => {
          const count = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-inter whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? "border-[#e91e8c] dark:border-[#c9a84c] text-[#e91e8c] dark:text-[#c9a84c] font-semibold"
                  : `border-transparent ${txtFaint} hover:text-[#e91e8c] dark:hover:text-[#f5e6a8]/70`
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-[#e91e8c]/15 dark:bg-[#c9a84c]/20 text-[#e91e8c] dark:text-[#c9a84c]" : "bg-[#1a0a10]/8 dark:bg-white/5 text-[#1a0a10]/40 dark:text-white/30"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {ordersLoading ? (
        <div className={`font-playfair text-xl animate-pulse text-center py-10 ${accent}`}>Loading orders...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={`hidden md:block rounded-2xl ${cardBg} border ${borderA} overflow-hidden`}>
            <table className="w-full">
              <thead>
                <tr className={`border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10`}>
                  {["Order ID", "Customer", "Date", "Items", "Status", "Total", "Action"].map((h) => (
                    <th key={h} className={`text-left px-5 py-3 text-[10px] uppercase tracking-widest font-inter font-semibold ${txtFaint}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr key={order.id} className={`border-b border-[#e91e8c]/5 dark:border-[#c9a84c]/5 hover:bg-[#e91e8c]/4 dark:hover:bg-[#c9a84c]/4 transition-colors ${i % 2 !== 0 ? "bg-[#1a0a10]/[0.01] dark:bg-white/[0.01]" : ""}`}>
                    <td className={`px-5 py-4 font-inter text-xs ${txtMid}`}>#{order.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm font-playfair shrink-0`}>
                          {order.customer?.[0] || "?"}
                        </div>
                        <div>
                          <p className={`text-sm font-inter font-semibold ${txt}`}>{order.customer}</p>
                          <p className={`text-xs font-inter ${txtFaint}`}>{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-4 font-inter text-xs ${txtMid}`}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className={`px-5 py-4 font-inter text-xs ${txtMid}`}>
                      {getItemCount(order)} {getItemCount(order) === 1 ? "item" : "items"}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`bg-transparent border-none outline-none cursor-pointer text-xs font-inter ${txt} disabled:opacity-50`}
                      >
                        {statuses.map((s) => (<option key={s} value={s} className="bg-white dark:bg-[#0a0f1a]">{s}</option>))}
                      </select>
                    </td>
                    <td className={`px-5 py-4 font-inter text-sm font-semibold ${accent}`}>
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className={`text-center py-12 font-inter text-sm ${txtFaint}`}>No orders found</div>
            )}
            <div className={`flex items-center justify-between px-5 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10`}>
              <p className={`text-xs font-inter ${txtFaint}`}>Showing {filtered.length} of {orders.length} orders</p>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((order) => (
              <div key={order.id} className={`rounded-2xl ${cardBg} border ${borderA} p-4 flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <span className={`font-inter text-xs ${txtFaint}`}>#{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm font-playfair`}>
                      {order.customer?.[0] || "?"}
                    </div>
                    <div>
                      <p className={`text-sm font-inter font-semibold ${txt}`}>{order.customer}</p>
                      <p className={`text-xs font-inter ${txtFaint}`}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-NG") : "—"}
                      </p>
                    </div>
                  </div>
                  <p className={`font-inter font-semibold text-sm ${accent}`}>₦{Number(order.total).toLocaleString()}</p>
                </div>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`bg-[#e91e8c]/5 dark:bg-white/5 border ${borderA} ${txt} text-xs rounded-lg px-3 py-2 outline-none cursor-pointer font-inter w-full`}
                >
                  {statuses.map((s) => (<option key={s} value={s} className="bg-white dark:bg-[#0a0f1a]">{s}</option>))}
                </select>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={`text-center py-12 font-inter text-sm ${txtFaint}`}>No orders found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersSection;
