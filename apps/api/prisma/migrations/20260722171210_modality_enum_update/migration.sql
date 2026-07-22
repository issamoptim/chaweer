-- PD-03: Replace OFFICE modality with AUDIO and CHAT
-- Safe: ConsultationOffer table is empty, no records use OFFICE

-- Add new enum values
ALTER TYPE "ConsultationModality" ADD VALUE IF NOT EXISTS 'AUDIO';
ALTER TYPE "ConsultationModality" ADD VALUE IF NOT EXISTS 'CHAT';

-- Remove OFFICE (safe: no rows reference it)
-- PostgreSQL does not support DROP VALUE directly, so we recreate the enum
ALTER TYPE "ConsultationModality" RENAME TO "ConsultationModality_old";

CREATE TYPE "ConsultationModality" AS ENUM ('VIDEO', 'AUDIO', 'CHAT');

-- Update the column to use the new type
ALTER TABLE "ConsultationOffer"
  ALTER COLUMN "modalities" TYPE "ConsultationModality"[]
  USING "modalities"::text[]::"ConsultationModality"[];

DROP TYPE "ConsultationModality_old";
