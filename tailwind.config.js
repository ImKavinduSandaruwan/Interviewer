// /** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        hepta: ["Hepta Slab", "sans-serif"],
        serif_4: ["Source Serif 4", "sans-serif"],
      },
    },
  },
  plugins: [],
};
