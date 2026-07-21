# 00 — Professional Space UX Redesign: Single Source of Truth

> This document is the master index for the Professional Space Phase 2 redesign. It is the single source of truth for designers and developers. Once validated, no re-interpretation of requirements should be necessary to implement the feature.

---

## Executive Summary

The Professional Space is redesigned from a linear wizard into a modular, section-based dashboard experience. The professional builds their identity through independent cards, guided by a cockpit-style Dashboard. Publishing is an action on the Dashboard, not a separate page. A first-class Public Preview page lets professionals see their profile exactly as clients do. The domain model evolves alongside the UX: new entities (Education, Experience, Certifications, Memberships, Office, Contact, multiple Offers) are introduced with a clean aggregate boundary, a migration strategy, and a versioning system (MVP / Next / Future).

---

## Table of Contents

| # | Document | Purpose |
|---|---|---|
| 00 | **This document** | Master index, glossary, how to use |
| 01 | [Domain Model & Boundaries](01-domain-model.md) | Aggregates, entities, ownership, ERD, Prisma schema, API evolution, migration strategy, roadmap |
| 02 | [Information Architecture](02-information-architecture.md) | Navigation hierarchy, data ownership map, screen inventory, navigation map (Mermaid) |
| 03 | [User Flows](03-user-flows.md) | 9 complete user flows with MVP/Next/Future tagging |
| 04 | [Screen Layout Descriptions](04-screen-layouts.md) | Detailed layout for every screen: sections, cards, actions, states, responsive |
| 05 | [Component Inventory & Specification](05-component-inventory.md) | All reusable components classified by level, with states, variants, usage |
| 06 | [Design Principles](06-design-principles.md) | Justification for every UX decision, inspiration mapping, accessibility |
| — | [HTML/CSS Wireframe Prototype](wireframes/) | Clickable grayscale prototype — 7 screens, working navigation, responsive |

---

## How to Use This Document

### For Designers

1. Read **06 — Design Principles** first to understand the "why" behind every decision.
2. Read **04 — Screen Layouts** to understand what goes on each page.
3. Read **05 — Component Inventory** to understand the component library.
4. Open the **HTML/CSS Wireframe Prototype** (`wireframes/index.html` in a browser) to experience the navigation and layout.
5. Use the wireframes as the structural baseline for high-fidelity mockups. Do not change the information architecture or component structure — only elevate the visual design.

### For Developers

1. Read **01 — Domain Model** first to understand the data model, Prisma schema, and API evolution.
2. Read **02 — Information Architecture** to understand routes, navigation, and screen inventory.
3. Read **03 — User Flows** to understand the user journeys and edge cases.
4. Read **04 — Screen Layouts** to understand what to build on each page.
5. Read **05 — Component Inventory** to understand the component API.
6. Use the **HTML/CSS Wireframe Prototype** as a reference for layout, spacing, and responsive behavior.
7. Follow the **Implementation Roadmap** in `01-domain-model.md` (Sprint 1 = MVP, Sprint 2 = Next, Sprint 3+ = Future).

### For Product Managers

1. Read **00 — This document** for the executive summary.
2. Read **02 — Information Architecture** for the navigation map and screen inventory.
3. Read **03 — User Flows** for the user journeys.
4. Use the **MVP / Next / Future** tagging to prioritize the backlog.

---

## Glossary

| Term | Definition |
|---|---|
| **Aggregate Root** | The Professional entity — the entry point for all mutations. All child entities are accessed through it. |
| **Card** | An independent UI container with a view → edit → save lifecycle. The atomic unit of the Profile page. |
| **Cockpit** | The Dashboard metaphor — a command center that shows status, completion, and actions at a glance. |
| **Completion** | A computed percentage representing how many profile sections are filled. |
| **EditableCard** | A card that can switch between read mode and edit mode inline. |
| **Hero** | The prominent header section at the top of the Profile page showing photo, name, title, and completion. |
| **MVP** | Features implemented in the current redesign phase (Sprint 1). |
| **Next** | Features designed now, implemented in Sprint 2. Schema is ready, API and UI may be minimal. |
| **Future** | Features designed at the domain level, implemented in Sprint 3+. No UI or API yet. |
| **Publication** | The act of making a profile visible to clients. An action on the Dashboard, not a page. |
| **Public Preview** | A read-only page showing the profile exactly as clients see it. Quality-control tool. |
| **Section** | A logical grouping of related data (Identity, Expertise, Offers, etc.). Maps to one or more cards. |
| **Timeline** | A vertical list with dot markers and connecting lines, used for Education and Experience. |
| **ToggleCard** | A selectable card used for specializations and consultation modalities. |

