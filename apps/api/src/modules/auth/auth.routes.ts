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

export { router as authRoutes };
