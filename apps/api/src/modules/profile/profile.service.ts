import { prisma } from '../../core/database/prisma';
import { NotFoundError } from '../../core/errors';
import type { ProfileData, PreferencesInput } from './profile.types';

const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  country: true,
  city: true,
  nationality: true,
  preferredLanguage: true,
  notificationEmail: true,
  notificationPush: true,
  role: true,
} as const;

export async function getProfile(userId: string): Promise<ProfileData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) {
    throw new NotFoundError('Profil introuvable.');
  }

  return user;
}

export async function updatePreferences(
  userId: string,
  input: PreferencesInput,
): Promise<ProfileData> {
  const data: Record<string, unknown> = {};

  if (input.preferredLanguage !== undefined) {
    data.preferredLanguage = input.preferredLanguage;
  }
  if (input.notificationEmail !== undefined) {
    data.notificationEmail = input.notificationEmail;
  }
  if (input.notificationPush !== undefined) {
    data.notificationPush = input.notificationPush;
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: profileSelect,
    });

    return user;
  } catch (err) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as { code: string }).code === 'P2025'
    ) {
      throw new NotFoundError('Profil introuvable.');
    }
    throw err;
  }
}
