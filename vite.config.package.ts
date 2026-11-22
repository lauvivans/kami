import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ["../**/*.ts", "../**/*.vue"],
      exclude: ["node_modules", "dist"],
      tsconfigPath: path.resolve(import.meta.dirname, "./tsconfig.app.json"),
      insertTypesEntry: true,
    }),
    {
      // The *.md module declaration, loaded with "@lauvivans/kami/markdown".
      name: "kami-markdown-types",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "markdown.d.ts",
          source: fs.readFileSync(
            path.resolve(import.meta.dirname, "packages/core/markdown.d.ts"),
            "utf8"
          ),
        });
      },
    },
  ],

  resolve: {
    alias: {
      "@core": path.resolve(import.meta.dirname, "packages/core"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Only modules that emit no CSS: main.scss is imported once, from packages/core/index.ts.
        additionalData: `
          @use "/packages/core/assets/scss/_var.scss" as *;
          @use "/packages/core/assets/scss/_mixin.scss" as *;
        `,
      },
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, "packages/core/index.ts"),
        // The Markdown plugin, imported by the portfolio's vite.config.ts.
        // It runs in Node during the build, never in the browser.
        vite: path.resolve(
          import.meta.dirname,
          "packages/core/vite/markdown.ts"
        ),
      },
      fileName: (format, entry) => `${entry}.${format}.js`,
      formats: ["es"],
    },
    rolldownOptions: {
      external: ["vue", "vue-router", "pinia", "marked", "yaml"],
    },
  },
});
