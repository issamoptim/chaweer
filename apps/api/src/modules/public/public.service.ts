import { prisma } from '../../core/database/prisma';

export interface PublicListProfessional {
  id: string;
  firstName: string;
  lastName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
  yearsOfExperience: number | null;
  cityName: string | null;
  specializationNames: string[];
  practiceAreaNames: string[];
  offers: {
    id: string;
    title: string;
    price: number;
    currency: string;
    modalities: string[];
  }[];
  barAssociationName: string | null;
}

export interface PublicListResponse {
  professionals: PublicListProfessional[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listPublicProfessionals(params: {
  specializationKeys?: string[];
  cityKey?: string;
  query?: string;
  page?: number;
  limit?: number;
}): Promise<PublicListResponse> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.max(1, params.limit ?? 20);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    status: 'PUBLISHED',
  };

  if (params.cityKey) {
    where.office = { city: { key: params.cityKey } };
  }

  if (params.specializationKeys && params.specializationKeys.length > 0) {
    where.specializations = {
      some: { specialization: { key: { in: params.specializationKeys } } },
    };
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    where.OR = [
      { user: { firstName: { contains: q, mode: 'insensitive' } } },
      { user: { lastName: { contains: q, mode: 'insensitive' } } },
    ];
  }

  const [total, profiles] = await Promise.all([
    prisma.professionalProfile.count({ where: where as never }),
    prisma.professionalProfile.findMany({
      where: where as never,
      skip,
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true } },
        specializations: {
          include: { specialization: { select: { id: true, name: true, key: true } } },
        },
        practiceAreas: {
          include: { practiceArea: { select: { id: true, name: true } } },
        },
        offers: {
          where: { active: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            modalities: true,
          },
        },
        office: { include: { city: { select: { id: true, name: true, key: true } } } },
        barAssociation: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
    }),
  ]);

  let professionals: PublicListProfessional[] = profiles.map((p) => ({
    id: p.id,
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    professionalTitle: p.professionalTitle,
    photoUrl: p.photoUrl,
    yearsOfExperience: p.yearsOfExperience,
    cityName: p.office?.city?.name ?? null,
    specializationNames: p.specializations.map((s) => s.specialization.name),
    practiceAreaNames: p.practiceAreas.map((pa) => pa.practiceArea.name),
    offers: p.offers.map((o) => ({
      id: o.id,
      title: o.title ?? '',
      price: o.price,
      currency: o.currency,
      modalities: o.modalities,
    })),
    barAssociationName: p.barAssociation?.name ?? null,
  }));

  if (params.query) {
    const q = params.query.toLowerCase();
    professionals = professionals.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.specializationNames.some((s) => s.toLowerCase().includes(q)) ||
        p.practiceAreaNames.some((s) => s.toLowerCase().includes(q)),
    );
  }

  return {
    professionals,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
