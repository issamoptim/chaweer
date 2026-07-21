# 00 — Technical Design Blueprint

> **Phase:** 3 — Technical Design
> **Status:** Approved
> **Date:** 2026-07-21
> **Prerequisite:** UX Phase validated and frozen

---

## 1. Purpose

This document is the technical roadmap for the implementation of the Chaweer Professional Space. It describes the overall architecture, the technical workstreams, the dependencies between deliverables, the implementation order, the risks, the migration strategy, and the estimated impact on the existing codebase.

Once validated, this blueprint authorizes the production of three detailed deliverables:

1. **Architecture Document** (Phase 3.2)
2. **API Contract Specification** (Phase 3.3)
3. **Prisma Schema Evolution Document** (Phase 3.4)

No implementation code is written during Phase 3.

---

## 2. Mandatory Technical Principles

The following principles are mandatory and must be reflected in all subsequent technical documents (Architecture, API Contract, Prisma Evolution). They guide every design decision and every line of implementation code.

### P1 — Domain-Driven Design

The Professional aggregate is the center of the domain. All related entities (Identity, Office, Expertise, Consultation Offers, Education, Experience, Certifications, Publication, Verification, etc.) belong to this aggregate with clearly defined ownership and responsibilities. Avoid creating unnecessary coupling between modules.

### P2 — API-First

Every frontend interaction must be backed by a well-defined API contract. The frontend must never depend on database structures. The API is the contract between Backend and Frontend.

### P3 — Component-First Frontend

The frontend must be built around reusable components. Avoid page-specific implementations whenever possible. The objective is to build a reusable Design System rather than isolated pages.

### P4 — Incremental Migration

No destructive schema changes. Prefer additive migrations. Existing data must remain compatible. Every migration must include a rollback strategy.

### P5 — Separation of Responsibilities

Keep a clear separation between Domain, Application, Infrastructure, and Presentation. Avoid business logic inside controllers or React components.

### P6 — Future Extensibility

Every design decision must support future modules (Messaging, Reviews, Payments, Articles, Statistics, AI features) without requiring a redesign of the architecture.

### P7 — Backward Compatibility

Existing APIs and features must continue to work whenever possible. Breaking changes must be minimized and explicitly documented.

### P8 — Documentation Quality

Every Architecture and API document must explain not only *what* we are building, but also *why* specific technical decisions were made. The documentation must be understandable by a new developer joining the project.

---

## 3. System Overview

### 3.1 Current State

| Component | Status | Details |
|---|---|---|
| Monorepo | Operational | `apps/api`, `apps/web`, `apps/mobile`, `packages/*` |
| API (Express) | Partially built | Auth module (complete), Profile module (basic), Professional module (basic) |
| Web (React + Vite) | Scaffolded | Routing, state management, UI libraries installed; screens not built |
| Mobile | Empty | README only |
| Database (PostgreSQL) | Running | Docker container, Prisma ORM |
| Prisma Schema | 244 lines | User, Auth, ProfessionalProfile, Specialization, PracticeArea, Language, ConsultationOffer (1:1) |
| Docker | Operational | docker-compose with postgres, api, web |
| CI/CD | Not configured | GitHub Actions workflows exist but not reviewed |

### 3.2 Target State

The validated UX introduces a modular Professional Space with:

- **7 screens** (Dashboard, Profile, Expertise, Offers, Public Preview, Availability [placeholder], Account Settings [placeholder])
- **Domain model evolution**: 10+ new entities (Contact, Office, Education, Experience, Certification, Membership, Verification, Award, Availability, VerifiedDocument)
- **ConsultationOffer**: 1:1 → 1:N evolution
- **Publication workflow**: DRAFT → PENDING_VERIFICATION → PUBLISHED → UNPUBLISHED
- **Completion computation**: 8+ tracked sections
- **Public profile API**: read-only endpoint for published professionals
- **Google Maps integration**: office location with coordinates and maps link

