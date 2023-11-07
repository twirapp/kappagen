import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

/** @type {import('vite').UserConfig} */
const config = defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "./src/index.js",
      name: "kappagen",
      fileName: "kappagen",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "default",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

export default config;
