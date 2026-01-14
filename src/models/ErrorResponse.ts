/**
 * ErrorResponse
 * @category Model
 */
export class ErrorResponse {
  message: string = '';
  code: string = '';
  details: any = null;

  constructor() {
    this.message = '';
    this.code = '';
    this.details = null;
  }

  static fromObject(data: any = {}): ErrorResponse {
    const instance = new ErrorResponse();
    instance.message = data.message || '';
    instance.code = data.code || '';
    instance.details = data.details || null;
    return instance;
  }
}