### 3.3 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Web (React)  │  │ Mobile (RN)  │  │  Public Web  │           │
│  │  Professional │  │   (Future)   │  │  (Client)    │           │
│  │    Space      │  │              │  │              │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                 │                 │                    │
└─────────┼─────────────────┼─────────────────┼────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│                                                                  │
│  ┌─────────┐  ┌───────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Auth   │  │  Profile  │  │ Professional │  │  Public    │  │
│  │ Module  │  │  Module   │  │   Module     │  │  Module    │  │
│  │ (done)  │  │ (evolve)  │  │  (evolve)    │  │  (new)     │  │
│  └────┬────┘  └─────┬─────┘  └──────┬───────┘  └─────┬──────┘  │
│       │             │               │                │          │
│  ┌────┴─────────────┴───────────────┴────────────────┴────┐    │
│  │              Core Middleware                            │    │
│  │  (auth, error handling, validation, rate limit, cors)  │    │
│  └────────────────────────┬───────────────────────────────┘    │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL                               │   │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────┐              │   │
│  │  │  User   │  │ Profile  │  │  Reference  │              │   │
│  │  │  Auth   │  │ Contact  │  │  Entities   │              │   │
│  │  │         │  │  Office  │  │  (City,     │              │   │
│  │  │         │  │ Education│  │  Bar, Lang, │              │   │
│  │  │         │  │  Offers  │  │  Spec, PA)  │              │   │
│  │  └─────────┘  └──────────┘  └─────────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              File Storage (uploads/)                       │   │
│  │  (photos, future: verification documents)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Workstreams

### 4.1 Workstream Overview

| # | Workstream | Deliverable | Depends On |
|---|---|---|---|
| WS-1 | Database Schema Evolution | Prisma Schema Evolution Document (Phase 3.4) | UX Domain Model |
| WS-2 | API Architecture & Contracts | API Contract Specification (Phase 3.3) | WS-1 |
| WS-3 | Backend Module Refactoring | Architecture Document (Phase 3.2) | WS-1, WS-2 |
| WS-4 | Frontend Architecture | Architecture Document (Phase 3.2) | WS-2 |
| WS-5 | Shared Package Strategy | Architecture Document (Phase 3.2) | WS-2, WS-4 |
| WS-6 | Migration & Deployment | Architecture Document (Phase 3.2) | WS-1, WS-3 |

### 4.2 Workstream Details

#### WS-1 — Database Schema Evolution

**Objective:** Evolve the Prisma schema to support all validated UX entities.

**Scope:**
- 10 new models (ProfessionalContact, Office, Education, ProfessionalExperience, Certification, ProfessionalMembership, Verification, VerifiedDocument, Availability, Award)
- 2 modified models (ProfessionalProfile, ConsultationOffer)
- 2 new enums (VerificationStatus, VerifiedDocumentType)
- 1 modified enum (ProfessionalProfileStatus: add UNPUBLISHED)
- Data migration strategy (Phase A/B/C)
- Completion computation logic

**Impact on existing code:**
- `apps/api/prisma/schema.prisma` — major evolution
- `apps/api/src/modules/professional/professional.service.ts` — response shape changes
- `apps/api/src/modules/profile/profile.service.ts` — field relocation
- `apps/api/src/modules/profile/profile.constants.ts` — completion rules evolve

**Risk:** Medium — schema changes require careful migration to avoid data loss.

#### WS-2 — API Architecture & Contracts

**Objective:** Define every REST endpoint required by the validated UX screens.

**Scope:**
- Evolve existing endpoints (`/professional/me`, `/professional/profile`, `/professional/expertise`)
- New endpoints for: Contact, Office, Education, Experience, Certifications, Memberships, Offers (1:N CRUD), Publication, Verification, Public Profile
- Request/response schemas with Zod validation
- Authorization rules per endpoint
- Error response standardization
- API versioning strategy

