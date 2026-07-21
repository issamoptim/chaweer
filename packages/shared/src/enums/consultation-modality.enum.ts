export const CONSULTATION_MODALITY = {
  VIDEO: "VIDEO",
  OFFICE: "OFFICE",
} as const;

export type ConsultationModality =
  (typeof CONSULTATION_MODALITY)[keyof typeof CONSULTATION_MODALITY];
