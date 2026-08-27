import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), Icons({ compiler: "jsx" })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.js"],
    env: {
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "public-anon-key",
    },
  },
});
