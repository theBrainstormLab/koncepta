import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import Icons from "unplugin-icons/vite";

function manualChunks(id) {
  if (!id.includes("node_modules")) return;
  if (id.includes("react-router") || id.includes("@remix-run")) return "vendor-router";
  if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
    return "vendor-react";
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), svgr(), Icons({ compiler: "jsx" })],
  build: {
    target: "es2022",
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: { manualChunks },
    },
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
