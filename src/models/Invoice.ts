import { InvoiceItem } from './InvoiceItem.js';

/**
 * Invoice
 * @category Model
 */
export class Invoice {
  amount: number = 0.0;
  currency: string = '';
  description: string = '';
  items: InvoiceItem[] = [];
  merchantOrderReference: string = '';

  constructor() {
    this.amount = 0.0;
    this.currency = '';
    this.description = '';
    this.items = [];
    this.merchantOrderReference = '';
  }

  static fromObject(data: any = {}): Invoice {
    const instance = new Invoice();
    instance.amount = data.amount || 0.0;
    instance.currency = data.currency || '';
    instance.description = data.description || '';
    instance.merchantOrderReference = data.merchantOrderReference || '';

    const items = data.items || [];
    instance.items = items.map((item: any) =>
      item instanceof InvoiceItem ? item : InvoiceItem.fromObject(item)
    );

    return instance;
  }

  getMerchantOrderReference(): string {
    return this.merchantOrderReference;
  }
}
