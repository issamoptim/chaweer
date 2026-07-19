# US-021 — UI Decisions

## Status

Design reviewed and validated with minor adjustments.

---

# UI-001 — Global consistency

The screen must strictly follow the Authentication design system.

No new visual language may be introduced.

---

# UI-002 — Avatar

No profile picture upload.

Display an automatically generated avatar using the user's initials.

---

# UI-003 — Personal information

The personal information section is read-only.

Editing is performed exclusively from **US-022 – Modifier mon profil**.

---

# UI-004 — Edit action

A primary button **"Modifier mon profil"** must be displayed in the page header.

It navigates to US-022.

---

# UI-005 — Read-only badge

Remove the "Lecture seule" badge.

The explanatory text is sufficient.

---

# UI-006 — Language

Language is editable directly from this page.

The change is immediate.

A success toast confirms the update.

---

# UI-007 — Notification preferences

Notification preferences are editable directly from this page.

Changes are saved immediately.

A success toast confirms the update.

---

# UI-008 — Optional fields

Optional fields are always displayed.

When no value exists, display:

"Non renseigné"

Never hide optional fields.

---

# UI-009 — Delete account

The action "Supprimer mon compte" must appear as a subtle destructive action.

It opens a confirmation modal.

The modal follows ADR-004.

---

# UI-010 — States

The following states are required:

- Default
- Loading
- Optional fields empty
- Success
- Error
- Delete confirmation

---

# UI-011 — Responsive

Desktop, Tablet and Mobile must remain visually consistent with the Authentication module.

---

# Final validation

The design is approved subject to the adjustments described above.