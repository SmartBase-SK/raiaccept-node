/**
 * RefundRequest
 * @category Model
 */
export class RefundRequest {
  amount: number = 0.0;
  currency: string = '';

  constructor() {
    this.amount = 0.0;
    this.currency = '';
  }

  static fromObject(data: any = {}): RefundRequest {
    const instance = new RefundRequest();
    instance.amount = data.amount || 0.0;
    instance.currency = data.currency || '';
    return instance;
  }
}
