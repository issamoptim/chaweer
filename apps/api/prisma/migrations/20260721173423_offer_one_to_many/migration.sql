-- DropIndex
DROP INDEX "ConsultationOffer_profileId_key";

-- CreateIndex
CREATE INDEX "ConsultationOffer_profileId_idx" ON "ConsultationOffer"("profileId");
