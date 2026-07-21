import { z } from "zod";
import { COUNTRIES, NATIONALITIES, CITIES_BY_COUNTRY } from "../constants/reference-data";

export const editProfileSchema = z
  .object({
    firstName: z.string().trim().max(100, "Le prénom est trop long").nullable().optional(),
    lastName: z.string().trim().max(100, "Le nom est trop long").nullable().optional(),
    phone: z.string().trim().max(30, "Le numéro de téléphone est trop long").nullable().optional(),
    country: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : val),
      z
        .enum(COUNTRIES, {
          message: "Pays invalide",
        })
        .nullable()
        .optional()
    ),
    city: z.string().trim().nullable().optional(),
    nationality: z.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : val),
      z
        .enum(NATIONALITIES, {
          message: "Nationalité invalide",
        })
        .nullable()
        .optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.country && data.city) {
      const validCities = CITIES_BY_COUNTRY[data.country];
      if (!validCities || !validCities.includes(data.city)) {
        ctx.addIssue({
          path: ["city"],
          code: z.ZodIssueCode.custom,
          message: `La ville "${data.city}" n'est pas valide pour le pays "${data.country}"`,
        });
      }
    }
  });

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
