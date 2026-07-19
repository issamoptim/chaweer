import { z } from 'zod';
import { COUNTRIES, NATIONALITIES, CITIES_BY_COUNTRY } from './profile.constants';

export const updatePreferencesSchema = z
  .object({
    preferredLanguage: z.enum(['fr', 'ar', 'en']).optional(),
    notificationEmail: z.boolean().optional(),
    notificationPush: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.preferredLanguage !== undefined ||
      data.notificationEmail !== undefined ||
      data.notificationPush !== undefined,
    { message: 'At least one preference must be provided' },
  );

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .max(100, 'Le prénom est trop long')
      .nullable()
      .optional(),
    lastName: z
      .string()
      .trim()
      .max(100, 'Le nom est trop long')
      .nullable()
      .optional(),
    phone: z
      .string()
      .trim()
      .max(30, 'Le numéro de téléphone est trop long')
      .nullable()
      .optional(),
    country: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : val),
      z.enum(COUNTRIES, {
        message: 'Pays invalide',
      }).nullable().optional(),
    ),
    city: z.string().trim().nullable().optional(),
    nationality: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : val),
      z.enum(NATIONALITIES, {
        message: 'Nationalité invalide',
      }).nullable().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.country && data.city) {
      const validCities = CITIES_BY_COUNTRY[data.country];
      if (!validCities || !validCities.includes(data.city)) {
        ctx.addIssue({
          path: ['city'],
          code: z.ZodIssueCode.custom,
          message: `La ville "${data.city}" n'est pas valide pour le pays "${data.country}"`,
          options: validCities ? [...validCities] : [],
        });
      }
    }
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
