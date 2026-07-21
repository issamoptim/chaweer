import { describe, it, expect } from "vitest";
import {
  updateProfileSchema,
  updateExpertiseSchema,
  updateContactSchema,
  updateOfficeSchema,
  createOfferSchema,
  updateOfferSchema,
  toggleOfferSchema,
  createEducationSchema,
  updateEducationSchema,
  createExperienceSchema,
  updateExperienceSchema,
  createCertificationSchema,
  updateCertificationSchema,
  createMembershipSchema,
  updateMembershipSchema,
  publicProfileResponseSchema,
  publicOfferResponseSchema,
} from "../schemas/index";
import {
  PROFESSIONAL_PROFILE_STATUS,
  VERIFICATION_STATUS,
  CONSULTATION_MODALITY,
  VERIFIED_DOCUMENT_TYPE,
} from "../enums/index";
import {
  CONSULTATION_DURATIONS,
  COMPLETION_SECTIONS,
  MVP_COMPLETION_SECTIONS,
  PUBLISH_BLOCKING_PRECONDITIONS,
} from "../constants/index";

// ============================================================
// Enums
// ============================================================

describe("Enums", () => {
  it("PROFESSIONAL_PROFILE_STATUS has 4 values", () => {
    expect(Object.keys(PROFESSIONAL_PROFILE_STATUS)).toHaveLength(4);
    expect(PROFESSIONAL_PROFILE_STATUS.DRAFT).toBe("DRAFT");
    expect(PROFESSIONAL_PROFILE_STATUS.PUBLISHED).toBe("PUBLISHED");
    expect(PROFESSIONAL_PROFILE_STATUS.UNPUBLISHED).toBe("UNPUBLISHED");
    expect(PROFESSIONAL_PROFILE_STATUS.PENDING_VERIFICATION).toBe(
      "PENDING_VERIFICATION",
    );
  });

  it("VERIFICATION_STATUS has 4 values", () => {
    expect(Object.keys(VERIFICATION_STATUS)).toHaveLength(4);
    expect(VERIFICATION_STATUS.UNVERIFIED).toBe("UNVERIFIED");
    expect(VERIFICATION_STATUS.VERIFIED).toBe("VERIFIED");
  });

  it("CONSULTATION_MODALITY has 2 values", () => {
    expect(Object.keys(CONSULTATION_MODALITY)).toHaveLength(2);
    expect(CONSULTATION_MODALITY.VIDEO).toBe("VIDEO");
    expect(CONSULTATION_MODALITY.OFFICE).toBe("OFFICE");
  });

  it("VERIFIED_DOCUMENT_TYPE has 5 values", () => {
    expect(Object.keys(VERIFIED_DOCUMENT_TYPE)).toHaveLength(5);
    expect(VERIFIED_DOCUMENT_TYPE.BAR_CARD).toBe("BAR_CARD");
  });
});

// ============================================================
// Constants
// ============================================================

describe("Constants", () => {
  it("CONSULTATION_DURATIONS contains [15, 30, 45, 60]", () => {
    expect([...CONSULTATION_DURATIONS]).toEqual([15, 30, 45, 60]);
  });

  it("COMPLETION_SECTIONS has 10 sections", () => {
    expect(COMPLETION_SECTIONS).toHaveLength(10);
  });

  it("MVP_COMPLETION_SECTIONS has 6 sections", () => {
    expect(MVP_COMPLETION_SECTIONS).toHaveLength(6);
  });

  it("PUBLISH_BLOCKING_PRECONDITIONS includes identity, expertise, offer", () => {
    expect(PUBLISH_BLOCKING_PRECONDITIONS).toContain("identity");
    expect(PUBLISH_BLOCKING_PRECONDITIONS).toContain("expertise");
    expect(PUBLISH_BLOCKING_PRECONDITIONS).toContain("offer");
  });
});

// ============================================================
// updateProfileSchema
// ============================================================

