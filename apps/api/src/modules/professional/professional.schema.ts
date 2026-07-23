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
