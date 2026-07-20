# Sprint 03 — Professional Onboarding

> **Status:** Planned  
> **EPICs:** EP-03 Professional Onboarding, EP-11 Administration (partial)  
> **Release:** 0.4.0

---

## Objective

Enable lawyers (avocats) to register on Chaweer, submit their professional credentials, complete an initial profile, and pass through admin verification before appearing in the public directory.

## Sprint Goal

A lawyer can register, submit credentials, complete their initial profile, and an admin can approve/reject the application.

## Initial Backlog

| ID | Title | Priority | Status | Dependencies | US File |
|---|---|---|---|---|---|
| US-028 | Professional Registration (Avocat) | High | Planned | EP-01 | [`US-028.md`](../03-functional/US-028.md) |
| US-029 | Identity & Bar Association Verification | High | Planned | US-028 | [`US-029.md`](../03-functional/US-029.md) |
| US-030 | Professional Document Upload | High | Planned | US-028 | [`US-030.md`](../03-functional/US-030.md) |
| US-031 | Specializations & Languages Selection | High | Planned | US-028 | [`US-031.md`](../03-functional/US-031.md) |
| US-032 | Professional Profile Setup (Initial) | High | Planned | US-028, US-031 | [`US-032.md`](../03-functional/US-032.md) |
| US-033 | Onboarding Wizard (Multi-step Flow) | High | Planned | US-028→032 | [`US-033.md`](../03-functional/US-033.md) |
| US-034 | Admin Verification Review | High | Planned | US-029, US-030 | [`US-034.md`](../03-functional/US-034.md) |

## Key Design Decisions

- **D-006**: Professional onboarding requires admin verification gate — lawyers cannot appear in the public directory until an admin approves their credentials

## Dependencies

- EP-01 Authentication (professional entry via "Espace avocat")
- EP-11 Administration (US-082 for verification management)

## Notes

- This sprint is **preparation only** — no implementation has started
- Awaiting approval before starting implementation
- Design specs for professional onboarding screens to be created during sprint planning

## Related Documents

- [`EP-03-Professional-Onboarding.md`](../01-epics/EP-03-Professional-Onboarding.md)
- [`EP-11-Administration.md`](../01-epics/EP-11-Administration.md)
- [`Releases.md`](../00-product/Releases.md)
- [`Decisions.md`](../00-product/Decisions.md) — D-006
- [`Screens.md`](../07-design/Screens.md) — Screen 10: Professional Entry
