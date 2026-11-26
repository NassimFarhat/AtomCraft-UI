import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const repositoryRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@atomscraft/core": resolve(repositoryRoot, "packages/core/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
  },
});
