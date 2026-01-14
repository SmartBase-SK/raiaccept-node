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

    // Test file patterns - only integration tests
    include: ['tests/integration.test.js'],

    // No setup files for integration tests (no axios mocking)
    setupFiles: [],

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

    // Mock clearing between tests
    mockReset: true,
    restoreMocks: true,

    // Timeout for async tests
    testTimeout: 10000
  }
})