**Impact on existing code:**
- `apps/api/src/modules/professional/professional.routes.ts` — new routes
- `apps/api/src/modules/professional/professional.controller.ts` — new controllers
- `apps/api/src/modules/professional/professional.schema.ts` — new Zod schemas
- New module: `apps/api/src/modules/public/` — public profile endpoints

**Risk:** Low — additive changes, existing endpoints preserved with evolved response shape.

#### WS-3 — Backend Module Refactoring

**Objective:** Restructure backend modules to match domain boundaries.

**Scope:**
- Split `professional` module into sub-modules or keep monolithic with clear internal boundaries
- Introduce `public` module for read-only public profile endpoints
- Standardize module structure: routes → controller → service → schema → types
- Introduce shared types package for API contracts
- Error handling standardization
- Middleware evolution (auth, rate limiting, file upload)

**Impact on existing code:**
- `apps/api/src/modules/professional/` — major restructuring
- `apps/api/src/modules/profile/` — may merge into professional
- `apps/api/src/core/middleware/` — new middleware (publication guard, ownership check)
- `packages/shared/` — API contract types

**Risk:** Medium — refactoring must not break existing auth and profile endpoints.

#### WS-4 — Frontend Architecture

**Objective:** Define the React application architecture for the Professional Space.

**Scope:**
- Route structure: `/pro`, `/pro/profil`, `/pro/expertise`, `/pro/offres`, `/pro/aperçu`, `/pro/disponibilites`, `/pro/compte`
- Layout component (sidebar + main content)
- Feature-based folder structure
- State management strategy (React Query for server state, local state for UI)
- API client / service layer
- Design system integration (Tailwind + shadcn/ui matching Chaweer design tokens)
- Component mapping from UX component inventory to React components

**Impact on existing code:**
- `apps/web/src/` — major new development
- `apps/web/src/layouts/` — professional layout
- `apps/web/src/features/` — feature modules
- `apps/web/src/services/` — API client
- `apps/web/src/styles/` — Chaweer design tokens as Tailwind config

**Risk:** Low — greenfield development within existing scaffold.

#### WS-5 — Shared Package Strategy

**Objective:** Define what code is shared between web and API.

**Scope:**
- `packages/shared/` — API contract types (request/response shapes), Zod schemas (shared validation), enums, constants
- `packages/ui/` — shared UI components (if mobile needs them)
- `packages/config/` — shared configuration (ESLint, TypeScript, Tailwind)

**Impact on existing code:**
- `packages/shared/` — new package, currently empty
- `packages/config/` — new package, currently empty
- `packages/ui/` — defer to when mobile is built

**Risk:** Low — additive, no existing code affected.

#### WS-6 — Migration & Deployment

**Objective:** Ensure safe migration from current schema to target schema and define deployment topology.

**Scope:**
- Prisma migration plan (Phase A: schema, Phase B: data, Phase C: cleanup)
- Docker deployment topology
- Environment variable evolution
- CI/CD pipeline requirements
- Rollback strategy

**Impact on existing code:**
- `apps/api/prisma/migrations/` — new migration files
- `docker-compose.yml` — may evolve
- `.env.example` — new variables for Google Maps, file storage
- `.github/workflows/` — CI/CD pipeline

**Risk:** High — data migration must be zero-loss and reversible.

---

## 5. Document Dependency Graph

```
UX Domain Model (validated, frozen)
       │
       ├──► Phase 3.4 — Prisma Schema Evolution
       │         │
       │         ▼
       ├──► Phase 3.2 — Architecture Document
       │         │         (depends on schema for data layer design)
       │         │
       │         ├──► Backend module boundaries
       │         ├──► Frontend architecture
       │         ├──► Shared package strategy
       │         └──► Deployment topology
       │
       └──► Phase 3.3 — API Contract Specification
                 │         (depends on schema for response shapes,
                 │          depends on architecture for module boundaries)
                 │
                 ▼
           Implementation Phase (Phase 4)
```

**Production order:**

