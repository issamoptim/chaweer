import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { env } from '../../config/env';

const windowMs = env.RATE_LIMIT_WINDOW_MS;
const maxRequests = env.RATE_LIMIT_MAX_REQUESTS;
const isTest = env.NODE_ENV === 'test';

export const authIpLimiter = rateLimit({
  windowMs,
  limit: maxRequests,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? 'unknown'),
  skip: isTest ? () => true : undefined,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Trop de requêtes. Veuillez réessayer plus tard.',
    },
  },
});

export const authEmailLimiter = rateLimit({
  windowMs,
  limit: maxRequests,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email;
    if (typeof email === 'string' && email.length > 0) {
      return `email:${email.toLowerCase().trim()}`;
    }
    return ipKeyGenerator(req.ip ?? 'unknown');
  },
  skip: isTest ? () => true : undefined,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Trop de tentatives pour cette adresse e-mail. Veuillez réessayer plus tard.',
    },
  },
});
