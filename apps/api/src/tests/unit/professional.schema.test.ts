import { describe, it, expect } from 'vitest';
import {
  updateProfileSchema,
  updateExpertiseSchema,
  updateOfferSchema,
} from '../../modules/professional/professional.schema';

describe('updateProfileSchema', () => {
  it('rejects an empty payload', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(false);
  });

  it('accepts a partial payload', () => {
    const result = updateProfileSchema.safeParse({ firstName: 'Amina' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty first name', () => {
    const result = updateProfileSchema.safeParse({ firstName: '' });
    expect(result.success).toBe(false);
  });

  it('allows clearing optional fields with null', () => {
    const result = updateProfileSchema.safeParse({ bio: null });
    expect(result.success).toBe(true);
  });

  it('accepts the full payload sent by ProfessionalProfilePage form', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      professionalTitle: 'Avocate',
      photoUrl: null,
      barAssociationId: null,
      bio: null,
    });
    expect(result.success).toBe(true);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
    }
  });

  it('accepts the full payload with non-empty optional fields', () => {
    const result = updateProfileSchema.safeParse({
      firstName: 'Amina',
      lastName: 'El Fassi',
      professionalTitle: 'Avocate',
      photoUrl: 'https://example.com/photo.jpg',
      barAssociationId: 'bar-1',
      bio: 'Avocate expérimentée',
    });
    expect(result.success).toBe(true);
  });
});

describe('updateExpertiseSchema', () => {
  it('requires at least one specialization (PD-06)', () => {
    expect(
      updateExpertiseSchema.safeParse({
        specializationIds: [],
        practiceAreaIds: ['a'],
        languageIds: ['b'],
      }).success,
    ).toBe(false);
  });

  it('accepts empty practice areas and languages (PD-06 — optional)', () => {
    expect(
      updateExpertiseSchema.safeParse({
        specializationIds: ['a'],
        practiceAreaIds: [],
        languageIds: [],
      }).success,
    ).toBe(true);
  });

  it('accepts a valid selection', () => {
    const result = updateExpertiseSchema.safeParse({
      specializationIds: ['s1'],
      practiceAreaIds: ['p1', 'p2'],
      languageIds: ['l1'],
    });
    expect(result.success).toBe(true);
  });
});

describe('updateOfferSchema', () => {
  const validOffer = {
    title: 'Consultation juridique',
    description: 'Un accompagnement personnalisé.',
    price: 300,
    modalities: ['VIDEO'],
  };

  it('rejects a non-positive price', () => {
    expect(updateOfferSchema.safeParse({ ...validOffer, price: 0 }).success).toBe(false);
  });

  it('rejects a missing title (PD-01)', () => {
    const { title: _omit, ...rest } = validOffer;
    void _omit;
    expect(updateOfferSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects a missing description (PD-01)', () => {
    const { description: _omit, ...rest } = validOffer;
    void _omit;
    expect(updateOfferSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an empty modalities list', () => {
    expect(updateOfferSchema.safeParse({ ...validOffer, modalities: [] }).success).toBe(false);
  });

  it('rejects an unknown modality (OFFICE removed — PD-03)', () => {
    expect(updateOfferSchema.safeParse({ ...validOffer, modalities: ['OFFICE'] }).success).toBe(
      false,
    );
  });

  it('accepts a valid offer with VIDEO/AUDIO/CHAT modalities (PD-03)', () => {
    const result = updateOfferSchema.safeParse({
      ...validOffer,
      modalities: ['VIDEO', 'AUDIO', 'CHAT'],
    });
    expect(result.success).toBe(true);
  });
});
