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

export async function deleteOfferController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await professionalService.deleteOffer(req.user!.userId);
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

export async function unpublishProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await professionalService.unpublishProfile(req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateContactController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const contact = await professionalService.updateContact(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function updateOfficeController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const office = await professionalService.updateOffice(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: office });
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const viewerUserId = req.user?.userId;
    const profile = await professionalService.getPublicProfile(String(req.params.id), viewerUserId);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function setEducationController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const education = await professionalService.setEducation(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: education });
  } catch (err) {
    next(err);
  }
}

export async function setExperienceController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const experience = await professionalService.setExperience(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    next(err);
  }
}

export async function setCertificationsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const certifications = await professionalService.setCertifications(req.user!.userId, req.body);
    res.status(200).json({ success: true, data: certifications });
  } catch (err) {
    next(err);
  }
}
