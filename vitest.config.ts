import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Konfigurasi test untuk proyek React + Vite + TypeScript.
 * Alias "@" → src/ agar impor bergaya "@/utils/..." ikut dikenali test.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node", // test saat ini murni logika, tanpa DOM
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    reporters: "default",
  },
});
