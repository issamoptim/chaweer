import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import { authenticate } from '../../core/middleware/authenticate';
import { authIpLimiter, authEmailLimiter } from '../../core/middleware/rate-limiter';
import {
  registerSchema,
  registerProfessionalSchema,
  loginSchema,
  changePasswordSchema,
} from './auth.schema';
import {
  registerController,
  registerProfessionalController,
  loginController,
  refreshController,
  logoutController,
  meController,
  changePasswordController,
  deleteAccountController,
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

router.post(
  '/register/professional',
  authIpLimiter,
  authEmailLimiter,
  validate(registerProfessionalSchema),
  registerProfessionalController,
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

router.get('/me', authenticate, meController);

router.patch('/password', authIpLimiter, authenticate, validate(changePasswordSchema), changePasswordController);

router.delete('/account', authenticate, deleteAccountController);

export { router as authRoutes };
