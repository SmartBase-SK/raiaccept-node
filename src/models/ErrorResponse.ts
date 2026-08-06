/**
 * ErrorResponse
 * @category Model
 */
export class ErrorResponse {
  message: string = '';
  code: string = '';
  details: any = null;
  traceId: string = '';
  timestamp: string = '';
  status: string = '';
  errors: any[] = [];

  constructor() {
    this.message = '';
    this.code = '';
    this.details = null;
    this.traceId = '';
    this.timestamp = '';
    this.status = '';
    this.errors = [];
  }

  static fromObject(data: any = {}): ErrorResponse {
    const instance = new ErrorResponse();
    instance.message = data.message || '';
    instance.code = data.code || '';
    instance.details = data.details ?? null;
    instance.traceId = data.traceId || '';
    instance.timestamp = data.timestamp || '';
    instance.status = data.status || '';
    instance.errors = Array.isArray(data.errors) ? data.errors : [];
    return instance;
  }
}
