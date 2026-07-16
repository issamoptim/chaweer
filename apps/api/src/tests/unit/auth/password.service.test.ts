import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../../modules/auth/services/password.service';

describe('password.service', () => {
  describe('hashPassword', () => {
    it('should produce a valid Argon2id hash', async () => {
      const hash = await hashPassword('MySecurePass123!');
      expect(hash).toMatch(/^\$argon2id\$/);
    });

    it('should produce different hashes for the same password (unique salt)', async () => {
      const hash1 = await hashPassword('MySecurePass123!');
      const hash2 = await hashPassword('MySecurePass123!');
      expect(hash1).not.toBe(hash2);
    });

    it('should never return the plaintext password', async () => {
      const hash = await hashPassword('MySecurePass123!');
      expect(hash).not.toContain('MySecurePass123!');
    });
  });

  describe('verifyPassword', () => {
    it('should accept the correct password', async () => {
      const hash = await hashPassword('MySecurePass123!');
      const isValid = await verifyPassword(hash, 'MySecurePass123!');
      expect(isValid).toBe(true);
    });

    it('should reject a wrong password', async () => {
      const hash = await hashPassword('MySecurePass123!');
      const isValid = await verifyPassword(hash, 'WrongPass456!');
      expect(isValid).toBe(false);
    });

    it('should return false for a malformed hash', async () => {
      const isValid = await verifyPassword('not-a-valid-hash', 'MySecurePass123!');
      expect(isValid).toBe(false);
    });
  });
});
