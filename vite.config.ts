import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: "themes/openfreebooks/static",
    emptyOutDir: false,
    rollupOptions: {
      input: "frontend/src/main.tsx",
      output: {
        entryFileNames: "js/bundle.js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (info) =>
          info.name?.endsWith(".css") ? "js/katex.css" : "js/[name][extname]",
      },
    },
  },
});
