# Authentication Design Specification

## US-008 — Frontend Authentication & User Access

---

# Document Information

| Property | Value |
|----------|-------|
| Version | 2.0 |
| Status | ✅ APPROVED |
| Sprint | Sprint 01 |
| Epic | EP-001 — Identity & Authentication |
| Related User Story | US-008 — Frontend Authentication & User Access |
| Product Owner | Approved |
| Last Updated | 2026-07-16 |

---

# Purpose

This document is the official UX/UI reference for the Chaweer authentication experience.

It complements the functional specification (US-008) by defining the complete visual and interaction behavior of every authentication screen.

This specification is the single source of truth for authentication interfaces.

It defines:

- information architecture
- navigation flows
- visual hierarchy
- reusable components
- layouts
- responsive behavior
- accessibility rules
- design tokens
- UX decisions
- interaction patterns

Implementation details, business logic and backend behavior are intentionally excluded.

---

# Scope

This document covers the complete authentication experience for the Grand Public journey and the entry point to the Professional journey.

Included:

- Shared Authentication Layout
- Landing Authentication
- Login
- Registration Choice
- Email Registration
- Google Authentication Loading
- Authentication Error
- Session Restoration (SplashScreen)
- Professional Entry
- Future Password Reset UX

Excluded:

- Backend implementation
- API contracts
- Email verification
- Profile management
- Professional onboarding
- Subscription management
- Administration

---

# Status

This document has been reviewed and approved.

Any modification affecting the authentication UX must be validated by the Product Owner before implementation.

In case of conflict between implementation and this document, this specification prevails.

---
# Design Philosophy

Authentication is not a feature.

It is the gateway to the Chaweer experience.

Every unnecessary click, field or decision increases friction and reduces conversion.

The authentication experience must therefore be:

- simple
- fast
- trustworthy
- accessible
- consistent

The objective is to allow a returning user to authenticate in less than 20 seconds and a new user to create an account in less than one minute.

Authentication should never become an obstacle.

It should feel almost invisible.

---

# Product Principles

The authentication experience follows the following principles.

---

## 1. Google First

Google authentication is always presented before Email authentication.

It is visually dominant because it provides the fastest path to authentication.

Email authentication always remains available as an alternative.

---

## 2. Grand Public First

Chaweer primarily serves citizens and businesses looking for legal assistance.

The default authentication journey is always the Grand Public journey.

Professional authentication is intentionally separated.

---

## 3. Progressive Disclosure

Only the information required for the current action is displayed.

Examples:

- Registration starts with choosing the authentication method.
- Profile completion happens after account creation.
- Additional information is requested only when necessary.

---

## 4. One Screen = One Responsibility

Each screen has a single objective.

Examples:

Landing

→ choose authentication method

Login

→ authenticate

Register

→ choose registration method

Email Registration

→ create account

Loading

→ wait

Error

→ recover

This reduces cognitive load.

---

## 5. Trust Before Features

The interface must inspire confidence through:

- generous whitespace
- calm colors
- simple typography
- minimal copy
- predictable interactions

Trust is communicated visually rather than explained.

---

## 6. Shared Authentication Experience

All authentication screens share the same visual language.

Shared elements include:

- AuthLayout
- AuthCard
- spacing
- typography
- buttons
- transitions

Users should always feel they remain inside the same experience.

---

## 7. Accessibility First

Authentication must remain usable by everyone.

Every interactive component must support:

- keyboard navigation
- visible focus
- screen readers
- sufficient color contrast

Accessibility is considered a core requirement rather than an enhancement.

---

## 8. Security Without Anxiety

Security mechanisms should reassure users without creating unnecessary concern.

Examples:

- Friendly error messages
- No technical jargon
- No exposed backend errors
- Password visibility toggle
- Secure session restoration

---

## 9. Fast Recovery

When authentication fails, users should recover quickly.

Every error screen must immediately provide a clear next action.

Authentication errors should never leave users blocked.

---

## 10. Consistency Over Creativity

