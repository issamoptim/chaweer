import { describe, it, expect } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../../../modules/auth/services/jwt.service';

describe('jwt.service', () => {
  describe('signAccessToken', () => {
    it('should produce a valid JWT with three parts', async () => {
      const token = await signAccessToken({ userId: 'user-123', role: 'CLIENT' });
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should use HS256 algorithm', async () => {
      const token = await signAccessToken({ userId: 'user-123', role: 'CLIENT' });
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
      expect(header.alg).toBe('HS256');
    });

    it('should not use "none" algorithm', async () => {
      const token = await signAccessToken({ userId: 'user-123', role: 'CLIENT' });
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
      expect(header.alg).not.toBe('none');
    });
  });

  describe('verifyAccessToken', () => {
    it('should accept a valid token and return payload', async () => {
      const token = await signAccessToken({ userId: 'user-123', role: 'CLIENT' });
      const payload = await verifyAccessToken(token);
      expect(payload.userId).toBe('user-123');
      expect(payload.role).toBe('CLIENT');
    });

    it('should reject a tampered token', async () => {
      const token = await signAccessToken({ userId: 'user-123', role: 'CLIENT' });
      const tampered = token.slice(0, -5) + 'XXXXX';
      await expect(verifyAccessToken(tampered)).rejects.toThrow();
    });

    it('should reject a token signed with a different secret', async () => {
      const { SignJWT } = await import('jose');
      const wrongSecret = new TextEncoder().encode('wrong-secret-at-least-32-characters-long!!');
      const token = await new SignJWT({ userId: 'user-123', role: 'CLIENT' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(wrongSecret);
      await expect(verifyAccessToken(token)).rejects.toThrow();
    });
  });
});
