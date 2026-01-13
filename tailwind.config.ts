import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "ui-sans-serif", "system-ui"],
        roboto: ["var(--font-roboto)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
