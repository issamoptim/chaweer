# 02 — Prisma Schema Evolution

> **Phase:** 3.4 — Prisma Schema Evolution
> **Status:** Draft — awaiting validation
> **Date:** 2026-07-21
> **Prerequisites:**
> - UX Phase validated and frozen
> - Technical Design Blueprint approved (with 8 mandatory principles)
>
> **Mandatory principles applied:** P1 (DDD), P4 (Incremental Migration), P6 (Future Extensibility), P7 (Backward Compatibility), P8 (Documentation Quality)

---

## Table of Contents

1. [Evolution Summary](#1-evolution-summary)
2. [Current Schema](#2-current-schema)
3. [Target Schema](#3-target-schema)
4. [Enum Changes](#4-enum-changes)
5. [Model Changes](#5-model-changes)
6. [New Models](#6-new-models)
7. [Modified Models](#7-modified-models)
8. [Completion Computation](#8-completion-computation)
9. [Publication Pre-conditions](#9-publication-pre-conditions)
10. [Migration Plan](#10-migration-plan)
11. [Rollback Strategy](#11-rollback-strategy)
12. [Versioning Roadmap](#12-versioning-roadmap)

---

## 1. Evolution Summary

### 1.1 What Changes

| Category | Count | Details |
|---|---|---|
| New enums | 2 | `VerificationStatus`, `VerifiedDocumentType` |
| Modified enums | 1 | `ProfessionalProfileStatus` (add `UNPUBLISHED`) |
| New models | 10 | ProfessionalContact, Office, Education, ProfessionalExperience, Certification, ProfessionalMembership, Verification, VerifiedDocument, Availability, Award |
| Modified models | 2 | ProfessionalProfile (new fields + relations), ConsultationOffer (1:1 → 1:N) |
| Modified relations | 1 | City (add relation to Office) |
| Unchanged models | 7 | User, RefreshToken, ExternalIdentity, BarAssociation, City, Language, Specialization, PracticeArea + join tables |

### 1.2 Why These Changes (P8)

The validated UX introduces a modular Professional Space where the lawyer builds their profile through independent, editable cards. Each card maps to a domain entity. The current schema stores everything flat on `ProfessionalProfile` (phone, address, city) — this doesn't scale to the rich profile model needed (office name, map coordinates, multiple offers, education timeline, experience timeline, certifications, etc.).

The evolution follows DDD principles (P1): the ProfessionalProfile remains the aggregate root, and new entities are added as children with clear ownership boundaries.

### 1.3 Migration Principles (P4)

- **No destructive changes in Phase A** — only additive (new tables, new columns, new enums)
- **Old columns are kept** during transition — `professionalPhone`, `officeAddress`, `cityId` remain on ProfessionalProfile until Phase C
- **Every migration has a rollback** — see Section 11
- **Existing data remains compatible** — the API continues to work with old columns until new ones are populated

---

## 2. Current Schema

The current schema (244 lines) contains:

```
User                    — id, email, passwordHash, firstName, lastName, role, authProvider, status
RefreshToken            — token rotation for JWT
ExternalIdentity        — Google OAuth linking
ProfessionalProfile     — userId, status, barAssociationId, cityId, professionalPhone, officeAddress, bio, photoUrl
BarAssociation          — reference data
City                    — reference data
Language                — reference data
Specialization          — reference data
PracticeArea            — reference data (belongs to Specialization)
ProfessionalSpecialization — join table
ProfessionalPracticeArea   — join table
ProfessionalLanguage       — join table
ConsultationOffer       — 1:1 with ProfessionalProfile (@@unique on profileId)
```

**Key limitations:**
- No office name or map coordinates
- No education, experience, certifications, or memberships
- Only one consultation offer per profile (1:1 constraint)
- No verification tracking
- No publication timestamp
- Contact info (phone) mixed with profile data

---

## 3. Target Schema

### 3.1 Full Target Prisma Schema

```prisma
// ============================================================
// Generator & Datasource
// ============================================================

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ============================================================
// Enums
// ============================================================

enum Role {
  CLIENT
  PROFESSIONAL
  ADMIN
}

enum AuthProvider {
  LOCAL
  GOOGLE
}

enum UserStatus {
  PENDING_EMAIL_VERIFICATION
  ACTIVE
  SUSPENDED
  DELETED
}

enum IdentityProvider {
  GOOGLE
}

enum ProfessionalProfileStatus {
  DRAFT
  PENDING_VERIFICATION
  PUBLISHED
  UNPUBLISHED                    // [MVP] NEW — was published, then manually unpublished
}

enum ConsultationModality {
  VIDEO
  OFFICE
}

enum VerificationStatus {        // [Next] NEW enum
  UNVERIFIED
  PENDING
  VERIFIED
  REJECTED
}

enum VerifiedDocumentType {      // [Future] NEW enum
  BAR_CARD
  ID_CARD
  DIPLOMA
  CERTIFICATE
  OTHER
}

// ============================================================
// User & Auth (unchanged)
// ============================================================

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  passwordHash String?
  firstName    String
  lastName     String
  avatarUrl    String?
  role         Role         @default(CLIENT)
  authProvider AuthProvider
  status       UserStatus   @default(PENDING_EMAIL_VERIFICATION)
  phone        String?
  country      String?
  city         String?
  nationality  String?
  preferredLanguage String?
  notificationEmail  Boolean @default(true)
  notificationPush   Boolean @default(true)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  refreshTokens      RefreshToken[]
  externalIdentities ExternalIdentity[]
  professionalProfile ProfessionalProfile?

  @@index([role])
  @@index([status])
  @@index([authProvider])
}

model RefreshToken {
  id        String    @id @default(cuid())
  userId    String
  tokenHash String    @unique
  expiresAt DateTime
  createdAt DateTime  @default(now())
  revokedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model ExternalIdentity {
  id             String           @id @default(cuid())
  userId         String
  provider       IdentityProvider
  providerUserId String
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerUserId])
  @@index([userId])
  @@index([provider, providerUserId])
}

// ============================================================
// Reference Entities (unchanged except City)
// ============================================================

model BarAssociation {
  id        String   @id @default(cuid())
  key       String   @unique
  name      String
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profiles ProfessionalProfile[]
}

model City {
  id        String   @id @default(cuid())
  key       String   @unique
  name      String
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  profiles    ProfessionalProfile[]   // existing relation (kept during migration)
  offices     Office[]                // [MVP] NEW relation
}

model Language {
  id        String   @id @default(cuid())
  code      String   @unique
  name      String
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  professionals ProfessionalLanguage[]
}

model Specialization {
  id        String   @id @default(cuid())
  key       String   @unique
  name      String
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  practiceAreas PracticeArea[]
  professionals ProfessionalSpecialization[]
}

model PracticeArea {
  id               String   @id @default(cuid())
  key              String   @unique
  name             String
  specializationId String
  order            Int      @default(0)
  active           Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  specialization Specialization             @relation(fields: [specializationId], references: [id], onDelete: Cascade)
  professionals  ProfessionalPracticeArea[]

  @@index([specializationId])
}

// ============================================================
// Professional Profile (Aggregate Root) — MODIFIED
// ============================================================

model ProfessionalProfile {
  id                String                    @id @default(cuid())
  userId            String                    @unique
  status            ProfessionalProfileStatus @default(DRAFT)
  
  // Identity [MVP]
  professionalTitle String?                                 // [MVP] NEW field
  
  // Biography [MVP]
  bio               String?                   @db.VarChar(600)
  photoUrl          String?
  
  // Publication [MVP]
  publishedAt       DateTime?                               // [MVP] NEW field
  unpublishedAt     DateTime?                               // [Next] NEW field
  
  // Legacy fields (kept during migration, removed in Phase C)
  barAssociationId  String?
  cityId            String?                                 // kept temporarily
  professionalPhone String?                                 // kept temporarily
  officeAddress     String?                                 // kept temporarily
  
  // Child entity FKs (new)
  contactId         String?                  @unique         // [MVP] NEW
  officeId          String?                  @unique         // [MVP] NEW
  verificationId    String?                  @unique         // [Next] NEW
  availabilityId    String?                  @unique         // [Future] NEW
  
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt

  // Relations
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  barAssociation BarAssociation? @relation(fields: [barAssociationId], references: [id])
  city           City?           @relation(fields: [cityId], references: [id])   // kept during migration
  
  // Child entity relations (new)
  contact        ProfessionalContact?     @relation(fields: [contactId], references: [id])
  office         Office?                  @relation(fields: [officeId], references: [id])
  verification   Verification?           @relation(fields: [verificationId], references: [id])
  availability   Availability?            @relation(fields: [availabilityId], references: [id])
  
  // Collections
  specializations ProfessionalSpecialization[]
  practiceAreas   ProfessionalPracticeArea[]
  languages       ProfessionalLanguage[]
  offers          ConsultationOffer[]                     // renamed from `offer` (1:N)
  education       Education[]
  experience      ProfessionalExperience[]
  certifications  Certification[]
  memberships     ProfessionalMembership[]
  awards          Award[]                                  // [Future]

  @@index([status])
  @@index([barAssociationId])
}

// ============================================================
// ProfessionalContact — NEW [MVP]
// ============================================================

model ProfessionalContact {
  id          String  @id @default(cuid())
  profileId   String  @unique
  phone       String? @db.VarChar(30)     // [MVP]
  whatsapp    String? @db.VarChar(30)     // [Next]
  publicEmail String? @db.VarChar(255)    // [Next]
  website     String? @db.VarChar(500)    // [Next]
  linkedInUrl String? @db.VarChar(500)    // [Next]

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

// ============================================================
// Office — NEW [MVP]
// ============================================================

model Office {
  id            String  @id @default(cuid())
  profileId     String  @unique
  name          String? @db.VarChar(200)   // [MVP]
  address       String? @db.VarChar(255)   // [MVP]
  cityId        String?                     // [MVP]
  googleMapsUrl String? @db.VarChar(1000)  // [Next]
  latitude      Float?                      // [Next]
  longitude     Float?                      // [Next]

  city    City?               @relation(fields: [cityId], references: [id])
  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([cityId])
}

// ============================================================
// Education — NEW [Next]
// ============================================================

model Education {
  id          String  @id @default(cuid())
  profileId   String
  degree      String  @db.VarChar(200)
  institution String  @db.VarChar(200)
  startYear   Int
  endYear     Int?
  description String? @db.VarChar(500)
  order       Int     @default(0)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// ProfessionalExperience — NEW [Next]
// ============================================================

model ProfessionalExperience {
  id           String  @id @default(cuid())
  profileId    String
  position     String  @db.VarChar(200)
  organization String  @db.VarChar(200)
  startYear    Int
  endYear      Int?
  current      Boolean @default(false)
  description  String? @db.VarChar(500)
  order        Int     @default(0)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// Certification — NEW [Next]
// ============================================================

model Certification {
  id           String  @id @default(cuid())
  profileId    String
  title        String  @db.VarChar(200)
  issuer       String  @db.VarChar(200)
  issueYear    Int
  expiryYear   Int?
  credentialId String? @db.VarChar(100)
  verified     Boolean @default(false)    // [Future]
  order        Int     @default(0)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// ProfessionalMembership — NEW [Next]
// ============================================================

model ProfessionalMembership {
  id           String  @id @default(cuid())
  profileId    String
  organization String  @db.VarChar(200)
  role         String? @db.VarChar(200)
  startYear    Int
  endYear      Int?
  order        Int     @default(0)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// ConsultationOffer — MODIFIED (1:1 → 1:N) [MVP]
// ============================================================

model ConsultationOffer {
  id              String                 @id @default(cuid())
  profileId       String                 // NO LONGER @unique
  title           String                 @db.VarChar(200)   // [MVP] NEW
  description     String?                @db.VarChar(500)   // [Next] NEW
  price           Int
  currency        String                 @default("MAD")
  durationMinutes Int
  modalities      ConsultationModality[]
  active          Boolean                @default(true)     // [MVP] NEW
  order           Int                    @default(0)        // [MVP] NEW
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// Verification — NEW [Next]
// ============================================================

model Verification {
  id              String             @id @default(cuid())
  profileId       String             @unique
  status          VerificationStatus @default(UNVERIFIED)
  verifiedAt      DateTime?
  verifiedBy      String?            // FK → User (admin)
  rejectionReason String?            @db.VarChar(500)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  documents VerifiedDocument[]

  @@index([status])
}

// ============================================================
// VerifiedDocument — NEW [Future]
// ============================================================

model VerifiedDocument {
  id             String              @id @default(cuid())
  verificationId String
  type           VerifiedDocumentType
  fileUrl        String              @db.VarChar(2000)
  verified       Boolean             @default(false)
  uploadedAt     DateTime            @default(now())

  verification Verification @relation(fields: [verificationId], references: [id], onDelete: Cascade)

  @@index([verificationId])
}

// ============================================================
// Availability — NEW [Future]
// ============================================================

model Availability {
  id             String   @id @default(cuid())
  profileId      String   @unique
  weeklySchedule Json
  exceptionDates Json
  bufferMinutes  Int      @default(15)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

// ============================================================
// Award — NEW [Future]
// ============================================================

model Award {
  id          String  @id @default(cuid())
  profileId   String
  title       String  @db.VarChar(200)
  issuer      String  @db.VarChar(200)
  year        Int
  description String? @db.VarChar(500)
  order       Int     @default(0)

  profile ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  @@index([profileId])
}

// ============================================================
// Join Tables (unchanged)
// ============================================================

model ProfessionalSpecialization {
  id               String @id @default(cuid())
  profileId        String
  specializationId String

  profile        ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  specialization Specialization      @relation(fields: [specializationId], references: [id], onDelete: Cascade)

  @@unique([profileId, specializationId])
  @@index([profileId])
  @@index([specializationId])
}

model ProfessionalPracticeArea {
  id             String @id @default(cuid())
  profileId      String
  practiceAreaId String

  profile      ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  practiceArea PracticeArea        @relation(fields: [practiceAreaId], references: [id], onDelete: Cascade)

  @@unique([profileId, practiceAreaId])
  @@index([profileId])
  @@index([practiceAreaId])
}

model ProfessionalLanguage {
  id         String @id @default(cuid())
  profileId  String
  languageId String

  profile  ProfessionalProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  language Language            @relation(fields: [languageId], references: [id], onDelete: Cascade)

  @@unique([profileId, languageId])
  @@index([profileId])
  @@index([languageId])
}
```

---

## 4. Enum Changes

### 4.1 New Enums

| Enum | Values | Version | Purpose |
|---|---|---|---|
| `VerificationStatus` | `UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED` | [Next] | Tracks admin verification process |
| `VerifiedDocumentType` | `BAR_CARD`, `ID_CARD`, `DIPLOMA`, `CERTIFICATE`, `OTHER` | [Future] | Categorizes uploaded verification documents |

### 4.2 Modified Enums

| Enum | Change | Version | Rationale |
|---|---|---|---|
| `ProfessionalProfileStatus` | Add `UNPUBLISHED` | [MVP] | A profile that was published and then manually unpublished by the professional. Distinct from `DRAFT` which was never published. |

**Why add `UNPUBLISHED`?** (P8)

`DRAFT` means "never been published." `UNPUBLISHED` means "was live, now taken offline." This distinction matters for:
- Analytics (tracking how many profiles have been published at least once)
- UX (showing "Your profile is offline" vs "Your profile has never been published")
- Data integrity (preserving `publishedAt` timestamp even after unpublishing)

### 4.3 Unchanged Enums

`Role`, `AuthProvider`, `UserStatus`, `IdentityProvider`, `ConsultationModality` — no changes.

---

## 5. Model Changes

### 5.1 New Models Summary

| Model | Version | Relation to Profile | Purpose |
|---|---|---|---|
| `ProfessionalContact` | [MVP] | 1:1 | Contact information (phone, whatsapp, email, website, LinkedIn) |
| `Office` | [MVP] | 1:1 | Office location (name, address, city, maps URL, coordinates) |
| `Education` | [Next] | 1:N | Education history (degree, institution, years) |
| `ProfessionalExperience` | [Next] | 1:N | Work experience (position, organization, years) |
| `Certification` | [Next] | 1:N | Professional certifications (title, issuer, year) |
| `ProfessionalMembership` | [Next] | 1:N | Professional memberships (organization, role, years) |
| `Verification` | [Next] | 1:1 | Admin verification tracking (status, verifiedAt, verifiedBy) |
| `VerifiedDocument` | [Future] | 1:N via Verification | Uploaded verification documents |
| `Availability` | [Future] | 1:1 | Weekly schedule and exception dates |
| `Award` | [Future] | 1:N | Professional awards and recognitions |

### 5.2 Why 1:1 Entities Instead of Flat Fields (P1, P8)

The current schema stores `professionalPhone` and `officeAddress` as flat fields on `ProfessionalProfile`. We're moving these to separate entities (`ProfessionalContact`, `Office`) because:

1. **Ownership clarity** — Contact info is owned by the Contact entity, not the profile root. This makes the code self-documenting.
2. **Independent evolution** — Adding a `whatsapp` field to Contact doesn't require touching the Profile model.
3. **Clean API** — `PATCH /professional/contact` is clearer than `PATCH /professional/profile` with a subset of fields.
4. **Future 1:N** — Office may become 1:N (multiple offices) in the future. Starting with a separate entity makes this transition trivial.

---

## 6. New Models

### 6.1 ProfessionalContact [MVP]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | MVP |
| `profileId` | String | FK → ProfessionalProfile, unique | MVP |
| `phone` | String? | max 30, nullable | MVP |
| `whatsapp` | String? | max 30, nullable | Next |
| `publicEmail` | String? | max 255, email format, nullable | Next |
| `website` | String? | max 500, URL format, nullable | Next |
| `linkedInUrl` | String? | max 500, URL format, nullable | Next |

**Migration:** `phone` value is copied from `ProfessionalProfile.professionalPhone` during Phase B.

### 6.2 Office [MVP]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | MVP |
| `profileId` | String | FK → ProfessionalProfile, unique | MVP |
| `name` | String? | max 200, nullable | MVP |
| `address` | String? | max 255, nullable | MVP |
| `cityId` | String? | FK → City, nullable | MVP |
| `googleMapsUrl` | String? | max 1000, URL format, nullable | Next |
| `latitude` | Float? | nullable | Next |
| `longitude` | Float? | nullable | Next |

**Migration:** `address` and `cityId` values are copied from `ProfessionalProfile.officeAddress` and `ProfessionalProfile.cityId` during Phase B.

**Why store coordinates?** (P6, P8)

Google Maps embed requires latitude/longitude for precise pin placement. Storing them in the database allows:
- Server-side geocoding (Next phase) to resolve address → coordinates
- Client-side map embed to render without a second geocoding call
- Future directory map view (EP-04 US-040) to filter by location

### 6.3 Education [Next]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Next |
| `profileId` | String | FK → ProfessionalProfile | Next |
| `degree` | String | max 200, required | Next |
| `institution` | String | max 200, required | Next |
| `startYear` | Int | required | Next |
| `endYear` | Int? | nullable (null = ongoing) | Next |
| `description` | String? | max 500, nullable | Next |
| `order` | Int | default 0, for display ordering | Next |

**Why `order` field?** (P8)

Education entries are displayed as a timeline. The `order` field allows the professional to reorder entries without changing dates. This decouples display order from chronological order.

### 6.4 ProfessionalExperience [Next]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Next |
| `profileId` | String | FK → ProfessionalProfile | Next |
| `position` | String | max 200, required | Next |
| `organization` | String | max 200, required | Next |
| `startYear` | Int | required | Next |
| `endYear` | Int? | nullable (null = current) | Next |
| `current` | Boolean | default false | Next |
| `description` | String? | max 500, nullable | Next |
| `order` | Int | default 0 | Next |

**Why `current` boolean when `endYear = null` implies current?** (P8)

Redundancy for query convenience. `WHERE current = true` is clearer than `WHERE endYear IS NULL`. Also, `endYear` could be null for other reasons (unknown end date) — `current` is explicit.

### 6.5 Certification [Next]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Next |
| `profileId` | String | FK → ProfessionalProfile | Next |
| `title` | String | max 200, required | Next |
| `issuer` | String | max 200, required | Next |
| `issueYear` | Int | required | Next |
| `expiryYear` | Int? | nullable | Next |
| `credentialId` | String? | max 100, nullable | Next |
| `verified` | Boolean | default false | Future |
| `order` | Int | default 0 | Next |

### 6.6 ProfessionalMembership [Next]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Next |
| `profileId` | String | FK → ProfessionalProfile | Next |
| `organization` | String | max 200, required | Next |
| `role` | String? | max 200, nullable | Next |
| `startYear` | Int | required | Next |
| `endYear` | Int? | nullable | Next |
| `order` | Int | default 0 | Next |

### 6.7 Verification [Next]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Next |
| `profileId` | String | FK → ProfessionalProfile, unique | Next |
| `status` | VerificationStatus | default UNVERIFIED | Next |
| `verifiedAt` | DateTime? | nullable | Next |
| `verifiedBy` | String? | FK → User (admin), nullable | Next |
| `rejectionReason` | String? | max 500, nullable | Next |

**Why a separate Verification entity instead of fields on Profile?** (P1, P6)

Verification is a process with its own lifecycle (UNVERIFIED → PENDING → VERIFIED/REJECTED). It has child entities (VerifiedDocument). Keeping it separate:
- Keeps the aggregate root clean
- Allows verification to evolve independently (add document types, verification methods)
- Makes it easy to query verification status without loading the entire profile

### 6.8 VerifiedDocument [Future]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Future |
| `verificationId` | String | FK → Verification | Future |
| `type` | VerifiedDocumentType | enum | Future |
| `fileUrl` | String | max 2000 | Future |
| `verified` | Boolean | default false | Future |
| `uploadedAt` | DateTime | default now() | Future |

### 6.9 Availability [Future]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Future |
| `profileId` | String | FK → ProfessionalProfile, unique | Future |
| `weeklySchedule` | Json | structured time slots per day | Future |
| `exceptionDates` | Json | array of {date, reason} | Future |
| `bufferMinutes` | Int | default 15 | Future |

**Why JSON for schedule?** (P6, P8)

A weekly schedule has complex structure (multiple slots per day, varying durations). Modeling this as relational tables would require 7+ child tables. JSON is pragmatic for this use case — it's read as a whole, never queried by individual slot. If the future requires slot-level queries, the JSON can be migrated to relational tables.

### 6.10 Award [Future]

| Field | Type | Constraints | Version |
|---|---|---|---|
| `id` | String | cuid, PK | Future |
| `profileId` | String | FK → ProfessionalProfile | Future |
| `title` | String | max 200 | Future |
| `issuer` | String | max 200 | Future |
| `year` | Int | | Future |
| `description` | String? | max 500 | Future |
| `order` | Int | default 0 | Future |

---

## 7. Modified Models

### 7.1 ProfessionalProfile

**New fields:**

| Field | Type | Version | Purpose |
|---|---|---|---|
| `professionalTitle` | String? | [MVP] | Lawyer's title (e.g., "Avocate en droit des affaires") |
| `publishedAt` | DateTime? | [MVP] | When the profile was first published |
| `unpublishedAt` | DateTime? | [Next] | When the profile was manually unpublished |
| `contactId` | String? @unique | [MVP] | FK to ProfessionalContact |
| `officeId` | String? @unique | [MVP] | FK to Office |
| `verificationId` | String? @unique | [Next] | FK to Verification |
| `availabilityId` | String? @unique | [Future] | FK to Availability |

**New relations:**

| Relation | Type | Model | Version |
|---|---|---|---|
| `contact` | 1:1 | ProfessionalContact | [MVP] |
| `office` | 1:1 | Office | [MVP] |
| `verification` | 1:1 | Verification | [Next] |
| `availability` | 1:1 | Availability | [Future] |
| `offers` | 1:N | ConsultationOffer | [MVP] (renamed from `offer`) |
| `education` | 1:N | Education | [Next] |
| `experience` | 1:N | ProfessionalExperience | [Next] |
| `certifications` | 1:N | Certification | [Next] |
| `memberships` | 1:N | ProfessionalMembership | [Next] |
| `awards` | 1:N | Award | [Future] |

**Legacy fields kept during migration (removed in Phase C):**

| Field | Reason for keeping |
|---|---|
| `professionalPhone` | Copied to ProfessionalContact in Phase B; kept for rollback safety |
| `officeAddress` | Copied to Office in Phase B; kept for rollback safety |
| `cityId` | Copied to Office in Phase B; kept on Profile for backward compatibility during transition |
| `barAssociationId` | Stays on Profile (belongs to Identity, not Office) |

**Why use FK columns (`contactId`, `officeId`) instead of inline relations?** (P8)

Using explicit FK columns on ProfessionalProfile (instead of the child entities holding `profileId` as the relation) allows:
- Prisma to load the profile with optional inclusion of children
- The profile to exist without a contact or office (they're created on first edit)
- Clear ownership: the profile "has" a contact, not the other way around

> **Note:** Both directions are modeled — ProfessionalProfile has `contactId` FK, and ProfessionalContact has `profileId` unique FK. This is redundant but allows flexible querying from either direction.

### 7.2 ConsultationOffer (1:1 → 1:N)

**Changes:**

| Change | Details | Version |
|---|---|---|
| Remove `@@unique([profileId])` | Allows multiple offers per profile | [MVP] |
| Add `title` | String, max 200, required | [MVP] |
| Add `description` | String?, max 500, nullable | [Next] |
| Add `active` | Boolean, default true | [MVP] |
| Add `order` | Int, default 0 | [MVP] |
| Rename relation on Profile | `offer` → `offers` (array) | [MVP] |

**Migration of existing data:**

```sql
UPDATE "ConsultationOffer"
SET "title" = 'Consultation juridique', "active" = true, "order" = 0
WHERE "title" IS NULL;
```

**Why 1:N?** (P1, P6, P8)

The validated UX shows multiple consultation offers on the Offers page (e.g., "Consultation juridique" 300 DH / 30 min, "Suivi de dossier" 150 DH / 15 min). The 1:1 constraint prevents this. The 1:N model allows:
- Multiple offers with different prices, durations, and modalities
- Active/inactive state per offer (lawyer can pause an offer without deleting it)
- Ordering for display

### 7.3 City

| Change | Details | Version |
|---|---|---|
| Add relation `offices` | `Office[]` — one-to-many from City to Office | [MVP] |

**Why?** (P1)

Office references City for location. The relation allows querying offices by city (future directory map view).

---

## 8. Completion Computation

### 8.1 Completion Interface

```typescript
interface ProfileCompletion {
  // [MVP]
  identity: boolean;       // firstName + lastName required, professionalTitle optional
  biography: boolean;      // bio is not null and not empty
  contact: boolean;        // phone is not null
  office: boolean;         // name OR address OR cityId is not null
  expertise: boolean;      // at least 1 specialization + 1 practice area + 1 language
  offer: boolean;          // at least 1 active offer with price > 0 and modalities.length > 0

  // [Next]
  education: boolean;      // at least 1 education entry
  experience: boolean;     // at least 1 experience entry
  certifications: boolean; // at least 1 certification
  memberships: boolean;    // at least 1 membership

  // [Future]
  verification: boolean;   // verification.status = VERIFIED
  availability: boolean;   // availability record exists
}
```

### 8.2 Computation Logic

Completion is computed **on read** (not stored in database). The service layer calculates booleans when returning the profile:

```typescript
function computeCompletion(profile: ProfessionalProfileWithRelations): ProfileCompletion {
  return {
    identity: !!(profile.user.firstName && profile.user.lastName),
    biography: !!profile.bio?.trim(),
    contact: !!profile.contact?.phone?.trim(),
    office: !!(profile.office?.name?.trim() || profile.office?.address?.trim() || profile.office?.cityId),
    expertise: profile.specializations.length > 0
      && profile.practiceAreas.length > 0
      && profile.languages.length > 0,
    offer: profile.offers.some(o => o.active && o.price > 0 && o.modalities.length > 0),
    education: profile.education.length > 0,
    experience: profile.experience.length > 0,
    certifications: profile.certifications.length > 0,
    memberships: profile.memberships.length > 0,
    verification: profile.verification?.status === 'VERIFIED',
    availability: !!profile.availability,
  };
}
```

### 8.3 Completion Percentage

```typescript
function computeCompletionPercentage(completion: ProfileCompletion): number {
  const mvpFields = ['identity', 'biography', 'contact', 'office', 'expertise', 'offer'];
  const nextFields = ['education', 'experience', 'certifications', 'memberships'];

  const allFields = [...mvpFields, ...nextFields];
  const completed = allFields.filter(f => completion[f as keyof ProfileCompletion]).length;

  return Math.round((completed / allFields.length) * 100);
}
```

**Why compute on read instead of storing?** (P5, P8)

Storing completion would require updating it on every write operation — this creates complexity and risk of staleness. Computing on read is simple, always accurate, and performant (a few boolean checks on already-loaded data).

---

## 9. Publication Pre-conditions

### 9.1 MVP (Blocking)

A profile can be published (`status → PENDING_VERIFICATION`) only when:

| Condition | Check |
|---|---|
| Identity is complete | `completion.identity === true` |
| Expertise is complete | `completion.expertise === true` |
| At least one active offer | `completion.offer === true` |

### 9.2 Next (Recommended — Warning, Not Blocking)

| Condition | Check |
|---|---|
| Biography is filled | `completion.biography === true` |
| Contact phone is set | `completion.contact === true` |
| Office is configured | `completion.office === true` |
| Photo is uploaded | `profile.photoUrl !== null` |

### 9.3 Future (Aspirational — Shown as Completion %)

| Condition | Check |
|---|---|
| Education entries exist | `completion.education === true` |
| Experience entries exist | `completion.experience === true` |
| Certifications exist | `completion.certifications === true` |
| Verification passed | `completion.verification === true` |

### 9.4 Publication State Machine

```
                    ┌──────────────┐
                    │    DRAFT     │
                    │  (default)   │
                    └──────┬───────┘
                           │ publish() [MVP]
                           │ (pre-conditions met)
                           ▼
                    ┌──────────────────────┐
                    │ PENDING_VERIFICATION │
                    └──────┬───────────────┘
                           │
              ┌────────────┼────────────┐
              │ admin      │ admin      │ unpublish()
              │ approve    │ reject     │ [MVP]
              ▼            ▼            ▼
        ┌──────────┐  ┌──────────┐  ┌─────────────┐
        │ PUBLISHED│  │  DRAFT   │  │ UNPUBLISHED │
        │          │  │ (back to │  │             │
        └────┬─────┘  │  draft)  │  └──────┬──────┘
             │        └──────────┘         │
             │ unpublish() [MVP]           │ publish() [MVP]
             ▼                             ▼
        ┌─────────────┐              ┌──────────────────────┐
        │ UNPUBLISHED │              │ PENDING_VERIFICATION │
        └─────────────┘              └──────────────────────┘
```

**Why allow UNPUBLISHED → PENDING_VERIFICATION?** (P7, P8)

A lawyer who unpublishes their profile may want to republish later. They should not have to start from DRAFT. The republish flow re-submits for verification (admin may want to re-check).

---

## 10. Migration Plan

### 10.1 Phase A — Schema Migration (Additive Only)

**Principle:** Add new tables, columns, enums. Do NOT remove or modify existing structures. (P4)

**Actions:**

1. Add `UNPUBLISHED` to `ProfessionalProfileStatus` enum
2. Add new enums: `VerificationStatus`, `VerifiedDocumentType`
3. Create tables: `ProfessionalContact`, `Office`, `Education`, `ProfessionalExperience`, `Certification`, `ProfessionalMembership`, `Verification`, `VerifiedDocument`, `Availability`, `Award`
4. Add columns to `ProfessionalProfile`: `professionalTitle`, `publishedAt`, `unpublishedAt`, `contactId`, `officeId`, `verificationId`, `availabilityId`
5. Add columns to `ConsultationOffer`: `title`, `description`, `active`, `order`
6. Remove `@@unique([profileId])` from `ConsultationOffer`
7. Add `offices` relation to `City`

**Rollback:** Drop new tables, remove new columns, remove new enum values. Existing data is untouched.

### 10.2 Phase B — Data Migration

**Principle:** Copy data from old fields to new entities. Do NOT remove old fields. (P4)

**Actions:**

1. For each `ProfessionalProfile` with `professionalPhone IS NOT NULL`:
   - Create a `ProfessionalContact` record with `phone = profile.professionalPhone`
   - Set `profile.contactId` to the new record's ID

2. For each `ProfessionalProfile` with `officeAddress IS NOT NULL OR cityId IS NOT NULL`:
   - Create an `Office` record with `address = profile.officeAddress`, `cityId = profile.cityId`
   - Set `profile.officeId` to the new record's ID

3. For each `ConsultationOffer`:
   - Set `title = 'Consultation juridique'` (if null)
   - Set `active = true`
   - Set `order = 0`

**Migration SQL:**

```sql
-- Step 1: Create ProfessionalContact records
INSERT INTO "ProfessionalContact" ("id", "profileId", "phone")
SELECT gen_random_uuid(), "id", "professionalPhone"
FROM "ProfessionalProfile"
WHERE "professionalPhone" IS NOT NULL;

-- Link contacts to profiles
UPDATE "ProfessionalProfile" pp
SET "contactId" = pc.id
FROM "ProfessionalContact" pc
WHERE pc."profileId" = pp.id;

-- Step 2: Create Office records
INSERT INTO "Office" ("id", "profileId", "address", "cityId")
SELECT gen_random_uuid(), "id", "officeAddress", "cityId"
FROM "ProfessionalProfile"
WHERE "officeAddress" IS NOT NULL OR "cityId" IS NOT NULL;

-- Link offices to profiles
UPDATE "ProfessionalProfile" pp
SET "officeId" = o.id
FROM "Office" o
WHERE o."profileId" = pp.id;

-- Step 3: Migrate ConsultationOffer
UPDATE "ConsultationOffer"
SET "title" = 'Consultation juridique', "active" = true, "order" = 0
WHERE "title" IS NULL;
```

**Rollback:** Null out `contactId` and `officeId` on ProfessionalProfile. Delete ProfessionalContact and Office records. Old fields (`professionalPhone`, `officeAddress`, `cityId`) still contain original data.

### 10.3 Phase C — Cleanup (After API Update Verified)

**Principle:** Remove deprecated fields and endpoints only after all code is verified. (P4, P7)

**Actions:**

1. Remove `professionalPhone` column from `ProfessionalProfile`
2. Remove `officeAddress` column from `ProfessionalProfile`
3. Remove `cityId` column from `ProfessionalProfile` (now on Office)
4. Remove old `/professional/offer` PUT endpoint (replaced by 1:N CRUD)
5. Remove `offer` singular relation name (now `offers`)

**Rollback:** Not reversible. This is why Phase C runs only after full verification.

**Why not skip Phase C?** (P8)

Keeping deprecated fields creates confusion for new developers ("which phone field do I use?") and risks bugs (updating the wrong field). Phase C is the cleanup that makes the codebase clean.

---

## 11. Rollback Strategy

### 11.1 Phase A Rollback

```sql
-- Drop new tables
DROP TABLE IF EXISTS "Award";
DROP TABLE IF EXISTS "Availability";
DROP TABLE IF EXISTS "VerifiedDocument";
DROP TABLE IF EXISTS "Verification";
DROP TABLE IF EXISTS "ProfessionalMembership";
DROP TABLE IF EXISTS "Certification";
DROP TABLE IF EXISTS "ProfessionalExperience";
DROP TABLE IF EXISTS "Education";
DROP TABLE IF EXISTS "Office";
DROP TABLE IF EXISTS "ProfessionalContact";

-- Remove new columns from ProfessionalProfile
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "professionalTitle";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "publishedAt";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "unpublishedAt";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "contactId";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "officeId";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "verificationId";
ALTER TABLE "ProfessionalProfile" DROP COLUMN IF EXISTS "availabilityId";

-- Remove new columns from ConsultationOffer
ALTER TABLE "ConsultationOffer" DROP COLUMN IF EXISTS "title";
ALTER TABLE "ConsultationOffer" DROP COLUMN IF EXISTS "description";
ALTER TABLE "ConsultationOffer" DROP COLUMN IF EXISTS "active";
ALTER TABLE "ConsultationOffer" DROP COLUMN IF EXISTS "order";

-- Restore unique constraint on ConsultationOffer
-- (only if no duplicate profileId values exist)
```

### 11.2 Phase B Rollback

```sql
-- Unlink contacts and offices
UPDATE "ProfessionalProfile" SET "contactId" = NULL;
UPDATE "ProfessionalProfile" SET "officeId" = NULL;

-- Delete migrated records
DELETE FROM "ProfessionalContact";
DELETE FROM "Office";

-- Reset ConsultationOffer migration
UPDATE "ConsultationOffer" SET "title" = NULL, "active" = NULL, "order" = NULL;
```

### 11.3 Phase C Rollback

**Not reversible.** Phase C is a point of no return. This is why:
- Full backup is taken before Phase C
- Phase C runs only after all API endpoints are updated and tested
- Phase C runs only after frontend is updated and verified

### 11.4 Backup Strategy

| When | Action |
|---|---|
| Before Phase A | Full `pg_dump` of the database |
| Before Phase B | Full `pg_dump` of the database |
| Before Phase C | Full `pg_dump` of the database + verify all tests pass |
| Ongoing | Point-in-time recovery (WAL archiving) enabled on PostgreSQL |

---

## 12. Versioning Roadmap

### 12.1 Sprint 1 — MVP Schema

| Item | Type |
|---|---|
| Phase A migration (additive) | Database |
| Phase B migration (data copy) | Database |
| `ProfessionalProfileStatus`: add `UNPUBLISHED` | Database |
| `ProfessionalContact` entity (phone only) | Database |
| `Office` entity (name, address, cityId) | Database |
| `ConsultationOffer`: 1:N evolution (title, active, order) | Database |
| `ProfessionalProfile`: add `professionalTitle`, `publishedAt` | Database |
| Completion computation (6 MVP fields) | Application |
| Publication pre-conditions (3 blocking) | Application |

### 12.2 Sprint 2 — Next Schema

| Item | Type |
|---|---|
| `ProfessionalContact`: add whatsapp, publicEmail, website, linkedInUrl | Database |
| `Office`: add googleMapsUrl, latitude, longitude | Database |
| `Education` entity + CRUD | Database |
| `ProfessionalExperience` entity + CRUD | Database |
| `Certification` entity + CRUD | Database |
| `ProfessionalMembership` entity + CRUD | Database |
| `Verification` entity (status tracking) | Database |
| `ConsultationOffer`: add description | Database |
| `ProfessionalProfile`: add `unpublishedAt` | Database |
| Completion computation (10 fields) | Application |
| Phase C cleanup (remove deprecated fields) | Database |

### 12.3 Sprint 3+ — Future Schema

| Item | Type |
|---|---|
| `Availability` entity | Database |
| `VerifiedDocument` entity | Database |
| `Award` entity | Database |
| `Certification.verified` field activation | Database |
| Completion computation (12 fields) | Application |

---

## References

| Document | Path |
|---|---|
| Technical Design Blueprint | `docs/04-technique/00-technical-design-blueprint.md` |
| Architecture Document | `docs/04-technique/01-architecture.md` |
| UX Domain Model | `docs/ux/01-domain-model.md` |
| Current Prisma Schema | `apps/api/prisma/schema.prisma` |
