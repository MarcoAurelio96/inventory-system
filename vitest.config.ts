import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.{ts,tsx}", "stores/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}", 
        "src/test/**", 
        "**/*.stories.{ts,tsx}",
        "lib/db.ts", 
        "lib/query-client.ts", 
        "lib/utils.ts",
        "src/lib/db.ts",
        "src/lib/query-client.ts",
        "src/lib/utils.ts"
      ],
      thresholds: { lines: 80, functions: 80 },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});