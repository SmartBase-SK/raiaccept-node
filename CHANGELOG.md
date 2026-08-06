# Changelog

## 0.10.0

### Added

- **Merchant integration mode** (default): auth on `https://auth.raiaccept.com`, API on `https://trapi.raiaccept.com`, no mTLS.
- **Partner integration mode**: mTLS cert/key; auth and API on `https://api.raiaccept.com`. Auto-detected when both cert and key are provided; override with `{ authMode: 'partner' }` or `{ authMode: 'merchant' }`.
- Exported `AuthMode`, `RaiAcceptClientConfig`, `DEFAULT_AUTH_MODE`, `RAIACCEPT_URLS`, `resolveAuthMode`, `assertTlsCredentialsPair`, `assertPartnerTlsRequired`, and `validateAuthModeConfiguration`.
- Unit tests for mode-aware URL routing and mTLS behavior.
- Separate merchant and partner integration test suites (shared username/password credentials).

### Changed

- **Breaking:** Default auth mode is now `merchant`. Partner mode applies when both cert and key are provided (same as 0.9.x), or via `{ authMode: 'partner' }`.
- Partial TLS config (only cert or only key) throws `InvalidArgumentException` at construction time.
- Explicit partner mode without both cert and key throws `InvalidArgumentException` at construction time.
- Removed deprecated `RaiAcceptAPIApi.AUTH_URL` and `RaiAcceptAPIApi.API_URL`; use exported `RAIACCEPT_URLS` instead.
- `RaiAcceptService` and `RaiAcceptAPIApi` constructors accept an optional fourth argument `config?: RaiAcceptClientConfig`.
- `ErrorResponse` model accepts both partner (`message`, `code`, `details`) and trapi (`traceId`, `timestamp`, `status`, `errors`) error shapes.
- API error parsing now includes HTTP 401 and 403 in addition to 400.

### Migration from 0.9.x (partner integrations)

```typescript
// 0.9.x — implicit partner via cert + key
const service = new RaiAcceptService(httpClient, cert, key);

// 0.10.x — same call auto-detects partner; explicit flag optional
const service = new RaiAcceptService(httpClient, cert, key);
// or: new RaiAcceptService(httpClient, cert, key, { authMode: 'partner' });
```

## 0.9.5

- Partner-only SDK using `api.raiaccept.com` for auth and API with mTLS.
