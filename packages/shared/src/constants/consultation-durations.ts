export const CONSULTATION_DURATIONS = [15, 30, 45, 60] as const;

export type ConsultationDuration = (typeof CONSULTATION_DURATIONS)[number];

export const DEFAULT_CURRENCY = "MAD";

export const MAX_OFFERS_PER_PROFILE = 10;
