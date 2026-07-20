import { prisma } from '../../core/database/prisma';
import { hashPassword, verifyPassword } from './services/password.service';
import { signAccessToken } from './services/jwt.service';
import {
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiry,
  createSession,
} from './services/refresh-token.service';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  EmailNotVerifiedError,
  AccountSuspendedError,
  InvalidRefreshTokenError,
  TokenExpiredError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
} from '../../shared/errors/auth-errors';
import { NotFoundError } from '../../core/errors';
import { ensureDraftProfile } from '../professional/professional.service';
import { AuthProvider, UserStatus, Role } from '../../generated/prisma/client';
import type { AuthUser, LoginResult, RefreshResult, MeUser, ChangePasswordInput } from './auth.types';
import type { RegisterInput, LoginInput, RegisterProfessionalInput } from './auth.schema';

export function toAuthUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  authProvider: string;
  status: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    authProvider: user.authProvider,
    status: user.status,
  };
}

export async function register(input: RegisterInput): Promise<void> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      authProvider: AuthProvider.LOCAL,
      role: 'CLIENT',
      status: UserStatus.PENDING_EMAIL_VERIFICATION,
    },
  });
}

export async function registerProfessional(
  input: RegisterProfessionalInput,
): Promise<{ result: LoginResult; refreshToken: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: '',
        lastName: '',
        authProvider: AuthProvider.LOCAL,
        role: Role.PROFESSIONAL,
        status: UserStatus.ACTIVE,
      },
    });

    await ensureDraftProfile(createdUser.id, tx);

    return createdUser;
  });

  const accessToken = await signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createSession(user.id);

  return {
    result: {
      accessToken,
      user: toAuthUser(user),
    },
    refreshToken,
  };
}

export async function login(
  input: LoginInput,
): Promise<{ result: LoginResult; refreshToken: string }> {
  // Step 1: Find user by email
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  // Step 2: If no user → 401 (account enumeration protection)
  if (!user) {
    throw new InvalidCredentialsError();
  }

  // Step 3: Check authProvider == LOCAL (same error to avoid enumeration)
  if (user.authProvider !== AuthProvider.LOCAL) {
    throw new InvalidCredentialsError();
  }

  // Step 4: Verify password with Argon2id
  if (!user.passwordHash) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await verifyPassword(user.passwordHash, input.password);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  // Step 5: Check status — DELETED
  if (user.status === UserStatus.DELETED) {
    throw new InvalidCredentialsError();
  }

  // Step 6: Check status — PENDING_EMAIL_VERIFICATION
  if (user.status === UserStatus.PENDING_EMAIL_VERIFICATION) {
    throw new EmailNotVerifiedError();
  }

  // Step 7: Check status — SUSPENDED
  if (user.status === UserStatus.SUSPENDED) {
    throw new AccountSuspendedError();
  }

  // Step 7: Success — create access token + refresh token + session
  const accessToken = await signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createSession(user.id);

  return {
    result: {
      accessToken,
      user: toAuthUser(user),
    },
    refreshToken,
  };
}

export async function refresh(rawToken: string): Promise<RefreshResult & { newRefreshToken: string }> {
  const tokenHash = hashRefreshToken(rawToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken) {
    throw new InvalidRefreshTokenError();
  }

  if (storedToken.revokedAt !== null) {
    throw new InvalidRefreshTokenError();
  }

  if (storedToken.expiresAt < new Date()) {
    throw new TokenExpiredError();
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
  });

  if (!user) {
    throw new InvalidRefreshTokenError();
  }

  // Rotation: revoke old token + create new token (atomic)
  const newRefreshToken = await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const rawToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(rawToken);
    const expiresAt = getRefreshTokenExpiry();

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    return rawToken;
  });

  const accessToken = await signAccessToken({ userId: user.id, role: user.role });

  return {
    accessToken,
    newRefreshToken,
  };
}

export async function logout(rawToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(rawToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!storedToken || storedToken.revokedAt !== null) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });
}

export async function getCurrentUser(userId: string): Promise<MeUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      authProvider: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Authentification requise.');
  }

  return user;
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedError('Authentification requise.');
  }

  if (user.authProvider !== AuthProvider.LOCAL) {
    throw new ForbiddenError(
      'Le changement de mot de passe n\'est pas disponible pour ce type de compte.',
    );
  }

  if (!user.passwordHash) {
    throw new ForbiddenError(
      'Le changement de mot de passe n\'est pas disponible pour ce type de compte.',
    );
  }

  const isCurrentPasswordValid = await verifyPassword(
    user.passwordHash,
    input.currentPassword,
  );

  if (!isCurrentPasswordValid) {
    throw new InvalidCredentialsError('Le mot de passe actuel est incorrect.');
  }

  const isSamePassword = await verifyPassword(user.passwordHash, input.newPassword);
  if (isSamePassword) {
    throw new ValidationError(
      'Le nouveau mot de passe doit être différent du mot de passe actuel.',
      [{ field: 'newPassword', message: 'Le nouveau mot de passe doit être différent du mot de passe actuel.' }],
    );
  }

  const newHash = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });
}

export async function deleteAccount(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError('Utilisateur non trouvé.');
  }

  await prisma.$transaction([
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED },
    }),
  ]);
}
