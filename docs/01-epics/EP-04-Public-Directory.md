# EP-04 — Public Directory

> **Status:** Planned  
> **Sprint:** Sprint 05  
> **Last updated:** 2026-07-19

---

## Business Objective

Enable citizens to discover verified lawyers through a searchable, filterable, and sortable public directory.

## Scope

- Directory search (by name, specialization, location)
- Filters (specialization, language, availability)
- Sorting (rating, experience, price)
- Lawyer card component (reusable directory listing)
- Pagination / infinite scroll
- Map view (future)
- Saved / favorite lawyers (nice-to-have)

## Business Rules

- **Verified lawyers only**: only lawyers who passed admin verification (US-034) appear in the directory
- **Search**: by name, specialization, or location — full-text search
- **Filters**: combinable (specialization AND language AND availability)
- **Sorting**: default by relevance; alternatives by rating, experience, price
- **Pagination**: infinite scroll on mobile, pagination on desktop
- **No unverified profiles**: directory never shows pending or rejected lawyers

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-035 | Directory Search (name, specialization, location) | High | MVP | Planned | Sprint 05 | EP-03, EP-05 |
| US-036 | Directory Filters (specialization, language, availability) | High | MVP | Planned | Sprint 05 | US-035 |
| US-037 | Directory Sorting (rating, experience, price) | Medium | MVP | Planned | Sprint 05 | US-035 |
| US-038 | Lawyer Card Component (directory listing) | High | MVP | Planned | Sprint 05 | US-035 |
| US-039 | Directory Pagination / Infinite Scroll | Medium | MVP | Planned | Sprint 05 | US-035 |
| US-040 | Directory Map View | Low | Future | Draft | Future | US-035 |
| US-041 | Saved / Favorite Lawyers | Low | Nice-to-have | Draft | Future | US-035 |

## Dependencies

- EP-03 Professional Onboarding (verified lawyers must exist)
- EP-05 Professional Profile (lawyer profiles must be populated)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 05 (US-035→039) | Planned |
| Future (US-040→041) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
