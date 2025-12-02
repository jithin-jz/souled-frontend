import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/db.json"], // Ignore changes to db.json
    },
  },
  build: {
    // Generate source maps for production debugging
    sourcemap: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react", "react-icons"],
          "chart-vendor": ["recharts"],
          "utils-vendor": ["axios", "zustand", "js-cookie"],
        },
      },
    },
    // Warn on large chunks
    chunkSizeWarningLimit: 1000,
  },
});
