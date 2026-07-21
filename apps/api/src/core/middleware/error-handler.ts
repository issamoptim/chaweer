import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from '../logger';
import { ErrorCodes } from '../../shared/errors/error-codes';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    logger.warn(
      { statusCode: err.statusCode, errorCode: err.errorCode, message: err.message },
      'Operational error',
    );
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode ?? ErrorCodes.INTERNAL_ERROR,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error({ err }, 'Unexpected error');
  res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'Internal server error',
    },
  });
}
