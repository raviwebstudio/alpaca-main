import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F5F2",
        canvas: "#FBF8F4",
        surface: "#FFFFFF",
        "surface-muted": "#F1EBE5",
        "surface-strong": "#E8DED5",
        line: "#E8DED4",
        accent: "#B48B67",
        "accent-soft": "#F0E1D2",
        dark: "#16120F",
        "text-primary": "#181512",
        "text-secondary": "#6E655D"
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Cormorant Garamond", "serif"]
      },
      boxShadow: {
        premium: "0 28px 80px rgba(22, 18, 15, 0.09)",
        soft: "0 18px 40px rgba(22, 18, 15, 0.06)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.65)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        modal: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        "popup-open": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" }
        },
        "sticker-bounce": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.18)" },
          "80%": { transform: "scale(0.94)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
        modal: "popup-open 200ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "popup-open": "popup-open 200ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "sticker-bounce": "sticker-bounce 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both"
      },
      maxWidth: {
        shell: "1220px"
      }
    }
  },
  plugins: []
};

export default config;
