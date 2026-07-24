export {
  updateProfileSchema,
  updateExpertiseSchema,
  updateContactSchema,
  updateOfficeSchema,
} from '@chaweer/shared';
export type {
  UpdateProfileInput,
  UpdateExpertiseInput,
  UpdateContactInput,
  UpdateOfficeInput,
} from '@chaweer/shared';

import { z } from 'zod';

export const updateOfferSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Le titre est obligatoire')
    .max(120, 'Le titre ne doit pas dépasser 120 caractères'),
  description: z
    .string()
    .trim()
    .min(1, 'La description est obligatoire')
    .max(500, 'La description ne doit pas dépasser 500 caractères'),
  price: z
    .number()
    .int('Le tarif doit être un entier')
    .positive('Le tarif doit être supérieur à 0'),
  modalities: z.array(z.enum(['VIDEO', 'AUDIO', 'CHAT'])).min(1, 'Sélectionnez au moins une modalité'),
});

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

export const educationItemSchema = z.object({
  degree: z.string().trim().min(1, 'Le diplôme est obligatoire').max(200),
  institution: z.string().trim().min(1, "L'établissement est obligatoire").max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z.number().int().min(1950).max(new Date().getFullYear() + 10).optional(),
  description: z.string().trim().max(500).optional(),
});

export const setEducationSchema = z.array(educationItemSchema);

export const experienceItemSchema = z.object({
  position: z.string().trim().min(1, 'Le poste est obligatoire').max(200),
  organization: z.string().trim().min(1, "L'organisation est obligatoire").max(200),
  startYear: z.number().int().min(1950).max(new Date().getFullYear()),
  endYear: z.number().int().min(1950).max(new Date().getFullYear() + 10).optional(),
  current: z.boolean().optional(),
  description: z.string().trim().max(500).optional(),
});

export const setExperienceSchema = z.array(experienceItemSchema);

export const certificationItemSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire').max(200),
  issuer: z.string().trim().min(1, "L'émetteur est obligatoire").max(200),
});

export const setCertificationsSchema = z.array(certificationItemSchema);

export type EducationInput = z.infer<typeof educationItemSchema>;
export type ExperienceInput = z.infer<typeof experienceItemSchema>;
export type CertificationInput = z.infer<typeof certificationItemSchema>;
