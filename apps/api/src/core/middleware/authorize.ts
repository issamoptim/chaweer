import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/auth-errors';
import type { Role } from '../../generated/prisma/client';

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentification requise.'));
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      next(new ForbiddenError('Accès réservé aux professionnels.'));
      return;
    }

    next();
  };
}
