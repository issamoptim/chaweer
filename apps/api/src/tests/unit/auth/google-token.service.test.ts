import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('jose', () => ({
  createRemoteJWKSet: vi.fn(() => ({})),
  jwtVerify: vi.fn(),
}));

vi.mock('../../../core/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

const { exchangeCodeForTokens, verifyGoogleIdToken } = await import(
  '../../../modules/auth/google/google-token.service'
);
const { jwtVerify } = await import('jose');

const mockGoogleTokenResponse = {
  access_token: 'ya29.a0mock',
  id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Im1vY2sta2V5In0.mock-id-token',
  expires_in: 3599,
  token_type: 'Bearer',
  scope: 'openid profile email',
};

const mockValidPayload = {
  sub: 'google-sub-123',
  email: 'user@gmail.com',
  email_verified: true,
  given_name: 'John',
  family_name: 'Doe',
  picture: 'https://lh3.googleusercontent.com/photo.jpg',
  iss: 'https://accounts.google.com',
  aud: 'test-google-client-id',
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
};

describe('google-token.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exchangeCodeForTokens', () => {
    it('should return tokens on successful exchange', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGoogleTokenResponse,
      }));

      const result = await exchangeCodeForTokens('valid-code', 'valid-verifier');

      expect(result.id_token).toBe(mockGoogleTokenResponse.id_token);
      expect(result.access_token).toBe(mockGoogleTokenResponse.access_token);
    });

    it('should throw GoogleAuthFailedError when Google returns 400', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => '{"error":"invalid_grant"}',
      }));

      await expect(
        exchangeCodeForTokens('invalid-code', 'valid-verifier'),
      ).rejects.toThrow('Échec de l\'authentification Google.');
    });

    it('should throw GoogleAuthFailedError on network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(
        exchangeCodeForTokens('valid-code', 'valid-verifier'),
      ).rejects.toThrow('Échec de l\'authentification Google.');
    });
  });

  describe('verifyGoogleIdToken', () => {
    it('should return parsed claims for a valid token', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({ payload: mockValidPayload, protectedHeader: {} } as never);

      const claims = await verifyGoogleIdToken('valid-id-token');

      expect(claims.sub).toBe('google-sub-123');
      expect(claims.email).toBe('user@gmail.com');
      expect(claims.emailVerified).toBe(true);
      expect(claims.givenName).toBe('John');
      expect(claims.familyName).toBe('Doe');
      expect(claims.picture).toBe('https://lh3.googleusercontent.com/photo.jpg');
    });

    it('should throw InvalidGoogleTokenError when jwtVerify fails (wrong issuer)', async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error('issuer mismatch'));

      await expect(verifyGoogleIdToken('bad-issuer-token')).rejects.toThrow(
        'Token Google invalide.',
      );
    });

    it('should throw InvalidGoogleTokenError when jwtVerify fails (wrong audience)', async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error('audience mismatch'));

      await expect(verifyGoogleIdToken('bad-audience-token')).rejects.toThrow(
        'Token Google invalide.',
      );
    });

    it('should throw InvalidGoogleTokenError when jwtVerify fails (expired token)', async () => {
      vi.mocked(jwtVerify).mockRejectedValue(new Error('token expired'));

      await expect(verifyGoogleIdToken('expired-token')).rejects.toThrow(
        'Token Google invalide.',
      );
    });

    it('should throw GoogleAccountNotVerifiedError when email_verified is false', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { ...mockValidPayload, email_verified: false },
        protectedHeader: {},
      } as never);

      await expect(verifyGoogleIdToken('unverified-token')).rejects.toThrow(
        'Votre compte Google n\'est pas vérifié.',
      );
    });

    it('should throw InvalidGoogleTokenError when sub is missing', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { ...mockValidPayload, sub: undefined },
        protectedHeader: {},
      } as never);

      await expect(verifyGoogleIdToken('no-sub-token')).rejects.toThrow(
        'Token Google invalide.',
      );
    });

    it('should throw InvalidGoogleTokenError when email is missing', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { ...mockValidPayload, email: undefined },
        protectedHeader: {},
      } as never);

      await expect(verifyGoogleIdToken('no-email-token')).rejects.toThrow(
        'Token Google invalide.',
      );
    });

    it('should default givenName and familyName to empty strings when missing', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { ...mockValidPayload, given_name: undefined, family_name: undefined },
        protectedHeader: {},
      } as never);

      const claims = await verifyGoogleIdToken('valid-token');

      expect(claims.givenName).toBe('');
      expect(claims.familyName).toBe('');
    });

    it('should default picture to null when missing', async () => {
      vi.mocked(jwtVerify).mockResolvedValue({
        payload: { ...mockValidPayload, picture: undefined },
        protectedHeader: {},
      } as never);

      const claims = await verifyGoogleIdToken('valid-token');

      expect(claims.picture).toBeNull();
    });
  });
});
