"use client";

import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "../context/ToastContext.js";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slide-up transition-all ${
            toast.type === "error"
              ? "bg-red-500/90 text-white border-red-400"
              : toast.type === "info"
              ? "bg-blue-600/90 text-white border-blue-400"
              : "bg-[#e91e8c]/95 dark:bg-[#0f172a]/95 text-white border-[#e91e8c] dark:border-[#c9a84c]"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 shrink-0" />}
            {toast.type === "success" && <CheckCircle className="w-5 h-5 shrink-0 text-white dark:text-[#c9a84c]" />}
            <span className="font-inter text-xs md:text-sm font-medium tracking-wide">
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:opacity-75 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
