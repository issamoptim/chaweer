# 04 — Implementation Plan

> **Phase:** 4 — Implementation Planning
> **Status:** Draft — awaiting validation
> **Date:** 2026-07-21
> **Prerequisites:**
> - Technical Design Package approved (Phases 3.1–3.4)
>
> **Objective:** Minimize risk, keep pull requests small, ensure each feature can be developed, reviewed, and tested independently. No implementation code in this document.

---

## Table of Contents

1. [Implementation Overview](#1-implementation-overview)
2. [Feature Breakdown](#2-feature-breakdown)
3. [Feature F-01 — Shared Package Foundation](#feature-f-01--shared-package-foundation)
4. [Feature F-02 — Database Schema Migration](#feature-f-02--database-schema-migration)
5. [Feature F-03 — Evolved Profile API](#feature-f-03--evolved-profile-api)
6. [Feature F-04 — Contact & Office APIs](#feature-f-04--contact--office-apis)
7. [Feature F-05 — Consultation Offers 1:N API](#feature-f-05--consultation-offers-1n-api)
8. [Feature F-06 — Publication API](#feature-f-06--publication-api)
9. [Feature F-07 — Public Profile API](#feature-f-07--public-profile-api)
10. [Feature F-08 — Frontend Layout & Routing](#feature-f-08--frontend-layout--routing)
11. [Feature F-09 — Dashboard Page](#feature-f-09--dashboard-page)
12. [Feature F-10 — Profile Page](#feature-f-10--profile-page)
13. [Feature F-11 — Expertise Page](#feature-f-11--expertise-page)
14. [Feature F-12 — Offers Page](#feature-f-12--offers-page)
15. [Feature F-13 — Public Preview Page](#feature-f-13--public-preview-page)
16. [Feature F-14 — Next-Phase CRUD APIs](#feature-f-14--next-phase-crud-apis)
17. [Feature F-15 — Next-Phase Frontend Components](#feature-f-15--next-phase-frontend-components)
18. [Feature F-16 — Schema Cleanup (Phase C)](#feature-f-16--schema-cleanup-phase-c)
19. [Dependency Graph](#3-dependency-graph)
20. [Sprint Planning](#4-sprint-planning)

---

## 1. Implementation Overview

### 1.1 Feature Inventory

| ID | Feature | Sprint | Type | PRs |
|---|---|---|---|---|
| F-01 | Shared Package Foundation | 1 | Infrastructure | 1 |
| F-02 | Database Schema Migration | 1 | Database | 1 |
| F-03 | Evolved Profile API | 1 | Backend | 1 |
| F-04 | Contact & Office APIs | 1 | Backend | 1 |
| F-05 | Consultation Offers 1:N API | 1 | Backend | 1 |
| F-06 | Publication API | 1 | Backend | 1 |
| F-07 | Public Profile API | 1 | Backend | 1 |
| F-08 | Frontend Layout & Routing | 1 | Frontend | 1 |
| F-09 | Dashboard Page | 1 | Frontend | 1 |
| F-10 | Profile Page | 1 | Frontend | 2 |
| F-11 | Expertise Page | 1 | Frontend | 1 |
| F-12 | Offers Page | 1 | Frontend | 1 |
| F-13 | Public Preview Page | 1 | Frontend | 1 |
| F-14 | Next-Phase CRUD APIs | 2 | Backend | 2 |
| F-15 | Next-Phase Frontend Components | 2 | Frontend | 2 |
| F-16 | Schema Cleanup (Phase C) | 2 | Database | 1 |

**Total: 16 features, ~18 PRs across 2 sprints**

### 1.2 Principles

- **Each feature is independently reviewable** — a PR contains one feature
- **Backend features precede their frontend consumers** — the API must exist before the UI calls it
- **Database migration is the first step** — everything depends on the schema
- **Shared package is the first code** — both API and web import from it
- **No feature flags for MVP** — features are small enough to be complete in one PR
- **Each PR includes tests** — no PR is merged without tests

---

## 2. Feature Breakdown

### Sprint 1 — MVP Foundation (F-01 through F-13)

```
F-01 (shared package)
  │
  ▼
F-02 (schema migration)
  │
  ├──► F-03 (evolved profile API) ──────────────┐
  ├──► F-04 (contact & office APIs) ────────────┤
  ├──► F-05 (offers 1:N API) ───────────────────┤
  ├──► F-06 (publication API) ──────────────────┤
  └──► F-07 (public profile API) ───────────────┤
                                                 │
  F-08 (frontend layout) ───────────────────────┤
                                                 │
  F-09 (dashboard) ◄── F-03                      │
  F-10 (profile page) ◄── F-03, F-04             │
  F-11 (expertise page) ◄── F-03                 │
  F-12 (offers page) ◄── F-05                    │
  F-13 (public preview) ◄── F-07                 │
                                                 │
  All frontend features depend on F-08 ──────────┘
```

### Sprint 2 — Next Iteration (F-14 through F-16)

```
F-14 (next-phase CRUD APIs)
  │
  ▼
F-15 (next-phase frontend components)
  │
  ▼
F-16 (schema cleanup — Phase C)
```

---

## Feature F-01 — Shared Package Foundation

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-01 |
| **Feature name** | Shared Package Foundation |
| **Goal** | Create `packages/shared` with enums, constants, and Zod schemas shared between API and web |
| **User Stories** | None (infrastructure) |
| **Dependencies** | None |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | None |
| Frontend pages | None |
| React components | None |
| Shared schemas | All Zod schemas and TypeScript types from the API Contract |
| Tests to add | Schema validation unit tests |

### Files

> **Note:** Sprint 0 already created the minimal package structure (`packages/shared/package.json`, `packages/shared/src/index.ts`) and wired workspace resolution in root `package.json`, `apps/api/package.json`, and `apps/web/package.json`. F-01 focuses on populating the shared package with business schemas, enums, constants, and types.

**Files to create:**

| File | Purpose | Sprint 0? |
|---|---|---|
| `packages/shared/package.json` | Package definition | ✅ Created (needs enhancement) |
| `packages/shared/tsconfig.json` | TypeScript config | ❌ New |
| `packages/shared/src/index.ts` | Barrel export | ✅ Created (needs to become real barrel) |
| `packages/shared/src/enums/professional-status.enum.ts` | `ProfessionalProfileStatus` enum | ❌ New |
| `packages/shared/src/enums/verification-status.enum.ts` | `VerificationStatus` enum | ❌ New |
| `packages/shared/src/enums/consultation-modality.enum.ts` | `ConsultationModality` enum | ❌ New |
| `packages/shared/src/enums/verified-document-type.enum.ts` | `VerifiedDocumentType` enum | ❌ New |
| `packages/shared/src/constants/completion-rules.ts` | Completion section definitions | ❌ New |
| `packages/shared/src/constants/publication-rules.ts` | Publish pre-conditions | ❌ New |
| `packages/shared/src/constants/consultation-durations.ts` | `[15, 30, 45, 60]` | ❌ New |
| `packages/shared/src/schemas/professional.schema.ts` | Zod schemas for professional endpoints | ❌ New |
| `packages/shared/src/schemas/public.schema.ts` | Zod schemas for public endpoints | ❌ New |
| `packages/shared/src/contracts/professional.contract.ts` | TypeScript response/request types | ❌ New |
| `packages/shared/src/contracts/public.contract.ts` | Public profile response types | ❌ New |
| `packages/shared/src/types/pagination.type.ts` | `PaginatedResponse<T>` type | ❌ New |
| `packages/shared/src/types/error.type.ts` | `ErrorResponse` type | ❌ New |
| `packages/shared/src/tests/schema.test.ts` | Schema validation tests | ❌ New |

**Files to modify:**

| File | Change | Sprint 0? |
|---|---|---|
| `packages/shared/package.json` | Add `tsconfig.json` reference, enhance exports map | ✅ Already exists |
| `packages/shared/src/index.ts` | Replace placeholder with real barrel export | ✅ Already exists |
| `apps/api/package.json` | `@chaweer/shared` dependency already added | ✅ Already done |
| `apps/web/package.json` | `@chaweer/shared` dependency already added | ✅ Already done |
| Root `package.json` | Workspace config already added | ✅ Already done |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/api/src/modules/auth/*` | Auth schemas stay in auth module (not shared yet) |
| `apps/api/src/modules/profile/*` | Profile module unchanged |

### Implementation Order

| Task | Description | Reviewable? | Sprint 0? |
|---|---|---|---|
| 1 | Create `packages/shared` package structure with `package.json` and `tsconfig.json` | Yes — empty package | ✅ Done (package.json + index.ts created, tsconfig.json still needed) |
| 2 | Add enums (4 files) | Yes — pure constants | ❌ Remaining |
| 3 | Add constants (completion rules, publication rules, consultation durations) | Yes — pure constants | ❌ Remaining |
| 4 | Add Zod schemas (professional + public) | Yes — validation only | ❌ Remaining |
| 5 | Add TypeScript contracts (response/request types) | Yes — types only | ❌ Remaining |
| 6 | Add tests for schema validation | Yes — tests pass | ❌ Remaining |
| 7 | Wire up `@chaweer/shared` in API and web `package.json` | Yes — imports resolve | ✅ Done |

### Acceptance Criteria

**Functional:**
- `packages/shared` exports all enums, constants, schemas, and types
- API and web can import from `@chaweer/shared` without errors

**Technical:**
- All Zod schemas match the API Contract Specification
- TypeScript compiles with strict mode
- No circular dependencies

**UX:** N/A (infrastructure)

**Regression checks:**
- Existing API tests still pass
- Existing web build still works

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | Every Zod schema: valid input passes, invalid input fails with correct error |
| Integration tests | N/A (no API or DB) |
| Manual validation | `import { ... } from '@chaweer/shared'` works in both apps |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | ~15 new files, 2 modified (package.json + index.ts enhancement) |
| Estimated lines | ~400–600 |
| PR size | Small–Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Workspace resolution fails | Low | Test import in both apps before merging |
| Schema mismatch with API Contract | Medium | Cross-reference every schema with the contract document |
| Circular dependency | Low | `packages/shared` imports nothing from `apps/*` |

**Rollback:** Remove `@chaweer/shared` dependency from API and web. Delete `packages/shared`. No data affected.

---

## Feature F-02 — Database Schema Migration

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-02 |
| **Feature name** | Database Schema Migration (Phase A + B) |
| **Goal** | Evolve Prisma schema with all new models, enums, and fields. Migrate existing data. |
| **User Stories** | None (infrastructure) |
| **Dependencies** | F-01 (shared enums used in schema comments) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | 10 new tables, 2 modified tables, 2 new enums, 1 modified enum, new columns on ProfessionalProfile and ConsultationOffer |
| Prisma migration | Phase A (additive) + Phase B (data migration) |
| Backend modules | None (schema only, no service changes) |
| API endpoints | None |
| Frontend pages | None |
| React components | None |
| Shared schemas | None |
| Tests to add | Migration verification tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/prisma/migrations/<timestamp>_professional_space/migration.sql` | Prisma migration SQL |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/prisma/schema.prisma` | Add all new models, enums, fields, relations |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/api/src/modules/*` | No service changes in this PR — old API continues to work with old fields |
| `apps/api/src/app.ts` | No route changes |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Update `schema.prisma` with new enums (`VerificationStatus`, `VerifiedDocumentType`, add `UNPUBLISHED` to `ProfessionalProfileStatus`) | Yes — schema diff |
| 2 | Add new models to `schema.prisma` (ProfessionalContact, Office, Education, ProfessionalExperience, Certification, ProfessionalMembership, Verification, VerifiedDocument, Availability, Award) | Yes — schema diff |
| 3 | Add new fields to `ProfessionalProfile` (professionalTitle, publishedAt, unpublishedAt, contactId, officeId, verificationId, availabilityId) | Yes — schema diff |
| 4 | Add new fields to `ConsultationOffer` (title, description, active, order) and remove `@@unique([profileId])` | Yes — schema diff |
| 5 | Add `offices` relation to `City` | Yes — schema diff |
| 6 | Run `prisma migrate dev` to generate migration SQL | Yes — migration file |
| 7 | Write data migration SQL (Phase B) — copy professionalPhone → ProfessionalContact, officeAddress+cityId → Office, set offer defaults | Yes — SQL in migration |
| 8 | Run migration against dev database and verify | Yes — `prisma studio` check |

### Acceptance Criteria

**Functional:**
- All new tables exist in the database
- Existing data is preserved
- `professionalPhone` values are copied to `ProfessionalContact.phone`
- `officeAddress` and `cityId` values are copied to `Office`
- Existing `ConsultationOffer` records have `title = "Consultation juridique"`, `active = true`, `order = 0`

**Technical:**
- `prisma generate` succeeds without errors
- `prisma migrate dev` applies cleanly
- No data loss — old columns still exist (Phase A is additive only)
- Migration is reversible (can rollback to previous migration)

**UX:** N/A (infrastructure)

**Regression checks:**
- Existing API endpoints still work (they use old columns which still exist)
- Existing API tests still pass
- `GET /professional/me` still returns the old response shape

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | N/A |
| Integration tests | Migration test: run migration on a database with seed data, verify data is copied correctly |
| Manual validation | `prisma studio` — check new tables, verify copied data, verify old columns still exist |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 1 modified (schema.prisma), 1 new (migration.sql) |
| Estimated lines | ~400 (schema) + ~100 (migration SQL) |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Data loss during migration | Low | Phase A is additive only; old columns preserved; full backup before migration |
| Migration fails on existing data | Medium | Test on copy of production data first; migration SQL handles NULL values |
| Prisma generate fails after schema change | Low | Run `prisma generate` and `prisma validate` before committing |
| Unique constraint violation when removing `@@unique` | Low | Check for duplicate `profileId` values before removing constraint |

**Rollback:** `prisma migrate rollback` to previous migration. Old columns and data are intact.

**Feature flags:** Not needed — old API continues to work with old columns.

---

## Feature F-03 — Evolved Profile API

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-03 |
| **Feature name** | Evolved Profile API |
| **Goal** | Evolve `GET /professional/me` to return nested response shape. Evolve `PATCH /professional/profile` to update only identity + biography. |
| **User Stories** | US-025 (view profile), US-026 (edit identity), US-027 (edit bio) |
| **Dependencies** | F-01 (shared schemas), F-02 (schema migration) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None (uses schema from F-02) |
| Prisma migration | None |
| Backend modules | `professional` module — evolve service, controller, schema, types |
| API endpoints | `GET /professional/me` (evolved), `PATCH /professional/profile` (evolved) |
| Frontend pages | None |
| React components | None |
| Shared schemas | Import from `@chaweer/shared` |
| Tests to add | Controller tests, service tests, schema validation tests |

### Files

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/modules/professional/professional.service.ts` | Evolve `getMyProfile` to return nested shape with contact, office, offers[], completion. Evolve `updateProfile` to only update identity + biography. |
| `apps/api/src/modules/professional/professional.controller.ts` | Update response formatting |
| `apps/api/src/modules/professional/professional.schema.ts` | Replace with imports from `@chaweer/shared`; update `updateProfileSchema` to only accept identity + biography fields |
| `apps/api/src/modules/professional/professional.types.ts` | Replace with imports from `@chaweer/shared`; update `ProfessionalProfileData` to nested shape |
| `apps/api/src/modules/professional/professional.constants.ts` | Evolve completion computation to 10 fields |

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/professional/__tests__/professional.service.test.ts` | Service unit tests |
| `apps/api/src/modules/professional/__tests__/professional.controller.test.ts` | Controller unit tests |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/api/src/modules/professional/professional.routes.ts` | Routes stay the same (`/me`, `/profile`) |
| `apps/api/src/modules/auth/*` | Auth module unaffected |
| `apps/api/src/modules/profile/*` | Client profile module unaffected |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Update `professional.types.ts` to import from `@chaweer/shared` and define nested response types | Yes — types only |
| 2 | Evolve `professional.constants.ts` — completion computation with 10 fields | Yes — pure function |
| 3 | Evolve `professional.schema.ts` — `updateProfileSchema` accepts only `professionalTitle`, `bio`, `barAssociationId` | Yes — schema validation |
| 4 | Evolve `professional.service.ts` — `getMyProfile` returns nested shape with Prisma includes | Yes — service returns new shape |
| 5 | Evolve `professional.service.ts` — `updateProfile` only updates identity + biography fields | Yes — service updates correctly |
| 6 | Evolve `professional.controller.ts` — format response with nested shape | Yes — controller returns new shape |
| 7 | Write service tests (completion computation, profile retrieval, profile update) | Yes — tests pass |
| 8 | Write controller tests (response format, error cases) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- `GET /professional/me` returns nested response with `identity`, `biography`, `contact`, `office`, `expertise`, `offers[]`, `education[]`, `experience[]`, `certifications[]`, `memberships[]`, `verification`, `completion`
- `PATCH /professional/profile` only updates `professionalTitle`, `bio`, `barAssociationId`
- Completion is computed correctly (10 boolean fields)
- Contact and office are `null` if no record exists

**Technical:**
- Zod schemas imported from `@chaweer/shared`
- No business logic in controller
- Prisma query uses includes for nested entities
- Response matches `ProfessionalProfileResponse` type from API Contract

**UX:** N/A (API only)

**Regression checks:**
- `GET /professional/referential` still works
- `PUT /professional/expertise` still works
- `PUT /professional/offer` still works (deprecated but preserved)
- `POST /professional/upload-photo` still works
- Auth endpoints still work

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | Completion computation (all combinations), profile update (only allowed fields), response shape mapping |
| Integration tests | `GET /professional/me` with seeded data (profile with/without contact, with/without offers), `PATCH /professional/profile` with valid/invalid data |
| Manual validation | `curl` with JWT — verify nested response shape |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 5 modified, 2 new (tests) |
| Estimated lines | ~400–600 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Breaking existing frontend | Medium | Frontend is being rebuilt; old frontend may break but is expected |
| Prisma include performance | Low | Profile has limited relations; query is indexed |
| Completion computation bug | Medium | Unit test all combinations |

**Rollback:** Revert PR. Old service code is restored. Database schema from F-02 is unaffected (additive only).

---

## Feature F-04 — Contact & Office APIs

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-04 |
| **Feature name** | Contact & Office APIs |
| **Goal** | Create CRUD endpoints for ProfessionalContact and Office entities |
| **User Stories** | US-028 (edit contact), US-029 (edit office) |
| **Dependencies** | F-01 (shared schemas), F-02 (schema migration), F-03 (professional module structure) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | New sub-modules: `professional/contact/`, `professional/office/` |
| API endpoints | `GET /professional/contact`, `PATCH /professional/contact`, `GET /professional/office`, `PATCH /professional/office` |
| Frontend pages | None |
| React components | None |
| Shared schemas | `updateContactSchema`, `updateOfficeSchema` from `@chaweer/shared` |
| Tests to add | Sub-module service + controller tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/professional/contact/contact.routes.ts` | Contact routes |
| `apps/api/src/modules/professional/contact/contact.controller.ts` | Contact controller |
| `apps/api/src/modules/professional/contact/contact.service.ts` | Contact service (upsert) |
| `apps/api/src/modules/professional/contact/contact.schema.ts` | Re-export from `@chaweer/shared` |
| `apps/api/src/modules/professional/office/office.routes.ts` | Office routes |
| `apps/api/src/modules/professional/office/office.controller.ts` | Office controller |
| `apps/api/src/modules/professional/office/office.service.ts` | Office service (upsert) |
| `apps/api/src/modules/professional/office/office.schema.ts` | Re-export from `@chaweer/shared` |
| `apps/api/src/modules/professional/contact/__tests__/contact.service.test.ts` | Contact service tests |
| `apps/api/src/modules/professional/office/__tests__/office.service.test.ts` | Office service tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/modules/professional/professional.routes.ts` | Mount contact and office sub-routers |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/api/src/modules/professional/professional.service.ts` | Main service unchanged (F-03 already evolved it) |
| `apps/api/src/modules/auth/*` | Unaffected |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `contact/` sub-module: routes, controller, service, schema | Yes — new files |
| 2 | Implement `GET /professional/contact` — returns contact or null | Yes — endpoint works |
| 3 | Implement `PATCH /professional/contact` — upsert contact record | Yes — endpoint works |
| 4 | Create `office/` sub-module: routes, controller, service, schema | Yes — new files |
| 5 | Implement `GET /professional/office` — returns office or null | Yes — endpoint works |
| 6 | Implement `PATCH /professional/office` — upsert office record | Yes — endpoint works |
| 7 | Mount sub-routers in `professional.routes.ts` | Yes — routes accessible |
| 8 | Write tests for both sub-modules | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- `GET /professional/contact` returns contact data or `null`
- `PATCH /professional/contact` creates or updates contact (upsert)
- `GET /professional/office` returns office data or `null`
- `PATCH /professional/office` creates or updates office (upsert)
- `cityId` in office is validated against City table

**Technical:**
- Both services use upsert pattern (create if not exists, update if exists)
- Ownership enforced: `profileId` derived from JWT
- Zod schemas from `@chaweer/shared`
- No business logic in controllers

**UX:** N/A (API only)

**Regression checks:**
- `GET /professional/me` still works (now includes contact and office via Prisma includes from F-03)
- Existing endpoints unaffected

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | Upsert logic (create new, update existing), cityId validation |
| Integration tests | Full request cycle with JWT — create contact, update contact, create office, update office, invalid cityId |
| Manual validation | `curl` — verify upsert behavior |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 10 new, 1 modified |
| Estimated lines | ~400–500 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Upsert creates duplicate records | Low | `profileId` is `@unique` on both entities |
| cityId references non-existent city | Medium | Validate in service layer, return 404 |

**Rollback:** Revert PR. Remove sub-routers. Database tables remain (additive).

---

## Feature F-05 — Consultation Offers 1:N API

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-05 |
| **Feature name** | Consultation Offers 1:N API |
| **Goal** | Replace 1:1 offer endpoint with full 1:N CRUD: list, create, update, delete, toggle |
| **User Stories** | US-031 (create offer), US-032 (edit offer), US-033 (delete offer), US-034 (toggle offer) |
| **Dependencies** | F-01, F-02, F-03 |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None (schema from F-02 already removed `@@unique`) |
| Prisma migration | None |
| Backend modules | New sub-module: `professional/offers/` |
| API endpoints | `GET /professional/offers`, `POST /professional/offers`, `PUT /professional/offers/:offerId`, `DELETE /professional/offers/:offerId`, `PATCH /professional/offers/:offerId/toggle` |
| Frontend pages | None |
| React components | None |
| Shared schemas | `createOfferSchema`, `updateOfferSchema`, `toggleOfferSchema` from `@chaweer/shared` |
| Tests to add | Offers sub-module tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/professional/offers/offers.routes.ts` | Offers routes |
| `apps/api/src/modules/professional/offers/offers.controller.ts` | Offers controller |
| `apps/api/src/modules/professional/offers/offers.service.ts` | Offers service (CRUD) |
| `apps/api/src/modules/professional/offers/offers.schema.ts` | Re-export from `@chaweer/shared` |
| `apps/api/src/modules/professional/offers/__tests__/offers.service.test.ts` | Service tests |
| `apps/api/src/modules/professional/offers/__tests__/offers.controller.test.ts` | Controller tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/modules/professional/professional.routes.ts` | Mount offers sub-router |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/api/src/modules/professional/professional.schema.ts` | Old `updateOfferSchema` preserved for deprecated `PUT /professional/offer` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `offers/` sub-module structure | Yes — new files |
| 2 | Implement `GET /professional/offers` — list with optional filter and sort | Yes — endpoint works |
| 3 | Implement `POST /professional/offers` — create offer | Yes — endpoint works |
| 4 | Implement `PUT /professional/offers/:offerId` — update offer | Yes — endpoint works |
| 5 | Implement `DELETE /professional/offers/:offerId` — delete offer | Yes — endpoint works |
| 6 | Implement `PATCH /professional/offers/:offerId/toggle` — activate/deactivate | Yes — endpoint works |
| 7 | Mount sub-router in `professional.routes.ts` | Yes — routes accessible |
| 8 | Write tests (CRUD, ownership, toggle, validation) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- List returns all offers for the authenticated profile, sorted by `order`
- Create returns `201` with new offer
- Update returns `200` with updated offer
- Delete returns `204`
- Toggle returns `200` with `{ id, active }`
- Ownership enforced: cannot access another profile's offers

**Technical:**
- `offerId` ownership verified in service layer
- Zod validation for all inputs
- `modalities` validated as enum array
- `durationMinutes` validated against `[15, 30, 45, 60]`

**UX:** N/A (API only)

**Regression checks:**
- Old `PUT /professional/offer` still works (deprecated, updates first offer)
- `GET /professional/me` still works (offers[] in response)

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | CRUD operations, ownership check, toggle logic |
| Integration tests | Full cycle: create → list → update → toggle → delete; cross-profile access returns 403/404 |
| Manual validation | `curl` — verify all 5 endpoints |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 6 new, 1 modified |
| Estimated lines | ~500–600 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Old `PUT /professional/offer` breaks | Low | Old endpoint preserved, updates first offer |
| Offer ownership bypass | Medium | Service verifies `offer.profileId === profile.id` |
| Duplicate offers created | Low | No unique constraint on (profileId, title) — duplicates allowed by design |

**Rollback:** Revert PR. Remove offers sub-router. Old endpoint still works.

---

## Feature F-06 — Publication API

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-06 |
| **Feature name** | Publication API |
| **Goal** | Create publish and unpublish endpoints with pre-condition validation |
| **User Stories** | US-035 (publish profile), US-036 (unpublish profile) |
| **Dependencies** | F-01, F-02, F-03 (completion computation) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | New sub-module: `professional/publication/` |
| API endpoints | `POST /professional/publish`, `POST /professional/unpublish` |
| Frontend pages | None |
| React components | None |
| Shared schemas | None (no request body) |
| Tests to add | Publication service tests (state machine, pre-conditions) |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/professional/publication/publication.routes.ts` | Publication routes |
| `apps/api/src/modules/professional/publication/publication.controller.ts` | Publication controller |
| `apps/api/src/modules/professional/publication/publication.service.ts` | Publication service (state machine, pre-conditions) |
| `apps/api/src/modules/professional/publication/__tests__/publication.service.test.ts` | Service tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/modules/professional/professional.routes.ts` | Mount publication sub-router |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `publication/` sub-module structure | Yes — new files |
| 2 | Implement `publish` service — check pre-conditions, transition state | Yes — logic tested |
| 3 | Implement `unpublish` service — transition state, set `unpublishedAt` | Yes — logic tested |
| 4 | Implement controllers — call service, format response | Yes — endpoints work |
| 5 | Mount sub-router | Yes — routes accessible |
| 6 | Write tests (all state transitions, pre-condition failures, idempotent calls) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- `POST /professional/publish` transitions DRAFT/UNPUBLISHED → PENDING_VERIFICATION
- Publish fails with `CONFLICT` if pre-conditions not met (identity, expertise, offer)
- Conflict response includes `missing[]` array
- `POST /professional/unpublish` transitions PUBLISHED → UNPUBLISHED
- Unpublish sets `unpublishedAt` but preserves `publishedAt`
- Both endpoints are idempotent (calling on same state returns current status)

**Technical:**
- State machine enforced in service layer
- Pre-conditions checked using completion computation from F-03
- Rate limited: 10 requests / 15 minutes

**UX:** N/A (API only)

**Regression checks:**
- `GET /professional/me` reflects new status after publish/unpublish
- Existing endpoints unaffected

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | All state transitions (DRAFT→PENDING, UNPUBLISHED→PENDING, PUBLISHED→UNPUBLISHED), pre-condition failures, idempotent calls |
| Integration tests | Full cycle: publish with incomplete profile (409), complete profile (200), unpublish (200), republish (200) |
| Manual validation | `curl` — verify state transitions and error responses |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 4 new, 1 modified |
| Estimated lines | ~300–400 |
| PR size | Small–Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Invalid state transition | Medium | State machine tests cover all paths |
| Pre-condition check uses stale data | Low | Completion computed from fresh Prisma query |
| `publishedAt` overwritten on republish | Medium | Only set `publishedAt` on first publish (when null) |

**Rollback:** Revert PR. Remove publication sub-router. Profile status remains DRAFT (no state change from rollback).

---

## Feature F-07 — Public Profile API

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-07 |
| **Feature name** | Public Profile API |
| **Goal** | Create read-only public profile endpoint that returns published profiles only |
| **User Stories** | US-042 (view public profile) |
| **Dependencies** | F-01, F-02, F-03 |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | New module: `public/` |
| API endpoints | `GET /professionals/:id`, `GET /professionals/:id/offers` |
| Frontend pages | None |
| React components | None |
| Shared schemas | `PublicProfileResponse` type from `@chaweer/shared` |
| Tests to add | Public module service + controller tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/public/public.routes.ts` | Public routes |
| `apps/api/src/modules/public/public.controller.ts` | Public controller |
| `apps/api/src/modules/public/public.service.ts` | Public service (published-only filter, response shaping) |
| `apps/api/src/modules/public/public.schema.ts` | Path param validation |
| `apps/api/src/modules/public/__tests__/public.service.test.ts` | Service tests |
| `apps/api/src/modules/public/__tests__/public.controller.test.ts` | Controller tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/app.ts` | Mount `/professionals` public routes (no auth middleware) |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `public/` module structure | Yes — new files |
| 2 | Implement `GET /professionals/:id` — query published profile, shape public response | Yes — endpoint works |
| 3 | Implement `GET /professionals/:id/offers` — query active offers for published profile | Yes — endpoint works |
| 4 | Mount routes in `app.ts` (no auth) | Yes — routes accessible without JWT |
| 5 | Write tests (published profile returns 200, unpublished returns 404, active offers only) | Yes — tests pass |
| 6 | Verify no private data leaks (no userId, no contact phone, no verification details) | Yes — security check |

### Acceptance Criteria

**Functional:**
- `GET /professionals/:id` returns public profile for published profiles only
- Unpublished/draft profiles return `404` (not 403 — prevents information leakage)
- Response excludes: `userId`, `contact.phone`, `verification` details, `status`, `completion`
- Response includes: `isVerified` boolean, resolved names (not IDs) for bar association, city, specializations, etc.
- `GET /professionals/:id/offers` returns only active offers

**Technical:**
- No auth middleware on these routes
- Service queries with `status = PUBLISHED` filter
- Response shape matches `PublicProfileResponse` from API Contract
- Rate limited: 60 requests / minute

**UX:** N/A (API only)

**Regression checks:**
- Authenticated endpoints unaffected
- No performance degradation (indexed on `id` and `status`)

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | Response shaping (excluded fields), published-only filter, offer active filter |
| Integration tests | Published profile (200), draft profile (404), non-existent ID (404), offers for published (200), offers for draft (404) |
| Manual validation | `curl` without JWT — verify public response shape, verify 404 for unpublished |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 6 new, 1 modified |
| Estimated lines | ~400–500 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Private data leaks in public response | High impact, Low likelihood | Service constructs response manually (not Prisma raw); test asserts excluded fields are absent |
| Unpublished profile accessible | Medium | Query filter `status = PUBLISHED` enforced in service; test with draft profile |
| Performance on public endpoint | Low | Indexed on `id` and `status`; rate limited |

**Rollback:** Revert PR. Remove public routes from `app.ts`. No data affected.

---

## Feature F-08 — Frontend Layout & Routing

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-08 |
| **Feature name** | Frontend Layout & Routing |
| **Goal** | Create the Professional Space layout (sidebar, bottom tab bar, main content area) and route structure |
| **User Stories** | None (infrastructure for all frontend features) |
| **Dependencies** | F-01 (shared types) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | None |
| Frontend pages | Layout shell with routing (no page content yet) |
| React components | `ProfessionalLayout`, `Sidebar`, `BottomTabBar`, `MobileDrawer` |
| Shared schemas | None |
| Tests to add | Layout rendering tests, routing tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/layouts/ProfessionalLayout.tsx` | Sidebar + main content shell |
| `apps/web/src/layouts/ProfessionalLayout.test.tsx` | Layout tests |
| `apps/web/src/components/Sidebar.tsx` | Desktop sidebar navigation |
| `apps/web/src/components/BottomTabBar.tsx` | Mobile bottom tab bar |
| `apps/web/src/components/MobileDrawer.tsx` | Mobile "More" drawer |
| `apps/web/src/services/api.ts` | API client (fetch wrapper) |
| `apps/web/src/lib/query-client.ts` | React Query client config |
| `apps/web/src/hooks/useAuth.ts` | Auth hook (check role, redirect if not PROFESSIONAL) |
| `apps/web/src/styles/globals.css` | Chaweer design tokens as Tailwind config |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Add `/pro/*` routes with `ProfessionalLayout` |
| `apps/web/src/main.tsx` | Wrap app in `QueryClientProvider` |

**Files intentionally left unchanged:**

| File | Reason |
|---|---|
| `apps/web/src/features/` | Not created yet — individual features create their own folders |
| Existing auth/account pages | Unaffected |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `services/api.ts` — fetch wrapper with auth header, error parsing | Yes — API client |
| 2 | Create `lib/query-client.ts` — React Query config | Yes — query client |
| 3 | Set up Chaweer design tokens in Tailwind config (`globals.css`) | Yes — tokens defined |
| 4 | Create `Sidebar` component (desktop navigation) | Yes — renders correctly |
| 5 | Create `BottomTabBar` component (mobile navigation) | Yes — renders correctly |
| 6 | Create `MobileDrawer` component ("More" sheet) | Yes — renders correctly |
| 7 | Create `ProfessionalLayout` — combines sidebar + main + bottom tab + responsive | Yes — layout works |
| 8 | Add `/pro/*` routes in `App.tsx` with placeholder pages | Yes — routes work |
| 9 | Create `useAuth` hook — redirect non-professionals | Yes — auth guard works |
| 10 | Write layout and routing tests | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- Navigating to `/pro` shows the professional layout with sidebar
- Sidebar shows: Dashboard, Profil, Expertise, Offres, Disponibilités (disabled), Paramètres (disabled)
- Mobile shows bottom tab bar with 4 items + "Plus" drawer
- Non-professional users are redirected to login
- Chaweer design tokens (colors, typography, spacing) are applied

**Technical:**
- React Router 7 with nested routes
- Layout is responsive (sidebar → bottom tab bar at 768px breakpoint)
- API client sends JWT in `Authorization` header
- React Query client configured with sensible defaults (stale time, retry)

**UX:**
- Sidebar matches Chaweer design system (teal primary #0F766E)
- Bottom tab bar icons from Lucide
- Smooth transitions between routes

**Regression checks:**
- Existing auth pages (`/login`, `/register`) still work
- Existing account page (`/compte`) still works

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | Sidebar renders correct nav items, BottomTabBar renders correct tabs, API client formats requests correctly |
| Integration tests | Routing: `/pro` renders layout, unknown `/pro/xyz` renders 404, non-professional redirected |
| Manual validation | Browser — verify responsive behavior, navigation, design tokens |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 10 new, 2 modified |
| Estimated lines | ~600–800 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Tailwind config conflicts | Low | Use Tailwind 4 CSS-based config; test build |
| Routing conflicts with existing routes | Low | `/pro` prefix is new, no conflicts |
| Auth guard blocks legitimate users | Medium | Test with both CLIENT and PROFESSIONAL roles |

**Rollback:** Revert PR. Remove `/pro/*` routes. Existing pages unaffected.

---

## Feature F-09 — Dashboard Page

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-09 |
| **Feature name** | Dashboard Page |
| **Goal** | Build the cockpit dashboard with status banner, completion progress, section cards, and publish action |
| **User Stories** | US-024 (view dashboard), US-035 (publish profile), US-036 (unpublish profile) |
| **Dependencies** | F-03 (profile API), F-06 (publication API), F-08 (layout) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes `GET /professional/me`, `POST /professional/publish`, `POST /professional/unpublish` |
| Frontend pages | `/pro` — Dashboard |
| React components | `DashboardHero`, `CompletionProgress`, `SectionStatusCard`, `QuickActions`, `StatusBanner`, `PublishModal` |
| Shared schemas | `ProfessionalProfileResponse` type |
| Tests to add | Component tests, hook tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/features/dashboard/index.ts` | Feature barrel |
| `apps/web/src/features/dashboard/components/DashboardHero.tsx` | Status banner + contextual message + action button |
| `apps/web/src/features/dashboard/components/CompletionProgress.tsx` | Progress bar + percentage + breakdown |
| `apps/web/src/features/dashboard/components/SectionStatusCard.tsx` | Single section card (icon, name, status, description) |
| `apps/web/src/features/dashboard/components/QuickActions.tsx` | Quick action links |
| `apps/web/src/features/dashboard/components/PublishModal.tsx` | Publish confirmation modal |
| `apps/web/src/features/dashboard/hooks/useDashboard.ts` | Fetch profile data (React Query) |
| `apps/web/src/features/dashboard/hooks/usePublish.ts` | Publish/unpublish mutation |
| `apps/web/src/features/dashboard/DashboardPage.tsx` | Page composition |
| `apps/web/src/features/dashboard/DashboardPage.test.tsx` | Page tests |
| `apps/web/src/components/StatusBanner.tsx` | Reusable status banner (Level 1) |
| `apps/web/src/components/CompletionBadge.tsx` | Reusable completion indicator (Level 1) |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Replace `/pro` placeholder with `DashboardPage` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `useDashboard` hook — fetch `GET /professional/me` with React Query | Yes — hook works |
| 2 | Create `StatusBanner` component (reusable) | Yes — renders correctly |
| 3 | Create `CompletionProgress` component | Yes — renders progress bar |
| 4 | Create `SectionStatusCard` component | Yes — renders card with status |
| 5 | Create `QuickActions` component | Yes — renders action links |
| 6 | Create `DashboardHero` — combines status banner + contextual message + action | Yes — renders correctly |
| 7 | Create `PublishModal` — confirmation modal for publish action | Yes — modal works |
| 8 | Create `usePublish` hook — publish/unpublish mutations | Yes — mutations work |
| 9 | Compose `DashboardPage` — all components together | Yes — page renders |
| 10 | Write tests (rendering, status transitions, publish flow) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- Dashboard shows correct status banner for each profile status (DRAFT, PENDING_VERIFICATION, PUBLISHED, UNPUBLISHED)
- Completion progress bar shows percentage based on MVP sections
- Section status cards show ✅/❌ for each section and navigate to the correct route on click
- Publish button is disabled when pre-conditions are not met
- Publish modal shows confirmation message
- After publish, status updates to PENDING_VERIFICATION
- Unpublish button visible when PUBLISHED

**Technical:**
- React Query caches profile data
- Publish mutation invalidates profile query
- No business logic in components (all in hooks)
- Chaweer design tokens applied

**UX:**
- Status banner colors: gray (DRAFT/UNPUBLISHED), amber (PENDING), green (PUBLISHED)
- Progress bar uses teal primary
- Cards have hover state
- Responsive: 3 columns desktop, 2 tablet, 1 mobile

**Regression checks:**
- Other routes still work
- Layout sidebar/bottom tab still works

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `CompletionProgress` renders correct percentage, `SectionStatusCard` renders correct status, `StatusBanner` renders correct message per status |
| Integration tests | Dashboard renders with mocked API data, publish flow (click → modal → confirm → status change), navigation to sections |
| Manual validation | Browser — verify all 4 status states, publish/unpublish flow, responsive layout |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 12 new, 1 modified |
| Estimated lines | ~700–900 |
| PR size | Medium–Large |

**If too large, split into:**
- PR 1: Hooks + reusable components (`StatusBanner`, `CompletionBadge`)
- PR 2: Page composition + tests

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Publish pre-conditions mismatch | Medium | Use completion from API response, don't recompute in frontend |
| Stale data after publish | Low | React Query invalidation on mutation success |
| Modal accessibility | Low | Use shadcn/ui Dialog component (accessible by default) |

**Rollback:** Revert PR. `/pro` shows placeholder again.

---

## Feature F-10 — Profile Page

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-10 |
| **Feature name** | Profile Page |
| **Goal** | Build the professional profile page with hero, editable cards for identity, biography, contact, office |
| **User Stories** | US-025 (view profile), US-026 (edit identity), US-027 (edit bio), US-028 (edit contact), US-029 (edit office) |
| **Dependencies** | F-03 (profile API), F-04 (contact & office APIs), F-08 (layout) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes `GET /professional/me`, `PATCH /professional/profile`, `GET/PATCH /professional/contact`, `GET/PATCH /professional/office`, `POST /professional/upload-photo` |
| Frontend pages | `/pro/profil` — Profile |
| React components | `ProfileHero`, `EditableCard`, `IdentityCard`, `BiographyCard`, `ContactCard`, `OfficeCard`, `MapPlaceholder`, `LanguagesCard` (read-only) |
| Shared schemas | `updateProfileSchema`, `updateContactSchema`, `updateOfficeSchema` from `@chaweer/shared` |
| Tests to add | Component tests, hook tests, form validation tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/features/profile/index.ts` | Feature barrel |
| `apps/web/src/features/profile/components/ProfileHero.tsx` | Hero with photo, name, title, bar, completion, preview link |
| `apps/web/src/features/profile/components/IdentityCard.tsx` | Identity editable card |
| `apps/web/src/features/profile/components/BiographyCard.tsx` | Biography editable card |
| `apps/web/src/features/profile/components/ContactCard.tsx` | Contact editable card |
| `apps/web/src/features/profile/components/OfficeCard.tsx` | Office editable card |
| `apps/web/src/features/profile/components/LanguagesCard.tsx` | Read-only languages display |
| `apps/web/src/features/profile/hooks/useProfile.ts` | Fetch profile data |
| `apps/web/src/features/profile/hooks/useUpdateIdentity.ts` | Update identity mutation |
| `apps/web/src/features/profile/hooks/useUpdateContact.ts` | Update contact mutation |
| `apps/web/src/features/profile/hooks/useUpdateOffice.ts` | Update office mutation |
| `apps/web/src/features/profile/ProfilePage.tsx` | Page composition |
| `apps/web/src/features/profile/ProfilePage.test.tsx` | Page tests |
| `apps/web/src/components/EditableCard.tsx` | Reusable read/edit card wrapper (Level 1) |
| `apps/web/src/components/MapPlaceholder.tsx` | Reusable map placeholder (Level 1) |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Replace `/pro/profil` placeholder with `ProfilePage` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `EditableCard` reusable component — read/edit lifecycle with save/cancel | Yes — reusable component |
| 2 | Create `MapPlaceholder` reusable component | Yes — reusable component |
| 3 | Create `useProfile` hook | Yes — fetches profile |
| 4 | Create `ProfileHero` component | Yes — renders hero |
| 5 | Create `IdentityCard` — uses `EditableCard`, photo upload, form fields | Yes — card works |
| 6 | Create `BiographyCard` — uses `EditableCard`, textarea with char count | Yes — card works |
| 7 | Create `ContactCard` — uses `EditableCard`, phone field | Yes — card works |
| 8 | Create `OfficeCard` — uses `EditableCard`, name/address/city fields + `MapPlaceholder` | Yes — card works |
| 9 | Create `LanguagesCard` — read-only display from expertise | Yes — card works |
| 10 | Create update hooks (identity, contact, office) | Yes — mutations work |
| 11 | Compose `ProfilePage` — all cards in order | Yes — page renders |
| 12 | Write tests (card read/edit transitions, form validation, save flow) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- Hero shows photo, name, professional title, bar association, completion %, "Voir profil public" link
- Each card shows read mode by default with "Modifier" button
- Clicking "Modifier" switches card to edit mode with form fields
- Clicking "Enregistrer" saves via API and returns to read mode with updated data
- Clicking "Annuler" returns to read mode without saving
- Biography textarea shows character count (e.g., "247/600")
- Office card shows map placeholder in read mode when address is filled
- Photo upload works in identity card
- Form validation matches Zod schemas from `@chaweer/shared`

**Technical:**
- `EditableCard` is a reusable Level 1 component (used by all cards)
- Each card has its own hook for mutations
- React Query invalidates `/professional/me` after each save
- No business logic in components

**UX:**
- Cards have Chaweer design system styling (radius-lg, surface color, border)
- Edit mode shows form fields with labels
- Save button shows loading state during mutation
- Error messages displayed inline per field

**Regression checks:**
- Dashboard still works after profile updates (shared query invalidation)
- Other routes unaffected

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `EditableCard` read→edit→save→read lifecycle, `EditableCard` cancel, form validation per card |
| Integration tests | Profile page renders all cards, edit identity → save → read mode shows new data, edit office → save → map placeholder appears |
| Manual validation | Browser — verify each card's edit/save flow, photo upload, character count, responsive layout |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 16 new, 1 modified |
| Estimated lines | ~900–1200 |
| PR size | Large |

**Split into 2 PRs:**
- **PR 1:** `EditableCard` + `MapPlaceholder` + `ProfileHero` + hooks + tests (~500 lines)
- **PR 2:** All card components + page composition + tests (~600 lines)

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| `EditableCard` too rigid for all card types | Medium | Design flexible API (render props for read/edit content) |
| Form validation mismatch | Low | Use shared Zod schemas from `@chaweer/shared` |
| Photo upload fails silently | Medium | Show error toast on upload failure |
| Concurrent edits (two cards saving) | Low | Each card saves independently; React Query merges results |

**Rollback:** Revert PR(s). `/pro/profil` shows placeholder again.

---

## Feature F-11 — Expertise Page

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-11 |
| **Feature name** | Expertise Page |
| **Goal** | Build the expertise management page with specialization toggle cards, practice area chips, language chips |
| **User Stories** | US-030 (edit expertise) |
| **Dependencies** | F-03 (profile API), F-08 (layout) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes `GET /professional/referential`, `PUT /professional/expertise` |
| Frontend pages | `/pro/expertise` — Expertise |
| React components | `ToggleCard`, `SpecializationSelector`, `PracticeAreaSelector`, `LanguageSelector`, `ExpertiseStickyBar` |
| Shared schemas | `updateExpertiseSchema` from `@chaweer/shared` |
| Tests to add | Component tests, hook tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/features/expertise/index.ts` | Feature barrel |
| `apps/web/src/features/expertise/components/SpecializationSelector.tsx` | Toggle cards for specializations |
| `apps/web/src/features/expertise/components/PracticeAreaSelector.tsx` | Chips for practice areas (filtered by selected specializations) |
| `apps/web/src/features/expertise/components/LanguageSelector.tsx` | Chips for languages |
| `apps/web/src/features/expertise/components/ExpertiseStickyBar.tsx` | Sticky summary bar with save button |
| `apps/web/src/features/expertise/hooks/useExpertise.ts` | Fetch expertise + update mutation |
| `apps/web/src/features/expertise/hooks/useReferential.ts` | Fetch referential data (cached) |
| `apps/web/src/features/expertise/ExpertisePage.tsx` | Page composition |
| `apps/web/src/features/expertise/ExpertisePage.test.tsx` | Page tests |
| `apps/web/src/components/ToggleCard.tsx` | Reusable toggle card (Level 1) |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Replace `/pro/expertise` placeholder with `ExpertisePage` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `ToggleCard` reusable component | Yes — reusable component |
| 2 | Create `useReferential` hook — fetch and cache reference data | Yes — hook works |
| 3 | Create `useExpertise` hook — fetch current expertise + update mutation | Yes — hook works |
| 4 | Create `SpecializationSelector` — toggle cards for each specialization | Yes — renders correctly |
| 5 | Create `PracticeAreaSelector` — chips filtered by selected specializations | Yes — filters correctly |
| 6 | Create `LanguageSelector` — chips for each language | Yes — renders correctly |
| 7 | Create `ExpertiseStickyBar` — summary + save button | Yes — sticky bar works |
| 8 | Compose `ExpertisePage` | Yes — page renders |
| 9 | Write tests (toggle selection, practice area filtering, save flow) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- Specializations displayed as toggle cards (selected = teal background)
- Practice areas appear only for selected specializations
- Languages displayed as toggle chips
- Sticky bar shows count: "X spé · Y sit · Z lang"
- Save button sends `PUT /professional/expertise` with all three arrays
- At least 1 of each required (validation)

**Technical:**
- `ToggleCard` is reusable Level 1 component
- Referential data cached with long stale time (rarely changes)
- Practice areas filtered client-side based on selected specializations
- Save uses `PUT` (full replacement)

**UX:**
- Toggle cards have smooth selection animation
- Sticky bar visible on scroll
- Chaweer design tokens applied

**Regression checks:**
- Dashboard completion updates after expertise save (query invalidation)
- Other routes unaffected

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `ToggleCard` toggle behavior, practice area filtering logic, validation (min 1 each) |
| Integration tests | Page renders with mocked referential data, select specialization → practice areas appear, save → success |
| Manual validation | Browser — verify toggle behavior, filtering, sticky bar, save flow |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 10 new, 1 modified |
| Estimated lines | ~600–800 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Practice area filtering logic incorrect | Medium | Unit test filtering with multiple specializations |
| Referential data loading slowly | Low | Cache with React Query; show loading state |
| Save sends stale selection | Low | Use form state, not cached query data |

**Rollback:** Revert PR. `/pro/expertise` shows placeholder.

---

## Feature F-12 — Offers Page

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-12 |
| **Feature name** | Offers Page |
| **Goal** | Build the consultation offers page with multiple offer cards, create/edit/delete/toggle functionality |
| **User Stories** | US-031 (create offer), US-032 (edit offer), US-033 (delete offer), US-034 (toggle offer) |
| **Dependencies** | F-05 (offers API), F-08 (layout) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes `GET /professional/offers`, `POST /professional/offers`, `PUT /professional/offers/:id`, `DELETE /professional/offers/:id`, `PATCH /professional/offers/:id/toggle` |
| Frontend pages | `/pro/offres` — Offers |
| React components | `OfferCard`, `OfferForm`, `OfferList`, `OfferToggle` |
| Shared schemas | `createOfferSchema`, `updateOfferSchema` from `@chaweer/shared` |
| Tests to add | Component tests, hook tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/features/offers/index.ts` | Feature barrel |
| `apps/web/src/features/offers/components/OfferCard.tsx` | Single offer display card |
| `apps/web/src/features/offers/components/OfferForm.tsx` | Create/edit form (modal or inline) |
| `apps/web/src/features/offers/components/OfferList.tsx` | List of offer cards |
| `apps/web/src/features/offers/components/OfferToggle.tsx` | Active/inactive toggle switch |
| `apps/web/src/features/offers/hooks/useOffers.ts` | Fetch offers list |
| `apps/web/src/features/offers/hooks/useOfferMutations.ts` | Create, update, delete, toggle mutations |
| `apps/web/src/features/offers/OffersPage.tsx` | Page composition |
| `apps/web/src/features/offers/OffersPage.test.tsx` | Page tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Replace `/pro/offres` placeholder with `OffersPage` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `useOffers` hook — fetch offers list | Yes — hook works |
| 2 | Create `useOfferMutations` hook — create/update/delete/toggle | Yes — mutations work |
| 3 | Create `OfferCard` — display offer with edit/delete/toggle actions | Yes — renders correctly |
| 4 | Create `OfferForm` — form with title, price, duration, modalities | Yes — form works |
| 5 | Create `OfferToggle` — active/inactive switch | Yes — toggle works |
| 6 | Create `OfferList` — list of cards + "Add offer" button | Yes — list renders |
| 7 | Compose `OffersPage` | Yes — page renders |
| 8 | Write tests (create, edit, delete, toggle, validation) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- List shows all offers sorted by `order`
- "Add offer" button opens form (modal)
- Each offer card shows title, price, duration, modalities, active toggle
- Edit button opens form pre-filled with offer data
- Delete button shows confirmation then deletes
- Toggle switch activates/deactivates offer without deleting
- Empty state shows "No offers yet" with CTA

**Technical:**
- Mutations invalidate offers list query
- Form validation matches Zod schemas
- Duration options: 15, 30, 45, 60 minutes
- Modality options: VIDEO, OFFICE

**UX:**
- Offer cards have Chaweer styling
- Price displayed as "300 DH" format
- Duration displayed as "30 min" format
- Modalities shown as badges
- Inactive offers have muted appearance

**Regression checks:**
- Dashboard completion updates after offer changes
- Other routes unaffected

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `OfferForm` validation (invalid price, missing title), `OfferToggle` behavior |
| Integration tests | Create offer → appears in list, edit offer → updates, delete → removes, toggle → changes active state |
| Manual validation | Browser — verify full CRUD flow, empty state, form validation |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 9 new, 1 modified |
| Estimated lines | ~600–800 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Delete without confirmation | Medium | Show confirmation dialog before delete |
| Toggle sends wrong state | Low | Send `active: !currentActive` explicitly |
| Form modal not accessible | Low | Use shadcn/ui Dialog |

**Rollback:** Revert PR. `/pro/offres` shows placeholder.

---

## Feature F-13 — Public Preview Page

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-13 |
| **Feature name** | Public Preview Page |
| **Goal** | Build the public preview page that shows the profile exactly as clients see it |
| **User Stories** | US-037 (preview public profile) |
| **Dependencies** | F-07 (public profile API), F-08 (layout) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes `GET /professionals/:id` (public) |
| Frontend pages | `/pro/aperçu` — Public Preview |
| React components | `PublicHero`, `PublicOfferCard`, `PublicSectionCard`, `PublicOfficeMap`, `PublicTimeline` |
| Shared schemas | `PublicProfileResponse` type from `@chaweer/shared` |
| Tests to add | Component tests, hook tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/features/public-preview/index.ts` | Feature barrel |
| `apps/web/src/features/public-preview/components/PublicHero.tsx` | Hero with photo, name, title, bar, verified badge |
| `apps/web/src/features/public-preview/components/PublicOfferCard.tsx` | Offer card (no edit actions) |
| `apps/web/src/features/public-preview/components/PublicSectionCard.tsx` | Section card (about, expertise, languages) |
| `apps/web/src/features/public-preview/components/PublicOfficeMap.tsx` | Office + map placeholder |
| `apps/web/src/features/public-preview/components/PublicTimeline.tsx` | Timeline for education/experience [Next] |
| `apps/web/src/features/public-preview/hooks/usePublicProfile.ts` | Fetch public profile |
| `apps/web/src/features/public-preview/PublicPreviewPage.tsx` | Page composition |
| `apps/web/src/features/public-preview/PublicPreviewPage.test.tsx` | Page tests |
| `apps/web/src/components/Timeline.tsx` | Reusable timeline component (Level 1) [Next] |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/App.tsx` | Replace `/pro/aperçu` placeholder with `PublicPreviewPage` |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Create `usePublicProfile` hook — fetch using profile ID from `/professional/me` | Yes — hook works |
| 2 | Create `PublicHero` — photo, name, title, bar association, verified badge | Yes — renders correctly |
| 3 | Create `PublicOfferCard` — offer display (no actions) | Yes — renders correctly |
| 4 | Create `PublicSectionCard` — reusable section wrapper | Yes — renders correctly |
| 5 | Create `PublicOfficeMap` — office info + map placeholder | Yes — renders correctly |
| 6 | Compose `PublicPreviewPage` — all sections in public profile order | Yes — page renders |
| 7 | Write tests (rendering, empty states, unpublished profile handling) | Yes — tests pass |

### Acceptance Criteria

**Functional:**
- Page shows the profile exactly as a client would see it
- Hero shows photo, name, professional title, bar association, verified badge (if verified)
- Offers section shows active offers only
- Expertise section shows specializations, practice areas, languages (by name, not ID)
- Office section shows name, address, city, map placeholder
- If profile is not published, show "Your profile is not published yet" message with link to dashboard

**Technical:**
- Uses public API endpoint (no auth required)
- Profile ID obtained from `/professional/me` (authenticated) then passed to public endpoint
- No edit actions on any card
- Response shape matches `PublicProfileResponse`

**UX:**
- Matches the redesigned `public-preview.html` wireframe
- Chaweer design tokens applied
- Strong hero section, prominent offers, modern section cards
- Responsive layout

**Regression checks:**
- Other routes unaffected
- Public API endpoint works correctly

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `PublicHero` renders correct data, `PublicOfferCard` renders offer, `PublicSectionCard` renders section |
| Integration tests | Page renders with mocked public profile, unpublished profile shows message |
| Manual validation | Browser — compare with `public-preview.html` wireframe, verify all sections |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 10 new, 1 modified |
| Estimated lines | ~600–800 |
| PR size | Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Profile ID not available (no profile) | Medium | Show empty state with link to dashboard |
| Public API returns 404 (not published) | Expected | Show "not published" message, not an error |
| Visual mismatch with wireframe | Medium | Cross-reference with `public-preview.html` during development |

**Rollback:** Revert PR. `/pro/aperçu` shows placeholder.

---

## Feature F-14 — Next-Phase CRUD APIs

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-14 |
| **Feature name** | Next-Phase CRUD APIs |
| **Goal** | Create CRUD endpoints for Education, Experience, Certifications, Memberships, Verification |
| **User Stories** | US-038–US-041 (education, experience, certifications, memberships) |
| **Dependencies** | F-01, F-02, F-03 |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None (tables already created in F-02) |
| Prisma migration | None |
| Backend modules | New sub-modules: `professional/education/`, `professional/experience/`, `professional/certifications/`, `professional/memberships/`, `professional/verification/` |
| API endpoints | 4 CRUD endpoints × 4 entities + 1 GET for verification = 17 endpoints |
| Frontend pages | None |
| React components | None |
| Shared schemas | Zod schemas for all entities from `@chaweer/shared` |
| Tests to add | Service + controller tests for each sub-module |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/src/modules/professional/education/` | 4 files (routes, controller, service, schema) + tests |
| `apps/api/src/modules/professional/experience/` | 4 files + tests |
| `apps/api/src/modules/professional/certifications/` | 4 files + tests |
| `apps/api/src/modules/professional/memberships/` | 4 files + tests |
| `apps/api/src/modules/professional/verification/` | 3 files (routes, controller, service) + tests |

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/src/modules/professional/professional.routes.ts` | Mount 5 new sub-routers |
| `apps/api/src/modules/professional/professional.service.ts` | Add education, experience, certifications, memberships to `getMyProfile` Prisma includes |

### Implementation Order

**Split into 2 PRs:**

**PR 1: Education + Experience (timeline entities)**
| Task | Description |
|---|---|
| 1 | Create `education/` sub-module with CRUD |
| 2 | Create `experience/` sub-module with CRUD |
| 3 | Update `getMyProfile` to include education and experience |
| 4 | Write tests for both |

**PR 2: Certifications + Memberships + Verification**
| Task | Description |
|---|---|
| 5 | Create `certifications/` sub-module with CRUD |
| 6 | Create `memberships/` sub-module with CRUD |
| 7 | Create `verification/` sub-module (GET only) |
| 8 | Update `getMyProfile` to include certifications, memberships, verification |
| 9 | Write tests for all three |

### Acceptance Criteria

**Functional:**
- Each entity supports: GET list, POST create, PUT update, DELETE
- Verification supports: GET only (status display)
- All endpoints enforce ownership
- `GET /professional/me` now includes all new entities

**Technical:**
- Same sub-module pattern as F-04 and F-05
- Zod schemas from `@chaweer/shared`
- `order` field supported for display ordering

**UX:** N/A (API only)

**Regression checks:**
- MVP endpoints still work
- `GET /professional/me` response shape is backward compatible (new arrays are empty for existing profiles)

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | CRUD for each entity, ownership, validation |
| Integration tests | Full CRUD cycle for each entity, cross-profile access returns 403/404 |
| Manual validation | `curl` — verify all endpoints |

### Pull Request Scope

| Property | Value |
|---|---|
| PR 1 | ~8 new files, 2 modified, ~500 lines, Medium |
| PR 2 | ~12 new files, 2 modified, ~600 lines, Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| `getMyProfile` response grows too large | Low | Entities are small; pagination available for lists |
| Ownership bypass | Medium | Service verifies `entity.profileId === profile.id` |

**Rollback:** Revert PR(s). Remove sub-routers. Database tables remain.

---

## Feature F-15 — Next-Phase Frontend Components

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-15 |
| **Feature name** | Next-Phase Frontend Components |
| **Goal** | Build education timeline, experience timeline, certification cards, membership cards, verification badge |
| **User Stories** | US-038–US-041 |
| **Dependencies** | F-14 (CRUD APIs), F-10 (profile page exists) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | None |
| Prisma migration | None |
| Backend modules | None |
| API endpoints | Consumes all next-phase CRUD endpoints |
| Frontend pages | Extends `/pro/profil` with new cards; extends `/pro/aperçu` with new sections |
| React components | `EducationTimeline`, `ExperienceTimeline`, `CertificationCard`, `MembershipCard`, `VerificationBadge`, `Timeline` |
| Shared schemas | Zod schemas for education, experience, certification, membership from `@chaweer/shared` |
| Tests to add | Component tests, hook tests |

### Files

**Files to create:**

| File | Purpose |
|---|---|
| `apps/web/src/components/Timeline.tsx` | Reusable timeline (Level 1) |
| `apps/web/src/features/profile/components/EducationTimeline.tsx` | Education CRUD with timeline UI |
| `apps/web/src/features/profile/components/ExperienceTimeline.tsx` | Experience CRUD with timeline UI |
| `apps/web/src/features/profile/components/CertificationCard.tsx` | Certification CRUD with card UI |
| `apps/web/src/features/profile/components/MembershipCard.tsx` | Membership CRUD with card UI |
| `apps/web/src/features/profile/components/VerificationBadge.tsx` | Verification status display |
| `apps/web/src/features/profile/hooks/useEducation.ts` | Education CRUD hooks |
| `apps/web/src/features/profile/hooks/useExperience.ts` | Experience CRUD hooks |
| `apps/web/src/features/profile/hooks/useCertifications.ts` | Certification CRUD hooks |
| `apps/web/src/features/profile/hooks/useMemberships.ts` | Membership CRUD hooks |
| `apps/web/src/features/public-preview/components/PublicTimeline.tsx` | Public timeline display |

**Files to modify:**

| File | Change |
|---|---|
| `apps/web/src/features/profile/ProfilePage.tsx` | Add new cards to the page |
| `apps/web/src/features/public-preview/PublicPreviewPage.tsx` | Add timeline sections |

### Implementation Order

**Split into 2 PRs:**

**PR 1: Timeline components (Education + Experience)**
| Task | Description |
|---|---|
| 1 | Create `Timeline` reusable component |
| 2 | Create `EducationTimeline` with CRUD |
| 3 | Create `ExperienceTimeline` with CRUD |
| 4 | Add to `ProfilePage` |
| 5 | Add to `PublicPreviewPage` |
| 6 | Write tests |

**PR 2: Card components (Certifications + Memberships + Verification)**
| Task | Description |
|---|---|
| 7 | Create `CertificationCard` with CRUD |
| 8 | Create `MembershipCard` with CRUD |
| 9 | Create `VerificationBadge` |
| 10 | Add to `ProfilePage` |
| 11 | Add to `PublicPreviewPage` |
| 12 | Write tests |

### Acceptance Criteria

**Functional:**
- Education timeline shows entries in order, supports add/edit/delete
- Experience timeline shows entries with "current" indicator
- Certification cards show title, issuer, year, support add/edit/delete
- Membership cards show organization, role, years, support add/edit/delete
- Verification badge shows status (UNVERIFIED, PENDING, VERIFIED, REJECTED)
- Public preview shows timelines and cards in read-only mode

**Technical:**
- `Timeline` is reusable Level 1 component
- CRUD hooks follow same pattern as offers (F-12)
- React Query invalidation after each mutation

**UX:**
- Timeline visual: vertical line with dot markers
- Cards match Chaweer design system
- Empty states for each section
- Add button shows form (modal or inline)

**Regression checks:**
- MVP profile cards still work
- Dashboard completion now includes next-phase sections
- Public preview still works

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | `Timeline` rendering, CRUD form validation, empty states |
| Integration tests | Add education → appears in timeline, edit → updates, delete → removes; same for experience, certifications, memberships |
| Manual validation | Browser — verify timeline UI, CRUD flows, public preview |

### Pull Request Scope

| Property | Value |
|---|---|
| PR 1 | ~7 new files, 2 modified, ~600 lines, Medium |
| PR 2 | ~7 new files, 2 modified, ~500 lines, Medium |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Timeline component too rigid | Medium | Use render props for entry content |
| Profile page becomes too long | Low | Cards are collapsible; page scrolls naturally |
| CRUD forms complex | Medium | Reuse `EditableCard` pattern from F-10 |

**Rollback:** Revert PR(s). New cards removed from profile page. MVP cards unaffected.

---

## Feature F-16 — Schema Cleanup (Phase C)

### Feature Overview

| Property | Value |
|---|---|
| **Feature ID** | F-16 |
| **Feature name** | Schema Cleanup (Phase C) |
| **Goal** | Remove deprecated columns and endpoints after all code is verified |
| **User Stories** | None (infrastructure) |
| **Dependencies** | F-03 through F-15 (all code must be updated and verified) |

### Technical Scope

| Area | Details |
|---|---|
| Database changes | Remove `professionalPhone`, `officeAddress`, `cityId` from `ProfessionalProfile` |
| Prisma migration | Phase C migration (destructive — not reversible) |
| Backend modules | Remove deprecated `PUT /professional/offer` endpoint |
| API endpoints | Remove `PUT /professional/offer` |
| Frontend pages | None |
| React components | None |
| Shared schemas | Remove old `updateOfferSchema` (1:1) |
| Tests to add | Verify all endpoints work without old columns |

### Files

**Files to modify:**

| File | Change |
|---|---|
| `apps/api/prisma/schema.prisma` | Remove `professionalPhone`, `officeAddress`, `cityId` from `ProfessionalProfile`; remove `city` relation from Profile (now on Office) |
| `apps/api/src/modules/professional/professional.routes.ts` | Remove `PUT /professional/offer` route |
| `apps/api/src/modules/professional/professional.controller.ts` | Remove `updateOfferController` (1:1) |
| `apps/api/src/modules/professional/professional.schema.ts` | Remove old `updateOfferSchema` |
| `apps/api/src/modules/professional/professional.types.ts` | Remove old `ConsultationOfferData` (1:1) type |

**Files to create:**

| File | Purpose |
|---|---|
| `apps/api/prisma/migrations/<timestamp>_phase_c_cleanup/migration.sql` | Destructive migration SQL |

### Implementation Order

| Task | Description | Reviewable? |
|---|---|---|
| 1 | Full database backup | Yes — backup verified |
| 2 | Run full test suite — all tests must pass | Yes — green build |
| 3 | Remove deprecated columns from `schema.prisma` | Yes — schema diff |
| 4 | Remove deprecated endpoint and related code | Yes — code diff |
| 5 | Run `prisma migrate dev` — generate Phase C migration | Yes — migration file |
| 6 | Run full test suite again | Yes — all tests pass |
| 7 | Manual smoke test all endpoints | Yes — all endpoints work |

### Acceptance Criteria

**Functional:**
- All MVP and Next endpoints work without old columns
- `GET /professional/me` returns correct data (contact and office from new entities)
- No endpoint references `professionalPhone`, `officeAddress`, or `cityId` on Profile

**Technical:**
- Migration is destructive (drops columns) — not reversible
- Full backup taken before migration
- All tests pass before and after migration

**UX:** N/A (infrastructure)

**Regression checks:**
- Every endpoint tested
- Frontend still works (no API calls to old fields)
- `GET /professional/me` response shape unchanged (data comes from new entities)

### Testing Strategy

| Type | Coverage |
|---|---|
| Unit tests | All existing tests pass (no new tests needed) |
| Integration tests | All existing integration tests pass |
| Manual validation | `curl` every endpoint — verify no 500 errors |

### Pull Request Scope

| Property | Value |
|---|---|
| Estimated files | 1 new (migration), 5 modified |
| Estimated lines | ~200 |
| PR size | Small |

### Risk Analysis

| Risk | Likelihood | Mitigation |
|---|---|---|
| Data loss (columns dropped) | High impact, Low likelihood | Full backup before migration; all code verified before running |
| Endpoint breaks after column removal | Medium | All code updated in F-03 through F-15; tests verify |
| Migration fails | Low | Test on staging copy first |

**Rollback:** Not reversible. Restore from backup if needed.

**Feature flags:** Not needed — all code is updated before migration runs.

---

## 3. Dependency Graph

```
Sprint 1:
                    F-01 (shared package)
                       │
                    F-02 (schema migration)
                       │
          ┌────────────┼────────────┬────────────┬────────────┐
          ▼            ▼            ▼            ▼            ▼
       F-03         F-04         F-05         F-06         F-07
    (evolved API) (contact/office) (offers)  (publication) (public API)
          │            │            │            │            │
          │            │            │            │            │
       F-08 (frontend layout) ──────────────────────────────────
          │
    ┌─────┼─────┬─────┬─────┐
    ▼     ▼     ▼     ▼     ▼
  F-09  F-10  F-11  F-12  F-13
(dash) (prof) (exp) (off) (preview)
    │     │     │     │     │
    └─────┴─────┴─────┴─────┘
              │
         All MVP features complete

Sprint 2:
  F-14 (next-phase CRUD APIs)
     │
  F-15 (next-phase frontend)
     │
  F-16 (schema cleanup — Phase C)
```

---

## 4. Sprint Planning

### Sprint 1 — MVP Foundation

| Week | Features | PRs |
|---|---|---|
| 1 | F-01 (shared package), F-02 (schema migration) | 2 PRs |
| 2 | F-03 (evolved API), F-04 (contact/office), F-05 (offers) | 3 PRs |
| 3 | F-06 (publication), F-07 (public API), F-08 (frontend layout) | 3 PRs |
| 4 | F-09 (dashboard), F-10 PR1 (profile: layout + hero + hooks) | 2 PRs |
| 5 | F-10 PR2 (profile: cards + page), F-11 (expertise) | 2 PRs |
| 6 | F-12 (offers page), F-13 (public preview) | 2 PRs |

**Sprint 1 total: 14 PRs over 6 weeks**

### Sprint 2 — Next Iteration

| Week | Features | PRs |
|---|---|---|
| 7 | F-14 PR1 (education + experience APIs) | 1 PR |
| 8 | F-14 PR2 (certifications + memberships + verification APIs) | 1 PR |
| 9 | F-15 PR1 (timeline components) | 1 PR |
| 10 | F-15 PR2 (card components + verification badge) | 1 PR |
| 11 | F-16 (schema cleanup — Phase C) | 1 PR |

**Sprint 2 total: 5 PRs over 5 weeks**

### Total: 19 PRs over 11 weeks

---

## References

| Document | Path |
|---|---|
| Technical Design Blueprint | `docs/04-technique/00-technical-design-blueprint.md` |
| Architecture Document | `docs/04-technique/01-architecture.md` |
| Prisma Schema Evolution | `docs/04-technique/02-prisma-evolution.md` |
| API Contract Specification | `docs/04-technique/03-api-contract.md` |
| UX Master Index | `docs/ux/00-index.md` |
| UX Domain Model | `docs/ux/01-domain-model.md` |
| UX User Flows | `docs/ux/03-user-flows.md` |
| UX Screen Layouts | `docs/ux/04-screen-layouts.md` |
| UX Component Inventory | `docs/ux/05-component-inventory.md` |
