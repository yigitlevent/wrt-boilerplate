import { defineConfig } from "vitest/config";


export default defineConfig({
  test: {
    name: "client",
    environment: "jsdom",
    include: ["client/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      reportOnFailure: true,
      allowExternal: true,
      include: ["**/client/src/**"]
    }
  }
});
