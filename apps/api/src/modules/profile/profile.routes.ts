import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate';
import { validate } from '../../core/middleware/validate';
import { updatePreferencesSchema } from './profile.schema';
import { getProfileController, updatePreferencesController } from './profile.controller';

const router = Router();

router.get('/', authenticate, getProfileController);
router.patch(
  '/preferences',
  authenticate,
  validate(updatePreferencesSchema),
  updatePreferencesController,
);

export { router as profileRoutes };
