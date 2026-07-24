import { prisma } from '../../core/database/prisma';

export interface PublicReferential {
  specializations: { id: string; key: string; name: string }[];
  cities: { id: string; key: string; name: string }[];
}

export async function getPublicReferential(): Promise<PublicReferential> {
  const [specializations, cities] = await Promise.all([
    prisma.specialization.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, key: true, name: true },
    }),
    prisma.city.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, key: true, name: true },
    }),
  ]);

  return { specializations, cities };
}
