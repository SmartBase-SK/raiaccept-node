import { ApiException } from '../exceptions/ApiException.js';
import { InvalidArgumentException } from '../exceptions/InvalidArgumentException.js';
import { ObjectSerializer } from '../utils/ObjectSerializer.js';
import { AuthApiLoginOutput } from '../models/AuthApiLoginOutput.js';
import { AuthApiLoginInput, type IntegrationContext } from '../models/AuthApiLoginInput.js';
import { AuthApiLogoutInput } from '../models/AuthApiLogoutInput.js';
import { AuthApiRefreshInput } from '../models/AuthApiRefreshInput.js';
import { AuthApiRefreshOutput } from '../models/AuthApiRefreshOutput.js';
import { CreateOrderEntryResponse } from '../models/CreateOrderEntryResponse.js';
import { CreatePaymentSessionResponse } from '../models/CreatePaymentSessionResponse.js';
import { GetOrderDetailsResponse } from '../models/GetOrderDetailsResponse.js';
import { GetOrderTransactionsResponse } from '../models/GetOrderTransactionsResponse.js';
import { GetTransactionDetailsResponse } from '../models/GetTransactionDetailsResponse.js';
import { RefundResponse } from '../models/RefundResponse.js';
import { ErrorResponse } from '../models/ErrorResponse.js';
import { HttpClient, HttpRequest, HttpResponse } from '../HttpClient.js';
import { CreateOrderEntryRequest } from '../models/CreateOrderEntryRequest.js';
import {
  type AuthMode,
  type RaiAcceptClientConfig,
  RAIACCEPT_URLS,
  resolveAuthMode,
} from '../types/IntegrationMode.js';

export interface ApiResponse<T> {
  object: T | null;
  response: HttpResponse;
}

type TlsOptions = Pick<HttpRequest, 'cert' | 'key'>;

/**
 * RaiAcceptAPIApi
 * Main API client for RaiAccept payment gateway
 */
export class RaiAcceptAPIApi {
  /** @deprecated Use mode-specific URLs via authMode config. Partner auth URL. */
  static AUTH_URL = RAIACCEPT_URLS.partner.auth;
  /** @deprecated Use mode-specific URLs via authMode config. Partner API URL. */
  static API_URL = RAIACCEPT_URLS.partner.api;

  static ACCEPTED_LANGUAGES = [
    'en', 'de', 'fr', 'cs', 'sk', 'sr', 'al', 'ro', 'pl', 'hr'
  ];

  private client: HttpClient;
  private cert?: string | Buffer;
  private key?: string | Buffer;
  private authMode: AuthMode;

  /**
   * Create a new RaiAcceptAPIApi instance
   * @param client - HTTP client instance (optional)
   * @param cert - Client certificate for mTLS (required for partner mode)
   * @param key - Client private key for mTLS (required for partner mode)
   * @param config - Client configuration; authMode defaults to merchant, or partner when cert and key are both provided
   */
  constructor(
    client: HttpClient | null = null,
    cert?: string | Buffer,
    key?: string | Buffer,
    config?: RaiAcceptClientConfig
  ) {
    this.client = client || new HttpClient();
    this.cert = cert;
    this.key = key;
    this.authMode = resolveAuthMode(cert, key, config);
  }

  getAuthMode(): AuthMode {
    return this.authMode;
  }

  private get authBaseUrl(): string {
    return RAIACCEPT_URLS[this.authMode].auth;
  }

  private get apiBaseUrl(): string {
    return RAIACCEPT_URLS[this.authMode].api;
  }

  private requirePartnerTls(context: string): TlsOptions {
    if (this.authMode !== 'partner') {
      return {};
    }
    if (!this.cert) {
      throw new InvalidArgumentException(
        `Missing the required parameter $cert when calling ${context} (provide in constructor with authMode: 'partner')`
      );
    }
    if (!this.key) {
      throw new InvalidArgumentException(
        `Missing the required parameter $key when calling ${context} (provide in constructor with authMode: 'partner')`
      );
    }
    return { cert: this.cert, key: this.key };
  }

  getAcceptedLanguages(): string[] {
    return RaiAcceptAPIApi.ACCEPTED_LANGUAGES;
  }

