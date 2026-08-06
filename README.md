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

## Integration modes

| | Merchant (default) | Partner |
|--|-------------------|---------|
| Auth | `https://auth.raiaccept.com/auth/api/*` | `https://api.raiaccept.com/auth/api/*` |
| API | `https://trapi.raiaccept.com` | `https://api.raiaccept.com` |
| mTLS | Not used | Required (cert + key) |

When both `cert` and `key` are passed to the constructor, partner mode is selected automatically. Use `{ authMode: 'merchant' }` to force merchant mode despite cert/key (e.g. testing), or `{ authMode: 'partner' }` for explicit opt-in. Providing only cert or only key, or partner mode without both cert and key, throws `InvalidArgumentException` at construction time.

## Merchant integration (default)

For direct merchant integrations — no mTLS required.

```typescript
import { RaiAcceptService, HttpClient } from '@smartbase-js/raiaccept-api-client';

const httpClient = new HttpClient({ logger: console });
const service = new RaiAcceptService(httpClient);

const integrationContext = {
  type: 'CODE',
  data: {
    name: 'YourShop',
    version: '1.0',
    vendor: 'YourVendor',
  },
};

const authResult = await service.retrieveAccessTokenWithCredentials(
  'your-username',
  'your-password',
  integrationContext
);
const accessToken = authResult?.accessToken;

// API calls use trapi.raiaccept.com with Bearer token only
const orderResponse = await service.createOrderEntry(accessToken, orderRequest);
```

### Token refresh and logout (merchant)

```typescript
const refreshed = await service.tokenRefresh(authResult.refreshToken, integrationContext);
await service.tokenLogout(authResult.refreshToken);
```

## Partner integration

For platform/partner integrations (e.g. Shopify apps) — requires mTLS client certificate.

```typescript
import { RaiAcceptService, HttpClient } from '@smartbase-js/raiaccept-api-client';
import { readFileSync } from 'fs';

const cert = readFileSync('/path/to/client.crt', 'utf-8');
const key = readFileSync('/path/to/client.key', 'utf-8');

const httpClient = new HttpClient({ logger: console });
const service = new RaiAcceptService(httpClient, cert, key);

const authResult = await service.retrieveAccessTokenWithCredentials(
  'merchant-username',
  'merchant-password',
  integrationContext
);
```

## Create payment (both modes)

```typescript
const orderRequest = {
  invoice: {
    amount: 100.00,
    currency: 'EUR',
    description: 'Test payment',
    merchantOrderReference: 'ORDER-123',
    items: [{ description: 'Product 1', numberOfItems: 1, price: 100.00 }],
  },
  urls: {
    successUrl: 'https://example.com/success',
    failUrl: 'https://example.com/fail',
    cancelUrl: 'https://example.com/cancel',
    notificationUrl: 'https://example.com/webhook',
  },
  consumer: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
  },
  paymentMethodPreference: 'CARD',
  linkId: 'unique-link-id',
};

const orderResponse = await service.createOrderEntry(accessToken, orderRequest);
const orderId = orderResponse.object.getOrderIdentification();

const paymentSessionResponse = await service.createPaymentSession(
  accessToken,
  orderRequest,
  orderId
);
console.log('Redirect to:', paymentSessionResponse.object?.paymentRedirectURL);
```

## API Reference

### Initialization

```typescript
// Merchant (default)
new RaiAcceptService(httpClient);

// Partner (auto-detected when cert + key provided)
new RaiAcceptService(httpClient, cert, key);

// Explicit override
new RaiAcceptService(httpClient, cert, key, { authMode: 'partner' });
new RaiAcceptService(httpClient, cert, key, { authMode: 'merchant' });
```

### Authentication

- `retrieveAccessTokenWithCredentials(username, password, integrationContext)`
- `tokenRefresh(refreshToken, integrationContext)`
- `tokenLogout(refreshToken)`

### Order operations

- `createOrderEntry(accessToken, orderRequest)`
- `createPaymentSession(accessToken, sessionRequest, externalOrderId)`
- `getOrderDetails(accessToken, orderId)`
- `getOrderTransactions(accessToken, orderId)`

### Transaction operations

- `getTransactionDetails(accessToken, orderId, transactionId)`
- `refund(accessToken, orderId, transactionId, refundRequest)`

### Utility functions

Static helpers on `RaiAcceptService` for normalizing order/payment payload data:

- `RaiAcceptService.transliterate(string)` — transliterate non-Latin characters to Latin
- `RaiAcceptService.transliterateAndLimitLength(string, limit?)` — transliterate and truncate (default limit 127)
- `RaiAcceptService.cleanPhoneNumber(phoneNumber)` — normalize phone number format (digits + leading `+`, max 15 chars)
- `RaiAcceptService.getCountryIso3(countryCode)` — convert 2-letter ISO country code to 3-letter
- `RaiAcceptService.getPaidStatuses()` / `getFailedStatuses()` / `getCancelledStatuses()` / `getRejectedStatuses()` — payment status groupings

```typescript
RaiAcceptService.transliterate('Γεια σου');           // 'Geia sou'
RaiAcceptService.cleanPhoneNumber('+1 (234) 567-8900'); // '+12345678900'
RaiAcceptService.getCountryIso3('SK');                  // 'SVK'
```

## Migration from 0.9.x

Version 0.10.0 defaults to **merchant mode**. Partner integrations with cert + key work as in 0.9.x — mode is auto-detected. You may still pass `{ authMode: 'partner' }` explicitly.

```typescript
new RaiAcceptService(httpClient, cert, key);
```

See [CHANGELOG.md](./CHANGELOG.md) for details.

## Testing

```bash
npm run unit-tests
npm run integration-tests
npm run integration-tests:merchant
npm run integration-tests:partner
```

See [TEST_SETUP.md](./TEST_SETUP.md) and [tests/README.md](./tests/README.md).

## License

OSL-3.0
