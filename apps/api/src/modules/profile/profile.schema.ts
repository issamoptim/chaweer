import { z } from 'zod';

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
