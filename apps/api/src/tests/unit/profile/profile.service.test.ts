import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma } from '../../../core/database/prisma';
import { getProfile, updatePreferences } from '../../../modules/profile/profile.service';
import { NotFoundError } from '../../../core/errors';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('profile.service', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getProfile', () => {
    it('should return ProfileData for existing user', async () => {
      const created = await createTestUser({
        email: 'service@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'ACTIVE',
      });

      const profile = await getProfile(created.id);

      expect(profile.id).toBe(created.id);
      expect(profile.firstName).toBe('Jane');
      expect(profile.lastName).toBe('Smith');
      expect(profile.email).toBe('service@example.com');
      expect(profile.phone).toBeNull();
      expect(profile.country).toBeNull();
      expect(profile.city).toBeNull();
      expect(profile.nationality).toBeNull();
      expect(profile.preferredLanguage).toBeNull();
      expect(profile.notificationEmail).toBe(true);
      expect(profile.notificationPush).toBe(true);
      expect(profile.role).toBe('CLIENT');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(getProfile('non-existent-id')).rejects.toThrow(NotFoundError);
    });

    it('should not select passwordHash', async () => {
      const created = await createTestUser({
        email: 'nohash-service@example.com',
        status: 'ACTIVE',
      });

      const profile = await getProfile(created.id);

      expect((profile as Record<string, unknown>).passwordHash).toBeUndefined();
    });
  });

  describe('updatePreferences', () => {
    it('should update only preferredLanguage when only that is provided', async () => {
      const created = await createTestUser({
        email: 'lang-only@example.com',
        status: 'ACTIVE',
      });

      const profile = await updatePreferences(created.id, { preferredLanguage: 'ar' });

      expect(profile.preferredLanguage).toBe('ar');
      expect(profile.notificationEmail).toBe(true);
      expect(profile.notificationPush).toBe(true);
    });

    it('should update only notificationEmail when only that is provided', async () => {
      const created = await createTestUser({
        email: 'email-only@example.com',
        status: 'ACTIVE',
      });

      const profile = await updatePreferences(created.id, { notificationEmail: false });

      expect(profile.notificationEmail).toBe(false);
      expect(profile.notificationPush).toBe(true);
      expect(profile.preferredLanguage).toBeNull();
    });

    it('should update all fields when all are provided', async () => {
      const created = await createTestUser({
        email: 'all-fields@example.com',
        status: 'ACTIVE',
      });

      const profile = await updatePreferences(created.id, {
        preferredLanguage: 'en',
        notificationEmail: false,
        notificationPush: false,
      });

      expect(profile.preferredLanguage).toBe('en');
      expect(profile.notificationEmail).toBe(false);
      expect(profile.notificationPush).toBe(false);
    });

    it('should return full ProfileData after update', async () => {
      const created = await createTestUser({
        email: 'full-return@example.com',
        firstName: 'Full',
        lastName: 'Return',
        status: 'ACTIVE',
      });

      const profile = await updatePreferences(created.id, { preferredLanguage: 'fr' });

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('firstName');
      expect(profile).toHaveProperty('lastName');
      expect(profile).toHaveProperty('email');
      expect(profile).toHaveProperty('phone');
      expect(profile).toHaveProperty('country');
      expect(profile).toHaveProperty('city');
      expect(profile).toHaveProperty('nationality');
      expect(profile).toHaveProperty('preferredLanguage');
      expect(profile).toHaveProperty('notificationEmail');
      expect(profile).toHaveProperty('notificationPush');
      expect(profile).toHaveProperty('role');
    });

    it('should throw NotFoundError for non-existent user', async () => {
      await expect(
        updatePreferences('non-existent-id', { preferredLanguage: 'fr' }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
