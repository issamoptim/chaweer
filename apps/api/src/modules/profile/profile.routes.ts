import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate';
import { validate } from '../../core/middleware/validate';
import { updatePreferencesSchema, updateProfileSchema } from './profile.schema';
import { getProfileController, updatePreferencesController, updateProfileController } from './profile.controller';

const router = Router();

router.get('/', authenticate, getProfileController);
router.patch(
  '/',
  authenticate,
  validate(updateProfileSchema),
  updateProfileController,
);
router.patch(
  '/preferences',
  authenticate,
  validate(updatePreferencesSchema),
  updatePreferencesController,
);

export { router as profileRoutes };
