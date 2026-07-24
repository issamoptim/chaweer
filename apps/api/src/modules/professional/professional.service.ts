import { prisma } from '../../core/database/prisma';
import { NotFoundError, PublicationRequirementsError } from '../../core/errors';
import { ValidationError } from '../../shared/errors/auth-errors';
import { updateIdentity } from '../auth/user.service';
import {
  PUBLICATION_REQUIREMENTS,
  PUBLICATION_MIN_BIO_LENGTH,
  type PublicationRequirement,
} from '@chaweer/shared';
import type { PublishResponse } from '@chaweer/shared';
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
  VerificationData,
  PublicProfileData,
} from './professional.types';
import type {
  UpdateProfileInput,
  UpdateExpertiseInput,
  UpdateOfferInput,
  UpdateContactInput,
  UpdateOfficeInput,
  EducationInput,
  ExperienceInput,
  CertificationInput,
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
  };

  const totalSections = 9;
  const completedSections = Object.values(sections).filter(Boolean).length;
  const percentage = Math.round((completedSections / totalSections) * 100);

  return { percentage, completedSections, totalSections, sections };
}

/**
 * Evaluates the mandatory publication requirements against a profile.
 * Returns the ordered list of requirements that are NOT satisfied.
 * Publication is fully independent from administrative verification, so
 * verification status is never taken into account here.
 */
export function evaluatePublicationRequirements(
  profile: ProfileWithRelations,
): PublicationRequirement[] {
  const missing: PublicationRequirement[] = [];

  if (!profile.user.firstName || profile.user.firstName.trim() === '') {
    missing.push(PUBLICATION_REQUIREMENTS.FIRST_NAME);
  }
  if (!profile.user.lastName || profile.user.lastName.trim() === '') {
    missing.push(PUBLICATION_REQUIREMENTS.LAST_NAME);
  }
  if (!profile.barAssociationId) {
    missing.push(PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION);
  }
  if (!profile.bio || profile.bio.trim().length < PUBLICATION_MIN_BIO_LENGTH) {
    missing.push(PUBLICATION_REQUIREMENTS.BIOGRAPHY);
  }
  if (profile.specializations.length === 0) {
    missing.push(PUBLICATION_REQUIREMENTS.SPECIALIZATION);
  }

  const offer = profile.offers[0] ?? null;
  if (!offer || !offer.title || offer.title.trim() === '') {
    missing.push(PUBLICATION_REQUIREMENTS.OFFER_TITLE);
  }
  if (!offer || !offer.description || offer.description.trim() === '') {
    missing.push(PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION);
  }
  if (!offer || offer.price <= 0) {
    missing.push(PUBLICATION_REQUIREMENTS.OFFER_PRICE);
  }
  if (!offer || offer.modalities.length === 0) {
    missing.push(PUBLICATION_REQUIREMENTS.OFFER_MODALITY);
  }

  return missing;
}

/**
 * Re-evaluates publication requirements for an already PUBLISHED profile and
 * automatically unpublishes it (status -> DRAFT) if any mandatory requirement
 * is no longer satisfied. This enforces business rule 4: a modification that
 * invalidates a mandatory requirement removes the profile from the marketplace.
 *
 * No-op for profiles that are not currently PUBLISHED.
 */
export async function syncPublicationStatus(userId: string): Promise<void> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    include: profileInclude,
  });

  if (!profile || profile.status !== 'PUBLISHED') {
    return;
  }

  const missing = evaluatePublicationRequirements(profile);
  if (missing.length > 0) {
    await prisma.professionalProfile.update({
      where: { id: profile.id },
      data: { status: 'DRAFT', unpublishedAt: new Date() },
    });
  }
}

function toProfileData(profile: ProfileWithRelations): ProfessionalProfileData {
  const identity: IdentityData = {
    firstName: profile.user.firstName,
    lastName: profile.user.lastName,
    professionalTitle: profile.professionalTitle,
    registrationNumber: profile.registrationNumber,
    yearsOfExperience: profile.yearsOfExperience,
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
    order: c.order,
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
  if (input.registrationNumber !== undefined) profileData.registrationNumber = input.registrationNumber;
  if (input.yearsOfExperience !== undefined) profileData.yearsOfExperience = input.yearsOfExperience;
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

  await syncPublicationStatus(userId);

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
      registrationNumber: updated.registrationNumber,
      yearsOfExperience: updated.yearsOfExperience,
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

  await syncPublicationStatus(userId);

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
        title: input.title,
        description: input.description,
        price: input.price,
        modalities,
      },
    });
  } else {
    await prisma.consultationOffer.create({
      data: {
        profileId: profile.id,
        title: input.title,
        description: input.description,
        price: input.price,
        modalities,
        active: true,
        order: 0,
      },
    });
  }

  await syncPublicationStatus(userId);

  return getMyProfile(userId);
}

