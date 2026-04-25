import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const salesData = [
  { day: "Mon", value: 51000 },
  { day: "Tue", value: 58000 },
  { day: "Wed", value: 55000 },
  { day: "Thu", value: 62000 },
  { day: "Fri", value: 76500 },
  { day: "Sat", value: 70000 },
  { day: "Sun", value: 68000 },
];

// Custom tooltip matching your gold theme
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#c9a84c] text-[#1a1008] text-xs font-bold px-3 py-1 rounded-lg">
        ₦{payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

function SalesAnalyticsCard() {
  return (
    <div className="border border-[#c9a84c] rounded-2xl bg-white/5 p-6 my-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Dropdown */}
        <select className="bg-white/5 border border-[#c9a84c]/30 text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            {/* Gradient fill under the line */}
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
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

            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#goldGradient)"
              dot={{ fill: "#c9a84c", r: 3, strokeWidth: 0 }}
              activeDot={{
                fill: "#f5e6a8",
                r: 5,
                stroke: "#c9a84c",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesAnalyticsCard;
