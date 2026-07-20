# EP-06 — Appointment Booking

> **Status:** Planned  
> **Sprint:** Sprint 06 (MVP core) → Sprint 08 (enhanced)  
> **Last updated:** 2026-07-19

---

## Business Objective

Enable citizens to book, conduct, and track video consultations with verified lawyers — the core transactional flow of Chaweer.

## Scope

- Appointment slot selection (citizen picks from lawyer's availability)
- Appointment creation & confirmation
- Appointment cancellation (citizen and lawyer)
- Appointment status tracking (lifecycle management)
- Video consultation interface (primary modality)
- Appointment history (past and upcoming)
- Appointment rescheduling (post-MVP)
- Appointment reminders (post-MVP)
- Audio consultation interface (post-MVP)
- Professional calendar view (post-MVP)
- Chat consultation interface (future)

## Business Rules

- **Video is primary**: only video consultation is implemented for MVP (Decision D-007)
- **Slot selection**: citizen sees lawyer's available slots in their timezone
- **Confirmation**: appointment is "requested" → lawyer confirms → "confirmed"
- **Cancellation policy**: both parties can cancel; rules and potential fees defined per consultation
- **Status lifecycle**: requested → confirmed → ongoing → completed (or cancelled at any stage)
- **No double-booking**: slot is locked when an appointment is requested
- **History**: both citizens and lawyers can view appointment history

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-049 | Appointment Slot Selection | High | MVP | Planned | Sprint 06 | US-044 |
| US-050 | Appointment Creation & Confirmation | High | MVP | Planned | Sprint 06 | US-049, US-046 |
| US-051 | Appointment Cancellation | High | MVP | Planned | Sprint 06 | US-050 |
| US-052 | Appointment Status Tracking | High | MVP | Planned | Sprint 06 | US-050 |
| US-053 | Video Consultation Interface | High | MVP | Planned | Sprint 06 | US-050 |
| US-054 | Appointment History | Medium | MVP | Planned | Sprint 06 | US-050 |
| US-055 | Appointment Rescheduling | Medium | Post-MVP | Draft | Sprint 08 | US-050 |
| US-056 | Appointment Reminders | Medium | Post-MVP | Draft | Sprint 08 | US-050, EP-10 |
| US-057 | Audio Consultation Interface | Low | Post-MVP | Draft | Sprint 08 | US-050 |
| US-058 | Professional Calendar View | Low | Post-MVP | Draft | Sprint 08 | US-044 |
| US-059 | Chat Consultation Interface | Low | Future | Draft | Future | US-050 |

## Dependencies

- EP-05 Professional Profile (availability, consultation types, pricing)
- EP-07 Payments (payment required at booking)
- EP-10 Notifications (for reminders)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 06 (US-049→054) | Planned |
| Sprint 08 (US-055→058) | Draft |
| Future (US-059) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
- [`Decisions.md`](../00-product/Decisions.md) — D-007 (video primary)
