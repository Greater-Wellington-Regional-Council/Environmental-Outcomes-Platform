import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default defineConfig(async () => {
  const redirectAll = (await import('vite-plugin-rewrite-all')).default;

  return {
    plugins: [tsconfigPaths(), react(), redirectAll()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: 'index.html',
        output: {
          manualChunks: undefined,
        },
      },
    },
    logLevel: 'info',
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['**/__tests__/**/*.tsx', '**/*.test.tsx', '**/*.test.ts'],
      setupFiles: ['./src/setupTests.ts'],
      env: {
        VITE_LINZ_API_KEY: 'mock_linz_api_key',
        VITE_MAPBOX_TOKEN: 'mock_mapbox_token'
      }
    },
    base: './',
    server: {
      hmr: {
        overlay: false
      }
    },
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, 'src/lib'),
      },
    },
  }
})

