/**
 * AuthenticationResult
 * @category Model
 */
export class AuthenticationResult {
  AccessToken: string = '';
  ExpiresIn: number = 0;
  IdToken: string = '';
  RefreshToken: string = '';
  TokenType: string = '';

  constructor() {
    this.AccessToken = '';
    this.ExpiresIn = 0;
    this.IdToken = '';
    this.RefreshToken = '';
    this.TokenType = '';
  }

  static fromObject(data: any = {}): AuthenticationResult {
    const instance = new AuthenticationResult();
    instance.AccessToken = data.AccessToken || '';
    instance.ExpiresIn = data.ExpiresIn || 0;
    instance.IdToken = data.IdToken || '';
    instance.RefreshToken = data.RefreshToken || '';
    instance.TokenType = data.TokenType || '';
    return instance;
  }

  getIdToken(): string {
    return this.IdToken;
  }
}
