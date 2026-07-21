export {
  updateProfileSchema,
  updateExpertiseSchema,
} from '@chaweer/shared';
export type { UpdateProfileInput, UpdateExpertiseInput } from '@chaweer/shared';

import { z } from 'zod';

const CONSULTATION_DURATIONS = [15, 30, 45, 60] as const;

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
  modalities: z.array(z.enum(['VIDEO', 'OFFICE'])).min(1, 'Sélectionnez au moins une modalité'),
});

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
