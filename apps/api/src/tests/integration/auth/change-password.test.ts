import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { signAccessToken } from '../../../modules/auth/services/jwt.service';
import { cleanDatabase, createTestUser, createTestGoogleUser } from '../../helpers/db-helper';
import { verifyPassword } from '../../../modules/auth/services/password.service';

describe('PATCH /auth/password (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and success message when password is changed', async () => {
    const created = await createTestUser({
      email: 'change-pass@example.com',
      password: 'OldPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Votre mot de passe a été modifié.');
  });

  it('should actually update the password hash in the database', async () => {
    const created = await createTestUser({
      email: 'verify-hash@example.com',
      password: 'OldPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    await request(app).patch('/auth/password').set('Authorization', `Bearer ${token}`).send({
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass456!',
      confirmPassword: 'NewPass456!',
    });

    const user = await prisma.user.findUnique({ where: { id: created.id } });
    expect(user).not.toBeNull();
    const isOldValid = await verifyPassword(user!.passwordHash!, 'OldPass123!');
    const isNewValid = await verifyPassword(user!.passwordHash!, 'NewPass456!');
    expect(isOldValid).toBe(false);
    expect(isNewValid).toBe(true);
  });

  it('should return 401 when current password is incorrect', async () => {
    const created = await createTestUser({
      email: 'wrong-current@example.com',
      password: 'CorrectPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'WrongPass123!',
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.error.message).toBe('Le mot de passe actuel est incorrect.');
  });

  it('should return 403 for Google-authenticated users', async () => {
    const created = await createTestGoogleUser({
      email: 'google-pass@gmail.com',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'anything',
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!',
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('should return 422 when newPassword is too short', async () => {
    const created = await createTestUser({
      email: 'short-pass@example.com',
      password: 'OldPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'Short1',
        confirmPassword: 'Short1',
      });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 when confirmPassword does not match newPassword', async () => {
    const created = await createTestUser({
      email: 'mismatch-pass@example.com',
      password: 'OldPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
        confirmPassword: 'DifferentPass789!',
      });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 when currentPassword is missing', async () => {
    const created = await createTestUser({
      email: 'missing-current@example.com',
      password: 'OldPass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword: 'NewPass456!',
        confirmPassword: 'NewPass456!',
      });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 when new password is identical to current password', async () => {
    const created = await createTestUser({
      email: 'same-pass@example.com',
      password: 'SamePass123!',
      status: 'ACTIVE',
    });

    const token = await signAccessToken({ userId: created.id, role: 'CLIENT' });

    const response = await request(app)
      .patch('/auth/password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'SamePass123!',
        newPassword: 'SamePass123!',
        confirmPassword: 'SamePass123!',
      });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.message).toBe(
      'Le nouveau mot de passe doit être différent du mot de passe actuel.',
    );
  });

  it('should return 401 when no Authorization header is present', async () => {
    const response = await request(app).patch('/auth/password').send({
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass456!',
      confirmPassword: 'NewPass456!',
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
