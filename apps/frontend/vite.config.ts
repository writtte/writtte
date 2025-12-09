import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  envDir: "../../",
  assetsInclude: ["**/*.html"],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "main/index.html"),
      }
    },
  },
});
