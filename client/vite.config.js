import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shell': path.resolve(__dirname, 'src/shell'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      },
    },
    server: {
      host: '0.0.0.0', // Écoute sur toutes les interfaces (nécessaire pour Docker)
      port: 3000,
      strictPort: true,
      watch: {
        usePolling: true, // Nécessaire pour le hot reload dans Docker
      },
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://server:5000',
          changeOrigin: true,
        },
        '/public': {
          target: process.env.VITE_API_URL || 'http://server:5000',
          changeOrigin: true,
        },
      },
    },
  };
});