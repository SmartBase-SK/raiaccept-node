/**
 * RaiAccept TypeScript SDK
 * Main entry point
 */

// Core API - Use RaiAcceptService as the unified client
export { RaiAcceptService } from './RaiAcceptService.js';
export { HttpClient, type Logger, type HttpClientConfig, type HttpRequest, type HttpResponse } from './HttpClient.js';
export { RaiAcceptLogger } from './RaiAcceptLogger.js';

// RaiAcceptAPIApi is exported for backward compatibility but deprecated
// Use RaiAcceptService instead for all API operations
export { RaiAcceptAPIApi, type ApiResponse } from './api/RaiAcceptAPIApi.js';

// Utilities
export { ObjectSerializer } from './utils/ObjectSerializer.js';

// Exceptions
export { ApiException } from './exceptions/ApiException.js';
export { InvalidArgumentException } from './exceptions/InvalidArgumentException.js';

// Models
export { Address } from './models/Address.js';
export { AuthenticationResult } from './models/AuthenticationResult.js';
export { AuthResponse } from './models/AuthResponse.js';
export { Card } from './models/Card.js';
export { ChallengeParameters } from './models/ChallengeParameters.js';
export { Consumer } from './models/Consumer.js';
export { CreateOrderEntryRequest } from './models/CreateOrderEntryRequest.js';
export { CreateOrderEntryResponse } from './models/CreateOrderEntryResponse.js';
export { CreatePaymentSessionResponse } from './models/CreatePaymentSessionResponse.js';
export { ErrorResponse } from './models/ErrorResponse.js';
export { GetOrderDetailsResponse } from './models/GetOrderDetailsResponse.js';
export { GetOrderTransactionsResponse } from './models/GetOrderTransactionsResponse.js';
export { GetTransactionDetailsResponse } from './models/GetTransactionDetailsResponse.js';
export { Invoice } from './models/Invoice.js';
export { InvoiceItem } from './models/InvoiceItem.js';
export { Merchant } from './models/Merchant.js';
export { NotificationWebhookRequest } from './models/NotificationWebhookRequest.js';
export { Recurring } from './models/Recurring.js';
export { RefundRequest } from './models/RefundRequest.js';
export { RefundResponse } from './models/RefundResponse.js';
export { Transaction } from './models/Transaction.js';
export { Urls } from './models/Urls.js';
