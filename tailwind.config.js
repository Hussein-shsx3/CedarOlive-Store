/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        title: "var(--color-title)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        icons: "var(--color-icons)",
        borderColor: "var(--color-border)",
      },
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1250px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};
