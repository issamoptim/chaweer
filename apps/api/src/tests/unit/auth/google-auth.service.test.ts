import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../core/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    externalIdentity: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    professionalProfile: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(async (fn: (tx: unknown) => Promise<unknown>) => fn({
      user: {
        create: vi.fn(),
      },
      externalIdentity: {
        create: vi.fn(),
      },
    })),
  },
}));

vi.mock('../../../modules/auth/services/jwt.service', () => ({
  signAccessToken: vi.fn().mockResolvedValue('mocked-chaweer-jwt'),
}));

vi.mock('../../../modules/auth/services/refresh-token.service', () => ({
  createSession: vi.fn().mockResolvedValue('mocked-refresh-token'),
  generateRefreshToken: vi.fn().mockReturnValue('mocked-raw-token'),
  hashRefreshToken: vi.fn().mockReturnValue('mocked-hash'),
  getRefreshTokenExpiry: vi.fn().mockReturnValue(new Date()),
  getRefreshTokenMaxAgeSeconds: vi.fn().mockReturnValue(2592000),
}));

vi.mock('../../../modules/auth/auth.service', () => ({
  toAuthUser: vi.fn((user: Record<string, unknown>) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    authProvider: user.authProvider,
    status: user.status,
  })),
}));

vi.mock('../../../modules/auth/google/google-token.service', () => ({
  exchangeCodeForTokens: vi.fn().mockResolvedValue({
    id_token: 'mock-id-token',
    access_token: 'mock-access-token',
    expires_in: 3599,
    token_type: 'Bearer',
    scope: 'openid profile email',
  }),
  verifyGoogleIdToken: vi.fn(),
}));

