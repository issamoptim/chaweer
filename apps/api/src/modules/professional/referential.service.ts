import { prisma } from '../../core/database/prisma';
import type { Referential } from './professional.types';

export async function getReferential(): Promise<Referential> {
  const [specializations, languages, barAssociations, cities] = await Promise.all([
    prisma.specialization.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        practiceAreas: {
          where: { active: true },
          orderBy: { order: 'asc' },
          select: { id: true, key: true, name: true },
        },
      },
    }),
    prisma.language.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: { id: true, code: true, name: true },
    }),
    prisma.barAssociation.findMany({
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

  return {
    specializations: specializations.map((spec) => ({
      id: spec.id,
      key: spec.key,
      name: spec.name,
      practiceAreas: spec.practiceAreas,
    })),
    languages,
    barAssociations,
    cities,
  };
}
