import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import supabase from "../api/supabaseClient";
import GoldDividerDot from "../components/GoldDividerDot";
import StatusBadge from "../admin/components/StatusBadge";

// Standardized steps to match your database status strings
const STEPS = [
  "Pending",
  "Pending Payment",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
];

function TrackOrder() {
  const location = useLocation();
  const prefilled = location.state;
  const initialReference = prefilled?.reference || "";
  const [reference, setReference] = useState(initialReference);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const doSearch = async (refValue) => {
    const ref = (refValue || reference).trim();

    if (!ref) {
      setError("Please enter your order reference.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("reference", ref)
        .maybeSingle();

      if (fetchError || !data) {
        setError("Order not found. Please check your reference number.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Search if we came from Checkout

  useEffect(() => {
    if (!initialReference) return;

    const timer = setTimeout(() => {
      doSearch(initialReference);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Realtime Listener: Updates UI instantly if status changes in DB
  useEffect(() => {
    if (!order?.reference) return;

    const channel = supabase
      .channel(`order-${order.reference}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `reference=eq.${order.reference}`,
        },
        (payload) => {
          setOrder(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.reference]);

  const normalizedStatus = order?.status?.trim().toLowerCase();

  // Calculate progress index
  const currentStep = STEPS.findIndex(
    (step) => step.toLowerCase() === normalizedStatus,
  );

  return (
    <section className="min-h-screen w-full relative pb-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]" />
      <div className="absolute inset-0 opacity-100 dark:opacity-0 bg-[radial-gradient(ellipse_at_top_right,#f8c8da_0%,#fdf0f5_45%,#fff8f0_100%)]" />

      <div className="relative z-40 max-w-lg mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-playfair text-[#1a0a10] dark:text-[#f5e6a8] mb-4">
            Track Order
          </h1>
          <GoldDividerDot />
          <p className="text-[#1a0a10]/50 dark:text-warm-cream/50 font-inter text-sm mt-4 text-center">
            Checking the journey of your luxury fragrance
          </p>
        </div>

        {/* Search Input Box */}
        <div className="rounded-2xl border border-[#c9a84c]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm p-6 mb-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-xs text-[#1a0a10]/50 dark:text-warm-cream/50 uppercase tracking-wider">
                Order Reference
              </label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="SUS-XXXX-XXXX"
                className="px-4 py-3 rounded-xl text-sm font-inter font-mono bg-white/50 dark:bg-black/30 border border-[#c9a84c]/20 text-[#1a0a10] dark:text-[#f5e6a8] outline-none focus:border-[#c9a84c]/60 transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 font-inter text-center">
                ⚠ {error}
              </p>
            )}
            <button
              onClick={() => doSearch()}
              disabled={loading}
              className="w-full py-4 font-cinzel text-xs tracking-[3px] uppercase bg-[image:--luxury-gold-gradient] text-[#1a0a10] font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#1a0a10]/30 border-t-[#1a0a10] rounded-full animate-spin" />
              ) : (
                "Verify Status"
              )}
            </button>
          </div>
        </div>

        {/* Order Details & Progress */}
        {order && (
          <div className="rounded-2xl border border-[#c9a84c]/20 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-4 border-b border-[#c9a84c]/15 flex items-center justify-between bg-gold/5">
              <div>
                <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/40 uppercase tracking-widest">
                  Reference
                </p>
                <p className="font-playfair text-lg text-[#1a0a10] dark:text-[#c9a84c] font-bold">
                  {order.reference}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="p-6 flex flex-col gap-8">
              {/* Summary Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { label: "Customer", value: order.customer },
                  {
                    label: "Amount Paid",
                    value: "₦" + Number(order.total).toLocaleString(),
                    gold: true,
                  },
                  {
                    label: "Items",
                    value: `${order.item_count || order.items?.length || 0} Product(s)`,
                  },
                  {
                    label: "Order Date",
                    value: new Date(order.created_at).toLocaleDateString(
                      "en-NG",
                      { day: "numeric", month: "short", year: "numeric" },
                    ),
                  },
                ].map(({ label, value, gold }) => (
                  <div key={label}>
                    <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/30 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <p
                      className={`font-inter text-sm ${gold ? "font-bold text-[#c9a84c]" : "text-[#1a0a10] dark:text-[#f5e6a8]"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* PROGRESS TRACKER (Vertical on Mobile, Horizontal on Desktop) */}
              <div>
                <p className="font-inter text-[10px] text-[#1a0a10]/40 dark:text-warm-cream/40 uppercase tracking-widest mb-6">
                  Delivery Timeline
                </p>

                <div className="flex flex-col md:flex-row justify-between relative gap-6 md:gap-0">
                  {/* Line connecting dots (Desktop) */}
                  <div className="hidden md:block absolute top-4 left-4 right-4 h-[1px] bg-[#c9a84c]/20" />
                  {/* Line connecting dots (Mobile) */}
                  <div className="md:hidden absolute left-4 top-4 bottom-4 w-[1px] bg-[#c9a84c]/20" />

                  {STEPS.map((step, i) => {
                    const isDone = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div
                        key={step}
                        className="flex md:flex-col items-center gap-4 md:gap-2 relative z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-all duration-1000 
                                                    ${isDone ? "bg-[#c9a84c] border-[#c9a84c] text-[#1a0a10] shadow-[0_0_15px_rgba(201,168,76,0.4)]" : "bg-black/20 border-[#c9a84c]/20 text-warm-cream/20"}
                                                    ${isCurrent ? "ring-4 ring-[#c9a84c]/20 animate-pulse scale-110" : ""}
                                                `}
                        >
                          {isDone && !isCurrent ? "✓" : i + 1}
                        </div>
                        <div className="flex flex-col md:items-center">
                          <p
                            className={`font-inter text-[11px] font-medium tracking-wide ${isDone ? "text-[#1a0a10] dark:text-[#c9a84c]" : "text-[#1a0a10]/30 dark:text-warm-cream/20"}`}
                          >
                            {step}
                          </p>
                          {isCurrent && (
                            <span className="text-[9px] text-[#c9a84c]/60 animate-bounce md:hidden">
                              Current Stage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Action */}
              <a
                href={`https://wa.me/2349066188842?text=Hello Susan, I am tracking my order ${order.reference}. Can I get an update?`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-600 dark:text-green-400 font-inter text-xs tracking-widest uppercase hover:bg-green-500/10 transition-all mt-4"
              >
                <span className="text-lg">💬</span> Chat with Concierge
              </a>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && !order && !loading && !error && (
          <div className="text-center py-10 animate-pulse">
            <p className="text-[#1a0a10]/40 dark:text-warm-cream/40 font-inter text-sm italic">
              No records found. Please check your reference.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="font-cinzel text-[10px] tracking-[2px] text-[#1a0a10]/40 dark:text-warm-cream/40 hover:text-[#c9a84c] transition-colors"
          >
            ← Back to Boutique
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TrackOrder;
