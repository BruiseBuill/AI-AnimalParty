import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves this repository below /AI-AnimalParty/.
  // Keep local/native builds at the root unless the deploy workflow opts in.
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react()],
  build: {
    // Keep CSS fallbacks and classic media-query syntax for older Android WebViews.
    target: "chrome80",
    cssTarget: "chrome80",
  },
});
