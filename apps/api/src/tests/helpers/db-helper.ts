import { prisma } from '../../core/database/prisma';
import { hashPassword } from '../../modules/auth/services/password.service';

export async function cleanDatabase(): Promise<void> {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(overrides?: {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  authProvider?: string;
  status?: string;
}): Promise<{ id: string; email: string; password: string }> {
  const email = overrides?.email ?? `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const password = overrides?.password ?? 'TestPass123!';
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: overrides?.firstName ?? 'Test',
      lastName: overrides?.lastName ?? 'User',
      role: (overrides?.role as 'CLIENT' | 'PROFESSIONAL' | 'ADMIN') ?? 'CLIENT',
      authProvider: (overrides?.authProvider as 'LOCAL' | 'GOOGLE') ?? 'LOCAL',
      status: (overrides?.status as 'PENDING_EMAIL_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'DELETED') ?? 'ACTIVE',
    },
  });

  return { id: user.id, email, password };
}
