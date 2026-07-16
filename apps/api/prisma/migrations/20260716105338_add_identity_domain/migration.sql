-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'PROFESSIONAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_EMAIL_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "authProvider" "AuthProvider" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_EMAIL_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_authProvider_idx" ON "User"("authProvider");
