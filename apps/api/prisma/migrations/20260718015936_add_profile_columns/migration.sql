-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "notificationEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationPush" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferredLanguage" TEXT;
