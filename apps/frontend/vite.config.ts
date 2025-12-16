import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  envDir: "../../",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      }
    },
  },
});
