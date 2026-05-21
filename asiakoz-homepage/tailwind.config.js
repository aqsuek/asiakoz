/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#12B7D5",
          dark: "#0E9BB5",
          light: "#E8F8FC",
          soft: "#F0FAFD",
        },
        ink: {
          DEFAULT: "#1A2B3C",
          muted: "#5B6B7C",
          faint: "#8A97A6",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 32px rgba(26, 43, 60, 0.08)",
        card: "0 4px 24px rgba(18, 183, 213, 0.08)",
        float: "0 12px 40px rgba(26, 43, 60, 0.12)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(18, 183, 213, 0.12) 0%, transparent 70%)",
        "section-fade":
          "linear-gradient(180deg, #F8FCFE 0%, #FFFFFF 40%, #F5FAFC 100%)",
      },
    },
  },
  plugins: [],
};
