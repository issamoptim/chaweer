import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('POST /auth/login (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should login successfully and return accessToken + cookie', async () => {
    await createTestUser({
      email: 'login@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'login@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.email).toBe('login@example.com');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 for unknown email', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.error.message).toBe('Email ou mot de passe incorrect.');
  });

  it('should return 401 for wrong password with same message as unknown email', async () => {
    await createTestUser({
      email: 'wrongpass@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'wrongpass@example.com',
      password: 'WrongPass456!',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.error.message).toBe('Email ou mot de passe incorrect.');
  });

  it('should return 401 with same message for Google account as unknown email', async () => {
    await createTestUser({
      email: 'google@example.com',
      authProvider: 'GOOGLE',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'google@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.error.message).toBe('Email ou mot de passe incorrect.');
  });

  it('should return 403 for suspended account', async () => {
    await createTestUser({
      email: 'suspended@example.com',
      password: 'SecurePass123!',
      status: 'SUSPENDED',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'suspended@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('ACCOUNT_SUSPENDED');
  });

  it('should return 403 for pending email verification', async () => {
    await createTestUser({
      email: 'pending@example.com',
      password: 'SecurePass123!',
      status: 'PENDING_EMAIL_VERIFICATION',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'pending@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('EMAIL_NOT_VERIFIED');
  });

  it('should store refresh token as hash in DB', async () => {
    await createTestUser({
      email: 'hashed@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    await request(app).post('/auth/login').send({
      email: 'hashed@example.com',
      password: 'SecurePass123!',
    });

    const tokens = await prisma.refreshToken.findMany();
    expect(tokens).toHaveLength(1);
    expect(tokens[0].tokenHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should not include refresh token in JSON response', async () => {
    await createTestUser({
      email: 'nojson@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const response = await request(app).post('/auth/login').send({
      email: 'nojson@example.com',
      password: 'SecurePass123!',
    });

    expect(response.body.data.refreshToken).toBeUndefined();
    expect(response.body.data.token).toBeUndefined();
  });

  it('should allow multiple sessions (multiple logins create multiple tokens)', async () => {
    await createTestUser({
      email: 'multi@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    await request(app).post('/auth/login').send({
      email: 'multi@example.com',
      password: 'SecurePass123!',
    });

    await request(app).post('/auth/login').send({
      email: 'multi@example.com',
      password: 'SecurePass123!',
    });

    const tokens = await prisma.refreshToken.findMany();
    expect(tokens).toHaveLength(2);
  });
});
