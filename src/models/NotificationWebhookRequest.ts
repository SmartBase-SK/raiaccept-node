/**
 * NotificationWebhookRequest
 * @category Model
 */
export class NotificationWebhookRequest {
  orderId: string = '';
  transactionId: string = '';
  status: string = '';
  amount: number = 0.0;
  currency: string = '';
  timestamp: string = '';

  constructor() {
    this.orderId = '';
    this.transactionId = '';
    this.status = '';
    this.amount = 0.0;
    this.currency = '';
    this.timestamp = '';
  }

  static fromObject(data: any = {}): NotificationWebhookRequest {
    const instance = new NotificationWebhookRequest();
    instance.orderId = data.orderId || '';
    instance.transactionId = data.transactionId || '';
    instance.status = data.status || '';
    instance.amount = data.amount || 0.0;
    instance.currency = data.currency || '';
    instance.timestamp = data.timestamp || '';
    return instance;
  }
}
