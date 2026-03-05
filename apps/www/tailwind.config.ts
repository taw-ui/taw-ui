import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/react/src/**/*.{ts,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "'SF Mono'", "monospace"],
        pixel: ["var(--font-geist-pixel-square)", "monospace"],
      },
    },
  },
  plugins: [],
}

export default config
