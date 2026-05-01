/* import { getOrders } from "../../api/index.js"; */
import StatusBadge from "./StatusBadge";
import { Link } from "react-router";

function LatestOrders({ initialOrders }) {
  const orders = initialOrders || [];
  const loading = !initialOrders;

  /*  useEffect(() => {
    getOrders()
      .then((data) => {
        // Show only latest 5
        setOrders(data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []); */

  if (loading) {
    return (
      <div className="border border-[#c9a84c]/30 rounded-2xl bg-white/5 p-8 mt-4">
        <p className="text-[#c9a84c] font-playfair animate-pulse text-center">
          Loading orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border border-[#c9a84c]/30 rounded-2xl bg-white/5 p-8 mt-4 text-center">
        <p className="text-[#f5e6a8]/30 font-inter text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="border border-[#c9a84c]/30 rounded-2xl bg-white/5 overflow-hidden mt-4">
      {/* Table - desktop */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-[#c9a84c]/15">
            {["Order ID", "Customer", "Date", "Status", "Total"].map((h) => (
              <th
                key={h}
                className="text-left text-xs text-[#f5e6a8]/40 uppercase tracking-widest font-normal px-6 py-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-6 py-4 text-[#f5e6a8]/50 text-sm font-inter">
                #{order.id}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] text-xs font-bold shrink-0">
                    {order.customer?.charAt(0) || "?"}
                  </div>
                  <span className="text-[#f5e6a8] text-sm">
                    {order.customer}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-[#f5e6a8]/50 text-sm">
                {order.date
                  ? new Date(order.date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 text-[#c9a84c] font-semibold text-sm">
                ₦{Number(order.total).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/5">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] text-sm font-bold shrink-0">
              {order.customer?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[#f5e6a8] text-sm font-medium">
                  {order.customer}
                </span>
                <span className="text-[#c9a84c] text-sm font-semibold">
                  ₦{Number(order.total).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[#f5e6a8]/40 text-xs">#{order.id}</span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="px-6 py-4 border-t border-white/5">
        <Link
          to="/admin/orders"
          className="block w-full py-2 border border-[#c9a84c]/30 rounded-xl text-[#f5e6a8]/60 text-xs uppercase tracking-widest hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] transition-all text-center"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}

export default LatestOrders;
