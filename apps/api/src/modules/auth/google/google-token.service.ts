import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../../../config/env';
import { logger } from '../../../core/logger';
import {
  GoogleAuthFailedError,
  InvalidGoogleTokenError,
  GoogleAccountNotVerifiedError,
} from '../../../shared/errors/auth-errors';
import type { GoogleClaims, GoogleTokenResponse } from './google-auth.types';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUER = 'https://accounts.google.com';

const googleJwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL), {
  cooldownDuration: 30_000,
});

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.warn(
        { statusCode: response.status, errorBody },
        'Google token exchange failed',
      );
      throw new GoogleAuthFailedError();
    }

    const data = (await response.json()) as GoogleTokenResponse;
    return data;
  } catch (error) {
    if (error instanceof GoogleAuthFailedError) {
      throw error;
    }
    logger.warn({ err: error }, 'Google token exchange network error');
    throw new GoogleAuthFailedError();
  }
}

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleClaims> {
  let payload;

  try {
    const result = await jwtVerify(idToken, googleJwks, {
      issuer: GOOGLE_ISSUER,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = result.payload;
  } catch (error) {
    logger.warn({ err: error }, 'Google ID token verification failed');
    throw new InvalidGoogleTokenError();
  }

  if (payload.email_verified !== true) {
    throw new GoogleAccountNotVerifiedError();
  }

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new InvalidGoogleTokenError();
  }

  if (!payload.email || typeof payload.email !== 'string') {
    throw new InvalidGoogleTokenError();
  }

  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified as boolean,
    givenName: (payload.given_name as string) ?? '',
    familyName: (payload.family_name as string) ?? '',
    picture: (payload.picture as string) ?? null,
  };
}
