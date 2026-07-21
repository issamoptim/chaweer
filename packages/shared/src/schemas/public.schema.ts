import { z } from "zod";

// ============================================================
// GET /professionals/:id — public profile response
// ============================================================

export const publicProfileResponseSchema = z.object({
  id: z.string(),
  identity: z.object({
    firstName: z.string(),
    lastName: z.string(),
    professionalTitle: z.string().nullable(),
    photoUrl: z.string().nullable(),
  }),
  biography: z.object({
    bio: z.string().nullable(),
  }),
  barAssociation: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  office: z
    .object({
      name: z.string().nullable(),
      address: z.string().nullable(),
      city: z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .nullable(),
      googleMapsUrl: z.string().nullable(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
    })
    .nullable(),
  expertise: z.object({
    specializations: z.array(z.object({ id: z.string(), name: z.string() })),
    practiceAreas: z.array(z.object({ id: z.string(), name: z.string() })),
    languages: z.array(z.object({ id: z.string(), name: z.string() })),
  }),
  offers: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      currency: z.string(),
      durationMinutes: z.number(),
      modalities: z.array(z.enum(["VIDEO", "OFFICE"])),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string(),
      institution: z.string(),
      startYear: z.number(),
      endYear: z.number().nullable(),
      description: z.string().nullable(),
      order: z.number(),
    }),
  ),
  experience: z.array(
    z.object({
      id: z.string(),
      position: z.string(),
      organization: z.string(),
      startYear: z.number(),
      endYear: z.number().nullable(),
      current: z.boolean(),
      description: z.string().nullable(),
      order: z.number(),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      issuer: z.string(),
      issueYear: z.number(),
      expiryYear: z.number().nullable(),
      credentialId: z.string().nullable(),
      order: z.number(),
    }),
  ),
  isVerified: z.boolean(),
});

// Response type is defined in contracts/public.contract.ts (canonical)

// ============================================================
// GET /professionals/:id/offers — public offers list
// ============================================================

export const publicOfferResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  currency: z.string(),
  durationMinutes: z.number(),
  modalities: z.array(z.enum(["VIDEO", "OFFICE"])),
});

// Response type is defined in contracts/public.contract.ts (canonical)
