import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { signAccessToken } from '../../../modules/auth/services/jwt.service';
import { cleanDatabase, createTestUser, createTestGoogleUser } from '../../helpers/db-helper';

describe('GET /profile (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 with profile data for authenticated user', async () => {
    const created = await createTestUser({
      email: 'profile@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: created.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'profile@example.com',
      phone: null,
      country: null,
      city: null,
      nationality: null,
      preferredLanguage: null,
      notificationEmail: true,
      notificationPush: true,
      role: 'CLIENT',
    });
  });

  it('should return 401 when no Authorization header is present', async () => {
    const response = await request(app).get('/profile');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 401 when Bearer token is malformed', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', 'Bearer malformed-token');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return null for optional fields when not set', async () => {
    const created = await createTestUser({
      email: 'optional@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.phone).toBeNull();
    expect(response.body.data.country).toBeNull();
    expect(response.body.data.city).toBeNull();
    expect(response.body.data.nationality).toBeNull();
    expect(response.body.data.preferredLanguage).toBeNull();
  });

  it('should return true for notification defaults on new user', async () => {
    const created = await createTestUser({
      email: 'defaults@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.notificationEmail).toBe(true);
    expect(response.body.data.notificationPush).toBe(true);
  });

  it('should not expose passwordHash, authProvider, or status', async () => {
    const created = await createTestUser({
      email: 'noexpose@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.data.passwordHash).toBeUndefined();
    expect(response.body.data.authProvider).toBeUndefined();
    expect(response.body.data.status).toBeUndefined();
    expect(response.body.data.avatarUrl).toBeUndefined();
    expect(response.body.data.createdAt).toBeUndefined();
    expect(response.body.data.updatedAt).toBeUndefined();
  });

  it('should work for Google-authenticated users', async () => {
    const created = await createTestGoogleUser({
      email: 'google-profile@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      role: 'CLIENT',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('google-profile@gmail.com');
    expect(response.body.data.firstName).toBe('Google');
  });
});

describe('PATCH /profile/preferences (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should update preferredLanguage to "fr"', async () => {
    const created = await createTestUser({
      email: 'lang@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ preferredLanguage: 'fr' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.preferredLanguage).toBe('fr');
  });

  it('should update notificationEmail to false', async () => {
    const created = await createTestUser({
      email: 'email-pref@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ notificationEmail: false });

    expect(response.status).toBe(200);
    expect(response.body.data.notificationEmail).toBe(false);
    expect(response.body.data.notificationPush).toBe(true);
  });

  it('should update notificationPush to false', async () => {
    const created = await createTestUser({
      email: 'push-pref@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ notificationPush: false });

    expect(response.status).toBe(200);
    expect(response.body.data.notificationPush).toBe(false);
    expect(response.body.data.notificationEmail).toBe(true);
  });

  it('should update multiple fields at once', async () => {
    const created = await createTestUser({
      email: 'multi@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ preferredLanguage: 'ar', notificationEmail: false, notificationPush: false });

    expect(response.status).toBe(200);
    expect(response.body.data.preferredLanguage).toBe('ar');
    expect(response.body.data.notificationEmail).toBe(false);
    expect(response.body.data.notificationPush).toBe(false);
  });

  it('should return 400 for invalid language value', async () => {
    const created = await createTestUser({
      email: 'invalid-lang@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ preferredLanguage: 'de' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 for empty body', async () => {
    const created = await createTestUser({
      email: 'empty-body@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 400 when notificationEmail is not boolean', async () => {
    const created = await createTestUser({
      email: 'bad-bool@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ notificationEmail: 'yes' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 401 without auth', async () => {
    const response = await request(app)
      .patch('/profile/preferences')
      .send({ preferredLanguage: 'fr' });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should not modify fields not included in request', async () => {
    const created = await createTestUser({
      email: 'partial@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
      preferredLanguage: 'en',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/profile/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ notificationEmail: false });

    expect(response.status).toBe(200);
    expect(response.body.data.notificationEmail).toBe(false);
    expect(response.body.data.preferredLanguage).toBe('en');
    expect(response.body.data.notificationPush).toBe(true);
  });
});
