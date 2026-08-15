import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-black": "#000000",
        "primary-soft-black": "#151515",
        "primary-charcoal-black": "#1c1c1c",
        "muted-gold": "#b89b5e",
        "solid-gold": "#e6c76a",
        "pure-white": "#ffffff",
        "soft-white": "#ededed",
        "muted-gray": "#9a9a9a",
        "warm-cream": "#f6f1ea",
        "pink-blush": "#e91e8c",
        "solid-pink": "#c2185b",
        "pink-cream": "#d81b8a",
        golden: "#c9a84c",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
