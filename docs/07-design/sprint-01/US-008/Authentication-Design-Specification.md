# Authentication Design Specification

## US-008 — Frontend Authentication & User Access

Version: 1.0

Status: Approved

Owner: Product Design

---

# Purpose

This document is the official UX/UI specification for the authentication experience of Chaweer.

It complements the functional specification (US-008) by defining:

- visual hierarchy
- layouts
- components
- interaction patterns
- responsive behaviour
- accessibility
- design tokens
- user journeys

No implementation details are included in this document.

---

# Design Philosophy

Authentication is not a feature.

It is a gateway.

Every additional click, every unnecessary field and every second of hesitation increases abandonment.

The authentication experience must therefore be:

- simple
- fast
- reassuring
- elegant
- accessible

The objective is to authenticate a user in less than 20 seconds.

---

# Product Principles

The authentication module follows five principles.

## 1. Google First

Google authentication is always presented before Email authentication.

It is visually dominant.

Email remains available as an alternative.

---

## 2. Grand Public First

Chaweer primarily serves citizens and businesses looking for legal assistance.

All primary calls-to-action target the Grand Public journey.

---

## 3. Professional Journey is Secondary

Lawyers have a dedicated journey.

It is intentionally separated from the Grand Public experience.

It never competes visually with the main authentication actions.

---

## 4. Trust Before Features

The interface must inspire confidence through:

- generous spacing
- calm colors
- minimal text
- simple interactions

Trust is demonstrated visually rather than explained.

---

## 5. Less is More

Every screen must contain only the information strictly necessary for the current action.

Additional information is deferred until it becomes useful.

---

# Design Tokens

## Color Palette

### Primary

| Token | Value | Usage |
|--------|-------|-------|
| Primary 700 | #0F766E | Main buttons, active elements |
| Primary 800 | #134E4A | Hover state |
| Primary 500 | #14B8A6 | Accent, focus, highlights |

---

### Neutral

| Token | Value | Usage |
|--------|-------|-------|
| White | #FFFFFF | Cards |
| Background | #F8FAFC | Application background |
| Border | #E5E7EB | Inputs & separators |
| Text Primary | #111827 | Titles |
| Text Secondary | #6B7280 | Descriptions |

---

### Semantic

| Token | Value | Usage |
|--------|-------|-------|
| Success | #16A34A | Success feedback |
| Warning | #D97706 | Warning |
| Error | #DC2626 | Validation errors |

---

# Typography

## Font

Inter

Fallback:

- system-ui
- sans-serif

---

## Heading

Font Weight:

700

Line Height:

120%

---

## Body

Font Weight:

400

Line Height:

150%

---

## Button

Font Weight:

600

---

# Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

---

# Shadows

Cards

Soft shadow only.

No heavy elevation.

Authentication screens must feel calm.

---

# Spacing

Base spacing unit:

8px

Common spacing:

- 8
- 16
- 24
- 32
- 48
- 64

Avoid arbitrary spacing values.

---

# Icons

Use Lucide icons only.

Icons are decorative unless conveying meaning.

---

# Motion

Animations must be subtle.

Maximum duration:

250ms

Prefer:

- fade
- scale
- opacity

Avoid:

- bounce
- flip
- exaggerated motion

---

# Responsive Breakpoints

Mobile

0–767px

Tablet

768–1023px

Desktop

1024px+

---

# Layout

Authentication content is centered.

Maximum content width:

480px

Cards remain centered on all devices.

Large margins improve readability.

---

# Components

This section defines the official UI components for the authentication module.

All authentication screens must be composed exclusively from these reusable components.

No authentication page should introduce custom UI elements without Product Owner approval.

---

# AuthLayout

## Purpose

Provides the global page layout for all authentication screens.

## Responsibilities

- Full viewport height
- Center content vertically and horizontally
- Display authentication card
- Responsive layout
- Neutral background

---

# AuthCard

## Purpose

Primary container for authentication forms.

## Characteristics

- White background
- Rounded corners
- Soft shadow
- Maximum width: 480px
- Responsive
- Internal padding: 32px

---

# AuthHeader

## Purpose

Introduces the authentication page.

## Content

- Page title
- Optional description

Examples:

Connexion

Créer un compte

Mot de passe oublié

---

# GoogleButton

## Purpose

