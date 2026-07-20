import { Request, Response, NextFunction } from 'express';
import * as professionalService from './professional.service';
import { getReferential } from './referential.service';

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
