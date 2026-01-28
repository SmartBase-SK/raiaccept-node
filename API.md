# RaiAccept JavaScript SDK - API Documentation

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Client](#api-client)
- [Service Methods](#service-methods)
- [Models](#models)
- [Utilities](#utilities)
- [Error Handling](#error-handling)

## Installation

```bash
npm install @smartbase-js/raiaccept-api-client
```

## Quick Start

```javascript
import { RaiAcceptAPIApi, RaiAcceptService, HttpClient } from '@smartbase-js/raiaccept-api-client';

// Initialize client
const httpClient = new HttpClient();
const apiClient = new RaiAcceptAPIApi(httpClient);

// Authenticate
const accessToken = await RaiAcceptService.retrieveAccessTokenWithCredentials(
  apiClient,
  'username',
  'password'
);

// Step 1: Create order entry
const orderResponse = await apiClient.createOrderEntry(accessToken, orderRequest);
const orderIdentification = orderResponse.object.getOrderIdentification();

// Step 2: Create payment session for the order
const paymentSessionResponse = await apiClient.createPaymentSession(
  accessToken,
  orderRequest,
  orderIdentification
);
const paymentRedirectURL = paymentSessionResponse.object?.paymentRedirectURL;
```

## API Client

### RaiAcceptAPIApi

Main API client for interacting with RaiAccept services.

#### Constructor

```javascript
const apiClient = new RaiAcceptAPIApi(httpClient);
```

**Parameters:**
- `httpClient` (HttpClient): HTTP client instance for making requests

#### Methods

##### `token(username, password)`

Authenticate with username and password.

**Parameters:**
- `username` (string): Username
- `password` (string): Password

**Returns:** `Promise<Object>` - Authentication response with access token

**Example:**
```javascript
const response = await apiClient.token('username', 'password');
const accessToken = response.object.getIdToken();
```

---

##### `createOrderEntry(accessToken, createOrderRequest)`

Create a new order entry.

**Parameters:**
- `accessToken` (string): Bearer token for authentication
- `createOrderRequest` (Object): Order request object

**Returns:** `Promise<Object>` - Order creation response

**Example:**
```javascript
const orderRequest = {
  invoice: {
    amount: 100.00,
    currency: 'EUR',
    description: 'Payment description',
    merchantOrderReference: 'ORDER-123',
    items: [...]
  },
  urls: {
    successUrl: 'https://example.com/success',
    failUrl: 'https://example.com/fail',
    cancelUrl: 'https://example.com/cancel'
  },
  consumer: { ... },
  paymentMethodPreference: 'CARD',
  linkId: 'unique-link-id'
};

// Step 1: Create order entry
const orderResponse = await apiClient.createOrderEntry(accessToken, orderRequest);
const orderIdentification = orderResponse.object.getOrderIdentification();

// Step 2: Create payment session for the order (see createPaymentSession method below)
```

---

##### `createPaymentSession(accessToken, paymentSessionRequest, externalOrderId)`

Create payment session for an existing order. **Note:** This must be called after `createOrderEntry` to complete the payment flow.

**Parameters:**
- `accessToken` (string): Bearer token
- `paymentSessionRequest` (Object): Payment session configuration
- `externalOrderId` (string): External order identifier

**Returns:** `Promise<Object>` - Payment session response with checkout URL

**Example:**
```javascript
// After creating an order entry (see createOrderEntry example above)
const paymentSessionResponse = await apiClient.createPaymentSession(
  accessToken,
  orderRequest, // Use the same request object from createOrderEntry
  orderIdentification // The order ID from createOrderEntry response
);

const paymentRedirectURL = paymentSessionResponse.object?.paymentRedirectURL;
const sessionId = paymentSessionResponse.object?.sessionId;

console.log('Redirect customer to:', paymentRedirectURL);
```

---

##### `getOrderDetails(accessToken, orderId)`

Retrieve details for a specific order.

**Parameters:**
- `accessToken` (string): Bearer token
- `orderId` (string): Order identifier

**Returns:** `Promise<Object>` - Order details

**Example:**
```javascript
const response = await apiClient.getOrderDetails(accessToken, 'order-123');
const status = response.object.getStatus();
```

---

##### `getOrderTransactions(accessToken, orderId)`

Get all transactions for an order.

**Parameters:**
- `accessToken` (string): Bearer token
- `orderId` (string): Order identifier

**Returns:** `Promise<Object>` - List of transactions

**Example:**
```javascript
const response = await apiClient.getOrderTransactions(accessToken, 'order-123');
const transactions = response.object.transactions;
```

---

##### `getTransactionDetails(accessToken, orderId, transactionId)`

Get details for a specific transaction.

**Parameters:**
- `accessToken` (string): Bearer token
- `orderId` (string): Order identifier
- `transactionId` (string): Transaction identifier

**Returns:** `Promise<Object>` - Transaction details

---

##### `refund(accessToken, orderId, transactionId, refundRequest)`

Process a refund for a transaction.

**Parameters:**
- `accessToken` (string): Bearer token
- `orderId` (string): Order identifier
- `transactionId` (string): Transaction identifier
- `refundRequest` (Object): Refund details

**Returns:** `Promise<Object>` - Refund response

**Example:**
```javascript
const refundRequest = {
  amount: 50.00,
  currency: 'EUR'
};

const response = await apiClient.refund(
  accessToken,
  'order-123',
  'txn-456',
  refundRequest
);
```

---

## Service Methods

### RaiAcceptService

#### Status Helpers

##### `getPaidStatuses()`

Returns array of statuses indicating successful payment: `['PAID', 'SUCCESS']`

##### `getFailedStatuses()`

Returns array of statuses indicating failed payment: `['FAILED']`

##### `getCancelledStatuses()`

Returns array of statuses indicating cancelled payment: `['CANCELED', 'ABANDONED']`

##### `getRejectedStatuses()`

Returns array of all rejected statuses: `['FAILED', 'CANCELED', 'ABANDONED']`

---

#### Utility Functions

##### `transliterate(string)`

Transliterate non-Latin characters to Latin equivalents.

**Example:**
```javascript
const result = RaiAcceptService.transliterate('Γεια σου');
// Result: "Geia sou"
```

##### `transliterateAndLimitLength(string, limit = 127)`

Transliterate and limit string length.

**Example:**
```javascript
const result = RaiAcceptService.transliterateAndLimitLength('Very long text...', 50);
```

##### `cleanPhoneNumber(phoneNumber)`

Clean and format phone number.

**Example:**
```javascript
const cleaned = RaiAcceptService.cleanPhoneNumber('+1 (234) 567-8900');
// Result: "+12345678900"
```

##### `getCountryIso3(countryCode)`

Convert 2-letter country code to 3-letter ISO code.

**Example:**
```javascript
const iso3 = RaiAcceptService.getCountryIso3('US');
// Result: "USA"
```

---

## Models

All models support `fromObject(data)` static method for deserialization.

### Address

```javascript
{
  addressStreet1: string,
  addressStreet2: string,
  addressStreet3: string,
  city: string,
  country: string,
  firstName: string,
  lastName: string,
  postalCode: string,
  state: string
}
```

### Consumer

```javascript
{
  email: string,
  firstName: string,
  ipAddress: string,
  lastName: string,
  mobilePhone: string,
  phone: string,
  workPhone: string
}
```

### Invoice

```javascript
{
  amount: number,
  currency: string,
  description: string,
  items: InvoiceItem[],
  merchantOrderReference: string // must be unique for merchant
}
```

### InvoiceItem

```javascript
{
  description: string,
  numberOfItems: number,
  price: number
}
```

### Urls

```javascript
{
  successUrl: string,
  failUrl: string,
  cancelUrl: string,
  notificationUrl: string|null
}
```

### Transaction

```javascript
{
  transactionId: string,
  transactionAmount: number,
  transactionCurrency: string,
  isProduction: boolean,
  transactionType: string, // 'PURCHASE' or 'REFUND'
  paymentMethod: string,
  status: string,
  statusCode: string,
  statusMessage: string,
  createdOn: string,
  updatedOn: string
}
```

---

## Utilities

### ObjectSerializer

Utility class for serialization and deserialization.

#### Methods

- `sanitizeForSerialization(data)` - Prepare data for API transmission
- `toPathValue(value)` - URL-encode value for path parameters
- `toString(value)` - Convert value to string
- `deserialize(data, modelClass)` - Deserialize JSON to model instance

---

## Error Handling

### ApiException

Thrown when API requests fail.

**Properties:**
- `message` (string): Error message
- `statusCode` (number): HTTP status code
- `headers` (Object): Response headers
- `body` (string): Response body
- `responseObject` (Object): Parsed response object

**Example:**
```javascript
try {
  // Step 1: Create order entry
  const orderResponse = await apiClient.createOrderEntry(accessToken, orderRequest);
  const orderIdentification = orderResponse.object.getOrderIdentification();
  
  // Step 2: Create payment session
  const paymentSessionResponse = await apiClient.createPaymentSession(
    accessToken,
    orderRequest,
    orderIdentification
  );
} catch (error) {
  if (error instanceof ApiException) {
    console.error('API Error:', error.statusCode, error.message);
    console.error('Response:', error.body);
  }
}
```

### InvalidArgumentException

Thrown when required parameters are missing or invalid.

**Example:**
```javascript
try {
  const response = await apiClient.getOrderDetails(null, 'order-123');
} catch (error) {
  if (error instanceof InvalidArgumentException) {
    console.error('Invalid argument:', error.message);
  }
}
```

---

## Constants
### Accepted Languages

```javascript
RaiAcceptAPIApi.ACCEPTED_LANGUAGES
// ['en', 'de', 'fr', 'cs', 'sk', 'sr', 'al', 'ro', 'pl', 'hr']
```

---

## Complete Example

See `examples/basic-usage.js` for a complete working example.

