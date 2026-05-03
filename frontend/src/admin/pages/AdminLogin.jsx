import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ThemeToggle from "../../components/ThemeToggle";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">

      {/* ── LIGHT MODE BACKGROUND ── */}
      <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-700"
        style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(233,30,140,0.13) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(201,168,76,0.10) 0%, transparent 50%), linear-gradient(135deg, #fdf0f7 0%, #fffaf5 50%, #f9f0ff 100%)" }}
      />

      {/* ── DARK MODE BACKGROUND ── */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(233,30,140,0.08) 0%, transparent 50%), linear-gradient(135deg, #050812 0%, #0a0f1a 50%, #090511 100%)" }}
      />

      {/* ── ANIMATED ORBS ── */}
      <div className="absolute top-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(233,30,140,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none animate-orb-drift-reverse"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }}
      />
      <div className="absolute top-1/2 left-[-100px] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)" }}
      />

      {/* ── THEME TOGGLE ── */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* ── BRANDING TOP ── */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#e91e8c] dark:bg-[#c9a84c] animate-pulse" />
        <span className="font-cinzel text-xs tracking-[3px] uppercase text-[#e91e8c] dark:text-[#c9a84c] opacity-70">
          Susan Luxury
        </span>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="z-10 w-full max-w-[420px] mx-auto">
        {/* Decorative top bar */}
        <div className="h-1 w-full rounded-t-2xl"
          style={{ background: "linear-gradient(to right, #e91e8c, #ff6ec7, #c9a84c)" }}
        />

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-b-2xl px-8 py-10 flex flex-col gap-6
            bg-white/80 dark:bg-[#0d0818]/70
            backdrop-blur-2xl
            border border-[#e91e8c]/10 dark:border-[#c9a84c]/15
            shadow-2xl shadow-[#e91e8c]/8 dark:shadow-[#c9a84c]/5"
        >
          {/* Avatar / Icon */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
              bg-gradient-to-br from-[#e91e8c]/15 to-[#c9a84c]/15
              dark:from-[#c9a84c]/15 dark:to-[#e91e8c]/10
              border border-[#e91e8c]/20 dark:border-[#c9a84c]/20">
              <span className="text-2xl">🔐</span>
            </div>
            <div className="text-center">
              <h1 className="font-playfair text-2xl font-bold text-[#1a0a10] dark:text-[#f5e6a8]">
                Admin Portal
              </h1>
              <p className="font-inter text-xs mt-1 text-[#1a0a10]/50 dark:text-[#f5e6a8]/40 tracking-wide">
                Sign in to your dashboard
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <span className="text-red-500 text-sm">⚠</span>
              <p className="text-red-600 dark:text-red-400 text-sm font-inter">{error}</p>
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-[11px] tracking-[1.5px] uppercase font-semibold text-[#1a0a10]/50 dark:text-[#f5e6a8]/40">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#e91e8c]/50 dark:text-[#c9a84c]/50 text-sm pointer-events-none">
                  ✉
                </span>
                <input
                  type="email"
                  placeholder="admin@susan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl font-inter text-sm outline-none transition-all
                    bg-[#fdf0f7]/60 dark:bg-white/5
                    border border-[#e91e8c]/20 dark:border-[#c9a84c]/15
                    text-[#1a0a10] dark:text-[#f5e6a8]
                    placeholder:text-[#1a0a10]/25 dark:placeholder:text-white/20
                    focus:border-[#e91e8c]/60 dark:focus:border-[#c9a84c]/50
                    focus:bg-white dark:focus:bg-white/8
                    focus:shadow-[0_0_0_3px_rgba(233,30,140,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-[11px] tracking-[1.5px] uppercase font-semibold text-[#1a0a10]/50 dark:text-[#f5e6a8]/40">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#e91e8c]/50 dark:text-[#c9a84c]/50 text-sm pointer-events-none">
                  🔑
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-12 py-3 rounded-xl font-inter text-sm outline-none transition-all
                    bg-[#fdf0f7]/60 dark:bg-white/5
                    border border-[#e91e8c]/20 dark:border-[#c9a84c]/15
                    text-[#1a0a10] dark:text-[#f5e6a8]
                    placeholder:text-[#1a0a10]/25 dark:placeholder:text-white/20
                    focus:border-[#e91e8c]/60 dark:focus:border-[#c9a84c]/50
                    focus:bg-white dark:focus:bg-white/8
                    focus:shadow-[0_0_0_3px_rgba(233,30,140,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#e91e8c]/40 dark:text-[#c9a84c]/40 hover:text-[#e91e8c] dark:hover:text-[#c9a84c] transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3.5 rounded-xl font-cinzel text-sm tracking-[2px] uppercase font-bold
              overflow-hidden transition-all duration-300
              hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white dark:text-[#0a0804]"
            style={{
              background: loading
                ? "rgba(233,30,140,0.5)"
                : "linear-gradient(135deg, #e91e8c 0%, #c2185b 100%)",
            }}
          >
            {/* Dark mode gradient override */}
            <span
              className="absolute inset-0 opacity-0 dark:opacity-100 rounded-xl"
              style={{ background: "linear-gradient(135deg, #f5e6a8 0%, #c9a84c 50%, #a0832a 100%)" }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-[#0a0804]/30 dark:border-t-[#0a0804]" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </span>
          </button>

          {/* Footer */}
          <p className="text-center font-inter text-[11px] text-[#1a0a10]/30 dark:text-white/20">
            Restricted access · Susan Admin Panel
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