Authentication is not the place for experimentation.

Consistency is preferred over originality.

Every authentication screen should feel familiar.

# Design Tokens

The authentication module uses the Chaweer Design System.

Authentication components must never define local colors, spacing or typography.

They must exclusively consume the shared design tokens.

---

# Color Palette

## Primary

| Token | Value | Usage |
|--------|-------|-------|
| Primary 700 | #0F766E | Primary buttons |
| Primary 800 | #134E4A | Hover state |
| Primary 500 | #14B8A6 | Focus ring, active state |

---

## Neutral

| Token | Value | Usage |
|--------|-------|-------|
| White | #FFFFFF | Cards |
| Background | #F8FAFC | Authentication background |
| Border | #E5E7EB | Inputs & dividers |
| Text Primary | #111827 | Headings |
| Text Secondary | #6B7280 | Descriptions |
| Text Disabled | #9CA3AF | Disabled content |

---

## Semantic

| Token | Value | Usage |
|--------|-------|-------|
| Success | #16A34A | Success |
| Warning | #D97706 | Warning |
| Error | #DC2626 | Validation errors |
| Info | #2563EB | Informational feedback |

---

# Typography

## Font Family

Primary:

Inter

Fallback:

- system-ui
- sans-serif

---

## Heading

Weight: 700

Line Height: 120%

---

## Body

Weight: 400

Line Height: 150%

---

## Button

Weight: 600

Letter spacing: normal

---

# Radius

| Token | Value |
|--------|-------|
| Small | 8px |
| Medium | 12px |
| Large | 16px |
| Extra Large | 24px |

---

# Shadows

Authentication uses only soft elevation.

Cards:

Soft shadow

Hover:

Slightly stronger shadow

No dramatic elevation.

---

# Spacing

Base spacing unit:

8px

Recommended values:

- 8
- 16
- 24
- 32
- 48
- 64

Authentication layouts should avoid arbitrary spacing values.

---

# Focus States

Every interactive component must expose a visible focus state.

Focus ring:

Primary 500

Visible on:

- buttons
- links
- inputs
- checkboxes

Focus must never rely only on color.

---

# Motion

Animations must remain subtle.

Maximum duration:

250ms

Preferred transitions:

- opacity
- fade
- scale

Avoid:

- bounce
- flip
- elastic animations

---

# Icons

Lucide icons only.

Icons must remain decorative unless they communicate state.

Examples:

- eye
- eye-off
- arrow-left
- alert-circle
- check-circle

---

# Responsive Breakpoints

| Device | Width |
|----------|------|
| Mobile | 0–767px |
| Tablet | 768–1023px |
| Desktop | 1024px+ |

The information hierarchy never changes.

Only layout adapts.

# Components

This section defines the official reusable UI components used throughout the Chaweer authentication experience.

Authentication screens must only be composed using these components.

Business logic must remain outside UI components.

Components are presentation-only and reusable.

---

# Component Architecture

Authentication follows the following hierarchy.

```
AuthLayout
│
├── BrandingPanel (Desktop only)
│
└── AuthCard
    │
    ├── AuthHeader
    ├── GoogleButton
    ├── Divider
    ├── TextField
    ├── EmailField
    ├── PasswordField
    ├── PasswordStrength
    ├── Checkbox
    ├── PrimaryButton
    ├── SecondaryButton
    ├── TextLink
    ├── ErrorMessage
    ├── LoadingSpinner
    └── ProfessionalEntry
```

---

# AuthLayout

## Purpose

Provides the shared layout used by every authentication screen.

Responsibilities:

- Full viewport height
- Responsive behavior
- Display BrandingPanel on Desktop
- Center AuthCard
- Handle page spacing

Business logic is forbidden.

---

# BrandingPanel

Desktop only.

Hidden on Mobile.

Reduced on Tablet if necessary.

Displays:

- Chaweer value proposition
- Trust messages
- Security reassurance
- Return to home

The BrandingPanel never changes between authentication screens.

