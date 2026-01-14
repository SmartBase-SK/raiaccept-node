/**
 * Transaction
 * @category Model
 */
export class Transaction {
  static TRANSACTION_TYPE_PURCHASE = 'PURCHASE';
  static TRANSACTION_TYPE_REFUND = 'REFUND';

  transactionId: string = '';
  transactionAmount: number = 0.0;
  transactionCurrency: string = '';
  isProduction: boolean = false;
  transactionType: string = '';
  paymentMethod: string = '';
  status: string = '';
  statusCode: string = '';
  statusMessage: string = '';
  createdOn: string = '';
  updatedOn: string = '';

  constructor() {
    this.transactionId = '';
    this.transactionAmount = 0.0;
    this.transactionCurrency = '';
    this.isProduction = false;
    this.transactionType = '';
    this.paymentMethod = '';
    this.status = '';
    this.statusCode = '';
    this.statusMessage = '';
    this.createdOn = '';
    this.updatedOn = '';
  }

  static fromObject(data: any = {}): Transaction {
    const instance = new Transaction();
    instance.transactionId = data.transactionId || '';
    instance.transactionAmount = data.transactionAmount || 0.0;
    instance.transactionCurrency = data.transactionCurrency || '';
    instance.isProduction = data.isProduction || false;
    instance.transactionType = data.transactionType || '';
    instance.paymentMethod = data.paymentMethod || '';
    instance.status = data.status || '';
    instance.statusCode = data.statusCode || '';
    instance.statusMessage = data.statusMessage || '';
    instance.createdOn = data.createdOn || '';
    instance.updatedOn = data.updatedOn || '';
    return instance;
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  getStatus(): string {
    return this.status;
  }

  getTransactionType(): string {
    return this.transactionType;
  }

  getTransactionAmount(): number {
    return this.transactionAmount;
  }

  getTransactionCurrency(): string {
    return this.transactionCurrency;
  }

  getCreatedOn(): string {
    return this.createdOn;
  }
}
