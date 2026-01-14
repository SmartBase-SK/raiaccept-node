import { AuthenticationResult } from './AuthenticationResult.js';
import { ChallengeParameters } from './ChallengeParameters.js';

/**
 * AuthResponse
 * @category Model
 */
export class AuthResponse {
  authenticationResult: AuthenticationResult | null = null;
  challengeParameters: ChallengeParameters | null = null;

  constructor() {
    this.authenticationResult = null;
    this.challengeParameters = null;
  }

  static fromObject(data: any = {}): AuthResponse {
    const instance = new AuthResponse();
    instance.authenticationResult = data.AuthenticationResult
      ? AuthenticationResult.fromObject(data.AuthenticationResult)
      : null;
    instance.challengeParameters = data.ChallengeParameters
      ? ChallengeParameters.fromObject(data.ChallengeParameters)
      : null;
    return instance;
  }

  getIdToken(): string {
    if (!this.authenticationResult) {
      return '';
    }
    return this.authenticationResult.getIdToken();
  }
}