---

# AuthCard

Primary container for the current authentication action.

Characteristics:

- White background
- Rounded corners
- Soft shadow
- Max width: 480px
- Internal padding: 32px
- Responsive

Only its content changes.

---

# AuthHeader

Displays:

- Logo
- Title
- Optional description

Examples:

- Connectez-vous à Chaweer
- Créer votre compte
- Réinitialiser votre mot de passe

---

# GoogleButton

Primary authentication action.

Always displayed before Email authentication.

Supported states:

- Default
- Hover
- Focus
- Loading
- Disabled

---

# Divider

Displays:

──────── ou ────────

Separates Google authentication from Email authentication.

---

# TextField

Reusable text input.

Future usage:

- Profile
- Settings
- Onboarding

---

# EmailField

Specialized TextField.

Supports:

- autocomplete
- validation
- backend errors

---

# PasswordField

Supports:

- show password
- hide password
- validation
- loading
- disabled

---

# PasswordStrength

Displayed only during Email Registration.

States:

- Weak
- Medium
- Strong

---

# Checkbox

Reusable agreement checkbox.

Used for:

- Terms of Service
- Privacy Policy

---

# PrimaryButton

Main action.

Examples:

- Se connecter
- Créer mon compte
- Continuer

---

# SecondaryButton

Optional secondary action.

Must remain visually secondary.

---

# TextLink

Examples:

- Retour
- Créer un compte
- Mot de passe oublié

---

# ProfessionalEntry

Secondary entry point.

Displayed below the authentication card.

Characteristics:

- visually subtle
- secondary hierarchy
- never competes with primary actions

---

# ErrorMessage

Displays friendly validation messages.

Must never expose:

- HTTP status codes
- Stack traces
- Technical backend details

---

# LoadingSpinner

Minimal spinner.

Used during:

- Login
- Registration
- Google Authentication
- Session Restoration

---

# SplashScreen

Displayed only while:

POST /auth/refresh

↓

GET /auth/me

↓

AuthProvider initialization

Contains:

- Logo
- LoadingSpinner

No interaction allowed.

---

# AuthError

Reusable authentication error component.

Contains:

- Icon
- Title
- Description
- Primary action
- Optional secondary action

Supports multiple authentication error scenarios.

---

# Component Rules

Every authentication component must:

- be reusable
- support loading
- support disabled
- support error
- support accessibility
- remain presentation-only

Business logic belongs exclusively to hooks and services.

UI components must never communicate directly with backend APIs.

# Screen Specifications

Each screen described below is considered an official reference.

Every implementation must reproduce these screens faithfully.

No additional screens may be introduced without Product Owner approval.

---

# AUTH-00 — Shared Authentication Layout

## Purpose

Provides the common layout shared by all authentication screens.

## Desktop

Displays:

- Public Header
- BrandingPanel (left)
- AuthCard (right)

The BrandingPanel remains identical across all authentication screens.

Only the AuthCard content changes.

---

## Tablet

The BrandingPanel may be reduced while preserving the visual hierarchy.

---

## Mobile

The BrandingPanel is hidden.

The AuthCard occupies the available width while maintaining generous spacing.

---

# AUTH-01 — Landing Authentication

## Goal

Allow users to choose their preferred authentication method.

## Components

- AuthLayout
- BrandingPanel
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- PrimaryButton ("Continuer avec votre adresse e-mail")
- ProfessionalEntry

## Primary CTA

Continuer avec Google

## Secondary CTA

Continuer avec votre adresse e-mail

## UX Rules

Google authentication is always presented first.

No form is displayed.

---

# AUTH-02 — Login

## Goal

Authenticate an existing user.

## Components

- AuthLayout
- BrandingPanel
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- EmailField
- PasswordField
- PrimaryButton
- TextLink ("Mot de passe oublié")
- TextLink ("Créer un compte")
- ProfessionalEntry

## Primary CTA

Se connecter

## UX Rules

Google remains the primary authentication method.

