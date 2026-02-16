/**
 * AuthApiRefreshOutput
 * @category Model
 */
export class AuthApiRefreshOutput {
  accessToken: string = '';
  accessTokenExpiresIn: number = 0;

  constructor() {
    this.accessToken = '';
    this.accessTokenExpiresIn = 0;
  }

  static fromObject(data: any = {}): AuthApiRefreshOutput {
    const instance = new AuthApiRefreshOutput();
    instance.accessToken = data.accessToken || '';
    instance.accessTokenExpiresIn = data.accessTokenExpiresIn || 0;
    return instance;
  }
}
