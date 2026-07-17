import { Response } from 'express';
import { env } from '../../../config/env';
import { getRefreshTokenMaxAgeSeconds } from './refresh-token.service';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: env.COOKIE_PATH,
    domain: env.COOKIE_DOMAIN,
    maxAge: getRefreshTokenMaxAgeSeconds() * 1000,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: env.COOKIE_PATH,
    domain: env.COOKIE_DOMAIN,
  });
}
