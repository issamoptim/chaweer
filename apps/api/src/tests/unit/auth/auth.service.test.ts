import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../core/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(async (fn: (tx: unknown) => Promise<unknown>) => fn({
      refreshToken: {
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
      },
    })),
  },
}));

vi.mock('../../../modules/auth/services/password.service', () => ({
  hashPassword: vi.fn().mockResolvedValue('mocked-hash'),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../../modules/auth/services/jwt.service', () => ({
  signAccessToken: vi.fn().mockResolvedValue('mocked-jwt'),
}));

const { prisma } = await import('../../../core/database/prisma');
const { hashPassword, verifyPassword } = await import('../../../modules/auth/services/password.service');
const { signAccessToken } = await import('../../../modules/auth/services/jwt.service');
const { register, login, refresh, logout } = await import('../../../modules/auth/auth.service');

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hashPassword).mockResolvedValue('mocked-hash');
    vi.mocked(verifyPassword).mockResolvedValue(true);
    vi.mocked(signAccessToken).mockResolvedValue('mocked-jwt');
  });

  describe('register', () => {
    it('should create a user with correct defaults', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({} as never);

      await register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(hashPassword).toHaveBeenCalledWith('SecurePass123!');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          authProvider: 'LOCAL',
          role: 'CLIENT',
          status: 'PENDING_EMAIL_VERIFICATION',
        }),
      });
    });

    it('should reject duplicate email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing' } as never);

      await expect(
        register({
          email: 'existing@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow('Cette adresse e-mail est déjà utilisée.');
    });
  });

  describe('login', () => {
    it('should reject unknown email with INVALID_CREDENTIALS', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        login({ email: 'unknown@example.com', password: 'SecurePass123!' }),
      ).rejects.toThrow('Email ou mot de passe incorrect.');
    });

    it('should reject Google account with same message as unknown email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        email: 'google@example.com',
        authProvider: 'GOOGLE',
        passwordHash: null,
        status: 'ACTIVE',
        role: 'CLIENT',
      } as never);

      await expect(
        login({ email: 'google@example.com', password: 'SecurePass123!' }),
      ).rejects.toThrow('Email ou mot de passe incorrect.');
    });

    it('should reject wrong password with same message as unknown email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        authProvider: 'LOCAL',
        passwordHash: 'hashed',
        status: 'ACTIVE',
        role: 'CLIENT',
      } as never);
      vi.mocked(verifyPassword).mockResolvedValue(false);

      await expect(
        login({ email: 'user@example.com', password: 'WrongPass123!' }),
      ).rejects.toThrow('Email ou mot de passe incorrect.');
    });

    it('should reject pending email verification', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        authProvider: 'LOCAL',
        passwordHash: 'hashed',
        status: 'PENDING_EMAIL_VERIFICATION',
        role: 'CLIENT',
      } as never);

      await expect(
        login({ email: 'user@example.com', password: 'SecurePass123!' }),
      ).rejects.toThrow("Votre adresse e-mail n'a pas encore été vérifiée.");
    });

    it('should reject suspended account', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        authProvider: 'LOCAL',
        passwordHash: 'hashed',
        status: 'SUSPENDED',
        role: 'CLIENT',
      } as never);

      await expect(
        login({ email: 'user@example.com', password: 'SecurePass123!' }),
      ).rejects.toThrow('Votre compte est suspendu. Veuillez contacter le support.');
    });

    it('should succeed and create access token + refresh token', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: null,
        authProvider: 'LOCAL',
        passwordHash: 'hashed',
        status: 'ACTIVE',
        role: 'CLIENT',
      } as never);
      vi.mocked(verifyPassword).mockResolvedValue(true);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never);

      const result = await login({ email: 'user@example.com', password: 'SecurePass123!' });

      expect(signAccessToken).toHaveBeenCalledWith({ userId: 'user-1', role: 'CLIENT' });
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(result.result.accessToken).toBe('mocked-jwt');
      expect(result.result.user.email).toBe('user@example.com');
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('should reject invalid refresh token', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null);

      await expect(refresh('invalid-token')).rejects.toThrow('Refresh token invalide ou expiré.');
    });

    it('should reject revoked token', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        revokedAt: new Date(),
      } as never);

      await expect(refresh('some-token')).rejects.toThrow('Refresh token invalide ou expiré.');
    });

    it('should reject expired token', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() - 86400000),
        createdAt: new Date(),
        revokedAt: null,
      } as never);

      await expect(refresh('some-token')).rejects.toThrow('Le token a expiré.');
    });

    it('should rotate: revoke old + create new', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        revokedAt: null,
      } as never);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-1',
        role: 'CLIENT',
      } as never);
      vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never);
      vi.mocked(prisma.$transaction).mockImplementation(async (fn) => fn({
        refreshToken: {
          create: vi.fn().mockResolvedValue({}),
          update: vi.fn().mockResolvedValue({}),
        },
      } as never));

      const result = await refresh('valid-token');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.accessToken).toBe('mocked-jwt');
      expect(result.newRefreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should revoke the current token', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue({
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        revokedAt: null,
      } as never);
      vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as never);

      await logout('valid-token');

      expect(prisma.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-1' },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should not throw if token not found (idempotent)', async () => {
      vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null);

      await expect(logout('invalid-token')).resolves.not.toThrow();
    });
  });
});
