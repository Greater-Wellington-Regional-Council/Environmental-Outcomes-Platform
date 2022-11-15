import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import redirectAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), redirectAll()],
});
