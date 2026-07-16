import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import * as authService from './auth.service';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from './services/cookie.service';
import { InvalidRefreshTokenError } from '../../shared/errors/auth-errors';

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: {
        message: 'Votre compte a été créé. Veuillez vérifier votre adresse e-mail.',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { result, refreshToken } = await authService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawToken = req.cookies?.[env.COOKIE_NAME];

    if (!rawToken) {
      throw new InvalidRefreshTokenError('Refresh token manquant.');
    }

    const { accessToken, newRefreshToken } = await authService.refresh(rawToken);
    setRefreshTokenCookie(res, newRefreshToken);
    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawToken = req.cookies?.[env.COOKIE_NAME];

    if (rawToken) {
      await authService.logout(rawToken);
    }

    clearRefreshTokenCookie(res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function meController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
