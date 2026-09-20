import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Gallery Palette
        bone: {
          DEFAULT: "#F4F1EA",
          50: "#FAF9F5",
          100: "#F4F1EA", // Primary Background Light
          200: "#ECE7DC",
          300: "#E3DCCF",
        },
        ink: {
          DEFAULT: "#141414",
          light: "#262626",
          dark: "#0E0E0E",
        },
        stone: {
          DEFAULT: "#8A867D",
          light: "#B0ACA3",
          dark: "#57544E",
          border: "#DCD6CB",
        },
        sand: {
          DEFAULT: "#E9E4DA",
          light: "#F0ECE3",
          dark: "#D8D1C3",
        },
        // Swappable collection accent (default Clay)
        clay: {
          DEFAULT: "var(--accent, #B5532F)",
          hover: "#9D4424",
          light: "#D87854",
        },
        accent: {
          DEFAULT: "var(--accent, #B5532F)",
          hover: "var(--accent-hover, #9D4424)",
        },
        // Semantic mappings
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Instrument Serif", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Geist", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        editorial: "-0.02em",
        spec: "0.18em",
        widest: "0.25em",
        ultra: "0.35em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
        "luxury-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-left": "slideLeft 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "marquee": "marquee 24s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
