import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#FFC20E",
          "gold-light": "#FFD54F",
          "gold-dark": "#E5AC00",
          crimson: "#8B0000",
          "crimson-light": "#A81818",
          "crimson-dark": "#630000",
          dark: "#111111",
          surface: "#F8F9FA",
          card: "#FFFFFF",
          muted: "#6B7280",
          border: "#E5E7EB",
          slate: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "-apple-system", "sans-serif"],
        editorial: ["var(--font-poppins)", "Poppins", "Georgia", "serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker-slide": "ticker 25s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(255, 194, 14, 0.25)",
        crimson: "0 4px 20px -2px rgba(139, 0, 0, 0.25)",
        card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        brand: "5px",
      },
    },
  },
  plugins: [],
};
export default config;
