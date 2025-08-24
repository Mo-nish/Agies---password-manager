import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Define environment variables for the browser
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:3002'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify('Padhma Vyuham Security Vault'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
    'import.meta.env.MODE': JSON.stringify('development'),
    'import.meta.env.DEV': JSON.stringify(true),
    'import.meta.env.PROD': JSON.stringify(false),
    // Explicitly define process.env as empty to prevent errors
    'process.env': '{}',
  },
  server: {
    port: 3000,
    strictPort: true, // Prevent Vite from finding other ports
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
