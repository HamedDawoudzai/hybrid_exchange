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
        // HD Investing Corp brand colors
        brand: {
          black: "#000000",
          charcoal: "#0a0a0a",
          onyx: "#111111",
          graphite: "#1a1a1a",
          white: "#ffffff",
          ivory: "#fafafa",
          cream: "#f5f5f5",
        },
        // Gold accent palette for premium feel
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#d4af37", // Classic gold
          600: "#c9a962", // Champagne gold
          700: "#a38429",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
        // Neutral grays for text/borders
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Semantic colors
        success: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        danger: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      fontFamily: {
        // Elegant serif for headings
        serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        // Clean sans-serif for body
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-elegant": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        "gradient-gold": "linear-gradient(135deg, #c9a962 0%, #d4af37 50%, #c9a962 100%)",
      },
      boxShadow: {
        "elegant": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "gold": "0 4px 20px -2px rgba(201, 169, 98, 0.3)",
        "glow": "0 0 40px -10px rgba(201, 169, 98, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