1. **Phase 3.4** (Prisma Schema Evolution) — can start immediately, depends only on UX
2. **Phase 3.2** (Architecture Document) — depends on schema for data layer decisions
3. **Phase 3.3** (API Contract) — depends on both schema and architecture for endpoint design

> **Note:** Phase 3.4 and Phase 3.2 can be produced in parallel since the UX domain model already contains the target schema. Phase 3.3 must wait for both.

---

## 6. Implementation Order (Post-Design)

Once Phase 3 deliverables are validated, implementation follows this order:

### Sprint 1 — MVP Foundation

| Step | Workstream | Task | Depends On |
|---|---|---|---|
| 1 | WS-1 | Prisma migration (Phase A + B) | Schema doc |
| 2 | WS-3 | Refactor professional module structure | Architecture doc |
| 3 | WS-2 | Implement evolved `/professional/me` endpoint | Step 1, 2 |
| 4 | WS-2 | Implement Contact + Office endpoints | Step 1, 2 |
| 5 | WS-2 | Implement Offers 1:N CRUD endpoints | Step 1, 2 |
| 6 | WS-2 | Implement Publication endpoints | Step 1, 2 |
| 7 | WS-2 | Implement Public Profile endpoint | Step 3 |
| 8 | WS-5 | Create `packages/shared` with API contract types | Step 3-7 |
| 9 | WS-4 | Build professional layout (sidebar + main) | Architecture doc |
| 10 | WS-4 | Build Dashboard screen | Step 3, 9 |
| 11 | WS-4 | Build Profile screen (Hero + editable cards) | Step 3, 4, 9 |
| 12 | WS-4 | Build Expertise screen | Step 3, 9 |
| 13 | WS-4 | Build Offers screen (multiple offers) | Step 5, 9 |
| 14 | WS-4 | Build Public Preview screen | Step 7, 9 |
| 15 | WS-1 | Schema cleanup (Phase C) | All above verified |

### Sprint 2 — Next Iteration

| Step | Workstream | Task |
|---|---|---|
| 16 | WS-2 | Education CRUD endpoints |
| 17 | WS-2 | Experience CRUD endpoints |
| 18 | WS-2 | Certification CRUD endpoints |
| 19 | WS-2 | Membership CRUD endpoints |
| 20 | WS-2 | Verification status endpoint |
| 21 | WS-2 | Office: googleMapsUrl, lat, lng fields |
| 22 | WS-2 | Contact: whatsapp, publicEmail, website, linkedInUrl fields |
| 23 | WS-4 | Education timeline UI |
| 24 | WS-4 | Experience timeline UI |
| 25 | WS-4 | Certification card UI |
| 26 | WS-4 | Membership card UI |
| 27 | WS-4 | Verification badge + status UI |

---

## 7. Risk Assessment

| # | Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | Data loss during schema migration | High | Low | Three-phase migration (A: add, B: migrate, C: cleanup); backup before migration; test on staging |
| R2 | Breaking existing auth/profile API | Medium | Medium | Evolved response shape is additive (new fields are nullable); old fields kept during transition |
| R3 | ConsultationOffer 1:1 → 1:N breaks existing data | Medium | Low | Remove `@@unique` constraint; migrate existing offer with default title; backward-compatible API |
| R4 | Frontend build takes too long | Low | Medium | Feature-based architecture; build screen-by-screen; use wireframe prototype as reference |
| R5 | Shared package creates circular dependencies | Low | Low | Strict dependency rules: `packages/shared` depends on nothing; `apps/*` depend on `packages/*` |
| R6 | Google Maps integration complexity | Low | Medium | MVP uses map placeholder; Next phase integrates actual Google Maps API; coordinates stored in DB |
| R7 | Completion computation performance | Low | Low | Computed on read (not stored); simple boolean checks per section |
| R8 | Module boundary confusion (profile vs professional) | Medium | Medium | Merge into single `professional` module with clear sub-modules; document boundaries in architecture |

---

## 8. Migration Strategy

### 8.1 Database Migration

**Principle:** Zero data loss. Three-phase approach.