export async function deleteOffer(
  userId: string,
): Promise<ProfessionalProfileData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  await prisma.consultationOffer.deleteMany({
    where: { profileId: profile.id },
  });

  await syncPublicationStatus(userId);

  return getMyProfile(userId);
}

/**
 * Publishes a professional profile (business rule 1: publication is the
 * professional's own decision). Validates all mandatory requirements
 * server-side. If any requirement is missing, throws a
 * PublicationRequirementsError (HTTP 422) with the structured list.
 *
 * On success, transitions the status to PUBLISHED and stamps publishedAt.
 * The operation is idempotent: re-publishing an already PUBLISHED profile
 * that still meets all requirements simply returns the current state.
 * Publication is fully independent from administrative verification.
 */
export async function publishProfile(userId: string): Promise<PublishResponse> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    include: profileInclude,
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  const missing = evaluatePublicationRequirements(profile);
  if (missing.length > 0) {
    throw new PublicationRequirementsError(missing);
  }

  if (profile.status === 'PUBLISHED') {
    return {
      status: profile.status,
      publishedAt: profile.publishedAt?.toISOString() ?? null,
    };
  }

  const updated = await prisma.professionalProfile.update({
    where: { id: profile.id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
    select: { status: true, publishedAt: true },
  });

  return {
    status: updated.status,
    publishedAt: updated.publishedAt?.toISOString() ?? null,
  };
}

export async function unpublishProfile(userId: string): Promise<PublishResponse> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true, status: true, unpublishedAt: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  if (profile.status === 'DRAFT' && profile.unpublishedAt) {
    return {
      status: profile.status,
      publishedAt: null,
    };
  }

  const updated = await prisma.professionalProfile.update({
    where: { id: profile.id },
    data: { status: 'DRAFT', unpublishedAt: new Date() },
    select: { status: true, publishedAt: true },
  });

  return {
    status: updated.status,
    publishedAt: updated.publishedAt?.toISOString() ?? null,
  };
}

export async function updateContact(
  userId: string,
  input: UpdateContactInput,
): Promise<ContactData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  const existing = await prisma.professionalContact.findUnique({
    where: { profileId: profile.id },
  });

  if (existing) {
    const updated = await prisma.professionalContact.update({
      where: { profileId: profile.id },
      data: {
        phone: input.phone,
        whatsapp: input.whatsapp,
        publicEmail: input.publicEmail,
        website: input.website,
        linkedInUrl: input.linkedInUrl,
      },
    });
    return {
      phone: updated.phone,
      whatsapp: updated.whatsapp,
      publicEmail: updated.publicEmail,
      website: updated.website,
      linkedInUrl: updated.linkedInUrl,
    };
  }

  const created = await prisma.professionalContact.create({
    data: {
      profileId: profile.id,
      phone: input.phone ?? null,
      whatsapp: input.whatsapp ?? null,
      publicEmail: input.publicEmail ?? null,
      website: input.website ?? null,
      linkedInUrl: input.linkedInUrl ?? null,
    },
  });

  return {
    phone: created.phone,
    whatsapp: created.whatsapp,
    publicEmail: created.publicEmail,
    website: created.website,
    linkedInUrl: created.linkedInUrl,
  };
}

export async function updateOffice(
  userId: string,
  input: UpdateOfficeInput,
): Promise<OfficeData> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  if (input.cityId) {
    const city = await prisma.city.findUnique({
      where: { id: input.cityId },
      select: { id: true },
    });
    if (!city) {
      throw new ValidationError('Ville invalide.', [
        { field: 'cityId', message: 'Ville invalide.' },
      ]);
    }
  }

  const existing = await prisma.office.findUnique({
    where: { profileId: profile.id },
  });

  if (existing) {
    const updated = await prisma.office.update({
      where: { profileId: profile.id },
      data: {
        name: input.name,
        address: input.address,
        cityId: input.cityId,
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });
    return {
      name: updated.name,
      address: updated.address,
      cityId: updated.cityId,
      latitude: updated.latitude,
      longitude: updated.longitude,
    };
  }

  const created = await prisma.office.create({
    data: {
      profileId: profile.id,
      name: input.name ?? null,
      address: input.address ?? null,
      cityId: input.cityId ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
    },
  });

  return {
    name: created.name,
    address: created.address,
    cityId: created.cityId,
    latitude: created.latitude,
    longitude: created.longitude,
  };
}

export async function setEducation(
  userId: string,
  items: EducationInput[],
): Promise<EducationData[]> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  await prisma.$transaction(async (tx) => {
    await tx.education.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await tx.education.createMany({
        data: items.map((item, index) => ({
          profileId: profile.id,
          degree: item.degree,
          institution: item.institution,
          startYear: item.startYear,
          endYear: item.endYear ?? null,
          description: item.description ?? null,
          order: index,
        })),
      });
    }
  });

  await syncPublicationStatus(userId);

  const updated = await prisma.education.findMany({
    where: { profileId: profile.id },
    orderBy: { order: 'asc' },
  });

  return updated.map((e) => ({
    id: e.id,
    degree: e.degree,
    institution: e.institution,
    startYear: e.startYear,
    endYear: e.endYear,
    description: e.description,
    order: e.order,
  }));
}