  /**
   * Process API request
   */
  async processRequest<T>(
    request: HttpRequest,
    targetClass: any,
    errorClass: any = null,
    omitLogging: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.send(request, omitLogging);
      const statusCode = response.getStatusCode();

      if (statusCode < 200 || statusCode > 299) {
        throw new ApiException(
          `[${statusCode}] Error connecting to the API (${request.url})`,
          statusCode,
          response.getHeaders(),
          response.getBody()
        );
      }

      const body = JSON.parse(response.getBody());
      const deserializedContent = targetClass
        ? ObjectSerializer.deserialize<T>(body, targetClass)
        : null;

      return {
        object: deserializedContent,
        response: response,
      };
    } catch (error) {
      if (error instanceof ApiException && errorClass) {
        const statusCode = error.getCode();
        if (statusCode === 400 || statusCode === 401 || statusCode === 403) {
          try {
            const data = ObjectSerializer.deserialize(
              JSON.parse(error.getResponseBody() || '{}'),
              errorClass
            );
            error.setResponseObject(data);
          } catch {
            // Leave responseObject unset if body is not parseable
          }
        }
      }
      throw error;
    }
  }

  async token(
    username: string,
    password: string,
    integrationContext: IntegrationContext
  ): Promise<ApiResponse<AuthApiLoginOutput>> {
    const request = this.tokenRequest(username, password, integrationContext);
    return this.processRequest<AuthApiLoginOutput>(request, AuthApiLoginOutput, ErrorResponse, true);
  }

  tokenRequest(
    username: string,
    password: string,
    integrationContext: IntegrationContext
  ): HttpRequest {
    if (!username) {
      throw new InvalidArgumentException('Missing the required parameter $username when calling tokenRequest');
    }
    if (!password) {
      throw new InvalidArgumentException('Missing the required parameter $password when calling tokenRequest');
    }
    if (!integrationContext) {
      throw new InvalidArgumentException('Missing the required parameter $integrationContext when calling tokenRequest');
    }

    const loginInput = new AuthApiLoginInput();
    loginInput.username = username;
    loginInput.password = password;
    loginInput.integrationContext = integrationContext;

    const httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(loginInput));
    const headers = {
      'Content-Type': 'application/json',
    };

    return {
      method: 'POST',
      url: `${this.authBaseUrl}/auth/api/login`,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('token'),
    } as HttpRequest;
  }

  async tokenRefresh(
    refreshToken: string,
    integrationContext: IntegrationContext
  ): Promise<ApiResponse<AuthApiRefreshOutput>> {
    const request = this.tokenRefreshRequest(refreshToken, integrationContext);
    return this.processRequest<AuthApiRefreshOutput>(request, AuthApiRefreshOutput, ErrorResponse, true);
  }

  tokenRefreshRequest(
    refreshToken: string,
    integrationContext: IntegrationContext
  ): HttpRequest {
    if (!refreshToken) {
      throw new InvalidArgumentException('Missing the required parameter $refreshToken when calling tokenRefreshRequest');
    }
    if (!integrationContext) {
      throw new InvalidArgumentException('Missing the required parameter $integrationContext when calling tokenRefreshRequest');
    }

    const refreshInput = new AuthApiRefreshInput();
    refreshInput.refreshToken = refreshToken;
    refreshInput.integrationContext = integrationContext;

    const httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(refreshInput));
    const headers = {
      'Content-Type': 'application/json',
    };

    return {
      method: 'POST',
      url: `${this.authBaseUrl}/auth/api/refresh`,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('tokenRefresh'),
    } as HttpRequest;
  }

  async tokenLogout(token: string): Promise<boolean> {
    const request = this.tokenLogoutRequest(token);

    try {
      const response = await this.client.send(request, true);
      const statusCode = response.getStatusCode();
      return statusCode === 200;
    } catch (error) {
      return false;
    }
  }

  tokenLogoutRequest(token: string): HttpRequest {
    if (!token) {
      throw new InvalidArgumentException('Missing the required parameter $token when calling tokenLogoutRequest');
    }

    const logoutInput = new AuthApiLogoutInput();
    logoutInput.refreshToken = token;

    const httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(logoutInput));
    const headers = {
      'Content-Type': 'application/json',
    };

    return {
      method: 'POST',
      url: `${this.authBaseUrl}/auth/api/logout`,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('tokenLogout'),
    } as HttpRequest;
  }

  async createOrderEntry(
    accessToken: string,
    createOrderRequest: CreateOrderEntryRequest
  ): Promise<ApiResponse<CreateOrderEntryResponse>> {
    const request = this.createOrderEntryRequest(accessToken, createOrderRequest);
    return this.processRequest<CreateOrderEntryResponse>(request, CreateOrderEntryResponse, ErrorResponse);
  }

  createOrderEntryRequest(accessToken: string, createOrderRequest: CreateOrderEntryRequest): HttpRequest {
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling createOrderEntry');
    }
    if (!createOrderRequest) {
      throw new InvalidArgumentException('Missing the required parameter $createOrderRequest when calling createOrderEntry');
    }

    const resourcePath = '/orders';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    let httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(createOrderRequest));
    httpBody = httpBody.replace(/\\\\n/g, '\\n');

    return {
      method: 'POST',
      url: this.apiBaseUrl + resourcePath,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('createOrderEntry'),
    } as HttpRequest;
  }

  async createPaymentSession(
    accessToken: string,
    paymentSessionRequest: CreateOrderEntryRequest,
    externalOrderId: string
  ): Promise<ApiResponse<CreatePaymentSessionResponse>> {
    const request = this.createPaymentSessionRequest(accessToken, paymentSessionRequest, externalOrderId);
    return this.processRequest<CreatePaymentSessionResponse>(request, CreatePaymentSessionResponse, ErrorResponse);
  }

  createPaymentSessionRequest(
    accessToken: string,
    paymentSessionRequest: CreateOrderEntryRequest,
    externalOrderId: string
  ): HttpRequest {
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling createPaymentSession');
    }
    if (!externalOrderId) {
      throw new InvalidArgumentException('Missing the required parameter $externalOrderId when calling createPaymentSession');
    }
    if (!paymentSessionRequest) {
      throw new InvalidArgumentException('Missing the required parameter $paymentSessionRequest when calling createPaymentSession');
    }

    const resourcePath = `${this.apiBaseUrl}/orders/${externalOrderId}/checkout`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    let httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(paymentSessionRequest));
    httpBody = httpBody.replace(/\\\\n/g, '\\n');

    return {
      method: 'POST',
      url: resourcePath,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('createPaymentSession'),
    } as HttpRequest;
  }

  async getOrderDetails(
    accessToken: string,
    paymentId: string
  ): Promise<ApiResponse<GetOrderDetailsResponse>> {
    const request = this.getOrderDetailsRequest(accessToken, paymentId);
    return this.processRequest<GetOrderDetailsResponse>(request, GetOrderDetailsResponse, ErrorResponse);
  }

  getOrderDetailsRequest(accessToken: string, paymentId: string): HttpRequest {
    if (!paymentId) {
      throw new InvalidArgumentException('Missing the required parameter $paymentId when calling getOrderDetailsRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getOrderDetailsRequest');
    }

    const encodedPaymentId = ObjectSerializer.toPathValue(paymentId);
    const resourcePath = `${this.apiBaseUrl}/orders/${encodedPaymentId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
      ...this.requirePartnerTls('getOrderDetails'),
    } as HttpRequest;
  }

  async getTransactionDetails(
    accessToken: string,
    orderId: string,
    transactionId: string
  ): Promise<ApiResponse<GetTransactionDetailsResponse>> {
    const request = this.getTransactionDetailsRequest(accessToken, orderId, transactionId);
    return this.processRequest<GetTransactionDetailsResponse>(request, GetTransactionDetailsResponse, ErrorResponse);
  }

  getTransactionDetailsRequest(accessToken: string, orderId: string, transactionId: string): HttpRequest {
    if (!orderId) {
      throw new InvalidArgumentException('Missing the required parameter $orderId when calling getTransactionDetailsRequest');
    }
    if (!transactionId) {
      throw new InvalidArgumentException('Missing the required parameter $transactionId when calling getTransactionDetailsRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getTransactionDetailsRequest');
    }

    const encodedOrderId = ObjectSerializer.toPathValue(orderId);
    const encodedTransactionId = ObjectSerializer.toPathValue(transactionId);
    const resourcePath = `${this.apiBaseUrl}/orders/${encodedOrderId}/transactions/${encodedTransactionId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
      ...this.requirePartnerTls('getTransactionDetails'),
    } as HttpRequest;
  }

  async getOrderTransactions(
    accessToken: string,
    orderId: string
  ): Promise<ApiResponse<GetOrderTransactionsResponse>> {
    const request = this.getOrderTransactionsRequest(accessToken, orderId);
    return this.processRequest<GetOrderTransactionsResponse>(request, GetOrderTransactionsResponse, ErrorResponse);
  }

  getOrderTransactionsRequest(accessToken: string, orderId: string): HttpRequest {
    if (!orderId) {
      throw new InvalidArgumentException('Missing the required parameter $orderId when calling getOrderTransactionsRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getOrderTransactionsRequest');
    }

    const encodedOrderId = ObjectSerializer.toPathValue(orderId);
    const resourcePath = `${this.apiBaseUrl}/orders/${encodedOrderId}/transactions`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
      ...this.requirePartnerTls('getOrderTransactions'),
    } as HttpRequest;
  }

  async refund(
    accessToken: string,
    orderId: string,
    transactionId: string,
    requestObj: any
  ): Promise<ApiResponse<RefundResponse>> {
    const request = this.getRefundRequest(accessToken, orderId, transactionId, requestObj);
    return this.processRequest<RefundResponse>(request, RefundResponse, ErrorResponse);
  }

  getRefundRequest(accessToken: string, orderId: string, transactionId: string, requestObj: any): HttpRequest {
    if (!orderId) {
      throw new InvalidArgumentException('Missing the required parameter $orderId when calling getRefundRequest');
    }
    if (!transactionId) {
      throw new InvalidArgumentException('Missing the required parameter $transactionId when calling getRefundRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getRefundRequest');
    }
    if (!requestObj) {
      throw new InvalidArgumentException('Missing the required parameter $requestObj when calling getRefundRequest');
    }

    const encodedOrderId = ObjectSerializer.toPathValue(orderId);
    const encodedTransactionId = ObjectSerializer.toPathValue(transactionId);
    const resourcePath = `${this.apiBaseUrl}/orders/${encodedOrderId}/transactions/${encodedTransactionId}/refund`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    let httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(requestObj));
    httpBody = httpBody.replace(/\\\\n/g, '\\n');

    return {
      method: 'POST',
      url: resourcePath,
      headers: headers,
      body: httpBody,
      ...this.requirePartnerTls('refund'),
    } as HttpRequest;
  }
}
