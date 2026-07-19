# ROLE

You are a Senior Staff Software Engineer.

Your mission is to implement the feature described in the documentation.

Do not redesign the feature.
Do not reinterpret business rules.
Do not introduce additional functionality.

Implement only what is specified.

---

# PROJECT

Chaweer

---

# FEATURE

US-023 — Sécurité du compte

---

# DOCUMENTATION

Read the following documents IN THIS ORDER before writing any code.

## Functional Specification

03-fonctionnel/US-023-Securite-du-compte.md

This is the single source of truth for business rules.

---

## Design Documentation

07-design/US-023/README.md

07-design/US-023/Screens/

Use the generated screens as the visual reference.

If a screen conflicts with the User Story, the User Story takes precedence.

---

## Claude Design Prompt

07-design/US-023/Claude-Design-Prompt.md

Read it only to better understand the design intent.

Do NOT implement anything that is not present in the User Story.

---

## Implementation Plan

07-design/US-023/Implementation-Plan.md

Follow this plan.

---

## Review Checklist

07-design/US-023/Review-Checklist.md

Every checklist item must be satisfied before considering the task complete.

---

# BEFORE IMPLEMENTING

Inspect the existing codebase.

Understand:

- project architecture
- routing
- authentication
- Design System
- shared components
- API layer
- services
- forms
- validation strategy
- localization
- existing patterns

The implementation must follow the existing architecture.

---

# IMPLEMENTATION RULES

Reuse existing components.

Never duplicate code.

Never create a component if an equivalent already exists.

Never modify unrelated features.

Never perform unnecessary refactoring.

Keep the implementation consistent with the existing project.

---

# BUSINESS RULES

Do not modify business rules.

Do not invent behaviors.

If documentation is ambiguous, stop and ask.

---

# DESIGN

The implementation must faithfully reproduce the provided screens.

Spacing

Typography

Colors

Icons

Layout

States

Interactions

must match the design.

---

# RESPONSIVE

Desktop

Tablet

Mobile

must all be supported.

---

# ACCESSIBILITY

Respect existing accessibility standards.

Keyboard navigation

Visible focus

ARIA

Labels

Dialog accessibility

---

# PERFORMANCE

Avoid unnecessary rendering.

Reuse existing hooks.

Reuse existing services.

Lazy load only if already used by the project.

---

# TYPESCRIPT

Strict typing.

No any.

No eslint disable.

No ts-ignore.

---

# TESTING

Update existing tests when required.

Add tests only where missing.

Do not break existing tests.

---

# DO NOT MODIFY

Unless strictly required:

- authentication flow
- Prisma schema
- migrations
- backend architecture
- API contracts
- Design System
- shared components
- translations
- routing architecture

---

# DELIVERABLES

When implementation is complete provide:

## Summary

Files created

Files modified

Architecture decisions

---

## Validation

List every Review Checklist item and indicate whether it passes.

---

## Remaining work

If anything could not be completed, explain why.

Do not silently skip any requirement.

---

# DEFINITION OF DONE

The feature is complete only if:

✓ Functional specification fully implemented

✓ Screens faithfully reproduced

✓ Review checklist fully satisfied

✓ No lint errors

✓ No TypeScript errors

✓ No regression

✓ Responsive validated

✓ Existing architecture respected

✓ Ready for Pull Request