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
    // ETL log status colors
    "bg-emerald-400", "bg-sky-400", "bg-amber-400",
    "text-emerald-400", "text-sky-400", "text-amber-400",
    "animate-ping",
    // Era accent border-left (FighterProfile)
    "border-l-amber-500", "border-l-sky-400", "border-l-purple-500",
    "border-l-blue-400", "border-l-red-500",
    // Era header gradient origins
    "from-amber-950/50", "from-sky-950/50", "from-purple-950/60",
    "from-blue-950/50", "from-red-950/50",
    // Era badge colors (border + bg + text)
    "border-amber-500/50", "border-sky-500/50", "border-purple-500/50",
    "border-blue-500/50", "border-red-500/50",
    "bg-amber-950/30", "bg-sky-950/30", "bg-purple-950/30",
    "bg-blue-950/30", "bg-red-950/30",
    "text-amber-300", "text-sky-300", "text-purple-300",
    "text-blue-300", "text-red-300",
    // Platform badge BG + border + text
    "bg-amber-950/60", "bg-sky-950/60", "bg-purple-950/60",
    "bg-blue-950/60", "bg-red-950/60",
    "border-amber-600/40", "border-sky-500/40", "border-purple-500/40",
    "border-blue-500/40", "border-red-500/40",
  ],
  plugins: [],
};

export default config;
