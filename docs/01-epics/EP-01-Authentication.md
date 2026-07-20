# EP-01 — Authentication

> **Status:** Done  
> **Sprint:** Sprint 01  
> **Last updated:** 2026-07-19

---

## Business Objective

Provide secure, frictionless authentication for citizens and lawyers using Google OAuth (dominant) and email/password (secondary).

## Scope

- User registration (email + password)
- Google OAuth integration
- JWT authentication + refresh tokens
- Protected routes
- Basic account creation
- Session management

## Business Rules

- Google OAuth is the **dominant** authentication method — first button, full width, on all auth screens
- Email/password is secondary
- No fields before the registration method choice screen
- Professional (lawyer) entry is via footer link only on consumer auth screens
- Session is persistent by default (no "stay logged in" checkbox)
- Each auth step is a full screen (no modals)

## User Story Index

No formal User Stories were created for this EPIC. Authentication was implemented as a module with 10 screens:

1. Landing Authentication
2. Login
3. Register
4. Email Registration
5. Google Loading
6. Authentication Error
7. Forgot Password (screen exists, full flow deferred — see US-025)
8. Session Restoring
9. Logged-in Transition
10. Professional Entry

## Dependencies

- EP-00 Foundation

## Roadmap

| Phase | Status |
|---|---|
| Sprint 01 | Done |

## Related Documents

- [`Sprint-01.md`](../02-sprints/Sprint-01.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Screens.md`](../07-design/Screens.md) — Auth module screen specs
- [`Components.md`](../07-design/Components.md) — GoogleButton, ProFooter components
