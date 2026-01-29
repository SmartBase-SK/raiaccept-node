import { RaiAcceptAPIApi, ApiResponse } from './api/RaiAcceptAPIApi.js';
import { HttpClient } from './HttpClient.js';
import { CreateOrderEntryRequest } from './models/CreateOrderEntryRequest.js';
import { CreateOrderEntryResponse } from './models/CreateOrderEntryResponse.js';
import { CreatePaymentSessionResponse } from './models/CreatePaymentSessionResponse.js';
import { GetOrderDetailsResponse } from './models/GetOrderDetailsResponse.js';
import { GetOrderTransactionsResponse } from './models/GetOrderTransactionsResponse.js';
import { GetTransactionDetailsResponse } from './models/GetTransactionDetailsResponse.js';
import { RefundResponse } from './models/RefundResponse.js';
import { AuthResponse } from './models/AuthResponse.js';

/**
 * RaiAcceptService
 * SDK client for RaiAccept payment gateway
 * This is the main interface for interacting with the RaiAccept API
 */
export class RaiAcceptService {
  static STATUS_PENDING = 'PENDING';
  static STATUS_SUCCESS = 'SUCCESS';
  static STATUS_PAID = 'PAID';
  static STATUS_FAILED = 'FAILED';
  static STATUS_CANCELED = 'CANCELED';
  static STATUS_ABANDONED = 'ABANDONED';

  private apiClient: RaiAcceptAPIApi;

  /**
   * Create a new RaiAcceptService instance
   * @param httpClient - HTTP client instance (optional)
   */
  constructor(httpClient: HttpClient | null = null) {
    this.apiClient = new RaiAcceptAPIApi(httpClient);
  }

  /**
   * Transliteration map for non-Latin characters to Latin equivalents
   */
  static transliterationMap: Record<string, string> = {
    // Greek
    'Α': 'A', 'α': 'a', 'Β': 'B', 'β': 'b', 'Γ': 'G', 'γ': 'g', 'Δ': 'D', 'δ': 'd',
    'Ε': 'E', 'ε': 'e', 'Ζ': 'Z', 'ζ': 'z', 'Η': 'E', 'η': 'e', 'Θ': 'Th', 'θ': 'th',
    'Ι': 'I', 'ι': 'i', 'Κ': 'K', 'κ': 'k', 'Λ': 'L', 'λ': 'l', 'Μ': 'M', 'μ': 'm',
    'Ν': 'N', 'ν': 'n', 'Ξ': 'X', 'ξ': 'x', 'Ο': 'O', 'ο': 'o', 'Π': 'P', 'π': 'p',
    'Ρ': 'R', 'ρ': 'r', 'Σ': 'S', 'σ': 's', 'ς': 's', 'Τ': 'T', 'τ': 't', 'Υ': 'Y', 'υ': 'u',
    'Φ': 'Ph', 'φ': 'ph', 'Χ': 'Ch', 'χ': 'ch', 'Ψ': 'Ps', 'ψ': 'ps', 'Ω': 'O', 'ω': 'o',

    // Arabic (basic mapping for common names)
    'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd',
    'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
    'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ء': '', 'آ': 'a', 'أ': 'a', 'إ': 'i',
    'ى': 'a', 'ة': 'h',

    // Hebrew
    'א': '', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'ch',
    'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n',
    'ן': 'n', 'ס': 's', 'ע': '', 'פ': 'p', 'ף': 'p', 'צ': 'ts', 'ץ': 'ts', 'ק': 'k',
    'ר': 'r', 'ש': 'sh', 'ת': 't',

    // Cyrillic
    'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
    'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'E', 'ё': 'e', 'Ж': 'Z', 'ж': 'z',
    'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'J', 'й': 'j', 'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'H', 'х': 'h', 'Ц': 'C', 'ц': 'c',
    'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'Ъ': '', 'ъ': '',
    'Ы': 'Y', 'ы': 'y', 'Ь': '', 'ь': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
    'Я': 'Ya', 'я': 'ya',

    // Ukrainian
    'Є': 'Ye', 'є': 'ye', 'І': 'I', 'і': 'i', 'Ї': 'Yi', 'ї': 'yi', 'Ґ': 'G', 'ґ': 'g',

    // Belarusian
    'Ў': 'U', 'ў': 'u',

    // Serbian / Macedonian extras
    'Ђ': 'Dj', 'ђ': 'dj', 'Љ': 'Lj', 'љ': 'lj', 'Њ': 'Nj', 'њ': 'nj', 'Ћ': 'C', 'ћ': 'c',
    'Џ': 'Dz', 'џ': 'dz',
  };

