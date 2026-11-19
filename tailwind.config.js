/** @type {import('tailwindcss').Config} */
// This file configures Tailwind CSS styling rules, theme colors, and animations for the legal agent
module.exports = {
  // Enable dark mode toggling using a class name on the root HTML element
  darkMode: "class",
  // Specify which source files Tailwind should look at to find utility class names
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Extend Tailwind's default design tokens with custom legal-themed tokens
  theme: {
    extend: {
      // Custom color palette tailored for a high-trust, authoritative legal technology interface
      colors: {
        legal: {
          // Deep navy canvas background for night mode or parchment in light mode
          canvas: "var(--legal-canvas)",
          // Card surface backgrounds for elevated panels and contract preview boxes
          surface: "var(--legal-surface)",
          // Subdued surface for inner clause containers and code blocks
          subtle: "var(--legal-subtle)",
          // Border colors for dividing lines and card outlines
          border: "var(--legal-border)",
          // Primary text color for crisp readability of legal clauses
          text: "var(--legal-text)",
          // Secondary text color for captions, labels, and metadata
          muted: "var(--legal-muted)",
          // Royal blue / sapphire accent color for AI highlights and primary action buttons
          accent: "var(--legal-accent)",
          // Crimson color indicating critical legal liability and high-risk clauses
          danger: "var(--legal-danger)",
          // Amber color indicating moderate risk, missing safeguards, or caution items
          warning: "var(--legal-warning)",
          // Emerald green color indicating low risk, balanced protections, and passed audits
          success: "var(--legal-success)",
        },
      },
      // Custom animation helpers for loading spinners and AI scanning shimmer bars
      animation: {
        // Slow pulsing animation for waiting states
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // Shimmer gradient animation used while scanning contracts
        shimmer: "shimmer 2s linear infinite",
      },
      // Keyframe definitions for the scanning animation
      keyframes: {
        shimmer: {
          // Start the highlight bar off-screen to the left
          "0%": { backgroundPosition: "-200% 0" },
          // Slide the highlight bar smoothly across to the right
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  // No external plugins are required
  plugins: [],
};
