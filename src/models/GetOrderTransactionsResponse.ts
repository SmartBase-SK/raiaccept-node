import { Transaction } from './Transaction.js';

/**
 * GetOrderTransactionsResponse
 * @category Model
 */
export class GetOrderTransactionsResponse {
  transactions: Transaction[] = [];

  constructor() {
    this.transactions = [];
  }

  static fromObject(data: any = {}): GetOrderTransactionsResponse {
    const instance = new GetOrderTransactionsResponse();
    const transactions = data.transactions || data || [];
    instance.transactions = Array.isArray(transactions)
      ? transactions.map((t: any) => Transaction.fromObject(t))
      : [];
    return instance;
  }
}
