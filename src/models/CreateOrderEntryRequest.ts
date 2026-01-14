import { Address } from './Address.js';
import { Consumer } from './Consumer.js';
import { Invoice } from './Invoice.js';
import { Urls } from './Urls.js';
import { Recurring } from './Recurring.js';

/**
 * CreateOrderEntryRequest
 * @category Model
 */
export class CreateOrderEntryRequest {
  billingAddress: Address | null = null;
  consumer: Consumer | null = null;
  invoice: Invoice | null = null;
  paymentMethodPreference: string = '';
  shippingAddress: Address | null = null;
  urls: Urls | null = null;
  linkId: string = '';
  recurring: Recurring | null = null;

  constructor() {
    this.billingAddress = null;
    this.consumer = null;
    this.invoice = null;
    this.paymentMethodPreference = '';
    this.shippingAddress = null;
    this.urls = null;
    this.linkId = '';
    this.recurring = null;
  }

  static fromObject(data: any = {}): CreateOrderEntryRequest {
    const instance = new CreateOrderEntryRequest();
    instance.billingAddress = data.billingAddress ? Address.fromObject(data.billingAddress) : null;
    instance.shippingAddress = data.shippingAddress ? Address.fromObject(data.shippingAddress) : null;
    instance.consumer = data.consumer ? Consumer.fromObject(data.consumer) : null;
    instance.invoice = data.invoice ? Invoice.fromObject(data.invoice) : null;
    instance.urls = data.urls ? Urls.fromObject(data.urls) : null;
    instance.recurring = data.recurring ? Recurring.fromObject(data.recurring) : null;
    instance.paymentMethodPreference = data.paymentMethodPreference || '';
    instance.linkId = data.linkId || '';
    return instance;
  }
}
