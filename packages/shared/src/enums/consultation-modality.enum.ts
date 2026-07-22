export const CONSULTATION_MODALITY = {
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  CHAT: "CHAT",
} as const;

export type ConsultationModality =
  (typeof CONSULTATION_MODALITY)[keyof typeof CONSULTATION_MODALITY];
