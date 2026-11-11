import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "sans-serif"],
        mono: ["var(--font-mono)", "Space Grotesk", "sans-serif"]
      },
      colors: {
        space: {
          void: "#020203",
          base: "#050506",
          elevated: "#0A0A0C"
        },
        signal: {
          cyan: "#00E5FF",
          green: "#16A34A",
          violet: "#7C6CFF",
          magenta: "#FF4FD8",
          gold: "#D6A84F"
        }
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        signal: "0 0 48px rgba(0, 229, 255, 0.22)"
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};

export default config;
