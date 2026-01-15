import { Transaction } from './Transaction.js';

/**
 * GetTransactionDetailsResponse
 * @category Model
 */
export class GetTransactionDetailsResponse extends Transaction {
  order: any = null;

  constructor() {
    super();
    this.order = null;
  }

  static fromObject(data: any = {}): GetTransactionDetailsResponse {
    const transactionData = data.transaction || data;
    const instance = Object.assign(new GetTransactionDetailsResponse(), Transaction.fromObject(transactionData));
    instance.order = data.order || null;
    return instance;
  }
}
