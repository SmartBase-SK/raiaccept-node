# RaiAccept JavaScript SDK Examples

This directory contains example implementations for the RaiAccept JavaScript SDK.

## Available Examples

### 1. basic-usage.js

Demonstrates the core functionality of the SDK:
- Authentication
- Creating orders (createOrderEntry)
- Creating payment sessions (createPaymentSession)
- Retrieving order details
- Getting transactions
- Processing refunds
- Using utility functions

**Run:**
```bash
node basic-usage.js
```

### 2. webhook-handler.js

Shows how to handle webhook notifications from RaiAccept:
- Parsing webhook payloads
- Validating payment status
- Processing different payment statuses
- Express.js integration example

**Run:**
```bash
node webhook-handler.js
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Update credentials in the examples:
```javascript
const accessToken = await RaiAcceptService.retrieveAccessTokenWithCredentials(
  apiClient,
  'your-username',  // <- Replace with your credentials
  'your-password'   // <- Replace with your credentials
);
```

3. Run the examples:
```bash
node examples/basic-usage.js
```

## Integration Patterns

### Node.js / Express

```javascript
import express from 'express';
import { RaiAcceptService } from '@raiaccept/raiaccept-api-client';

const app = express();

app.post('/api/create-payment', async (req, res) => {
  // Create service and authenticate
  const service = new RaiAcceptService();
  const accessToken = await service.retrieveAccessTokenWithCredentials(
    'your-username',  // Replace with your actual credentials
    'your-password'   // Replace with your actual credentials
  );

  // Step 1: Create order entry
  const orderResponse = await service.createOrderEntry(accessToken, req.body);
  const orderIdentification = orderResponse.object.getOrderIdentification();
  
  // Step 2: Create payment session for the order
  const paymentSessionResponse = await client.createPaymentSession(
    accessToken,
    req.body,
    orderIdentification
  );
  
  res.json({
    orderId: orderIdentification,
    sessionId: paymentSessionResponse.object?.sessionId,
    paymentRedirectURL: paymentSessionResponse.object?.paymentRedirectURL
  });
});
```

### React / Next.js

```javascript
import { RaiAcceptService } from '@raiaccept/raiaccept-api-client';

export async function createPayment(orderData) {
  // Create service and authenticate
  const service = new RaiAcceptService();
  const accessToken = await service.retrieveAccessTokenWithCredentials(
    'your-username',  // Replace with your actual credentials
    'your-password'   // Replace with your actual credentials
  );

  // Step 1: Create order entry
  const orderResponse = await service.createOrderEntry(accessToken, orderData);
  const orderIdentification = orderResponse.object.getOrderIdentification();
  
  // Step 2: Create payment session for the order
  const paymentSessionResponse = await client.createPaymentSession(
    accessToken,
    orderData,
    orderIdentification
  );
  
  return {
    orderId: orderIdentification,
    sessionId: paymentSessionResponse.object?.sessionId,
    paymentRedirectURL: paymentSessionResponse.object?.paymentRedirectURL
  };
}
```

### AWS Lambda

```javascript
import { RaiAcceptService } from '@raiaccept/raiaccept-api-client';

export const handler = async (event) => {
  // Create service and authenticate
  const service = new RaiAcceptService();
  const accessToken = await service.retrieveAccessTokenWithCredentials(
    'your-username',  // Replace with your actual credentials
    'your-password'   // Replace with your actual credentials
  );

  const orderData = JSON.parse(event.body);

  // Step 1: Create order entry
  const orderResponse = await service.createOrderEntry(accessToken, orderData);
  const orderIdentification = orderResponse.object.getOrderIdentification();

  // Step 2: Create payment session for the order
  const paymentSessionResponse = await service.createPaymentSession(
    accessToken,
    orderData,
    orderIdentification
  );
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      orderId: orderIdentification,
      sessionId: paymentSessionResponse.object?.sessionId,
      paymentRedirectURL: paymentSessionResponse.object?.paymentRedirectURL
    })
  };
};
```

## Best Practices

1. **Security**: Never expose credentials in client-side code
2. **Error Handling**: Always wrap API calls in try-catch blocks
3. **Logging**: Use the HttpClient logger for debugging
4. **Webhooks**: Always respond with 200 status to acknowledge receipt
5. **Retries**: Implement retry logic for transient failures

## Support

For issues and questions, please refer to:
- [API Documentation](../API.md)
- [README](../README.md)
- [GitHub Repository](https://github.com/SmartBase-SK/raiaccept-php/)

