import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import { authIpLimiter, authEmailLimiter } from '../../core/middleware/rate-limiter';
import { registerSchema, loginSchema } from './auth.schema';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from './auth.controller';
import { googleAuthSchema } from './google/google-auth.schema';
import { googleAuthController } from './google/google-auth.controller';

const router = Router();

router.post(
  '/register',
  authIpLimiter,
  authEmailLimiter,
  validate(registerSchema),
  registerController,
);

router.post(
  '/login',
  authIpLimiter,
  authEmailLimiter,
  validate(loginSchema),
  loginController,
);

router.post('/refresh', authIpLimiter, refreshController);

router.post('/logout', authIpLimiter, logoutController);

router.post(
  '/google/client',
  authIpLimiter,
  validate(googleAuthSchema),
  googleAuthController('CLIENT'),
);

router.post(
  '/google/professional',
  authIpLimiter,
  validate(googleAuthSchema),
  googleAuthController('PROFESSIONAL'),
);

export { router as authRoutes };
