---
title: US-012 — Identity & Profile Domain Model
id: US-012
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-011 Registration & Progressive Onboarding
next:
  - US-013 Application Layer
---

# US-012 — Identity & Profile Domain Model

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story décrit le Domain Model du domaine **Identity & Profile**.

Elle définit les concepts métier, leurs responsabilités, leurs relations ainsi que les règles fondamentales qui structurent le domaine.

Ce document constitue la référence utilisée par les couches Application, Backend, API, Base de données et Frontend.

Aucune décision technique (framework, ORM, API, base de données, persistance...) n'est prise dans cette User Story.

---

# 2. Vision

Le domaine **Identity & Profile** est responsable de l'identité numérique des utilisateurs de Chaweer.

Il garantit :

- l'unicité des comptes ;
- la gestion des Identity Providers ;
- la gestion des profils privés ;
- la gestion des profils professionnels ;
- la confidentialité des données personnelles ;
- la publication automatique des profils professionnels ;
- la production des événements métier liés à l'identité.

Le Domain Model est indépendant des technologies utilisées.

---

# 3. Bounded Context

Identity & Profile constitue un Bounded Context autonome.

Il possède :

- son propre langage métier ;
- ses propres règles ;
- ses propres événements ;
- ses propres agrégats.

Les autres domaines communiquent avec lui uniquement via ses événements métier.

---

# 4. Responsabilités

Le domaine est responsable de :

- gérer les Accounts ;
- gérer les Identity Providers ;
- gérer les Profiles ;
- gérer les ProfessionalProfiles ;
- protéger les informations privées ;
- publier les profils professionnels ;
- produire les événements métier.

Le domaine n'est pas responsable :

- des permissions ;
- des rôles applicatifs ;
- des consultations ;
- des rendez-vous ;
- des paiements ;
- des notifications ;
- de la messagerie ;
- de la recherche ;
- de la certification.

---

# 5. Langage Ubiquitaire

| Terme | Définition |
|--------|------------|
| Account | Compte utilisateur Chaweer. |
| IdentityProvider | Mode d'identification associé à un Account. |
| Profile | Profil privé d'un utilisateur. |
| ProfessionalProfile | Profil public d'un professionnel. |
| Publication | Processus rendant un profil visible. |
| Draft | Profil non publié. |
| Published | Profil publié. |
| Hidden | Profil volontairement masqué. |
| Incomplete | Profil ne satisfaisant plus les critères de publication. |
| Archived | Profil retiré définitivement. |
| Banned | Profil interdit d'utilisation. |

---

# 6. Aggregate Roots

Le domaine possède deux Aggregate Roots.

## Account

Responsable de :

- l'identité du compte ;
- les Identity Providers associés ;
- l'état du compte ;
- le Profile associé.

---

## ProfessionalProfile

Responsable de :

- la publication ;
- la visibilité ;
- les critères métier ;
- son cycle de vie.

---

# 7. Entités

## Account

### Description

Représente un compte Chaweer.

### Responsabilités

- gérer les Identity Providers ;
- gérer l'état du compte ;
- créer automatiquement le Profile.

---

## Profile

### Description

Contient les informations privées d'un utilisateur.

### Responsabilités

- stocker les données personnelles ;
- protéger leur confidentialité.

---

## ProfessionalProfile

### Description

Représente le profil public d'un professionnel.

### Responsabilités

- gérer la visibilité ;
- gérer la publication ;
- gérer les informations professionnelles ;
- appliquer les critères métier.

# 8. Value Objects

Les Value Objects sont immuables.

Ils représentent des concepts métier sans identité propre.

---

## IdentityProvider

Représente le mode d'identification utilisé par un Account.

En V1, les Identity Providers supportés sont :

- Email
- PhoneNumber
- Google

Chaque IdentityProvider permet de créer ou d'authentifier un Account.

Le Domain Model est indépendant du mode d'identification utilisé.

Le modèle est conçu pour intégrer ultérieurement de nouveaux Identity Providers (Apple, Microsoft, etc.) sans remise en cause de l'architecture du domaine.

---

## Email

Responsabilités :

- validation du format ;
- normalisation ;
- comparaison.

---

## PhoneNumber

Responsabilités :

- validation ;
- normalisation ;
- comparaison.

---

## FullName

Responsabilités :

- nom ;
- prénom.

---

## Address

Responsabilités :

- adresse professionnelle ;
- ville ;
- pays.

---

## Biography

Responsabilités :

- texte de présentation ;
- longueur minimale.

---

## BarAssociation

Responsabilités :

- barreau d'appartenance.

---

## PracticeArea

Responsabilités :

- domaine d'intervention.

