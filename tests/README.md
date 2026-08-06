# RaiAccept API Client Tests

## Commands

```bash
npm run unit-tests                  # Mocked: transliteration + routing
npm run integration-tests           # Live: merchant + partner flows
npm run integration-tests:merchant  # Live: merchant only (no mTLS)
npm run integration-tests:partner   # Live: partner only (mTLS)
```

## Credentials

Create a `.env` file in the SDK project root:

```bash
# Shared for both integration modes
RAIACCEPT_TEST_USERNAME=your_username
RAIACCEPT_TEST_PASSWORD=your_password

# Partner mode only
RAIACCEPT_CERT_PATH=/path/to/client.crt
RAIACCEPT_KEY_PATH=/path/to/client.key
```

## Test files

| File | Type | Description |
|------|------|-------------|
| `unit.test.js` | Unit | Transliteration helpers |
| `routing.test.js` | Unit | Auth mode URLs and mTLS (no live API) |
| `integration.test.js` | Integration | Full payment flow for merchant and partner modes |

## Integration flow (both modes)

1. Authenticate
2. Create order entry
3. Create payment session
4. Get order details
5. Get order transactions (expect empty for new order)
6. Refresh access token
7. Logout

Merchant mode uses `auth.raiaccept.com` + `trapi.raiaccept.com` without mTLS.

Partner mode uses `api.raiaccept.com` with mTLS cert/key and `{ authMode: 'partner' }`.
