# EP-02 — Account Management

> **Status:** In Progress  
> **Sprint:** Sprint 02 (completed) → Sprint 09 (deferred features)  
> **Last updated:** 2026-07-19

---

## Business Objective

Enable users to manage their personal information, preferences, and account security after authentication.

## Scope

- Profile consultation (view)
- Profile edition (edit personal info)
- Account security (password management, account deletion)
- Email verification (deferred)
- Forgot / reset password (deferred)
- Logout (deferred)
- Phone authentication (deferred)

## Business Rules

- **Consultation vs edition**: US-021 is read-only; all modifications go through US-022
- **Email is read-only**: linked to authentication, never editable in profile
- **Phone is read-only**: linked to authentication, displayed with lock icon
- **Explicit save**: no auto-save; confirmation modal before leaving with unsaved changes
- **SMS notifications**: always "Bientôt disponible" + disabled toggle
- **Account deletion**: definitive after 30 days, requires re-authentication, always behind explicit confirmation
- **Language**: auto-detected on first load, modifiable (fr/ar/en); Arabic in RTL
- **Password policy**: minimum 8 characters, at least one letter and one digit

## User Story Index

| ID | Title | Priority | Classification | Status | Sprint | Dependencies | US File |
|---|---|---|---|---|---|---|---|
| US-021 | View Profile | High | MVP | Done | Sprint 02 | EP-01 | [`US-021.md`](../03-functional/US-021.md) |
| US-022 | Edit Profile | High | MVP | Done | Sprint 02 | US-021 | [`US-022.md`](../03-functional/US-022.md) |
| US-023 | Account Security | High | MVP | Done | Sprint 02 | US-021 | [`US-023.md`](../03-functional/US-023.md) |
| US-024 | Email Verification | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-024.md`](../03-functional/US-024.md) |
| US-025 | Forgot / Reset Password | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-025.md`](../03-functional/US-025.md) |
| US-026 | Logout | Medium | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-026.md`](../03-functional/US-026.md) |
| US-027 | Phone Authentication | Low | Post-MVP | Deferred | Sprint 09 | EP-01 | [`US-027.md`](../03-functional/US-027.md) |

## Dependencies

- EP-00 Foundation
- EP-01 Authentication

## Roadmap

| Phase | Status |
|---|---|
| Sprint 02 (US-021→023) | Done |
| Sprint 09 (US-024→027) | Planned |

## Related Documents

- [`Sprint-02.md`](../02-sprints/Sprint-02.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Screens.md`](../07-design/Screens.md) — US-021, US-022 screen specs
- [`Ecrans-Profil-Web.md`](../07-design/Ecrans-Profil-Web.md) — Profile web screens
- [`Maquettes-Profil-Fidele.md`](../07-design/Maquettes-Profil-Fidele.md) — Profile mockup descriptions
- [`Spec-Securite-E023.md`](../07-design/Spec-Securite-E023.md) — US-023 security spec
- [`Decisions.md`](../00-product/Decisions.md) — D-002, D-003, D-004, D-005
