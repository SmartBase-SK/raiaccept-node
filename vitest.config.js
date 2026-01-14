/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    // Allow importing .ts files with .js extension (ES module convention)
    extensions: ['.ts', '.js', '.mjs', '.cjs', '.json']
  },
  test: {
    // Use Node.js environment for server-side testing
    environment: 'node',

    // Enable globals like describe, it, expect
    globals: true,

    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'examples/',
        'dist/',
        '**/*.config.js'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },

    // Setup files
    setupFiles: ['./tests/setup.js'],

    // Mock clearing between tests
    mockReset: true,
    restoreMocks: true,

    // Timeout for async tests
    testTimeout: 10000
  }
})
