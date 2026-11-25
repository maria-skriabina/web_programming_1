import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/web_programming_1/",
  server: {
    host: "127.0.0.1",
    port: 5173,
    open: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
