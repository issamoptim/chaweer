import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { signAccessToken } from '../../../modules/auth/services/jwt.service';
import { cleanDatabase, createTestUser, createTestGoogleUser } from '../../helpers/db-helper';

describe('GET /auth/me (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and user profile for valid access token', async () => {
    const created = await createTestUser({
      email: 'me@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: created.id,
      role: 'CLIENT',
      email: 'me@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
      authProvider: 'LOCAL',
    });
  });

  it('should return 401 when no Authorization header is present', async () => {
    const response = await request(app).get('/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 when Authorization header has no Bearer prefix', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', 'some-token');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 when Bearer token is malformed', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer malformed-token');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 when Bearer token is empty', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer ');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should work for Google-authenticated users', async () => {
    const created = await createTestGoogleUser({
      email: 'google-me@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      avatarUrl: 'https://example.com/photo.jpg',
      role: 'CLIENT',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('google-me@gmail.com');
    expect(response.body.data.avatarUrl).toBe('https://example.com/photo.jpg');
  });

  it('should not expose passwordHash in the response', async () => {
    const created = await createTestUser({
      email: 'nohash@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.passwordHash).toBeUndefined();
  });

  it('should return authProvider in the response', async () => {
    const created = await createTestUser({
      email: 'provider@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.authProvider).toBe('LOCAL');
  });

  it('should return authProvider GOOGLE for Google users', async () => {
    const created = await createTestGoogleUser({
      email: 'google-provider@gmail.com',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.authProvider).toBe('GOOGLE');
  });

  it('should not expose status in the response', async () => {
    const created = await createTestUser({
      email: 'nofields@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.status).toBeUndefined();
    expect(response.body.data.createdAt).toBeUndefined();
    expect(response.body.data.updatedAt).toBeUndefined();
  });

  it('should return identical responses on consecutive calls (no side-effects)', async () => {
    const created = await createTestUser({
      email: 'idempotent@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response1 = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    const response2 = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response1.body.data).toEqual(response2.body.data);
  });

  it('should return 401 for a token signed with a different secret', async () => {
    const created = await createTestUser({
      email: 'wrongsecret@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const { SignJWT } = await import('jose');
    const wrongSecret = new TextEncoder().encode('wrong-secret-at-least-32-characters-long');
    const token = await new SignJWT({ userId: created.id, role: 'CLIENT' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setSubject(created.id)
      .setIssuer('chaweer')
      .setExpirationTime('15m')
      .sign(wrongSecret);

    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
