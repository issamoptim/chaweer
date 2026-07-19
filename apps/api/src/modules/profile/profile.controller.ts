import { Request, Response, NextFunction } from 'express';
import * as profileService from './profile.service';
import type { UpdateProfileInput } from './profile.types';

export async function getProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await profileService.getProfile(req.user!.userId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferencesController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await profileService.updatePreferences(req.user!.userId, req.body);
    res.status(200).json({
      success: true,
      data: profile,
    });
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
    const profile = await profileService.updateProfile(
      req.user!.userId,
      req.body as UpdateProfileInput,
    );
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}
