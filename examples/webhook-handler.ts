/**
 * Webhook Handler Example
 * Demonstrates how to handle webhook notifications from RaiAccept
 */

import { NotificationWebhookRequest, RaiAcceptService } from '@raiaccept/raiaccept-api-client';

/**
 * Example Express.js webhook handler
 * 
 * Install Express first: npm install express
 */

// Uncomment the following to use with Express:
/*
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook/raiaccept', async (req, res) => {
  try {
    // Parse webhook data
    const webhookData = NotificationWebhookRequest.fromObject(req.body);
    
    console.log('Webhook received:', {
      orderId: webhookData.orderId,
      transactionId: webhookData.transactionId,
      status: webhookData.status,
      amount: webhookData.amount,
      currency: webhookData.currency,
      timestamp: webhookData.timestamp
    });

    // Process the webhook based on status
    if (RaiAcceptService.getPaidStatuses().includes(webhookData.status)) {
      console.log('Payment successful!');
      // Update your database, send confirmation email, etc.
      await handleSuccessfulPayment(webhookData);
    } else if (RaiAcceptService.getFailedStatuses().includes(webhookData.status)) {
      console.log('Payment failed!');
      // Handle failed payment
      await handleFailedPayment(webhookData);
    } else if (RaiAcceptService.getCancelledStatuses().includes(webhookData.status)) {
      console.log('Payment cancelled!');
      // Handle cancelled payment
      await handleCancelledPayment(webhookData);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handleSuccessfulPayment(webhookData: NotificationWebhookRequest): Promise<void> {
  // Your business logic for successful payment
  console.log('Processing successful payment for order:', webhookData.orderId);
  // - Update order status in database
  // - Send confirmation email to customer
  // - Trigger fulfillment process
  // - Update inventory
}

async function handleFailedPayment(webhookData: NotificationWebhookRequest): Promise<void> {
  // Your business logic for failed payment
  console.log('Processing failed payment for order:', webhookData.orderId);
  // - Update order status in database
  // - Notify customer of failure
  // - Suggest alternative payment methods
}

async function handleCancelledPayment(webhookData: NotificationWebhookRequest): Promise<void> {
  // Your business logic for cancelled payment
  console.log('Processing cancelled payment for order:', webhookData.orderId);
  // - Update order status in database
  // - Return items to cart
  // - Send cancellation confirmation
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/raiaccept`);
});
*/

// Standalone webhook handler function (without Express)
export function handleRaiAcceptWebhook(webhookPayload: any): {
  orderId: string;
  transactionId: string;
  status: string;
  isPaid: boolean;
  isFailed: boolean;
  isCancelled: boolean;
  amount: number;
  currency: string;
} {
  const webhookData = NotificationWebhookRequest.fromObject(webhookPayload);
  
  console.log('Processing webhook:', {
    orderId: webhookData.orderId,
    transactionId: webhookData.transactionId,
    status: webhookData.status,
    amount: webhookData.amount,
    currency: webhookData.currency
  });

  // Check payment status
  const isPaid = RaiAcceptService.getPaidStatuses().includes(webhookData.status);
  const isFailed = RaiAcceptService.getFailedStatuses().includes(webhookData.status);
  const isCancelled = RaiAcceptService.getCancelledStatuses().includes(webhookData.status);

  return {
    orderId: webhookData.orderId,
    transactionId: webhookData.transactionId,
    status: webhookData.status,
    isPaid,
    isFailed,
    isCancelled,
    amount: webhookData.amount,
    currency: webhookData.currency
  };
}

// Example usage
const exampleWebhookPayload = {
  orderId: 'order-123456',
  transactionId: 'txn-789012',
  status: 'SUCCESS',
  amount: 100.50,
  currency: 'EUR',
  timestamp: new Date().toISOString()
};

console.log('Example webhook processing:');
console.log(handleRaiAcceptWebhook(exampleWebhookPayload));
