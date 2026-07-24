import { Router, Request, Response, NextFunction } from 'express';
import { getPublicProfileController } from '../professional/professional.controller';
import { listPublicProfessionals } from './public.service';
import { getPublicReferential } from './public-referential.service';
import { optionalAuth } from '../../core/middleware/optional-auth';

async function listPublicProfessionalsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const specializationKeys = req.query.specialization
      ? Array.isArray(req.query.specialization)
        ? (req.query.specialization as string[])
        : [req.query.specialization as string]
      : undefined;
    const result = await listPublicProfessionals({
      specializationKeys,
      cityKey: req.query.city as string | undefined,
      query: req.query.q as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getPublicReferentialController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const referential = await getPublicReferential();
    res.status(200).json({ success: true, data: referential });
  } catch (err) {
    next(err);
  }
}

const router = Router();

router.get('/professionals', listPublicProfessionalsController);
router.get('/referential', getPublicReferentialController);
router.get('/professional/:id', optionalAuth, getPublicProfileController);

export { router as publicRoutes };
