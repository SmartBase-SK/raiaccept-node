/**
 * Consumer
 * @category Model
 */
export class Consumer {
  email: string = '';
  firstName: string = '';
  ipAddress: string = '';
  lastName: string = '';
  mobilePhone: string = '';
  phone: string = '';
  workPhone: string = '';

  constructor() {
    this.email = '';
    this.firstName = '';
    this.ipAddress = '';
    this.lastName = '';
    this.mobilePhone = '';
    this.phone = '';
    this.workPhone = '';
  }

  static fromObject(data: any = {}): Consumer {
    const instance = new Consumer();
    instance.email = data.email || '';
    instance.firstName = data.firstName || '';
    instance.ipAddress = data.ipAddress || '';
    instance.lastName = data.lastName || '';
    instance.mobilePhone = data.mobilePhone || '';
    instance.phone = data.phone || '';
    instance.workPhone = data.workPhone || '';
    return instance;
  }
}
