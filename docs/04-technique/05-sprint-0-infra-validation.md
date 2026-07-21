# 05 — Sprint 0: Infrastructure Validation

> **Phase:** 4 — Pre-Implementation
> **Status:** Draft — awaiting validation
> **Date:** 2026-07-21
> **Prerequisite:** Implementation Plan approved
>
> **Objective:** Verify that the complete development environment is stable before any business feature is implemented. No business functionality in Sprint 0.

---

## Table of Contents

1. [Sprint 0 Overview](#1-sprint-0-overview)
2. [Validation Checklist](#2-validation-checklist)
3. [Definition of Done](#3-definition-of-done)
4. [Code Review Checklist](#4-code-review-checklist)
5. [Sprint 0 Tasks](#5-sprint-0-tasks)
6. [Sprint 0 Acceptance Criteria](#6-sprint-0-acceptance-criteria)

---

## 1. Sprint 0 Overview

### 1.1 Purpose

Sprint 0 validates that every tool, framework, and infrastructure component in the stack is operational and correctly configured. This eliminates environment-related surprises during feature implementation.

### 1.2 Scope

| In Scope | Out of Scope |
|---|---|
| Docker containers start and are healthy | Any business logic |
| Database accepts connections and migrations | Any API endpoint for business features |
| Prisma generates client and runs migrations | Any frontend page or component |
| Seed data loads correctly | Any shared Zod schema or contract type |
| API server starts and responds to `/health` | Any feature from the Implementation Plan |
| Frontend dev server starts and renders | Database schema evolution (F-02) |
| `packages/shared` resolves as a workspace dependency | |
| React Query provider wraps the app | |
| Tailwind CSS compiles with Chaweer design tokens | |
| shadcn/ui components render | |
| CI pipeline runs lint, type-check, and tests | |
| Testing framework runs and reports correctly | |

### 1.3 Duration

**Estimated: 2–3 days**

Sprint 0 is short by design. If any item fails, it must be fixed before proceeding to F-01.

---

## 2. Validation Checklist

Each item must be verified and checked off before Sprint 0 is considered complete.

### 2.1 Docker & Database

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 1 | Docker is running | `docker info` | No error |
| 2 | PostgreSQL container starts | `docker compose up -d chaweer-postgres` | Container is healthy |
| 3 | PostgreSQL accepts connections | `docker compose exec chaweer-postgres pg_isready -U postgres` | "accepting connections" |
| 4 | Database `chaweer` exists | `docker compose exec chaweer-postgres psql -U postgres -d chaweer -c '\l'` | `chaweer` listed |
| 5 | Database `chaweer_test` exists | `docker compose exec chaweer-postgres psql -U postgres -c '\l'` | `chaweer_test` listed |

### 2.2 Prisma

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 6 | Prisma CLI is installed | `cd apps/api && npx prisma --version` | Version printed |
| 7 | Prisma schema is valid | `cd apps/api && npx prisma validate` | "The schema is valid" |
| 8 | Prisma client generates | `cd apps/api && npx prisma generate` | No errors |
| 9 | Migrations run | `cd apps/api && npx prisma migrate dev` | Migration applied |
| 10 | Prisma Studio connects | `cd apps/api && npx prisma studio` | Studio opens in browser |
| 11 | Seed script runs | `cd apps/api && npm run prisma:seed` | Seed data inserted |

### 2.3 API Server

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 12 | API server starts | `cd apps/api && npm run dev` | "Server listening on port 3000" |
| 13 | Health endpoint responds | `curl http://localhost:3000/health` | `{"success":true,"data":{"status":"ok"}}` |
| 14 | CORS headers present | `curl -I -H "Origin: http://localhost:5173" http://localhost:3000/health` | `access-control-allow-origin` header |
| 15 | 404 handler works | `curl http://localhost:3000/nonexistent` | `{"success":false,"error":{"code":"NOT_FOUND",...}}` |
| 16 | Auth routes are mounted | `curl http://localhost:3000/auth/me` | 401 response (not 404) |
| 17 | Professional routes are mounted | `curl http://localhost:3000/professional/me` | 401 response (not 404) |

### 2.4 Frontend

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 18 | Vite dev server starts | `cd apps/web && npm run dev` | "Local: http://localhost:5173/" |
| 19 | Page renders in browser | Open `http://localhost:5173` | No blank page, no console errors |
| 20 | Tailwind CSS compiles | Check browser DevTools → Styles | Tailwind classes applied |
| 21 | shadcn/ui Button renders | Add `<Button>Test</Button>` to any page | Button renders with styles |
| 22 | React Router works | Navigate between existing routes | Routes render without errors |
| 23 | No console warnings | Check browser DevTools console | Clean console (no React warnings) |

### 2.5 Shared Package

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 24 | `packages/shared` package exists | `ls packages/shared/package.json` | File exists |
| 25 | Workspace resolution works (API) | `cd apps/api && node -e "require('@chaweer/shared')"` | No error (or import resolves) |
| 26 | Workspace resolution works (web) | `cd apps/web && node -e "import('@chaweer/shared')"` | No error (or import resolves) |

> **Note:** Items 25–26 may require creating a minimal `packages/shared` with a single export (e.g., a constant). This is infrastructure, not business logic.

### 2.6 React Query

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 27 | QueryClient is configured | Check `apps/web/src/main.tsx` | `QueryClientProvider` wraps `<App />` |
| 28 | QueryClient has sensible defaults | Check QueryClient config | `staleTime`, `retry` configured |
| 29 | A test query works | Add `useQuery` with `/health` endpoint | Data renders, no errors |

### 2.7 Tailwind & Design Tokens

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 30 | Tailwind 4 is configured | Check `apps/web/vite.config.ts` | `@tailwindcss/vite` plugin present |
| 31 | Chaweer primary color works | `<div class="bg-primary">Test</div>` | Teal (#0F766E) background |
| 32 | Typography font loads | Check browser DevTools → Network | Plus Jakarta Sans loaded from Google Fonts |
| 33 | Spacing tokens work | `<div class="p-lg">Test</div>` | 16px padding applied |

### 2.8 Testing Framework

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 34 | API tests run | `cd apps/api && npm test` | Vitest runs, all existing tests pass |
| 35 | Web tests run | `cd apps/web && npm test` | Vitest runs, all existing tests pass |
| 36 | Test coverage reports | `cd apps/api && npm test -- --coverage` | Coverage report generated |

### 2.9 CI Pipeline

| # | Item | Verification Command | Expected Result |
|---|---|---|---|
| 37 | Lint passes (API) | `cd apps/api && npm run lint` | No errors |
| 38 | Lint passes (web) | `cd apps/web && npm run lint` | No errors |
| 39 | TypeScript passes (API) | `cd apps/api && npx tsc --noEmit` | No errors |
| 40 | TypeScript passes (web) | `cd apps/web && npx tsc --noEmit` | No errors |
| 41 | Build passes (API) | `cd apps/api && npm run build` | `dist/` generated |
| 42 | Build passes (web) | `cd apps/web && npm run build` | `dist/` generated |
| 43 | Format check passes | `npx prettier --check .` | No formatting errors |

---

## 3. Definition of Done

Every Pull Request must satisfy **all** of the following criteria before merging.

### 3.1 Build & Type Safety

| Criterion | Verification |
|---|---|
| Build passes | `npm run build` succeeds in both `apps/api` and `apps/web` |
| TypeScript passes | `npx tsc --noEmit` succeeds with zero errors |
| No `any` types added | No new `any` types without explicit justification in PR description |

### 3.2 Code Quality

| Criterion | Verification |
|---|---|
| Lint passes | `npm run lint` succeeds with zero errors in affected packages |
| Format passes | `npx prettier --check <changed-files>` succeeds |
| No console warnings or errors | Browser DevTools console is clean; Node.js startup has no warnings |
| No dead code | No unused imports, variables, or functions |

### 3.3 Tests

| Criterion | Verification |
|---|---|
| Tests pass | `npm test` succeeds in all affected packages |
| New tests added | New features include unit and/or integration tests |
| No tests deleted or weakened | Existing tests are preserved or strengthened, never removed without explicit justification |
| Test coverage maintained | Coverage does not decrease for affected files |

### 3.4 Documentation

| Criterion | Verification |
|---|---|
| Documentation updated | If the PR changes API contracts, schemas, or architecture, the relevant doc is updated |
| PR description is clear | PR description explains what, why, and how to test |
| No stale comments | Code comments are accurate and relevant |

### 3.5 Compliance

| Criterion | Verification |
|---|---|
| UX remains compliant | UI changes match the validated wireframes and Chaweer design system |
| API remains compliant | API changes match the API Contract Specification |
| No unintended regressions | All existing tests pass; manual smoke test of affected flows |
| Principles respected | P1–P8 from the Technical Design Blueprint are respected |

---

## 4. Code Review Checklist

Every PR must include a completed Code Review Checklist in the PR description. Reviewers confirm each item.

### 4.1 Architectural Compliance

- [ ] **Layer separation maintained** — No business logic in controllers or React components
- [ ] **Module boundaries respected** — No cross-module imports that violate the dependency rules
- [ ] **Aggregate root integrity** — All child entity mutations go through the Professional aggregate
- [ ] **No circular dependencies** — `packages/shared` imports nothing from `apps/*`

### 4.2 Component Reuse

- [ ] **Reusable components used** — No page-specific implementation where a reusable component exists
- [ ] **Design System tokens used** — No hardcoded colors, spacing, or typography; use Chaweer design tokens
- [ ] **shadcn/ui primitives used** — No custom implementation of Button, Input, Select, etc.

### 4.3 Business Logic Separation

- [ ] **Services contain business logic** — Controllers are thin; components are pure presentation
- [ ] **Hooks encapsulate data logic** — Components call hooks, not APIs directly
- [ ] **No inline business rules** — Publication pre-conditions, completion rules, and state machines are in services

### 4.4 Validation

- [ ] **Zod schemas from `@chaweer/shared`** — No duplicated validation logic between frontend and backend
- [ ] **Input validated before reaching service** — Controller validates with Zod before calling service
- [ ] **Error responses match API Contract** — Error codes, HTTP status, and response format are correct

### 4.5 Responsiveness

- [ ] **Desktop layout verified** — Works at ≥1024px
- [ ] **Tablet layout verified** — Works at 768–1023px
- [ ] **Mobile layout verified** — Works at <768px
- [ ] **No horizontal scroll** — No overflow on any breakpoint

### 4.6 Accessibility

- [ ] **Keyboard navigation works** — All interactive elements reachable via Tab key
- [ ] **ARIA labels present** — Icon-only buttons have `aria-label`
- [ ] **Form labels associated** — Every input has a `<label>` or `aria-label`
- [ ] **Color contrast sufficient** — Text meets WCAG AA contrast ratio (4.5:1 for normal text)
- [ ] **Focus visible** — Focus rings are visible on all interactive elements

### 4.7 Security

- [ ] **Auth middleware applied** — Protected routes have `authenticate` + `authorize`
- [ ] **Ownership enforced** — Service verifies resource belongs to authenticated user
- [ ] **No private data in public responses** — Public API excludes sensitive fields
- [ ] **No secrets in code** — No API keys, passwords, or tokens hardcoded

### 4.8 Performance

- [ ] **No N+1 queries** — Prisma includes used for nested relations
- [ ] **React Query caching used** — No unnecessary refetches; `staleTime` configured
- [ ] **No large bundles** — No heavy dependencies added without justification

---

## 5. Sprint 0 Tasks

### 5.1 Task List

| Task | Description | Estimated Time |
|---|---|---|
| S0-1 | Verify Docker and PostgreSQL container | 30 min |
| S0-2 | Verify Prisma: validate, generate, migrate, seed | 1 hour |
| S0-3 | Verify API server startup and health endpoint | 30 min |
| S0-4 | Verify frontend dev server startup | 30 min |
| S0-5 | Create minimal `packages/shared` (single constant export) and verify workspace resolution | 1 hour |
| S0-6 | Configure React Query provider in `main.tsx` | 30 min |
| S0-7 | Configure Tailwind with Chaweer design tokens | 1 hour |
| S0-8 | Verify shadcn/ui Button renders | 30 min |
| S0-9 | Run existing test suites and verify they pass | 30 min |
| S0-10 | Run lint, type-check, and build for both apps | 30 min |
| S0-11 | Document any environment issues found and fixes applied | 30 min |
| S0-12 | Create Sprint 0 validation report (checklist with all items checked) | 30 min |

**Total estimated time: ~7 hours (1 day)**

### 5.2 Deliverables

| Deliverable | Format |
|---|---|
| Sprint 0 Validation Report | All 43 checklist items verified with pass/fail status |
| `packages/shared` minimal package | Package with single export, workspace resolution verified |
| React Query provider | `QueryClientProvider` wrapping app in `main.tsx` |
| Tailwind design tokens | Chaweer colors, typography, spacing configured |
| Environment issues log | Any issues found and how they were resolved |

### 5.3 What NOT to Do in Sprint 0

- Do not create any Zod schemas for business entities
- Do not create any API endpoints
- Do not create any React components for business features
- Do not modify the Prisma schema
- Do not create any migrations
- Do not implement any user stories

---

## 6. Sprint 0 Acceptance Criteria

Sprint 0 is considered complete when:

1. **All 43 validation checklist items pass** — every item is verified and checked off
2. **`packages/shared` resolves** — both `apps/api` and `apps/web` can import from `@chaweer/shared`
3. **React Query is configured** — `QueryClientProvider` wraps the app with sensible defaults
4. **Tailwind + Chaweer tokens work** — `bg-primary` renders teal, Plus Jakarta Sans loads
5. **shadcn/ui renders** — at least one shadcn/ui component renders correctly
6. **All existing tests pass** — no regressions from Sprint 0 setup
7. **Lint, type-check, and build pass** — for both `apps/api` and `apps/web`
8. **Sprint 0 Validation Report is documented** — all items verified, issues logged

Once Sprint 0 is validated, implementation begins with **Feature F-01 — Shared Package Foundation** exactly as defined in the Implementation Plan.

---

## References

| Document | Path |
|---|---|
| Implementation Plan | `docs/04-technique/04-implementation-plan.md` |
| Technical Design Blueprint | `docs/04-technique/00-technical-design-blueprint.md` |
| Architecture Document | `docs/04-technique/01-architecture.md` |
| API Contract Specification | `docs/04-technique/03-api-contract.md` |
| Prisma Schema Evolution | `docs/04-technique/02-prisma-evolution.md` |