export async function setExperience(
  userId: string,
  items: ExperienceInput[],
): Promise<ExperienceData[]> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  await prisma.$transaction(async (tx) => {
    await tx.professionalExperience.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await tx.professionalExperience.createMany({
        data: items.map((item, index) => ({
          profileId: profile.id,
          position: item.position,
          organization: item.organization,
          startYear: item.startYear,
          endYear: item.endYear ?? null,
          current: item.current ?? false,
          description: item.description ?? null,
          order: index,
        })),
      });
    }
  });

  await syncPublicationStatus(userId);

  const updated = await prisma.professionalExperience.findMany({
    where: { profileId: profile.id },
    orderBy: { order: 'asc' },
  });

  return updated.map((e) => ({
    id: e.id,
    position: e.position,
    organization: e.organization,
    startYear: e.startYear,
    endYear: e.endYear,
    current: e.current,
    description: e.description,
    order: e.order,
  }));
}

export async function setCertifications(
  userId: string,
  items: CertificationInput[],
): Promise<CertificationData[]> {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError('Profil professionnel introuvable.');
  }

  await prisma.$transaction(async (tx) => {
    await tx.certification.deleteMany({ where: { profileId: profile.id } });
    if (items.length > 0) {
      await tx.certification.createMany({
        data: items.map((item, index) => ({
          profileId: profile.id,
          title: item.title,
          issuer: item.issuer,
          order: index,
        })),
      });
    }
  });

  await syncPublicationStatus(userId);

  const updated = await prisma.certification.findMany({
    where: { profileId: profile.id },
    orderBy: { order: 'asc' },
  });

  return updated.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    order: c.order,
  }));
}

export async function getPublicProfile(profileId: string): Promise<PublicProfileData> {
  const profile = await prisma.professionalProfile.findFirst({
    where: { id: profileId, status: 'PUBLISHED' },
    include: {
      user: { select: { firstName: true, lastName: true } },
      specializations: {
        include: {
          specialization: { select: { id: true, name: true } },
        },
      },
      practiceAreas: {
        include: {
          practiceArea: { select: { id: true, name: true } },
        },
      },
      languages: {
        include: {
          language: { select: { id: true, name: true, code: true } },
        },
      },
      offers: { orderBy: { order: 'asc' } },
      contact: true,
      office: { include: { city: { select: { id: true, name: true } } } },
      education: { orderBy: { order: 'asc' } },
      experience: { orderBy: { order: 'asc' } },
      certifications: { orderBy: { order: 'asc' } },
      barAssociation: { select: { name: true } },
    },
  });

  if (!profile) {
    throw new NotFoundError('Profil introuvable ou non publié.');
  }

  const offers: ConsultationOfferData[] = profile.offers
    .filter((o) => o.active)
    .map((o) => ({
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

  return {
    id: profile.id,
    identity: {
      firstName: profile.user.firstName,
      lastName: profile.user.lastName,
      professionalTitle: profile.professionalTitle,
      registrationNumber: profile.registrationNumber,
      yearsOfExperience: profile.yearsOfExperience,
      photoUrl: profile.photoUrl,
      barAssociationId: profile.barAssociationId,
    },
    biography: { bio: profile.bio },
    contact: profile.contact
      ? {
          phone: profile.contact.phone,
          whatsapp: profile.contact.whatsapp,
          publicEmail: profile.contact.publicEmail,
          website: profile.contact.website,
          linkedInUrl: profile.contact.linkedInUrl,
        }
      : null,
    office: profile.office
      ? {
          name: profile.office.name,
          address: profile.office.address,
          cityId: profile.office.cityId,
          latitude: profile.office.latitude,
          longitude: profile.office.longitude,
        }
      : null,
    expertise: {
      specializationIds: profile.specializations.map((s) => s.specializationId),
      practiceAreaIds: profile.practiceAreas.map((p) => p.practiceAreaId),
      languageIds: profile.languages.map((l) => l.languageId),
    },
    specializationNames: profile.specializations.map((s) => s.specialization.name),
    practiceAreaNames: profile.practiceAreas.map((p) => p.practiceArea.name),
    languageNames: profile.languages.map((l) => l.language.name),
    offers,
    education: profile.education.map((e) => ({
      id: e.id,
      degree: e.degree,
      institution: e.institution,
      startYear: e.startYear,
      endYear: e.endYear,
      description: e.description,
      order: e.order,
    })),
    experience: profile.experience.map((e) => ({
      id: e.id,
      position: e.position,
      organization: e.organization,
      startYear: e.startYear,
      endYear: e.endYear,
      current: e.current,
      description: e.description,
      order: e.order,
    })),
    certifications: profile.certifications.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      order: c.order,
    })),
    barAssociationName: profile.barAssociation?.name ?? null,
    cityName: profile.office?.city?.name ?? null,
  };
}
