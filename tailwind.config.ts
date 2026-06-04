import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          bg: "#0a0a14",
          surface: "#12121f",
          border: "#1e1e3a",
          accent: "#e8a020",       // gold — estilo troféu
          accentAlt: "#5b8dd9",    // azul — spirits
          text: "#e8e8f0",
          muted: "#6b6b8a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        "vault-in": {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "vault-in": "vault-in 0.25s ease-out forwards",
        shimmer: "shimmer 1.4s infinite linear",
      },
    },
  },
  // Safelist garante que classes dinâmicas (status log) não sejam purgadas
  safelist: [
    "bg-emerald-400",
    "bg-sky-400",
    "bg-amber-400",
    "text-emerald-400",
    "text-sky-400",
    "text-amber-400",
    "animate-ping",
  ],
  plugins: [],
};

export default config;
