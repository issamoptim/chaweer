# Review Checklist — US-023

Reference:

../03-fonctionnel/US-023-Securite-du-compte.md

---

# Functional Review

## Account Information

- [ ] Authentication provider is displayed.
- [ ] Email address is displayed.
- [ ] Email is read-only.
- [ ] Authentication provider is read-only.

---

## Password

### Email Account

- [ ] Current password field is displayed.
- [ ] New password field is displayed.
- [ ] Confirmation field is displayed.
- [ ] Validation works correctly.
- [ ] Password update succeeds.
- [ ] Error messages are displayed correctly.

---

### Google Account

- [ ] Password form is hidden.
- [ ] Informational message is displayed.
- [ ] No password action is available.

---

## Delete Account

- [ ] Delete card is displayed.
- [ ] Warning message is visible.
- [ ] Confirmation dialog opens.
- [ ] Cancel closes dialog.
- [ ] Delete confirms action.
- [ ] User is logged out.
- [ ] User is redirected correctly.

---

# UI Review

- [ ] Layout matches design.
- [ ] Typography matches Design System.
- [ ] Colors match Design System.
- [ ] Icons match Design System.
- [ ] Spacing is consistent.
- [ ] Cards are consistent.
- [ ] Buttons are consistent.
- [ ] Forms are consistent.

---

# Responsive Review

## Desktop

- [ ] Layout validated.

## Tablet

- [ ] Layout validated.

## Mobile

- [ ] Layout validated.

---

# Accessibility Review

- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Labels are associated correctly.
- [ ] Error messages are accessible.
- [ ] Dialog traps focus correctly.
- [ ] Contrast meets WCAG AA.

---

# Technical Review

- [ ] No TypeScript errors.
- [ ] No ESLint errors.
- [ ] No console errors.
- [ ] No duplicated code.
- [ ] Existing components reused.
- [ ] No unnecessary re-render.
- [ ] Existing APIs reused.
- [ ] Existing architecture respected.

---

# Testing

- [ ] Happy path validated.
- [ ] Validation errors tested.
- [ ] API errors tested.
- [ ] Network errors tested.
- [ ] Unauthorized scenario tested.
- [ ] Google scenario tested.
- [ ] Email scenario tested.

---

# Regression

- [ ] Authentication still works.
- [ ] Profile page unaffected.
- [ ] Navigation unaffected.
- [ ] Existing routes unaffected.
- [ ] Existing tests still pass.

---

# Product Validation

- [ ] All acceptance criteria satisfied.
- [ ] Functional specification respected.
- [ ] No undocumented behavior.
- [ ] Product Owner approval.

---

# Ready for Merge

- [ ] Code reviewed.
- [ ] QA approved.
- [ ] Ready for production.