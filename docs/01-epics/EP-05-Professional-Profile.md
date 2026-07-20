# EP-05 — Professional Profile

> **Status:** Planned  
> **Sprint:** Sprint 04  
> **Last updated:** 2026-07-19

---

## Business Objective

Enable lawyers to create and manage their public-facing professional profile, including availability, consultation types, and pricing — the foundation for directory listing and appointment booking.

## Scope

- Professional profile public view (visible to citizens)
- Professional profile edit (lawyer manages own content)
- Availability & calendar management (lawyer sets available slots)
- Consultation types setup (video, audio, chat)
- Pricing setup (consultation fees per type)
- Education & experience display (post-MVP)
- Reviews display on profile (post-MVP, depends on EP-08)

## Business Rules

- **Public profile**: visible to all citizens without authentication required
- **Profile completeness**: minimum fields required before profile goes public (photo, bio, specialization, consultation type, price)
- **Availability**: lawyer defines available time slots; timezone-aware
- **Consultation types**: lawyer can offer video, audio, and/or chat — at least one required
- **Pricing**: per consultation type and duration; lawyer sets own prices
- **Edit restrictions**: verified lawyers can edit their profile; changes to credentials (bar association) require re-verification

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-042 | Professional Profile View (Public) | High | MVP | Planned | Sprint 04 | EP-03 |
| US-043 | Professional Profile Edit | High | MVP | Planned | Sprint 04 | US-042 |
| US-044 | Availability & Calendar Management | High | MVP | Planned | Sprint 04 | US-043 |
| US-045 | Consultation Types Setup (video, audio, chat) | High | MVP | Planned | Sprint 04 | US-043 |
| US-046 | Pricing Setup (consultation fees) | High | MVP | Planned | Sprint 04 | US-045 |
| US-047 | Education & Experience Display | Low | Post-MVP | Draft | Sprint 08 | US-042 |
| US-048 | Reviews Display on Profile | Low | Post-MVP | Draft | Sprint 08 | US-042, EP-08 |

## Dependencies

- EP-03 Professional Onboarding (profile created during onboarding)
- EP-08 Reviews & Ratings (for US-048)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 04 (US-042→046) | Planned |
| Sprint 08 (US-047→048) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
