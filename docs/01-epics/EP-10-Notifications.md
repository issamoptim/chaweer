# EP-10 — Notifications

> **Status:** Planned  
> **Sprint:** Sprint 07 (MVP basic) → Sprint 10 (enhanced)  
> **Last updated:** 2026-07-19

---

## Business Objective

Keep users informed about important platform events — appointment lifecycle, payment confirmations, verification status — through email, push, in-app, and SMS notifications.

## Scope

- Email notifications (transactional — MVP)
- Push notifications (web — MVP)
- In-app notification center (post-MVP)
- Notification preferences management (post-MVP)
- SMS notifications (nice-to-have — already "Bientôt disponible" in UI)

## Business Rules

- **Transactional emails**: appointment confirmations, cancellations, reminders, payment receipts
- **Push notifications**: real-time alerts for appointment status changes
- **Preferences**: users can toggle email and push notifications (already in US-021)
- **SMS**: marked "Bientôt disponible" in current UI; requires SMS provider integration (depends on US-027)
- **No spam**: notifications are transactional only — no marketing emails in MVP
- **Localization**: notifications sent in user's preferred language

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies |
|---|---|---|---|---|---|---|
| US-077 | Email Notifications (transactional) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-078 | Push Notifications (web) | High | MVP | Planned | Sprint 07 | EP-02 |
| US-079 | In-App Notification Center | Medium | Post-MVP | Draft | Sprint 10 | US-077, US-078 |
| US-080 | Notification Preferences Management | Medium | Post-MVP | Draft | Sprint 10 | US-077, US-078 |
| US-081 | SMS Notifications | Low | Nice-to-have | Draft | Future | US-027 |

## Dependencies

- EP-02 Account Management (user preferences, email/phone)
- EP-06 Appointment Booking (events that trigger notifications)

## Roadmap

| Phase | Status |
|---|---|
| Sprint 07 (US-077→078) | Planned |
| Sprint 10 (US-079→080) | Draft |
| Future (US-081) | Draft |

## Related Documents

- [`Releases.md`](../00-product/Releases.md)
- [`Roadmap.md`](../00-product/Roadmap.md)
- [`Decisions.md`](../00-product/Decisions.md) — D-005 (SMS "Bientôt disponible")
