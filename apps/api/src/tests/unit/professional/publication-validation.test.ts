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
import { PublicationRequirementsError } from '../../../core/errors';
import { PUBLICATION_REQUIREMENTS, PUBLICATION_MIN_BIO_LENGTH } from '@chaweer/shared';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';

describe('Publication Validation Campaign (Phase 2A)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createReadyProfile() {
    const s = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const user = await createTestUser({
      email: `val-${s}@e.com`,
      role: 'PROFESSIONAL',
      status: 'ACTIVE',
      firstName: 'Amina',
      lastName: 'El Fassi',
    });
    await ensureDraftProfile(user.id);
    const bar = await prisma.barAssociation.create({
      data: { key: `bar-${s}`, name: 'Bar', active: true },
    });
    const spec = await prisma.specialization.create({
      data: { key: `spec-${s}`, name: 'Spec', active: true },
    });
    await updateProfile(user.id, {
      firstName: 'Amina',
      lastName: 'El Fassi',
      barAssociationId: bar.id,
      bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10),
    });
    await setExpertise(user.id, {
      specializationIds: [spec.id],
      practiceAreaIds: [],
      languageIds: [],
    });
    await setOffer(user.id, {
      title: 'Consultation',
      description: 'Description valide.',
      price: 400,
      modalities: ['VIDEO'],
    });
    return { user, bar, spec };
  }

  // ===============================================================
  // 1. PUBLICATION
  // ===============================================================

  describe('1. Publication', () => {
    it('1.1 — complete profile publishes successfully', async () => {
      const { user } = await createReadyProfile();
      const result = await publishProfile(user.id);
      expect(result.status).toBe('PUBLISHED');
      expect(result.publishedAt).not.toBeNull();
    });

    it('1.2 — idempotence: re-publish returns same publishedAt', async () => {
      const { user } = await createReadyProfile();
      const first = await publishProfile(user.id);
      const second = await publishProfile(user.id);
      expect(second.status).toBe('PUBLISHED');
      expect(second.publishedAt).toBe(first.publishedAt);
    });

    it('1.3 — each of the 9 requirements missing individually causes 422', async () => {
      const reqs = Object.values(PUBLICATION_REQUIREMENTS);
      for (const req of reqs) {
        await cleanDatabase();
        const s = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const user = await createTestUser({
          email: `miss-${s}@e.com`,
          role: 'PROFESSIONAL',
          status: 'ACTIVE',
          firstName: req === PUBLICATION_REQUIREMENTS.FIRST_NAME ? '' : 'A',
          lastName: req === PUBLICATION_REQUIREMENTS.LAST_NAME ? '' : 'B',
        });
        await ensureDraftProfile(user.id);
        const bar = await prisma.barAssociation.create({
          data: { key: `bar-${s}`, name: 'Bar', active: true },
        });
        const spec = await prisma.specialization.create({
          data: { key: `spec-${s}`, name: 'Spec', active: true },
        });

        await updateProfile(user.id, {
          firstName: req === PUBLICATION_REQUIREMENTS.FIRST_NAME ? '' : 'A',
          lastName: req === PUBLICATION_REQUIREMENTS.LAST_NAME ? '' : 'B',
          barAssociationId:
            req === PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION ? null : bar.id,
          bio:
            req === PUBLICATION_REQUIREMENTS.BIOGRAPHY
              ? 'short'
              : 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10),
        });

        if (req !== PUBLICATION_REQUIREMENTS.SPECIALIZATION) {
          await setExpertise(user.id, {
            specializationIds: [spec.id],
            practiceAreaIds: [],
            languageIds: [],
          });
        }

        const offerTitle = req === PUBLICATION_REQUIREMENTS.OFFER_TITLE ? '' : 'Consultation';
        const offerDesc =
          req === PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION ? '' : 'Description valide.';
        const offerPrice = req === PUBLICATION_REQUIREMENTS.OFFER_PRICE ? 0 : 400;
        const offerMod =
          req === PUBLICATION_REQUIREMENTS.OFFER_MODALITY ? [] : ['VIDEO'];

        const profile = await prisma.professionalProfile.findUnique({
          where: { userId: user.id },
        });
        await prisma.consultationOffer.create({
          data: {
            profileId: profile!.id,
            title: offerTitle,
            description: offerDesc,
            price: offerPrice,
            modalities: offerMod as never,
            active: true,
            order: 0,
          },
        });

        try {
          await publishProfile(user.id);
          throw new Error(`Expected PublicationRequirementsError for missing ${req}`);
        } catch (err) {
          expect(err).toBeInstanceOf(PublicationRequirementsError);
          const e = err as PublicationRequirementsError;
          expect(e.missingRequirements).toContain(req);
          expect(e.statusCode).toBe(422);
        }
      }
    });

    it('1.4 — multiple requirements missing: all listed in error', async () => {
      const { user } = await createProUserAndProfile();
      try {
        await publishProfile(user.id);
      } catch (err) {
        const e = err as PublicationRequirementsError;
        expect(e.missingRequirements.length).toBeGreaterThanOrEqual(5);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.BIOGRAPHY);
        expect(e.missingRequirements).toContain(PUBLICATION_REQUIREMENTS.SPECIALIZATION);
      }
    });
  });

  // ===============================================================
  // 2. AUTO-UNPUBLISH
  // ===============================================================

  describe('2. Auto-unpublish', () => {
    it('2.1 — clearing bio unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.2 — bio < 200 chars unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: 'Too short' });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.3 — removing bar association unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { barAssociationId: null });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.4 — removing all specializations unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      const profile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      await prisma.professionalSpecialization.deleteMany({
        where: { profileId: profile!.id },
      });
      await setOffer(user.id, {
        title: 'Consultation',
        description: 'Description valide.',
        price: 400,
        modalities: ['VIDEO'],
      });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.5 — emptying offer title unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        include: { offers: { orderBy: { order: 'asc' } } },
      });
      await prisma.consultationOffer.update({
        where: { id: dbProfile!.offers[0].id },
        data: { title: '' },
      });
      await updateProfile(user.id, { bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.6 — emptying offer description unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        include: { offers: { orderBy: { order: 'asc' } } },
      });
      await prisma.consultationOffer.update({
        where: { id: dbProfile!.offers[0].id },
        data: { description: '' },
      });
      await updateProfile(user.id, { bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.7 — price = 0 unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        include: { offers: { orderBy: { order: 'asc' } } },
      });
      await prisma.consultationOffer.update({
        where: { id: dbProfile!.offers[0].id },
        data: { price: 0 },
      });
      await updateProfile(user.id, { bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.8 — removing all modalities unpublishes', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        include: { offers: { orderBy: { order: 'asc' } } },
      });
      await prisma.consultationOffer.update({
        where: { id: dbProfile!.offers[0].id },
        data: { modalities: [] },
      });
      await updateProfile(user.id, { bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      const p = await getMyProfile(user.id);
      expect(p.status).toBe('DRAFT');
    });

    it('2.9 — unpublishedAt is set on auto-unpublish', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { status: true, publishedAt: true, unpublishedAt: true },
      });
      expect(dbProfile!.status).toBe('DRAFT');
      expect(dbProfile!.publishedAt).not.toBeNull();
      expect(dbProfile!.unpublishedAt).not.toBeNull();
    });

    it('2.10 — publishedAt is preserved after auto-unpublish', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      const dbProfile = await prisma.professionalProfile.findUnique({
        where: { userId: user.id },
        select: { publishedAt: true },
      });
      expect(dbProfile!.publishedAt).not.toBeNull();
    });
  });

  // ===============================================================
  // 3. REPUBLICATION
  // ===============================================================

  describe('3. Republication', () => {
    it('3.1 — can re-publish after restoring requirements', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      expect((await getMyProfile(user.id)).status).toBe('DRAFT');
      await updateProfile(user.id, { bio: 'B'.repeat(PUBLICATION_MIN_BIO_LENGTH + 5) });
      const result = await publishProfile(user.id);
      expect(result.status).toBe('PUBLISHED');
      expect(result.publishedAt).not.toBeNull();
    });

    it('3.2 — re-publication sets new publishedAt', async () => {
      const { user } = await createReadyProfile();
      const first = await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      await updateProfile(user.id, { bio: 'C'.repeat(PUBLICATION_MIN_BIO_LENGTH + 5) });
      const second = await publishProfile(user.id);
      expect(second.status).toBe('PUBLISHED');
      expect(second.publishedAt).not.toBe(first.publishedAt);
    });
  });

  // ===============================================================
  // 4. EDGE CASES
  // ===============================================================

  describe('4. Edge cases', () => {
    it('4.1 — multiple consecutive publications (idempotence)', async () => {
      const { user } = await createReadyProfile();
      const r1 = await publishProfile(user.id);
      const r2 = await publishProfile(user.id);
      const r3 = await publishProfile(user.id);
      expect(r1.status).toBe('PUBLISHED');
      expect(r2.status).toBe('PUBLISHED');
      expect(r3.status).toBe('PUBLISHED');
      expect(r1.publishedAt).toBe(r2.publishedAt);
      expect(r2.publishedAt).toBe(r3.publishedAt);
    });

    it('4.2 — multiple consecutive auto-unpublishes (no error)', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      await updateProfile(user.id, { bio: null });
      const p1 = await getMyProfile(user.id);
      expect(p1.status).toBe('DRAFT');
      await updateProfile(user.id, { bio: 'A'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      await publishProfile(user.id);
      await updateProfile(user.id, { barAssociationId: null });
      const p2 = await getMyProfile(user.id);
      expect(p2.status).toBe('DRAFT');
    });

    it('4.3 — publish then unpublish then publish cycle', async () => {
      const { user } = await createReadyProfile();
      await publishProfile(user.id);
      expect((await getMyProfile(user.id)).status).toBe('PUBLISHED');
      await updateProfile(user.id, { bio: null });
      expect((await getMyProfile(user.id)).status).toBe('DRAFT');
      await updateProfile(user.id, { bio: 'D'.repeat(PUBLICATION_MIN_BIO_LENGTH + 10) });
      await publishProfile(user.id);
      expect((await getMyProfile(user.id)).status).toBe('PUBLISHED');
    });
  });
});

async function createProUserAndProfile() {
  const user = await createTestUser({
    email: `val-empty-${Date.now()}@e.com`,
    role: 'PROFESSIONAL',
    status: 'ACTIVE',
    firstName: 'Amina',
    lastName: 'El Fassi',
  });
  await ensureDraftProfile(user.id);
  return { user };
}
