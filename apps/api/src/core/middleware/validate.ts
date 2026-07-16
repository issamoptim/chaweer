import { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../../shared/errors/auth-errors';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      next(new ValidationError('Validation failed', details));
      return;
    }

    req.body = result.data;
    next();
  };
}
