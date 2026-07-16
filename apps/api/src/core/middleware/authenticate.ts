import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../modules/auth/services/jwt.service';
import { UnauthorizedError } from '../../shared/errors/auth-errors';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      next(new UnauthorizedError('Authentification requise.'));
      return;
    }

    const token = header.slice('Bearer '.length).trim();

    if (!token) {
      next(new UnauthorizedError('Authentification requise.'));
      return;
    }

    const payload = await verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError('Authentification requise.'));
  }
}
