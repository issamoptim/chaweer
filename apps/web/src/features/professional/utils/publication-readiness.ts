import {
  PUBLICATION_REQUIREMENTS,
  PUBLICATION_MIN_BIO_LENGTH,
  type PublicationRequirement,
} from "@chaweer/shared";
import type { ProfessionalProfileData } from "../types/professional-types";

export interface ReadinessCheck {
  key: PublicationRequirement;
  label: string;
  done: boolean;
}

export interface PublicationReadinessResult {
  isReady: boolean;
  missing: PublicationRequirement[];
  checklist: ReadinessCheck[];
  completedCount: number;
  totalCount: number;
}

const REQUIREMENT_LABELS: Record<PublicationRequirement, string> = {
  [PUBLICATION_REQUIREMENTS.FIRST_NAME]: "Prénom renseigné",
  [PUBLICATION_REQUIREMENTS.LAST_NAME]: "Nom renseigné",
  [PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION]: "Barreau sélectionné",
  [PUBLICATION_REQUIREMENTS.BIOGRAPHY]: `Biographie ≥ ${PUBLICATION_MIN_BIO_LENGTH} caractères`,
  [PUBLICATION_REQUIREMENTS.SPECIALIZATION]: "Au moins une spécialité",
  [PUBLICATION_REQUIREMENTS.OFFER_TITLE]: "Titre de l'offre",
  [PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION]: "Description de l'offre",
  [PUBLICATION_REQUIREMENTS.OFFER_PRICE]: "Prix de l'offre > 0",
  [PUBLICATION_REQUIREMENTS.OFFER_MODALITY]: "Au moins une modalité",
};

const ALL_REQUIREMENTS: PublicationRequirement[] = Object.values(PUBLICATION_REQUIREMENTS);

export function evaluatePublicationReadiness(
  profile: ProfessionalProfileData | undefined,
): PublicationReadinessResult {
  if (!profile) {
    return {
      isReady: false,
      missing: [...ALL_REQUIREMENTS],
      checklist: ALL_REQUIREMENTS.map((key) => ({
        key,
        label: REQUIREMENT_LABELS[key],
        done: false,
      })),
      completedCount: 0,
      totalCount: ALL_REQUIREMENTS.length,
    };
  }

  const offer = profile.offers[0] ?? null;

  const checks: Record<PublicationRequirement, boolean> = {
    [PUBLICATION_REQUIREMENTS.FIRST_NAME]:
      !!profile.identity.firstName && profile.identity.firstName.trim() !== "",
    [PUBLICATION_REQUIREMENTS.LAST_NAME]:
      !!profile.identity.lastName && profile.identity.lastName.trim() !== "",
    [PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION]: !!profile.identity.barAssociationId,
    [PUBLICATION_REQUIREMENTS.BIOGRAPHY]:
      !!profile.biography.bio && profile.biography.bio.trim().length >= PUBLICATION_MIN_BIO_LENGTH,
    [PUBLICATION_REQUIREMENTS.SPECIALIZATION]: profile.expertise.specializationIds.length > 0,
    [PUBLICATION_REQUIREMENTS.OFFER_TITLE]:
      !!offer && !!offer.title && offer.title.trim() !== "",
    [PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION]:
      !!offer && !!offer.description && offer.description.trim() !== "",
    [PUBLICATION_REQUIREMENTS.OFFER_PRICE]: !!offer && offer.price > 0,
    [PUBLICATION_REQUIREMENTS.OFFER_MODALITY]: !!offer && offer.modalities.length > 0,
  };

  const checklist: ReadinessCheck[] = ALL_REQUIREMENTS.map((key) => ({
    key,
    label: REQUIREMENT_LABELS[key],
    done: checks[key],
  }));

  const missing = checklist.filter((c) => !c.done).map((c) => c.key);
  const completedCount = checklist.filter((c) => c.done).length;

  return {
    isReady: missing.length === 0,
    missing,
    checklist,
    completedCount,
    totalCount: ALL_REQUIREMENTS.length,
  };
}
