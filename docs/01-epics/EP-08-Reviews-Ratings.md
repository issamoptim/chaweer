# EP-08 — Reviews & Ratings

> **Status:** Planned  
> **Sprint:** Sprint 08  
> **Last updated:** 2026-07-19

---

## Business Objective

Build trust and transparency by enabling citizens to rate and review lawyers after completed consultations, and allowing lawyers to respond.

## Scope

- Post-consultation review submission
- Review display on professional profile
- Review response from professionals
- Rating aggregation (average score)
- Review moderation by admins

## Business Rules

- **Verified reviews only**: only citizens who completed a consultation with the lawyer can leave a review
- **One review per consultation**: citizen can leave one review per completed appointment
- **Review content**: star rating (1-5) + optional text comment
- **Response window**: lawyers can respond to reviews within a defined period
- **Moderation**: admins can hide/remove inappropriate reviews
- **Rating aggregation**: average rating displayed on profile and directory; based on all verified reviews

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-067 | Post-Consultation Review | Medium | Post-MVP | Draft | Sprint 08 | US-052 |
| US-068 | Review Display on Profile | Medium | Post-MVP | Draft | Sprint 08 | US-067, US-042 |
| US-069 | Review Response (Professional) | Low | Post-MVP | Draft | Sprint 08 | US-067 |
| US-070 | Rating Aggregation | Medium | Post-MVP | Draft | Sprint 08 | US-067 |
| US-071 | Review Moderation (Admin) | Low | Post-MVP | Draft | Sprint 08 | US-067, EP-11 |

## Dependencies

- EP-06 Appointment Booking (completed consultations required)
- EP-05 Professional Profile (reviews displayed on profile)
- EP-11 Administration (moderation)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 08 (US-067→071) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
