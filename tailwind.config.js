/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0D0A08",
          main: "#0D0A08",
          card: "#17110D",
          elevated: "#17110D",
          secondary: "#24170F",
        },
        surface: {
          DEFAULT: "#17110D",
          light: "#24170F",
          elevated: "#302016",
        },
        brand: {
          red: "#EC3507",
          "deep-red": "#D42404",
          orange: "#FC8706",
          "flame-orange": "#F65D06",
          yellow: "#FDB006",
          burnt: "#C2562D",
          white: "#FFFFFF",
          secondary: "#FFF1DF",
          muted: "#B8A99A",
          border: "rgba(252, 135, 6, 0.25)",
          "border-hover": "#FC8706",
        },
        primary: {
          DEFAULT: "#FC8706",
          dark: "#EC3507",
          light: "#FDB006",
        },
        accent: {
          DEFAULT: "#F65D06",
          dark: "#D42404",
          light: "#FDB006",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#FFF1DF",
          muted: "#B8A99A",
        },
        border: "rgba(252, 135, 6, 0.25)",
        "border-hover": "#FC8706",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(110deg, #D42404 0%, #EC3507 35%, #FC8706 70%, #FDB006 100%)",
        "gradient-btn": "linear-gradient(110deg, #EC3507, #FC8706)",
        "gradient-hero": "linear-gradient(135deg, #0D0A08 0%, #24170F 55%, #48200E 100%)",
        "gradient-text": "linear-gradient(90deg, #EC3507, #FC8706, #FDB006)",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
