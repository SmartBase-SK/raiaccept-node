import { ApiException } from '../exceptions/ApiException.js';
import { InvalidArgumentException } from '../exceptions/InvalidArgumentException.js';
import { ObjectSerializer } from '../utils/ObjectSerializer.js';
import { AuthApiLoginOutput } from '../models/AuthApiLoginOutput.js';
import { AuthApiLoginInput } from '../models/AuthApiLoginInput.js';
import { AuthApiLogoutInput } from '../models/AuthApiLogoutInput.js';
import { CreateOrderEntryResponse } from '../models/CreateOrderEntryResponse.js';
import { CreatePaymentSessionResponse } from '../models/CreatePaymentSessionResponse.js';
import { GetOrderDetailsResponse } from '../models/GetOrderDetailsResponse.js';
import { GetOrderTransactionsResponse } from '../models/GetOrderTransactionsResponse.js';
import { GetTransactionDetailsResponse } from '../models/GetTransactionDetailsResponse.js';
import { RefundResponse } from '../models/RefundResponse.js';
import { ErrorResponse } from '../models/ErrorResponse.js';
import { HttpClient, HttpRequest, HttpResponse } from '../HttpClient.js';
import { CreateOrderEntryRequest } from '../models/CreateOrderEntryRequest.js';

export interface ApiResponse<T> {
  object: T | null;
  response: HttpResponse;
}

/**
 * RaiAcceptAPIApi
 * Main API client for RaiAccept payment gateway
 */
export class RaiAcceptAPIApi {
  static AUTH_URL = 'https://api.test.raiaccept.com';
  static API_URL = 'https://trapi.raiaccept.com';

  static ACCEPTED_LANGUAGES = [
    'en', 'de', 'fr', 'cs', 'sk', 'sr', 'al', 'ro', 'pl', 'hr'
  ];

  private client: HttpClient;

  constructor(client: HttpClient | null = null) {
    this.client = client || new HttpClient();
  }

  getAcceptedLanguages(): string[] {
    return RaiAcceptAPIApi.ACCEPTED_LANGUAGES;
  }

  /**
   * Process API request
   * @param request - Request configuration
   * @param targetClass - Target model class for response
   * @param errorClass - Error model class
   * @param omitLogging - Whether to omit logging
   * @returns Response with object and raw response
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
      if (error instanceof ApiException) {
        if (error.getCode() === 400 && errorClass) {
          const data = ObjectSerializer.deserialize(
            JSON.parse(error.getResponseBody() || '{}'),
            errorClass
          );
          error.setResponseObject(data);
        }
      }
      throw error;
    }
  }


  /**
   * Authenticate with username and password
   * @param username - Username
   * @param password - Password
   * @param cert - Client certificate for mTLS
   * @param key - Client private key for mTLS
   * @returns Authentication response
   */
  async token(
    username: string,
    password: string,
    cert: string | Buffer,
    key: string | Buffer
  ): Promise<ApiResponse<AuthApiLoginOutput>> {
    const request = this.tokenRequest(username, password, cert, key);

    return this.processRequest<AuthApiLoginOutput>(request, AuthApiLoginOutput, ErrorResponse, true);
  }

  /**
   * Create token request
   * @param username - Username
   * @param password - Password
   * @param cert - Client certificate for mTLS
   * @param key - Client private key for mTLS
   * @returns Request object
   */
  tokenRequest(
    username: string,
    password: string,
    cert: string | Buffer,
    key: string | Buffer
  ): HttpRequest {
    if (!username) {
      throw new InvalidArgumentException('Missing the required parameter $username when calling tokenRequest');
    }
    if (!password) {
      throw new InvalidArgumentException('Missing the required parameter $password when calling tokenRequest');
    }
    if (!cert) {
      throw new InvalidArgumentException('Missing the required parameter $cert when calling tokenRequest');
    }
    if (!key) {
      throw new InvalidArgumentException('Missing the required parameter $key when calling tokenRequest');
    }

    const loginInput = new AuthApiLoginInput();
    loginInput.username = username;
    loginInput.password = password;

    const httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(loginInput));
    const headers = {
      'Content-Type': 'application/json',
    };

    const request: HttpRequest = {
      method: 'POST',
      url: `${RaiAcceptAPIApi.AUTH_URL}/auth/api/login`,
      headers: headers,
      body: httpBody,
      cert: cert,
      key: key,
    } as HttpRequest;

