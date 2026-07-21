export const VERIFIED_DOCUMENT_TYPE = {
  BAR_CARD: "BAR_CARD",
  ID_CARD: "ID_CARD",
  DIPLOMA: "DIPLOMA",
  CERTIFICATE: "CERTIFICATE",
  OTHER: "OTHER",
} as const;

export type VerifiedDocumentType =
  (typeof VERIFIED_DOCUMENT_TYPE)[keyof typeof VERIFIED_DOCUMENT_TYPE];
