import { Request, Response, NextFunction } from 'express';
import { setRefreshTokenCookie } from '../services/cookie.service';
import { googleAuthenticate } from './google-auth.service';
import type { Role } from '../../../generated/prisma/client';

export function googleAuthController(role: Role) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { code, codeVerifier, reactivate } = req.body;
      const { result, refreshToken } = await googleAuthenticate(code, codeVerifier, role, reactivate);
      setRefreshTokenCookie(res, refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
