import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

import cp from "child_process";

const commitHash = cp
    .execSync('git rev-parse --short HEAD')
    .toString();

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  define: {
    'import.meta.env.__COMMIT_HASH__': JSON.stringify(commitHash)
  }
})