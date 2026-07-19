---
title: US-010 — Identity & Profile Domain
id: US-010
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-009 Identity & Profile Vision
next:
  - US-011 Registration & Progressive Onboarding
---

# US-010 — Identity & Profile Domain

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit les responsabilités métier du domaine **Identity & Profile**.

Elle décrit les frontières fonctionnelles du domaine, ses concepts principaux, ses interactions avec les autres domaines et les règles métier qui lui appartiennent.

Elle ne décrit ni le modèle objet détaillé, ni les API, ni la base de données.

---

# 2. Vision du domaine

Le domaine **Identity & Profile** est responsable de l'identité numérique des utilisateurs de Chaweer.

Il permet de :

- créer un compte ;
- authentifier un utilisateur via un Identity Provider ;
- gérer les informations personnelles ;
- gérer les profils professionnels ;
- publier les profils professionnels ;
- garantir l'unicité des identités.

Le domaine constitue le point d'entrée de tous les utilisateurs de la plateforme.

---

# 3. Responsabilités

Le domaine est responsable de :

- la création des comptes ;
- la gestion des Identity Providers ;
- la gestion des profils utilisateurs ;
- la gestion des profils professionnels ;
- la publication des profils professionnels ;
- la confidentialité des données personnelles ;
- l'évolution d'un Client vers un Professionnel ;
- la production des événements métier liés à l'identité.

---

# 4. Hors responsabilités

Le domaine n'est pas responsable :

- des autorisations applicatives ;
- des permissions ;
- des consultations ;
- des rendez-vous ;
- des paiements ;
- de la messagerie ;
- des notifications ;
- des avis ;
- de la recherche ;
- de la certification des professionnels.

---

# 5. Concepts métier

Le domaine repose sur les concepts suivants.

| Concept | Description |
|----------|-------------|
| Account | Représente le compte utilisateur. |
| IdentityProvider | Mode d'identification utilisé par un compte. |
| Profile | Informations privées de l'utilisateur. |
| ProfessionalProfile | Profil public d'un professionnel. |
| Publication | Processus rendant un profil visible. |

---

# 6. Acteurs

Le domaine concerne les acteurs suivants :

- Visiteur
- Client
- Professionnel
- Assistant
- Administrateur

---

# 7. Principes métier

Le domaine applique les principes suivants :

- un utilisateur possède un seul Account ;
- un Account possède exactement un Profile ;
- un utilisateur possède au maximum un ProfessionalProfile ;
- un Account peut être associé à un ou plusieurs Identity Providers ;
- chaque Identity Provider est associé à un seul Account ;
- les informations sont collectées progressivement ;
- le profil professionnel est indépendant du profil personnel ;
- la publication est automatique lorsque les critères sont satisfaits ;
- la certification est indépendante de la publication ;
- les informations privées ne sont jamais rendues publiques.

---

# 8. États métier

## Profile

- Active
- Suspended
- Banned

---

## ProfessionalProfile

- Draft
- Published
- Hidden
- Incomplete
- Archived
- Banned

---

# 9. Cycle de vie

## Account

```
Création
      │
      ▼
Compte actif
```

---

## Profile

```
Active
   │
   ├────────► Suspended
   │
   └────────► Banned
```

---

## ProfessionalProfile

```
Draft
   │
   ▼
Published
   │
   ├────────► Hidden
   │
   ├────────► Incomplete
   │
   ├────────► Archived
   │
   └────────► Banned

Incomplete
     │
     ▼
Published
```

---

# 10. Règles métier

RM-010-01

Chaque utilisateur possède exactement un Account.

---

RM-010-02

Chaque Account possède exactement un Profile.

---

RM-010-03

Un utilisateur possède au maximum un ProfessionalProfile.

---

RM-010-04

Un Account peut être associé à un ou plusieurs Identity Providers.

---

RM-010-05

Un Identity Provider ne peut appartenir qu'à un seul Account.

---

RM-010-06

Un ProfessionalProfile est créé en état Draft.

---

RM-010-07

Un ProfessionalProfile est publié automatiquement lorsque tous les critères métier sont satisfaits.

---

RM-010-08

La perte d'un critère de publication entraîne automatiquement le passage à l'état Incomplete.

---

RM-010-09

Un ProfessionalProfile Hidden n'est jamais visible publiquement.

---

RM-010-10

Un ProfessionalProfile Archived n'est jamais visible publiquement.

---

RM-010-11

Un ProfessionalProfile Banned n'est jamais visible publiquement.

---

RM-010-12

Les informations privées du Profile ne sont jamais exposées dans le ProfessionalProfile.

---

RM-010-13

La certification d'un professionnel est indépendante de la publication.

---

RM-010-14

La suppression d'un Account est réalisée sous forme de suppression logique.

---

# 11. Événements métier

Le domaine produit notamment les événements suivants :

- AccountCreated
- IdentityProviderLinked
- IdentityProviderUnlinked
- PrimaryIdentityProviderChanged
- ProfileCreated
- ProfessionalProfileCreated
- ProfessionalProfilePublished
- ProfessionalProfileHidden
- ProfessionalProfileIncomplete
- ProfessionalProfileRepublished
- ProfessionalProfileArchived
- ProfileSuspended
- ProfileReactivated
- ProfileBanned
- ProfessionalProfileBanned

---

# 12. Dépendances

Le domaine **Identity & Profile** constitue une fondation pour :

- Consultations
- Rendez-vous
- Paiements
- Avis
- Messagerie
- Notifications
- Agenda
- Recherche
- IAM & Permissions

Le domaine ne dépend d'aucun domaine métier.

---

# 13. Hors périmètre

Cette User Story ne décrit pas :

- le Domain Model détaillé ;
- les Value Objects ;
- les Aggregate Roots ;
- les Services applicatifs ;
- les API REST ;
- les DTO ;
- les Controllers ;
- la base de données ;
- la persistance ;
- les écrans utilisateur.

---

# 14. Résultat attendu

À l'issue de cette User Story, les responsabilités, les frontières, les concepts métier, les règles fonctionnelles et les cycles de vie du domaine **Identity & Profile** sont définis.

Cette User Story constitue la référence métier utilisée pour la conception du Domain Model (US-012) et des User Stories techniques du Sprint 02.