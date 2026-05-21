import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [solid()],
  publicDir: false,
  resolve: {
    alias: {
      "@ofb/katex": path.resolve(rootDir, "frontend/src/lib/katex.ts"),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
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
