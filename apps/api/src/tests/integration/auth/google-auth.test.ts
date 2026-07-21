import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import request from 'supertest';

vi.mock('../../../modules/auth/google/google-token.service', () => ({
  exchangeCodeForTokens: vi.fn(),
  verifyGoogleIdToken: vi.fn(),
}));

const { app } = await import('../../../app');
const { prisma } = await import('../../../core/database/prisma');
const { cleanDatabase, createTestUser, createTestGoogleUser } = await import(
  '../../helpers/db-helper'
);
const { exchangeCodeForTokens, verifyGoogleIdToken } = await import(
  '../../../modules/auth/google/google-token.service'
);
const { GoogleAuthFailedError } = await import(
  '../../../shared/errors/auth-errors'
);

const mockGoogleClaims = {
  sub: 'google-sub-integration-123',
  email: 'google-integration@gmail.com',
  emailVerified: true,
  givenName: 'John',
  familyName: 'Doe',
  picture: 'https://lh3.googleusercontent.com/photo.jpg',
};

describe('POST /auth/google/* (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
    vi.clearAllMocks();
    vi.mocked(exchangeCodeForTokens).mockResolvedValue({
      id_token: 'mock-id-token',
      access_token: 'mock-access-token',
      expires_in: 3599,
      token_type: 'Bearer',
      scope: 'openid profile email',
    });
    vi.mocked(verifyGoogleIdToken).mockResolvedValue(mockGoogleClaims);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/google/client', () => {
    it('should create a new Google user and return accessToken + cookie', async () => {
      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe('google-integration@gmail.com');
      expect(response.body.data.user.role).toBe('CLIENT');
      expect(response.body.data.user.authProvider).toBe('GOOGLE');
      expect(response.headers['set-cookie']).toBeDefined();

      const dbUser = await prisma.user.findUnique({
        where: { email: 'google-integration@gmail.com' },
        include: { externalIdentities: true },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.authProvider).toBe('GOOGLE');
      expect(dbUser!.status).toBe('ACTIVE');
      expect(dbUser!.passwordHash).toBeNull();
      expect(dbUser!.externalIdentities).toHaveLength(1);
      expect(dbUser!.externalIdentities[0].provider).toBe('GOOGLE');
      expect(dbUser!.externalIdentities[0].providerUserId).toBe('google-sub-integration-123');
    });

    it('should assign PROFESSIONAL role via /auth/google/professional', async () => {
      const response = await request(app)
        .post('/auth/google/professional')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(200);
      expect(response.body.data.user.role).toBe('PROFESSIONAL');
    });

    it('should login existing Google user without creating duplicates', async () => {
      await createTestGoogleUser({
        email: 'google-integration@gmail.com',
        googleSub: 'google-sub-integration-123',
      });

      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe('google-integration@gmail.com');

      const users = await prisma.user.findMany({
        where: { email: 'google-integration@gmail.com' },
      });
      expect(users).toHaveLength(1);
    });

    it('should upgrade existing CLIENT to PROFESSIONAL via /google/professional', async () => {
      await createTestGoogleUser({
        email: 'google-integration@gmail.com',
        googleSub: 'google-sub-integration-123',
      });

      const response = await request(app)
        .post('/auth/google/professional')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(200);
      expect(response.body.data.user.role).toBe('PROFESSIONAL');

      const dbUser = await prisma.user.findUnique({
        where: { email: 'google-integration@gmail.com' },
        include: { professionalProfile: true },
      });
      expect(dbUser!.role).toBe('PROFESSIONAL');
      expect(dbUser!.professionalProfile).not.toBeNull();
      expect(dbUser!.professionalProfile!.status).toBe('DRAFT');
    });

    it('should not downgrade PROFESSIONAL to CLIENT via /google/client', async () => {
      await createTestGoogleUser({
        email: 'google-integration@gmail.com',
        googleSub: 'google-sub-integration-123',
        role: 'PROFESSIONAL',
      });

      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(200);
      expect(response.body.data.user.role).toBe('PROFESSIONAL');
    });

    it('should reject when email already used by LOCAL account', async () => {
      await createTestUser({
        email: 'google-integration@gmail.com',
        password: 'SecurePass123!',
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('PROVIDER_MISMATCH');
    });

    it('should return 401 when Google token exchange fails', async () => {
      vi.mocked(exchangeCodeForTokens).mockRejectedValue(
        new GoogleAuthFailedError(),
      );

      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'bad-code', codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('GOOGLE_AUTH_FAILED');
    });

    it('should validate request body — missing code', async () => {
      const response = await request(app)
        .post('/auth/google/client')
        .send({ codeVerifier: 'valid-verifier' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate request body — missing codeVerifier', async () => {
      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Refresh token flow for Google users', () => {
    it('should refresh token for Google user', async () => {
      const loginResponse = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      const cookies = loginResponse.headers['set-cookie'] as string[];
      const refreshTokenCookie = cookies.find((c) => c.startsWith('refresh_token='));

      const refreshResponse = await request(app)
        .post('/auth/refresh')
        .set('Cookie', refreshTokenCookie!);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.data.accessToken).toBeDefined();
      expect(refreshResponse.headers['set-cookie']).toBeDefined();
    });
  });

  describe('Logout flow for Google users', () => {
    it('should logout Google user and clear cookie', async () => {
      const loginResponse = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      const cookies = loginResponse.headers['set-cookie'] as string[];
      const refreshTokenCookie = cookies.find((c) => c.startsWith('refresh_token='));

      const logoutResponse = await request(app)
        .post('/auth/logout')
        .set('Cookie', refreshTokenCookie!);

      expect(logoutResponse.status).toBe(204);
    });
  });

  describe('Multiple sessions', () => {
    it('should create multiple refresh tokens for multiple logins', async () => {
      await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      const tokens = await prisma.refreshToken.findMany();
      expect(tokens.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Cookie attributes', () => {
    it('should set HttpOnly, SameSite, Path on cookie', async () => {
      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      const cookies = response.headers['set-cookie'] as string[];
      const refreshTokenCookie = cookies.find((c) => c.startsWith('refresh_token='));
      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie!).toContain('HttpOnly');
      expect(refreshTokenCookie!).toContain('SameSite');
      expect(refreshTokenCookie!).toContain('Path=');
    });
  });

  describe('Refresh token not in JSON response', () => {
    it('should not include refreshToken in response body', async () => {
      const response = await request(app)
        .post('/auth/google/client')
        .send({ code: 'valid-code', codeVerifier: 'valid-verifier' });

      expect(response.body.data.refreshToken).toBeUndefined();
    });
  });
});
