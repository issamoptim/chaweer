import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

async function loginAndGetCookie(email: string, password: string): Promise<string> {
  const response = await request(app).post('/auth/login').send({ email, password });
  const cookies = response.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies[0] : (cookies as string);
}

describe('POST /auth/logout (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 204 and clear the cookie', async () => {
    await createTestUser({
      email: 'logout@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie = await loginAndGetCookie('logout@example.com', 'SecurePass123!');

    const response = await request(app).post('/auth/logout').set('Cookie', cookie);

    expect(response.status).toBe(204);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should revoke the refresh token in the database', async () => {
    await createTestUser({
      email: 'revoke@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie = await loginAndGetCookie('revoke@example.com', 'SecurePass123!');

    await request(app).post('/auth/logout').set('Cookie', cookie);

    const activeTokens = await prisma.refreshToken.findMany({
      where: { revokedAt: null },
    });
    expect(activeTokens).toHaveLength(0);
  });

  it('should keep other sessions active', async () => {
    await createTestUser({
      email: 'multi@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const cookie1 = await loginAndGetCookie('multi@example.com', 'SecurePass123!');
    await loginAndGetCookie('multi@example.com', 'SecurePass123!');

    await request(app).post('/auth/logout').set('Cookie', cookie1);

    const tokens = await prisma.refreshToken.findMany();
    expect(tokens).toHaveLength(2);

    const activeTokens = tokens.filter((t) => t.revokedAt === null);
    expect(activeTokens).toHaveLength(1);
  });

  it('should return 204 even without a cookie (idempotent)', async () => {
    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(204);
  });
});