Email authentication is immediately available.

No unnecessary information is displayed.

---

# AUTH-03 — Registration Choice

## Goal

Allow users to choose how they want to create their account.

## Components

- AuthLayout
- BrandingPanel
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- PrimaryButton ("Continuer avec votre adresse e-mail")
- TextLink ("Se connecter")
- ProfessionalEntry

## UX Rules

No registration form appears on this screen.

The Email Registration form is displayed only after selecting Email.

---

# AUTH-04 — Email Registration

## Goal

Create a user account with the minimum required information.

## Components

- AuthLayout
- BrandingPanel
- AuthCard
- AuthHeader
- TextField ("Nom complet")
- EmailField
- PasswordField
- PasswordStrength
- Checkbox
- PrimaryButton

## UX Rules

Registration must remain fast.

Only essential information is requested.

Profile enrichment is intentionally deferred to a future onboarding flow.

---

# AUTH-05 — Google Authentication Loading

## Goal

Inform the user that Google authentication is in progress.

## Components

- AuthLayout
- AuthCard
- LoadingSpinner

## UX Rules

No interaction is allowed.

No retry button is displayed.

The screen transitions automatically after authentication completes.

---

# AUTH-06 — Authentication Error

## Goal

Help the user recover from an authentication failure.

## Components

- AuthLayout
- AuthCard
- AuthError

## UX Rules

Messages must remain friendly.

Technical details are never exposed.

At least one recovery action must always be available.

---

# AUTH-07 — Forgot Password

## Status

Future User Story.

The UX has been designed but is intentionally excluded from US-008 implementation.

---

# AUTH-08 — Session Restoration

## Implementation

No dedicated screen exists.

Automatic session restoration uses the SplashScreen component.

Workflow:

Application Start

↓

POST /auth/refresh

↓

GET /auth/me

↓

Application Ready

No interaction is allowed.

---

# AUTH-09 — Connected

Removed.

Following successful authentication, users are redirected immediately to their destination.

No intermediate "Connected" screen is displayed.

This behavior follows RM-007 of US-008.

---

# AUTH-10 — Professional Entry

## Goal

Provide lawyers with access to the professional authentication journey.

## Components

- AuthLayout
- BrandingPanel
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- PrimaryButton ("Continuer avec votre adresse e-mail")
- TextLink ("Créer un compte avocat")
- TextLink ("Je suis un particulier")

## UX Rules

The Professional journey is intentionally isolated from the Grand Public journey.

It never competes with the main authentication experience.

---

# Screen Principles

Every authentication screen must:

- have a single responsibility
- expose a single primary CTA
- minimize cognitive load
- remain visually consistent
- preserve the same navigation hierarchy
- reuse the shared authentication layout

Consistency takes precedence over creativity.

# User Flows

This section defines the official navigation flows for the authentication experience.

---

# Grand Public Authentication

Landing Authentication

↓

Google

↓

Google Authentication Loading

↓

GET /auth/me

↓

Home

---

Landing Authentication

↓

Email

↓

Login

↓

POST /auth/login

↓

GET /auth/me

↓

Home

---

Landing Authentication

↓

Créer un compte

↓

Registration Choice

↓

Google

↓

POST /auth/google/client

↓

GET /auth/me

↓

Home

---

Landing Authentication

↓

Créer un compte

↓

Registration Choice

↓

Continuer avec votre adresse e-mail

↓

Email Registration

↓

POST /auth/register

↓

GET /auth/me

↓

Home

---

# Session Restoration

Application Start

↓

POST /auth/refresh

↓

GET /auth/me

↓

AuthProvider Initialization

↓

Application Ready

---

# Logout

Logout

↓

POST /auth/logout

↓

Anonymous User

↓

Landing Authentication

---

# Professional Journey

Landing Authentication

↓

Je suis avocat

↓

Professional Entry

↓

Google

↓

POST /auth/google/professional

↓

GET /auth/me

↓

Professional Dashboard

or

↓

