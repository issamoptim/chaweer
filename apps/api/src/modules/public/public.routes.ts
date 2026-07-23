import { Router } from 'express';
import { getPublicProfileController } from '../professional/professional.controller';

const router = Router();

router.get('/professional/:id', getPublicProfileController);

export { router as publicRoutes };
