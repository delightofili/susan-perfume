import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { FaRegSun } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex items-center gap-2 bg-white/5 border border-pink-800 dark:border-[#c9a84c]/20 rounded-xl px-3 py-2 hover:bg-[pink]/30 dark:hover:bg-[#c9a84c]/10 hover:border-pink/50 dark:hover:border-[#c9a84c]/40 transition-all group cursor-pointer"
    >
      {/* Icon */}
      <span className="text-sm leading-none dark:text-[#c9a84c] text-pink-700 ">
        {isDark ? <FaRegSun /> : <FaRegMoon />}
      </span>

      {/* Label — hidden on mobile, visible on desktop */}
      <span
        className="hidden md:block text-xs font-inter text-[pink]/90 dark:text-[#f5e6a8]/50  
     group-hover:text-[pink/50]  dark:group-hover:text-[#c9a84c] transition-colors whitespace-nowrap"
      >
        {isDark ? "Light mode" : "Dark mode"}
      </span>

      {/* Track + thumb */}
      <div className="relative w-9 h-5 rounded-full border border-[pink]/30 dark:border-[#c9a84c]/30 bg-[pink]/10 dark:bg-[#c9a84c]/10 shrink-0">
        <div
          className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-pink-800 dark:bg-[#c9a84c] shadow-sm shadow-[pink]/60 dark:shadow-[#c9a84c]/40 transition-all duration-300 ${
            isDark ? "left-4.5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}
