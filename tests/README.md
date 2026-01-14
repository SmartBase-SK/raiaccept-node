# RaiAccept API Client Tests

This directory contains the test suite for the RaiAccept JavaScript SDK.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
# Run unit tests (mocked)
npm run unit-tests

# Run integration tests (real API calls!)
npm run integration-tests
```

## Available Commands

**Most Important Commands:**
- `npm run unit-tests` - Run unit tests with mocked dependencies (no external API calls)
- `npm run integration-tests` - Run integration tests with real API calls (requires credentials)

## Test Structure

```
tests/
├── setup.js              # Global test setup and mocks (unit tests only)
├── unit.test.js          # Unit tests with mocked dependencies
├── integration.test.js   # End-to-end integration test for complete payment flow
└── README.md            # This file
```

## Test Types

### Unit Tests (`unit.test.js`)
- Test static utility methods of RaiAcceptService
- Use mocked dependencies (axios is globally mocked)
- Focus on business logic without external API calls
- Run with: `npm run unit-tests`

### Integration Tests (`integration.test.js`)
- Test complete payment flows with real API calls
- Require valid credentials in `.env` file
- Validate end-to-end functionality
- Run with: `npm run integration-tests`

## Writing Tests

Tests are written using Vitest with the following conventions:

- Test files end with `.test.js`
- Use `describe()` blocks to group related tests
- Use `it()` or `test()` for individual test cases
- Use `expect()` for assertions
- Use `vi` for mocking in unit tests (Vitest's equivalent of Jest's `jest`)

### Example Unit Test Structure

```javascript
import { describe, it, expect } from 'vitest'
import { RaiAcceptService } from '../src/RaiAcceptService.js'

describe('RaiAcceptService', () => {
  describe('someMethod()', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test'
      const expected = 'result'

      // Act
      const result = RaiAcceptService.someMethod(input)

      // Assert
      expect(result).toBe(expected)
    })
  })
})
```

## Mocking

Axios is globally mocked in `setup.js`. For other dependencies, use Vitest's mocking:

```javascript
import { vi } from 'vitest'

const mockDependency = vi.fn()
vi.mock('../src/some-module.js', () => ({
  someFunction: mockDependency
}))
```

## Integration Tests

Integration tests make real API calls to the RaiAccept service to test the complete payment creation flow. They require valid credentials to be set up.

### Complete Payment Creation Test

The integration test (`integration.test.js`) covers the full end-to-end payment lifecycle:

1. **Authentication** (Required): Obtain access token using credentials - **must succeed**
2. **Order Creation** (Required): Create an order entry with consumer, invoice, and URL details - **must succeed**
3. **Payment Session** (Required): Create a payment session for the order - **must succeed**
4. **Order Details** (Required): Retrieve and verify order details using the order ID - **must succeed**
5. **Transaction Validation** (Required): Verify no transactions exist for newly created payment sessions - **must succeed**

**All API calls must succeed with the provided test data.** The complete payment flow should work exactly the same on every run - no optional failures allowed.

### Setup Credentials

Create a `.env` file in the project root with your test credentials:

```bash
RAIACCEPT_TEST_USERNAME=your_username
RAIACCEPT_TEST_PASSWORD=your_password
```

### Running Tests

**Unit Tests (Mocked):**
```bash
npm run unit-tests
```

**Integration Tests (Real API):**
```bash
npm run integration-tests
```
