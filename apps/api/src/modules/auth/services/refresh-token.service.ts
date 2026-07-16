import { randomBytes, createHash } from 'crypto';
import { env } from '../../../config/env';

export function generateRefreshToken(): string {
  return randomBytes(64).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function getRefreshTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRES_DAYS);
  return expiresAt;
}

export function getRefreshTokenMaxAgeSeconds(): number {
  return env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60;
}
