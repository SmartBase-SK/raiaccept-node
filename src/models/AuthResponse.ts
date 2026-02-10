import { AuthenticationResult } from './AuthenticationResult.js';
import { ChallengeParameters } from './ChallengeParameters.js';

/**
 * AuthResponse
 * @category Model
 */
export class AuthResponse {
  authenticationResult: AuthenticationResult | null = null;
  challengeParameters: ChallengeParameters | null = null;
  accessToken: string = '';

  constructor() {
    this.authenticationResult = null;
    this.challengeParameters = null;
    this.accessToken = '';
  }

  static fromObject(data: any = {}): AuthResponse {
    const instance = new AuthResponse();

    // Handle new API format: { accessToken: "..." }
    if (data.accessToken) {
      instance.accessToken = data.accessToken;
      return instance;
    }

    // Handle legacy AWS Cognito format for backward compatibility
    instance.authenticationResult = data.AuthenticationResult
      ? AuthenticationResult.fromObject(data.AuthenticationResult)
      : null;
    instance.challengeParameters = data.ChallengeParameters
      ? ChallengeParameters.fromObject(data.ChallengeParameters)
      : null;
    return instance;
  }

  getIdToken(): string {
    // Return accessToken from new API format if available
    if (this.accessToken) {
      return this.accessToken;
    }

    // Fall back to legacy format
    if (!this.authenticationResult) {
      return '';
    }
    return this.authenticationResult.getIdToken();
  }
}