Continuer avec votre adresse e-mail

↓

Professional Login

↓

Professional Dashboard

---

# Error Recovery

Authentication Error

↓

Réessayer

↓

Retry previous authentication flow

or

↓

Utiliser une autre méthode

↓

Landing Authentication

# UX Decisions

The following decisions were validated during the Authentication Design Review.

---

## Google First

Google authentication is always presented before Email authentication.

---

## Shared Authentication Layout

Desktop authentication screens share the same AuthLayout.

Only the AuthCard content changes.

---

## Progressive Profile Completion

Registration collects only the minimum required information.

Profile enrichment occurs later during onboarding.

---

## One Screen = One Responsibility

Each authentication screen has one single objective.

No screen combines multiple unrelated actions.

---

## No Connected Screen

After successful authentication, users are redirected immediately.

No intermediate confirmation screen exists.

---

## SplashScreen Only

Session restoration uses SplashScreen.

No dedicated restoration screen exists.

---

## Friendly Errors

Authentication errors remain simple and reassuring.

No backend implementation details are exposed.

---

## Professional Journey Separation

Professional authentication is intentionally separated from the Grand Public journey.

It remains accessible without competing with the main authentication flow.

---

## Consistency Over Creativity

Authentication prioritizes familiarity and predictability over originality.

---

## Design Freeze

This document represents the approved authentication experience.

Implementation must reproduce these specifications faithfully.

Any UX modification requires Product Owner approval.

# Future Evolution

This section documents authentication features intentionally excluded from US-008.

Their UX has been anticipated to preserve consistency across future iterations.

Implementation will be covered by dedicated User Stories.

---

## Password Reset

Status:

Future User Story

Planned screens:

- Forgot Password
- Email Sent Confirmation
- Reset Password
- Password Successfully Updated

---

## Email Verification

Status:

Future User Story

Objectives:

- Verify ownership of the email address
- Prevent fake account creation
- Improve platform trust

Possible flow:

Register

↓

Verification Email

↓

Verify Email

↓

Account Activated

---

## Multi-Factor Authentication (MFA)

Status:

Future User Story

Possible authentication methods:

- Email OTP
- SMS OTP
- Authenticator Application

The authentication architecture must remain compatible with future MFA integration.

---

## Multi-Role Authentication

Status:

Future User Story

Current backend supports one role per user.

If multiple roles become available, users will choose their role immediately after authentication.

No implementation exists in US-008.

---

## Social Providers

Potential future providers:

- Apple
- LinkedIn
- Microsoft

Google remains the only supported provider in US-008.

---

## Professional Onboarding

Future authentication improvements for lawyers:

- Bar Association verification
- Professional profile completion
- Office information
- Practice areas
- Identity verification

---

## Remember Me

Future enhancement.

Current authentication relies exclusively on Refresh Token cookies.

No "Remember Me" option is provided.

---

## Passkeys

Future authentication option.

Potential support:

- Face ID
- Touch ID
- Windows Hello
- FIDO2

Not included in Sprint 01.

---

## Authentication Analytics

Future metrics may include:

- Registration conversion rate
- Login success rate
- Google vs Email adoption
- Authentication errors
- Abandonment rate

Analytics must respect privacy regulations.

---

## Continuous Improvement

Authentication UX should evolve only after:

- usability testing
- analytics review
- Product Owner validation

Consistency remains the primary objective.

# References

Related documents:

- US-008 — Frontend Authentication & User Access
- ui-decisions.md
- user-flows.md
- README.md

---

# Glossary

AuthLayout

Shared layout used across all authentication screens.

---

BrandingPanel

Desktop panel presenting Chaweer's value proposition.

---

AuthCard

Primary authentication container.

---

SplashScreen

Temporary loading screen displayed during automatic session restoration.

---

Professional Entry

Secondary entry point dedicated to lawyers.

---

Grand Public

Default authentication journey for citizens and businesses.

---

Design Freeze

Approved UI specification that becomes the implementation reference.