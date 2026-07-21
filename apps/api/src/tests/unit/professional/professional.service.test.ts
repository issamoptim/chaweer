import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma } from '../../../core/database/prisma';
import {
  ensureDraftProfile,
  getMyProfile,
  updateProfile,
  setExpertise,
  setOffer,
} from '../../../modules/professional/professional.service';
import { NotFoundError } from '../../../core/errors';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('professional.service (F-03)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createProUserAndProfile(email?: string) {
    const user = await createTestUser({
      email: email ?? `pro-f03-${Date.now()}@example.com`,
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      firstName: 'Amina',
      lastName: 'El Fassi',
    });
    const profileId = await ensureDraftProfile(user.id);
    return { user, profileId };
  }

  describe('getMyProfile — nested response shape', () => {
    it('returns nested identity, biography, expertise, offers, and completion', async () => {
      const { user } = await createProUserAndProfile();

      const profile = await getMyProfile(user.id);

      expect(profile.id).toBeDefined();
      expect(profile.status).toBe('DRAFT');
      expect(profile.identity).toEqual({
        firstName: 'Amina',
        lastName: 'El Fassi',
        professionalTitle: null,
        photoUrl: null,
        barAssociationId: null,
      });
      expect(profile.biography).toEqual({ bio: null });
      expect(profile.expertise).toEqual({
        specializationIds: [],
        practiceAreaIds: [],
        languageIds: [],
      });
      expect(profile.offers).toEqual([]);
      expect(profile.education).toEqual([]);
      expect(profile.experience).toEqual([]);
      expect(profile.certifications).toEqual([]);
      expect(profile.memberships).toEqual([]);
      expect(profile.verification).toBeNull();
    });

    it('returns completion with 10 sections and percentage 0 for empty profile', async () => {
      const { user } = await createProUserAndProfile();

      const profile = await getMyProfile(user.id);

      expect(profile.completion.totalSections).toBe(10);
      expect(profile.completion.completedSections).toBe(0);
      expect(profile.completion.percentage).toBe(0);
      expect(profile.completion.sections.identity).toBe(false);
      expect(profile.completion.sections.offer).toBe(false);
    });

    it('throws NotFoundError for non-existent profile', async () => {
      await expect(getMyProfile('non-existent-user-id')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile — returns UpdateProfileResponseData', () => {
    it('updates identity fields and returns nested identity/biography', async () => {
      const { user } = await createProUserAndProfile();

      const result = await updateProfile(user.id, {
        firstName: 'Updated',
        lastName: 'Name',
        professionalTitle: 'Avocate',
        bio: 'Bio text',
      });

      expect(result.identity.firstName).toBe('Updated');
      expect(result.identity.lastName).toBe('Name');
      expect(result.identity.professionalTitle).toBe('Avocate');
      expect(result.biography.bio).toBe('Bio text');
      expect(result.status).toBe('DRAFT');
    });

    it('does not include offers or expertise in the response', async () => {
      const { user } = await createProUserAndProfile();

      const result = await updateProfile(user.id, { bio: 'New bio' });

      expect(result).not.toHaveProperty('offers');
      expect(result).not.toHaveProperty('expertise');
      expect(result).not.toHaveProperty('completion');
    });
  });

  describe('setExpertise — returns ExpertiseData', () => {
    it('returns only specializationIds, practiceAreaIds, languageIds', async () => {
      const { user } = await createProUserAndProfile();

      // We need valid referential entries — create minimal ones
      const spec = await prisma.specialization.create({
        data: { key: 'test-spec-f03', name: 'Test Spec', active: true },
      });
      const area = await prisma.practiceArea.create({
        data: {
          key: 'test-area-f03',
          name: 'Test Area',
          specializationId: spec.id,
          active: true,
        },
      });
      const lang = await prisma.language.create({
        data: { code: 'tst', name: 'Test Language', active: true },
      });

      const result = await setExpertise(user.id, {
        specializationIds: [spec.id],
        practiceAreaIds: [area.id],
        languageIds: [lang.id],
      });

      expect(result.specializationIds).toEqual([spec.id]);
      expect(result.practiceAreaIds).toEqual([area.id]);
      expect(result.languageIds).toEqual([lang.id]);
      expect(result).not.toHaveProperty('completion');
      expect(result).not.toHaveProperty('offers');
    });
  });

  describe('setOffer — find-first-or-create pattern', () => {
    it('creates a new offer when none exists', async () => {
      const { user, profileId } = await createProUserAndProfile();

      await setOffer(user.id, {
        price: 400,
        durationMinutes: 30,
        modalities: ['VIDEO'],
      });

      const offers = await prisma.consultationOffer.findMany({
        where: { profileId },
      });
      expect(offers).toHaveLength(1);
      expect(offers[0].price).toBe(400);
      expect(offers[0].durationMinutes).toBe(30);
      expect(offers[0].title).toBe('Consultation');
      expect(offers[0].active).toBe(true);
    });

    it('updates the first existing offer instead of creating a new one', async () => {
      const { user, profileId } = await createProUserAndProfile();

      // Create initial offer
      await prisma.consultationOffer.create({
        data: {
          profileId,
          title: 'Original',
          price: 200,
          durationMinutes: 15,
          modalities: ['VIDEO'],
          active: true,
          order: 0,
        },
      });

      await setOffer(user.id, {
        price: 500,
        durationMinutes: 45,
        modalities: ['VIDEO', 'OFFICE'],
      });

      const offers = await prisma.consultationOffer.findMany({
        where: { profileId },
      });
      expect(offers).toHaveLength(1);
      expect(offers[0].price).toBe(500);
      expect(offers[0].durationMinutes).toBe(45);
    });

    it('returns full profile with offers array in response', async () => {
      const { user } = await createProUserAndProfile();

      const result = await setOffer(user.id, {
        price: 300,
        durationMinutes: 30,
        modalities: ['VIDEO'],
      });

      expect(result.offers).toHaveLength(1);
      expect(result.offers[0].price).toBe(300);
      expect(result.offers[0].currency).toBe('MAD');
      expect(result.offers[0].active).toBe(true);
      expect(result.completion.sections.offer).toBe(true);
    });
  });

  describe('computeCompletion — 10-section model', () => {
    it('marks identity complete when firstName, lastName, and professionalTitle are set', async () => {
      const { user } = await createProUserAndProfile();

      await updateProfile(user.id, {
        firstName: 'Amina',
        lastName: 'El Fassi',
        professionalTitle: 'Avocate',
      });

      const profile = await getMyProfile(user.id);
      expect(profile.completion.sections.identity).toBe(true);
      expect(profile.completion.sections.biography).toBe(false);
    });

    it('marks biography complete when bio is non-empty', async () => {
      const { user } = await createProUserAndProfile();

      await updateProfile(user.id, { bio: 'My biography' });

      const profile = await getMyProfile(user.id);
      expect(profile.completion.sections.biography).toBe(true);
    });

    it('marks offer complete when an active offer with price > 0 exists', async () => {
      const { user } = await createProUserAndProfile();

      await setOffer(user.id, {
        price: 400,
        durationMinutes: 30,
        modalities: ['VIDEO'],
      });

      const profile = await getMyProfile(user.id);
      expect(profile.completion.sections.offer).toBe(true);
    });

    it('computes percentage correctly', async () => {
      const { user } = await createProUserAndProfile();

      // Set identity (firstName already set, add lastName + title)
      await updateProfile(user.id, {
        firstName: 'Amina',
        lastName: 'El Fassi',
        professionalTitle: 'Avocate',
        bio: 'Bio',
      });

      const profile = await getMyProfile(user.id);
      // identity + biography = 2/10 = 20%
      expect(profile.completion.completedSections).toBe(2);
      expect(profile.completion.percentage).toBe(20);
    });
  });
});
