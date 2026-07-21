import { prisma } from '../../core/database/prisma';
import { NotFoundError } from '../../core/errors';
import { ValidationError } from '../../shared/errors/auth-errors';
import { updateIdentity } from '../auth/user.service';
import type {
  ProfessionalProfileData,
  UpdateProfileResponseData,
  ProfileCompletion,
  ProfileCompletionSections,
  ExpertiseData,
  IdentityData,
  BiographyData,
  ContactData,
  OfficeData,
  ConsultationOfferData,
  EducationData,
  ExperienceData,
  CertificationData,
  MembershipData,
  VerificationData,
} from './professional.types';
import type {
  UpdateProfileInput,
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
  offers: { orderBy: { order: 'asc' } },
  contact: true,
  office: { include: { city: { select: { id: true, name: true } } } },
  education: { orderBy: { order: 'asc' } },
  experience: { orderBy: { order: 'asc' } },
  certifications: { orderBy: { order: 'asc' } },
  memberships: { orderBy: { order: 'asc' } },
  verification: true,
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
  const sections: ProfileCompletionSections = {
    identity:
      Boolean(profile.user.firstName) &&
      Boolean(profile.user.lastName) &&
      profile.professionalTitle !== null &&
      profile.professionalTitle !== '',
    biography: profile.bio !== null && profile.bio !== '',
    contact: profile.contact !== null && profile.contact.phone !== null,
    office: profile.office !== null && profile.office.address !== null,
    expertise:
      profile.specializations.length > 0 &&
      profile.practiceAreas.length > 0 &&
      profile.languages.length > 0,
    offer:
      profile.offers.length > 0 &&
      profile.offers.some((o) => o.active === true && o.price > 0),
    education: profile.education.length > 0,
    experience: profile.experience.length > 0,
    certifications: profile.certifications.length > 0,
    memberships: profile.memberships.length > 0,
  };

  const totalSections = 10;
  const completedSections = Object.values(sections).filter(Boolean).length;
  const percentage = Math.round((completedSections / totalSections) * 100);

  return { percentage, completedSections, totalSections, sections };
}

function toProfileData(profile: ProfileWithRelations): ProfessionalProfileData {
  const identity: IdentityData = {
    firstName: profile.user.firstName,
    lastName: profile.user.lastName,
    professionalTitle: profile.professionalTitle,
    photoUrl: profile.photoUrl,
    barAssociationId: profile.barAssociationId,
  };

  const biography: BiographyData = {
    bio: profile.bio,
  };

  const contact: ContactData | null = profile.contact
    ? {
        phone: profile.contact.phone,
        whatsapp: profile.contact.whatsapp,
        publicEmail: profile.contact.publicEmail,
        website: profile.contact.website,
        linkedInUrl: profile.contact.linkedInUrl,
      }
    : null;

  const office: OfficeData | null = profile.office
    ? {
        name: profile.office.name,
        address: profile.office.address,
        cityId: profile.office.cityId,
        latitude: profile.office.latitude,
        longitude: profile.office.longitude,
      }
    : null;

  const expertise: ExpertiseData = {
    specializationIds: profile.specializations.map((s) => s.specializationId),
    practiceAreaIds: profile.practiceAreas.map((p) => p.practiceAreaId),
    languageIds: profile.languages.map((l) => l.languageId),
  };

  const offers: ConsultationOfferData[] = profile.offers.map((o) => ({
    id: o.id,
    title: o.title ?? '',
    description: o.description,
    price: o.price,
    currency: o.currency,
    durationMinutes: o.durationMinutes,
    modalities: o.modalities,
    active: o.active ?? false,
    order: o.order ?? 0,
  }));

  const education: EducationData[] = profile.education.map((e) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    startYear: e.startYear,
    endYear: e.endYear,
    description: e.description,
    order: e.order,
  }));

  const experience: ExperienceData[] = profile.experience.map((e) => ({
    id: e.id,
    position: e.position,
    organization: e.organization,
    startYear: e.startYear,
    endYear: e.endYear,
    current: e.current,
    description: e.description,
    order: e.order,
  }));

  const certifications: CertificationData[] = profile.certifications.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    issueYear: c.issueYear,
    expiryYear: c.expiryYear,
    credentialId: c.credentialId,
    order: c.order,
  }));

  const memberships: MembershipData[] = profile.memberships.map((m) => ({
    id: m.id,
    organization: m.organization,
    role: m.role,
    startYear: m.startYear,
    endYear: m.endYear,
    order: m.order,
  }));

  const verification: VerificationData | null = profile.verification
    ? {
        status: profile.verification.status,
        verifiedAt: profile.verification.verifiedAt?.toISOString() ?? null,
        rejectionReason: profile.verification.rejectionReason,
      }
    : null;

  return {
    id: profile.id,
    status: profile.status,
    publishedAt: profile.publishedAt?.toISOString() ?? null,
    unpublishedAt: profile.unpublishedAt?.toISOString() ?? null,
    identity,
    biography,
    contact,
    office,
    expertise,
    offers,
    education,
    experience,
    certifications,
    memberships,
    verification,
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
  input: UpdateProfileInput,
): Promise<UpdateProfileResponseData> {
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

  const profileData: Prisma.ProfessionalProfileUpdateInput = {};
  if (input.professionalTitle !== undefined) profileData.professionalTitle = input.professionalTitle;
  if (input.photoUrl !== undefined) profileData.photoUrl = input.photoUrl;
  if (input.bio !== undefined) profileData.bio = input.bio;
  if (input.barAssociationId !== undefined) {
    profileData.barAssociation = input.barAssociationId
      ? { connect: { id: input.barAssociationId } }
      : { disconnect: true };
  }

  await prisma.$transaction(async (tx) => {
    await updateIdentity(userId, {
      firstName: input.firstName,
      lastName: input.lastName,
    }, tx);
    if (Object.keys(profileData).length > 0) {
      await tx.professionalProfile.update({
        where: { id: profile.id },
        data: profileData,
      });
    }
  });

  const updated = await prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  if (!updated) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  return {
    id: updated.id,
    status: updated.status,
    publishedAt: updated.publishedAt?.toISOString() ?? null,
    identity: {
      firstName: updated.user.firstName,
      lastName: updated.user.lastName,
      professionalTitle: updated.professionalTitle,
      photoUrl: updated.photoUrl,
      barAssociationId: updated.barAssociationId,
    },
    biography: {
      bio: updated.bio,
    },
  };
}

export async function setExpertise(
  userId: string,
  input: UpdateExpertiseInput,
): Promise<ExpertiseData> {
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

  return {
    specializationIds: specializationIds,
    practiceAreaIds: practiceAreaIds,
    languageIds: languageIds,
  };
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

  const existingOffer = await prisma.consultationOffer.findFirst({
    where: { profileId: profile.id },
    orderBy: { order: 'asc' },
  });

  if (existingOffer) {
    await prisma.consultationOffer.update({
      where: { id: existingOffer.id },
      data: {
        price: input.price,
        durationMinutes: input.durationMinutes,
        modalities,
      },
    });
  } else {
    await prisma.consultationOffer.create({
      data: {
        profileId: profile.id,
        title: 'Consultation',
        price: input.price,
        durationMinutes: input.durationMinutes,
        modalities,
        active: true,
        order: 0,
      },
    });
  }

  return getMyProfile(userId);
}
