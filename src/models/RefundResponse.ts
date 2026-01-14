/**
 * RefundResponse
 * @category Model
 */
export class RefundResponse {
  refundId: string = '';
  status: string = '';
  amount: number = 0.0;
  currency: string = '';

  constructor() {
    this.refundId = '';
    this.status = '';
    this.amount = 0.0;
    this.currency = '';
  }

  static fromObject(data: any = {}): RefundResponse {
    const instance = new RefundResponse();
    instance.refundId = data.refundId || '';
    instance.status = data.status || '';
    instance.amount = data.amount || 0.0;
    instance.currency = data.currency || '';
    return instance;
  }
}
