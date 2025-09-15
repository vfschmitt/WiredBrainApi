import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/Inventory': {
        target: 'http://localhost:5154',
        changeOrigin: true
      }
    }
  }
});
