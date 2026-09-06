import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/invoices': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/customers': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
