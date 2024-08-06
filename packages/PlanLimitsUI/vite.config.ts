/// <reference types="vitest" />
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';
import redirectAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    mainFields: ["module", "browser", "jsnext:main", "jsnext"],
  },
  plugins: [react(), redirectAll()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
