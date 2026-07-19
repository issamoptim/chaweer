import type { AuthErrorCode } from "../types/auth-types";

const errorMessages: Record<AuthErrorCode, string> = {
  VALIDATION_ERROR: "Veuillez vérifier les informations saisies.",
  INVALID_CREDENTIALS: "Adresse e-mail ou mot de passe incorrect.",
  EMAIL_ALREADY_EXISTS: "Un compte existe déjà avec cette adresse e-mail.",
  EMAIL_NOT_VERIFIED: "Veuillez vérifier votre adresse e-mail avant de vous connecter.",
  ACCOUNT_SUSPENDED: "Votre compte a été suspendu. Contactez le support.",
  INVALID_REFRESH_TOKEN: "Votre session a expiré. Veuillez vous reconnecter.",
  TOKEN_EXPIRED: "Votre session a expiré. Veuillez vous reconnecter.",
  UNAUTHORIZED: "Vous devez être connecté pour effectuer cette action.",
  FORBIDDEN: "Vous n'avez pas la permission d'effectuer cette action.",
  NOT_FOUND: "Ressource introuvable.",
  CONFLICT: "Un conflit est survenu. Veuillez réessayer.",
  INTERNAL_ERROR: "Une erreur est survenue. Veuillez réessayer.",
  GOOGLE_AUTH_FAILED: "L'authentification Google a échoué. Veuillez réessayer.",
  INVALID_GOOGLE_TOKEN: "Le jeton Google est invalide. Veuillez réessayer.",
  PROVIDER_MISMATCH: "Cette adresse e-mail utilise une autre méthode de connexion.",
  GOOGLE_ACCOUNT_ALREADY_LINKED: "Ce compte Google est déjà associé à un autre utilisateur.",
  GOOGLE_ACCOUNT_NOT_VERIFIED: "Votre compte Google n'est pas vérifié.",
  INVALID_GOOGLE_IDENTITY: "L'identité Google est invalide. Veuillez réessayer.",
  ACCOUNT_DELETED: "Ce compte a été supprimé. Souhaitez-vous le recréer ?",
  RATE_LIMIT_EXCEEDED: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
};

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return errorMessages[code] ?? "Une erreur inattendue est survenue. Veuillez réessayer.";
}

export function getAuthFieldError(code: AuthErrorCode, field?: string): string | null {
  if (code === "EMAIL_ALREADY_EXISTS" && field === "email") {
    return "Un compte existe déjà avec cette adresse e-mail.";
  }
  if (code === "INVALID_CREDENTIALS" && field === "password") {
    return "Adresse e-mail ou mot de passe incorrect.";
  }
  return null;
}
