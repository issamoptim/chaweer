# EP-11 — Administration

> **Status:** Planned  
> **Sprint:** Sprint 03 (partial) → Sprint 10 (full)  
> **Last updated:** 2026-07-19

---

## Business Objective

Provide administrators with tools to verify professionals, manage users, moderate content, handle disputes, and oversee platform operations.

## Scope

- Professional verification management (MVP — gate for platform trust)
- Admin dashboard with overview metrics (post-MVP)
- User management (post-MVP)
- Content moderation (post-MVP)
- Analytics & reporting (future)
- Dispute management (post-MVP)
- System configuration (future)

## Business Rules

- **Verification gate**: admins must review and approve/reject lawyer applications before they appear in the directory (Decision D-006)
- **Rejection feedback**: admins must provide a reason when rejecting an application
- **User management**: admins can suspend or ban users who violate terms
- **Content moderation**: admins can remove inappropriate reviews, Q&A, or profiles
- **Dispute handling**: admins mediate appointment/payment disputes
- **Audit trail**: all admin actions are logged

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-082 | Professional Verification Management | High | MVP | Planned | Sprint 03 | US-029, US-030 |
| US-083 | Admin Dashboard (overview metrics) | Medium | Post-MVP | Draft | Sprint 10 | EP-11 |
| US-084 | User Management | Medium | Post-MVP | Draft | Sprint 10 | EP-11 |
| US-085 | Content Moderation | Low | Post-MVP | Draft | Sprint 10 | EP-08, EP-09 |
| US-086 | Analytics & Reporting | Low | Future | Draft | Future | EP-11 |
| US-087 | Dispute Management | Medium | Post-MVP | Draft | Sprint 10 | EP-06, EP-07 |
| US-088 | System Configuration | Low | Future | Draft | Future | EP-11 |

## Dependencies

- EP-03 Professional Onboarding (verification submissions)
- EP-08 Reviews & Ratings (content to moderate)
- EP-09 Questions & Answers (content to moderate)
- EP-06 Appointment Booking (disputes)
- EP-07 Payments (disputes)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 03 (US-082) | Planned |
| Sprint 10 (US-083→085, US-087) | Draft |
| Future (US-086, US-088) | Draft |

## Related Documents

- [`Sprint-03.md`](../02-sprints/Sprint-03.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Decisions.md`](../00-product/Decisions.md) — D-006 (verification gate)
