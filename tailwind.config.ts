import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/assets/**/*.{png,ico,webmanifest}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "hot-pink": "#FF1D8E", // From #graphic.
        "yellow-green": "#BFD630", // From #graphic.
      },
    },
  },
  plugins: [],
} satisfies Config;
