/**
 * AuthApiLogoutInput
 * @category Model
 */
export class AuthApiLogoutInput {
  refreshToken: string = '';

  constructor() {
    this.refreshToken = '';
  }

  static fromObject(data: any = {}): AuthApiLogoutInput {
    const instance = new AuthApiLogoutInput();
    instance.refreshToken = data.refreshToken || '';
    return instance;
  }
}
