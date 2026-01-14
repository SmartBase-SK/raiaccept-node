# RaiAccept API Client - Test Setup

This document describes the self-contained test structure for the RaiAccept JavaScript SDK.

## Overview

The test suite uses **Vitest** as the testing framework, providing fast and reliable testing for this ES module-based SDK.

## File Structure

```
raiaccept_api_client/
├── vitest.config.js              # Vitest configuration for unit tests
├── vitest.integration.config.js # Vitest configuration for integration tests
├── package.json                  # Test scripts and dependencies
├── tests/
│   ├── setup.js                 # Global test setup and mocks (unit tests only)
│   ├── unit.test.js             # Unit tests with mocked dependencies
│   ├── integration.test.js      # Integration tests with real API calls
│   └── README.md                # Test documentation
└── TEST_SETUP.md                # This file
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run tests:**
   ```bash
   # Run unit tests (mocked)
   npm run unit-tests
   
   # Run integration tests (real API calls)
   npm run integration-tests
   ```

## Test Configuration

### Vitest Config (`vitest.config.js`)
- Uses Node.js environment for server-side testing
- Enables global test functions (`describe`, `it`, `expect`)
- Configures coverage with 80% thresholds
- Includes global setup and mock clearing

### Global Setup (`tests/setup.js`)
- Mocks axios globally to prevent real HTTP calls
- Clears all mocks before each test

### Package.json Scripts
```json
{
  "scripts": {
    "unit-tests": "vitest run tests/unit.test.js",
    "integration-tests": "vitest run --config vitest.integration.config.js"
  }
}
```

**Most Important Commands:**
- `npm run unit-tests` - Run unit tests with mocked dependencies
- `npm run integration-tests` - Run integration tests with real API calls

## Current Test Coverage

### Unit Tests (`unit.test.js`)
- ✅ `RaiAcceptService.transliterate()` - Comprehensive character transliteration tests
  - Greek, Cyrillic, Arabic, Hebrew characters
  - Mixed scripts and edge cases
  - Null/undefined handling
  - Whitespace normalization
  - Special character removal

### Integration Tests (`integration.test.js`)
- ✅ Complete payment flow with real API calls
  - Authentication
  - Order creation
  - Payment session creation
  - Order details retrieval
  - Transaction validation

## Future Extensions

This foundation can be extended with:

1. **HTTP Client Tests** - Mock axios responses for API testing
2. **Integration Tests** - Real API calls with credentials
3. **Model Tests** - Serialization/deserialization testing
4. **Error Handling Tests** - Exception and edge case testing
5. **Performance Tests** - Benchmarking critical paths

## Running Tests in CI/CD

For automated testing in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Install dependencies
  run: npm ci

- name: Run unit tests
  run: npm run unit-tests

- name: Run integration tests
  run: npm run integration-tests
```
