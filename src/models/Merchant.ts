/**
 * Merchant
 * @category Model
 */
export class Merchant {
  merchantAccountId: string = '';
  statementDescriptorShortVersion: string = '';

  constructor() {
    this.merchantAccountId = '';
    this.statementDescriptorShortVersion = '';
  }

  static fromObject(data: any = {}): Merchant {
    const instance = new Merchant();
    instance.merchantAccountId = data.merchantAccountId || '';
    instance.statementDescriptorShortVersion = data.statementDescriptorShortVersion || '';
    return instance;
  }
}
