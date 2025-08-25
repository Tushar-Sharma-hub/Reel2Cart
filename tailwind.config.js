/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 25px -10px rgba(0,0,0,0.15)'
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          700: '#0369a1'
        }
      }
    },
  },
  plugins: [],
}
