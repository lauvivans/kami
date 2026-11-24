import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { markdown } from "@lauvivans/kami/vite";
import { resolve } from "path";

export default defineConfig({
  // markdown() turns each .md page into Kami blocks; it goes before vue().
  plugins: [markdown(), vue()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
});
