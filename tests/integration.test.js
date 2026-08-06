import 'dotenv/config'
import { readFileSync, existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { RaiAcceptService } from '../src/RaiAcceptService.ts'
import { HttpClient } from '../src/HttpClient.ts'
import { CreateOrderEntryRequest } from '../src/models/CreateOrderEntryRequest.ts'
import { Consumer } from '../src/models/Consumer.ts'
import { Invoice } from '../src/models/Invoice.ts'
import { Urls } from '../src/models/Urls.ts'

function loadCertAndKey() {
  const certPath = process.env.RAIACCEPT_CERT_PATH || process.env.RAIACCEPT_TEST_CERT_PATH
  const keyPath = process.env.RAIACCEPT_KEY_PATH || process.env.RAIACCEPT_TEST_KEY_PATH
  if (certPath && keyPath && existsSync(certPath) && existsSync(keyPath)) {
    const cert = readFileSync(certPath, 'utf-8').replace(/\r\n/g, '\n').trim()
    const key = readFileSync(keyPath, 'utf-8').replace(/\r\n/g, '\n').trim()
    return { cert, key }
  }
  const certBase64 = (process.env.RAIACCEPT_CERT_BASE64 || process.env.RAIACCEPT_TEST_CERT_BASE64 || '')
    .replace(/\\n/g, '')
    .replace(/\s/g, '')
    .trim()
  const keyBase64 = (process.env.RAIACCEPT_KEY_BASE64 || process.env.RAIACCEPT_TEST_KEY_BASE64 || '')
    .replace(/\\n/g, '')
    .replace(/\s/g, '')
    .trim()
  if (!certBase64 || !keyBase64) return null
  try {
    const cert = Buffer.from(certBase64, 'base64').toString('utf-8').replace(/\r\n/g, '\n').trim()
    const key = Buffer.from(keyBase64, 'base64').toString('utf-8').replace(/\r\n/g, '\n').trim()
    if (!cert.startsWith('-----BEGIN') || !key.startsWith('-----BEGIN')) return null
    return { cert, key }
  } catch {
    return null
  }
}

function loadCredentials() {
  const username = process.env.RAIACCEPT_TEST_USERNAME || process.env.RAIACCEPT_USERNAME
  const password = process.env.RAIACCEPT_TEST_PASSWORD || process.env.RAIACCEPT_PASSWORD

  if (!username || !password) {
    throw new Error(
      'Test credentials required: Set RAIACCEPT_TEST_USERNAME/RAIACCEPT_TEST_PASSWORD or RAIACCEPT_USERNAME/RAIACCEPT_PASSWORD environment variables'
    )
  }

  return {
    username,
    password,
    integrationContext: {
      type: 'CODE',
      data: {
        name: 'raiaccept-sdk-integration-test',
        version: '1.0.0',
        vendor: 'Smartbase s.r.o.',
      },
    },
  }
}

function createService(authMode) {
  const httpClient = new HttpClient()
  if (authMode === 'partner') {
    const certKey = loadCertAndKey()
    if (!certKey) {
      throw new Error(
        'Partner mode test cert/key required. Use either:\n' +
          '  - RAIACCEPT_CERT_PATH + RAIACCEPT_KEY_PATH (paths to PEM files)\n' +
          '  - RAIACCEPT_CERT_BASE64 + RAIACCEPT_KEY_BASE64 (base64 of full PEM files)'
      )
    }
    const { cert, key } = certKey
    return new RaiAcceptService(httpClient, cert, key)
  }
  return new RaiAcceptService(httpClient)
}

async function runPaymentFlow(service, { username, password, integrationContext }) {
  console.log('[Step 1] Authenticating...')
  const authResult = await service.retrieveAccessTokenWithCredentials(username, password, integrationContext)
  const accessToken = authResult?.accessToken
  expect(accessToken).toBeTruthy()
  expect(typeof accessToken).toBe('string')
  expect(accessToken.length).toBeGreaterThan(10)
  expect(accessToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)

  console.log('[Step 2] Creating order entry...')
  const consumer = Consumer.fromObject({
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    mobilePhone: '+421908123456',
  })

  const invoice = Invoice.fromObject({
    amount: 100.0,
    currency: 'USD',
    description: 'Test Order',
    merchantOrderReference: `test-order-${Date.now()}`,
    items: [],
  })

  const urls = Urls.fromObject({
    successUrl: 'https://example.com/success',
    failUrl: 'https://example.com/fail',
    cancelUrl: 'https://example.com/cancel',
    notificationUrl: 'https://example.com/notification',
  })

  const orderRequest = CreateOrderEntryRequest.fromObject({
    consumer,
    invoice,
    urls,
    paymentMethodPreference: 'CARD',
  })

  const orderResult = await service.createOrderEntry(accessToken, orderRequest)
  expect(orderResult).toBeDefined()
  expect(orderResult).toHaveProperty('object')

  const orderResponse = orderResult.object
  expect(orderResponse).toBeDefined()
  expect(orderResponse.orderIdentification).toBeTruthy()
  expect(typeof orderResponse.orderIdentification).toBe('string')
  expect(orderResponse).toHaveProperty('createdOn')
  expect(orderResponse).toHaveProperty('isProduction')
  expect(typeof orderResponse.isProduction).toBe('boolean')

  const orderId = orderResponse.orderIdentification

  console.log('[Step 3] Creating payment session...')
  const paymentResult = await service.createPaymentSession(accessToken, orderRequest, orderId)
  expect(paymentResult).toBeDefined()
  expect(paymentResult).toHaveProperty('object')

  const paymentResponse = paymentResult.object
  expect(paymentResponse).toBeDefined()
  expect(paymentResponse.sessionId).toBeTruthy()
  expect(paymentResponse.paymentRedirectURL).toBeTruthy()
  expect(paymentResponse.paymentRedirectURL).toMatch(/^https?:\/\//)

  console.log('[Step 4] Getting order details...')
  const orderDetailsResult = await service.getOrderDetails(accessToken, orderId)
  expect(orderDetailsResult).toBeDefined()
  expect(orderDetailsResult.object?.status).toBeTruthy()
  expect(orderDetailsResult.object?.consumer?.email).toBe(consumer.email)

  console.log('[Step 5] Getting order transactions...')
  const transactionsResult = await service.getOrderTransactions(accessToken, orderId)
  expect(transactionsResult.object?.transactions).toBeDefined()
  expect(Array.isArray(transactionsResult.object.transactions)).toBe(true)
  expect(transactionsResult.object.transactions.length).toBe(0)

  console.log('[Step 6] Refreshing token...')
  const refreshToken = authResult?.refreshToken
  expect(refreshToken).toBeTruthy()
  const refreshResult = await service.tokenRefresh(refreshToken, integrationContext)
  expect(refreshResult.object?.accessToken).toBeTruthy()
  expect(typeof refreshResult.object?.accessTokenExpiresIn).toBe('number')

  console.log('[Step 7] Logging out...')
  const logoutSuccess = await service.tokenLogout(refreshToken)
  expect(logoutSuccess).toBe(true)
}

describe('RaiAcceptService Integration Tests', () => {
  describe('merchant mode integration', () => {
    it('should run complete payment flow without mTLS', async () => {
      const credentials = loadCredentials()
      const service = createService('merchant')
      await runPaymentFlow(service, credentials)
    }, 60000)
  })

  const partnerCertKey = loadCertAndKey()
  const describePartner = partnerCertKey ? describe : describe.skip

  describePartner('partner mode integration', () => {
    it('should run complete payment flow with mTLS', async () => {
      const credentials = loadCredentials()
      const service = createService('partner')
      await runPaymentFlow(service, credentials)
    }, 60000)
  })
})
