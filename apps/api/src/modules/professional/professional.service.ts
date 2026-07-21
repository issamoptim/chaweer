import { prisma } from '../../core/database/prisma';
import { NotFoundError } from '../../core/errors';
import { ValidationError } from '../../shared/errors/auth-errors';
import type { ProfessionalProfileData, ProfileCompletion } from './professional.types';
import type {
  UpdateProfessionalProfileInput,
  UpdateExpertiseInput,
  UpdateOfferInput,
} from './professional.schema';
import type { Prisma, PrismaClient, ConsultationModality } from '../../generated/prisma/client';

type PrismaTx = Prisma.TransactionClient | PrismaClient;

const profileInclude = {
  user: {
    select: { firstName: true, lastName: true, email: true },
  },
  specializations: { select: { specializationId: true } },
  practiceAreas: { select: { practiceAreaId: true } },
  languages: { select: { languageId: true } },
  offer: true,
} as const;

type ProfileWithRelations = Prisma.ProfessionalProfileGetPayload<{
  include: typeof profileInclude;
}>;

export async function ensureDraftProfile(
  userId: string,
  client: PrismaTx = prisma,
): Promise<string> {
  const existing = await client.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await client.professionalProfile.create({
    data: { userId, status: 'DRAFT' },
    select: { id: true },
  });

  return created.id;
}

function computeCompletion(profile: ProfileWithRelations): ProfileCompletion {
  const hasName = Boolean(profile.user.firstName) && Boolean(profile.user.lastName);
  const hasExpertise =
    profile.specializations.length > 0 &&
    profile.practiceAreas.length > 0 &&
    profile.languages.length > 0;
  const hasOffer =
    profile.offer !== null && profile.offer.price > 0 && profile.offer.modalities.length > 0;

  return { profile: hasName, expertise: hasExpertise, offer: hasOffer };
}

function toProfileData(profile: ProfileWithRelations): ProfessionalProfileData {
  return {
    id: profile.id,
    status: profile.status,
    firstName: profile.user.firstName,
    lastName: profile.user.lastName,
    email: profile.user.email,
    photoUrl: profile.photoUrl,
    barAssociationId: profile.barAssociationId,
    cityId: profile.cityId,
    professionalPhone: profile.professionalPhone,
    officeAddress: profile.officeAddress,
    bio: profile.bio,
    specializationIds: profile.specializations.map((s) => s.specializationId),
    practiceAreaIds: profile.practiceAreas.map((p) => p.practiceAreaId),
    languageIds: profile.languages.map((l) => l.languageId),
    offer: profile.offer
      ? {
          price: profile.offer.price,
          currency: profile.offer.currency,
          durationMinutes: profile.offer.durationMinutes,
          modalities: profile.offer.modalities,
        }
      : null,
    completion: computeCompletion(profile),
  };
}

async function getProfileEntity(userId: string): Promise<ProfileWithRelations> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    include: profileInclude,
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  return profile;
}

export async function getMyProfile(userId: string): Promise<ProfessionalProfileData> {
  const profile = await getProfileEntity(userId);
  return toProfileData(profile);
}

export async function updateProfile(
  userId: string,
  input: UpdateProfessionalProfileInput,
): Promise<ProfessionalProfileData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  if (input.barAssociationId) {
    const bar = await prisma.barAssociation.findFirst({
      where: { id: input.barAssociationId, active: true },
      select: { id: true },
    });
    if (!bar) {
      throw new ValidationError('Barreau invalide.', [
        { field: 'barAssociationId', message: 'Barreau invalide.' },
      ]);
    }
  }

  if (input.cityId) {
    const city = await prisma.city.findFirst({
      where: { id: input.cityId, active: true },
      select: { id: true },
    });
    if (!city) {
      throw new ValidationError('Ville invalide.', [
        { field: 'cityId', message: 'Ville invalide.' },
      ]);
    }
  }

  const userData: { firstName?: string; lastName?: string } = {};
  if (input.firstName !== undefined) userData.firstName = input.firstName;
  if (input.lastName !== undefined) userData.lastName = input.lastName;

  const profileData: Prisma.ProfessionalProfileUpdateInput = {};
  if (input.photoUrl !== undefined) profileData.photoUrl = input.photoUrl;
  if (input.professionalPhone !== undefined)
    profileData.professionalPhone = input.professionalPhone;
  if (input.officeAddress !== undefined) profileData.officeAddress = input.officeAddress;
  if (input.bio !== undefined) profileData.bio = input.bio;
  if (input.barAssociationId !== undefined) {
    profileData.barAssociation = input.barAssociationId
      ? { connect: { id: input.barAssociationId } }
      : { disconnect: true };
  }
  if (input.cityId !== undefined) {
    profileData.city = input.cityId ? { connect: { id: input.cityId } } : { disconnect: true };
  }

  await prisma.$transaction(async (tx) => {
    if (Object.keys(userData).length > 0) {
      await tx.user.update({ where: { id: userId }, data: userData });
    }
    if (Object.keys(profileData).length > 0) {
      await tx.professionalProfile.update({
        where: { id: profile.id },
        data: profileData,
      });
    }
  });

  return getMyProfile(userId);
}

