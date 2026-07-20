# Sprint 02 — Account Management

> **Status:** Done  
> **EPIC:** EP-02 Account Management  
> **Release:** 0.3.0

---

## Objective

Enable users to manage their personal information, preferences, and account security after authentication.

## Completed User Stories

| ID | Title | Status | US File |
|---|---|---|---|
| US-021 | View Profile | Done | [`US-021.md`](../03-functional/US-021.md) |
| US-022 | Edit Profile | Done | [`US-022.md`](../03-functional/US-022.md) |
| US-023 | Account Security | Done | [`US-023.md`](../03-functional/US-023.md) |

## Deferred User Stories (NOT cancelled — moved to Post-MVP)

The following features were planned for Sprint 02 but have been **deferred to the Post-MVP backlog**. They remain in the Product Backlog with `Deferred` status and are targeted for Sprint 09.

| ID | Title | Status | Rationale | Target Sprint | US File |
|---|---|---|---|---|---|
| US-024 | Email Verification | Deferred | Google OAuth already provides verified identity; email verification is important but not blocking launch | Sprint 09 | [`US-024.md`](../03-functional/US-024.md) |
| US-025 | Forgot / Reset Password | Deferred | Critical UX, but Google OAuth is the dominant path; email/password users are secondary | Sprint 09 | [`US-025.md`](../03-functional/US-025.md) |
| US-026 | Logout | Deferred | Basic session expiry works; explicit logout flow deferred | Sprint 09 | [`US-026.md`](../03-functional/US-026.md) |
| US-027 | Phone Authentication | Deferred | Phone is currently read-only; SMS provider integration needed first | Sprint 09 | [`US-027.md`](../03-functional/US-027.md) |

> **Nothing is lost.** These features remain in the Product Backlog and will be implemented in Sprint 09 (Post-MVP). See [`Decisions.md`](../00-product/Decisions.md) — Decision D-003.

## Key Design Decisions

- **D-002**: Email and phone are read-only in profile editing
- **D-004**: No auto-save — explicit save with unsaved-changes guard
- **D-005**: SMS notifications marked "Bientôt disponible"

## Outcome

Users can view their profile (US-021), edit personal information (US-022), and manage account security including password change and account deletion (US-023). Four account features were deferred to Post-MVP with full traceability.

## Related Documents

- [`EP-02-Account-Management.md`](../01-epics/EP-02-Account-Management.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Decisions.md`](../00-product/Decisions.md) — D-002, D-003, D-004, D-005
- [`Ecrans-Profil-Web.md`](../07-design/Ecrans-Profil-Web.md) — Profile web screens
- [`Maquettes-Profil-Fidele.md`](../07-design/Maquettes-Profil-Fidele.md) — Profile mockup descriptions
- [`Spec-Securite-E023.md`](../07-design/Spec-Securite-E023.md) — US-023 security spec
