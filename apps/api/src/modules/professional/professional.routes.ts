import { Router } from 'express';
import { authenticate } from '../../core/middleware/authenticate';
import { authorize } from '../../core/middleware/authorize';
import { validate } from '../../core/middleware/validate';
import { uploadPhoto } from '../../core/middleware/upload';
import {
  updateProfileSchema,
  updateExpertiseSchema,
  updateOfferSchema,
  updateContactSchema,
  updateOfficeSchema,
  setEducationSchema,
  setExperienceSchema,
  setCertificationsSchema,
  setMembershipsSchema,
} from './professional.schema';
import {
  getReferentialController,
  getMyProfileController,
  updateProfileController,
  uploadPhotoController,
  updateExpertiseController,
  updateOfferController,
  deleteOfferController,
  publishProfileController,
  unpublishProfileController,
  updateContactController,
  updateOfficeController,
  setEducationController,
  setExperienceController,
  setCertificationsController,
  setMembershipsController,
} from './professional.controller';

const router = Router();

router.get('/referential', authenticate, authorize('PROFESSIONAL'), getReferentialController);

router.get('/me', authenticate, authorize('PROFESSIONAL'), getMyProfileController);

router.post(
  '/upload-photo',
  authenticate,
  authorize('PROFESSIONAL'),
  uploadPhoto.single('photo'),
  uploadPhotoController,
);

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

router.delete(
  '/offer',
  authenticate,
  authorize('PROFESSIONAL'),
  deleteOfferController,
);

router.post(
  '/profile/publish',
  authenticate,
  authorize('PROFESSIONAL'),
  publishProfileController,
);

router.post(
  '/profile/unpublish',
  authenticate,
  authorize('PROFESSIONAL'),
  unpublishProfileController,
);

router.patch(
  '/contact',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(updateContactSchema),
  updateContactController,
);

router.patch(
  '/office',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(updateOfficeSchema),
  updateOfficeController,
);

router.put(
  '/education',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(setEducationSchema),
  setEducationController,
);

router.put(
  '/experience',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(setExperienceSchema),
  setExperienceController,
);

router.put(
  '/certifications',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(setCertificationsSchema),
  setCertificationsController,
);

router.put(
  '/memberships',
  authenticate,
  authorize('PROFESSIONAL'),
  validate(setMembershipsSchema),
  setMembershipsController,
);

export { router as professionalRoutes };
