import { IoMdArrowDropup } from "react-icons/io";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import SalesAnalyticsCard from "./SalesAnalyticsCard";
import LatestOrders from "./LatestOrders";

function DashboardHome() {
  const data = [
    { value: 30 },
    { value: 45 },
    { value: 38 },
    { value: 60 },
    { value: 55 },
    { value: 75 },
    { value: 85 },
  ];
  return (
    <section className="relative">
      <nav className="mb-4 ">
        <div className="text-white"></div>
        <div></div>
      </nav>
      <main className="flex flex-col ">
        <h1 className="text-3xl md:text-3xl font-playfair text-[#f5e6a8]">
          Dashboard Overview
        </h1>
        <div className="grid grid-cols-2 gap-3 lg:gap-6 p-2 lgp-8 my-6">
          <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow  shadow-[#c9a84c] rounded-2xl bg-white/5 ">
            <div className="w-10 h-10 rounded-md bg-solid-gold/10 border border-solid-gold/20 flex items-center justify-center text-[#c9a84c] text-sm md:row-span-2 ">
              $
            </div>
            <div className="order-3 lg:order-0">
              <p className="text-[#f5e6a8]/70 font-inter">Total Sales</p>
              <h2 className="text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                ₦430,000
              </h2>
            </div>

            <div className="flex flex-col order-2 lg:order-0">
              <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                <span>
                  <IoMdArrowDropup className="h-6 w-6" />
                </span>{" "}
                15.8%
              </p>
              <div className="w-full h-12 md:w-16 md:h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a84c"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow  shadow-[#c9a84c] rounded-2xl bg-white/5 ">
            <div className="w-10 h-10 rounded-md bg-solid-gold/10 border border-solid-gold/20 flex items-center justify-center text-[#c9a84c] text-sm md:row-span-2 ">
              $
            </div>
            <div className="order-3 lg:order-0">
              <p className="text-[#f5e6a8]/70 font-inter">Orders</p>
              <h2 className="text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                824
              </h2>
            </div>

            <div className="flex flex-col order-2 lg:order-0">
              <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                <span>
                  <IoMdArrowDropup className="h-6 w-6" />
                </span>{" "}
                15.8%
              </p>
              <div className="w-full h-12 md:w-16 md:h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a84c"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow shadow-[#c9a84c] rounded-2xl bg-white/5 ">
            <div className="w-10 h-10 rounded-md bg-solid-gold/10 border border-solid-gold/20 flex items-center justify-center text-[#c9a84c] text-sm lg:row-span-2 ">
              $
            </div>
            <div className="order-3 lg:order-0">
              <p className="text-[#f5e6a8]/70 font-inter">Customers</p>
              <h2 className="text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                1,207
              </h2>
            </div>

            <div className="flex flex-col order-2 md:order-0">
              <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                <span>
                  <IoMdArrowDropup className="h-6 w-6" />
                </span>{" "}
                15.8%
              </p>
              <div className="w-full h-12 md:w-16 md:h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a84c"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow  shadow-[#c9a84c] rounded-2xl bg-white/5 ">
            <div className="w-10 h-10 rounded-md bg-solid-gold/10 border border-solid-gold/20 flex items-center justify-center text-[#c9a84c] text-sm lg:row-span-2 ">
              $
            </div>
            <div className="order-3 lg:order-0">
              <p className="text-[#f5e6a8]/70 font-inter">Products</p>
              <h2 className="text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                68
              </h2>
            </div>

            <div className="flex flex-col order-2 lg:order-0">
              <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                <span>
                  <IoMdArrowDropup className="h-6 w-6" />
                </span>{" "}
                15.8%
              </p>
              <div className="w-full h-12 md:w-16 md:h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#c9a84c"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-playfair text-[#f5e6a8]">
          Sales Analytics
        </h1>
        <SalesAnalyticsCard />
        <div className="flex w-full items-center justify-between my-6">
          <h1 className="text-3xl md:text-4xl font-playfair text-[#f5e6a8]">
            Latest Orders
          </h1>
          <select className="bg-white/5 border border-[#c9a84c]/30 text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
            <option>View All</option>
            <option>View All</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <LatestOrders />
      </main>
    </section>
  );
}

export default DashboardHome;
