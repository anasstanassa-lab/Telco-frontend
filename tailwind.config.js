/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Space Grotesk'", "sans-serif"],
      },
      colors: {
        navy: {
          900: "#070d1a",
          800: "#0a0e1a",
          700: "#0d1225",
          600: "#111827",
          500: "#1e2d4a",
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "fade-up": "fadeInUp 0.35s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "slide-out": "slideOut 0.3s ease forwards",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: 1 },
          "80%, 100%": { transform: "scale(2.2)", opacity: 0 },
        },
        fadeInUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(120px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideOut: {
          from: { opacity: 1, transform: "translateX(0)" },
          to: { opacity: 0, transform: "translateX(120px)" },
        },
      },
    },
  },
  plugins: [],
};
