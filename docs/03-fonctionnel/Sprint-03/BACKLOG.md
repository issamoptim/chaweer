# Sprint 03 — Professional Onboarding

## Objectif

Permettre aux avocats de s'inscrire sur Chaweer, soumettre leurs credentials professionnels, compléter leur profil initial, et passer par la vérification admin avant d'apparaître dans l'annuaire public.

**Sprint goal :** Un avocat peut s'inscrire, soumettre ses credentials, compléter son profil initial, et un admin peut approuver/rejeter la demande.

---

## EPICs

- [EP-03 — Professional Onboarding](../../01-epics/EP-03-Professional-Onboarding.md)
- [EP-11 — Administration](../../01-epics/EP-11-Administration.md) (partial — US-082)

---

## User Stories

| ID | Title | Priority | Status | Dependencies | US File |
|---|---|---|---|---|---|
| US-028 | Professional Registration (Avocat) | High | Planned | EP-01 | [`US-028.md`](../../03-functional/US-028.md) |
| US-029 | Identity & Bar Association Verification | High | Planned | US-028 | [`US-029.md`](../../03-functional/US-029.md) |
| US-030 | Professional Document Upload | High | Planned | US-028 | [`US-030.md`](../../03-functional/US-030.md) |
| US-031 | Specializations & Languages Selection | High | Planned | US-028 | [`US-031.md`](../../03-functional/US-031.md) |
| US-032 | Professional Profile Setup (Initial) | High | Planned | US-028, US-031 | [`US-032.md`](../../03-functional/US-032.md) |
| US-033 | Onboarding Wizard (Multi-step Flow) | High | Planned | US-028→032 | [`US-033.md`](../../03-functional/US-033.md) |
| US-034 | Admin Verification Review | High | Planned | US-029, US-030 | [`US-034.md`](../../03-functional/US-034.md) |

---

## Key Design Decisions

- **D-006** : L'onboarding professionnel nécessite une porte de vérification admin — les avocats ne peuvent pas apparaître dans l'annuaire public tant qu'un admin n'a pas approuvé leurs credentials. Voir [`Decisions.md`](../../00-product/Decisions.md).

---

## Dependencies

- EP-01 Authentication (professional entry via "Espace avocat")
- EP-11 Administration (US-082 for verification management)
- [`02-metier/Referentiels/Avocat/`](../../02-metier/Referentiels/Avocat/README.md) — Référentiel métier Avocat

---

## Statut

Planned — En attente d'approval avant implémentation.
