import { describe, it, expect } from 'vitest'
import { RaiAcceptAPIApi } from '../src/api/RaiAcceptAPIApi.ts'
import { HttpClient } from '../src/HttpClient.ts'
import { InvalidArgumentException } from '../src/exceptions/InvalidArgumentException.ts'

const TEST_CERT = '-----BEGIN CERTIFICATE-----\ntest-cert\n-----END CERTIFICATE-----'
const TEST_KEY = '-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----'

const integrationContext = {
  type: 'CODE',
  data: {
    name: 'test-sdk',
    version: '1.0.0',
    vendor: 'Test Vendor',
  },
}

describe('RaiAcceptAPIApi routing', () => {
  describe('merchant mode (default)', () => {
    const api = new RaiAcceptAPIApi(new HttpClient())

    it('uses auth.raiaccept.com for login', () => {
      const request = api.tokenRequest('user', 'pass', integrationContext)
      expect(request.url).toBe('https://auth.raiaccept.com/auth/api/login')
      expect(request.cert).toBeUndefined()
      expect(request.key).toBeUndefined()
    })

    it('uses auth.raiaccept.com for refresh', () => {
      const request = api.tokenRefreshRequest('refresh-token', integrationContext)
      expect(request.url).toBe('https://auth.raiaccept.com/auth/api/refresh')
      expect(request.cert).toBeUndefined()
      expect(request.key).toBeUndefined()
    })

    it('uses auth.raiaccept.com for logout', () => {
      const request = api.tokenLogoutRequest('refresh-token')
      expect(request.url).toBe('https://auth.raiaccept.com/auth/api/logout')
      expect(request.cert).toBeUndefined()
      expect(request.key).toBeUndefined()
    })

    it('uses trapi.raiaccept.com for create order', () => {
      const request = api.createOrderEntryRequest('access-token', {} as any)
      expect(request.url).toBe('https://trapi.raiaccept.com/orders')
      expect(request.cert).toBeUndefined()
      expect(request.key).toBeUndefined()
    })

    it('throws when only cert or only key is provided', () => {
      expect(() => new RaiAcceptAPIApi(new HttpClient(), TEST_CERT, undefined)).toThrow(InvalidArgumentException)
      expect(() => new RaiAcceptAPIApi(new HttpClient(), undefined, TEST_KEY)).toThrow(InvalidArgumentException)
    })

    it('uses merchant mode when cert/key passed with explicit authMode merchant', () => {
      const apiWithCert = new RaiAcceptAPIApi(new HttpClient(), TEST_CERT, TEST_KEY, { authMode: 'merchant' })
      expect(apiWithCert.getAuthMode()).toBe('merchant')
      const request = apiWithCert.tokenRequest('user', 'pass', integrationContext)
      expect(request.url).toBe('https://auth.raiaccept.com/auth/api/login')
      expect(request.cert).toBeUndefined()
      expect(request.key).toBeUndefined()
    })
  })

  describe('partner mode (explicit)', () => {
    const api = new RaiAcceptAPIApi(new HttpClient(), TEST_CERT, TEST_KEY, { authMode: 'partner' })

    it('uses api.raiaccept.com for login with mTLS', () => {
      const request = api.tokenRequest('user', 'pass', integrationContext)
      expect(request.url).toBe('https://api.raiaccept.com/auth/api/login')
      expect(request.cert).toBe(TEST_CERT)
      expect(request.key).toBe(TEST_KEY)
    })

    it('uses api.raiaccept.com for refresh with mTLS', () => {
      const request = api.tokenRefreshRequest('refresh-token', integrationContext)
      expect(request.url).toBe('https://api.raiaccept.com/auth/api/refresh')
      expect(request.cert).toBe(TEST_CERT)
      expect(request.key).toBe(TEST_KEY)
    })

    it('uses api.raiaccept.com for API calls with mTLS', () => {
      const request = api.createOrderEntryRequest('access-token', {} as any)
      expect(request.url).toBe('https://api.raiaccept.com/orders')
      expect(request.cert).toBe(TEST_CERT)
      expect(request.key).toBe(TEST_KEY)
    })

    it('throws when cert/key missing', () => {
      const apiWithoutTls = new RaiAcceptAPIApi(new HttpClient(), undefined, undefined, { authMode: 'partner' })
      expect(() => apiWithoutTls.tokenRequest('user', 'pass', integrationContext)).toThrow(InvalidArgumentException)
    })
  })

  describe('partner mode (auto-detected from cert + key)', () => {
    const api = new RaiAcceptAPIApi(new HttpClient(), TEST_CERT, TEST_KEY)

    it('infers partner when cert and key provided without explicit authMode', () => {
      expect(api.getAuthMode()).toBe('partner')
    })

    it('uses api.raiaccept.com with mTLS', () => {
      const request = api.tokenRequest('user', 'pass', integrationContext)
      expect(request.url).toBe('https://api.raiaccept.com/auth/api/login')
      expect(request.cert).toBe(TEST_CERT)
      expect(request.key).toBe(TEST_KEY)
    })
  })
})
