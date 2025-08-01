import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: '/flight/adminpage/',
  plugins: [vue()],
  server: {
    proxy: {
      "/flight": "http://localhost",
    },
  },
});