describe("updateProfileSchema", () => {
  it("accepts professionalTitle only", () => {
    const result = updateProfileSchema.safeParse({
      professionalTitle: "Avocate",
    });
    expect(result.success).toBe(true);
  });

  it("accepts bio only", () => {
    const result = updateProfileSchema.safeParse({ bio: "Ma biographie..." });
    expect(result.success).toBe(true);
  });

  it("accepts barAssociationId only", () => {
    const result = updateProfileSchema.safeParse({
      barAssociationId: "bar-001",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null for optional nullable fields", () => {
    const result = updateProfileSchema.safeParse({
      bio: null,
      barAssociationId: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty object (at least one field required)", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects professionalTitle exceeding 120 chars", () => {
    const result = updateProfileSchema.safeParse({
      professionalTitle: "a".repeat(121),
    });
    expect(result.success).toBe(false);
  });

  it("rejects bio exceeding 600 chars", () => {
    const result = updateProfileSchema.safeParse({ bio: "a".repeat(601) });
    expect(result.success).toBe(false);
  });

  it("accepts firstName and lastName", () => {
    const result = updateProfileSchema.safeParse({
      firstName: "Amina",
      lastName: "El Fassi",
    });
    expect(result.success).toBe(true);
  });

  it("accepts photoUrl as nullable", () => {
    const result = updateProfileSchema.safeParse({ photoUrl: null });
    expect(result.success).toBe(true);
  });

  it("accepts photoUrl as string", () => {
    const result = updateProfileSchema.safeParse({
      photoUrl: "https://example.com/photo.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty firstName", () => {
    const result = updateProfileSchema.safeParse({ firstName: "" });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// updateExpertiseSchema
// ============================================================

describe("updateExpertiseSchema", () => {
  it("accepts valid expertise", () => {
    const result = updateExpertiseSchema.safeParse({
      specializationIds: ["spec-1"],
      practiceAreaIds: ["pa-1"],
      languageIds: ["lang-1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty specializationIds", () => {
    const result = updateExpertiseSchema.safeParse({
      specializationIds: [],
      practiceAreaIds: ["pa-1"],
      languageIds: ["lang-1"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty practiceAreaIds", () => {
    const result = updateExpertiseSchema.safeParse({
      specializationIds: ["spec-1"],
      practiceAreaIds: [],
      languageIds: ["lang-1"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty languageIds", () => {
    const result = updateExpertiseSchema.safeParse({
      specializationIds: ["spec-1"],
      practiceAreaIds: ["pa-1"],
      languageIds: [],
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// updateContactSchema
// ============================================================

describe("updateContactSchema", () => {
  it("accepts phone only", () => {
    const result = updateContactSchema.safeParse({
      phone: "+212 6 12 34 56 78",
    });
    expect(result.success).toBe(true);
  });

  it("accepts publicEmail with valid email", () => {
    const result = updateContactSchema.safeParse({
      publicEmail: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = updateContactSchema.safeParse({
      publicEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty object", () => {
    const result = updateContactSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts null for nullable fields", () => {
    const result = updateContactSchema.safeParse({
      phone: null,
      whatsapp: null,
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// updateOfficeSchema
// ============================================================

describe("updateOfficeSchema", () => {
  it("accepts name and address", () => {
    const result = updateOfficeSchema.safeParse({
      name: "Cabinet El Fassi",
      address: "12 rue de la Liberté",
    });
    expect(result.success).toBe(true);
  });

  it("accepts latitude and longitude as numbers", () => {
    const result = updateOfficeSchema.safeParse({
      latitude: 33.5731,
      longitude: -7.5898,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty object", () => {
    const result = updateOfficeSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts both coordinates as null", () => {
    const result = updateOfficeSchema.safeParse({
      latitude: null,
      longitude: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects latitude without longitude", () => {
    const result = updateOfficeSchema.safeParse({
      latitude: 33.5731,
    });
    expect(result.success).toBe(false);
  });

  it("rejects longitude without latitude", () => {
    const result = updateOfficeSchema.safeParse({
      longitude: -7.5898,
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// createOfferSchema
// ============================================================

describe("createOfferSchema", () => {
  it("accepts valid offer", () => {
    const result = createOfferSchema.safeParse({
      title: "Consultation juridique",
      price: 300,
      durationMinutes: 30,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects price <= 0", () => {
    const result = createOfferSchema.safeParse({
      title: "Test",
      price: 0,
      durationMinutes: 30,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid durationMinutes", () => {
    const result = createOfferSchema.safeParse({
      title: "Test",
      price: 300,
      durationMinutes: 20,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty modalities", () => {
    const result = createOfferSchema.safeParse({
      title: "Test",
      price: 300,
      durationMinutes: 30,
      modalities: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid modality value", () => {
    const result = createOfferSchema.safeParse({
      title: "Test",
      price: 300,
      durationMinutes: 30,
      modalities: ["PHONE"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const result = createOfferSchema.safeParse({
      price: 300,
      durationMinutes: 30,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(false);
  });

  it("defaults active to true and order to 0", () => {
    const result = createOfferSchema.safeParse({
      title: "Test",
      price: 300,
      durationMinutes: 30,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
      expect(result.data.order).toBe(0);
    }
  });
});

// ============================================================
// updateOfferSchema
// ============================================================

describe("updateOfferSchema", () => {
  it("accepts full replacement with all fields", () => {
    const result = updateOfferSchema.safeParse({
      title: "Consultation",
      price: 350,
      durationMinutes: 45,
      modalities: ["VIDEO", "OFFICE"],
      active: true,
      order: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing active (required for PUT)", () => {
    const result = updateOfferSchema.safeParse({
      title: "Consultation",
      price: 350,
      durationMinutes: 45,
      modalities: ["VIDEO"],
      order: 0,
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// toggleOfferSchema
// ============================================================

describe("toggleOfferSchema", () => {
  it("accepts { active: true }", () => {
    const result = toggleOfferSchema.safeParse({ active: true });
    expect(result.success).toBe(true);
  });

  it("accepts { active: false }", () => {
    const result = toggleOfferSchema.safeParse({ active: false });
    expect(result.success).toBe(true);
  });

  it("rejects missing active", () => {
    const result = toggleOfferSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ============================================================
// Education schemas
// ============================================================

describe("createEducationSchema", () => {
  it("accepts valid education", () => {
    const result = createEducationSchema.safeParse({
      degree: "Master en Droit",
      institution: "Université Mohammed V",
      startYear: 2017,
      endYear: 2019,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null endYear (ongoing)", () => {
    const result = createEducationSchema.safeParse({
      degree: "Master",
      institution: "Univ",
      startYear: 2020,
      endYear: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects startYear before 1950", () => {
    const result = createEducationSchema.safeParse({
      degree: "Master",
      institution: "Univ",
      startYear: 1949,
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================
// Experience schemas
// ============================================================

describe("createExperienceSchema", () => {
  it("accepts valid experience", () => {
    const result = createExperienceSchema.safeParse({
      position: "Avocate",
      organization: "Cabinet XYZ",
      startYear: 2020,
    });
    expect(result.success).toBe(true);
  });

  it("defaults current to false", () => {
    const result = createExperienceSchema.safeParse({
      position: "Avocate",
      organization: "Cabinet XYZ",
      startYear: 2020,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.current).toBe(false);
    }
  });
});

// ============================================================
// Certification schemas
// ============================================================

describe("createCertificationSchema", () => {
  it("accepts valid certification", () => {
    const result = createCertificationSchema.safeParse({
      title: "Certificat en droit fiscal",
      issuer: "Barreau de Casablanca",
      issueYear: 2020,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional expiryYear as null", () => {
    const result = createCertificationSchema.safeParse({
      title: "Cert",
      issuer: "Org",
      issueYear: 2020,
      expiryYear: null,
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// Membership schemas
// ============================================================

describe("createMembershipSchema", () => {
  it("accepts valid membership", () => {
    const result = createMembershipSchema.safeParse({
      organization: "Barreau de Casablanca",
      startYear: 2015,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional role", () => {
    const result = createMembershipSchema.safeParse({
      organization: "Barreau",
      role: "Membre actif",
      startYear: 2015,
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// Public response schemas
// ============================================================

describe("publicProfileResponseSchema", () => {
  it("accepts a valid public profile response", () => {
    const result = publicProfileResponseSchema.safeParse({
      id: "profile-001",
      identity: {
        firstName: "Amina",
        lastName: "El Fassi",
        professionalTitle: "Avocate",
        photoUrl: "/uploads/abc.jpg",
      },
      biography: { bio: "Ma bio..." },
      barAssociation: { id: "bar-1", name: "Barreau de Casablanca" },
      office: null,
      expertise: {
        specializations: [{ id: "s1", name: "Droit des affaires" }],
        practiceAreas: [],
        languages: [{ id: "l1", name: "Français" }],
      },
      offers: [],
      education: [],
      experience: [],
      certifications: [],
      isVerified: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing isVerified", () => {
    const result = publicProfileResponseSchema.safeParse({
      id: "profile-001",
      identity: {
        firstName: "A",
        lastName: "B",
        professionalTitle: null,
        photoUrl: null,
      },
      biography: { bio: null },
      barAssociation: null,
      office: null,
      expertise: { specializations: [], practiceAreas: [], languages: [] },
      offers: [],
      education: [],
      experience: [],
      certifications: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("publicOfferResponseSchema", () => {
  it("accepts a valid public offer", () => {
    const result = publicOfferResponseSchema.safeParse({
      id: "offer-1",
      title: "Consultation",
      description: null,
      price: 300,
      currency: "MAD",
      durationMinutes: 30,
      modalities: ["VIDEO"],
    });
    expect(result.success).toBe(true);
  });
});
