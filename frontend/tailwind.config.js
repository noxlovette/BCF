/** @type {Partial<CustomThemeConfig & {extend: Partial<CustomThemeConfig>}> & DefaultTheme} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        space: ["Space Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        gold: {
          50: "#FFF4E0",
          100: "#FFE8C2",
          200: "#FFD773",
          300: "#EDC86B",
          400: "#E8C468",
          500: "#DBB963",
          600: "#C7A85A",
          700: "#B39750",
          800: "#9E8547",
          900: "#756335",
          950: "#3B2917",
        },
        peach: {
          50: "#FFF0E5",
          100: "#FFE4CC",
          200: "#FCD0A3",
          300: "#FAA764",
          400: "#F4A261",
          500: "#E69A5C",
          600: "#D18C54",
          700: "#BD7E4B",
          800: "#A87143",
          900: "#6B482B",
          950: "#2E2113",
        },
        navy: {
          50: "#E8EEF1",
          100: "#D1DCE3",
          200: "#A2B9C7",
          300: "#6DC9ED",
          400: "#64B8D9",
          500: "#5195B0",
          600: "#48849C",
          700: "#3E7287",
          800: "#223F4A",
          900: "#192D36",
          950: "#0D161B",
        },
        aqua: {
          50: "#E6F8F5",
          100: "#CCF1EC",
          200: "#99E3D8",
          300: "#42F5E0",
          400: "#3DE0CD",
          500: "#37CCBB",
          600: "#2CA395",
          700: "#278F83",
          800: "#217A70",
          900: "#1C665D",
          950: "#0F332E",
        },
        grapefruit: {
          50: "#FEEAE6",
          100: "#FCD5CC",
          200: "#F9AA99",
          300: "#ED7253",
          400: "#E76F51",
          500: "#D9684C",
          600: "#C45E45",
          700: "#B0543E",
          800: "#733728",
          900: "#5E2D21",
          950: "#2F1610",
        },
      }
      
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
