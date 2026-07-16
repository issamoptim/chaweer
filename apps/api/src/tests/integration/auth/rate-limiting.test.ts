import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import { rateLimit } from 'express-rate-limit';
import { prisma } from '../../../core/database/prisma';
import { cleanDatabase, createTestUser } from '../../helpers/db-helper';
import { validate } from '../../../core/middleware/validate';
import { loginSchema } from '../../../modules/auth/auth.schema';
import { loginController } from '../../../modules/auth/auth.controller';

function createRateLimitedApp(limit: number) {
  const app = express();
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 900000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
      },
    },
  });

  app.post('/auth/login', limiter, validate(loginSchema), loginController);
  return app;
}

describe('Rate limiting (integration)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 429 after exceeding IP rate limit on login', async () => {
    await createTestUser({
      email: 'ratelimit@example.com',
      password: 'SecurePass123!',
      status: 'ACTIVE',
    });

    const app = createRateLimitedApp(5);

    let lastStatus = 0;
    for (let i = 0; i < 7; i++) {
      const response = await request(app).post('/auth/login').send({
        email: 'ratelimit@example.com',
        password: 'WrongPass123!',
      });
      lastStatus = response.status;
    }

    expect(lastStatus).toBe(429);
  });

  it('should return 429 after exceeding rate limit with different emails', async () => {
    const app = createRateLimitedApp(3);

    let lastStatus = 0;
    for (let i = 0; i < 5; i++) {
      const response = await request(app).post('/auth/login').send({
        email: `user${i}@example.com`,
        password: 'SecurePass123!',
      });
      lastStatus = response.status;
    }

    expect(lastStatus).toBe(429);
  });
});
