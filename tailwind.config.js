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
      colors: {
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
          300: "224250"
        }
      }
    },
    plugins: [require("tailwind-scrollbar")]
  }
};
