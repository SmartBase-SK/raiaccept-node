import type { IntegrationContext } from './AuthApiLoginInput.js';

/**
 * AuthApiRefreshInput
 * @category Model
 */
export class AuthApiRefreshInput {
  refreshToken: string = '';
  integrationContext!: IntegrationContext;

  static fromObject(data: any = {}): AuthApiRefreshInput {
    const instance = new AuthApiRefreshInput();
    instance.refreshToken = data.refreshToken || '';
    if (data.integrationContext) {
      instance.integrationContext = {
        type: data.integrationContext.type || 'CODE',
        data: {
          name: data.integrationContext.data?.name ?? '',
          version: data.integrationContext.data?.version ?? '',
          vendor: data.integrationContext.data?.vendor ?? '',
        },
      };
    }
    return instance;
  }
}
