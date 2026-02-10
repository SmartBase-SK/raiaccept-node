/**
 * AuthApiLoginOutput
 * @category Model
 */
export class AuthApiLoginOutput {
  accessToken: string = '';
  accessTokenExpiresIn: number = 0;
  refreshToken: string = '';
  refreshTokenExpiresIn: number = 0;

  constructor() {
    this.accessToken = '';
    this.accessTokenExpiresIn = 0;
    this.refreshToken = '';
    this.refreshTokenExpiresIn = 0;
  }

  static fromObject(data: any = {}): AuthApiLoginOutput {
    const instance = new AuthApiLoginOutput();
    instance.accessToken = data.accessToken || '';
    instance.accessTokenExpiresIn = data.accessTokenExpiresIn || 0;
    instance.refreshToken = data.refreshToken || '';
    instance.refreshTokenExpiresIn = data.refreshTokenExpiresIn || 0;
    return instance;
  }
}
