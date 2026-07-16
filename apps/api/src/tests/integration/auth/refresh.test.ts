import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';
import { generateRefreshToken, hashRefreshToken, getRefreshTokenExpiry } from '../../../modules/auth/services/refresh-token.service';

async function loginAndGetCookie(email: string, password: string): Promise<string> {
  const response = await request(app).post('/auth/login').send({ email, password });
  const cookies = response.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies[0] : (cookies as string);
}

async function extractCookieValue(cookieHeader: string): Promise<string> {
  const match = cookieHeader.match(/refresh_token=([^;]+)/);
  return match ? match[1] : '';
}

describe('POST /auth/refresh (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should refresh successfully and return new accessToken + new cookie', async () => {
    await createTestUser({
      email: 'refresh@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie = await loginAndGetCookie('refresh@example.com', 'SecurePass123!');

    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 when no cookie is provided', async () => {
    const response = await request(app).post('/auth/refresh');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });

  it('should return 401 for expired refresh token', async () => {
    const user = await createTestUser({
      email: 'expired@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const rawToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashRefreshToken(rawToken),
        expiresAt: new Date(Date.now() - 86400000),
      },
    });

    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', `refresh_token=${rawToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('should return 401 for revoked refresh token', async () => {
    const user = await createTestUser({
      email: 'revoked@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const rawToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashRefreshToken(rawToken),
        expiresAt: getRefreshTokenExpiry(),
        revokedAt: new Date(),
      },
    });

    const response = await request(app)
      .post('/auth/refresh')
      .set('Cookie', `refresh_token=${rawToken}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });

  it('should rotate: old token revoked, new token created', async () => {
    await createTestUser({
      email: 'rotate@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie = await loginAndGetCookie('rotate@example.com', 'SecurePass123!');
    const rawToken = await extractCookieValue(cookie);

    await request(app).post('/auth/refresh').set('Cookie', cookie);

    const oldToken = await prisma.refreshToken.findFirst({
      where: { tokenHash: hashRefreshToken(rawToken) },
    });
    expect(oldToken!.revokedAt).not.toBeNull();

    const activeTokens = await prisma.refreshToken.findMany({
      where: { revokedAt: null },
    });
    expect(activeTokens).toHaveLength(1);
  });

  it('should not allow reuse of old token after rotation', async () => {
    await createTestUser({
      email: 'noreuse@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie = await loginAndGetCookie('noreuse@example.com', 'SecurePass123!');

    await request(app).post('/auth/refresh').set('Cookie', cookie);

    const response = await request(app).post('/auth/refresh').set('Cookie', cookie);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });
});
