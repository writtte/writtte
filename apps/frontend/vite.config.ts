import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { readFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageJson = JSON.parse(
  readFileSync('./package.json', 'utf-8')
)

export default defineConfig({
  base: "/",
  envDir: "../../",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      }
    },
  },
  define: {
    '__APP_VERSION__': JSON.stringify(packageJson.version)
  }
});
