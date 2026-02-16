/**
 * AuthApiLoginInput
 * @category Model
 */
export class AuthApiLoginInput {
  username: string = '';
  password: string = '';

  constructor() {
    this.username = '';
    this.password = '';
  }

  static fromObject(data: any = {}): AuthApiLoginInput {
    const instance = new AuthApiLoginInput();
    instance.username = data.username || '';
    instance.password = data.password || '';
    return instance;
  }
}
