import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "purple-primary": "#a855f7",
        "dark-card": "#1a1a1e",
        "dark-border": "#2d2d33",
      },
    },
  },
  plugins: [],
};

export default config;
