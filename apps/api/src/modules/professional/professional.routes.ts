import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate';
import { authorize } from '../../core/middleware/authorize';
import { validate } from '../../core/middleware/validate';
import {
  updateProfileSchema,
  updateExpertiseSchema,
  updateOfferSchema,
} from './professional.schema';
import {
  getReferentialController,
  getMyProfileController,
  updateProfileController,
  updateExpertiseController,
  updateOfferController,
} from './professional.controller';

const router = Router();

router.get('/referential', authenticate, authorize('PROFESSIONAL'), getReferentialController);

router.get('/me', authenticate, authorize('PROFESSIONAL'), getMyProfileController);

router.patch(
  '/profile',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(updateProfileSchema),
  updateProfileController,
);

router.put(
  '/expertise',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(updateExpertiseSchema),
  updateExpertiseController,
);

router.put(
  '/offer',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(updateOfferSchema),
  updateOfferController,
);

export { router as professionalRoutes };
