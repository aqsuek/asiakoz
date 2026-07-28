/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#00A9C1",
          dark: "#008FA3",
          deep: "#0B3A4A",
          light: "#D4F4F9",
          soft: "#EDFAFC",
        },
        ink: {
          DEFAULT: "#0C1222",
          muted: "#4A5568",
          faint: "#7A8494",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F8FB",
          warm: "#FAFCFD",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        futura: [
          '"Futura"',
          '"Futura PT"',
          '"Avenir Next"',
          '"Century Gothic"',
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 16px rgba(12, 18, 34, 0.05)",
        card: "0 10px 36px rgba(12, 18, 34, 0.08)",
        float: "0 20px 50px rgba(12, 18, 34, 0.12)",
        glow: "0 8px 28px rgba(0, 169, 193, 0.22)",
      },
      keyframes: {
        fadeSlide: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeSlide: "fadeSlide 0.45s ease",
      },
    },
  },
  plugins: [],
};
