import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ThemeToggle from "../../components/ThemeToggle";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      {/* ── BACKGROUNDS ── */}
      <div
        className="absolute inset-0 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#f8c8da_0%,#fdf0f5_45%,#fff8f0_100%)]
        dark:opacity-0"
      />

      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500
        bg-[radial-gradient(ellipse_at_top_right,#1a0410_0%,#0a0f1a_60%)]"
      />

      {/* ORBS */}
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none
        bg-[radial-gradient(circle,rgba(201,168,76,0.18)_0%,transparent_70%)]"
      />

      <div
        className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none
        bg-[radial-gradient(circle,rgba(194,24,91,0.10)_0%,transparent_70%)]"
      />

      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        <ThemeToggle />
      </div>

      {/* ── FORM CARD ── */}
      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-md mx-auto rounded-2xl p-6 sm:p-8
        bg-pink-blush/80 dark:bg-primary-black/40
        backdrop-blur-xl shadow-2xl flex flex-col items-center"
      >
        {/* LOGO */}
        <img
          src="/images/singlePerf.png"
          alt="Logo"
          className="h-20 sm:h-24 w-auto mb-4"
        />

        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl font-playfair text-primary-charcoal-black dark:text-[#f5e6a8]">
          Admin Login
        </h2>

        <p className="text-sm sm:text-base mt-2 mb-6 opacity-60 font-inter text-primary-charcoal-black dark:text-[#f5e6a8]">
          Sign in to your dashboard
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* INPUT BOX */}
        <div
          className="w-full space-y-4 p-5 rounded-xl shadow-lg
          bg-gray-300/30 dark:bg-primary-black/40"
        >
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg outline-none transition
            border border-primary-black dark:border-solid-gold
            text-primary-black dark:text-white/90
            focus:ring-1 focus:ring-primary-black dark:focus:ring-solid-gold"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg outline-none transition
            border border-primary-black dark:border-solid-gold
            text-primary-black dark:text-white/90
            focus:ring-1 focus:ring-primary-black dark:focus:ring-solid-gold"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-playfair text-lg
            bg-(image:--luxury-gold-gradient)
            dark:bg-(image:--luxury-gold-gradi)
            text-primary-charcoal-black
            hover:scale-[1.01] transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
