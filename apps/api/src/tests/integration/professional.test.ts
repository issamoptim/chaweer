import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../core/database/prisma';

const email = `pro-${Date.now()}@example.com`;
const password = 'Password1';

let accessToken = '';

interface ReferentialResponse {
  specializations: Array<{
    id: string;
    practiceAreas: Array<{ id: string }>;
  }>;
  languages: Array<{ id: string }>;
  barAssociations: Array<{ id: string }>;
  cities: Array<{ id: string }>;
}

let referential: ReferentialResponse;

function auth(token: string) {
  return { Authorization: `Bearer ${token}` };
}

describe('Professional onboarding flow', () => {
  beforeAll(async () => {
    const res = await request(app).post('/auth/register/professional').send({ email, password });
    expect(res.status).toBe(201);
    accessToken = res.body.data.accessToken;

    const ref = await request(app).get('/professional/referential').set(auth(accessToken));
    referential = ref.body.data;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('creates a professional account with a DRAFT profile', async () => {
    const res = await request(app).get('/professional/me').set(auth(accessToken));
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('DRAFT');
    expect(res.body.data.completion).toEqual({
      percentage: 0,
      completedSections: 0,
      totalSections: 10,
      sections: {
        identity: false,
        biography: false,
        contact: false,
        office: false,
        expertise: false,
        offer: false,
        education: false,
        experience: false,
        certifications: false,
        memberships: false,
      },
    });
  });

  it('rejects a duplicate registration', async () => {
    const res = await request(app).post('/auth/register/professional').send({ email, password });
    expect(res.status).toBe(409);
  });

  it('rejects unauthenticated access to the profile', async () => {
    const res = await request(app).get('/professional/me');
    expect(res.status).toBe(401);
  });

  it('exposes the seeded referential', () => {
    expect(referential.specializations.length).toBeGreaterThan(0);
    expect(referential.languages.length).toBeGreaterThan(0);
    expect(referential.barAssociations.length).toBeGreaterThan(0);
    expect(referential.cities.length).toBeGreaterThan(0);
  });

  it('updates the profile and marks identity complete', async () => {
    const res = await request(app).patch('/professional/profile').set(auth(accessToken)).send({
      firstName: 'Amina',
      lastName: 'El Fassi',
      professionalTitle: 'Avocate',
      barAssociationId: referential.barAssociations[0].id,
      bio: 'Avocate au barreau de Casablanca.',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.identity.firstName).toBe('Amina');
    expect(res.body.data.identity.lastName).toBe('El Fassi');
    expect(res.body.data.identity.professionalTitle).toBe('Avocate');
    expect(res.body.data.biography.bio).toBe('Avocate au barreau de Casablanca.');
  });

  it('rejects a practice area that does not belong to a selected specialization', async () => {
    const specA = referential.specializations[0];
    const specB = referential.specializations[1];
    const res = await request(app)
      .put('/professional/expertise')
      .set(auth(accessToken))
      .send({
        specializationIds: [specA.id],
        practiceAreaIds: [specB.practiceAreas[0].id],
        languageIds: [referential.languages[0].id],
      });
    expect(res.status).toBe(422);
  });

  it('saves a valid expertise selection', async () => {
    const spec = referential.specializations[0];
    const res = await request(app)
      .put('/professional/expertise')
      .set(auth(accessToken))
      .send({
        specializationIds: [spec.id],
        practiceAreaIds: [spec.practiceAreas[0].id],
        languageIds: [referential.languages[0].id],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.specializationIds).toEqual([spec.id]);
    expect(res.body.data.practiceAreaIds).toEqual([spec.practiceAreas[0].id]);
    expect(res.body.data.languageIds).toEqual([referential.languages[0].id]);
  });

  it('saves a valid consultation offer', async () => {
    const res = await request(app)
      .put('/professional/offer')
      .set(auth(accessToken))
      .send({ price: 400, durationMinutes: 30, modalities: ['VIDEO'] });
    expect(res.status).toBe(200);
    expect(res.body.data.offers).toHaveLength(1);
    expect(res.body.data.offers[0]).toMatchObject({
      price: 400,
      durationMinutes: 30,
      currency: 'MAD',
    });
    expect(res.body.data.completion.sections.offer).toBe(true);
  });

  it('rejects an invalid offer', async () => {
    const res = await request(app)
      .put('/professional/offer')
      .set(auth(accessToken))
      .send({ price: 0, durationMinutes: 30, modalities: ['VIDEO'] });
    expect(res.status).toBe(422);
  });
});
