import { defineConfig } from "vite";
import tailwind from "tailwindcss";
import solidPlugin from 'vite-plugin-solid';
import cp from "child_process";

const commitHash = cp
    .execSync('git rev-parse --short HEAD')
    .toString();

export default defineConfig({
  plugins: [solidPlugin()],
  css: {
    postcss: {
      plugins: [tailwind]
    }
  },
  define: {
    'import.meta.env.__COMMIT_HASH__': JSON.stringify(commitHash)
  }
})