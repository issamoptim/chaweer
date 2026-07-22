import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma } from '../../../core/database/prisma';
import {
  ensureDraftProfile,
  getMyProfile,
  updateProfile,
  setExpertise,
  setOffer,
  publishProfile,
} from '../../../modules/professional/professional.service';
import { NotFoundError, PublicationRequirementsError } from '../../../core/errors';
import { PUBLICATION_REQUIREMENTS } from '@chaweer/shared';
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
      const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const spec = await prisma.specialization.create({
        data: { key: `test-spec-${suffix}`, name: 'Test Spec', active: true },
      });
      const area = await prisma.practiceArea.create({
        data: {
          key: `test-area-${suffix}`,
          name: 'Test Area',
          specializationId: spec.id,
          active: true,
        },
      });
      const lang = await prisma.language.create({
        data: { code: `tl-${suffix}`, name: 'Test Language', active: true },
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
        title: 'Consultation juridique',
        description: 'Un accompagnement personnalisé.',
        price: 400,
        modalities: ['VIDEO'],
      });

      const offers = await prisma.consultationOffer.findMany({
        where: { profileId },
      });
      expect(offers).toHaveLength(1);
      expect(offers[0].price).toBe(400);
      expect(offers[0].title).toBe('Consultation juridique');
      expect(offers[0].description).toBe('Un accompagnement personnalisé.');
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
          modalities: ['VIDEO'],
          active: true,
          order: 0,
        },
      });

      await setOffer(user.id, {
        title: 'Consultation mise à jour',
        description: 'Nouvelle description.',
        price: 500,
        modalities: ['VIDEO', 'AUDIO'],
      });

      const offers = await prisma.consultationOffer.findMany({
        where: { profileId },
      });
      expect(offers).toHaveLength(1);
      expect(offers[0].price).toBe(500);
      expect(offers[0].title).toBe('Consultation mise à jour');
      expect(offers[0].modalities).toEqual(['VIDEO', 'AUDIO']);
    });

    it('returns full profile with offers array in response', async () => {
      const { user } = await createProUserAndProfile();

      const result = await setOffer(user.id, {
        title: 'Consultation juridique',
        description: 'Un accompagnement personnalisé.',
        price: 300,
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
        title: 'Consultation juridique',
        description: 'Un accompagnement personnalisé.',
        price: 400,
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

  // ============================================================
  // Publication workflow (Phase 2A)
  // ============================================================

  async function createPublicationReadyProfile(email?: string) {
    const user = await createTestUser({
      email: email ?? `pro-pub-${Date.now()}@example.com`,
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      firstName: 'Amina',
      lastName: 'El Fassi',
    });
    const profileId = await ensureDraftProfile(user.id);

    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Create a bar association
    const bar = await prisma.barAssociation.create({
      data: { key: `bar-pub-${suffix}`, name: 'Barreau Test', active: true },
    });

    // Create a specialization
    const spec = await prisma.specialization.create({
      data: { key: `spec-pub-${suffix}`, name: 'Test Spec Pub', active: true },
    });

    // Fill profile: bar association + bio >= 200 chars
    const longBio = 'A'.repeat(210);
    await updateProfile(user.id, {
      firstName: 'Amina',
      lastName: 'El Fassi',
      barAssociationId: bar.id,
      bio: longBio,
    });

    // Fill expertise: at least 1 specialization
    await setExpertise(user.id, {
      specializationIds: [spec.id],
      practiceAreaIds: [],
      languageIds: [],
    });

    // Fill offer: title, description, price, modalities
    await setOffer(user.id, {
      title: 'Consultation juridique',
      description: 'Un accompagnement personnalisé pour votre dossier.',
      price: 400,
      modalities: ['VIDEO'],
    });

    return { user, profileId, bar, spec };
  }

  describe('publishProfile — publication workflow', () => {
    it('throws PublicationRequirementsError when requirements are missing', async () => {
      const { user } = await createProUserAndProfile();

      // Profile has firstName and lastName from createProUserAndProfile,
      // but everything else is missing.
      await expect(publishProfile(user.id)).rejects.toThrow(PublicationRequirementsError);

      try {
        await publishProfile(user.id);
      } catch (err) {
        const e = err as PublicationRequirementsError;
        // firstName and lastName are set by createProUserAndProfile
        expect(e.missingRequirements).not.toContain(PUBLICATION_REQUIREMENTS.FIRST_NAME);
        expect(e.missingRequirements).not.toContain(PUBLICATION_REQUIREMENTS.LAST_NAME);
        // These are all missing on an empty profile
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.BIOGRAPHY);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.SPECIALIZATION);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.OFFER_TITLE);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.OFFER_PRICE);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.OFFER_MODALITY);
        expect(e.statusCode).toBe(422);
      }
    });

    it('throws NotFoundError for non-existent profile', async () => {
      await expect(publishProfile('non-existent-user-id')).rejects.toThrow(NotFoundError);
    });

    it('publishes a complete profile and returns PUBLISHED status', async () => {
      const { user } = await createPublicationReadyProfile();

      const result = await publishProfile(user.id);

      expect(result.status).toBe('PUBLISHED');
      expect(result.publishedAt).not.toBeNull();
    });

    it('is idempotent — re-publishing an already PUBLISHED profile returns current state', async () => {
      const { user } = await createPublicationReadyProfile();

      const first = await publishProfile(user.id);
      expect(first.status).toBe('PUBLISHED');

      const second = await publishProfile(user.id);
      expect(second.status).toBe('PUBLISHED');
      expect(second.publishedAt).toBe(first.publishedAt);
    });

    it('sets publishedAt timestamp in the database', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { status: true, publishedAt: true },
      });
      expect(dbProfile!.status).toBe('PUBLISHED');
      expect(dbProfile!.publishedAt).not.toBeNull();
    });
  });

  describe('Auto-unpublish — syncPublicationStatus', () => {
    it('unpublishes when a mandatory field is cleared via updateProfile', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);
      expect((await getMyProfile(user.id)).status).toBe('PUBLISHED');

      // Clear bio (set to null) — bio is mandatory for publication
      await updateProfile(user.id, { bio: null });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('DRAFT');
    });

    it('unpublishes when bar association is removed via updateProfile', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      // Remove bar association
      await updateProfile(user.id, { barAssociationId: null });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('DRAFT');
    });

    it('unpublishes when all specializations are removed via setExpertise', async () => {
      const { user, spec } = await createPublicationReadyProfile();
      // Add a second spec so we can remove both
      const spec2 = await prisma.specialization.create({
        data: { key: `spec2-pub-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: 'Spec 2', active: true },
      });
      await setExpertise(user.id, {
        specializationIds: [spec.id, spec2.id],
        practiceAreaIds: [],
        languageIds: [],
      });

      await publishProfile(user.id);

      // Remove all specializations — but schema requires at least 1,
      // so we use a direct DB manipulation to simulate edge case
      await prisma.professionalSpecialization.deleteMany({
        where: { profileId: (await prisma.professionalProfile.findUnique({ where: { userId: user.id } }))!.id },
      });

      // Trigger sync via setExpertise with a new spec then remove it
      // Actually, let's call setOffer which triggers syncPublicationStatus
      await setOffer(user.id, {
        title: 'Consultation juridique',
        description: 'Un accompagnement personnalisé pour votre dossier.',
        price: 400,
        modalities: ['VIDEO'],
      });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('DRAFT');
    });

    it('unpublishes when offer title is emptied via setOffer', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      // The schema requires title min(1), so we can't send empty title.
      // Instead, directly update the DB to simulate data corruption / edge case
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { id: true, offers: { orderBy: { order: 'asc' } } },
      });
      await prisma.consultationOffer.update({
        where: { id: dbProfile!.offers[0].id },
        data: { title: '' },
      });

      // Trigger sync via updateProfile (no actual change, just triggers sync)
      await updateProfile(user.id, { bio: 'A'.repeat(210) });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('DRAFT');
    });

    it('does NOT unpublish when a non-mandatory field is modified', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      // Modify professionalTitle (optional field)
      await updateProfile(user.id, { professionalTitle: 'Avocate associée' });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('PUBLISHED');
    });

    it('does NOT unpublish when bio is updated but still >= 200 chars', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      // Update bio to a different valid value
      await updateProfile(user.id, { bio: 'B'.repeat(250) });

      const profile = await getMyProfile(user.id);
      expect(profile.status).toBe('PUBLISHED');
    });

    it('allows re-publishing after auto-unpublish when requirements are restored', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);
      expect((await getMyProfile(user.id)).status).toBe('PUBLISHED');

      // Clear bio → auto-unpublish
      await updateProfile(user.id, { bio: null });
      expect((await getMyProfile(user.id)).status).toBe('DRAFT');

      // Restore bio
      await updateProfile(user.id, { bio: 'C'.repeat(220) });

      // Re-publish
      const result = await publishProfile(user.id);
      expect(result.status).toBe('PUBLISHED');
      expect(result.publishedAt).not.toBeNull();
    });

    it('sets unpublishedAt timestamp when auto-unpublishing', async () => {
      const { user } = await createPublicationReadyProfile();

      await publishProfile(user.id);

      await updateProfile(user.id, { bio: null });

      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { status: true, unpublishedAt: true },
      });
      expect(dbProfile!.status).toBe('DRAFT');
      expect(dbProfile!.unpublishedAt).not.toBeNull();
    });
  });
});
