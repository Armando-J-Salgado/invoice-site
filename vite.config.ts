import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function spaFallback() {
  return {
    name: 'spa-fallback',

    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        const accept = req.headers.accept ?? '';

        const isHtmlNavigation =
          req.method === 'GET' &&
          accept.includes('text/html');

        if (isHtmlNavigation) {
          req.url = '/';
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    spaFallback(),
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
});
