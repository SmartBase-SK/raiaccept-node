import { Address } from './Address.js';
import { Consumer } from './Consumer.js';
import { Invoice } from './Invoice.js';
import { Urls } from './Urls.js';
import { Recurring } from './Recurring.js';
import { Merchant } from './Merchant.js';

/**
 * CreateOrderEntryResponse
 * @category Model
 */
export class CreateOrderEntryResponse {
  billingAddress: Address | null = null;
  consumer: Consumer | null = null;
  invoice: Invoice | null = null;
  paymentMethodPreference: string = '';
  shippingAddress: Address | null = null;
  urls: Urls | null = null;
  linkId: string = '';
  recurring: Recurring | null = null;
  orderIdentification: string = '';
  merchant: Merchant | null = null;
  createdOn: string = '';
  isProduction: boolean = false;

  constructor() {
    this.billingAddress = null;
    this.consumer = null;
    this.invoice = null;
    this.paymentMethodPreference = '';
    this.shippingAddress = null;
    this.urls = null;
    this.linkId = '';
    this.recurring = null;
    this.orderIdentification = '';
    this.merchant = null;
    this.createdOn = '';
    this.isProduction = false;
  }

  static fromObject(data: any = {}): CreateOrderEntryResponse {
    const instance = new CreateOrderEntryResponse();
    instance.billingAddress = data.billingAddress ? Address.fromObject(data.billingAddress) : null;
    instance.shippingAddress = data.shippingAddress ? Address.fromObject(data.shippingAddress) : null;
    instance.consumer = data.consumer ? Consumer.fromObject(data.consumer) : null;
    instance.invoice = data.invoice ? Invoice.fromObject(data.invoice) : null;
    instance.urls = data.urls ? Urls.fromObject(data.urls) : null;
    instance.recurring = data.recurring ? Recurring.fromObject(data.recurring) : null;
    instance.paymentMethodPreference = data.paymentMethodPreference || '';
    instance.linkId = data.linkId || '';
    instance.orderIdentification = data.orderIdentification || '';
    instance.merchant = data.merchant ? Merchant.fromObject(data.merchant) : null;
    instance.createdOn = data.createdOn || '';
    instance.isProduction = data.isProduction || false;
    return instance;
  }

  getOrderIdentification(): string {
    return this.orderIdentification;
  }

  getMerchantOrderReference(): string {
    if (!this.invoice) {
      return '';
    }
    return this.invoice.getMerchantOrderReference();
  }
}