export async function setExpertise(
  userId: string,
  input: UpdateExpertiseInput,
): Promise<ProfessionalProfileData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  const specializationIds = [...new Set(input.specializationIds)];
  const practiceAreaIds = [...new Set(input.practiceAreaIds)];
  const languageIds = [...new Set(input.languageIds)];

  const [specializations, practiceAreas, languages] = await Promise.all([
    prisma.specialization.findMany({
      where: { id: { in: specializationIds }, active: true },
      select: { id: true },
    }),
    prisma.practiceArea.findMany({
      where: { id: { in: practiceAreaIds }, active: true },
      select: { id: true, specializationId: true },
    }),
    prisma.language.findMany({
      where: { id: { in: languageIds }, active: true },
      select: { id: true },
    }),
  ]);

  if (specializations.length !== specializationIds.length) {
    throw new ValidationError('Une ou plusieurs spécialités sont invalides.', [
      { field: 'specializationIds', message: 'Spécialité invalide.' },
    ]);
  }
  if (practiceAreas.length !== practiceAreaIds.length) {
    throw new ValidationError('Une ou plusieurs situations sont invalides.', [
      { field: 'practiceAreaIds', message: 'Situation invalide.' },
    ]);
  }
  if (languages.length !== languageIds.length) {
    throw new ValidationError('Une ou plusieurs langues sont invalides.', [
      { field: 'languageIds', message: 'Langue invalide.' },
    ]);
  }

  const selectedSpecSet = new Set(specializationIds);
  const orphanArea = practiceAreas.find((area) => !selectedSpecSet.has(area.specializationId));
  if (orphanArea) {
    throw new ValidationError('Chaque situation doit appartenir à une spécialité sélectionnée.', [
      {
        field: 'practiceAreaIds',
        message: 'Situation non rattachée à une spécialité sélectionnée.',
      },
    ]);
  }

  await prisma.$transaction(async (tx) => {
    await tx.professionalSpecialization.deleteMany({ where: { profileId: profile.id } });
    await tx.professionalPracticeArea.deleteMany({ where: { profileId: profile.id } });
    await tx.professionalLanguage.deleteMany({ where: { profileId: profile.id } });

    await tx.professionalSpecialization.createMany({
      data: specializationIds.map((specializationId) => ({
        profileId: profile.id,
        specializationId,
      })),
    });
    await tx.professionalPracticeArea.createMany({
      data: practiceAreaIds.map((practiceAreaId) => ({
        profileId: profile.id,
        practiceAreaId,
      })),
    });
    await tx.professionalLanguage.createMany({
      data: languageIds.map((languageId) => ({
        profileId: profile.id,
        languageId,
      })),
    });
  });

  return getMyProfile(userId);
}

export async function setOffer(
  userId: string,
  input: UpdateOfferInput,
): Promise<ProfessionalProfileData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  const modalities = [...new Set(input.modalities)] as ConsultationModality[];

  await prisma.consultationOffer.upsert({
    where: { profileId: profile.id },
    update: {
      price: input.price,
      durationMinutes: input.durationMinutes,
      modalities,
    },
    create: {
      profileId: profile.id,
      price: input.price,
      durationMinutes: input.durationMinutes,
      modalities,
    },
  });

  return getMyProfile(userId);
}