vi.mock('../../../core/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

const { prisma } = await import('../../../core/database/prisma');
const { signAccessToken } = await import('../../../modules/auth/services/jwt.service');
const { createSession } = await import('../../../modules/auth/services/refresh-token.service');
const { exchangeCodeForTokens, verifyGoogleIdToken } = await import(
  '../../../modules/auth/google/google-token.service'
);
const { googleAuthenticate } = await import(
  '../../../modules/auth/google/google-auth.service'
);

const mockGoogleClaims = {
  sub: 'google-sub-123',
  email: 'user@gmail.com',
  emailVerified: true,
  givenName: 'John',
  familyName: 'Doe',
  picture: 'https://lh3.googleusercontent.com/photo.jpg',
};

const mockExistingGoogleUser = {
  id: 'user-1',
  email: 'user@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: 'https://lh3.googleusercontent.com/photo.jpg',
  role: 'CLIENT',
  authProvider: 'GOOGLE',
  status: 'ACTIVE',
};

describe('google-auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exchangeCodeForTokens).mockResolvedValue({
      id_token: 'mock-id-token',
      access_token: 'mock-access-token',
      expires_in: 3599,
      token_type: 'Bearer',
      scope: 'openid profile email',
    });
    vi.mocked(verifyGoogleIdToken).mockResolvedValue(mockGoogleClaims);
    vi.mocked(signAccessToken).mockResolvedValue('mocked-chaweer-jwt');
    vi.mocked(createSession).mockResolvedValue('mocked-refresh-token');
  });

  describe('First Google login — account creation', () => {
    it('should create User + ExternalIdentity when no identity and no user exist', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const txUserCreate = vi.fn().mockResolvedValue({
        id: 'new-user-1',
        email: 'user@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: 'https://lh3.googleusercontent.com/photo.jpg',
        role: 'CLIENT',
        authProvider: 'GOOGLE',
        status: 'ACTIVE',
      });
      const txExtIdentityCreate = vi.fn().mockResolvedValue({});
      vi.mocked(prisma.$transaction).mockImplementation(
        async (fn) => fn({
          user: { create: txUserCreate },
          externalIdentity: { create: txExtIdentityCreate },
        }) as never,
      );

      const result = await googleAuthenticate('code', 'verifier', 'CLIENT');

      expect(txUserCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'user@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          avatarUrl: 'https://lh3.googleusercontent.com/photo.jpg',
          authProvider: 'GOOGLE',
          role: 'CLIENT',
          status: 'ACTIVE',
          passwordHash: null,
        }),
      });
      expect(txExtIdentityCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'new-user-1',
          provider: 'GOOGLE',
          providerUserId: 'google-sub-123',
        }),
      });
      expect(result.result.accessToken).toBe('mocked-chaweer-jwt');
      expect(result.refreshToken).toBe('mocked-refresh-token');
    });

    it('should create user with PROFESSIONAL role when endpoint is professional', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const txUserCreate = vi.fn().mockResolvedValue({
        id: 'new-user-2',
        email: 'user@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: null,
        role: 'PROFESSIONAL',
        authProvider: 'GOOGLE',
        status: 'ACTIVE',
      });
      vi.mocked(prisma.$transaction).mockImplementation(
        async (fn) => fn({
          user: { create: txUserCreate },
          externalIdentity: { create: vi.fn().mockResolvedValue({}) },
        }) as never,
      );
      vi.mocked(prisma.professionalProfile.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.professionalProfile.create).mockResolvedValue({
        id: 'profile-2',
      } as never);

      await googleAuthenticate('code', 'verifier', 'PROFESSIONAL');

      expect(txUserCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          role: 'PROFESSIONAL',
        }),
      });
      expect(prisma.professionalProfile.create).toHaveBeenCalledWith({
        data: { userId: 'new-user-2', status: 'DRAFT' },
        select: { id: true },
      });
    });
  });

  describe('Returning Google login — existing account', () => {
    it('should login without creating new records when ExternalIdentity found', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue({
        id: 'ext-1',
        userId: 'user-1',
        provider: 'GOOGLE',
        providerUserId: 'google-sub-123',
        user: mockExistingGoogleUser,
      } as never);

      const result = await googleAuthenticate('code', 'verifier', 'CLIENT');

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(result.result.accessToken).toBe('mocked-chaweer-jwt');
      expect(result.result.user.email).toBe('user@gmail.com');
    });
  });

  describe('Email already used by LOCAL account', () => {
    it('should throw ProviderMismatchError when LOCAL user exists with same email', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'local-user-1',
        email: 'user@gmail.com',
        authProvider: 'LOCAL',
      } as never);

      await expect(
        googleAuthenticate('code', 'verifier', 'CLIENT'),
      ).rejects.toThrow(
        'Cette adresse e-mail est déjà utilisée avec une autre méthode de connexion.',
      );
    });
  });

  describe('Google user without ExternalIdentity — data inconsistency', () => {
    it('should throw InvalidGoogleIdentityError', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'google-user-1',
        email: 'user@gmail.com',
        authProvider: 'GOOGLE',
      } as never);

      await expect(
        googleAuthenticate('code', 'verifier', 'CLIENT'),
      ).rejects.toThrow('Identité Google invalide.');
    });
  });

  describe('Suspended Google account', () => {
    it('should throw AccountSuspendedError', async () => {
      vi.mocked(prisma.externalIdentity.findUnique).mockResolvedValue({
        id: 'ext-1',
        userId: 'user-1',
        provider: 'GOOGLE',
        providerUserId: 'google-sub-123',
        user: { ...mockExistingGoogleUser, status: 'SUSPENDED' },
      } as never);

      await expect(
        googleAuthenticate('code', 'verifier', 'CLIENT'),
      ).rejects.toThrow('Votre compte est suspendu. Veuillez contacter le support.');
    });
  });

  describe('Google token exchange failure', () => {
    it('should propagate GoogleAuthFailedError', async () => {
      vi.mocked(exchangeCodeForTokens).mockRejectedValue(
        new Error('Échec de l\'authentification Google.'),
      );

      await expect(
        googleAuthenticate('bad-code', 'verifier', 'CLIENT'),
      ).rejects.toThrow('Échec de l\'authentification Google.');
    });
  });

  describe('Invalid Google ID token', () => {
    it('should propagate InvalidGoogleTokenError', async () => {
      vi.mocked(verifyGoogleIdToken).mockRejectedValue(
        new Error('Token Google invalide.'),
      );

      await expect(
        googleAuthenticate('code', 'verifier', 'CLIENT'),
      ).rejects.toThrow('Token Google invalide.');
    });
  });

  describe('email_verified = false', () => {
    it('should propagate GoogleAccountNotVerifiedError', async () => {
      vi.mocked(verifyGoogleIdToken).mockRejectedValue(
        new Error('Votre compte Google n\'est pas vérifié.'),
      );

      await expect(
        googleAuthenticate('code', 'verifier', 'CLIENT'),
      ).rejects.toThrow('Votre compte Google n\'est pas vérifié.');
    });
  });
});