| Phase | Action | Reversible? | When |
|---|---|---|---|
| A — Schema | Add new tables, columns, enums. Do NOT remove anything. | Yes (drop new tables) | Sprint 1 start |
| B — Data | Migrate existing data into new tables. Set FK pointers. | Yes (null out FKs) | Immediately after A |
| C — Cleanup | Remove deprecated columns (`professionalPhone`, `officeAddress`, `cityId` on Profile). Remove old API endpoint. | No | After all code verified |

**Backup strategy:** Full PostgreSQL dump before Phase A. Point-in-time recovery enabled.

### 8.2 API Migration

| Phase | Action |
|---|---|
| 1 | Evolve `/professional/me` response shape (additive — new fields nullable) |
| 2 | Add new endpoints (Contact, Office, Offers CRUD, Publication, Public Profile) |
| 3 | Deprecate old `/professional/offer` PUT endpoint (keep during transition, remove in Phase C) |
| 4 | Remove deprecated endpoint after frontend is updated |

### 8.3 Frontend Migration

The frontend Professional Space is greenfield — no existing screens to migrate. The existing web app has auth and account management screens that remain unchanged.

---

## 9. Impact on Existing Codebase

### 9.1 Files Modified

| File | Change | Risk |
|---|---|---|
| `apps/api/prisma/schema.prisma` | Major evolution (10+ new models, 2 modified) | Medium |
| `apps/api/src/modules/professional/professional.service.ts` | Response shape evolution, new service methods | Medium |
| `apps/api/src/modules/professional/professional.routes.ts` | New routes for Contact, Office, Offers, Publication | Low |
| `apps/api/src/modules/professional/professional.controller.ts` | New controllers | Low |
| `apps/api/src/modules/professional/professional.schema.ts` | New Zod schemas | Low |
| `apps/api/src/modules/profile/profile.service.ts` | Fields relocate to Contact/Office | Medium |
| `apps/api/src/modules/profile/profile.constants.ts` | Completion rules evolve | Low |
| `apps/api/src/app.ts` | New route mounting (`/public`) | Low |

### 9.2 Files Created

| File | Purpose |
|---|---|
| `apps/api/src/modules/public/public.routes.ts` | Public profile routes |
| `apps/api/src/modules/public/public.controller.ts` | Public profile controller |
| `apps/api/src/modules/public/public.service.ts` | Public profile service |
| `apps/api/src/modules/public/public.schema.ts` | Public profile validation |
| `apps/api/prisma/migrations/xxx_professional_space/` | Migration SQL |
| `packages/shared/src/contracts/` | API contract types |
| `packages/shared/src/enums/` | Shared enums |
| `apps/web/src/layouts/ProfessionalLayout.tsx` | Sidebar + main content layout |
| `apps/web/src/features/dashboard/` | Dashboard feature |
| `apps/web/src/features/profile/` | Profile feature |
| `apps/web/src/features/expertise/` | Expertise feature |
| `apps/web/src/features/offers/` | Offers feature |
| `apps/web/src/features/public-preview/` | Public preview feature |
| `apps/web/src/services/api.ts` | API client |

### 9.3 Files Unchanged

| File | Reason |
|---|---|
| `apps/api/src/modules/auth/*` | Auth module is complete and stable |
| `apps/api/src/core/middleware/auth.ts` | Auth middleware works as-is |
| `apps/api/src/config/env.ts` | Env config may get new variables but structure unchanged |
| `apps/web/src/App.tsx` | Router may get new routes but structure unchanged |

---

## 10. Technology Decisions

### 10.1 Confirmed (from AI-Playbook)

