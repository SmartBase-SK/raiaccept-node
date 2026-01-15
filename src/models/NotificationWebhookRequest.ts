import { CreateOrderEntryResponse } from './CreateOrderEntryResponse.js';
import { Transaction } from './Transaction.js';
import { Merchant } from './Merchant.js';
import { Card } from './Card.js';

/**
 * NotificationWebhookRequest
 * @category Model
 */
export class NotificationWebhookRequest {
  order: CreateOrderEntryResponse;
  transaction: Transaction;
  merchant: Merchant;
  card: Card;

  constructor() {
    this.order = new CreateOrderEntryResponse();
    this.transaction = new Transaction();
    this.merchant = new Merchant();
    this.card = new Card();
  }

  static fromObject(data: any = {}): NotificationWebhookRequest {
    const instance = new NotificationWebhookRequest();
    instance.order = data.order instanceof CreateOrderEntryResponse
      ? data.order
      : CreateOrderEntryResponse.fromObject(data.order || {});
    instance.transaction = data.transaction instanceof Transaction
      ? data.transaction
      : Transaction.fromObject(data.transaction || {});
    instance.merchant = data.merchant instanceof Merchant
      ? data.merchant
      : Merchant.fromObject(data.merchant || {});
    instance.card = data.card instanceof Card
      ? data.card
      : Card.fromObject(data.card || {});
    return instance;
  }

  /**
   * Get orderIdentification from the order object
   */
  getOrderId(): string {
    return this.order.orderIdentification || '';
  }

  /**
   * Get transactionId from the transaction object
   */
  getTransactionId(): string {
    return this.transaction.getTransactionId();
  }

  /**
   * Get status from the transaction object
   */
  getStatus(): string {
    return this.transaction.getStatus();
  }
}