Primary authentication action.

## Priority

Highest priority component.

Google authentication is always presented before Email authentication.

## States

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

# EmailField

Standard email input.

Validation feedback displayed below the field.

---

# PasswordField

Password input supporting:

- show password
- hide password

Supports validation errors.

---

# TextField

Reusable component for:

- First Name
- Last Name
- Future profile forms

---

# PrimaryButton

Main action.

Examples:

Se connecter

Créer un compte

Continuer

---

# SecondaryButton

Secondary action.

Used only when required.

---

# TextLink

Examples:

Créer un compte

Mot de passe oublié

Retour

---

# ProfessionalEntry

Secondary card displayed below the authentication card.

Purpose:

Redirect lawyers to the professional journey.

Characteristics:

- visually subtle
- secondary hierarchy
- never competes with primary actions

---

# ErrorMessage

Displays backend validation errors.

Characteristics:

- concise
- friendly
- actionable

---

# LoadingSpinner

Used during:

- Login
- Register
- Google authentication
- Session restoration

Must remain minimal.

---

# SplashScreen

Displayed only during automatic session restoration.

Contains:

- Chaweer logo
- Loading indicator

No interactive element.

---

# EmptyState

Reserved for future authentication-related states.

Not used in US-008.

---

# Component Principles

All components must:

- be reusable
- support dark future evolution
- support accessibility
- expose loading state
- expose disabled state
- expose error state

No authentication component should contain business logic.

Components are presentation only.

---

# Screen Specifications

This section defines the expected behavior and composition of every authentication screen.

Each screen described here is considered the official visual reference.

---

# Screen 01 — Login

## Goal

Allow an existing user to authenticate quickly.

## Components

- AuthLayout
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- EmailField
- PasswordField
- PrimaryButton
- TextLink (Forgot Password)
- TextLink (Create Account)
- ProfessionalEntry

## Primary CTA

Se connecter

## Secondary CTA

Créer un compte

## UX Principles

- Google authentication appears first.
- Email form is immediately visible.
- User should authenticate in less than 20 seconds.

---

# Screen 02 — Register

## Goal

Allow a new user to choose an authentication method.

## Components

- AuthLayout
- AuthCard
- AuthHeader
- GoogleButton
- Divider
- PrimaryButton ("Continuer avec votre adresse e-mail")
- ProfessionalEntry

## UX Principles

No registration form is displayed initially.

The user chooses:

- Google

or

- Email

---

# Screen 03 — Email Registration

## Components

- AuthLayout
- AuthCard
- AuthHeader
- TextField (First Name)
- TextField (Last Name)
- EmailField
- PasswordField
- Password Confirmation
- PrimaryButton

## Goal

Collect only the minimum information required to create an account.

---

# Screen 04 — Google Authentication Loading

## Components

- AuthLayout
- LoadingSpinner

## Message

Connexion à Google...

Please wait.

No interaction is allowed.

---

# Screen 05 — Authentication Error

## Components

- AuthLayout
- AuthCard
- ErrorMessage
- PrimaryButton ("Réessayer")

## Goal

Explain the problem without exposing technical details.

---

# Screen 06 — Session Restoration

## Components

- SplashScreen

## Behavior

Displayed while:

POST /auth/refresh

↓

GET /auth/me

↓

AuthProvider initialization

No interaction allowed.

---

# Screen 07 — Forgot Password

Placeholder only.

Not implemented in US-008.

---

# Screen 08 — Professional Entry

Displays only:

Vous êtes avocat ?

↓

Accéder à l'espace avocat

This screen is informational only.

The complete professional journey belongs to a future User Story.

---

# Responsive Behavior

Every screen must exist in:

- Desktop
- Tablet
- Mobile

The visual hierarchy must remain identical.

Only layout adapts.

---

# Navigation Flows

## Login

Login

↓

POST /auth/login

↓

GET /auth/me

↓

Home

---

## Register Email

Register

↓

POST /auth/register

↓

GET /auth/me

↓

Home

---

## Register Google

Google

↓

POST /auth/google/client

↓

GET /auth/me

↓

Home

---

## Session Restore

Application Start

↓

POST /auth/refresh

↓

GET /auth/me

↓

Application Ready

---

## Logout

Logout

↓

POST /auth/logout

↓

Anonymous User

↓

Home
