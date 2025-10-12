import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DEWALT Primary Colors (kept for brand identity)
        dewalt: {
          yellow: "#FFCD00",
          "yellow-light": "#FFE14D",
          "yellow-dark": "#E6B800",
          black: "#000000",
        },
        // Accent Colors
        accent: {
          orange: "#FF6B00",
          "orange-light": "#FF8533",
          "orange-dark": "#CC5500",
        },
        // Light Theme Background System
        background: {
          primary: "#FFFFFF",      // Pure white
          secondary: "#F9FAFB",    // Light gray (like Brex)
          tertiary: "#F3F4F6",     // Slightly darker gray
          elevated: "#FFFFFF",     // White for cards
        },
        // Light Theme Text Colors
        text: {
          primary: "#111827",      // Almost black
          secondary: "#6B7280",    // Medium gray
          tertiary: "#9CA3AF",     // Light gray
          muted: "#D1D5DB",        // Very light gray
        },
        // Status Colors (cleaner, more subtle)
        status: {
          success: "#10B981",      // Modern green
          warning: "#F59E0B",      // Amber
          error: "#EF4444",        // Modern red
          info: "#3B82F6",         // Modern blue
        },
        // Light Theme Border Colors
        border: {
          light: "#F3F4F6",        // Very light
          DEFAULT: "#E5E7EB",      // Default border
          medium: "#D1D5DB",       // Medium
          dark: "#9CA3AF",         // Darker
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "Consolas",
          "Monaco",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        // Optimized for contractors - clear, readable hierarchy
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0" }],
        xl: ["1.25rem", { lineHeight: "1.875rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "4rem", letterSpacing: "-0.03em" }],
        "7xl": ["4.5rem", { lineHeight: "4.75rem", letterSpacing: "-0.04em" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      boxShadow: {
        // Minimal, clean shadow system (like modern SaaS apps)
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        // Subtle yellow accent shadow
        "yellow-glow": "0 0 0 3px rgba(255, 205, 0, 0.1)",
        // Minimal card shadows
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 12px 0 rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        none: "0",
        sm: "0.375rem",      // 6px
        DEFAULT: "0.5rem",   // 8px (like Brex)
        md: "0.625rem",      // 10px
        lg: "0.75rem",       // 12px
        xl: "1rem",          // 16px
        "2xl": "1.25rem",    // 20px
        "3xl": "1.5rem",     // 24px
        full: "9999px",
      },
      spacing: {
        // Extended spacing scale for construction-sized layouts
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        50: "12.5rem",
        54: "13.5rem",
        58: "14.5rem",
        62: "15.5rem",
        66: "16.5rem",
        70: "17.5rem",
        74: "18.5rem",
        78: "19.5rem",
        82: "20.5rem",
        86: "21.5rem",
        90: "22.5rem",
        94: "23.5rem",
        98: "24.5rem",
      },
      animation: {
        // Smooth, professional animations
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-out": "fadeOut 0.3s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-up": "slideInUp 0.3s ease-out",
        "slide-in-down": "slideInDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "scale-out": "scaleOut 0.2s ease-in",
        "bounce-soft": "bounceSoft 0.5s ease-in-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionDuration: {
        "400": "400ms",
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      scale: {
        "102": "1.02",
        "103": "1.03",
      },
    },
  },
  plugins: [
    // Add custom utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        },
        ".text-shadow-lg": {
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(229, 231, 235, 0.5)",
        },
        ".glass-yellow": {
          background: "rgba(255, 205, 0, 0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 205, 0, 0.2)",
        },
        ".minimal-border": {
          border: "1px solid #E5E7EB",
        },
        ".accent-border-left": {
          borderLeft: "3px solid #FFCD00",
        },
        ".clean-card": {
          background: "#FFFFFF",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
          border: "1px solid #F3F4F6",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;

