# UI Decisions

## US-008 — Frontend Authentication

Version: 1.0

Status: Approved

---

# Purpose

This document summarizes the official UX and UI decisions approved for the authentication module.

It complements the Authentication Design Specification.

Developers must follow these decisions exactly.

---

# Authentication Strategy

- Google authentication is the preferred authentication method.
- Email authentication remains available as an alternative.
- Google CTA is always displayed before Email authentication.

---

# User Journeys

## Grand Public

The Grand Public journey is always the primary experience.

Primary actions:

- Connexion
- Créer un compte
- Continuer avec Google

---

## Professional

The professional journey is intentionally secondary.

Access is provided through:

"Vous êtes avocat ?"

↓

"Accéder à l'espace avocat"

No role selection screen exists.

---

# Session Management

Session restoration follows:

POST /auth/refresh

↓

GET /auth/me

↓

AuthProvider

The process must be invisible to the user.

---

# Authentication State

AuthProvider exposes only four states:

- loading
- authenticated
- anonymous
- error

---

# Route Protection

Private pages:

AuthGuard

Public authentication pages:

GuestGuard

---

# User Source

The authenticated user is retrieved exclusively through:

GET /auth/me

The frontend never builds the user object from the JWT.

---

# Token Storage

Access Token:

Memory only.

Refresh Token:

HttpOnly Cookie.

Never use:

- localStorage
- sessionStorage
- IndexedDB

---

# Design Principles

- Minimalist
- Premium
- Calm
- Accessible
- Mobile First

---

# Components

Authentication screens must use the official reusable components defined in the Authentication Design Specification.

No custom authentication components without Product Owner approval.

---

# Accessibility

WCAG AA

Keyboard navigation

Visible focus

Readable contrast

---

# Future Evolution

Future identity providers:

- Apple
- Microsoft
- LinkedIn

must integrate without redesigning the authentication module.