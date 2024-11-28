import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
