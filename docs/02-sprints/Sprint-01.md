# Sprint 01 — Authentication

> **Status:** Done  
> **EPIC:** EP-01 Authentication  
> **Release:** 0.2.0

---

## Objective

Implement secure, frictionless authentication for citizens and lawyers using Google OAuth (dominant) and email/password (secondary).

## Deliverables

- User registration (email + password)
- Google OAuth integration
- JWT authentication + refresh tokens
- Protected routes
- Basic account creation
- Session management

## Screens Implemented (Auth Module — 10 screens)

1. **Landing Authentication** — GoogleButton dominant + email option + ProFooter
2. **Login** — Google + email/password + forgot password link
3. **Register** — Method choice (Google or email)
4. **Email Registration** — Name, email, password, consent
5. **Google Loading** — Spinner + redirect message
6. **Authentication Error** — Error + retry + alternative method
7. **Forgot Password** — Screen exists; full flow deferred (US-025)
8. **Session Restoring** — Brief transition with skeleton
9. **Logged-in Transition** — Green checkmark + redirect to destination
10. **Professional Entry** — "Espace avocat" registration path

## User Stories

No formal User Stories were created for this sprint. Authentication was implemented as a module.

## Outcome

Authentication is fully functional. Users can register and log in via Google or email/password. Protected routes are in place. Professional entry path exists.

## Related Documents

- [`EP-01-Authentication.md`](../01-epics/EP-01-Authentication.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Screens.md`](../07-design/Screens.md) — Auth module screen specs
- [`Components.md`](../07-design/Components.md) — GoogleButton, ProFooter
