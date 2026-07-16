import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../core/database/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

const { prisma } = await import('../../../core/database/prisma');
const { getCurrentUser } = await import('../../../modules/auth/auth.service');

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return MeUser fields for an existing user', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      role: 'CLIENT',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
    } as never);

    const result = await getCurrentUser('user-1');

    expect(result).toEqual({
      id: 'user-1',
      role: 'CLIENT',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: {
        id: true,
        role: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });
  });

  it('should return avatarUrl when it is set', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-2',
      role: 'PROFESSIONAL',
      email: 'pro@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/avatar.jpg',
    } as never);

    const result = await getCurrentUser('user-2');

    expect(result.avatarUrl).toBe('https://example.com/avatar.jpg');
  });

  it('should throw UnauthorizedError if user is not found', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(getCurrentUser('nonexistent')).rejects.toThrow('Authentification requise.');
  });

  it('should not select passwordHash', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      role: 'CLIENT',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
    } as never);

    await getCurrentUser('user-1');

    const call = vi.mocked(prisma.user.findUnique).mock.calls[0][0] as {
      select: Record<string, boolean>;
    };
    expect(call.select.passwordHash).toBeUndefined();
  });

  it('should not select authProvider', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      role: 'CLIENT',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
    } as never);

    await getCurrentUser('user-1');

    const call = vi.mocked(prisma.user.findUnique).mock.calls[0][0] as {
      select: Record<string, boolean>;
    };
    expect(call.select.authProvider).toBeUndefined();
  });

  it('should not select status', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      role: 'CLIENT',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: null,
    } as never);

    await getCurrentUser('user-1');

    const call = vi.mocked(prisma.user.findUnique).mock.calls[0][0] as {
      select: Record<string, boolean>;
    };
    expect(call.select.status).toBeUndefined();
  });
});
