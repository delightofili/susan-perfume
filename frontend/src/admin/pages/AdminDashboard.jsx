import { useState } from "react";
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

function AdminDashboard() {
  const data = [
    { value: 30 },
    { value: 45 },
    { value: 38 },
    { value: 60 },
    { value: 55 },
    { value: 75 },
    { value: 85 },
  ];
  const [navIsOpen, setNavIsOpen] = useState(false);
  const location = useLocation();
  const { logoutAdmin } = useAuth();

  const navigate = useNavigate();

  const handleLogOut = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <section className="min-h-screen h-full bg-linear-to-br from-slate-900 via-primary-black to-slate-900">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(../../public/images/shop-bg.png)",
        }}
      />
      <div className="fixed inset-0 w-full  bg-primary-black/80  backdrop-blur-md" />

      <div className="relative z-10 md:grid md:grid-cols-[260px_1fr] min-h-dvh">
        {/* Modern Top Header (Desktop/Mobile) */}
        <header className="sticky top-0 z-50 flex items-center md:hidden justify-between p-4 bg-black/60 backdrop-blur-md border-b border-solid-gold/30">
          <h1 className="text-2xl font-bold font-playfair gold-text">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setNavIsOpen(!navIsOpen)}
            className="md:hidden p-2 rounded-xl bg-solid-gold/10 hover:bg-solid-gold/20 transition-all text-solid-gold"
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
          className={`top-24 md:top-0 left-0 md:h-screen w-64 flex flex-col justify-between overflow-hidden fixed md:sticky    rounded-b-md  backdrop-blur-xl
  border-r border-solid-gold/20 shadow-2xl shadow-solid-gold/10
  transform transition-transform duration-300 ease-in-out z-40
  scrollbar-none
  ${navIsOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  md:relative md:translate-x-0 md:z-auto flex flex-col justify-between
        `}
        >
          {/* Logo/Header */}
          <div className="">
            <div className="hidden md:flex items-center p-3">
              <img
                src={singlePerf}
                alt="Logo"
                className="w-30 rounded-xl shadow-lg"
              />
              <h2 className="text-2xl -ml-7 text-[#f5e6a8] font-playfair text-center">
                Admin <br /> Dashboard
              </h2>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-solid-gold/50 to-transparent my-2" />

          {/* Nav Links */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? " text-solid-gold shadow-lg shadow-solid-gold/30 bg-solid-gold/10 border border-solid"
                    : "text-[#f5e6a8] hover:bg-solid-gold/10 hover:text-solid-gold hover:shadow-md"
                }`
              }
              onClick={() => setNavIsOpen(false)}
            >
              <TbLayoutGridFilled className="h-5 w-5 group-hover:scale-110 transition-transform " />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? " text-solid-gold shadow-lg shadow-solid-gold/30 bg-solid-gold/10 border border-solid"
                    : "text-[#f5e6a8] hover:bg-solid-gold/10 hover:text-solid-gold hover:shadow-md"
                }`
              }
              onClick={() => setNavIsOpen(false)}
            >
              <span>
                <GiBeachBag className="h-5 w-5 group-hover:scale-110 transition-transform " />
              </span>{" "}
              Products
            </NavLink>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? " text-solid-gold shadow-lg shadow-solid-gold/30 bg-solid-gold/10 border border-solid"
                    : "text-[#f5e6a8] hover:bg-solid-gold/10 hover:text-solid-gold hover:shadow-md"
                }`
              }
              onClick={() => setNavIsOpen(false)}
            >
              <span>
                <TbCurrencyNaira className="h-5 w-5 group-hover:scale-110 transition-transform " />
              </span>{" "}
              Orders
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `group flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? " text-solid-gold shadow-lg shadow-solid-gold/30 bg-solid-gold/10 border border-solid"
                    : "text-[#f5e6a8] hover:bg-solid-gold/10 hover:text-solid-gold hover:shadow-md"
                }`
              }
              onClick={() => setNavIsOpen(false)}
            >
              <span>
                <IoIosSettings className="h-5 w-5 group-hover:scale-110 transition-transform " />
              </span>{" "}
              Settings
            </NavLink>
          </nav>
          <div className=" mb-4 shrink-0">
            <div class="h-px w-full bg-linear-to-r from-transparent via-solid-gold/50 to-transparent my-2"></div>
            <div className="flex items-center gap-2 py-3 px-6 ">
              <div
                src=""
                className="h-10 w-10 rounded-full bg-[#c9a84c]/20 *:text-[#c9a84c] border border-[#c9a84c]/30 flex items-center text-center justify-center"
              >
                <p className="w-full text-3xl">S</p>
              </div>
              <div>
                <h1 className="text-white">Susan M.</h1>
                <p className="text-white/30">Admin</p>
              </div>
            </div>
            <div className="px-6 mt-3">
              <button
                onClick={handleLogOut}
                className="rounded-lg font-inter  p-2 text-[#f5e6a8]  border border-solid-gold w-full cursor-pointer hover:bg-solid-gold/10 hover:text-solid-gold transition-all"
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
                      <p className="text-[#f5e6a8]/70 font-inter">
                        Total Sales
                      </p>
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
