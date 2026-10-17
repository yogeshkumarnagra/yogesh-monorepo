import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg: "#0a0a0f",
        card: "#111118",
        "card-hover": "#16161f",
        border: "#1e1e2e",
        accent: "#7c3aed",
        "accent-light": "#a78bfa",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        green: "#10b981",
      },
    },
  },
  plugins: [],
};
export default config;
