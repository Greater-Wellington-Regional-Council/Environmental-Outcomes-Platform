import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { ViteUserConfig } from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path'

const config: ViteUserConfig = defineConfig({
  plugins: [tsconfigPaths(), react()],
  worker: {
    format: 'es',
  },
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
  base: '/',
  server: {
    hmr: {
      overlay: false
    }
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@values': path.resolve(__dirname, 'src/lib/values'),
      '@loaders': path.resolve(__dirname, 'src/pages/loaders'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@types': path.resolve(__dirname, 'src/lib/types'),
      '@models': path.resolve(__dirname, 'src/services/models'),
      '@shared': path.resolve(__dirname, 'src/lib/shared'),
      '@styles': path.resolve(__dirname, 'src/lib/styles'),
      '@mocks': path.resolve(__dirname, 'src/lib/mocks'),
      '@elements': path.resolve(__dirname, 'src/elements'),
      '@pages': path.resolve(__dirname, 'src/pages')
    },
  }
})

export default config
