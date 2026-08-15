"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Order } from "../../types/index.js";
import { getOrderByRef } from "../../lib/api.js";
import { SectionDivider } from "../../components/SectionDivider.js";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [reference, setReference] = useState(initialRef);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = (refToFetch: string) => {
    if (!refToFetch.trim()) return;
    setLoading(true);
    setError(null);
    getOrderByRef(refToFetch.trim())
      .then((data) => setOrder(data))
      .catch(() => {
        setOrder(null);
        setError("Order reference not found. Please double-check your code.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialRef) {
      fetchOrder(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(reference);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <SectionDivider
        title="Live Order Tracking"
        subtitle="Enter your unique reference code to check real-time order status."
      />

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-3 bg-[#fff8fb] dark:bg-[#0d1526] p-4 rounded-2xl border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter reference e.g. ORD-173849302"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-wider uppercase shadow-md hover:opacity-90 transition-opacity cursor-pointer"
        >
          Track
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full mx-auto" />
          <p className="font-cinzel text-xs text-gray-500 mt-3 uppercase tracking-widest">
            Searching Atelier Records...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="font-inter text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Order Status Display */}
      {order && !loading && (
        <div className="p-8 rounded-3xl bg-[#fff8fb] dark:bg-[#0d1526] border border-[#e91e8c]/15 dark:border-[#c9a84c]/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
            <div>
              <p className="font-cinzel text-xs font-bold uppercase text-gray-500">Order Reference</p>
              <h3 className="font-inter text-xl font-extrabold text-[#e91e8c] dark:text-[#c9a84c]">
                {order.reference}
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] font-cinzel font-bold text-xs uppercase tracking-wider">
              {order.status === "Paid" ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500" />
              )}
              <span>Status: {order.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-inter">
            <div>
              <p className="text-xs text-gray-500 uppercase font-cinzel font-bold">Customer</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{order.customer}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-cinzel font-bold">Email</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{order.email || "N/A"}</p>
            </div>
          </div>

          {/* Items table */}
          <div>
            <p className="font-cinzel text-xs font-bold uppercase text-gray-500 mb-3">Order Items</p>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#131b2e] rounded-2xl p-4 border border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
              {Array.isArray(order.items) &&
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between font-inter text-sm">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-[#e91e8c] dark:text-[#c9a84c]" />
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between font-bold text-lg">
            <span className="font-cinzel text-gray-900 dark:text-white uppercase">Total Paid</span>
            <span className="font-inter text-[#e91e8c] dark:text-[#c9a84c]">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="py-12 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen">
      <Suspense fallback={
        <div className="py-20 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full mx-auto" />
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