---

# 9. Énumérations

## ProfileStatus

- Active
- Suspended
- Banned

---

## ProfessionalProfileStatus

- Draft
- Published
- Hidden
- Incomplete
- Archived
- Banned

---

# 10. Domain Services

Les Domain Services regroupent les règles métier qui ne relèvent d'aucun Aggregate Root.

---

## PublicationPolicy

Détermine si un ProfessionalProfile peut être publié.

---

## PublicationCriteria

Vérifie que tous les critères métier de publication sont satisfaits.

---

## IdentityService

Coordonne les opérations impliquant plusieurs agrégats.

Exemples :

- création d'un Account ;
- création d'un ProfessionalProfile ;
- association d'un IdentityProvider ;
- changement de l'IdentityProvider principal.

---

# 11. Factories

## AccountFactory

Crée un nouvel Account accompagné de son Profile.

L'Account est toujours créé avec au moins un IdentityProvider.

---

## ProfessionalProfileFactory

Crée un ProfessionalProfile dans l'état Draft.

---

# 12. Repositories

## AccountRepository

Charge et sauvegarde un Account.

Garantit le respect des invariants de l'agrégat.

---

## ProfessionalProfileRepository

Charge et sauvegarde un ProfessionalProfile.

Garantit le respect des règles de publication.

# 13. Domain Events

Le domaine produit les événements métier suivants :

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

# 14. Invariants

Les invariants suivants doivent toujours être respectés.

- Un Account possède exactement un Profile.
- Un Account est toujours associé à au moins un IdentityProvider.
- Un IdentityProvider ne peut être associé qu'à un seul Account.
- Un utilisateur possède au maximum un ProfessionalProfile.
- Un ProfessionalProfile appartient obligatoirement à un Profile existant.
- Un ProfessionalProfile Published satisfait toujours les critères de publication.
- Les informations privées ne sont jamais exposées publiquement.
- Un ProfessionalProfile Hidden n'est jamais visible.
- Un ProfessionalProfile Incomplete n'est jamais visible.
- Un ProfessionalProfile Archived n'est jamais visible.
- Un ProfessionalProfile Banned n'est jamais visible.

---

# 15. Relations

```text
Account
 │
 ├────────► IdentityProvider
 │
 ▼
Profile
 │
 ▼
ProfessionalProfile

ProfessionalProfile
 │
 ├────────► Address
 ├────────► Biography
 ├────────► BarAssociation
 ├────────► PracticeArea
 └────────► FullName
```

---

# 16. Règles de conception

Le Domain Model respecte les principes suivants :

- Rich Domain Model ;
- Encapsulation des règles métier ;
- Immutabilité des Value Objects ;
- Les invariants sont garantis par les Aggregate Roots ;
- Aucun accès direct aux données depuis les autres domaines ;
- Toute modification métier passe par un Aggregate Root ;
- Les événements métier représentent des faits métier déjà réalisés ;
- Le Domain Model reste indépendant des technologies d'implémentation ;
- Les règles métier ne dépendent ni de l'interface utilisateur ni de la persistance.

# 17. Dépendances

Le domaine **Identity & Profile** dépend uniquement de :

- Shared Kernel.

Il ne dépend d'aucun autre domaine métier.

Les autres domaines consomment les événements métier produits par **Identity & Profile** sans accéder directement à son modèle interne.

---

# 18. Hors périmètre

Cette User Story ne décrit pas :

- les Services applicatifs ;
- les Use Cases ;
- les API REST ;
- les DTO ;
- les Controllers ;
- les mécanismes OAuth ;
- les protocoles OpenID Connect ;
- les mécanismes MFA ;
- les permissions applicatives ;
- les rôles techniques ;
- Prisma ;
- PostgreSQL ;
- la persistance ;
- les migrations ;
- Express ;
- React ;
- les écrans utilisateur ;
- les tests.

Ces éléments seront définis dans les User Stories techniques suivantes.

---

# 19. Résultat attendu

À l'issue de cette User Story, le Domain Model du domaine **Identity & Profile** est entièrement défini.

Les Aggregate Roots, les Entités, les Value Objects, les Énumérations, les Domain Services, les Factories, les Repositories, les événements métier, les invariants et les relations sont validés.

Cette User Story constitue la référence de conception utilisée par :

- US-013 — Application Layer ;
- US-014 — Backend Architecture ;
- US-015 — REST API ;
- US-016 — Database Design ;
- US-017 — Frontend Architecture ;
- US-018 — Security ;
- US-019 — Testing Strategy.

Toute implémentation du domaine **Identity & Profile** devra respecter les concepts et les invariants définis dans ce document.