/**
 * ChallengeParameters
 * @category Model
 */
export class ChallengeParameters {
  parameters: Record<string, any> = {};

  constructor() {
    this.parameters = {};
  }

  static fromObject(data: any = {}): ChallengeParameters {
    const instance = new ChallengeParameters();
    instance.parameters = data || {};
    return instance;
  }
}
