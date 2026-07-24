-- AlterTable: remove columns from Certification
ALTER TABLE "Certification" DROP COLUMN "issueYear";
ALTER TABLE "Certification" DROP COLUMN "expiryYear";
ALTER TABLE "Certification" DROP COLUMN "credentialId";
