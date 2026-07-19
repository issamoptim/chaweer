# Profile Design Specification

## US-021 — Mon Profil

---

# Document Information

| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Draft |
| Sprint | Sprint 02 |
| Epic | EP-002 — Gestion des Comptes |
| Related User Story | US-021 — Mon Profil |
| Product Owner | Pending Review |
| Last Updated | YYYY-MM-DD |

---

# Purpose

This document is the official UX/UI reference for the **Mon Profil** experience.

It complements the functional specification by defining the complete visual and interaction behavior of the profile screen.

This specification is the single source of truth for the profile interface.

It defines:

- information architecture
- visual hierarchy
- reusable components
- responsive behavior
- interaction patterns
- accessibility requirements
- UX decisions

Implementation details, business rules and backend behavior are intentionally excluded.

---

# Scope

This document covers the complete **Mon Profil** experience for Grand Public users.

Included:

- Profile screen
- Profile summary
- Personal information
- Language preferences
- Notification preferences
- Delete account entry point
- Responsive behavior
- Loading state
- Error state
- Empty state

Excluded:

- Edit Profile (US-022)
- Professional Profile
- Security settings
- Password management
- Billing
- Subscription management

---

# Status

This document has been reviewed and approved.

Any modification affecting the profile user experience must be validated by the Product Owner before implementation.

In case of conflict between implementation and this specification, this document prevails.

---

# Design Philosophy

The profile is not intended to encourage editing.

Its primary purpose is to reassure users by presenting their account information in a clear, calm and trustworthy way.

The profile experience must feel:

- Premium
- Minimal
- Human
- Trustworthy
- Consistent with the Chaweer Design System

The interface should reduce cognitive load by grouping related information into clear sections and exposing only the actions relevant to the current context.

---

# Product Principles

## Read First

The profile is primarily a consultation experience.

Users should immediately understand who they are logged in as and review their personal information without unnecessary interaction.

---

## Progressive Editing

Personal information is edited from US-022.

Only lightweight preferences such as language and notification settings may be updated directly from this screen.

---

## Consistency

The profile extends the existing Chaweer Design System.

Typography, spacing, colors and reusable components must remain consistent with the authentication experience.

---

## Simplicity

Only information useful to the user is displayed.

No administrative or technical information should appear.

---

## Trust

The interface should inspire confidence by presenting accurate information with a clean and uncluttered layout.

---

# Screen Specification

This section defines the official layout of the **Mon Profil** screen.

---

## Desktop

The page uses a centered content container with a comfortable maximum width.

The layout is composed of vertically stacked cards.

The screen contains:

- Profile Header
- Profile Summary Card
- Personal Information Card
- Preferences Card
- Danger Zone

The Profile Summary Card is displayed first and highlights the user's identity.

Personal information is displayed in a read-only format.

A primary button allows navigation to **Modifier mon profil (US-022)**.

Language and notification preferences remain directly editable.

The Danger Zone is displayed at the bottom of the page and visually separated from other content.

---

## Tablet

The layout preserves the same information hierarchy.

Cards expand to fit the available width while maintaining consistent spacing.

All actions remain accessible without horizontal scrolling.

---

## Mobile

Cards are displayed in a single-column layout.

Spacing is optimized for touch interaction.

Buttons occupy the available width when appropriate.

The information hierarchy remains identical to Desktop.

---

# Components

The profile screen is built exclusively using components from the Chaweer Design System.

---

## Profile Header

Displays:

- Page title
- Optional description

---

## Profile Summary Card

Displays:

- Initials avatar
- Full name
- Account type
- Email address

---

## Personal Information Card

Displays:

- First name
- Last name
- Contact email
- Contact phone
- Country
- City
- Nationality

Read-only.

Contains the **Modifier mon profil** action.

---

## Preferences Card

Displays:

- Language selector
- Notification preferences

Changes are applied immediately after confirmation.

---

## Danger Zone

Contains destructive actions.

Currently:

- Delete account

This section is visually isolated from the rest of the interface.

---

## Toast

Displays short success messages.

Examples:

- Language updated
- Preferences saved

---

## Confirmation Modal

Used before irreversible actions.

Currently:

- Delete account

---

# States

The profile supports the following interface states.

---

## Default

All profile information is successfully loaded.

---

## Loading

Skeleton placeholders are displayed while profile data is loading.

---

## Empty

Optional fields display **"Not provided"** when no value exists.

The layout remains unchanged.

---

## Error

A friendly error message is displayed.

Users can retry loading the profile.

Technical details are never exposed.

---

## Delete Confirmation

A confirmation modal explains the consequences of account deletion before continuing.

---

## Success

Toast notifications confirm successful updates to preferences.

---

# Responsive Behavior

## Desktop

Maximum width container.

Centered layout.

Stacked cards.

---

## Tablet

Adaptive spacing.

Single-column layout.

---

## Mobile

Full-width cards.

Touch-friendly spacing.

Primary actions occupy the available width when necessary.

---

# Accessibility

The profile experience follows WCAG AA guidelines.

Requirements include:

- Keyboard navigation
- Visible focus indicators
- Screen reader compatibility
- Sufficient color contrast
- Accessible labels for interactive controls
- Minimum touch target size of 44 × 44 pixels

Accessibility is considered a core requirement rather than an enhancement.

---

# UX Decisions

The following decisions were validated during the profile design review.

---

## Read-Only Information

Personal information is displayed in read-only mode.

Editing is delegated to US-022.

---

## Initials Avatar

No profile picture is required.

The interface displays an avatar generated from the user's initials.

---

## Language Preferences

Language can be updated directly from the profile screen.

The interface language changes immediately after selection.

---

## Notification Preferences

Notification preferences can be updated without leaving the profile.

Security notifications cannot be disabled.

---

## Danger Zone

Account deletion is isolated inside a dedicated Danger Zone.

Destructive actions never compete with primary actions.

---

## Empty Values

Optional information without a value displays:

"Not provided"

instead of leaving empty space.

---

## Consistency

The profile extends the Chaweer Design System without introducing new visual patterns.

---

## Design Freeze

This document represents the approved profile experience.

Implementation must faithfully reproduce these specifications.

Any UX modification requires Product Owner approval.

---

# Future Evolution

Future profile improvements may include:

- Profile picture
- Connected accounts
- Security settings
- Session history
- Privacy preferences
- Activity history
- Multi-role profile support

These features are intentionally excluded from US-021.

---

# References

Related documents:

- US-021 — Mon Profil (Functional Specification)
- Authentication Design Specification (US-008)
- Chaweer Design System

---

# Glossary

Profile Summary Card

The card presenting the user's identity and general account information.

---

Personal Information Card

The card displaying personal information associated with the account.

---

Preferences Card

The card allowing users to manage language and notification preferences.

---

Danger Zone

The section containing destructive actions such as account deletion.

---

Design Freeze

The approved UX specification that serves as the implementation reference.