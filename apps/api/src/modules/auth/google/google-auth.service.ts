import { prisma } from '../../../core/database/prisma';
import { logger } from '../../../core/logger';
import { signAccessToken } from '../services/jwt.service';
import { createSession } from '../services/refresh-token.service';
import { toAuthUser } from '../auth.service';
import { exchangeCodeForTokens, verifyGoogleIdToken } from './google-token.service';
import {
  AccountSuspendedError,
  ProviderMismatchError,
  InvalidGoogleIdentityError,
} from '../../../shared/errors/auth-errors';
import type { AuthUser, LoginResult } from '../auth.types';
import type { GoogleClaims } from './google-auth.types';
import type { Role } from '../../../generated/prisma/client';

interface GoogleAuthResult {
  result: LoginResult;
  refreshToken: string;
}

export async function googleAuthenticate(
  code: string,
  codeVerifier: string,
  role: Role,
): Promise<GoogleAuthResult> {
  const tokens = await exchangeCodeForTokens(code, codeVerifier);
  const claims = await verifyGoogleIdToken(tokens.id_token);

  const user = await findOrCreateUser(claims, role);
  const refreshToken = await createSession(user.id);
  const accessToken = await signAccessToken({ userId: user.id, role: user.role });

  return {
    result: {
      accessToken,
      user: toAuthUser(user),
    },
    refreshToken,
  };
}

async function findOrCreateUser(
  claims: GoogleClaims,
  role: Role,
): Promise<AuthUser & { id: string; role: Role }> {
  const existingIdentity = await prisma.externalIdentity.findUnique({
    where: {
      provider_providerUserId: {
        provider: 'GOOGLE',
        providerUserId: claims.sub,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingIdentity) {
    const user = existingIdentity.user;

    if (user.status === 'SUSPENDED') {
      throw new AccountSuspendedError();
    }

    if (user.status === 'DELETED') {
      throw new AccountSuspendedError();
    }

    return user;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: claims.email.toLowerCase() },
  });

  if (existingUser) {
    if (existingUser.authProvider === 'LOCAL') {
      throw new ProviderMismatchError();
    }

    if (existingUser.authProvider === 'GOOGLE') {
      logger.error(
        {
          userId: existingUser.id,
          email: claims.email,
          sub: claims.sub,
        },
        'Google user exists without ExternalIdentity — data inconsistency',
      );
      throw new InvalidGoogleIdentityError();
    }

    throw new ProviderMismatchError();
  }

  const newUser = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: claims.email.toLowerCase(),
        firstName: claims.givenName,
        lastName: claims.familyName,
        avatarUrl: claims.picture,
        authProvider: 'GOOGLE',
        role,
        status: 'ACTIVE',
        passwordHash: null,
      },
    });

    await tx.externalIdentity.create({
      data: {
        userId: createdUser.id,
        provider: 'GOOGLE',
        providerUserId: claims.sub,
      },
    });

    return createdUser;
  });

  return newUser;
}
