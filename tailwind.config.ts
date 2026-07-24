import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0F172A",
          700: "#334155",
          500: "#64748B",
          300: "#94A3B8",
          100: "#E2E8F0",
        },
        accent: {
          from: "#4F46E5",
          to:   "#7C3AED",
          soft: "#EEF2FF",
        },
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.025em',
        wider2:   '0.14em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 20px 40px -20px rgba(15,23,42,0.12), 0 4px 12px -6px rgba(15,23,42,0.08)',
        'glass-sm': '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 4px 12px -6px rgba(15,23,42,0.08)',
        'glass-strong': '0 1px 0 0 rgba(255,255,255,0.95) inset, 0 32px 64px -24px rgba(79,70,229,0.18), 0 8px 20px -8px rgba(15,23,42,0.10)',
      },
      backdropSaturate: {
        180: '1.8',
      },
    },
  },
  plugins: [],
};
export default config;