  /**
   * Transliterate non-Latin characters to Latin equivalents
   * @param string - String to transliterate
   * @returns Transliterated string
   */
  static transliterate(string: string | null | undefined): string | null | undefined {
    if (string === null) return null;
    if (string === undefined) return undefined;
    if (!string) return '';

    // Try using Intl.Transliterator if available (not widely supported yet)
    // Fall back to manual transliteration
    string = this.transliterateNonLatinFallback(string);

    // Replace problematic characters with spaces (preserve string structure)
    // Using character ranges for better compatibility (avoids Unicode property escapes)
    // Matches: a-z, A-Z, 0-9, spaces, and common punctuation
    string = string.replace(/[^a-zA-Z0-9\s.,\-'!\/@_]/g, ' ');

    // Normalize whitespace
    string = string.replace(/\s+/g, ' ');

    return string.trim();
  }

  /**
   * Fallback transliteration using character map
   * @param s - String to transliterate
   * @returns Transliterated string
   */
  static transliterateNonLatinFallback(s: string): string {
    if (!s) return s;

    // Early return for strings that only contain Latin characters and common punctuation
    // Matches: a-z, A-Z, 0-9, spaces, and common punctuation
    if (!/[^a-zA-Z0-9\s.,\-'\/@]/.test(s)) {
      return s;
    }

    let result = '';
    for (let char of s) {
      result += this.transliterationMap[char] || char;
    }
    return result;
  }

  /**
   * Transliterate and limit string length
   * @param string - String to process
   * @param limit - Maximum length (default 127)
   * @returns Processed string or null if empty
   */
  static transliterateAndLimitLength(string: string | null | undefined, limit: number = 127): string | null {
    if (!string) return null;

    const transliterated = this.transliterate(string);
    if (!transliterated) return null;

    let result = transliterated;

    if (result.length > limit) {
      result = result.substring(0, limit);
    }

    // Replace potentially problematic characters
    result = result.replace(/[&;<>|`\\]/g, ' ');

    return result === '' ? null : result;
  }

  /**
   * Clean phone number format
   * @param phoneNumber - Phone number to clean
   * @returns Cleaned phone number
   */
  static cleanPhoneNumber(phoneNumber: string | null | undefined): string | null {
    if (phoneNumber === null) return null;
    if (!phoneNumber) return '';

    // Remove all non-digit characters except leading +
    phoneNumber = phoneNumber.replace(/(?!\+)\D/g, '');

    // Keep only the first + and remove any others
    phoneNumber = phoneNumber.substring(0, 1) + phoneNumber.substring(1).replace(/\+/g, '');

    // Limit to 15 characters
    phoneNumber = phoneNumber.substring(0, 15);

    return phoneNumber;
  }

  /**
   * Retrieve access token with credentials
   * @param username - Username
   * @param password - Password
   * @returns Access token or null on error
   */
  async retrieveAccessTokenWithCredentials(username: string, password: string): Promise<string | null> {
    try {
      const response = await this.apiClient.token(username, password);
      if (!response || !response.object) {
        return null;
      }
      const responseObj = response.object;
      const accessToken = responseObj.getIdToken();
      return accessToken || null;
    } catch (error) {
      // Re-throw the error so the caller can handle it appropriately
      throw error;
    }
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
    return await this.apiClient.createOrderEntry(accessToken, createOrderRequest);
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
    return await this.apiClient.createPaymentSession(accessToken, paymentSessionRequest, externalOrderId);
  }

  /**
   * Get order transactions
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @returns Order transactions or null on error
   */
  async getOrderTransactions(
    accessToken: string,
    orderId: string
  ): Promise<ApiResponse<GetOrderTransactionsResponse> | null> {
    try {
      const result = await this.apiClient.getOrderTransactions(accessToken, orderId);
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get order details
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @returns Order details or null on error
   */
  async getOrderDetails(
    accessToken: string,
    orderId: string
  ): Promise<ApiResponse<GetOrderDetailsResponse> | null> {
    try {
      const result = await this.apiClient.getOrderDetails(accessToken, orderId);
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get transaction details
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @returns Transaction details or null on error
   */
  async getTransactionDetails(
    accessToken: string,
    orderId: string,
    transactionId: string
  ): Promise<ApiResponse<GetTransactionDetailsResponse> | null> {
    try {
      const result = await this.apiClient.getTransactionDetails(accessToken, orderId, transactionId);
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Process refund
   * @param accessToken - Access token
   * @param orderId - Order ID
   * @param transactionId - Transaction ID
   * @param requestObj - Refund request object
   * @returns Refund response or null on error
   */
  async refund(
    accessToken: string,
    orderId: string,
    transactionId: string,
    requestObj: any
  ): Promise<ApiResponse<RefundResponse> | null> {
    try {
      const result = await this.apiClient.refund(accessToken, orderId, transactionId, requestObj);
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get paid statuses
   * @returns Array of paid statuses
   */
  static getPaidStatuses(): string[] {
    return [
      this.STATUS_PAID,
      this.STATUS_SUCCESS,
    ];
  }

  /**
   * Get rejected statuses
   * @returns Array of rejected statuses
   */
  static getRejectedStatuses(): string[] {
    return [
      this.STATUS_FAILED,
      this.STATUS_CANCELED,
      this.STATUS_ABANDONED,
    ];
  }

  /**
   * Get cancelled statuses
   * @returns Array of cancelled statuses
   */
  static getCancelledStatuses(): string[] {
    return [
      this.STATUS_CANCELED,
      this.STATUS_ABANDONED,
    ];
  }

  /**
   * Get failed statuses
   * @returns Array of failed statuses
   */
  static getFailedStatuses(): string[] {
    return [
      this.STATUS_FAILED,
    ];
  }

  /**
   * Convert 2-letter country code to 3-letter ISO code
   * @param country - 2-letter country code
   * @returns 3-letter ISO country code
   */
  static getCountryIso3(country: string): string {
    const countries: Record<string, string> = {
      'AF': 'AFG', 'AX': 'ALA', 'AL': 'ALB', 'DZ': 'DZA', 'AS': 'ASM', 'AD': 'AND',
      'AO': 'AGO', 'AI': 'AIA', 'AQ': 'ATA', 'AG': 'ATG', 'AR': 'ARG', 'AM': 'ARM',
      'AW': 'ABW', 'AU': 'AUS', 'AT': 'AUT', 'AZ': 'AZE', 'BS': 'BHS', 'BH': 'BHR',
      'BD': 'BGD', 'BB': 'BRB', 'BY': 'BLR', 'BE': 'BEL', 'BZ': 'BLZ', 'BJ': 'BEN',
      'BM': 'BMU', 'BT': 'BTN', 'BO': 'BOL', 'BQ': 'BES', 'BA': 'BIH', 'BW': 'BWA',
      'BV': 'BVT', 'BR': 'BRA', 'IO': 'IOT', 'BN': 'BRN', 'BG': 'BGR', 'BF': 'BFA',
      'BI': 'BDI', 'KH': 'KHM', 'CM': 'CMR', 'CA': 'CAN', 'CV': 'CPV', 'KY': 'CYM',
      'CF': 'CAF', 'TD': 'TCD', 'CL': 'CHL', 'CN': 'CHN', 'CX': 'CXR', 'CC': 'CCK',
      'CO': 'COL', 'KM': 'COM', 'CG': 'COG', 'CD': 'COD', 'CK': 'COK', 'CR': 'CRI',
      'CI': 'CIV', 'HR': 'HRV', 'CU': 'CUB', 'CW': 'CUW', 'CY': 'CYP', 'CZ': 'CZE',
      'DK': 'DNK', 'DJ': 'DJI', 'DM': 'DMA', 'DO': 'DOM', 'EC': 'ECU', 'EG': 'EGY',
      'SV': 'SLV', 'GQ': 'GNQ', 'ER': 'ERI', 'EE': 'EST', 'ET': 'ETH', 'FK': 'FLK',
      'FO': 'FRO', 'FJ': 'FIJ', 'FI': 'FIN', 'FR': 'FRA', 'GF': 'GUF', 'PF': 'PYF',
      'TF': 'ATF', 'GA': 'GAB', 'GM': 'GMB', 'GE': 'GEO', 'DE': 'DEU', 'GH': 'GHA',
      'GI': 'GIB', 'GR': 'GRC', 'GL': 'GRL', 'GD': 'GRD', 'GP': 'GLP', 'GU': 'GUM',
      'GT': 'GTM', 'GG': 'GGY', 'GN': 'GIN', 'GW': 'GNB', 'GY': 'GUY', 'HT': 'HTI',
      'HM': 'HMD', 'VA': 'VAT', 'HN': 'HND', 'HK': 'HKG', 'HU': 'HUN', 'IS': 'ISL',
      'IN': 'IND', 'ID': 'IDN', 'IR': 'IRN', 'IQ': 'IRQ', 'IE': 'IRL', 'IM': 'IMN',
      'IL': 'ISR', 'IT': 'ITA', 'JM': 'JAM', 'JP': 'JPN', 'JE': 'JEY', 'JO': 'JOR',
      'KZ': 'KAZ', 'KE': 'KEN', 'KI': 'KIR', 'KP': 'PRK', 'KR': 'KOR', 'KW': 'KWT',
      'KG': 'KGZ', 'LA': 'LAO', 'LV': 'LVA', 'LB': 'LBN', 'LS': 'LSO', 'LR': 'LBR',
      'LY': 'LBY', 'LI': 'LIE', 'LT': 'LTU', 'LU': 'LUX', 'MO': 'MAC', 'MK': 'MKD',
      'MG': 'MDG', 'MW': 'MWI', 'MY': 'MYS', 'MV': 'MDV', 'ML': 'MLI', 'MT': 'MLT',
      'MH': 'MHL', 'MQ': 'MTQ', 'MR': 'MRT', 'MU': 'MUS', 'YT': 'MYT', 'MX': 'MEX',
      'FM': 'FSM', 'MD': 'MDA', 'MC': 'MCO', 'MN': 'MNG', 'ME': 'MNE', 'MS': 'MSR',
      'MA': 'MAR', 'MZ': 'MOZ', 'MM': 'MMR', 'NA': 'NAM', 'NR': 'NRU', 'NP': 'NPL',
      'NL': 'NLD', 'AN': 'ANT', 'NC': 'NCL', 'NZ': 'NZL', 'NI': 'NIC', 'NE': 'NER',
      'NG': 'NGA', 'NU': 'NIU', 'NF': 'NFK', 'MP': 'MNP', 'NO': 'NOR', 'OM': 'OMN',
      'PK': 'PAK', 'PW': 'PLW', 'PS': 'PSE', 'PA': 'PAN', 'PG': 'PNG', 'PY': 'PRY',
      'PE': 'PER', 'PH': 'PHL', 'PN': 'PCN', 'PL': 'POL', 'PT': 'PRT', 'PR': 'PRI',
      'QA': 'QAT', 'RE': 'REU', 'RO': 'ROU', 'RU': 'RUS', 'RW': 'RWA', 'BL': 'BLM',
      'SH': 'SHN', 'KN': 'KNA', 'LC': 'LCA', 'MF': 'MAF', 'SX': 'SXM', 'PM': 'SPM',
      'VC': 'VCT', 'WS': 'WSM', 'SM': 'SMR', 'ST': 'STP', 'SA': 'SAU', 'SN': 'SEN',
      'RS': 'SRB', 'SC': 'SYC', 'SL': 'SLE', 'SG': 'SGP', 'SK': 'SVK', 'SI': 'SVN',
      'SB': 'SLB', 'SO': 'SOM', 'ZA': 'ZAF', 'GS': 'SGS', 'SS': 'SSD', 'ES': 'ESP',
      'LK': 'LKA', 'SD': 'SDN', 'SR': 'SUR', 'SJ': 'SJM', 'SZ': 'SWZ', 'SE': 'SWE',
      'CH': 'CHE', 'SY': 'SYR', 'TW': 'TWN', 'TJ': 'TJK', 'TZ': 'TZA', 'TH': 'THA',
      'TL': 'TLS', 'TG': 'TGO', 'TK': 'TKL', 'TO': 'TON', 'TT': 'TTO', 'TN': 'TUN',
      'TR': 'TUR', 'TM': 'TKM', 'TC': 'TCA', 'TV': 'TUV', 'UG': 'UGA', 'UA': 'UKR',
      'AE': 'ARE', 'GB': 'GBR', 'US': 'USA', 'UM': 'UMI', 'UY': 'URY', 'UZ': 'UZB',
      'VU': 'VUT', 'VE': 'VEN', 'VN': 'VNM', 'VG': 'VGB', 'VI': 'VIR', 'WF': 'WLF',
      'EH': 'ESH', 'YE': 'YEM', 'ZM': 'ZMB', 'ZW': 'ZWE', 'XK': 'XKK',
    };

    return countries[country] || country;
  }
}
