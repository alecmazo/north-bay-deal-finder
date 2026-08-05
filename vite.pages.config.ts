import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Static SPA for GitHub Pages: https://alecmazo.github.io/north-bay-deal-finder/
export default defineConfig({
  base: "/north-bay-deal-finder/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "index.pages.html"),
    },
  },
  define: {
    "import.meta.env.VITE_AUTH_ENABLED": JSON.stringify("false"),
    "import.meta.env.VITE_DATA_MODE": JSON.stringify("demo"),
  },
});
