import { defineConfig } from "vite";
import tailwind from "tailwindcss";
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  css: {
    postcss: {
      plugins: [tailwind]
    }
  }
})