import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('Security (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return identical responses for unknown email and wrong password', async () => {
    await createTestUser({
      email: 'security@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const unknownEmailResponse = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'SecurePass123!',
    });

    const wrongPasswordResponse = await request(app).post('/auth/login').send({
      email: 'security@example.com',
      password: 'WrongPass456!',
    });

    expect(unknownEmailResponse.status).toBe(wrongPasswordResponse.status);
    expect(unknownEmailResponse.body.error.code).toBe(wrongPasswordResponse.body.error.code);
    expect(unknownEmailResponse.body.error.message).toBe(wrongPasswordResponse.body.error.message);
  });

  it('should never include password in any API response', async () => {
    await createTestUser({
      email: 'noPassword@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'noPassword@example.com',
      password: 'SecurePass123!',
    });

    const responseStr = JSON.stringify(response.body);
    expect(responseStr).not.toContain('password');
    expect(responseStr).not.toContain('passwordHash');
    expect(responseStr).not.toContain('SecurePass123!');
  });

  it('should never include refresh token in JSON response body', async () => {
    await createTestUser({
      email: 'noRefresh@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'noRefresh@example.com',
      password: 'SecurePass123!',
    });

    const responseStr = JSON.stringify(response.body);
    expect(responseStr).not.toContain('refreshToken');
    expect(responseStr).not.toContain('refresh_token');
  });

  it('should set HttpOnly flag on the cookie', async () => {
    await createTestUser({
      email: 'cookie@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'cookie@example.com',
      password: 'SecurePass123!',
    });

    const cookies = response.headers['set-cookie'];
    const cookieStr = Array.isArray(cookies) ? cookies[0] : (cookies as string);
    expect(cookieStr).toMatch(/HttpOnly/i);
  });

  it('should set SameSite attribute on the cookie', async () => {
    await createTestUser({
      email: 'samesite@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'samesite@example.com',
      password: 'SecurePass123!',
    });

    const cookies = response.headers['set-cookie'];
    const cookieStr = Array.isArray(cookies) ? cookies[0] : (cookies as string);
    expect(cookieStr).toMatch(/SameSite=/i);
  });

  it('should set Path on the cookie', async () => {
    await createTestUser({
      email: 'path@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'path@example.com',
      password: 'SecurePass123!',
    });

    const cookies = response.headers['set-cookie'];
    const cookieStr = Array.isArray(cookies) ? cookies[0] : (cookies as string);
    expect(cookieStr).toMatch(/Path=/i);
  });

  it('should produce a signed JWT (not alg:none)', async () => {
    await createTestUser({
      email: 'jwt@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'jwt@example.com',
      password: 'SecurePass123!',
    });

    const token = response.body.data.accessToken;
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    expect(header.alg).toBe('HS256');
    expect(header.alg).not.toBe('none');
  });

  it('should not expose stack traces in error responses', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'invalid',
      password: '',
    });

    const responseStr = JSON.stringify(response.body);
    expect(responseStr).not.toContain('stack');
    expect(responseStr).not.toContain('at ');
  });
});
