import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Root base ensures absolute asset URLs (/assets/...) that never 404 on deep routes or SPA navigation
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const modulePath = id.replace(/\\/g, "/");
          if (!modulePath.includes("/node_modules/")) return;

          if (
            modulePath.includes("/node_modules/react/") ||
            modulePath.includes("/node_modules/react-dom/") ||
            modulePath.includes("/node_modules/react-router") ||
            modulePath.includes("/node_modules/scheduler/")
          ) return "vendor-react";

          if (
            modulePath.includes("/node_modules/@radix-ui/") ||
            modulePath.includes("/node_modules/@floating-ui/") ||
            modulePath.includes("/node_modules/cmdk/") ||
            modulePath.includes("/node_modules/vaul/")
          ) return "vendor-ui";

          if (
            modulePath.includes("/node_modules/@supabase/") ||
            modulePath.includes("/node_modules/@tanstack/react-query/")
          ) return "vendor-data";

          if (
            modulePath.includes("/node_modules/recharts/") ||
            modulePath.includes("/node_modules/d3-")
          ) return "vendor-charts";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
