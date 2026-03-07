const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        qwik: {
          green: "#34A853",
          red: "#EA4335",
          yellow: "#FBBC05",
          blue: "#4285F4",
          "green-light": "#5CCA75",
          "red-light": "#F47D73",
          "yellow-light": "#FCD050",
          "blue-light": "#75A9F8",
          "green-dark": "#1E7D32",
          "red-dark": "#C33024",
          "yellow-dark": "#D19A00",
          "blue-dark": "#2A68D3",
        },
        'qwik-blue': {
          DEFAULT: '#4285F4',
          dark: '#3367d6',
          light: '#5e97f6',
        },
        'qwik-green': {
          DEFAULT: '#0F9D58',
          dark: '#0b8043',
          light: '#33b679',
        },
        'qwik-red': {
          DEFAULT: '#DB4437',
          dark: '#c53929',
          light: '#e67c73',
        },
        'qwik-yellow': {
          DEFAULT: '#F4B400',
          dark: '#f09300',
          light: '#ffd666',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
