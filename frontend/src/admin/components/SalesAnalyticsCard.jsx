import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const formatNaira = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#1a1008] text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
      {formatNaira(payload[0].value)}
    </div>
  );
};

function SalesAnalyticsCard({ orders = [] }) {
  const [range, setRange] = useState("7d");

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const days = range === "30d" ? 30 : 7;
    return orders.filter((o) => {
      const date = new Date(o.created_at || o.date);
      return (now - date) / (1000 * 60 * 60 * 24) <= days;
    });
  }, [orders, range]);

  const previousOrders = useMemo(() => {
    const now = new Date();
    const days = range === "30d" ? 30 : 7;
    return orders.filter((o) => {
      const date = new Date(o.created_at || o.date);
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff > days && diff <= days * 2;
    });
  }, [orders, range]);

  const currentRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const previousRevenue = previousOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const growth = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = useMemo(() => {
    const map = {};
    dayMap.forEach((d) => (map[d] = 0));
    filteredOrders.forEach((o) => {
      const day = dayMap[new Date(o.created_at || o.date).getDay()];
      map[day] += Number(o.total || 0);
    });
    return dayMap.map((day) => ({ day, value: map[day] }));
  }, [filteredOrders]);

  return (
    <div className="border border-[#e91e8c]/20 dark:border-[#c9a84c] rounded-2xl bg-white/80 dark:bg-white/5 p-6 my-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#1a0a10]/50 dark:text-[#f5e6a8]/60 text-xs font-inter uppercase tracking-widest">Revenue</p>
          <h2 className="text-[#1a0a10] dark:text-[#f5e6a8] text-xl font-playfair mt-1">
            {formatNaira(currentRevenue)}
          </h2>
          <p className={`text-xs mt-1 font-inter ${growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}% vs previous period
          </p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-[#e91e8c]/8 dark:bg-white/5 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30 text-[#1a0a10]/70 dark:text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer font-inter"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#e91e8c" stopOpacity={0.25} className="dark:[stop-color:#c9a84c]" />
                <stop offset="95%" stopColor="#e91e8c" stopOpacity={0}   className="dark:[stop-color:#c9a84c]" />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: "rgba(26,10,16,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} className="dark:[&_text]:fill-[rgba(245,230,168,0.4)]" />
            <YAxis tick={{ fill: "rgba(26,10,16,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v / 1000}K`} className="dark:[&_text]:fill-[rgba(245,230,168,0.4)]" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#e91e8c" strokeWidth={2} fill="url(#areaGradient)" dot={{ r: 3, fill: "#e91e8c" }} activeDot={{ r: 5, fill: "#c2185b" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesAnalyticsCard;
