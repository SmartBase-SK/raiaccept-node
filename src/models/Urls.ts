/**
 * Urls
 * @category Model
 */
export class Urls {
  cancelUrl: string = '';
  failUrl: string = '';
  successUrl: string = '';
  notificationUrl: string | null = null;

  constructor() {
    this.cancelUrl = '';
    this.failUrl = '';
    this.successUrl = '';
    this.notificationUrl = null;
  }

  static fromObject(data: any = {}): Urls {
    const instance = new Urls();
    instance.cancelUrl = data.cancelUrl || '';
    instance.failUrl = data.failUrl || '';
    instance.successUrl = data.successUrl || '';
    instance.notificationUrl = data.notificationUrl || null;
    return instance;
  }
}
