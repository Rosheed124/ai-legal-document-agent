// Import helper from Vitest to define test settings
import { defineConfig } from "vitest/config";
// Import React plugin so Vitest can understand JSX and React component testing
import react from "@vitejs/plugin-react";
// Import path helper from Node.js to resolve project directories
import path from "path";

// Export the configuration object for our test runner
export default defineConfig({
  // Activate the React plugin
  plugins: [react()],
  // Configure test environment behavior
  test: {
    // Simulate a web browser DOM environment inside Node.js
    environment: "jsdom",
    // Make describe, it, and expect functions available globally without importing them everywhere
    globals: true,
  },
  // Set up path shortcuts matching tsconfig.json
  resolve: {
    alias: {
      // Map the '@' prefix directly to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
