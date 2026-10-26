import { defineConfig } from "vite";
export default defineConfig({
  base: "/",
  build: { chunkSizeWarningLimit: 1800, rollupOptions: { input: { main: "index.html", reading: "reading.html" } } },
  server: { host: "127.0.0.1" },
});
