# RaiAccept TypeScript SDK

[![CI](https://github.com/SmartBase-SK/raiaccept-node/actions/workflows/ci.yml/badge.svg)](https://github.com/SmartBase-SK/raiaccept-node/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@smartbase-js/raiaccept-api-client.svg)](https://www.npmjs.com/package/@smartbase-js/raiaccept-api-client)
[![License](https://img.shields.io/badge/license-OSL--3.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)

TypeScript/JavaScript SDK for RaiAccept payment gateway API.

## Installation

```bash
npm install @smartbase-js/raiaccept-api-client
```

## Usage

```typescript
import { RaiAcceptService } from '@smartbase-js/raiaccept-api-client';

// Create service instance
const service = new RaiAcceptService();

// Authenticate with your credentials
const authResult = await service.retrieveAccessTokenWithCredentials(
  'your-username',  // Replace with your actual username
  'your-password',  // Replace with your actual password
  cert,             // Client certificate for mTLS
  key               // Client private key for mTLS
);
const accessToken = authResult?.accessToken;

const response = await service.createOrderEntry(accessToken, orderRequest);
```

### Create Payment

```typescript
import { RaiAcceptService, HttpClient } from '@smartbase-js/raiaccept-api-client';

// Initialize HTTP client (optional, for logging)
const httpClient = new HttpClient({
  logger: console, // Optional: for debugging
});

// Initialize the unified SDK client
const service = new RaiAcceptService(httpClient);

// Authenticate
const authResult = await service.retrieveAccessTokenWithCredentials(
  'your-username',
  'your-password',
  cert,  // Client certificate for mTLS
  key    // Client private key for mTLS
);
const accessToken = authResult?.accessToken;

// Create an order and payment session (two-step process)
const orderRequest = {
  invoice: {
    amount: 100.00,
    currency: 'EUR',
    description: 'Test payment',
    merchantOrderReference: 'ORDER-123',
    items: [
      {
        description: 'Product 1',
        numberOfItems: 1,
        price: 100.00
      }
    ]
  },
  urls: {
    successUrl: 'https://example.com/success',
    failUrl: 'https://example.com/fail',
    cancelUrl: 'https://example.com/cancel',
    notificationUrl: 'https://example.com/webhook'
  },
  consumer: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  },
  paymentMethodPreference: 'CARD',
  linkId: 'unique-link-id'
};

// Step 1: Create order entry
const orderResponse = await service.createOrderEntry(accessToken, orderRequest);
const orderIdentification = orderResponse.object.getOrderIdentification();
console.log('Order created:', orderIdentification);

// Step 2: Create payment session for the order
const paymentSessionResponse = await service.createPaymentSession(
  accessToken,
  orderRequest,
  orderIdentification
);

const paymentRedirectURL = paymentSessionResponse.object?.paymentRedirectURL;
console.log('Payment session created. Redirect customer to:', paymentRedirectURL);
```

## API Reference

### Initialization

```typescript
import { RaiAcceptService, HttpClient } from '@smartbase-js/raiaccept-api-client';

// With HTTP client (recommended for logging)
const httpClient = new HttpClient({ logger: console });
const client = new RaiAcceptService(httpClient);

// Without HTTP client (uses default)
const client = new RaiAcceptService();
```

### Authentication

```typescript
const authResult = await client.retrieveAccessTokenWithCredentials(
  username,
  password,
  cert,  // Client certificate for mTLS
  key    // Client private key for mTLS
);
const accessToken = authResult?.accessToken;
// Also available: authResult.refreshToken, authResult.accessTokenExpiresIn, authResult.refreshTokenExpiresIn
```

### Order Operations

- `client.createOrderEntry(accessToken, orderRequest)` - Create a new order
- `client.createPaymentSession(accessToken, sessionRequest, externalOrderId)` - Create payment session
- `client.getOrderDetails(accessToken, orderId)` - Get order details
- `client.getOrderTransactions(accessToken, orderId)` - Get order transactions

### Transaction Operations

- `client.getTransactionDetails(accessToken, orderId, transactionId)` - Get transaction details
- `client.refund(accessToken, orderId, transactionId, refundRequest)` - Process a refund

### Utility Functions

- `RaiAcceptService.transliterate(string)` - Transliterate non-Latin characters
- `RaiAcceptService.transliterateAndLimitLength(string, limit)` - Transliterate and limit length
- `RaiAcceptService.cleanPhoneNumber(phoneNumber)` - Clean phone number format
- `RaiAcceptService.getCountryIso3(countryCode)` - Convert 2-letter to 3-letter country code

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions. All types are exported and available for use in your TypeScript projects.

## Testing

Run the test suite:

```bash
# Run unit tests (mocked)
npm run unit-tests

# Run integration tests (real API calls!)
npm run integration-tests
```

For more details, see [TEST_SETUP.md](./TEST_SETUP.md) and [tests/README.md](./tests/README.md).

## License

OSL-3.0

