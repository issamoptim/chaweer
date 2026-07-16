import { describe, it, expect } from 'vitest';
import {
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
} from '../../../modules/auth/services/refresh-token.service';

describe('refresh-token.service', () => {
  describe('generateRefreshToken', () => {
    it('should produce a base64url string', () => {
      const token = generateRefreshToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should produce different tokens on each call', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();
      expect(token1).not.toBe(token2);
    });

    it('should produce a token of reasonable length (86+ chars for 64 bytes)', () => {
      const token = generateRefreshToken();
      expect(token.length).toBeGreaterThanOrEqual(86);
    });
  });

  describe('hashRefreshToken', () => {
    it('should produce a SHA-256 hex digest', () => {
      const token = 'test-token-value';
      const hash = hashRefreshToken(token);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce a hash different from the raw token', () => {
      const token = generateRefreshToken();
      const hash = hashRefreshToken(token);
      expect(hash).not.toBe(token);
    });

    it('should produce the same hash for the same input', () => {
      const token = 'test-token-value';
      const hash1 = hashRefreshToken(token);
      const hash2 = hashRefreshToken(token);
      expect(hash1).toBe(hash2);
    });
  });

  describe('getRefreshTokenExpiry', () => {
    it('should return a date in the future', () => {
      const expiry = getRefreshTokenExpiry();
      expect(expiry.getTime()).toBeGreaterThan(Date.now());
    });

    it('should be approximately 30 days from now', () => {
      const expiry = getRefreshTokenExpiry();
      const expectedMs = 30 * 24 * 60 * 60 * 1000;
      const diff = expiry.getTime() - Date.now();
      expect(diff).toBeGreaterThan(expectedMs - 60 * 1000);
      expect(diff).toBeLessThan(expectedMs + 60 * 1000);
    });
  });
});
