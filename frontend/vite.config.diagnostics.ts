import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dedicated Vite configuration for isolated Diagnostics & Telemetry Portal on Port 5174
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'diagnostics-entry-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            req.url = '/diagnostics.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
});
