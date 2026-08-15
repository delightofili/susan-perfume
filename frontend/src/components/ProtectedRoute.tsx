"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.js";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070b14]">
        <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
