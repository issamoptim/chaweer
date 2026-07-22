-- PD-02: Deprecate consultation duration.
-- durationMinutes is no longer collected in the UI nor required by the API.
-- Give it a default value so offers can be created without providing it.
ALTER TABLE "ConsultationOffer" ALTER COLUMN "durationMinutes" SET DEFAULT 0;
