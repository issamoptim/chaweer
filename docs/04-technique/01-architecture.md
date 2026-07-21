# 01 — Architecture Document

> **Phase:** 3.2 — Architecture Document
> **Status:** Draft — awaiting validation
> **Date:** 2026-07-21
> **Prerequisites:**
> - UX Phase validated and frozen
> - Technical Design Blueprint approved (with 8 mandatory principles)
>
> **Mandatory principles applied:** P1 (DDD), P2 (API-First), P3 (Component-First Frontend), P4 (Incremental Migration), P5 (Separation of Responsibilities), P6 (Future Extensibility), P7 (Backward Compatibility), P8 (Documentation Quality)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Layered Architecture](#2-layered-architecture)
3. [Domain Boundaries](#3-domain-boundaries)
   - 3.4 [Cross-Aggregate Orchestration](#34-cross-aggregate-orchestration)
4. [Backend Architecture](#4-backend-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Shared Packages](#6-shared-packages)
7. [Data Flow](#7-data-flow)
8. [Security Considerations](#8-security-considerations)
9. [Deployment Topology](#9-deployment-topology)
10. [Design Principles Applied](#10-design-principles-applied)
11. [Future Extensibility](#11-future-extensibility)
12. [References](#12-references)

---

## 1. System Overview

### 1.1 What We Are Building

Chaweer is a legal marketplace platform connecting citizens with verified lawyers. The platform has three client applications (Web, Mobile, Public Web) that all consume a single REST API backed by a PostgreSQL database.

The current phase focuses on the **Professional Space** — the dashboard where lawyers build and manage their public profile, expertise, consultation offers, and office information.

### 1.2 Existing Components

```
chaweer/
├── apps/
│   ├── api/          ← Express + Prisma + PostgreSQL (partially built)
│   ├── web/          ← React + Vite + Tailwind + shadcn/ui (scaffolded)
│   └── mobile/       ← React Native + Expo (empty, future)
├── packages/
│   ├── shared/       ← Shared types & Zod schemas (empty)
│   ├── ui/           ← Shared UI components (empty, future)
│   └── config/       ← Shared configuration (empty)
├── docker/           ← Docker configuration
└── docker-compose.yml
```

### 1.3 Target Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Presentation Layer                        │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                    │
│  │  Web App (React) │  │  Mobile App (RN)│  ← Future         │
│  │  Professional    │  │                 │                    │
│  │  Space + Auth    │  │                 │                    │
│  └────────┬────────┘  └────────┬────────┘                    │
│           │                    │                              │
│  ┌────────┴────────────────────┴────────┐                    │
│  │         API Client Layer              │                    │
│  │  (services/api.ts — fetch wrapper)    │                    │
│  └──────────────────┬───────────────────┘                    │
└─────────────────────┼─────────────────────────────────────────┘
                      │  HTTPS / REST / JSON
                      ▼
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│                                                               │
│  ┌─────────┐  ┌───────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Auth   │  │ Profile   │  │ Professional │  │  Public  │ │
│  │ Module  │  │ Module    │  │   Module     │  │  Module  │ │
│  │         │  │           │  │  (aggregate  │  │ (read-   │ │
│  │ (done)  │  │ (evolve)  │  │   root)      │  │  only)   │ │
│  └────┬────┘  └─────┬─────┘  └──────┬───────┘  └────┬─────┘ │
│       │             │               │                │       │
│  ┌────┴─────────────┴───────────────┴────────────────┴────┐ │
│  │              Core Infrastructure                       │ │
│  │  (middleware, error handler, validation, rate limit)   │ │
│  └────────────────────┬───────────────────────────────────┘ │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│                                                               │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL 17  │  │  File Store   │  │  External APIs   │ │
│  │  (via Prisma 7) │  │  (uploads/)   │  │  (Google Maps,   │ │
│  │                 │  │               │  │   OAuth, future)  │ │
│  └────────────────┘  └──────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Why this layering?** (P5 — Separation of Responsibilities)

Each layer has a single responsibility:
- **Presentation** renders data and captures user input. No business logic.
- **Application** orchestrates use cases, validates input, enforces authorization. No database knowledge.
- **Infrastructure** persists data, handles file I/O, integrates external services.

This separation ensures that swapping any layer (e.g., replacing local file storage with S3) does not affect the others.

---

## 2. Layered Architecture

### 2.1 Backend Layers

Each backend module follows a four-layer internal structure:

```
module/
├── module.routes.ts        ← Presentation: HTTP routing, request parsing
├── module.controller.ts    ← Application: orchestration, authorization checks
├── module.service.ts       ← Domain: business rules, aggregate invariants
├── module.schema.ts        ← Application: Zod validation schemas
├── module.types.ts         ← Shared: TypeScript types for this module
└── module.constants.ts     ← Domain: constants, enums, completion rules
```

**Why this structure?** (P5, P8)

- **Routes** are thin — they map HTTP verbs to controller methods. No logic.
- **Controllers** extract the user from the request, call the service, and format the response. No business rules.
- **Services** contain all business logic: aggregate invariants, completion computation, publication rules. Services receive plain objects, not Express requests.
- **Schemas** validate input using Zod. Shared with the frontend via `packages/shared` (P2 — API-First).

### 2.2 Frontend Layers

```
feature/
├── components/             ← Presentation: feature-specific UI components
├── hooks/                  ← Application: data fetching, state logic
├── schemas/                ← Application: form validation (Zod, shared with API)
├── types.ts                ← Shared: TypeScript types for this feature
└── index.ts                ← Public API of this feature module
```

**Why this structure?** (P3, P5)

- **Components** are pure presentation. They receive props and render. No API calls inside components.
- **Hooks** encapsulate data fetching (React Query) and local state logic. Components call hooks, not APIs directly.
- **Schemas** are shared with the API via `packages/shared`, ensuring frontend and backend validation are identical (P2).

---

## 3. Domain Boundaries

### 3.1 Aggregate Root: Professional

The **ProfessionalProfile** is the aggregate root for the Professional Space domain. All child entities are accessed and mutated through it. This is the core DDD principle (P1).

```
ProfessionalProfile (Aggregate Root)
│
├── Identity (1:1)           — firstName, lastName, professionalTitle, photoUrl, barAssociationId
├── Biography (1:1, VO)      — bio
├── ProfessionalContact (1:1)— phone, whatsapp, publicEmail, website, linkedInUrl
├── Office (1:1)             — name, address, cityId, googleMapsUrl, lat, lng
├── Expertise (1:1)          — specializations[], practiceAreas[], languages[]
├── ConsultationOffer[] (1:N)— title, price, duration, modalities, active
├── Education[] (1:N)        — degree, institution, years, description
├── Experience[] (1:N)       — position, organization, years, current
├── Certification[] (1:N)    — title, issuer, issueYear, expiryYear
├── Membership[] (1:N)       — organization, role, years
├── Publication (1:1, VO)    — status, publishedAt, unpublishedAt
├── Verification (1:1)       — status, verifiedAt, verifiedBy
├── Availability (1:1)       — weeklySchedule, exceptions [Future]
└── Award[] (1:N)            — title, issuer, year [Future]
```

**Why a single aggregate?** (P1, P8)

A lawyer's profile is a single coherent unit. Publishing requires checking completion across multiple sections (identity, expertise, offers). If these were separate aggregates, we'd need distributed transactions or eventual consistency — unnecessary complexity for a single-user, single-profile domain.

### 3.2 Module Boundaries

| Module | Responsibility | Aggregate | Can Call |
|---|---|---|---|
| `auth` | Authentication, JWT, OAuth | User | — |
| `profile` | User account management (client-side) | User | — |
| `professional` | Professional Space (aggregate root) | ProfessionalProfile | `auth` (for user context) |
| `public` | Read-only public profile access | — (read model) | `professional` (service layer) |

**Why merge `profile` into `professional`?** (P1, P7)

The existing `profile` module handles basic user profile fields (firstName, lastName, etc.) that overlap with the Professional's Identity entity. Rather than duplicating logic, the `professional` module will handle all professional-related mutations. The `profile` module remains for client-side (non-professional) user account management.

The `public` module is a **read-only** module. It has no write access to the aggregate. It queries the same database but through a separate service that only returns published profiles. This separation ensures that unpublished data can never leak to the public API (P5, P7).

### 3.3 Reference Entities (Shared Kernel)

The following entities are global reference data, shared across all modules:

| Entity | Purpose | Managed By |
|---|---|---|
| `BarAssociation` | List of Moroccan bar associations | Admin (future) |
| `City` | List of Moroccan cities | Admin (future) |
| `Language` | Supported consultation languages | Admin (future) |
| `Specialization` | Legal specializations | Admin (future) |
| `PracticeArea` | Practice areas within specializations | Admin (future) |

These are **read-only** from the Professional Space. They are fetched via the `/professional/referential` endpoint and cached on the frontend.

**Why separate reference data?** (P1, P6)

Reference data changes rarely and is shared across all professionals. Keeping it separate from the aggregate prevents N+1 queries and allows independent caching. Future modules (directory search, filtering) will also need this data.

### 3.4 Cross-Aggregate Orchestration

Some use cases require modifying multiple aggregates within a single transaction. For example, `PATCH /professional/profile` updates both `User` (firstName, lastName) and `ProfessionalProfile` (professionalTitle, bio, barAssociationId) atomically.

The project follows a two-tier standard for cross-aggregate use cases.

#### Current Standard — In-Service Orchestration (B1)

Cross-aggregate use cases may be orchestrated inside the primary module's service **provided that**:

- The orchestration remains simple (a few lines of coordination logic).
- Aggregate boundaries are respected — each aggregate is modified only through its owning service.
- The orchestrator owns the transaction (`prisma.$transaction`).
- Domain service functions accept an optional `tx` parameter to participate in the caller's transaction.

**Example:**

```
Controller → professional.service.updateProfile()
               ├── user.service.updateIdentity()           (User aggregate)
               └── professional.service.updateProfileFields()  (ProfessionalProfile aggregate)
```

- `user.service.updateIdentity(userId, data, tx?)` — only accesses the `User` Prisma model.
- `professional.service.updateProfileFields(profileId, data, tx?)` — only accesses the `ProfessionalProfile` Prisma model.
- `professional.service.updateProfile(userId, input)` — splits input by aggregate ownership, validates, wraps both calls in `prisma.$transaction`, builds the unified response.

No service function directly accesses a Prisma model that doesn't belong to its aggregate.

#### Evolution Trigger — Application Service Layer (B2)

When one or more of the following conditions become true:

- Multiple cross-aggregate use cases appear in the same module.
- Orchestration becomes complex (multiple branches, domain events, compensating actions, external integrations).
- Orchestration logic starts being reused across use cases.
- Several modules require the same orchestration pattern.

The module should introduce a dedicated `*.application.ts` layer.

**Migration procedure:**

1. Create `<module>.application.ts` in the module folder.
2. Move all orchestration functions from `<module>.service.ts` to `<module>.application.ts`.
3. `<module>.service.ts` retains only single-aggregate operations.
4. Controllers import from `<module>.application.ts` instead of `<module>.service.ts`.
5. The migration is purely structural — the external API contract does not change.

**Naming convention:**

| Layer | File | Responsibility |
|---|---|---|
| Domain service | `<module>.service.ts` | Single-aggregate operations, invariants, business rules |
| Application service | `<module>.application.ts` | Use case orchestration, cross-aggregate coordination, transaction management |

**Why this two-tier approach?** (P1, P5, P6, P8)

Introducing an application service layer for a single orchestration function adds more structure than value. The in-service pattern (B1) is sufficient for the current maturity of Chaweer, where cross-aggregate use cases are rare. The evolution trigger ensures that the architecture scales when complexity grows, without requiring a premature abstraction today.

---

## 4. Backend Architecture

### 4.1 Module Structure

The `professional` module is the largest module. It uses **internal sub-modules** to organize code while maintaining a single aggregate boundary:

```
apps/api/src/modules/professional/
├── professional.routes.ts          ← Main router (mounts sub-routers)
├── professional.controller.ts      ← Main controller (me, profile PATCH)
├── professional.service.ts         ← Main service (aggregate root operations)
├── professional.schema.ts          ← Main validation schemas
├── professional.types.ts           ← Main types
├── professional.constants.ts       ← Completion rules, publication pre-conditions
├── referential.service.ts          ← Reference data service
│
├── contact/
│   ├── contact.routes.ts
│   ├── contact.controller.ts
│   ├── contact.service.ts
│   └── contact.schema.ts
│
├── office/
│   ├── office.routes.ts
│   ├── office.controller.ts
│   ├── office.service.ts
│   └── office.schema.ts
│
├── offers/
│   ├── offers.routes.ts
│   ├── offers.controller.ts
│   ├── offers.service.ts
│   └── offers.schema.ts
│
├── publication/
│   ├── publication.routes.ts
│   ├── publication.controller.ts
│   ├── publication.service.ts
│   └── publication.schema.ts
│
├── education/          [Next]
│   ├── education.routes.ts
│   ├── education.controller.ts
│   ├── education.service.ts
│   └── education.schema.ts
│
├── experience/         [Next]
│   └── ... (same structure)
│
├── certifications/     [Next]
│   └── ... (same structure)
│
├── memberships/        [Next]
│   └── ... (same structure)
│
└── verification/       [Next]
    └── ... (same structure)
```

**Why sub-modules instead of separate top-level modules?** (P1, P5, P8)

All entities belong to the Professional aggregate. Splitting them into separate top-level modules would create coupling between modules and risk violating aggregate invariants (e.g., creating an Office without a Profile). Sub-modules keep the aggregate boundary intact while organizing code by feature.

Each sub-module's service receives the `profileId` from the controller (which extracts it from the authenticated user). Sub-modules never query the User table directly — they go through the professional service for user-to-profile resolution.

### 4.2 Public Module

```
apps/api/src/modules/public/
├── public.routes.ts
├── public.controller.ts
├── public.service.ts
└── public.schema.ts
```

The public module is intentionally separate from the professional module:

- **No authentication required** — public profiles are accessible to anyone
- **Read-only** — no mutation endpoints
- **Published-only filter** — only profiles with `status = PUBLISHED` are returned
- **Different response shape** — public responses exclude sensitive fields (contact phone, verification details, etc.)

**Why not just a different route on the professional module?** (P5, P7, P8)

Mixing authenticated and public access in the same module creates security risks. A bug in route ordering or middleware could expose unpublished data. By physically separating the code, we enforce the boundary at the file system level.

### 4.3 Core Infrastructure

```
apps/api/src/core/
├── database/
│   └── prisma.ts          ← Prisma client singleton
├── errors/
│   ├── api-error.ts       ← Base error class
│   └── error-codes.ts     ← Standardized error codes
├── logger/
│   └── logger.ts          ← Pino logger
├── middleware/
│   ├── auth.ts            ← JWT verification, user extraction
│   ├── error-handler.ts   ← Global error handler
│   ├── not-found.ts       ← 404 handler
│   ├── rate-limit.ts      ← Rate limiting
│   └── upload.ts          ← Multer file upload
└── storage/
    └── file-storage.ts    ← File storage abstraction (local → S3 future)
```

**Why abstract file storage?** (P6)

MVP uses local filesystem storage. Future phases may switch to S3-compatible storage or Cloudinary. By abstracting behind an interface now, the switch requires changing only the infrastructure layer — no service or controller changes needed.

### 4.4 Request Lifecycle

```
HTTP Request
    │
    ▼
┌─────────────┐
│   CORS      │  ← Allow configured origins
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Body Parse  │  ← express.json()
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Cookies     │  ← cookie-parser (for refresh token)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Rate Limit   │  ← express-rate-limit (on auth routes)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Router     │  ← Match route
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Auth       │  ← Verify JWT, attach req.user (if protected)
│  Middleware  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validation  │  ← Zod schema validates req.body / req.params
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller   │  ← Extract user, call service, format response
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service    │  ← Business logic, Prisma queries, invariants
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Prisma     │  ← Database query
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Response    │  ← { success: true, data: {...} }
└─────────────┘
```

### 4.5 Error Handling

All errors follow a consistent envelope:

```json
{
  "success": false,
  "error": {
    "code": "PROFESSIONAL_NOT_FOUND",
    "message": "Professional profile not found",
    "details": {}
  }
}
```

**Why this format?** (P7, P8)

The existing auth module already uses this format. Keeping it consistent ensures backward compatibility (P7) and makes error handling predictable for frontend developers (P8).

Standard error codes:

| Code | HTTP Status | When |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod validation fails |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate resource, invalid state transition |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

### 4.6 Response Envelope

All successful responses follow:

```json
{
  "success": true,
  "data": { ... }
}
```

**Why an envelope?** (P8)

A consistent envelope allows the frontend API client to:
1. Check `success` boolean for a quick status check
2. Access `data` directly when successful
3. Access `error.code` for programmatic error handling

---

## 5. Frontend Architecture

### 5.1 Route Structure

```
/                        ← Landing (future)
/inscription/professionnel  ← Professional registration (existing)
/login                   ← Login (existing)
/register                ← Register (existing)
/compte                  ← Account settings (existing, client-side)

# Professional Space (new)
/pro                     ← Dashboard
/pro/profil              ← Professional profile
/pro/expertise           ← Expertise management
/pro/offres              ← Consultation offers
/pro/aperçu              ← Public preview
/pro/disponibilites      ← Availability (placeholder, future)
/pro/compte              ← Account settings (placeholder, future)

# Public (future, separate domain or route)
/professionnels/:id      ← Public profile page
```

**Why `/pro` prefix?** (P6, P8)

The `/pro` prefix clearly separates the Professional Space from the client-facing routes. Future modules (messaging, reviews, admin) can use their own prefixes (`/messages`, `/admin`) without collision.

### 5.2 Layout Architecture

```
App.tsx
├── <BrowserRouter>
│   ├── <Routes>
│   │   ├── /auth/*           ← AuthLayout (existing)
│   │   ├── /compte           ← AccountLayout (existing)
│   │   ├── /pro/*            ← ProfessionalLayout (new)
│   │   │   ├── /pro          ← DashboardPage
│   │   │   ├── /pro/profil   ← ProfilePage
│   │   │   ├── /pro/expertise← ExpertisePage
│   │   │   ├── /pro/offres   ← OffersPage
│   │   │   ├── /pro/aperçu   ← PublicPreviewPage
│   │   │   ├── /pro/disponibilites ← PlaceholderPage
│   │   │   └── /pro/compte   ← PlaceholderPage
│   │   └── *                 ← NotFound
```

**ProfessionalLayout** renders:
- **Desktop (≥1024px):** Fixed sidebar (240px) + main content area
- **Tablet (768–1023px):** Collapsible sidebar + main content
- **Mobile (<768px):** Bottom tab bar + main content + drawer for "More"

### 5.3 Feature-Based Folder Structure

```
apps/web/src/
├── App.tsx                       ← Router setup
├── main.tsx                      ← Entry point
│
├── layouts/
│   ├── ProfessionalLayout.tsx    ← Sidebar + main content shell
│   └── AuthLayout.tsx            ← Existing auth layout
│
├── features/                     ← Feature modules (self-contained)
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardHero.tsx
│   │   │   ├── CompletionProgress.tsx
│   │   │   ├── SectionStatusCard.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   ├── schemas/
│   │   │   └── publication.schema.ts
│   │   └── index.ts
│   │
│   ├── profile/
│   │   ├── components/
│   │   │   ├── ProfileHero.tsx
│   │   │   ├── EditableCard.tsx        ← Reusable card with read/edit lifecycle
│   │   │   ├── IdentityCard.tsx
│   │   │   ├── BiographyCard.tsx
│   │   │   ├── ContactCard.tsx
│   │   │   ├── OfficeCard.tsx
│   │   │   ├── MapPlaceholder.tsx
│   │   │   ├── EducationTimeline.tsx   ← [Next]
│   │   │   ├── ExperienceTimeline.tsx  ← [Next]
│   │   │   ├── CertificationCard.tsx   ← [Next]
│   │   │   └── LanguagesCard.tsx
│   │   ├── hooks/
│   │   │   ├── useProfile.ts
│   │   │   ├── useUpdateIdentity.ts
│   │   │   ├── useUpdateContact.ts
│   │   │   └── useUpdateOffice.ts
│   │   └── index.ts
│   │
│   ├── expertise/
│   │   ├── components/
│   │   │   ├── ToggleCard.tsx          ← Reusable selection card
│   │   │   ├── SpecializationSelector.tsx
│   │   │   ├── PracticeAreaSelector.tsx
│   │   │   └── LanguageSelector.tsx
│   │   ├── hooks/
│   │   │   └── useExpertise.ts
│   │   └── index.ts
│   │
│   ├── offers/
│   │   ├── components/
│   │   │   ├── OfferCard.tsx
│   │   │   ├── OfferForm.tsx
│   │   │   └── OfferList.tsx
│   │   ├── hooks/
│   │   │   ├── useOffers.ts
│   │   │   └── useOfferMutation.ts
│   │   └── index.ts
│   │
│   └── public-preview/
│       ├── components/
│       │   ├── PublicHero.tsx
│       │   ├── PublicOfferCard.tsx
│       │   ├── PublicSectionCard.tsx
│       │   ├── PublicTimeline.tsx
│       │   └── PublicOfficeMap.tsx
│       ├── hooks/
│       │   └── usePublicProfile.ts
│       └── index.ts
│
├── components/                   ← Shared UI components (Design System)
│   ├── ui/                       ← shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── EditableCard.tsx          ← Reusable read/edit card wrapper
│   ├── ToggleCard.tsx            ← Reusable selection card
│   ├── Timeline.tsx              ← Reusable timeline component
│   ├── MapPlaceholder.tsx        ← Reusable map placeholder
│   ├── CompletionBadge.tsx       ← Reusable completion indicator
│   ├── StatusBanner.tsx          ← Reusable status banner
│   └── EmptyState.tsx            ← Reusable empty state
│
├── services/
│   ├── api.ts                    ← Fetch wrapper, base URL, auth headers
│   └── professional.api.ts       ← Professional Space API calls
│
├── hooks/
│   ├── useAuth.ts                ← Auth state (existing)
│   └── useReferential.ts         ← Reference data (cached)
│
├── lib/
│   ├── utils.ts                  ← cn() utility for Tailwind merge
│   └── query-client.ts           ← React Query client configuration
│
├── styles/
│   └── globals.css               ← Tailwind + Chaweer design tokens
│
└── types/
    └── index.ts                  ← Re-exports from packages/shared
```

**Why feature-based?** (P3, P5, P8)

Feature modules are self-contained: each has its own components, hooks, and schemas. This means:
- A developer working on the Offers page doesn't need to understand the Profile page
- Components are co-located with the feature that uses them
- Shared components live in `components/` and are imported across features
- Features can be split into separate chunks for code splitting

### 5.4 Component Hierarchy

Following P3 (Component-First Frontend), components are classified by reusability:

**Level 1 — Design System (shared across all features):**
- Button, Input, Textarea, Select, Badge, Card (shadcn/ui)
- EditableCard, ToggleCard, Timeline, MapPlaceholder, CompletionBadge, StatusBanner, EmptyState

**Level 2 — Feature Components (used within one feature):**
- ProfileHero, IdentityCard, BiographyCard, ContactCard, OfficeCard (Profile)
- DashboardHero, CompletionProgress, SectionStatusCard, QuickActions (Dashboard)
- OfferCard, OfferForm, OfferList (Offers)
- SpecializationSelector, PracticeAreaSelector, LanguageSelector (Expertise)

**Level 3 — Page Components (composed from Level 1 + 2):**
- DashboardPage = DashboardHero + CompletionProgress + SectionStatusCard[] + QuickActions
- ProfilePage = ProfileHero + EditableCard(Identity) + EditableCard(Biography) + EditableCard(Contact) + EditableCard(Office) + ...
- OffersPage = OfferList + OfferForm (modal)
- PublicPreviewPage = PublicHero + PublicOfferCard[] + PublicSectionCard[] + PublicOfficeMap

**Why this hierarchy?** (P3, P8)

Level 1 components are the Design System — they are the reusable building blocks. Level 2 components are feature-specific but still reusable within the feature. Level 3 is page composition — minimal logic, mostly layout.

### 5.5 State Management Strategy

| State Type | Tool | Examples |
|---|---|---|
| Server state | TanStack React Query 5 | Profile data, offers, expertise, referentials |
| Form state | React Hook Form 7 | Editable card forms, offer creation form |
| UI state (local) | React useState | Card edit/read mode, modal open/close, sidebar toggle |
| Global UI state | React Context (minimal) | Auth state, theme (if needed) |

**Why React Query for server state?** (P2, P8)

React Query handles caching, refetching, optimistic updates, and loading/error states. This eliminates the need for a global state manager like Redux for server data. The API is the source of truth — React Query keeps the frontend in sync with it (P2).

### 5.6 API Client

```typescript
// services/api.ts
const API_BASE = import.meta.env.VITE_API_URL;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',  // send cookies for refresh token
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message);
  }
  return json.data as T;
}
```

**Why a centralized API client?** (P2, P5)

All API calls go through one function. This ensures:
- Consistent error handling
- Automatic credential inclusion
- Single place to add interceptors (logging, retry, token refresh)
- Frontend never touches database structures — only API contracts (P2)

---

## 6. Shared Packages

### 6.1 `packages/shared`

This package is the **single source of truth** for API contracts between frontend and backend.

```
packages/shared/
├── package.json
├── src/
│   ├── contracts/
│   │   ├── professional.contract.ts    ← Request/response types for /professional/*
│   │   ├── public.contract.ts          ← Request/response types for /public/*
│   │   └── auth.contract.ts            ← Request/response types for /auth/*
│   ├── schemas/
│   │   ├── professional.schema.ts      ← Zod schemas (shared validation)
│   │   ├── public.schema.ts
│   │   └── auth.schema.ts
│   ├── enums/
│   │   ├── professional-status.enum.ts
│   │   ├── verification-status.enum.ts
│   │   ├── consultation-modality.enum.ts
│   │   └── verified-document-type.enum.ts
│   ├── constants/
│   │   ├── completion-rules.ts         ← Section completion definitions
│   │   └── publication-rules.ts        ← Publish pre-conditions
│   └── index.ts
└── tsconfig.json
```

**Why shared Zod schemas?** (P2, P5, P8)

Both frontend and backend import the same Zod schemas. This guarantees:
- Frontend form validation matches backend API validation exactly
- No drift between client and server validation rules
- A new developer reads one file to understand what an endpoint accepts

**Why not OpenAPI codegen?** (P8)

OpenAPI codegen adds tooling complexity (spec generation, code generation step, build pipeline). For a team of 1-3 developers, shared Zod schemas are simpler and equally effective. The codegen approach can be adopted later if the team grows or if a public API needs documentation.

### 6.2 `packages/config`

```
packages/config/
├── eslint.base.config.mjs
├── typescript.base.json
├── prettier.base.config.mjs
└── tailwind.base.config.ts
```

**Why shared config?** (P8)

All apps use the same ESLint rules, TypeScript strictness, and Prettier formatting. This ensures consistent code style across the monorepo.

### 6.3 `packages/ui` (Future)

Deferred until mobile app is built. Will contain shared React Native + React components if cross-platform UI sharing is needed.

### 6.4 Dependency Rules

```
apps/api     →  packages/shared
apps/web     →  packages/shared, packages/config
apps/mobile  →  packages/shared (future)

packages/shared  →  (nothing — leaf package)
packages/config  →  (nothing — leaf package)
packages/ui      →  packages/shared (future)
```

**Why strict rules?** (P5, P8)

`packages/shared` depends on nothing — it's a leaf package. This prevents circular dependencies (Blueprint risk R5). Apps depend on shared packages, never on each other.

---

## 7. Data Flow

### 7.1 Read Flow — Dashboard

```
User opens /pro
    │
    ▼
DashboardPage mounts
    │
    ▼
useDashboard() hook fires
    │
    ▼
React Query calls GET /professional/me
    │
    ▼
API client sends request with JWT cookie
    │
    ▼
Auth middleware verifies JWT, attaches req.user
    │
    ▼
Professional controller calls professional.service.getMyProfile(userId)
    │
    ▼
Service queries Prisma:
  - ProfessionalProfile (where userId = ?)
  - Include: contact, office, offers, specializations, practiceAreas, languages
    │
    ▼
Service computes completion booleans
    │
    ▼
Controller formats response: { success: true, data: { ...profile, completion } }
    │
    ▼
React Query caches response
    │
    ▼
DashboardPage renders:
  - StatusBanner (from profile.status)
  - CompletionProgress (from completion booleans)
  - SectionStatusCard[] (from completion booleans)
  - QuickActions (static links)
```

### 7.2 Write Flow — Update Office

```
User clicks "Edit" on Office card
    │
    ▼
EditableCard switches to edit mode (local UI state)
    │
    ▼
User fills form, clicks "Save"
    │
    ▼
React Hook Form validates with shared Zod schema
    │
    ▼
useUpdateOffice() hook fires
    │
    ▼
React Query mutation calls PATCH /professional/office
    │
    ▼
API client sends request with JWT + JSON body
    │
    ▼
Auth middleware verifies JWT
    │
    ▼
Office controller:
  1. Extracts userId from req.user
  2. Validates body with shared Zod schema
  3. Calls office.service.updateOffice(profileId, body)
    │
    ▼
Office service:
  1. Verifies profile ownership
  2. Upserts Office record (create if not exists, update if exists)
  3. Returns updated office
    │
    ▼
Controller formats response: { success: true, data: { office } }
    │
    ▼
React Query invalidates /professional/me cache
    │
    ▼
Dashboard and Profile components refetch automatically
    │
    ▼
EditableCard switches back to read mode with new data
```

### 7.3 Public Read Flow — Public Profile

```
Anonymous user visits /professionals/:id
    │
    ▼
PublicProfilePage mounts
    │
    ▼
usePublicProfile(id) hook fires
    │
    ▼
React Query calls GET /professionals/:id
    │
    ▼
No auth middleware — public route
    │
    ▼
Public controller calls public.service.getPublicProfile(id)
    │
    ▼
Public service queries Prisma:
  - ProfessionalProfile (where id = ? AND status = PUBLISHED)
  - Include: identity fields, office, offers (active only), expertise
  - EXCLUDE: contact phone, verification details, userId
    │
    ▼
If not found or not published → 404
    │
    ▼
Controller formats public response shape
    │
    ▼
React Query caches response
    │
    ▼
PublicProfilePage renders:
  - PublicHero (name, title, bar association, city)
  - PublicOfferCard[] (active offers only)
  - PublicSectionCard[] (about, expertise, office+map, education, experience, certifications, languages)
```

---

## 8. Security Considerations

### 8.1 Authentication

| Mechanism | Usage |
|---|---|
| JWT Access Token | 15-minute expiry, sent in `Authorization: Bearer` header |
| Refresh Token | 30-day expiry, stored in HTTP-only cookie, rotated on use |
| Google OAuth | Dominant auth method, exchange Google ID token for Chaweer tokens |

**Why HTTP-only cookie for refresh token?** (P8)

JavaScript cannot access HTTP-only cookies, preventing XSS attacks from stealing refresh tokens. The access token is short-lived (15 min) to minimize the window of exposure if intercepted.

### 8.2 Authorization Rules

| Endpoint Pattern | Auth Required | Authorization |
|---|---|---|
| `/auth/*` | No (except refresh, logout) | — |
| `/professional/*` | Yes (JWT) | User must have `role = PROFESSIONAL` and own the profile |
| `/professionals/:id` | No | Profile must be `status = PUBLISHED` |
| `/admin/*` (future) | Yes (JWT) | User must have `role = ADMIN` |

**Why check ownership in the service, not just the controller?** (P5, P8)

Defense in depth. The controller extracts `userId` from the JWT, resolves it to a `profileId`, and passes it to the service. The service verifies that the entity being modified belongs to this `profileId`. This prevents IDOR (Insecure Direct Object Reference) attacks even if a controller bug passes the wrong ID.

### 8.3 Input Validation

All input is validated using Zod schemas at the controller level **before** reaching the service:

```typescript
// In controller
const parsed = updateOfficeSchema.parse(req.body);  // throws ZodError if invalid
const result = await officeService.updateOffice(profileId, parsed);
```

**Why validate in controller, not middleware?** (P5, P8)

Each endpoint has different validation rules. A generic validation middleware would need to know which schema to apply — this creates coupling. By validating in the controller, the schema is co-located with the route definition.

### 8.4 Rate Limiting

| Route | Limit | Window |
|---|---|---|
| `/auth/login` | 10 requests | 15 minutes |
| `/auth/register` | 5 requests | 15 minutes |
| `/auth/google` | 10 requests | 15 minutes |
| `/professional/*` | 100 requests | 15 minutes |
| `/professionals/:id` | 60 requests | 1 minute |

**Why different limits?** (P8)

Auth routes are sensitive to brute-force attacks. Professional routes are used by a single user with predictable patterns. Public routes are accessed by many users and need higher limits.

### 8.5 CORS

Only configured origins are allowed:

```
CORS_ORIGINS=http://localhost:5173,https://chaweer.ma,https://www.chaweer.ma
```

Credentials are included (`credentials: true`) for cookie-based refresh token.

### 8.6 Data Exposure Prevention

The public module returns a **filtered response shape** that excludes:

- `userId` — never exposed publicly
- `contact.phone` — only shown on the professional's own profile, not public
- `verification` details — only a boolean "verified" badge is shown
- `status` — internal field, not relevant to public viewers
- `completion` — internal to the professional

**Why filter at the service level?** (P5, P8)

The public service constructs a different Prisma query that only selects public fields. Even if a bug in the controller passes through extra data, the service never queries it.

---

## 9. Deployment Topology

### 9.1 Development

```
docker-compose up
    │
    ├── chaweer-postgres (port 5432)
    ├── chaweer-api (port 3000)
    │   ├── hot reload via tsx watch
    │   └── Prisma migrations on startup
    └── chaweer-web (port 5173)
        └── Vite dev server with HMR
```

### 9.2 Production (Target)

```
┌─────────────────────────────────────────┐
│              CDN / Reverse Proxy         │
│           (nginx / Cloudflare)           │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌──────────┐    ┌──────────────┐
│ Web App  │    │   API Server  │
│ (static  │    │  (Node.js 22) │
│  build)  │    │   Express 5   │
│ Vite     │    │               │
└──────────┘    └──────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │  PostgreSQL 17  │
              │  (managed or    │
              │   self-hosted)  │
              └────────────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
      ┌────────────┐   ┌──────────────┐
      │ File Store  │   │ External APIs │
      │ (S3 / local)│   │ (Google Maps, │
      │             │   │  OAuth, etc.) │
      └────────────┘   └──────────────┘
```

### 9.3 Environment Variables

| Variable | Purpose | New? |
|---|---|---|
| `PORT` | API server port | Existing |
| `DATABASE_URL` | PostgreSQL connection string | Existing |
| `JWT_SECRET` | JWT signing secret | Existing |
| `GOOGLE_CLIENT_ID` | Google OAuth | Existing |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | Existing |
| `CORS_ORIGINS` | Allowed CORS origins | Existing |
| `VITE_API_URL` | API base URL for frontend | Existing |
| `GOOGLE_MAPS_API_KEY` | Google Maps embed (Next phase) | New |
| `UPLOAD_DIR` | File upload directory | New |
| `UPLOAD_MAX_SIZE` | Max upload size in bytes | New |

---

## 10. Design Principles Applied

| Principle | How It's Applied |
|---|---|
| **P1 — DDD** | Single Professional aggregate root. All child entities accessed through it. Sub-modules within the professional module maintain the aggregate boundary. |
| **P2 — API-First** | Shared Zod schemas in `packages/shared` define the contract. Frontend never imports Prisma types — only API contract types. |
| **P3 — Component-First** | Three-level component hierarchy. Level 1 (Design System) components are reusable across all features. Pages are compositions, not implementations. |
| **P4 — Incremental Migration** | No destructive schema changes. New tables added alongside existing ones. Old columns kept during transition. Three-phase migration (A/B/C). |
| **P5 — Separation of Responsibilities** | Four-layer backend (routes → controller → service → Prisma). Three-layer frontend (components → hooks → API client). No business logic in controllers or components. |
| **P6 — Future Extensibility** | Module structure supports adding messaging, reviews, payments without redesign. File storage abstracted for S3 migration. Reference data separate from aggregate. |
| **P7 — Backward Compatibility** | Evolved response shape is additive (new fields nullable). Old endpoints preserved during transition. Public module separated to prevent data leaks. |
| **P8 — Documentation Quality** | Every section explains *why*, not just *what*. Code structure is understandable by a new developer. Error codes and response format are documented. |

---

## 11. Future Extensibility

### 11.1 How Future Modules Fit

| Future Module | Where It Lives | Impact on Existing Architecture |
|---|---|---|
| **Messaging** | New `messaging` module in API, new `/messages` feature in web | None — new module, new routes, new tables |
| **Reviews** | New `reviews` module in API, extends `public` module for display | None — reads from Professional aggregate, writes to Review aggregate |
| **Payments** | New `payments` module in API, integrates with Offers and Appointments | None — new module, references ProfessionalProfile via FK |
| **Articles** | New `articles` module in API, new `/articles` feature in web | None — new module, new routes, new tables |
| **Statistics** | Read model computed from events, new `statistics` module | None — reads from database, no writes to aggregate |
| **AI Features** | New `ai` module in API, separate from business logic | None — calls external AI APIs, returns results to frontend |
| **Admin** | New `admin` module in API, extends `public` for directory | None — separate authorization, separate routes |

**Why will these require no redesign?** (P6, P8)

The architecture is modular: each new module is a self-contained folder in `apps/api/src/modules/` and `apps/web/src/features/`. Modules communicate through well-defined service interfaces, not through shared database tables. The Professional aggregate is never modified by external modules — they reference it by ID and read from the public API.

### 11.2 Multi-Profession Support (Future)

The domain model uses the generic term "Professional" rather than "Lawyer". When new professions are added (notaries, accountants, etc.):

1. Add a `Profession` enum or reference entity
2. Add `professionId` to `ProfessionalProfile`
3. Profession-specific fields go in a new 1:1 entity (e.g., `LawyerDetails`, `NotaryDetails`)
4. The aggregate root and all existing child entities remain unchanged

**Why this works** (P6, P8)

The aggregate root is profession-agnostic. Specialization, PracticeArea, and BarAssociation reference data can be scoped by profession. The UI can conditionally render profession-specific sections. No existing code needs to change.

---

## 12. References

| Document | Path |
|---|---|
| Technical Design Blueprint | `docs/04-technique/00-technical-design-blueprint.md` |
| UX Master Index | `docs/ux/00-index.md` |
| UX Domain Model | `docs/ux/01-domain-model.md` |
| UX Information Architecture | `docs/ux/02-information-architecture.md` |
| UX Component Inventory | `docs/ux/05-component-inventory.md` |
| Current Prisma Schema | `apps/api/prisma/schema.prisma` |
| Current API Entry | `apps/api/src/app.ts` |
| AI Playbook | `AI-PLAYBOOK.md` |
