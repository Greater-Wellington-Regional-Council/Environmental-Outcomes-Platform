/// <reference types="vitest" />
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

// // https://vitejs.dev/config/
// export default defineConfig({
//   resolve: {
//     mainFields: ["module", "browser", "jsnext:main", "jsnext"],
//   },
//   plugins: [react(), redirectAll()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: './src/setupTests.ts',
//   },
// });

export default defineConfig((async ()=> {
  const redirectAll = (await import('vite-plugin-rewrite-all')).default;
  return {
    plugins: [
      react(),
      redirectAll()
    ],
    build: {
      rollupOptions: {
        external: ['vite-plugin-rewrite-all'],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
})());
