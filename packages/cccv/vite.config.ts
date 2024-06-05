import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {UserConfig} from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths";

const config: UserConfig = defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true
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
})

export default config