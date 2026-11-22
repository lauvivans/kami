/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { markdown } from "./packages/core/vite/markdown.ts";

export default defineConfig({
  plugins: [markdown({ from: "@core/index" }), vue()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@core": path.resolve(import.meta.dirname, "packages/core"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Only modules that emit no CSS: main.scss is imported once, from src/main.ts.
        additionalData: `
          @use "/packages/core/assets/scss/_var.scss" as *;
          @use "/packages/core/assets/scss/_mixin.scss" as *;
        `,
      },
    },
  },

  // Scan only the site. By default Vite also scans template/index.html and
  // any portfolio created locally with the CLI.
  optimizeDeps: {
    entries: ["index.html"],
  },

  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
    // Compile the breakpoints module so tests read the real SCSS values.
    css: { include: /breakpoints\.module\.scss$/ },
  },
});
