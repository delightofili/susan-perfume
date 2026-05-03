import StatusBadge from "./StatusBadge";
import { Link } from "react-router";

function LatestOrders({ initialOrders }) {
  const orders = initialOrders || [];
  const loading = !initialOrders;

  const txt      = "text-[#1a0a10] dark:text-[#f5e6a8]";
  const txtMid   = "text-[#1a0a10]/60 dark:text-[#f5e6a8]/50";
  const txtFaint = "text-[#1a0a10]/40 dark:text-[#f5e6a8]/30";
  const accent   = "text-[#e91e8c] dark:text-[#c9a84c]";
  const cardBg   = "bg-white/80 dark:bg-white/5";
  const borderA  = "border-[#e91e8c]/20 dark:border-[#c9a84c]/30";

  if (loading) {
    return (
      <div className={`border ${borderA} rounded-2xl ${cardBg} p-8 mt-4`}>
        <p className={`font-playfair animate-pulse text-center ${accent}`}>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`border ${borderA} rounded-2xl ${cardBg} p-8 mt-4 text-center`}>
        <p className={`font-inter text-sm ${txtFaint}`}>No orders yet</p>
      </div>
    );
  }

  return (
    <div className={`border ${borderA} rounded-2xl ${cardBg} overflow-hidden mt-4`}>
      {/* Desktop table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className={`border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/15`}>
            {["Order ID", "Customer", "Date", "Status", "Total"].map((h) => (
              <th key={h} className={`text-left text-xs uppercase tracking-widest font-semibold font-inter px-6 py-4 ${txtFaint}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={`border-b border-[#e91e8c]/6 dark:border-white/5 hover:bg-[#e91e8c]/4 dark:hover:bg-white/5 transition-colors`}>
              <td className={`px-6 py-4 text-sm font-inter ${txtMid}`}>#{order.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/20 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-xs font-bold shrink-0`}>
                    {order.customer?.charAt(0) || "?"}
                  </div>
                  <span className={`text-sm font-semibold font-inter ${txt}`}>{order.customer}</span>
                </div>
              </td>
              <td className={`px-6 py-4 text-sm font-inter ${txtMid}`}>
                {order.date
                  ? new Date(order.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                  : order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
              </td>
              <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
              <td className={`px-6 py-4 font-semibold text-sm font-inter ${accent}`}>
                ₦{Number(order.total).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className={`md:hidden divide-y divide-[#e91e8c]/8 dark:divide-white/5`}>
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-9 h-9 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/20 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm font-bold shrink-0`}>
              {order.customer?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold font-inter ${txt}`}>{order.customer}</span>
                <span className={`text-sm font-semibold font-inter ${accent}`}>₦{Number(order.total).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs font-inter ${txtFaint}`}>#{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className={`px-6 py-4 border-t border-[#e91e8c]/10 dark:border-white/5`}>
        <Link
          to="/admin/orders"
          className={`block w-full py-2.5 border ${borderA} rounded-xl text-xs uppercase tracking-widest font-inter text-center transition-all hover:bg-[#e91e8c]/8 dark:hover:bg-[#c9a84c]/10 ${txtMid} hover:text-[#e91e8c] dark:hover:text-[#c9a84c]`}
        >
          View All Orders →
        </Link>
      </div>
    </div>
  );
}

export default LatestOrders;
