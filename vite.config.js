import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["assessoria.exens.com.br"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3335",
        changeOrigin: true,
      },
    },
  },
});
