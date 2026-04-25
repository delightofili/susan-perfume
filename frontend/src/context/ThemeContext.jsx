import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();
export default ThemeContext;

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false); // Simple boolean for light/dark

  // Init from localStorage or system
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialDark = saved === "dark" || (!saved && systemDark);
    setIsDark(initialDark);
  }, []);

  // Apply to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
