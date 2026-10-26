import { defineConfig } from "vite";
export default defineConfig({
  base: "/",
  build: { chunkSizeWarningLimit: 1800 },
  server: { host: "127.0.0.1" },
});
