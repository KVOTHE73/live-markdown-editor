import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/live-markdown-editor/" : "/", // para el build y el despliegue en GitHub Pages /live-markdown-editor/
  plugins: [vue()],
}));
