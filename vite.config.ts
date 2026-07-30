import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep CSS fallbacks and classic media-query syntax for older Android WebViews.
    target: "chrome80",
    cssTarget: "chrome80",
  },
});
