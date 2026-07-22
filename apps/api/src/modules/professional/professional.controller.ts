import { Request, Response, NextFunction } from 'express';
import * as professionalService from './professional.service';
import { getReferential } from './referential.service';
import { photoStorageService } from '../../core/storage';
import { ValidationError } from '../../shared/errors/auth-errors';

export async function getReferentialController(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const referential = await getReferential();
    res.status(200).json({ success: true, data: referential });
  } catch (err) {
    next(err);
  }
}

export async function getMyProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await professionalService.getMyProfile(req.user!.userId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await professionalService.updateProfile(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function uploadPhotoController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      throw new ValidationError('Aucun fichier fourni.', [
        { field: 'file', message: 'Aucun fichier fourni.' },
      ]);
    }

    const photoUrl = await photoStorageService.upload(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    res.status(200).json({ success: true, data: { photoUrl } });
  } catch (err) {
    next(err);
  }
}

export async function updateExpertiseController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await professionalService.setExpertise(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function updateOfferController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await professionalService.setOffer(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function publishProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await professionalService.publishProfile(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
