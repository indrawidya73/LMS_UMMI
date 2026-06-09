import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types"),
      "@context": path.resolve(__dirname, "src/context"),
      "@lib": path.resolve(__dirname, "src/lib"),
    },
  },
  build: {
    target: "es2020",
    minify: "terser",
    cssMinify: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});