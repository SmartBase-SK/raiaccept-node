import { InvalidArgumentException } from '../exceptions/InvalidArgumentException.js';

export type AuthMode = 'merchant' | 'partner';

export type RaiAcceptClientConfig = {
  authMode?: AuthMode;
};

export const DEFAULT_AUTH_MODE: AuthMode = 'merchant';

export const RAIACCEPT_URLS = {
  merchant: {
    auth: 'https://auth.raiaccept.com',
    api: 'https://trapi.raiaccept.com',
  },
  partner: {
    auth: 'https://api.raiaccept.com',
    api: 'https://api.raiaccept.com',
  },
} as const;

function hasTlsCredential(value?: string | Buffer): boolean {
  return value !== undefined && value !== null && value !== '';
}

/**
 * Fail fast when only one of cert/key is provided — partial mTLS config is always invalid.
 */
export function assertTlsCredentialsPair(
  cert?: string | Buffer,
  key?: string | Buffer
): void {
  const hasCert = hasTlsCredential(cert);
  const hasKey = hasTlsCredential(key);
  if (hasCert !== hasKey) {
    throw new InvalidArgumentException(
      'Invalid TLS configuration: both cert and key must be provided together, or neither for merchant mode.'
    );
  }
}

/**
 * Fail fast when partner mode is selected without both cert and key.
 */
export function assertPartnerTlsRequired(
  cert?: string | Buffer,
  key?: string | Buffer,
  authMode?: AuthMode
): void {
  if (authMode !== 'partner') {
    return;
  }
  if (!hasTlsCredential(cert) || !hasTlsCredential(key)) {
    throw new InvalidArgumentException(
      'Partner mode requires both cert and key in the constructor.'
    );
  }
}

/**
 * Resolve auth mode: explicit config wins; otherwise partner when both cert and key
 * are provided, merchant by default. Throws when only one of cert/key is set.
 */
export function resolveAuthMode(
  cert?: string | Buffer,
  key?: string | Buffer,
  config?: RaiAcceptClientConfig
): AuthMode {
  assertTlsCredentialsPair(cert, key);

  if (config?.authMode) {
    return config.authMode;
  }
  if (cert && key) {
    return 'partner';
  }
  return DEFAULT_AUTH_MODE;
}

/**
 * Validate TLS credentials for the resolved auth mode.
 */
export function validateAuthModeConfiguration(
  cert?: string | Buffer,
  key?: string | Buffer,
  config?: RaiAcceptClientConfig
): AuthMode {
  const authMode = resolveAuthMode(cert, key, config);
  assertPartnerTlsRequired(cert, key, authMode);
  return authMode;
}
