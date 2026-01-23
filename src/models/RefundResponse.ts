/**
 * RefundResponse
 * @category Model
 */
export class RefundResponse {
  transactionId: string = '';

  constructor() {
    this.transactionId = '';
  }

  static fromObject(data: any = {}): RefundResponse {
    const instance = new RefundResponse();
    instance.transactionId = data.transactionId || '';
    return instance;
  }
}
