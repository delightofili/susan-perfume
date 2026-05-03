import { useContext, useState, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import supabase from "../../api/supabaseClient.js";

// ── Shared styled input ──────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-inter uppercase tracking-widest font-semibold text-[#e91e8c]/60 dark:text-[#c9a84c]/60">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "bg-white/70 dark:bg-black/30 border border-[#e91e8c]/20 dark:border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#1a0a10] dark:text-[#f5e6a8] font-inter outline-none focus:border-[#e91e8c]/60 dark:focus:border-[#c9a84c]/50 transition-all placeholder:text-[#1a0a10]/25 dark:placeholder:text-white/20";

// ── Card wrapper ─────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white/60 dark:bg-white/5 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, sub }) {
  return (
    <div className="px-6 py-4 border-b border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
      <h2 className="text-base font-playfair text-[#1a0a10] dark:text-[#f5e6a8]">
        {title}
      </h2>
      {sub && (
        <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}

function SaveBtn({ onClick, loading, label = "Save Changes" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="text-xs font-inter font-bold text-white dark:text-[#0a0804] bg-[#e91e8c] dark:bg-[#c9a84c] rounded-xl px-5 py-2 hover:bg-[#c2185b] dark:hover:bg-[#b8942e] transition-all disabled:opacity-50 flex items-center gap-2"
    >
      {loading && (
        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {loading ? "Saving..." : label}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════
function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [tab, setTab] = useState("Profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  // ── guest id ──────────────────────────────────────────────────────
  const guestId =
    localStorage.getItem("guest_id") ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
      return id;
    })();

  // ── PROFILE ───────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName: "Susan",
    lastName: "M.",
    email: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setProfile({
        firstName: user.user_metadata?.first_name || "Susan",
        lastName: user.user_metadata?.last_name || "M.",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        bio: user.user_metadata?.bio || "",
      });
    });
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
      },
    });
    // Also persist to profiles table if it exists
    await supabase
      .from("profiles")
      .upsert({ guest_id: guestId, ...profile }, { onConflict: "guest_id" });
    flash(error ? "⚠ Error saving profile" : "✓ Profile saved!");
    setSaving(false);
  };

  // ── NOTIFICATIONS ─────────────────────────────────────────────────
  const [notif, setNotif] = useState({
    newOrders: true,
    lowStock: true,
    reviews: false,
    refunds: true,
  });

  useEffect(() => {
    supabase
      .from("user_notifications")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setNotif({
            newOrders: data.new_orders,
            lowStock: data.low_stock,
            reviews: data.reviews,
            refunds: data.refunds,
          });
      });
  }, [guestId]);

  const saveNotif = async () => {
    const { error } = await supabase
      .from("user_notifications")
      .upsert(
        {
          guest_id: guestId,
          new_orders: notif.newOrders,
          low_stock: notif.lowStock,
          reviews: notif.reviews,
          refunds: notif.refunds,
        },
        { onConflict: "guest_id" },
      );
    flash(error ? "⚠ Error saving notifications" : "✓ Notifications saved!");
  };

  // ── SECURITY ──────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ newPw: "", confirmPw: "" });
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk] = useState(false);

  const savePw = async () => {
    setPwErr("");
    setPwOk(false);
    if (!pwForm.newPw || !pwForm.confirmPw)
      return setPwErr("Fill in all fields.");
    if (pwForm.newPw !== pwForm.confirmPw)
      return setPwErr("Passwords don't match.");
    if (pwForm.newPw.length < 6) return setPwErr("Min 6 characters.");
    const { error } = await supabase.auth.updateUser({
      password: pwForm.newPw,
    });
    if (error) setPwErr(error.message);
    else {
      setPwOk(true);
      setPwForm({ newPw: "", confirmPw: "" });
      setTimeout(() => setPwOk(false), 3000);
    }
  };

  // ── STORE ─────────────────────────────────────────────────────────
  const [store, setStore] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currency: "NGN (₦)",
  });

  useEffect(() => {
    supabase
      .from("store_settings")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setStore(data);
      });
  }, [guestId]);

  const saveStore = async () => {
    const { error } = await supabase
      .from("store_settings")
      .upsert({ guest_id: guestId, ...store }, { onConflict: "guest_id" });
    flash(error ? "⚠ Error saving store info" : "✓ Store info saved!");
  };

  // ── DANGER ────────────────────────────────────────────────────────
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const runDelete = async (action) => {
    setDeleting(true);
    let err = null;

    if (action === "orders") {
      const { error } = await supabase.from("orders").delete().neq("id", -1);
      err = error;
    } else if (action === "reset") {
      const { error: e1 } = await supabase
        .from("orders")
        .delete()
        .neq("id", -1);
      const { error: e2 } = await supabase
        .from("products")
        .delete()
        .neq("id", -1);
      err = e1 || e2;
    }

    setDeleting(false);
    setConfirm(null);

    if (err) {
      flash(`⚠ ${err.message || "Check Supabase RLS — see guide below"}`);
    } else {
      flash("✓ Deleted! Dashboard will refresh.");
      window.dispatchEvent(new CustomEvent("admin:refresh"));
    }
  };

  // ── NAV TABS ──────────────────────────────────────────────────────
  const tabs = [
    { label: "Profile", icon: "👤" },
    { label: "Appearance", icon: "🎨" },
    { label: "Notifications", icon: "🔔" },
    { label: "Security", icon: "🔒" },
    { label: "Store", icon: "🏪" },
    { label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold font-playfair text-[#1a0a10] dark:text-[#f5e6a8]">
        Settings
      </h1>

      {/* Flash message */}
      {msg && (
        <div
          className={`text-xs font-inter px-4 py-2.5 rounded-xl border flex items-center gap-2 ${msg.startsWith("⚠") ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400" : "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400"}`}
        >
          {msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Left nav ── */}
        <div className="flex md:flex-col gap-1 scrollbar-none overflow-x-auto md:overflow-visible md:w-52 shrink-0">
          {tabs.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setTab(label);
                setMsg("");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-inter whitespace-nowrap transition-all text-left ${
                tab === label
                  ? "bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border border-[#e91e8c]/30 dark:border-[#c9a84c]/30 text-[#e91e8c] dark:text-[#c9a84c] font-semibold"
                  : label === "Danger Zone"
                    ? "text-red-500/60 hover:bg-red-50 dark:hover:bg-red-400/5 hover:text-red-500"
                    : "text-[#1a0a10]/40 dark:text-[#f5e6a8]/40 hover:bg-[#e91e8c]/5 dark:hover:bg-white/5 hover:text-[#e91e8c] dark:hover:text-[#f5e6a8]/70"
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* ── Right content ── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* ══ PROFILE ══ */}
          {tab === "Profile" && (
            <Card>
              <CardHeader
                title="Profile Information"
                sub="Updates your Supabase auth profile"
              />
              <div className="p-6 flex flex-col gap-5">
                {/* Avatar row */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 border-2 border-[#e91e8c]/30 dark:border-[#c9a84c]/40 flex items-center justify-center text-2xl text-[#e91e8c] dark:text-[#c9a84c] font-playfair shrink-0">
                    {(profile.firstName || "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-inter font-semibold text-[#1a0a10] dark:text-[#f5e6a8]">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Phone", key: "phone" },
                  ].map(({ label, key }) => (
                    <Field key={key} label={label}>
                      <input
                        value={profile[key]}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, [key]: e.target.value }))
                        }
                        className={inputCls}
                      />
                    </Field>
                  ))}
                  <Field label="Email">
                    <input
                      value={profile.email}
                      disabled
                      className={inputCls + " opacity-50 cursor-not-allowed"}
                    />
                  </Field>
                  <Field label="Bio">
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, bio: e.target.value }))
                      }
                      rows={3}
                      className={inputCls + " resize-none md:col-span-2"}
                    />
                  </Field>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 flex justify-end">
                <SaveBtn onClick={saveProfile} loading={saving} />
              </div>
            </Card>
          )}

          {/* ══ APPEARANCE ══ */}
          {tab === "Appearance" && (
            <Card>
              <CardHeader
                title="Appearance"
                sub="Customize your dashboard look"
              />
              <div className="p-6 flex flex-col gap-5">
                <p className="text-[11px] font-inter uppercase tracking-widest text-[#e91e8c]/60 dark:text-[#c9a84c]/60">
                  Theme Mode
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "🌙 Dark Mode",
                      active: isDark,
                      action: () => !isDark && toggleTheme(),
                      preview: "bg-[#070b14]",
                    },
                    {
                      label: "☀️ Light Mode",
                      active: !isDark,
                      action: () => isDark && toggleTheme(),
                      preview: "bg-[#fdf0f7]",
                    },
                  ].map(({ label, active, action, preview }) => (
                    <button
                      key={label}
                      onClick={action}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${active ? "border-[#e91e8c] dark:border-[#c9a84c] bg-[#e91e8c]/8 dark:bg-[#c9a84c]/10" : "border-[#e91e8c]/15 dark:border-[#c9a84c]/15 hover:border-[#e91e8c]/35 dark:hover:border-[#c9a84c]/35"}`}
                    >
                      <div
                        className={`w-full h-12 rounded-lg ${preview} mb-3`}
                      />
                      <p className="text-sm font-inter text-[#1a0a10] dark:text-[#f5e6a8]">
                        {label}
                      </p>
                      {active && (
                        <p className="text-[10px] text-[#e91e8c] dark:text-[#c9a84c] font-inter mt-1">
                          ✓ Active
                        </p>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#e91e8c]/5 dark:bg-white/5 border border-[#e91e8c]/10 dark:border-[#c9a84c]/10">
                  <div>
                    <p className="text-sm font-inter text-[#1a0a10] dark:text-[#f5e6a8]">
                      Quick Toggle
                    </p>
                    <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter mt-0.5">
                      Currently: {isDark ? "Dark" : "Light"}
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </Card>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {tab === "Notifications" && (
            <Card>
              <CardHeader
                title="Notifications"
                sub="Saved to Supabase · Table: user_notifications"
              />
              <div className="p-6 flex flex-col divide-y divide-[#e91e8c]/8 dark:divide-[#c9a84c]/8">
                {[
                  {
                    key: "newOrders",
                    label: "New Orders",
                    desc: "Alert when a new order comes in",
                  },
                  {
                    key: "lowStock",
                    label: "Low Stock Alerts",
                    desc: "Alert when stock falls below 5",
                  },
                  {
                    key: "reviews",
                    label: "Customer Reviews",
                    desc: "Notify when someone leaves a review",
                  },
                  {
                    key: "refunds",
                    label: "Refund Requests",
                    desc: "Immediate alert for refund requests",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="text-sm font-inter text-[#1a0a10] dark:text-[#f5e6a8]">
                        {label}
                      </p>
                      <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter mt-0.5">
                        {desc}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotif((p) => ({ ...p, [key]: !p[key] }))
                      }
                      className={`relative w-11 h-6 rounded-full border transition-all shrink-0 ${notif[key] ? "bg-[#e91e8c]/15 dark:bg-[#c9a84c]/15 border-[#e91e8c]/50 dark:border-[#c9a84c]/50" : "bg-white/5 border-[#1a0a10]/15 dark:border-white/10"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${notif[key] ? "left-[22px] bg-[#e91e8c] dark:bg-[#c9a84c]" : "left-0.5 bg-[#1a0a10]/20 dark:bg-white/20"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 flex justify-end">
                <SaveBtn onClick={saveNotif} label="Save Preferences" />
              </div>
            </Card>
          )}

          {/* ══ SECURITY ══ */}
          {tab === "Security" && (
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader
                  title="Change Password"
                  sub="Updates your Supabase auth password"
                />
                <div className="p-6 flex flex-col gap-4">
                  {[
                    { label: "New Password", key: "newPw" },
                    { label: "Confirm Password", key: "confirmPw" },
                  ].map(({ label, key }) => (
                    <Field key={key} label={label}>
                      <input
                        type="password"
                        value={pwForm[key]}
                        onChange={(e) =>
                          setPwForm((p) => ({ ...p, [key]: e.target.value }))
                        }
                        placeholder="••••••••"
                        className={inputCls}
                      />
                    </Field>
                  ))}
                  {pwErr && (
                    <p className="text-xs text-red-500 font-inter">⚠ {pwErr}</p>
                  )}
                  {pwOk && (
                    <p className="text-xs text-green-500 font-inter">
                      ✓ Password updated!
                    </p>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 flex justify-end">
                  <SaveBtn onClick={savePw} label="Update Password" />
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-base font-playfair text-[#1a0a10] dark:text-[#f5e6a8] mb-4">
                  Active Session
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-inter text-[#1a0a10] dark:text-[#f5e6a8]">
                      This device
                    </p>
                    <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter mt-0.5">
                      Chrome · Nigeria · Now
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-green-500 font-inter">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
                    Active
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* ══ STORE ══ */}
          {tab === "Store" && (
            <Card>
              <CardHeader
                title="Store Information"
                sub="Saved to Supabase · Table: store_settings"
              />
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Store Name",
                    key: "name",
                    placeholder: "Susan Luxury Perfume",
                  },
                  {
                    label: "Store Email",
                    key: "email",
                    placeholder: "store@susan.com",
                  },
                  {
                    label: "Phone Number",
                    key: "phone",
                    placeholder: "+234 000 0000",
                  },
                  {
                    label: "Store Address",
                    key: "address",
                    placeholder: "Lagos, Nigeria",
                  },
                  {
                    label: "Currency",
                    key: "currency",
                    placeholder: "NGN (₦)",
                  },
                ].map(({ label, key, placeholder }) => (
                  <Field key={key} label={label}>
                    <input
                      value={store[key]}
                      onChange={(e) =>
                        setStore((p) => ({ ...p, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className={inputCls}
                    />
                  </Field>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-[#e91e8c]/10 dark:border-[#c9a84c]/10 flex justify-end">
                <SaveBtn onClick={saveStore} />
              </div>
            </Card>
          )}

          {/* ══ DANGER ZONE ══ */}
          {tab === "Danger Zone" && (
            <div className="flex flex-col gap-4">
              {[
                {
                  action: "orders",
                  title: "Clear Orders History",
                  desc: "Permanently delete ALL order records from Supabase. Cannot be undone.",
                  btn: "Delete All Orders",
                },
                {
                  action: "reset",
                  title: "Reset Store Data",
                  desc: "Wipe all products AND orders from Supabase back to zero.",
                  btn: "Reset Everything",
                },
              ].map(({ action, title, desc, btn }) => (
                <div
                  key={action}
                  className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-red-100 dark:border-red-500/10">
                    <h2 className="text-base font-playfair text-red-500">
                      ⚠️ {title}
                    </h2>
                    <p className="text-xs text-[#1a0a10]/40 dark:text-[#f5e6a8]/30 font-inter mt-1">
                      {desc}
                    </p>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <p className="text-xs text-red-500/60 font-inter">
                      This action is{" "}
                      <span className="font-bold">irreversible</span>.
                    </p>
                    {confirm !== action ? (
                      <button
                        onClick={() => setConfirm(action)}
                        className="text-xs font-inter text-red-500 border border-red-300 dark:border-red-500/30 rounded-xl px-4 py-2 hover:bg-red-100 dark:hover:bg-red-400/10 transition-all whitespace-nowrap shrink-0"
                      >
                        {btn}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="text-xs text-red-500 font-inter">
                          Are you sure?
                        </p>
                        <button
                          onClick={() => runDelete(action)}
                          disabled={deleting}
                          className="text-xs font-inter text-white bg-red-500 rounded-xl px-3 py-2 hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          {deleting ? "Deleting..." : "Yes, delete"}
                        </button>
                        <button
                          onClick={() => setConfirm(null)}
                          className="text-xs font-inter text-[#1a0a10]/40 dark:text-[#f5e6a8]/40 border border-[#e91e8c]/15 dark:border-[#c9a84c]/15 rounded-xl px-3 py-2 hover:border-[#e91e8c]/30 dark:hover:border-[#c9a84c]/30 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* RLS Info card */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
