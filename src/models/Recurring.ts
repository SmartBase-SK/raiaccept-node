/**
 * Recurring
 * @category Model
 */
export class Recurring {
  cardToken: string = '';
  customerReference: string = '';
  recurringModel: string = '';

  constructor() {
    this.cardToken = '';
    this.customerReference = '';
    this.recurringModel = '';
  }

  static fromObject(data: any = {}): Recurring {
    const instance = new Recurring();
    if (data.hasOwnProperty('cardToken')) {
      instance.cardToken = data.cardToken;
    }
    if (data.hasOwnProperty('customerReference')) {
      instance.customerReference = data.customerReference;
    }
    instance.recurringModel = data.recurringModel || '';
    return instance;
  }
}
