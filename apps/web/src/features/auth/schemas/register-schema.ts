import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Le nom complet est requis")
    .max(200, "Le nom complet est trop long")
    .refine((value) => value.trim().includes(" "), {
      message: "Veuillez saisir votre prénom et votre nom",
    }),
  email: z.string().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
  terms: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1),
  };
}
