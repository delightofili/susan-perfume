import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- helper: format money
const formatNaira = (value) => `₦${Number(value || 0).toLocaleString("en-NG")}`;

// --- tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#c9a84c] text-[#1a1008] text-xs font-bold px-3 py-1 rounded-lg">
      {formatNaira(payload[0].value)}
    </div>
  );
};

function SalesAnalyticsCard({ orders = [] }) {
  const [range, setRange] = useState("7d");

  // --- filter orders by range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const days = range === "30d" ? 30 : 7;

    return orders.filter((o) => {
      const date = new Date(o.created_at || o.date);
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });
  }, [orders, range]);

  // --- previous period for growth %
  const previousOrders = useMemo(() => {
    const now = new Date();
    const days = range === "30d" ? 30 : 7;

    return orders.filter((o) => {
      const date = new Date(o.created_at || o.date);
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff > days && diff <= days * 2;
    });
  }, [orders, range]);

  // --- total revenue
  const currentRevenue = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0,
  );

  const previousRevenue = previousOrders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0,
  );

  // --- % growth
  const growth =
    previousRevenue === 0
      ? 100
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  // --- group by weekday
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = useMemo(() => {
    const map = {};

    dayMap.forEach((d) => (map[d] = 0));

    filteredOrders.forEach((o) => {
      const day = dayMap[new Date(o.created_at || o.date).getDay()];
      map[day] += Number(o.total || 0);
    });

    return dayMap.map((day) => ({
      day,
      value: map[day],
    }));
  }, [filteredOrders]);

  return (
    <div className="border border-[#c9a84c] rounded-2xl bg-white/5 p-6 my-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#f5e6a8]/60 text-xs">Revenue</p>
          <h2 className="text-[#f5e6a8] text-xl font-playfair">
            {formatNaira(currentRevenue)}
          </h2>

          <p
            className={`text-xs mt-1 ${
              growth >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}% vs previous period
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-white/5 border border-[#c9a84c]/30 text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* CHART */}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(245,230,168,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "rgba(245,230,168,0.4)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₦${v / 1000}K`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={{ r: 3, fill: "#c9a84c" }}
              activeDot={{ r: 5, fill: "#f5e6a8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesAnalyticsCard;
