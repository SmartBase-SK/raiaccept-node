/**
 * InvoiceItem
 * @category Model
 */
export class InvoiceItem {
  description: string = '';
  numberOfItems: number = 0;
  price: number = 0.0;

  constructor() {
    this.description = '';
    this.numberOfItems = 0;
    this.price = 0.0;
  }

  static fromObject(data: any = {}): InvoiceItem {
    const instance = new InvoiceItem();
    instance.description = data.description || '';
    instance.numberOfItems = data.numberOfItems || 0;
    instance.price = data.price || 0.0;
    return instance;
  }
}
