/**
 * Card
 * @category Model
 */
export class Card {
  cardNumber: string = '';
  expiryMonth: string = '';
  expiryYear: string = '';
  cvv: string = '';
  cardholderName: string = '';

  constructor() {
    this.cardNumber = '';
    this.expiryMonth = '';
    this.expiryYear = '';
    this.cvv = '';
    this.cardholderName = '';
  }

  static fromObject(data: any = {}): Card {
    const instance = new Card();
    instance.cardNumber = data.cardNumber || '';
    instance.expiryMonth = data.expiryMonth || '';
    instance.expiryYear = data.expiryYear || '';
    instance.cvv = data.cvv || '';
    instance.cardholderName = data.cardholderName || '';
    return instance;
  }
}
