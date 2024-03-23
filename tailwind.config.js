/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: "0px 0px 8px rgba(0, 0, 0, 0.30)"
      },
      /* Per review comment of i74, keep both the old and simplified colour palettes until the colours are streamlined */
      /* Old palette */
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#cbfcf3",
          200: "#97f8e8",
          300: "#5bedda",
          400: "#29d8c7",
          500: "#10bcae",
          600: "#098d85",
          700: "#0c7973",
          800: "#0f605d",
          900: "#124f4d",
          950: "#033030"
        },
        secondary: {
          50: "#f9fefd",
          100: "#cef9f1",
          200: "#9cf3e5",
          300: "#63e5d5",
          400: "#33cec0",
          500: "#19b3a7",
          600: "#119088",
          700: "#12736e",
          800: "#145b59",
          900: "#154c4a",
          950: "#052e2e"
        },
        grey: {
          50: "#f4f7f7",
          100: "#e2e9eb",
          200: "#c8d4d9",
          300: "#a1b6bf",
          400: "#74919c",
          500: "#56727e",
          600: "#4c626e",
          700: "#42525c",
          800: "#3b474f",
          900: "#353e44",
          950: "#20272c"
        },
        darkAqua: {
          50: "#f2fbfa",
          100: "#d2f5ef",
          200: "#a5eae2",
          300: "#70d8cf",
          400: "#43beb7",
          500: "#29a39d",
          600: "#1e807e",
          700: "#1c6968",
          800: "#1b5454",
          900: "#1b4646",
          950: "#0a2729"
        },
        lightAqua: {
          50: "#f1fafa",
          100: "#dcf1ef",
          200: "#a6dcdb",
          300: "#8ed2d2",
          400: "#59b6b7",
          500: "#3d9b9d",
          600: "#357f85",
          700: "#31676d",
          800: "#2f565b",
          900: "#2b494e",
          950: "#182f34"
        },
        /* Simplified palette */
        app: {
          primary: {
            DEFAULT: "#098D85",
            focus: "#035E58"
          },
          secondary: {
            DEFAULT: "#DCF1EF",
            focus: "#A6DCDB"
          },
          accent: {
            DEFAULT: "#AACFEE",
            focus: "#84B1D6"
          },
          base: {
            100: "#F4F7F7",
            200: "#56727E",
            300: "#224250"
          }
        }
      },
      animation: {
        "reverse-spin": "reverse-spin 1s linear infinite"
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)"
          }
        }
      }
    },
    plugins: [require("tailwind-scrollbar")]
  }
};
