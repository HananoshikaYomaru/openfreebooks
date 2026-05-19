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
        assetFileNames: "js/[name][extname]",
      },
    },
  },
});
