import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design system fonts — Manrope (headings), Inter (body), JetBrains Mono (code)
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },

      // Design system border radius — 4px default (sharp/professional)
      borderRadius: {
        none: "0",
        sm: "0.125rem",   // 2px
        DEFAULT: "0.25rem", // 4px — design system default
        md: "0.375rem",   // 6px
        lg: "0.5rem",     // 8px — large containers (video, code editor)
        xl: "0.75rem",    // 12px — dialogs, modal sheets
        "2xl": "1rem",    // 16px
        full: "9999px",   // pills
      },

      // Design system shadow scale — tonal layering, soft ambient occlusion
      boxShadow: {
        sm: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        DEFAULT: "var(--shadow-card, 0px 4px 20px rgba(0, 0, 0, 0.04))",
        md: "0px 4px 20px rgba(0, 0, 0, 0.06)",
        lg: "var(--shadow-hover, 0px 8px 24px rgba(0, 0, 0, 0.08))",
        xl: "0px 16px 40px rgba(0, 0, 0, 0.12)",
        none: "none",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
