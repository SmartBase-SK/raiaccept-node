import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import { RaiAcceptService } from '../src/RaiAcceptService.ts'
import { HttpClient } from '../src/HttpClient.ts'
import { CreateOrderEntryRequest } from '../src/models/CreateOrderEntryRequest.ts'
import { Consumer } from '../src/models/Consumer.ts'
import { Invoice } from '../src/models/Invoice.ts'
import { Urls } from '../src/models/Urls.ts'

describe('RaiAcceptService Integration Tests', () => {
  describe('Complete Payment Creation Flow', () => {
    it('should authenticate, create order entry, and create payment session', async () => {
      const username = process.env.RAIACCEPT_TEST_USERNAME || process.env.RAIACCEPT_USERNAME
      const password = process.env.RAIACCEPT_TEST_PASSWORD || process.env.RAIACCEPT_PASSWORD

      if (!username || !password) {
        throw new Error('Test credentials required: Set RAIACCEPT_TEST_USERNAME/RAIACCEPT_TEST_PASSWORD or RAIACCEPT_USERNAME/RAIACCEPT_PASSWORD environment variables')
      }

      const httpClient = new HttpClient()
      const realService = new RaiAcceptService(httpClient)

      // Step 1: Authenticate to get access token
      const accessToken = await realService.retrieveAccessTokenWithCredentials(username, password)
      expect(accessToken).toBeTruthy()
      expect(typeof accessToken).toBe('string')
      expect(accessToken.length).toBeGreaterThan(10)
      expect(accessToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)
      console.log('Authentication successful')

      // Step 2: Create order entry
      const consumer = Consumer.fromObject({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        mobilePhone: '+421908123456'
      })

      const invoice = Invoice.fromObject({
        amount: 100.00,
        currency: 'USD',
        description: 'Test Order',
        merchantOrderReference: `test-order-${Date.now()}`,
        items: []
      })

      const urls = Urls.fromObject({
        successUrl: 'https://example.com/success',
        failUrl: 'https://example.com/fail',
        cancelUrl: 'https://example.com/cancel',
        notificationUrl: 'https://example.com/notification'
      })

      const orderRequest = CreateOrderEntryRequest.fromObject({
        consumer: consumer,
        invoice: invoice,
        urls: urls,
        paymentMethodPreference: 'CARD'
      })

      const orderResult = await realService.createOrderEntry(accessToken, orderRequest)

      // Verify order creation response
      expect(orderResult).toBeDefined()
      expect(orderResult).toHaveProperty('object')

      const orderResponse = orderResult.object
      expect(orderResponse).toBeDefined()
      expect(orderResponse).toHaveProperty('orderIdentification')
      expect(orderResponse.orderIdentification).toBeTruthy()
      expect(typeof orderResponse.orderIdentification).toBe('string')
      expect(orderResponse).toHaveProperty('createdOn')
      expect(orderResponse).toHaveProperty('isProduction')
      expect(typeof orderResponse.isProduction).toBe('boolean')

      const orderId = orderResponse.orderIdentification
      console.log('Order entry created successfully:', orderId)

      // Step 3: Create payment session for the order
      const paymentSessionRequest = orderRequest

      const paymentResult = await realService.createPaymentSession(accessToken, paymentSessionRequest, orderId)

      // Verify payment session response
      expect(paymentResult).toBeDefined()
      expect(paymentResult).toHaveProperty('object')

      const paymentResponse = paymentResult.object
      expect(paymentResponse).toBeDefined()
      expect(paymentResponse).toHaveProperty('sessionId')
      expect(paymentResponse).toHaveProperty('paymentRedirectURL')
      expect(paymentResponse).toHaveProperty('expiresAt')
      expect(paymentResponse.sessionId).toBeTruthy()
      expect(typeof paymentResponse.sessionId).toBe('string')
      expect(paymentResponse.paymentRedirectURL).toBeTruthy()
      expect(typeof paymentResponse.paymentRedirectURL).toBe('string')
      expect(paymentResponse.paymentRedirectURL).toMatch(/^https?:\/\//)

      console.log('Payment session created successfully:', paymentResponse.sessionId)

      // Step 4: Get order details
      const orderDetailsResult = await realService.getOrderDetails(accessToken, orderId)

      // Verify order details response
      expect(orderDetailsResult).toBeDefined()
      expect(orderDetailsResult).toHaveProperty('object')

      const orderDetailsResponse = orderDetailsResult.object
      expect(orderDetailsResponse).toBeDefined()
      expect(orderDetailsResponse).toHaveProperty('status')
      expect(typeof orderDetailsResponse.status).toBe('string')
      expect(orderDetailsResponse.consumer).toBeDefined()
      expect(orderDetailsResponse.consumer.email).toBe(consumer.email)
      expect(orderDetailsResponse.consumer.firstName).toBe(consumer.firstName)
      expect(orderDetailsResponse.consumer.lastName).toBe(consumer.lastName)
      expect(orderDetailsResponse.invoice).toBeDefined()
      expect(orderDetailsResponse.invoice.amount).toBe(invoice.amount)
      expect(orderDetailsResponse.invoice.currency).toBe(invoice.currency)
      expect(orderDetailsResponse.invoice.merchantOrderReference).toBe(invoice.merchantOrderReference)

      console.log('Order details retrieved successfully - status:', orderDetailsResponse.status, 'for order:', orderId)

      // Step 5: Verify no transactions exist for newly created payment session
      const transactionsResult = await realService.getOrderTransactions(accessToken, orderId)

      expect(transactionsResult).toBeDefined()
      expect(transactionsResult).toHaveProperty('object')

      const transactionsResponse = transactionsResult.object
      expect(transactionsResponse).toBeDefined()
      expect(transactionsResponse).toHaveProperty('transactions')
      expect(Array.isArray(transactionsResponse.transactions)).toBe(true)

      // For a newly created payment session, there should be no transactions yet
      expect(transactionsResponse.transactions.length).toBe(0)

      console.log('Success: No transactions found for new payment session')
    }, 60000) // 60 second timeout for complete payment flow
  })
})