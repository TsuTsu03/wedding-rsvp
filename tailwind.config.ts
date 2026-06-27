import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Replace the default palette entirely - only intentional tokens.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      // Channel-based so opacity modifiers (text-ink/50, bg-sage/[0.05]) work.
      paper: "rgb(var(--paper-rgb) / <alpha-value>)",
      surface: "rgb(var(--surface-rgb) / <alpha-value>)",
      ink: {
        DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
        soft: "rgb(var(--ink-soft-rgb) / <alpha-value>)",
      },
      olive: {
        DEFAULT: "rgb(var(--olive-rgb) / <alpha-value>)",
        soft: "rgb(var(--olive-soft-rgb) / <alpha-value>)",
      },
      clay: "rgb(var(--clay-rgb) / <alpha-value>)",
      line: "rgb(var(--line-rgb) / <alpha-value>)",
      noir: {
        DEFAULT: "rgb(var(--noir-rgb) / <alpha-value>)",
        2: "rgb(var(--noir-2-rgb) / <alpha-value>)",
        line: "rgb(var(--noir-line-rgb) / <alpha-value>)",
      },
      sage: "rgb(var(--sage-rgb) / <alpha-value>)",
      ivory: "rgb(var(--ivory-rgb) / <alpha-value>)",
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23,1,0.32,1)",
        "in-out": "cubic-bezier(0.77,0,0.175,1)",
        drawer: "cubic-bezier(0.32,0.72,0,1)",
      },
      maxWidth: {
        prose2: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
