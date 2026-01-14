import { CreateOrderEntryRequest } from './CreateOrderEntryRequest.js';

/**
 * GetOrderDetailsResponse
 * @category Model
 */
export class GetOrderDetailsResponse extends CreateOrderEntryRequest {
  status: string = '';

  constructor() {
    super();
    this.status = '';
  }

  static fromObject(data: any = {}): GetOrderDetailsResponse {
    const instance = Object.assign(new GetOrderDetailsResponse(), CreateOrderEntryRequest.fromObject(data));
    instance.status = data.status || '';
    return instance;
  }

  getStatus(): string {
    return this.status;
  }
}
