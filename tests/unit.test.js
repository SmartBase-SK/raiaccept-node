import 'dotenv/config'
import { describe, it, expect, vi } from 'vitest'
import { RaiAcceptService } from '../src/RaiAcceptService.ts'
import { RefundRequest } from '../src/models/RefundRequest.ts'

describe('RaiAcceptService', () => {
  describe('transliterate()', () => {
    it('should transliterate Greek characters to Latin equivalents', () => {
      expect(RaiAcceptService.transliterate('Γεια σου κόσμε')).toBe('Geia sou k sme')
      expect(RaiAcceptService.transliterate('Αθήνα')).toBe('Ath na')
      expect(RaiAcceptService.transliterate('Μπάλα')).toBe('Mp la')
    })

    it('should transliterate Cyrillic characters', () => {
      expect(RaiAcceptService.transliterate('Привет мир')).toBe('Privet mir')
      expect(RaiAcceptService.transliterate('Москва')).toBe('Moskva')
    })

    it('should transliterate Arabic characters', () => {
      expect(RaiAcceptService.transliterate('مرحبا بالعالم')).toBe('mrhba balaalm')
    })

    it('should transliterate Hebrew characters', () => {
      expect(RaiAcceptService.transliterate('שלום עולם')).toBe('shlvm vlm')
    })

    it('should handle mixed scripts', () => {
      expect(RaiAcceptService.transliterate('Hello Γεια Привет')).toBe('Hello Geia Privet')
    })

    it('should preserve Latin characters and numbers', () => {
      expect(RaiAcceptService.transliterate('Hello World 123')).toBe('Hello World 123')
    })

    it('should handle empty strings and null values', () => {
      expect(RaiAcceptService.transliterate('')).toBe('')
      expect(RaiAcceptService.transliterate(null)).toBe(null)
      expect(RaiAcceptService.transliterate(undefined)).toBe(undefined)
    })

    it('should normalize whitespace', () => {
      expect(RaiAcceptService.transliterate('Γεια   σου')).toBe('Geia sou')
      expect(RaiAcceptService.transliterate('Γεια\nσου')).toBe('Geia sou')
    })

    it('should replace problematic characters with spaces', () => {
      expect(RaiAcceptService.transliterate('Test&;<>|`\\')).toBe('Test')
      expect(RaiAcceptService.transliterate('Hello-World_123')).toBe('Hello-World_123')
    })

    it('should handle special characters and punctuation', () => {
      expect(RaiAcceptService.transliterate('Γεια, σου!')).toBe('Geia, sou!')
      expect(RaiAcceptService.transliterate('Test@example.com')).toBe('Test@example.com')
    })
  })

  describe('transliterateNonLatinFallback()', () => {
    it('should perform basic character replacement', () => {
      expect(RaiAcceptService.transliterateNonLatinFallback('Γεια')).toBe('Geia')
      expect(RaiAcceptService.transliterateNonLatinFallback('Привет')).toBe('Privet')
      expect(RaiAcceptService.transliterateNonLatinFallback('Hello')).toBe('Hello')
    })

    it('should handle unmapped characters', () => {
      expect(RaiAcceptService.transliterateNonLatinFallback('Γεια123!@#')).toBe('Geia123!@#')
    })

    it('should handle empty and null inputs', () => {
      expect(RaiAcceptService.transliterateNonLatinFallback('')).toBe('')
      expect(RaiAcceptService.transliterateNonLatinFallback(null)).toBe(null)
      expect(RaiAcceptService.transliterateNonLatinFallback(undefined)).toBe(undefined)
    })

    it('should preserve Latin characters unchanged', () => {
      expect(RaiAcceptService.transliterateNonLatinFallback('Hello World 123')).toBe('Hello World 123')
    })
  })

  describe('transliterateAndLimitLength()', () => {
    it('should transliterate and limit length to default 127 chars', () => {
      const longText = 'α'.repeat(150) // 150 Greek alphas
      const result = RaiAcceptService.transliterateAndLimitLength(longText)
      expect(result).toBe('a'.repeat(127))
      expect(result.length).toBe(127)
    })

    it('should transliterate and limit to custom length', () => {
      const text = 'Γεια σου κόσμε'
      const result = RaiAcceptService.transliterateAndLimitLength(text, 10)
      expect(result.length).toBeLessThanOrEqual(10)
      expect(result).toBe('Geia sou k')
    })

    it('should handle null and empty inputs', () => {
      expect(RaiAcceptService.transliterateAndLimitLength(null)).toBe(null)
      expect(RaiAcceptService.transliterateAndLimitLength('')).toBe(null)
      expect(RaiAcceptService.transliterateAndLimitLength('   ')).toBe(null)
    })

    it('should remove problematic characters', () => {
      const result = RaiAcceptService.transliterateAndLimitLength('Test&;<>|`\\')
      expect(result).toBe('Test')
    })

    it('should return null for empty result after cleaning', () => {
      expect(RaiAcceptService.transliterateAndLimitLength('&;<>|`\\')).toBe(null)
    })
  })

  describe('cleanPhoneNumber()', () => {
    it('should clean basic phone formats', () => {
      expect(RaiAcceptService.cleanPhoneNumber('+1 (234) 567-8900')).toBe('+12345678900')
      expect(RaiAcceptService.cleanPhoneNumber('(234) 567-8900')).toBe('2345678900')
      expect(RaiAcceptService.cleanPhoneNumber('234-567-8900')).toBe('2345678900')
    })

    it('should preserve leading plus sign', () => {
      expect(RaiAcceptService.cleanPhoneNumber('+1234567890')).toBe('+1234567890')
      expect(RaiAcceptService.cleanPhoneNumber('+1 234 567 8900')).toBe('+12345678900')
    })

    it('should limit to 15 characters', () => {
      const longNumber = '+12345678901234567890'
      expect(RaiAcceptService.cleanPhoneNumber(longNumber)).toBe('+12345678901234')
      expect(RaiAcceptService.cleanPhoneNumber(longNumber).length).toBe(15)
    })

    it('should handle empty and null inputs', () => {
      expect(RaiAcceptService.cleanPhoneNumber('')).toBe('')
      expect(RaiAcceptService.cleanPhoneNumber(null)).toBe(null)
    })

    it('should remove multiple plus signs', () => {
      expect(RaiAcceptService.cleanPhoneNumber('++123++456')).toBe('+123456')
    })

    it('should handle international formats', () => {
      expect(RaiAcceptService.cleanPhoneNumber('+44 20 7946 0958')).toBe('+442079460958')
      expect(RaiAcceptService.cleanPhoneNumber('+91-9876543210')).toBe('+919876543210')
    })
  })

  describe('refund() - instance method', () => {
    let service, mockApiClient;

    beforeEach(() => {
      mockApiClient = {
        refund: vi.fn()
      };
      service = new RaiAcceptService();
      // Replace the apiClient with our mock after construction
      service.apiClient = mockApiClient;
    });

    it('should process refund successfully', async () => {
      const mockResponse = {
        object: {
          refundId: 'ref123',
          status: 'SUCCESS',
          amount: 50.00,
          currency: 'USD'
        }
      };
      const refundRequest = RefundRequest.fromObject({
        amount: 50.00,
        currency: 'USD'
      });

      mockApiClient.refund.mockResolvedValue(mockResponse);

      const result = await service.refund('test-token', 'order123', 'txn456', refundRequest);

      expect(mockApiClient.refund).toHaveBeenCalledWith('test-token', 'order123', 'txn456', refundRequest);
      expect(result).toBe(mockResponse);
    });

    it('should return null when API call fails', async () => {
      const refundRequest = RefundRequest.fromObject({
        amount: 25.00,
        currency: 'EUR'
      });

      mockApiClient.refund.mockRejectedValue(new Error('API Error'));

      const result = await service.refund('test-token', 'order123', 'txn456', refundRequest);

      expect(result).toBe(null);
      expect(mockApiClient.refund).toHaveBeenCalledWith('test-token', 'order123', 'txn456', refundRequest);
    });
  })
})