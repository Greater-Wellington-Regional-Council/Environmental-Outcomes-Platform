import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default defineConfig(async () => {
  const redirectAll = (await import('vite-plugin-rewrite-all')).default;
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

  return {
    plugins: [
      tsconfigPaths(),
      react(),
      redirectAll(),
    ],
    build: {
      rollupOptions: {
        // If you have external dependencies that should be excluded from the build, list them here
        external: [],
      }
    },
    resolve: {
      alias: {
        // Add any custom aliases you need
      },
      mainFields: ["module", "browser", "jsnext:main", "jsnext"],
    },
    optimizeDeps: {
      esbuildOptions: {
        // Ensure that .js files are correctly interpreted as JSX when needed
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
});
