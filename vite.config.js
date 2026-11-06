import { defineConfig } from 'vite';

export default defineConfig({
  base: '/web_programming_1/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
