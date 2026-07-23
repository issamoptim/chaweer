import { describe, it, expect } from "vitest";
import { PUBLICATION_REQUIREMENTS, PUBLICATION_MIN_BIO_LENGTH } from "@chaweer/shared";
import { evaluatePublicationReadiness } from "./publication-readiness";
import type { ProfessionalProfileData } from "../types/professional-types";

function makeProfile(
  overrides: Partial<ProfessionalProfileData> = {},
): ProfessionalProfileData {
  return {
    id: "test-id",
    status: "DRAFT",
    publishedAt: null,
    unpublishedAt: null,
    identity: {
      firstName: "Amina",
      lastName: "El Fassi",
      professionalTitle: "Avocate",
      photoUrl: null,
      barAssociationId: "bar-1",
    },
    biography: {
      bio: "A".repeat(PUBLICATION_MIN_BIO_LENGTH),
    },
    contact: null,
    office: null,
    expertise: {
      specializationIds: ["spec-1"],
      practiceAreaIds: ["area-1"],
      languageIds: ["lang-1"],
    },
    offers: [
      {
        id: "offer-1",
        title: "Consultation juridique",
        description: "Analyse de votre situation",
        price: 300,
        currency: "MAD",
        durationMinutes: 30,
        modalities: ["VIDEO"],
        active: true,
        order: 0,
      },
    ],
    education: [],
    experience: [],
    certifications: [],
    memberships: [],
    verification: null,
    completion: {
      percentage: 30,
      completedSections: 3,
      totalSections: 10,
      sections: {
        identity: true,
        biography: true,
        contact: false,
        office: false,
        expertise: true,
        offer: true,
        education: false,
        experience: false,
        certifications: false,
        memberships: false,
      },
    },
    ...overrides,
  };
}

describe("evaluatePublicationReadiness", () => {
  it("returns ready when all 9 requirements are met", () => {
    const result = evaluatePublicationReadiness(makeProfile());
    expect(result.isReady).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.completedCount).toBe(9);
    expect(result.totalCount).toBe(9);
  });

  it("returns not ready when profile is undefined", () => {
    const result = evaluatePublicationReadiness(undefined);
    expect(result.isReady).toBe(false);
    expect(result.completedCount).toBe(0);
    expect(result.totalCount).toBe(9);
    expect(result.checklist).toHaveLength(9);
  });

  it("detects missing firstName", () => {
    const profile = makeProfile({
      identity: { ...makeProfile().identity, firstName: "" },
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.isReady).toBe(false);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.FIRST_NAME);
  });

  it("detects missing lastName", () => {
    const profile = makeProfile({
      identity: { ...makeProfile().identity, lastName: "" },
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.LAST_NAME);
  });

  it("detects missing barAssociation", () => {
    const profile = makeProfile({
      identity: { ...makeProfile().identity, barAssociationId: null },
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.BAR_ASSOCIATION);
  });

  it("detects bio too short", () => {
    const profile = makeProfile({
      biography: { bio: "A".repeat(PUBLICATION_MIN_BIO_LENGTH - 1) },
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.BIOGRAPHY);
  });

  it("detects missing specialization", () => {
    const profile = makeProfile({
      expertise: { specializationIds: [], practiceAreaIds: [], languageIds: [] },
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.SPECIALIZATION);
  });

  it("detects missing offer title", () => {
    const profile = makeProfile({
      offers: [{ ...makeProfile().offers[0]!, title: "" }],
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_TITLE);
  });

  it("detects missing offer description", () => {
    const profile = makeProfile({
      offers: [{ ...makeProfile().offers[0]!, description: "" }],
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION);
  });

  it("detects offer price = 0", () => {
    const profile = makeProfile({
      offers: [{ ...makeProfile().offers[0]!, price: 0 }],
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_PRICE);
  });

  it("detects missing offer modalities", () => {
    const profile = makeProfile({
      offers: [{ ...makeProfile().offers[0]!, modalities: [] }],
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_MODALITY);
  });

  it("detects no offer at all", () => {
    const profile = makeProfile({ offers: [] });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_TITLE);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_DESCRIPTION);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_PRICE);
    expect(result.missing).toContain(PUBLICATION_REQUIREMENTS.OFFER_MODALITY);
  });

  it("detects multiple missing requirements", () => {
    const profile = makeProfile({
      identity: { ...makeProfile().identity, firstName: "", barAssociationId: null },
      offers: [],
    });
    const result = evaluatePublicationReadiness(profile);
    expect(result.missing.length).toBe(6);
    expect(result.completedCount).toBe(3);
  });

  it("provides checklist with labels", () => {
    const result = evaluatePublicationReadiness(makeProfile());
    expect(result.checklist).toHaveLength(9);
    expect(result.checklist[0]!.label).toContain("Prénom");
    expect(result.checklist[0]!.done).toBe(true);
  });
});
