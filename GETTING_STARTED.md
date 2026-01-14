# Getting Started with RaiAccept JavaScript SDK

This guide will help you get started with the RaiAccept JavaScript SDK quickly.

## Installation

### Using npm

```bash
npm install @raiaccept/raiaccept-api-client
```

### Using yarn

```bash
yarn add @raiaccept/raiaccept-api-client
```

## Quick Start

### 1. Import the SDK

```javascript
import { RaiAcceptService, HttpClient } from '@raiaccept/raiaccept-api-client';
```

### 2. Initialize the Client

```javascript
// Create HTTP client (optional, for logging)
const httpClient = new HttpClient({
  logger: console // Optional: enables request/response logging
});

// Create SDK client
const client = new RaiAcceptService(httpClient);
```

### 3. Authenticate

```javascript
const accessToken = await client.retrieveAccessTokenWithCredentials(
  'your-username',
  'your-password'
);

if (!accessToken) {
  throw new Error('Authentication failed');
}
```

### 4. Create Your First Payment

```javascript
const orderRequest = {
  invoice: {
    amount: 100.00,
    currency: 'EUR',
    description: 'Payment for Order #12345',
    merchantOrderReference: 'ORDER-12345',
    items: [
      {
        description: 'Product 1',
        numberOfItems: 1,
        price: 100.00
      }
    ]
  },
  urls: {
    successUrl: 'https://yoursite.com/payment/success',
    failUrl: 'https://yoursite.com/payment/fail',
    cancelUrl: 'https://yoursite.com/payment/cancel',
    notificationUrl: 'https://yoursite.com/webhook/payment'
  },
  consumer: {
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  },
  paymentMethodPreference: 'CARD',
  linkId: 'unique-link-' + Date.now()
};

try {
  // Step 1: Create order entry
  const orderResponse = await client.createOrderEntry(accessToken, orderRequest);
  const orderId = orderResponse.object.getOrderIdentification();
  console.log('Order created successfully:', orderId);
  
  // Step 2: Create payment session for the order
  const paymentSessionResponse = await client.createPaymentSession(
    accessToken,
    orderRequest,
    orderId
  );
  
  const paymentRedirectURL = paymentSessionResponse.object?.paymentRedirectURL;
  console.log('Payment session created. Redirect customer to:', paymentRedirectURL);
} catch (error) {
  console.error('Failed to create payment:', error.message);
}
```

## Common Use Cases

### Check Order Status

```javascript
const orderDetails = await client.getOrderDetails(
  accessToken,
  orderId
);

if (orderDetails) {
  const status = orderDetails.object.getStatus();
  console.log('Order status:', status);
  
  // Check if payment is complete
  if (RaiAcceptService.getPaidStatuses().includes(status)) {
    console.log('Payment successful!');
  }
}
```

### Get Order Transactions

```javascript
const transactions = await client.getOrderTransactions(
  accessToken,
  orderId
);

if (transactions) {
  transactions.object.transactions.forEach(transaction => {
    console.log({
      id: transaction.getTransactionId(),
      amount: transaction.getTransactionAmount(),
      status: transaction.getStatus(),
      type: transaction.getTransactionType()
    });
  });
}
```

### Process a Refund

```javascript
const refundRequest = {
  amount: 50.00,
  currency: 'EUR'
};

const refundResponse = await client.refund(
  accessToken,
  orderId,
  transactionId,
  refundRequest
);

if (refundResponse) {
  console.log('Refund processed:', refundResponse.object);
}
```

### Handle Webhooks

```javascript
import { NotificationWebhookRequest, RaiAcceptService } from '@raiaccept/raiaccept-api-client';

// In your webhook endpoint
app.post('/webhook/payment', (req, res) => {
  const webhook = NotificationWebhookRequest.fromObject(req.body);
  
  if (RaiAcceptService.getPaidStatuses().includes(webhook.status)) {
    fulfillOrder(webhook.orderId);
  } else if (RaiAcceptService.getFailedStatuses().includes(webhook.status)) {
    notifyFailure(webhook.orderId);
  }
  
  res.status(200).json({ received: true });
});
```

## Utility Functions

### Text Transliteration

Useful for ensuring text compatibility with payment gateways:

```javascript
// Convert non-Latin characters
const transliterated = RaiAcceptService.transliterate('Γεια σου κόσμε');
// Result: "Geia sou kosme"

const limited = RaiAcceptService.transliterateAndLimitLength('Very long text...', 50);
```

### Phone Number Formatting

```javascript
const cleaned = RaiAcceptService.cleanPhoneNumber('+1 (234) 567-8900');
// Result: "+12345678900"
```

### Country Code Conversion

```javascript
const iso3 = RaiAcceptService.getCountryIso3('US');
// Result: "USA"
```

## Error Handling

Always wrap API calls in try-catch blocks:

```javascript
import { ApiException, InvalidArgumentException } from '@raiaccept/raiaccept-api-client';

try {
  const response = await client.createOrderEntry(accessToken, orderRequest);
  // Success
} catch (error) {
  if (error instanceof ApiException) {
    console.error('API Error:', {
      status: error.getCode(),
      message: error.message,
      body: error.getResponseBody()
    });
  } else if (error instanceof InvalidArgumentException) {
    console.error('Invalid argument:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Testing

### Sandbox Mode

Use sandbox credentials generated in RaiAccept Portal in sandbox mode to test your integration without processing real payments.


## Next Steps

- Read the [API Documentation](./API.md) for detailed API reference
- Check out [Examples](./examples/README.md) for more implementation patterns

## License

This SDK is licensed under the Open Software License (OSL) v. 3.0. See [LICENSE](./LICENSE) for details.

