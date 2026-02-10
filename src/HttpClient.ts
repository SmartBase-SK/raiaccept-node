import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';

export interface Logger {
  log(message: string, data?: any): void;
  error(message: string, error?: any): void;
}

export interface HttpClientConfig {
  logger?: Logger | null;
  [key: string]: any;
}

export interface HttpRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  cert?: string | Buffer;
  key?: string | Buffer;
}

export interface HttpResponse {
  getStatusCode(): number;
  getHeaders(): Record<string, any>;
  getBody(): string;
}

/**
 * HttpClient
 * HTTP client wrapper for making API requests
 */
export class HttpClient {
  private config: HttpClientConfig;
  private logger: Logger | null;

  constructor(config: HttpClientConfig = {}) {
    this.config = config;
    this.logger = config.logger || null;
  }

  /**
   * Send HTTP request
   * @param request - Request object with method, url, headers, and body
   * @param omitLogging - Whether to omit logging
   * @returns Response object
   */
  async send(request: HttpRequest, omitLogging: boolean = false): Promise<HttpResponse> {
    const axiosConfig: AxiosRequestConfig = {
      method: request.method as any,
      url: request.url,
      headers: request.headers || {},
      data: request.body,
      validateStatus: () => true, // Don't throw on any status
    };

    // Add mTLS certificate and key (required for authentication requests)
    if (request.cert && request.key) {
      const httpsAgent = new https.Agent({
        cert: request.cert,
        key: request.key,
      });
      axiosConfig.httpsAgent = httpsAgent;
    }

    if (this.logger && !omitLogging) {
      this.logger.log('Request:', this._sanitizeForLog(request));
    }

    try {
      const response: AxiosResponse = await axios(axiosConfig);

      if (this.logger && !omitLogging) {
        this.logger.log('Response:', {
          status: response.status,
          headers: response.headers,
          data: response.data,
        });
      }

      return {
        getStatusCode: () => response.status,
        getHeaders: () => response.headers,
        getBody: () => JSON.stringify(response.data),
      };
    } catch (error: any) {
      if (this.logger && !omitLogging) {
        this.logger.error('Request failed:', error.message);
      }
      throw error;
    }
  }

  /**
   * Sanitize request for logging (hide sensitive headers)
   * @param request - Request object
   * @returns Sanitized request
   */
  private _sanitizeForLog(request: HttpRequest): HttpRequest {
    const sanitized: HttpRequest = { ...request };
    if (sanitized.headers) {
      sanitized.headers = { ...sanitized.headers };
      if (sanitized.headers.Authorization) {
        sanitized.headers.Authorization = 'HIDDEN';
      }
    }
    return sanitized;
  }
}
