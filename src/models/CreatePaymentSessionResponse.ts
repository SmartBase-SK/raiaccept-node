/**
 * CreatePaymentSessionResponse
 * @category Model
 */
export class CreatePaymentSessionResponse {
  sessionId: string = '';
  paymentRedirectURL: string = '';
  expiresAt: string = '';

  constructor() {
    this.sessionId = '';
    this.paymentRedirectURL = '';
    this.expiresAt = '';
  }

  static fromObject(data: any = {}): CreatePaymentSessionResponse {
    const instance = new CreatePaymentSessionResponse();
    instance.sessionId = data.sessionId || '';
    instance.paymentRedirectURL = data.paymentRedirectURL || '';
    instance.expiresAt = data.expiresAt || '';
    return instance;
  }
}
