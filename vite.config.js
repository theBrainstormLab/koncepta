import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import Icons from "unplugin-icons/vite";

function manualChunks(id) {
  if (!id.includes("node_modules")) return;
  if (id.includes("@supabase")) return "vendor-supabase";
  if (id.includes("react-router") || id.includes("@remix-run")) return "vendor-router";
  if (id.includes("framer-motion")) return "vendor-framer";
  if (
    id.includes("react-markdown") ||
    id.includes("remark") ||
    id.includes("rehype") ||
    id.includes("micromark") ||
    id.includes("mdast") ||
    id.includes("hast") ||
    id.includes("unified") ||
    id.includes("bail") ||
    id.includes("trough") ||
    id.includes("vfile") ||
    id.includes("property-information") ||
    id.includes("space-separated") ||
    id.includes("comma-separated") ||
    id.includes("decode-named-character-reference") ||
    id.includes("character-entities") ||
    id.includes("ccount") ||
    id.includes("escape-string-regexp") ||
    id.includes("markdown-table") ||
    id.includes("zwitch") ||
    id.includes("longest-streak") ||
    id.includes("html-url-attributes") ||
    id.includes("web-namespaces")
  ) {
    return "vendor-markdown";
  }
  if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) {
    return "vendor-react";
  }
  return "vendor";
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