    return request;
  }

  /**
   * Logout with token
   * @param token - Token to logout
   * @param cert - Client certificate for mTLS
   * @param key - Client private key for mTLS
   * @returns True if logout successful (HTTP 200), false otherwise
   */
  async tokenLogout(
    token: string,
    cert: string | Buffer,
    key: string | Buffer
  ): Promise<boolean> {
    const request = this.tokenLogoutRequest(token, cert, key);

    try {
      const response = await this.client.send(request, true);
      const statusCode = response.getStatusCode();
      return statusCode === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create token logout request
   * @param token - Token to logout
   * @param cert - Client certificate for mTLS
   * @param key - Client private key for mTLS
   * @returns Request object
   */
  tokenLogoutRequest(
    token: string,
    cert: string | Buffer,
    key: string | Buffer
  ): HttpRequest {
    if (!token) {
      throw new InvalidArgumentException('Missing the required parameter $token when calling tokenLogoutRequest');
    }
    if (!cert) {
      throw new InvalidArgumentException('Missing the required parameter $cert when calling tokenLogoutRequest');
    }
    if (!key) {
      throw new InvalidArgumentException('Missing the required parameter $key when calling tokenLogoutRequest');
    }

    const logoutInput = new AuthApiLogoutInput();
    logoutInput.refreshToken = token;

    const httpBody = JSON.stringify(ObjectSerializer.sanitizeForSerialization(logoutInput));
    const headers = {
      'Content-Type': 'application/json',
    };

    const request: HttpRequest = {
      method: 'POST',
      url: `${RaiAcceptAPIApi.AUTH_URL}/auth/api/logout`,
      headers: headers,
      body: httpBody,
      cert: cert,
      key: key,
    } as HttpRequest;

    return request;
  }

  /**
   * Create order entry
   * @param accessToken - Access token
   * @param createOrderRequest - Order request object
   * @returns Order response
   */
  async createOrderEntry(
    accessToken: string,
    createOrderRequest: CreateOrderEntryRequest
  ): Promise<ApiResponse<CreateOrderEntryResponse>> {
    const request = this.createOrderEntryRequest(accessToken, createOrderRequest);
    return this.processRequest<CreateOrderEntryResponse>(request, CreateOrderEntryResponse, ErrorResponse);
  }

  /**
   * Create order entry request
   * @param accessToken - Access token
   * @param createOrderRequest - Order request object
   * @returns Request object
   */
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
      url: RaiAcceptAPIApi.API_URL + resourcePath,
      headers: headers,
      body: httpBody,
    };
  }

  /**
   * Create payment session
   * @param accessToken - Access token
   * @param paymentSessionRequest - Payment session request
   * @param externalOrderId - External order ID
   * @returns Payment session response
   */
  async createPaymentSession(
    accessToken: string,
    paymentSessionRequest: CreateOrderEntryRequest,
    externalOrderId: string
  ): Promise<ApiResponse<CreatePaymentSessionResponse>> {
    const request = this.createPaymentSessionRequest(accessToken, paymentSessionRequest, externalOrderId);
    return this.processRequest<CreatePaymentSessionResponse>(request, CreatePaymentSessionResponse, ErrorResponse);
  }

  /**
   * Create payment session request
   * @param accessToken - Access token
   * @param paymentSessionRequest - Payment session request
   * @param externalOrderId - External order ID
   * @returns Request object
   */
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

    const resourcePath = `${RaiAcceptAPIApi.API_URL}/orders/${externalOrderId}/checkout`;
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
    };
  }

  /**
   * Get order details
   * @param accessToken - Access token
   * @param paymentId - Payment ID
   * @returns Order details response
   */
  async getOrderDetails(
    accessToken: string,
    paymentId: string
  ): Promise<ApiResponse<GetOrderDetailsResponse>> {
    const request = this.getOrderDetailsRequest(accessToken, paymentId);
    return this.processRequest<GetOrderDetailsResponse>(request, GetOrderDetailsResponse, ErrorResponse);
  }

  /**
   * Create get order details request
   * @param accessToken - Access token
   * @param paymentId - Payment ID
   * @returns Request object
   */
  getOrderDetailsRequest(accessToken: string, paymentId: string): HttpRequest {
    if (!paymentId) {
      throw new InvalidArgumentException('Missing the required parameter $paymentId when calling getOrderDetailsRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getOrderDetailsRequest');
    }

    const encodedPaymentId = ObjectSerializer.toPathValue(paymentId);
    const resourcePath = `${RaiAcceptAPIApi.API_URL}/orders/${encodedPaymentId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
    };
  }

  /**
   * Get transaction details
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @returns Transaction details response
   */
  async getTransactionDetails(
    accessToken: string,
    orderId: string,
    transactionId: string
  ): Promise<ApiResponse<GetTransactionDetailsResponse>> {
    const request = this.getTransactionDetailsRequest(accessToken, orderId, transactionId);
    return this.processRequest<GetTransactionDetailsResponse>(request, GetTransactionDetailsResponse, ErrorResponse);
  }

  /**
   * Create get transaction details request
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @returns Request object
   */
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
    const resourcePath = `${RaiAcceptAPIApi.API_URL}/orders/${encodedOrderId}/transactions/${encodedTransactionId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
    };
  }

  /**
   * Get order transactions
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @returns Order transactions response
   */
  async getOrderTransactions(
    accessToken: string,
    orderId: string
  ): Promise<ApiResponse<GetOrderTransactionsResponse>> {
    const request = this.getOrderTransactionsRequest(accessToken, orderId);
    return this.processRequest<GetOrderTransactionsResponse>(request, GetOrderTransactionsResponse, ErrorResponse);
  }

  /**
   * Create get order transactions request
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @returns Request object
   */
  getOrderTransactionsRequest(accessToken: string, orderId: string): HttpRequest {
    if (!orderId) {
      throw new InvalidArgumentException('Missing the required parameter $orderId when calling getOrderTransactionsRequest');
    }
    if (!accessToken) {
      throw new InvalidArgumentException('Missing the required parameter $accessToken when calling getOrderTransactionsRequest');
    }

    const encodedOrderId = ObjectSerializer.toPathValue(orderId);
    const resourcePath = `${RaiAcceptAPIApi.API_URL}/orders/${encodedOrderId}/transactions`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return {
      method: 'GET',
      url: resourcePath,
      headers: headers,
    };
  }

  /**
   * Process refund
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @param requestObj - Refund request object
   * @returns Refund response
   */
  async refund(
    accessToken: string,
    orderId: string,
    transactionId: string,
    requestObj: any
  ): Promise<ApiResponse<RefundResponse>> {
    const request = this.getRefundRequest(accessToken, orderId, transactionId, requestObj);
    return this.processRequest<RefundResponse>(request, RefundResponse, ErrorResponse);
  }

  /**
   * Create refund request
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @param requestObj - Refund request object
   * @returns Request object
   */
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
    const resourcePath = `${RaiAcceptAPIApi.API_URL}/orders/${encodedOrderId}/transactions/${encodedTransactionId}/refund`;

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
    };
  }
}
