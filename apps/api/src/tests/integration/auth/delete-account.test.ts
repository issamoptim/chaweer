import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { signAccessToken } from '../../../modules/auth/services/jwt.service';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('DELETE /auth/account (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 204 when account is deleted', async () => {
    const created = await createTestUser({
      email: 'delete-me@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .delete('/auth/account')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should set user status to DELETED in the database', async () => {
    const created = await createTestUser({
      email: 'soft-delete@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    await request(app).delete('/auth/account').set('Authorization', `Bearer ${token}`);

    const user = await prisma.user.findUnique({ where: { id: created.id } });
    expect(user).not.toBeNull();
    expect(user!.status).toBe('DELETED');
  });

  it('should revoke all active refresh tokens', async () => {
    const created = await createTestUser({
      email: 'revoke-tokens@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    await prisma.refreshToken.create({
      data: {
        userId: created.id,
        tokenHash: 'hash-1',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });
    await prisma.refreshToken.create({
      data: {
        userId: created.id,
        tokenHash: 'hash-2',
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    await request(app).delete('/auth/account').set('Authorization', `Bearer ${token}`);

    const activeTokens = await prisma.refreshToken.findMany({
      where: { userId: created.id, revokedAt: null },
    });
    expect(activeTokens).toHaveLength(0);
  });

  it('should clear the refresh token cookie', async () => {
    const created = await createTestUser({
      email: 'clear-cookie@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .delete('/auth/account')
      .set('Authorization', `Bearer ${token}`);

    const setCookie = response.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
    expect(cookieStr).toContain('refresh_token=');
    expect(cookieStr.toLowerCase()).toContain('expires=');
  });

  it('should return 401 when no Authorization header is present', async () => {
    const response = await request(app).delete('/auth/account');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
