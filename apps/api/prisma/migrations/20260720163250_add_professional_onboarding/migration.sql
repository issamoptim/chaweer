-- CreateEnum
CREATE TYPE "ProfessionalProfileStatus" AS ENUM ('DRAFT', 'PENDING_VERIFICATION', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ConsultationModality" AS ENUM ('VIDEO', 'OFFICE');

-- CreateTable
CREATE TABLE "BarAssociation" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarAssociation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeArea" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ProfessionalProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "barAssociationId" TEXT,
    "cityId" TEXT,
    "professionalPhone" TEXT,
    "officeAddress" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalSpecialization" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalPracticeArea" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "practiceAreaId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalPracticeArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalLanguage" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "ProfessionalLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationOffer" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MAD',
    "durationMinutes" INTEGER NOT NULL,
    "modalities" "ConsultationModality"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BarAssociation_key_key" ON "BarAssociation"("key");

-- CreateIndex
CREATE UNIQUE INDEX "City_key_key" ON "City"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_key_key" ON "Specialization"("key");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeArea_key_key" ON "PracticeArea"("key");

-- CreateIndex
CREATE INDEX "PracticeArea_specializationId_idx" ON "PracticeArea"("specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_status_idx" ON "ProfessionalProfile"("status");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_barAssociationId_idx" ON "ProfessionalProfile"("barAssociationId");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_cityId_idx" ON "ProfessionalProfile"("cityId");

-- CreateIndex
CREATE INDEX "ProfessionalSpecialization_profileId_idx" ON "ProfessionalSpecialization"("profileId");

-- CreateIndex
CREATE INDEX "ProfessionalSpecialization_specializationId_idx" ON "ProfessionalSpecialization"("specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalSpecialization_profileId_specializationId_key" ON "ProfessionalSpecialization"("profileId", "specializationId");

-- CreateIndex
CREATE INDEX "ProfessionalPracticeArea_profileId_idx" ON "ProfessionalPracticeArea"("profileId");

-- CreateIndex
CREATE INDEX "ProfessionalPracticeArea_practiceAreaId_idx" ON "ProfessionalPracticeArea"("practiceAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalPracticeArea_profileId_practiceAreaId_key" ON "ProfessionalPracticeArea"("profileId", "practiceAreaId");

-- CreateIndex
CREATE INDEX "ProfessionalLanguage_profileId_idx" ON "ProfessionalLanguage"("profileId");

-- CreateIndex
CREATE INDEX "ProfessionalLanguage_languageId_idx" ON "ProfessionalLanguage"("languageId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalLanguage_profileId_languageId_key" ON "ProfessionalLanguage"("profileId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationOffer_profileId_key" ON "ConsultationOffer"("profileId");

-- AddForeignKey
ALTER TABLE "PracticeArea" ADD CONSTRAINT "PracticeArea_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_barAssociationId_fkey" FOREIGN KEY ("barAssociationId") REFERENCES "BarAssociation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialization" ADD CONSTRAINT "ProfessionalSpecialization_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialization" ADD CONSTRAINT "ProfessionalSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalPracticeArea" ADD CONSTRAINT "ProfessionalPracticeArea_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalPracticeArea" ADD CONSTRAINT "ProfessionalPracticeArea_practiceAreaId_fkey" FOREIGN KEY ("practiceAreaId") REFERENCES "PracticeArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalLanguage" ADD CONSTRAINT "ProfessionalLanguage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalLanguage" ADD CONSTRAINT "ProfessionalLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationOffer" ADD CONSTRAINT "ConsultationOffer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
