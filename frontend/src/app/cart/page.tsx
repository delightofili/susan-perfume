"use client";

import React from "react";
import CartList from "../../components/CartList.js";
import OrderSummary from "../../components/OrderSummary.js";
import { SectionDivider } from "../../components/SectionDivider.js";

export default function CartPage() {
  return (
    <div className="py-12 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        <SectionDivider
          title="Shopping Cart"
          subtitle="Review your chosen luxury fragrances before proceeding to secure checkout."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <CartList />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary showCheckoutBtn={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
