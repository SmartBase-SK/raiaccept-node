/**
 * Basic Usage Example
 * Demonstrates how to use the RaiAccept TypeScript SDK
 */

import { RaiAcceptService, HttpClient, type ApiResponse } from '@smartbase-js/raiaccept-api-client';
import type { CreateOrderEntryResponse, CreatePaymentSessionResponse, GetOrderDetailsResponse, GetOrderTransactionsResponse } from '@smartbase-js/raiaccept-api-client';

async function main(): Promise<void> {
  try {
    console.log('Creating service and authenticating...');

    // Create service instance
    const client = new RaiAcceptService();

    // Authenticate with your credentials
    const accessToken = await client.retrieveAccessTokenWithCredentials(
      'your-username',  // Replace with your actual username
      'your-password'   // Replace with your actual password
    );

    if (!accessToken) {
      throw new Error('Authentication failed');
    }

    console.log('Authentication successful');

    // 2. Create an order
    console.log('\nCreating order...');
    const orderRequest = {
      invoice: {
        amount: 100.50,
        currency: 'EUR',
        description: 'Test payment for product purchase',
        merchantOrderReference: 'ORDER-' + Date.now(),
        items: [
          {
            description: 'Premium Widget',
            numberOfItems: 2,
            price: 45.25
          },
          {
            description: 'Standard Widget',
            numberOfItems: 1,
            price: 10.00
          }
        ]
      },
      urls: {
        successUrl: 'https://example.com/payment/success',
        failUrl: 'https://example.com/payment/fail',
        cancelUrl: 'https://example.com/payment/cancel',
        notificationUrl: 'https://example.com/webhook/raiaccept'
      },
      consumer: {
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        ipAddress: '192.168.1.1'
      },
      billingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        addressStreet1: '123 Main Street',
        addressStreet2: 'Apt 4B',
        addressStreet3: '',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: RaiAcceptService.getCountryIso3('US')
      },
      paymentMethodPreference: 'CARD',
      linkId: 'unique-link-' + Date.now()
    };

    const orderResponse: ApiResponse<CreateOrderEntryResponse> = await client.createOrderEntry(accessToken, orderRequest);
    const orderIdentification = orderResponse.object?.getOrderIdentification();
    if (!orderIdentification) {
      throw new Error('Failed to get order identification');
    }
    console.log('Order created:', orderIdentification);

    // 3. Create payment session for the order
    console.log('\nCreating payment session...');
    const paymentSessionRequest = orderRequest; // Use the same request data
    const paymentSessionResponse: ApiResponse<CreatePaymentSessionResponse> = await client.createPaymentSession(
      accessToken,
      paymentSessionRequest,
      orderIdentification
    );
    
    const sessionId = paymentSessionResponse.object?.sessionId;
    const paymentRedirectURL = paymentSessionResponse.object?.paymentRedirectURL;
    
    console.log('Payment session created:', sessionId);
    console.log('Payment redirect URL:', paymentRedirectURL);
    console.log('\nRedirect customer to payment redirect URL to complete payment');

    // 4. Get order details
    console.log('\nFetching order details...');
    const orderDetails: ApiResponse<GetOrderDetailsResponse> | null = await client.getOrderDetails(
      accessToken,
      orderIdentification
    );
    
    if (orderDetails?.object) {
      console.log('Order status:', orderDetails.object.getStatus());
    }

    // 5. Get order transactions
    console.log('\nFetching order transactions...');
    const transactions: ApiResponse<GetOrderTransactionsResponse> | null = await client.getOrderTransactions(
      accessToken,
      orderIdentification
    );

    if (transactions?.object) {
      console.log('Number of transactions:', transactions.object.transactions.length);
      
      // If there are transactions, get details of the first one
      if (transactions.object.transactions.length > 0) {
        const transaction = transactions.object.transactions[0];
        console.log('First transaction ID:', transaction.getTransactionId());
        console.log('Transaction status:', transaction.getStatus());
        console.log('Transaction amount:', transaction.getTransactionAmount());
      }
    }

  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    if (error.body) {
      console.error('Response body:', error.body);
    }
  }
}

// Utility functions examples
console.log('\n=== Utility Functions Examples ===\n');

// Transliteration
const greekText = 'Γεια σου κόσμε';
console.log('Original:', greekText);
console.log('Transliterated:', RaiAcceptService.transliterate(greekText));

// Phone number cleaning
const phoneNumber = '+1 (234) 567-8900';
console.log('\nOriginal phone:', phoneNumber);
console.log('Cleaned phone:', RaiAcceptService.cleanPhoneNumber(phoneNumber));

// Country code conversion
const countryCode2 = 'US';
console.log('\n2-letter country code:', countryCode2);
console.log('3-letter country code:', RaiAcceptService.getCountryIso3(countryCode2));

// Status helpers
console.log('\nPaid statuses:', RaiAcceptService.getPaidStatuses());
console.log('Failed statuses:', RaiAcceptService.getFailedStatuses());
console.log('Cancelled statuses:', RaiAcceptService.getCancelledStatuses());

// Run the main example
console.log('\n=== API Operations Example ===\n');
// main();
console.log('Uncomment main() to run the API operations example');
