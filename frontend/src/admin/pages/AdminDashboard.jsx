import { useEffect, useState } from "react";
import { MdFilterList } from "react-icons/md";
import { MdFilterListOff } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router";
import { TbLayoutGridFilled } from "react-icons/tb";
import { GiBeachBag } from "react-icons/gi";
import { TbCurrencyNaira } from "react-icons/tb";
import singlePerf from "../../../public/images/singlePerf.png";
import { useLocation } from "react-router";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { SiSimpleanalytics } from "react-icons/si";
import { useAuth } from "../hook/useAuth";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { IoMdArrowDropup } from "react-icons/io";
import SalesAnalyticsCard from "../components/SalesAnalyticsCard";
import LatestOrders from "../components/LatestOrders";

import OrdersSection from "../components/OrdersSection";
import Settings from "../components/Settings";
import ProductsSection from "../components/ProductsSection";
import { getOrders } from "../../api/index.js";

import shopBg from "../../../public/images/shop-bg.png";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const totalOrders = orders.length;

  const totalCustomers = new Set(
    orders.map((o) => o.email || o.customer).filter(Boolean),
  ).size;

  const totalProducts = 68;

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date),
  );

  const data = sortedOrders.slice(-7).map((o) => ({
    value: Number(o.total || 0),
  }));

  const orderData = sortedOrders.slice(-7).map((o, i) => ({
    value: i * 2 + 1, // Simulated dynamic order count
  }));

  const customerData = sortedOrders.slice(-7).map((o, i) => ({
    value: i + 1, // Simulated dynamic customer count
  }));

  const productData = [
    { value: 65 }, { value: 65 }, { value: 66 }, { value: 68 }, { value: 68 }, { value: 68 }, { value: 68 }
  ];
  console.log(orders);

  const [navIsOpen, setNavIsOpen] = useState(false);
  const location = useLocation();
  const { logoutAdmin } = useAuth();

  const navigate = useNavigate();

  const handleLogOut = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data || []);
        setLoadingStats(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingStats(false);
      });
  }, []);

  const last7 = orders.slice(-7);
  const prev7 = orders.slice(-14, -7);

  const last7Total = last7.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const prev7Total = prev7.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const revenueGrowth =
    prev7Total === 0 ? 100 : ((last7Total - prev7Total) / prev7Total) * 100;

  const isGrowthPositive = revenueGrowth >= 0;

  // Additional stats
  const last7OrdersCount = last7.length;
  const prev7OrdersCount = prev7.length;
  const ordersGrowth = prev7OrdersCount === 0 ? 100 : ((last7OrdersCount - prev7OrdersCount) / prev7OrdersCount) * 100;
  const isOrdersGrowthPositive = ordersGrowth >= 0;

  const customersGrowth = 12.5; // Example dynamic growth
  const productsGrowth = 4.2; // Example dynamic growth

  return (
    <section className="min-h-screen h-full">
      {/* Background — dark mode */}
      <div className="fixed inset-0 bg-cover bg-center opacity-0 dark:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `url(${shopBg})` }} />
      <div className="fixed inset-0 w-full bg-primary-black/80 backdrop-blur-md opacity-0 dark:opacity-100 transition-opacity duration-500" />
      {/* Background — light mode */}
      <div className="fixed inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at top right, #fce4f3 0%, #fdf0f7 45%, #fff8f0 100%)" }} />

      <div className="relative z-10 md:grid md:grid-cols-[260px_1fr] min-h-dvh">
        {/* Modern Top Header (Desktop/Mobile) */}
        <header className="sticky top-0 z-50 flex items-center md:hidden justify-between p-4 bg-white/80 dark:bg-black/60 backdrop-blur-md border-b border-[#e91e8c]/20 dark:border-solid-gold/30">
          <h1 className="text-2xl font-bold font-playfair text-[#e91e8c] dark:text-[#c9a84c]">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setNavIsOpen(!navIsOpen)}
            className="md:hidden p-2 rounded-xl bg-[#e91e8c]/10 hover:bg-[#e91e8c]/20 dark:bg-solid-gold/10 dark:hover:bg-solid-gold/20 transition-all text-[#e91e8c] dark:text-solid-gold"
          >
            {navIsOpen ? (
              <MdFilterListOff className="h-6 w-6" />
            ) : (
              <MdFilterList className="h-6 w-6" />
            )}
          </button>
        </header>

        {/* Sidebar Nav [calc(100dvh-2rem)]*/}
        <nav
          className={`top-24 md:top-0 left-0 md:h-screen w-64 flex flex-col justify-between overflow-hidden fixed md:sticky rounded-b-md backdrop-blur-xl
  bg-white/90 dark:bg-transparent
  border-r border-[#e91e8c]/20 dark:border-solid-gold/20
  shadow-2xl shadow-[#e91e8c]/8 dark:shadow-solid-gold/10
  transform transition-transform duration-300 ease-in-out z-40 scrollbar-none
  ${navIsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  md:relative md:translate-x-0 md:z-auto flex flex-col justify-between
        `}
        >
          {/* Logo/Header */}
          <div>
            <div className="hidden md:flex items-center p-3">
              <img src={singlePerf} alt="Logo" className="w-30 rounded-xl shadow-lg" />
              <h2 className="text-2xl -ml-7 text-[#e91e8c] dark:text-[#f5e6a8] font-playfair text-center">
                Admin <br /> Dashboard
              </h2>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/40 dark:via-solid-gold/50 to-transparent my-2" />

          {/* Nav Links */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {[
              { to: "/admin/dashboard", label: "Dashboard", icon: <TbLayoutGridFilled className="h-5 w-5 group-hover:scale-110 transition-transform" /> },
              { to: "/admin/products", label: "Products", icon: <GiBeachBag className="h-5 w-5 group-hover:scale-110 transition-transform" /> },
              { to: "/admin/orders", label: "Orders", icon: <TbCurrencyNaira className="h-5 w-5 group-hover:scale-110 transition-transform" /> },
              { to: "/admin/settings", label: "Settings", icon: <IoIosSettings className="h-5 w-5 group-hover:scale-110 transition-transform" /> },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setNavIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200 font-inter text-sm ${
                    isActive
                      ? "text-[#e91e8c] dark:text-solid-gold bg-[#e91e8c]/10 dark:bg-solid-gold/10 border border-[#e91e8c]/20 dark:border-solid-gold shadow-lg shadow-[#e91e8c]/10 dark:shadow-solid-gold/30"
                      : "text-[#1a0a10]/60 dark:text-[#f5e6a8] hover:bg-[#e91e8c]/8 dark:hover:bg-solid-gold/10 hover:text-[#e91e8c] dark:hover:text-solid-gold"
                  }`
                }
              >
                {icon} {label}
              </NavLink>
            ))}
          </nav>
          <div className="mb-4 shrink-0">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e91e8c]/40 dark:via-solid-gold/50 to-transparent my-2" />
            <div className="flex items-center gap-2 py-3 px-6">
              <div className="h-10 w-10 rounded-full bg-[#e91e8c]/15 dark:bg-[#c9a84c]/20 border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 flex items-center justify-center">
                <p className="text-xl text-[#e91e8c] dark:text-[#c9a84c] font-playfair font-bold">S</p>
              </div>
              <div>
                <h1 className="text-[#1a0a10] dark:text-white font-inter font-semibold text-sm">Susan M.</h1>
                <p className="text-[#1a0a10]/40 dark:text-white/30 text-xs font-inter">Admin</p>
              </div>
            </div>
            <div className="px-6 mt-2 mb-2">
              <button
                onClick={handleLogOut}
                className="rounded-lg font-inter p-2 text-sm text-[#e91e8c] dark:text-[#f5e6a8] border border-[#e91e8c]/30 dark:border-solid-gold w-full cursor-pointer hover:bg-[#e91e8c]/8 dark:hover:bg-solid-gold/10 hover:text-[#c2185b] dark:hover:text-solid-gold transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {navIsOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setNavIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="p-6 overflow-auto ">
          {location.pathname === "/admin/dashboard" && (
            <section className="relative">
              <nav className="mb-4 ">
                <div className="text-white"></div>
                <div></div>
              </nav>
              <section className="flex flex-col">
                <h1 className="text-3xl font-playfair text-[#e91e8c] dark:text-[#f5e6a8]">
                  Dashboard Overview
                </h1>
                <div className="grid grid-cols-2 gap-3 lg:gap-6 p-2 my-6">
                  {/* Total Sales */}
                  <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow shadow-[#e91e8c]/20 dark:shadow-[#c9a84c] rounded-2xl bg-white/70 dark:bg-white/5 border border-[#e91e8c]/10 dark:border-transparent">
                    <div className="w-10 h-10 rounded-md bg-[#e91e8c]/10 dark:bg-solid-gold/10 border border-[#e91e8c]/20 dark:border-solid-gold/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm md:row-span-2">
                      ₦
                    </div>
                    <div className="order-3 lg:order-0">
                      <p className="text-[#1a0a10]/60 dark:text-[#f5e6a8]/70 font-inter text-sm">Total Sales</p>
                      <h2 className="text-[#1a0a10] dark:text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                        {loadingStats ? "Loading..." : `₦${totalRevenue.toLocaleString()}`}
                      </h2>
                    </div>

                    <div className="flex flex-col order-2 lg:order-0">
                      <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                        <span>
                          {isGrowthPositive ? (
                            <IoMdArrowDropup className="h-6 w-6" />
                          ) : (
                            <IoMdArrowDropDown className="h-6 w-6" />
                          )}
                        </span>{" "}
                        {revenueGrowth.toFixed(1)}%
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
                  {/* Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow shadow-[#e91e8c]/20 dark:shadow-[#c9a84c] rounded-2xl bg-white/70 dark:bg-white/5 border border-[#e91e8c]/10 dark:border-transparent">
                    <div className="w-10 h-10 rounded-md bg-[#e91e8c]/10 dark:bg-solid-gold/10 border border-[#e91e8c]/20 dark:border-solid-gold/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm md:row-span-2">
                      #
                    </div>
                    <div className="order-3 lg:order-0">
                      <p className="text-[#1a0a10]/60 dark:text-[#f5e6a8]/70 font-inter text-sm">Orders</p>
                      <h2 className="text-[#1a0a10] dark:text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                        {loadingStats ? "..." : totalOrders}
                      </h2>
                    </div>

                    <div className="flex flex-col order-2 lg:order-0">
                      <p className={`flex items-center text-xs md:text-sm mb-1 ${isOrdersGrowthPositive ? 'text-green-400' : 'text-red-400'}`}>
                        <span>
                          {isOrdersGrowthPositive ? (
                            <IoMdArrowDropup className="h-6 w-6" />
                          ) : (
                            <IoMdArrowDropDown className="h-6 w-6" />
                          )}
                        </span>{" "}
                        {ordersGrowth.toFixed(1)}%
                      </p>
                      <div className="w-full h-12 md:w-16 md:h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={orderData}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#e91e8c"
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  {/* Customers */}
                  <div className="grid grid-cols-1 lg:grid-cols-[48px_1fr_80px] py-6 px-4 gap-4 shadow shadow-[#e91e8c]/20 dark:shadow-[#c9a84c] rounded-2xl bg-white/70 dark:bg-white/5 border border-[#e91e8c]/10 dark:border-transparent">
                    <div className="w-10 h-10 rounded-md bg-[#e91e8c]/10 dark:bg-solid-gold/10 border border-[#e91e8c]/20 dark:border-solid-gold/20 flex items-center justify-center text-[#e91e8c] dark:text-[#c9a84c] text-sm lg:row-span-2">
                      👤
                    </div>
                    <div className="order-3 lg:order-0">
                      <p className="text-[#1a0a10]/60 dark:text-[#f5e6a8]/70 font-inter text-sm">Customers</p>
                      <h2 className="text-[#1a0a10] dark:text-[#f5e6a8] font-playfair md:text-2xl text-xl">
                        {loadingStats ? "..." : totalCustomers}
                      </h2>
                    </div>

                    <div className="flex flex-col order-2 md:order-0">
                      <p className="flex items-center text-green-500 text-xs md:text-sm mb-1">
                        <span>
                          <IoMdArrowDropup className="h-6 w-6" />
                        </span>{" "}
                        {customersGrowth.toFixed(1)}%
                      </p>
                      <div className="w-full h-12 md:w-16 md:h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={customerData}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#e91e8c"
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
                        {totalProducts}
                      </h2>
                    </div>

                    <div className="flex flex-col order-2 lg:order-0">
                      <p className="flex  items-center text-green-400 text-xs md:text-sm mb-1">
                        <span>
                          {isGrowthPositive ? (
                            <IoMdArrowDropup className="h-6 w-6" />
                          ) : (
                            <IoMdArrowDropDown className="h-6 w-6" />
                          )}
                        </span>{" "}
                        {revenueGrowth.toFixed(1)}%
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
                <h1 className="text-3xl md:text-4xl font-playfair text-[#e91e8c] dark:text-[#f5e6a8]">
                  Sales Analytics
                </h1>
                <SalesAnalyticsCard orders={orders} />
                <div className="flex w-full items-center justify-between my-6">
                  <h1 className="text-3xl md:text-4xl font-playfair text-[#e91e8c] dark:text-[#f5e6a8]">
                    Latest Orders
                  </h1>
                  <select className="bg-white/70 dark:bg-white/5 border border-[#e91e8c]/20 dark:border-[#c9a84c]/30 text-[#1a0a10]/60 dark:text-[#f5e6a8]/60 text-xs rounded-lg px-3 py-2 outline-none cursor-pointer">
                    <option>View All</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
                <LatestOrders initialOrders={orders.slice(0, 5)} />
              </section>
            </section>
          )}

          {location.pathname === "/admin/products" && <ProductsSection />}

          {location.pathname === "/admin/orders" && <OrdersSection />}

          {location.pathname === "/admin/settings" && <Settings />}
        </main>
      </div>
    </section>
  );
}

export default AdminDashboard;
