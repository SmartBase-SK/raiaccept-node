/**
 * Integration context data for login
 */
export interface IntegrationContextData {
  name: string;
  version: string;
  vendor: string;
}

/**
 * Integration context for login
 */
export interface IntegrationContext {
  type: string;
  data: IntegrationContextData;
}

/**
 * AuthApiLoginInput
 * @category Model
 */
export class AuthApiLoginInput {
  username: string = '';
  password: string = '';
  integrationContext!: IntegrationContext;

  static fromObject(data: any = {}): AuthApiLoginInput {
    const instance = new AuthApiLoginInput();
    instance.username = data.username || '';
    instance.password = data.password || '';
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
