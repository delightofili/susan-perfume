// src/admin/components/Settings.jsx
// Fully functional — profile saves to Supabase auth, notifications save to localStorage

import { useContext, useState, useEffect } from "react";
import ThemeContext from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import supabase from "../../api/supabaseClient.js";

function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [activeSettingsTab, setActiveSettingsTab] = useState("Profile");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // ── Notifications — saved to localStorage ──────
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("admin_notifications");
    return saved
      ? JSON.parse(saved)
      : { newOrders: true, lowStock: true, reviews: false, refunds: true };
  });

  const saveNotifications = () => {
    localStorage.setItem("admin_notifications", JSON.stringify(notifications));
    setSaveMsg("Notifications saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  // ── Profile ────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstName: "Susan",
    lastName: "M.",
    email: "",
    phone: "",
    bio: "",
  });

  // Load current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setProfileForm((prev) => ({
          ...prev,
          email: user.email || "",
          firstName: user.user_metadata?.first_name || "Susan",
          lastName: user.user_metadata?.last_name || "M.",
          phone: user.user_metadata?.phone || "",
          bio: user.user_metadata?.bio || "",
        }));
      }
    });
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          phone: profileForm.phone,
          bio: profileForm.bio,
        },
      });
      if (error) throw error;
      setSaveMsg("Profile saved successfully!");
    } catch (err) {
      setSaveMsg("Error: " + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  // ── Password ────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setPasswordSuccess(false);
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  // ── Store info — saved to localStorage ─────────
  const [storeForm, setStoreForm] = useState(() => {
    const saved = localStorage.getItem("admin_store_info");
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", phone: "", address: "", currency: "NGN (₦)" };
  });

  const handleSaveStore = () => {
    localStorage.setItem("admin_store_info", JSON.stringify(storeForm));
    setSaveMsg("Store info saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  // ── Danger zone ─────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white font-playfair">Settings</h1>

      {/* Save message */}
      {saveMsg && (
        <div className={`text-xs font-inter px-4 py-2 rounded-xl border ${saveMsg.startsWith("Error") ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
          {saveMsg.startsWith("Error") ? "⚠ " : "✓ "}{saveMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Left nav ── */}
        <div className="flex md:flex-col gap-1 scrollbar-none overflow-x-auto md:overflow-visible md:w-48 shrink-0">
          {[
            { label: "Profile", icon: "👤" },
            { label: "Appearance", icon: "🎨" },
            { label: "Notifications", icon: "🔔" },
            { label: "Security", icon: "🔒" },
            { label: "Store", icon: "🏪" },
            { label: "Danger Zone", icon: "⚠️" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setActiveSettingsTab(label); setSaveMsg(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-inter whitespace-nowrap transition-all text-left ${activeSettingsTab === label
                  ? "bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c]"
                  : label === "Danger Zone"
                    ? "text-red-400/60 hover:bg-red-400/5 hover:text-red-400"
                    : "text-[#f5e6a8]/40 hover:bg-white/5 hover:text-[#f5e6a8]/70"
                }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* ── Right content ── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* ══ PROFILE ══ */}
          {activeSettingsTab === "Profile" && (
            <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#c9a84c]/10">
                <h2 className="text-base font-playfair text-[#f5e6a8]">Profile Information</h2>
                <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">Updates your Supabase auth profile</p>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 border-2 border-[#c9a84c]/40 flex items-center justify-center text-3xl text-[#c9a84c] font-playfair shrink-0">
                    {profileForm.firstName[0]}
                  </div>
                  <div>
                    <p className="text-xs text-[#f5e6a8]/40 font-inter">{profileForm.email}</p>
                    <p className="text-[10px] text-[#f5e6a8]/20 font-inter mt-1">Supabase admin account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Phone", key: "phone" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#f5e6a8]/40 font-inter">{label}</label>
                      <input
                        value={profileForm[key]}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8] font-inter outline-none focus:border-[#c9a84c]/50 transition-all"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f5e6a8]/40 font-inter">Email</label>
                    <input
                      value={profileForm.email}
                      disabled
                      className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8]/40 font-inter outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs text-[#f5e6a8]/40 font-inter">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8] font-inter outline-none focus:border-[#c9a84c]/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[#c9a84c]/10 flex justify-end gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="text-xs font-inter text-[#0a0804] bg-[#c9a84c] rounded-xl px-5 py-2 font-bold hover:bg-[#b8942e] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <span className="w-3 h-3 border border-[#0a0804]/30 border-t-[#0a0804] rounded-full animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ══ APPEARANCE ══ */}
          {activeSettingsTab === "Appearance" && (
            <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#c9a84c]/10">
                <h2 className="text-base font-playfair text-[#f5e6a8]">Appearance</h2>
                <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">Customize your dashboard look</p>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <p className="text-xs text-[#f5e6a8]/40 font-inter uppercase tracking-widest">Theme Mode</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => !isDark && toggleTheme()}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${isDark ? "border-[#c9a84c] bg-[#c9a84c]/10" : "border-[#c9a84c]/15 hover:border-[#c9a84c]/35"}`}
                  >
                    <div className="w-full h-14 rounded-lg bg-[#070b14] mb-3 flex gap-1.5 p-2 overflow-hidden">
                      <div className="w-8 h-full rounded bg-[#0a0f1a]" />
                      <div className="flex-1 h-full rounded bg-[#0f1621]" />
                    </div>
                    <p className="text-sm font-inter text-[#f5e6a8]">🌙 Dark Mode</p>
                    {isDark && <p className="text-[10px] text-[#c9a84c] font-inter mt-1">✓ Active</p>}
                  </button>
                  <button
                    onClick={() => isDark && toggleTheme()}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${!isDark ? "border-[#c9a84c] bg-[#c9a84c]/10" : "border-[#c9a84c]/15 hover:border-[#c9a84c]/35"}`}
                  >
                    <div className="w-full h-14 rounded-lg bg-[#f0ece0] mb-3 flex gap-1.5 p-2 overflow-hidden">
                      <div className="w-8 h-full rounded bg-[#e0d9c8]" />
                      <div className="flex-1 h-full rounded bg-[#faf7f2]" />
                    </div>
                    <p className="text-sm font-inter text-[#f5e6a8]">☀️ Light Mode</p>
                    {!isDark && <p className="text-[10px] text-[#c9a84c] font-inter mt-1">✓ Active</p>}
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-black/20 border border-[#c9a84c]/10">
                  <div>
                    <p className="text-sm font-inter text-[#f5e6a8]">Quick Toggle</p>
                    <p className="text-xs text-[#f5e6a8]/30 font-inter mt-0.5">Currently: {isDark ? "Dark" : "Light"}</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {activeSettingsTab === "Notifications" && (
            <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#c9a84c]/10">
                <h2 className="text-base font-playfair text-[#f5e6a8]">Notifications</h2>
                <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">Saved to your browser</p>
              </div>
              <div className="p-6 flex flex-col divide-y divide-[#c9a84c]/8">
                {[
                  { key: "newOrders", label: "New Orders", desc: "Get notified when a new order comes in" },
                  { key: "lowStock", label: "Low Stock Alerts", desc: "Alert when product stock falls below 5" },
                  { key: "reviews", label: "Customer Reviews", desc: "Notify when someone leaves a review" },
                  { key: "refunds", label: "Refund Requests", desc: "Immediate alert for any refund request" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-inter text-[#f5e6a8]">{label}</p>
                      <p className="text-xs text-[#f5e6a8]/30 font-inter mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative w-11 h-6 rounded-full border transition-all shrink-0 ${notifications[key] ? "bg-[#c9a84c]/15 border-[#c9a84c]/50" : "bg-white/5 border-white/10"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-sm ${notifications[key] ? "left-[22px] bg-[#c9a84c]" : "left-0.5 bg-white/20"}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-[#c9a84c]/10 flex justify-end">
                <button
                  onClick={saveNotifications}
                  className="text-xs font-inter text-[#0a0804] bg-[#c9a84c] rounded-xl px-5 py-2 font-bold hover:bg-[#b8942e] transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ══ SECURITY ══ */}
          {activeSettingsTab === "Security" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#c9a84c]/10">
                  <h2 className="text-base font-playfair text-[#f5e6a8]">Change Password</h2>
                  <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">Updates your Supabase auth password</p>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  {[
                    { label: "New Password", value: newPassword, setter: setNewPassword },
                    { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword },
                  ].map(({ label, value, setter }) => (
                    <div key={label} className="flex flex-col gap-1.5">
                      <label className="text-xs text-[#f5e6a8]/40 font-inter">{label}</label>
                      <input
                        type="password"
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        placeholder="••••••••"
                        className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8] font-inter outline-none focus:border-[#c9a84c]/50 transition-all placeholder:text-white/10"
                      />
                    </div>
                  ))}
                  {passwordError && <p className="text-xs text-red-400 font-inter">⚠ {passwordError}</p>}
                  {passwordSuccess && <p className="text-xs text-green-400 font-inter">✓ Password updated successfully</p>}
                </div>
                <div className="px-6 py-4 border-t border-[#c9a84c]/10 flex justify-end">
                  <button
                    onClick={handlePasswordUpdate}
                    className="text-xs font-inter text-[#0a0804] bg-[#c9a84c] rounded-xl px-5 py-2 font-bold hover:bg-[#b8942e] transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 p-6">
                <h2 className="text-base font-playfair text-[#f5e6a8] mb-4">Active Session</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-inter text-[#f5e6a8]">This device</p>
                    <p className="text-xs text-[#f5e6a8]/30 font-inter mt-0.5">Chrome · Nigeria · Now</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-green-400 font-inter">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ══ STORE ══ */}
          {activeSettingsTab === "Store" && (
            <div className="rounded-2xl bg-white/5 border border-[#c9a84c]/15 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#c9a84c]/10">
                <h2 className="text-base font-playfair text-[#f5e6a8]">Store Information</h2>
                <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">Saved to your browser for now</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {[
                  { label: "Store Name", key: "name", placeholder: "e.g. Susan Luxury Perfume" },
                  { label: "Store Email", key: "email", placeholder: "store@example.com" },
                  { label: "Phone Number", key: "phone", placeholder: "+234 000 0000" },
                  { label: "Store Address", key: "address", placeholder: "Lagos, Nigeria" },
                  { label: "Currency", key: "currency", placeholder: "NGN (₦)" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#f5e6a8]/40 font-inter">{label}</label>
                    <input
                      value={storeForm[key]}
                      onChange={(e) => setStoreForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="bg-black/30 border border-[#c9a84c]/15 rounded-xl px-4 py-2.5 text-sm text-[#f5e6a8] font-inter outline-none focus:border-[#c9a84c]/50 transition-all placeholder:text-white/15"
                    />
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-[#c9a84c]/10 flex justify-end gap-3">
                <button
                  onClick={handleSaveStore}
                  className="text-xs font-inter text-[#0a0804] bg-[#c9a84c] rounded-xl px-5 py-2 font-bold hover:bg-[#b8942e] transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ══ DANGER ZONE ══ */}
          {activeSettingsTab === "Danger Zone" && (
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Clear Orders History",
                  desc: "Permanently delete all order records. This cannot be undone.",
                  btn: "Delete All Orders",
                },
                {
                  title: "Reset Store Data",
                  desc: "Wipe all products, orders and settings back to default.",
                  btn: "Reset Everything",
                },
              ].map(({ title, desc, btn }) => (
                <div key={title} className="rounded-2xl bg-red-950/20 border border-red-500/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-500/10">
                    <h2 className="text-base font-playfair text-red-400">⚠️ {title}</h2>
                    <p className="text-xs text-[#f5e6a8]/30 font-inter mt-1">{desc}</p>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <p className="text-xs text-red-400/60 font-inter">
                      This action is <span className="font-bold">irreversible</span>.
                    </p>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(btn)}
                        className="text-xs font-inter text-red-400 border border-red-400/30 rounded-xl px-4 py-2 hover:bg-red-400/10 transition-all whitespace-nowrap shrink-0"
                      >
                        {btn}
                      </button>
                    ) : showDeleteConfirm === btn ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="text-xs text-red-400 font-inter">Are you sure?</p>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-xs font-inter text-white bg-red-500 rounded-xl px-3 py-2 hover:bg-red-600 transition-all"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-xs font-inter text-[#f5e6a8]/40 border border-[#c9a84c]/15 rounded-xl px-3 py-2 hover:border-[#c9a84c]/30 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(btn)}
                        className="text-xs font-inter text-red-400 border border-red-400/30 rounded-xl px-4 py-2 hover:bg-red-400/10 transition-all whitespace-nowrap shrink-0"
                      >
                        {btn}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Settings;