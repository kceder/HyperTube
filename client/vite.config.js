import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:80',
      }
    },
  },
  publicDir: '../server/public', // disable before build
  build: {
    outDir: '../server/dist',
    emptyOutDir: true
  },
  plugins: [
    react(),
  ],
})
