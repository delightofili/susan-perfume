"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.js";
import { useToast } from "../../../context/ToastContext.js";
import { SectionDivider } from "../../../components/SectionDivider.js";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      addToast("Welcome to Susan Admin Portal", "success");
      router.push("/admin/dashboard");
    } catch (err: any) {
      addToast(err.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 md:px-12 bg-white dark:bg-[#070b14] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <SectionDivider title="Admin Portal" subtitle="Authorized Atelier Staff Access Only" />

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-[#fff8fb] dark:bg-[#0d1526] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 shadow-2xl space-y-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e91e8c]/10 dark:bg-[#c9a84c]/10 text-[#e91e8c] dark:text-[#c9a84c] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@susanperfume.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#131b2e] border border-[#e91e8c]/20 dark:border-[#c9a84c]/20 text-sm focus:outline-none focus:border-[#e91e8c] dark:focus:border-[#c9a84c] text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#e91e8c] dark:bg-[#c9a84c] text-white dark:text-[#0a0f1a] font-cinzel font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
          >
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </button>

          <p className="text-[11px] font-inter text-gray-400 text-center flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Default dev login: admin@susanperfume.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
