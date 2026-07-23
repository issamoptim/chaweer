import { z } from "zod";

const optionalTrimmedNullable = (max: number) =>
  z.string().trim().max(max).nullable().optional();

const optionalTrimmed = (max: number) => z.string().trim().max(max).optional();

// ============================================================
// PATCH /professional/profile — identity + biography
// ============================================================

export const updateProfileSchema = z
  .object({
    // User aggregate fields
    firstName: z.string().trim().min(1).max(100).optional(),
    lastName: z.string().trim().min(1).max(100).optional(),
    // ProfessionalProfile aggregate fields
    professionalTitle: optionalTrimmed(120),
    registrationNumber: optionalTrimmedNullable(50),
    yearsOfExperience: z.number().int().min(0).max(80).nullable().optional(),
    photoUrl: optionalTrimmedNullable(2000),
    bio: optionalTrimmedNullable(1000),
    barAssociationId: z.string().trim().min(1).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================
// PUT /professional/expertise
// ============================================================

export const updateExpertiseSchema = z.object({
  specializationIds: z.array(z.string().trim().min(1)).min(1),
  practiceAreaIds: z.array(z.string().trim().min(1)).min(0),
  languageIds: z.array(z.string().trim().min(1)).min(0),
});

export type UpdateExpertiseInput = z.infer<typeof updateExpertiseSchema>;

// ============================================================
// PATCH /professional/contact
// ============================================================

export const updateContactSchema = z
  .object({
    phone: optionalTrimmedNullable(30),
    whatsapp: optionalTrimmedNullable(30),
    publicEmail: z.string().trim().max(255).email().nullable().optional(),
    website: optionalTrimmedNullable(500),
    linkedInUrl: optionalTrimmedNullable(500),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateContactInput = z.infer<typeof updateContactSchema>;

// ============================================================
// PATCH /professional/office
// ============================================================

export const updateOfficeSchema = z
  .object({
    name: optionalTrimmedNullable(200),
    address: optionalTrimmedNullable(255),
    cityId: z.string().trim().min(1).nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      const lat = data.latitude;
      const lng = data.longitude;
      const bothNull = lat === null && lng === null;
      const bothUndefined = lat === undefined && lng === undefined;
      const bothProvided =
        lat !== null && lat !== undefined && lng !== null && lng !== undefined;
      return bothNull || bothUndefined || bothProvided;
    },
    {
      message: "Latitude and longitude must be both provided or both null",
    },
  )
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;

// ============================================================
// POST /professional/offers — create
// ============================================================

export const createOfferSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
  price: z.number().int().positive(),
  modalities: z.array(z.enum(["VIDEO", "AUDIO", "CHAT"])).min(1),
  active: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

// ============================================================
// PUT /professional/offers/:offerId — full replacement
// ============================================================

export const updateOfferSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
  price: z.number().int().positive(),
  modalities: z.array(z.enum(["VIDEO", "AUDIO", "CHAT"])).min(1),
  active: z.boolean(),
  order: z.number().int(),
});

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

// ============================================================
// PATCH /professional/offers/:offerId/toggle
// ============================================================

export const toggleOfferSchema = z.object({
  active: z.boolean(),
});

export type ToggleOfferInput = z.infer<typeof toggleOfferSchema>;

// ============================================================
// POST /professional/publish — no body
// POST /professional/unpublish — no body
// ============================================================

export const publishSchema = z.object({}).optional();
export const unpublishSchema = z.object({}).optional();

// ============================================================
// Next-Phase: Education
// ============================================================

export const createEducationSchema = z.object({
  degree: z.string().trim().min(1).max(200),
  institution: z.string().trim().min(1).max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .optional(),
  description: z.string().trim().max(500).nullable().optional(),
  order: z.number().int().optional().default(0),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;

export const updateEducationSchema = z.object({
  degree: z.string().trim().min(1).max(200),
  institution: z.string().trim().min(1).max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .optional(),
  description: z.string().trim().max(500).nullable().optional(),
  order: z.number().int(),
});

export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;

// ============================================================
// Next-Phase: Experience
// ============================================================

export const createExperienceSchema = z.object({
  position: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .optional(),
  current: z.boolean().optional().default(false),
  description: z.string().trim().max(500).nullable().optional(),
  order: z.number().int().optional().default(0),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;

export const updateExperienceSchema = z.object({
  position: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 10)
    .nullable()
    .optional(),
  current: z.boolean(),
  description: z.string().trim().max(500).nullable().optional(),
  order: z.number().int(),
});

export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;

// ============================================================
// Next-Phase: Certifications
// ============================================================

export const createCertificationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issueYear: z.number().int().min(1950).max(new Date().getFullYear()),
  expiryYear: z.number().int().min(1950).nullable().optional(),
  credentialId: z.string().trim().max(100).nullable().optional(),
  order: z.number().int().optional().default(0),
});

export type CreateCertificationInput = z.infer<
  typeof createCertificationSchema
>;

export const updateCertificationSchema = z.object({
  title: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issueYear: z.number().int().min(1950).max(new Date().getFullYear()),
  expiryYear: z.number().int().min(1950).nullable().optional(),
  credentialId: z.string().trim().max(100).nullable().optional(),
  order: z.number().int(),
});

export type UpdateCertificationInput = z.infer<
  typeof updateCertificationSchema
>;

// ============================================================
// Next-Phase: Memberships
// ============================================================

export const createMembershipSchema = z.object({
  organization: z.string().trim().min(1).max(200),
  role: z.string().trim().max(200).nullable().optional(),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z.number().int().min(1950).nullable().optional(),
  order: z.number().int().optional().default(0),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;

export const updateMembershipSchema = z.object({
  organization: z.string().trim().min(1).max(200),
  role: z.string().trim().max(200).nullable().optional(),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z.number().int().min(1950).nullable().optional(),
  order: z.number().int(),
});

export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;
