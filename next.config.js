// Import path module from Node.js
const path = require("path");

/** @type {import('next').NextConfig} */
// Next.js configuration settings for the AI legal document agent
const nextConfig = {
  // Pin workspace root to this directory to silence multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname),
  // Enable React strict mode to detect potential side effects and deprecated patterns
  reactStrictMode: true,
  // Ensure typed routes are checked for high reliability
  typescript: {
    // Keep strict type checking during builds
    ignoreBuildErrors: false,
  },
  // Keep strict linting during builds
  eslint: {
    // Run ESLint during production build
    ignoreDuringBuilds: false,
  },
};

// Export the configuration object
module.exports = nextConfig;
