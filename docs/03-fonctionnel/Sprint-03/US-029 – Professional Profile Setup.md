# US-029 – Professional Profile Setup

## Informations générales

| Champ | Valeur |
|--------|---------|
| ID | US-029 |
| Epic | EP-01 – Professional Onboarding |
| Titre | Professional Profile Setup |
| Priorité | High |
| Statut | Planned |
| Sprint | Sprint 03 |
| Acteur principal | Professionnel |

---

# User Story

**En tant que** professionnel,

**Je souhaite** compléter mon profil professionnel,

**Afin de** préparer la publication de mon profil sur Chaweer.

---

# Objectif

Permettre au professionnel de compléter les informations constituant son identité professionnelle.

À l'issue de cette User Story, le profil reste en statut **Draft** et n'est pas encore visible publiquement.

---

# Contexte

Après la création de son compte professionnel, l'avocat doit compléter progressivement son profil.

Ce profil permettra ultérieurement sa publication sur Chaweer.

Cette User Story concerne uniquement les informations d'identité et de présentation du professionnel.

Les spécialités, les langues, les prestations, les tarifs et les disponibilités sont traités dans des User Stories distinctes.

---

# Parcours utilisateur

Le professionnel accède à la page **Mon profil professionnel**.

Il complète les différentes informations demandées.

Il peut enregistrer ses modifications à tout moment.

Le profil reste en brouillon.

---

# Fonctionnalités

## Informations personnelles

Le professionnel peut renseigner :

- Nom
- Prénom
- Photo de profil

---

## Informations professionnelles

Le professionnel peut renseigner :

- Barreau
- Ville d'exercice
- Téléphone professionnel
- Adresse du cabinet (optionnelle)

---

## Présentation

Le professionnel peut rédiger :

- Biographie professionnelle

---

# Règles de gestion

### RG-PRO-010

Le professionnel peut modifier son profil à tout moment.

---

### RG-PRO-011

Les modifications sont enregistrées sans publier le profil.

---

### RG-PRO-012

Le profil conserve le statut **Draft**.

---

### RG-PRO-013

Un profil en statut **Draft** n'est jamais visible publiquement.

---

# Impact modèle de données

## Entité Professional

Ajout des attributs suivants :

| Attribut | Type |
|----------|------|
| firstName | String |
| lastName | String |
| photoUrl | String |
| bio | Text |
| barAssociationId | UUID |
| cityId | UUID |
| professionalPhone | String |
| officeAddress | String (nullable) |

Aucune nouvelle entité n'est créée.

---

# Impact API

## Consultation

```
GET /api/me/professional
```

---

## Modification

```
PATCH /api/me/professional
```

---

## Photo

```
POST /api/me/professional/photo
```

---

# Impact UI

## Nouvelle page

```
Espace Professionnel
    └── Mon profil professionnel
```

---

## Sections

### Informations personnelles

- Photo
- Nom
- Prénom

### Informations professionnelles

- Barreau
- Ville
- Téléphone professionnel
- Adresse du cabinet

### Présentation

- Biographie

---

# Validation

| Champ | Obligatoire |
|--------|-------------|
| Nom | Oui |
| Prénom | Oui |
| Barreau | Oui |
| Ville | Oui |
| Téléphone professionnel | Oui |
| Photo | Non (obligatoire pour la publication) |
| Biographie | Non (obligatoire pour la publication) |
| Adresse cabinet | Non |

---

# Critères d'acceptation

## AC-001

Le professionnel peut consulter son profil.

---

## AC-002

Le professionnel peut modifier les informations autorisées.

---

## AC-003

Les modifications sont enregistrées.

---

## AC-004

Le profil reste en statut **Draft**.

---

## AC-005

Le profil n'est pas visible sur la plateforme.

---

# Hors périmètre

Cette User Story ne couvre pas :

- Les spécialités
- Les langues
- Les prestations
- Les tarifs
- Les disponibilités
- La publication du profil

---

# Dépendances

## Prérequis

- US-028 – Professional Account Registration

## User Story suivante

- US-030 – Professional Competencies

---

# Definition of Done

- Écran disponible.
- Consultation du profil.
- Modification du profil.
- Validation des données.
- Persistance des données.
- Tests unitaires.
- Tests d'intégration.
- Documentation API mise à jour.