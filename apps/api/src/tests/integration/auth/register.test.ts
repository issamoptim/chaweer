import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../app';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase } from '../../helpers/db-helper';

describe('POST /auth/register (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user and return 201', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe(
      'Votre compte a été créé. Veuillez vérifier votre adresse e-mail.',
    );
  });

  it('should return 409 for duplicate email', async () => {
    await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const response = await request(app).post('/auth/register').send({
      email: 'duplicate@example.com',
      password: 'AnotherPass456!',
      firstName: 'Jane',
      lastName: 'Smith',
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('should return 422 for invalid email', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'not-an-email',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 for weak password', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'weakpass@example.com',
      password: 'weak',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 422 for missing fields', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'missing@example.com',
    });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should hash the password in the database', async () => {
    await request(app).post('/auth/register').send({
      email: 'hashed@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const user = await prisma.user.findUnique({
      where: { email: 'hashed@example.com' },
    });

    expect(user).not.toBeNull();
    expect(user!.passwordHash).not.toBe('SecurePass123!');
    expect(user!.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it('should set status to PENDING_EMAIL_VERIFICATION', async () => {
    await request(app).post('/auth/register').send({
      email: 'status@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const user = await prisma.user.findUnique({
      where: { email: 'status@example.com' },
    });

    expect(user!.status).toBe('PENDING_EMAIL_VERIFICATION');
  });

  it('should set role to CLIENT', async () => {
    await request(app).post('/auth/register').send({
      email: 'role@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const user = await prisma.user.findUnique({
      where: { email: 'role@example.com' },
    });

    expect(user!.role).toBe('CLIENT');
  });

  it('should set authProvider to LOCAL', async () => {
    await request(app).post('/auth/register').send({
      email: 'provider@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const user = await prisma.user.findUnique({
      where: { email: 'provider@example.com' },
    });

    expect(user!.authProvider).toBe('LOCAL');
  });

  it('should not return a JWT in the response', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'nojwt@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(response.body.data.accessToken).toBeUndefined();
  });

  it('should not create a refresh token', async () => {
    await request(app).post('/auth/register').send({
      email: 'norefresh@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });

    const tokens = await prisma.refreshToken.findMany();
    expect(tokens).toHaveLength(0);
  });
});
