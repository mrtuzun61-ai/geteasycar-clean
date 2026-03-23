/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f8fc",
          100: "#e8eff6",
          200: "#d6e2ee",
          300: "#b9cbde",
          400: "#89a8c5",
          500: "#5d82a8",
          600: "#3f648b",
          700: "#27496d",
          800: "#163859",
          900: "#102a43",
          950: "#0b1b2b",
        },
        ink: {
          50: "#f8fafc",
          100: "#eef2f6",
          200: "#d9e1ea",
          300: "#b7c4d2",
          400: "#8c9aac",
          500: "#667489",
          600: "#4b5a6d",
          700: "#334155",
          800: "#1f2d3d",
          900: "#10233b",
          950: "#0a1624",
        },
        surface: {
          50: "#fcfdff",
          100: "#f7f9fc",
          200: "#eef3f8",
          300: "#e4ebf3",
          400: "#d6e0ea",
          500: "#c4d0dd",
          600: "#a7b5c5",
          700: "#8291a3",
          800: "#5c6b7e",
          900: "#3d4a5c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 12px 32px rgba(16, 42, 67, 0.06)",
        "card-hover": "0 22px 55px rgba(16, 42, 67, 0.10)",
        panel: "0 18px 48px rgba(8, 24, 40, 0.10)",
        hero: "0 30px 80px rgba(7, 23, 40, 0.18)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0b1b2b 0%, #102a43 38%, #163859 70%, #27496d 100%)",
        "cta-gradient":
          "linear-gradient(135deg, #102a43 0%, #163859 55%, #27496d 100%)",
        "soft-gradient":
          "linear-gradient(180deg, #fcfdff 0%, #f4f8fc 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};