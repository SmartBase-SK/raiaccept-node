# RaiAccept API Client - Test Setup

This document describes the test structure for the RaiAccept JavaScript SDK.

## Quick Start

```bash
npm install
npm run unit-tests
npm run integration-tests
```

## Environment variables

### Shared (merchant + partner integration tests)

```bash
RAIACCEPT_TEST_USERNAME=your_username
RAIACCEPT_TEST_PASSWORD=your_password
```

The same merchant credentials work for both integration modes.

### Partner mode only (mTLS)

Required for `partner mode integration` tests; not needed for merchant mode.

```bash
RAIACCEPT_CERT_PATH=/path/to/client.crt
RAIACCEPT_KEY_PATH=/path/to/client.key
# or
RAIACCEPT_CERT_BASE64=<base64-encoded-pem>
RAIACCEPT_KEY_BASE64=<base64-encoded-pem>
```

## Test scripts

| Command | Description |
|---------|-------------|
| `npm run unit-tests` | Mocked unit + routing tests |
| `npm run integration-tests` | Live API: merchant + partner flows |
| `npm run integration-tests:merchant` | Live API: merchant mode only (no mTLS) |
| `npm run integration-tests:partner` | Live API: partner mode only (mTLS) |

## Test coverage

### Unit tests

- `tests/unit.test.js` — transliteration utilities
- `tests/routing.test.js` — auth mode URL routing and mTLS attachment (mocked)

### Integration tests

- `tests/integration.test.js` — two suites:
  - **merchant mode**: auth on `auth.raiaccept.com`, API on `trapi.raiaccept.com`, no mTLS
  - **partner mode**: auth + API on `api.raiaccept.com` with mTLS

Both run: auth → create order → payment session → order details → transactions → refresh → logout.

## CI

CI is configured in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