| Decision | Choice | Rationale |
|---|---|---|
| Backend runtime | Node.js 22 LTS | LTS, long-term support |
| Backend framework | Express 5 | Already in use |
| ORM | Prisma 7 | Already in use |
| Database | PostgreSQL 17 | Already in use |
| Validation | Zod 4 | Already in use |
| Frontend framework | React 19 | Already installed |
| Build tool | Vite 6 | Already in use |
| CSS | Tailwind CSS 4 | Already in use |
| UI components | shadcn/ui | Already configured |
| State management | TanStack React Query 5 | Already installed |
| Forms | React Hook Form 7 | Already installed |
| Icons | Lucide React | Already installed |
| Routing | React Router 7 | Already installed |

### 10.2 To Be Decided (in Architecture Document)

| Decision | Options | Recommendation |
|---|---|---|
| Module structure | (a) Single `professional` module with sub-folders, (b) Split into `professional`, `contact`, `office`, `offers` modules | (a) Single module — aggregate root is Professional, all mutations go through it |
| API versioning | (a) URL prefix `/v1/`, (b) Header-based, (c) No versioning | (c) No versioning for MVP — additive changes only |
| File storage | (a) Local filesystem, (b) S3-compatible, (c) Cloudinary | (a) Local for MVP, abstract behind interface |
| Google Maps | (a) Server-side geocoding, (b) Client-side embed, (c) Both | (b) Client-side embed for MVP, server-side geocoding for Next |
| Shared types | (a) `packages/shared` with Zod schemas, (b) OpenAPI codegen, (c) Manual duplication | (a) Shared Zod schemas — single source of truth |
| Error format | (a) Custom envelope, (b) RFC 7807 Problem Details | (a) Custom envelope — already in use (`{ success, data }` / `{ success: false, error }`) |

---

## 11. Deliverable Checklist

### Phase 3.1 — Technical Design Blueprint (this document)
- [x] Overall architecture
- [x] Technical workstreams
- [x] Dependencies between documents
- [x] Implementation order
- [x] Risks
- [x] Migration strategy
- [x] Estimated impact on existing codebase

### Phase 3.2 — Architecture Document ✓
- [x] System overview
- [x] Module boundaries
- [x] Domain boundaries
- [x] Frontend architecture
- [x] Backend architecture
- [x] Shared packages
- [x] Deployment topology
- [x] Design principles
- [x] Data flow
- [x] Security considerations

### Phase 3.3 — API Contract Specification ✓
- [x] Every endpoint with: purpose, request, response, validation, authorization, error cases
- [x] Evolved endpoints (`/professional/me`, `/professional/profile`)
- [x] New endpoints (Contact, Office, Offers CRUD, Publication, Public Profile)
- [x] Next-phase endpoints (Education, Experience, Certifications, Memberships, Verification)

### Phase 3.4 — Prisma Schema Evolution ✓
- [x] Full target schema (all models, enums, relations)
- [x] Field specifications with constraints
- [x] Migration plan (Phase A/B/C)
- [x] Migration SQL (conceptual)
- [x] Completion computation logic
- [x] Publication pre-conditions

---

## 12. Validation Criteria

This blueprint is considered validated when:

1. The user confirms the workstream breakdown and implementation order
2. The user confirms the migration strategy (three-phase, zero data loss)
3. The user confirms the technology decisions (or provides alternatives)
4. The user confirms the risk assessment and mitigations
5. The user authorizes production of Phase 3.2, 3.3, and 3.4

---

## 13. References

| Document | Path |
|---|---|
| AI Playbook | `AI-PLAYBOOK.md` |
| Project Status | `PROJECT_STATUS.md` |
| UX Master Index | `docs/ux/00-index.md` |
| UX Domain Model | `docs/ux/01-domain-model.md` |
| UX Information Architecture | `docs/ux/02-information-architecture.md` |
| UX User Flows | `docs/ux/03-user-flows.md` |
| UX Screen Layouts | `docs/ux/04-screen-layouts.md` |
| UX Component Inventory | `docs/ux/05-component-inventory.md` |
| HTML Wireframe Prototype | `docs/ux/wireframes/` |
| Current Prisma Schema | `apps/api/prisma/schema.prisma` |
| Current API Entry | `apps/api/src/app.ts` |
| Epics | `docs/01-epics/` |
