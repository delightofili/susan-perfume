import { createContext, useState, useCallback } from "react";

const ToastContext = createContext();

export default ToastContext;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ message, type = "success", duration = 2500 }) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-2.5 px-5 py-3 rounded-full shadow-lg
              font-inter text-sm font-medium
              animate-slide-up
              ${
                toast.type === "success"
                  ? "bg-[#0a0f1a] dark:bg-white text-[#c9a84c] dark:text-[#0a0f1a] border border-[#c9a84c]/30"
                  : toast.type === "remove"
                    ? "bg-red-950 text-red-300 border border-red-500/20"
                    : "bg-[#0a0f1a] text-[#f5e6a8] border border-[#c9a84c]/20"
              }
            `}
          >
            <span className="text-base">
              {toast.type === "success"
                ? "🛒"
                : toast.type === "remove"
                  ? "🗑"
                  : "ℹ️"}
            </span>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
