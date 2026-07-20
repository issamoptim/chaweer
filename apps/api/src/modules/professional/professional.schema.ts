import { z } from 'zod';

const optionalTrimmedNullable = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .nullable()
    .optional();

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'Le prénom est requis')
      .max(100, 'Le prénom est trop long')
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom est trop long')
      .optional(),
    photoUrl: optionalTrimmedNullable(2000, 'URL de photo invalide'),
    barAssociationId: z.string().trim().min(1).nullable().optional(),
    cityId: z.string().trim().min(1).nullable().optional(),
    professionalPhone: optionalTrimmedNullable(30, 'Le numéro de téléphone est trop long'),
    officeAddress: optionalTrimmedNullable(255, "L'adresse est trop longue"),
    bio: optionalTrimmedNullable(600, 'La biographie est trop longue'),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni',
  });

export const updateExpertiseSchema = z.object({
  specializationIds: z
    .array(z.string().trim().min(1))
    .min(1, 'Sélectionnez au moins une spécialité'),
  practiceAreaIds: z
    .array(z.string().trim().min(1))
    .min(1, 'Sélectionnez au moins une situation'),
  languageIds: z
    .array(z.string().trim().min(1))
    .min(1, 'Sélectionnez au moins une langue'),
});

export const CONSULTATION_DURATIONS = [15, 30, 45, 60] as const;

export const updateOfferSchema = z.object({
  price: z
    .number()
    .int('Le tarif doit être un entier')
    .positive('Le tarif doit être supérieur à 0'),
  durationMinutes: z
    .number()
    .refine((v) => (CONSULTATION_DURATIONS as readonly number[]).includes(v), {
      message: 'Durée invalide',
    }),
  modalities: z
    .array(z.enum(['VIDEO', 'OFFICE']))
    .min(1, 'Sélectionnez au moins une modalité'),
});

export type UpdateProfessionalProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateExpertiseInput = z.infer<typeof updateExpertiseSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
