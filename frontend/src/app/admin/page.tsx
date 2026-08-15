"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /admin → redirect to /admin/dashboard
 */
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#070b14]">
      <div className="animate-spin w-8 h-8 border-4 border-[#e91e8c] dark:border-[#c9a84c] border-t-transparent rounded-full" />
    </div>
  );
}
