/**
 * Address
 * @category Model
 */
export class Address {
  addressStreet1: string = '';
  addressStreet2: string = '';
  addressStreet3: string = '';
  city: string = '';
  country: string = '';
  firstName: string = '';
  lastName: string = '';
  postalCode: string = '';
  state: string = '';

  constructor() {
    this.addressStreet1 = '';
    this.addressStreet2 = '';
    this.addressStreet3 = '';
    this.city = '';
    this.country = '';
    this.firstName = '';
    this.lastName = '';
    this.postalCode = '';
    this.state = '';
  }

  static fromObject(data: any = {}): Address {
    const instance = new Address();
    instance.addressStreet1 = data.addressStreet1 || '';
    instance.addressStreet2 = data.addressStreet2 || '';
    instance.addressStreet3 = data.addressStreet3 || '';
    instance.city = data.city || '';
    instance.country = data.country || '';
    instance.firstName = data.firstName || '';
    instance.lastName = data.lastName || '';
    instance.postalCode = data.postalCode || '';
    instance.state = data.state || '';
    return instance;
  }
}
