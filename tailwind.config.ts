import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C1F3A",
          soft: "#24406B",
          muted: "#5A6E8C",
          faint: "#8CA0BC",
        },
        brand: {
          50: "#EEF5FF",
          100: "#DCEBFF",
          200: "#B9D7FF",
          300: "#8ABAFF",
          400: "#5495F7",
          500: "#2A72EC",
          600: "#1259D6",
          700: "#0E48B0",
          800: "#0D3C8F",
          900: "#0C2F6E",
        },
        mist: {
          50: "#F7FAFE",
          100: "#F1F6FC",
          200: "#E7F0FA",
          300: "#DCE9F7",
        },
        accent: {
          DEFAULT: "#D8453E",
          soft: "#FBEDEB",
        },
        line: "#E2ECF7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12,31,58,0.04), 0 8px 24px -12px rgba(12,31,58,0.12)",
        lift: "0 2px 4px rgba(12,31,58,0.05), 0 18px 40px -16px rgba(12,31,58,0.22)",
        stage: "0 0 0 1px rgba(18,89,214,0.10), 0 24px 60px -24px rgba(18,89,214,0.35)",
      },
      maxWidth: {
        shell: "80rem",
      },
    },
  },
  plugins: [],
};

export default config;
