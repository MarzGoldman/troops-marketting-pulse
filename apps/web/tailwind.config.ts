// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  // include UI folders you import from:
  "./src/ui/**/*.{js,ts,jsx,tsx}",
  // add more if you import across workspaces:
  "../../apps/**/*.{js,ts,jsx,tsx}",
  "../../packages/**/*.{js,ts,jsx,tsx}",
],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;