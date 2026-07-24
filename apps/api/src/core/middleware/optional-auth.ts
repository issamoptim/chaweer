import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../modules/auth/services/jwt.service';

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (header && header.startsWith('Bearer ')) {
      const token = header.slice('Bearer '.length).trim();
      if (token) {
        const payload = await verifyAccessToken(token);
        req.user = payload;
      }
    }
  } catch {
    // Ignore errors — optional auth means we proceed without user
  }

  next();
}
