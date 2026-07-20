# Chaweer — Product Decisions Log

> **Status:** Maintained  
> **Last updated:** 2026-07-19

---

## Decision Format

Each decision records: date, context, decision, rationale, and impact.

---

## Decisions

### D-001 — Google OAuth as dominant authentication method

| Field | Value |
|---|---|
| Date | Sprint 01 |
| Context | Authentication strategy for Chaweer |
| Decision | Google OAuth is the primary, dominant authentication method — first button, full width, on all auth screens |
| Rationale | Reduces friction, provides verified email, leverages Google's security. Email/password is secondary |
| Impact | All auth screens designed with GoogleButton as dominant element |

---

### D-002 — Email and phone are read-only in profile editing

| Field | Value |
|---|---|
| Date | Sprint 02 |
| Context | US-022 Edit Profile — which fields are editable |
| Decision | Email is strictly read-only (linked to authentication). Phone is editable in US-022 but was later reconsidered — in the final spec, phone is also read-only with a lock icon |
| Rationale | Email and phone are tied to authentication and cannot be changed via profile edit |
| Impact | US-022 form excludes email and phone from editable fields |

---

### D-003 — Defer US-024→027 to Post-MVP

| Field | Value |
|---|---|
| Date | Sprint 02 completion (2026-07-19) |
| Context | Sprint 02 completed US-021, US-022, US-023. Remaining account features (email verification, forgot/reset password, logout, phone auth) were not implemented |
| Decision | Move US-024 (Email Verification), US-025 (Forgot/Reset Password), US-026 (Logout), US-027 (Phone Authentication) to Post-MVP backlog |
| Rationale | Google OAuth is the dominant auth path and already provides verified identity. Forgot/reset password is important but not blocking launch since Google users don't need it. Phone auth requires SMS provider integration. Basic session expiry covers logout temporarily |
| Impact | These features remain in Product Backlog with Deferred status. Targeted for Sprint 09 |

---

### D-004 — No auto-save in profile editing

| Field | Value |
|---|---|
| Date | Sprint 02 |
| Context | US-022 Edit Profile — save behavior |
| Decision | Explicit save only. No auto-save. Confirmation modal before leaving with unsaved changes |
| Rationale | Prevents accidental data loss and unwanted API calls. User must consciously save |
| Impact | All edit forms use explicit save with unsaved-changes guard |

---

### D-005 — SMS notifications marked "Bientôt disponible"

| Field | Value |
|---|---|
| Date | Sprint 02 |
| Context | US-021 View Profile — notification preferences |
| Decision | SMS notification toggle is disabled with "Bientôt disponible" badge |
| Rationale | SMS provider not yet integrated. UI shows the option exists but is not yet available |
| Impact | US-081 (SMS Notifications) is Nice-to-have, depends on US-027 (Phone Authentication) |

---

### D-006 — Professional onboarding requires admin verification gate

| Field | Value |
|---|---|
| Date | Sprint 03 planning (2026-07-19) |
| Context | EP-03 Professional Onboarding — trust and verification strategy |
| Decision | Lawyers cannot appear in the public directory until an admin reviews and approves their credentials (bar association, identity documents) |
| Rationale | Legal platform trust is non-negotiable. Unverified lawyers could damage platform credibility and user safety |
| Impact | US-034 (Admin Verification Review) is part of Sprint 03. EP-04 (Public Directory) only shows verified professionals |

---

### D-007 — Video consultation is the primary modality for MVP

| Field | Value |
|---|---|
| Date | Sprint 03 planning (2026-07-19) |
| Context | EP-06 Appointment Booking — consultation types for MVP |
| Decision | Video consultation is the only modality implemented for MVP. Audio and chat are Post-MVP/Future |
| Rationale | Video is the core value proposition — face-to-face legal advice. Audio and chat add complexity without being launch-blocking |
| Impact | US-053 (Video Consultation) is MVP. US-057 (Audio) is Post-MVP. US-059 (Chat) is Future |

---

### D-008 — Hybrid documentation structure

| Field | Value |
|---|---|
| Date | 2026-07-19 |
| Context | Project documentation organization |
| Decision | EPIC documents contain all User Stories as entries. Individual US files are created just-in-time only for completed, current-sprint, or MVP-ready stories |
| Rationale | Keeps documentation lightweight while remaining scalable. Avoids creating ~60 placeholder files for future stories |
| Impact | `docs/03-functional/` contains only US-021→034. All other US exist as entries in their EPIC document |

---

*This log records all significant product decisions. Append new decisions at the bottom.*