---

## Versioning Legend

Every feature, entity, field, and screen in this specification is tagged:

| Tag | Schema | API | UI | Description |
|---|---|---|---|---|
| **[MVP]** | ✅ Created | ✅ Implemented | ✅ Built | Live in Sprint 1 |
| **[Next]** | ✅ Created | ⚠️ Minimal or deferred | ⚠️ Built or placeholder | Sprint 2 |
| **[Future]** | ⚠️ May or may not exist | ❌ Not implemented | ❌ Not built, UX slot designed | Sprint 3+ |

---

## Navigation Summary

```
Sidebar
├── Tableau de bord          → /pro
├── Profil professionnel     → /pro/profil
├── Expertise                → /pro/expertise
├── Offres de consultation   → /pro/offres
├── Disponibilités           → /pro/disponibilites    [Future]
└── Paramètres du compte     → /pro/compte            [Future]

No "Publication" item.
Public Preview: /pro/aperçu (accessible from Dashboard, Profile Hero, Quick Actions)
```

---

## Screen Summary

| Screen | Route | Version | Status |
|---|---|---|---|
| Registration | /inscription/professionnel | MVP | Existing (minor refresh) |
| Dashboard | /pro | MVP | New |
| Professional Profile | /pro/profil | MVP (core) + Next (timelines) | New |
| Expertise | /pro/expertise | MVP | Redesigned |
| Consultation Offers | /pro/offres | MVP | Redesigned (1:N) |
| Public Preview | /pro/aperçu | MVP (core) + Next (timelines) | New |
| Availability | /pro/disponibilites | Future | Placeholder |
| Account Settings | /pro/compte | Future | Placeholder |

---

## Domain Model Summary

```
Professional (Aggregate Root)
├── Identity          [MVP]
├── Biography         [MVP]
├── ProfessionalContact [MVP]
├── Office            [MVP]
├── Education[]       [Next]
├── Experience[]      [Next]
├── Certification[]   [Next]
├── Membership[]      [Next]
├── Expertise         [MVP]
├── ConsultationOffer[] [MVP — 1:N]
├── Availability      [Future]
├── Verification      [Next]
├── Publication       [MVP]
└── Statistics        [Future]
```

---

## File Structure

```
docs/ux/
├── 00-index.md                    ← You are here
├── 01-domain-model.md             ← Domain boundaries, ERD, Prisma, API, migration
├── 02-information-architecture.md ← Navigation, screen inventory, nav map
├── 03-user-flows.md               ← 9 user flows
├── 04-screen-layouts.md           ← Detailed screen specifications
├── 05-component-inventory.md      ← Component library specification
├── 06-design-principles.md        ← UX rationale and inspiration mapping
└── wireframes/                    ← HTML/CSS clickable prototype
    ├── index.html                 ← Redirects to dashboard.html
    ├── dashboard.html
    ├── profile.html
    ├── expertise.html
    ├── offers.html
    ├── public-preview.html
    ├── availability.html
    ├── account-settings.html
    ├── css/
    │   ├── reset.css
    │   ├── layout.css
    │   ├── components.css
    │   └── responsive.css
    └── js/
        └── app.js
```

---

## Next Steps

1. **Validate this specification** — Review all documents and the HTML prototype.
2. **High-fidelity UI mockups** — A designer creates visual mockups based on these wireframes.
3. **Implementation** — Developers implement the feature following the roadmap:
   - Sprint 1: MVP (schema migration, core entities, Dashboard, Profile, Expertise, Offers, Preview)
   - Sprint 2: Next (Education, Experience, Certifications, Memberships, Verification, extended Contact/Office)
   - Sprint 3+: Future (Availability, Awards, Statistics, Reviews, Articles, Video)
