/**
 * ApiException
 * Custom exception class for API errors
 */
export class ApiException extends Error {
  public readonly statusCode: number | null;
  public readonly headers: Record<string, any> | null;
  public readonly body: string | null;
  public responseObject: any = null;

  constructor(
    message: string,
    statusCode: number | null = null,
    headers: Record<string, any> | null = null,
    body: string | null = null
  ) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    this.responseObject = null;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiException);
    }
  }

  getCode(): number | null {
    return this.statusCode;
  }

  getResponseHeaders(): Record<string, any> | null {
    return this.headers;
  }

  getResponseBody(): string | null {
    return this.body;
  }

  setResponseObject(responseObject: any): void {
    this.responseObject = responseObject;
  }

  getResponseObject(): any {
    return this.responseObject;
  }
}
