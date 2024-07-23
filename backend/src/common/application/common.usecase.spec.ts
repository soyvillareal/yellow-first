import { CommonUseCase } from './common.usecase';
import { Request } from 'express';
import crypto from 'crypto';

describe('CommonUseCase', () => {
  const mockConfigRepository = {
    get: jest.fn((key: string) => {
      const env = {
        'config.integrity_key': 'test_integrity_key',
        'config.events_key': 'test_events_key',
      };
      return env[key];
    }),
  };

  let commonUseCase: CommonUseCase;

  beforeEach(() => {
    commonUseCase = new CommonUseCase(mockConfigRepository as any);
    jest.clearAllMocks();
  });

  describe('getSkipped', () => {
    it('should calculate skipped items correctly', () => {
      expect(commonUseCase.getSkipped(1, 10)).toBe(0);
      expect(commonUseCase.getSkipped(2, 10)).toBe(10);
      expect(commonUseCase.getSkipped(3, 10)).toBe(20);
    });
  });

  describe('pageMeta', () => {
    it('should generate correct page metadata', () => {
      const data = [1, 2, 3];
      const meta = {
        itemCount: 100,
        pageOptions: {
          page: 2,
          limit: 10,
        },
      };
      const result = commonUseCase.pageMeta(data, meta);
      expect(result).toEqual({
        content: data,
        meta: {
          page: 2,
          limit: 10,
          itemCount: 100,
          pageCount: 10,
          hasPreviousPage: true,
          hasNextPage: true,
        },
      });
    });
  });

  describe('extractJWTToken', () => {
    it('should extract token from Request', () => {
      const req = { headers: { authorization: 'Bearer token123' } } as Request;
      expect(commonUseCase.extractJWTToken(req)).toBe('token123');
    });

    it('should extract token from string', () => {
      const token = 'Bearer token123';
      expect(commonUseCase.extractJWTToken(token)).toBe('token123');
    });

    it('should return empty string if undefined', () => {
      expect(commonUseCase.extractJWTToken(undefined)).toBe('');
    });
  });

  describe('indexBy', () => {
    it('should index array by given key', () => {
      const array = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = commonUseCase.indexBy(array, 'id');
      expect(result).toEqual({
        1: { id: 1, name: 'Alice' },
        2: { id: 2, name: 'Bob' },
      });
    });
  });

  describe('generateSignature', () => {
    it('should generate SHA-256 signature', () => {
      const payload = {
        reference: 'ref123',
        amountInCents: 1000,
        currency: 'USD',
      };
      const hash = crypto.createHash('sha256').update('ref1231000USDtest_integrity_key').digest('hex');
      expect(commonUseCase.generateSignature(payload)).toBe(hash);
    });
  });

  describe('verifySignature', () => {
    it('should verify signature correctly', () => {
      const payload = {
        transaction: {
          id: 'txn123',
          status: 'COMPLETED',
          amountInCents: 1000,
        },
        timestamp: 1234567890,
      };
      const signature = crypto.createHash('sha256').update('txn123COMPLETED10001234567890test_events_key').digest('hex');
      expect(commonUseCase.verifySignature(signature, payload)).toBe(true);
      expect(commonUseCase.verifySignature('wrong_signature', payload)).toBe(false);
    });
  });

  describe('calculateRate', () => {
    it('should calculate rate correctly', () => {
      const config = {
        fixedRate: 5,
        variablePercentage: 10,
      };
      const amount = 1000;
      const result = commonUseCase.calculateRate(config, amount);
      expect(result).toBe(11050);
    });

    it('should handle zero rates correctly', () => {
      const config = {
        fixedRate: 0,
        variablePercentage: 0,
      };
      const amount = 1000;
      const result = commonUseCase.calculateRate(config, amount);
      expect(result).toBe(1000);
    });
  });
});
