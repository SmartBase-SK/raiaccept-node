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
    const instance = Object.assign(new GetTransactionDetailsResponse(), Transaction.fromObject(data));
    instance.order = data.order || null;
    return instance;
  }
}
