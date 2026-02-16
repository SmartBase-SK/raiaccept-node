/**
 * AuthApiRefreshInput
 * @category Model
 */
export class AuthApiRefreshInput {
  refreshToken: string = '';

  constructor() {
    this.refreshToken = '';
  }

  static fromObject(data: any = {}): AuthApiRefreshInput {
    const instance = new AuthApiRefreshInput();
    instance.refreshToken = data.refreshToken || '';
    return instance;
  }
}
