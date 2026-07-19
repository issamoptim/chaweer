---
title: US-013 — Identity & Profile Application Layer
id: US-013
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-012 Identity & Profile Domain Model
next:
  - US-014 Backend Architecture
---

# US-013 — Identity & Profile Application Layer

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story décrit la couche **Application** du domaine Identity & Profile.

Elle orchestre les cas d'utilisation de la plateforme en s'appuyant sur le Domain Model.

Elle coordonne les Aggregate Roots, les Domain Services, les Repositories et la publication des Domain Events.

Elle ne contient aucune règle métier.

Toutes les règles métier restent exclusivement dans le Domain Model.

---

# 2. Responsabilités

La couche Application est responsable de :

- exécuter les Use Cases ;
- charger les Aggregate Roots ;
- appeler les Domain Services ;
- sauvegarder les agrégats ;
- publier les Domain Events ;
- garantir les transactions ;
- coordonner les échanges entre le domaine et l'extérieur.

---

# 3. Non-responsabilités

La couche Application ne gère jamais :

- les règles métier ;
- la validation métier ;
- la persistance ;
- les API REST ;
- les DTO HTTP ;
- les Controllers ;
- les composants React ;
- Prisma ;
- PostgreSQL.

---

# 4. Architecture

```
Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer
```

La couche Application constitue le point d'entrée du Domain Model.

---

# 5. Dépendances

La couche Application dépend uniquement de :

- Domain Model
- Shared Kernel

Elle ne dépend d'aucune technologie.

---

# 6. Principes

La couche Application respecte les principes suivants :

- un Use Case réalise une seule intention métier ;
- un Use Case est transactionnel ;
- les Aggregate Roots restent les seuls responsables des règles métier ;
- la couche Application ne contient aucune logique métier ;
- les événements métier sont publiés uniquement après une transaction réussie ;
- chaque Use Case est indépendant des autres ;
- la couche Application est indépendante du protocole d'exposition (REST, GraphQL, CLI, etc.).

---

# 7. Acteurs

Les Use Cases sont exécutés par :

- Visiteur
- Client
- Professionnel
- Assistant
- Administrateur

---

# 8. Structure générale

Chaque Use Case suit le même déroulement.

```
Request

↓

Validation technique

↓

Chargement des Aggregate Roots

↓

Exécution des règles métier

↓

Sauvegarde

↓

Publication des Domain Events

↓

Response
```

# 9. Use Cases

La couche Application expose les Use Cases suivants.

---

## UC-013-01 — RegisterWithEmail

Objectif :

Créer un Account à partir d'une adresse e-mail.

Actions :

- vérifier les prérequis techniques ;
- créer l'Account ;
- créer le Profile ;
- associer l'IdentityProvider Email ;
- publier AccountCreated.

---

## UC-013-02 — RegisterWithPhoneNumber

Objectif :

Créer un Account à partir d'un numéro de téléphone.

Actions :

- vérifier les prérequis techniques ;
- créer l'Account ;
- créer le Profile ;
- associer l'IdentityProvider PhoneNumber ;
- publier AccountCreated.

---

## UC-013-03 — RegisterWithGoogle

Objectif :

Créer un Account à partir d'un compte Google.

Actions :

- vérifier les prérequis techniques ;
- créer l'Account ;
- créer le Profile ;
- associer l'IdentityProvider Google ;
- publier AccountCreated.

---

## UC-013-04 — LinkIdentityProvider

Objectif :

Associer un nouvel IdentityProvider à un Account existant.

Actions :

- charger l'Account ;
- vérifier les invariants ;
- associer l'IdentityProvider ;
- sauvegarder ;
- publier IdentityProviderLinked.

---

## UC-013-05 — UnlinkIdentityProvider

Objectif :

Supprimer un IdentityProvider.

Actions :

- charger l'Account ;
- vérifier les invariants ;
- supprimer l'IdentityProvider ;
- sauvegarder ;
- publier IdentityProviderUnlinked.

---

## UC-013-06 — UpdateProfile

Objectif :

Mettre à jour le Profile.

Actions :

- charger le Profile ;
- appliquer les modifications ;
- sauvegarder.

---

## UC-013-07 — BecomeProfessional

Objectif :

Créer un ProfessionalProfile.

Actions :

- charger l'Account ;
- créer le ProfessionalProfile ;
- état Draft ;
- sauvegarder ;
- publier ProfessionalProfileCreated.

---

## UC-013-08 — UpdateProfessionalProfile

Objectif :

Modifier un ProfessionalProfile.

Actions :

- charger le ProfessionalProfile ;
- appliquer les modifications ;
- réévaluer les critères de publication ;
- sauvegarder.

---

## UC-013-09 — PublishProfessionalProfile

Objectif :

Publier un ProfessionalProfile.

Actions :

- vérifier PublicationCriteria ;
- publier ;
- sauvegarder ;
- publier ProfessionalProfilePublished.

---

## UC-013-10 — HideProfessionalProfile

Objectif :

Masquer un ProfessionalProfile.

Actions :

- charger le ProfessionalProfile ;
- changer son état ;
- sauvegarder ;
- publier ProfessionalProfileHidden.

---

## UC-013-11 — ArchiveProfessionalProfile

Objectif :

Archiver un ProfessionalProfile.

Actions :

- charger le ProfessionalProfile ;
- archiver ;
- sauvegarder ;
- publier ProfessionalProfileArchived.

---

## UC-013-12 — SuspendProfile

Objectif :

Suspendre un utilisateur.

Actions :

- charger le Profile ;
- suspendre ;
- sauvegarder ;
- publier ProfileSuspended.

---

## UC-013-13 — BanProfile

Objectif :

Bannir un utilisateur.

Actions :

- charger le Profile ;
- bannir ;
- sauvegarder ;
- publier ProfileBanned.


# 10. Commands

Chaque modification du domaine est réalisée via une Command.

Les Commands expriment une intention métier.

---

## RegisterWithEmailCommand

Crée un Account avec l'IdentityProvider Email.

---

## RegisterWithPhoneNumberCommand

Crée un Account avec l'IdentityProvider PhoneNumber.

---

## RegisterWithGoogleCommand

Crée un Account avec l'IdentityProvider Google.

---

## LinkIdentityProviderCommand

Associe un nouvel IdentityProvider à un Account.

---

## UnlinkIdentityProviderCommand

Supprime un IdentityProvider d'un Account.

---

## UpdateProfileCommand

Met à jour un Profile.

---

## BecomeProfessionalCommand

Crée un ProfessionalProfile.

---

## UpdateProfessionalProfileCommand

Met à jour un ProfessionalProfile.

---

## PublishProfessionalProfileCommand

Publie un ProfessionalProfile.

---

## HideProfessionalProfileCommand

Masque un ProfessionalProfile.

---

## ArchiveProfessionalProfileCommand

Archive un ProfessionalProfile.

---

## SuspendProfileCommand

Suspend un utilisateur.

---

## BanProfileCommand

Bannit un utilisateur.

---

# 11. Queries

Les Queries retournent des informations sans modifier le Domain Model.

---

## GetProfileQuery

Retourne le Profile d'un utilisateur.

---

## GetProfessionalProfileQuery

Retourne un ProfessionalProfile.

---

## GetPublicProfessionalProfileQuery

Retourne un ProfessionalProfile publié.

---

## SearchProfessionalProfilesQuery

Recherche des professionnels.

---

## GetCurrentUserQuery

Retourne l'utilisateur actuellement authentifié.

---

## GetIdentityProvidersQuery

Retourne les IdentityProviders associés à un Account.

---

# 12. Transactions

Chaque Use Case s'exécute dans une transaction unique.

Le principe est le suivant :

```
Begin Transaction

↓

Load Aggregate

↓

Execute Domain Logic

↓

Save Aggregate

↓

Commit

↓

Publish Domain Events
```

Si une erreur survient avant le Commit :

- aucune modification n'est persistée ;
- aucun Domain Event n'est publié.

---

# 13. Gestion des erreurs

La couche Application transforme les erreurs du domaine en réponses compréhensibles pour la couche de présentation.

Elle ne crée jamais de nouvelles règles métier.

Les erreurs peuvent provenir :

- d'un invariant métier ;
- d'un Aggregate Root ;
- d'un Domain Service ;
- d'un Repository ;
- d'une dépendance technique.

Les erreurs métier sont propagées sans être modifiées.

Les erreurs techniques sont traduites dans un format commun à la couche de présentation.

# 14. Dépendances

La couche Application dépend uniquement de :

- Domain Model ;
- Repositories ;
- Domain Services ;
- Shared Kernel.

Elle ne dépend jamais :

- de Prisma ;
- de PostgreSQL ;
- d'Express ;
- de React ;
- des Controllers ;
- des API REST ;
- des composants d'interface.

Toutes les dépendances techniques sont inversées au moyen d'interfaces.

---

# 15. Règles de conception

La couche Application respecte les principes suivants :

- un Use Case représente une intention métier unique ;
- un Use Case est transactionnel ;
- un Use Case ne contient aucune règle métier ;
- la logique métier appartient exclusivement au Domain Model ;
- les Aggregate Roots garantissent les invariants ;
- les Repositories assurent uniquement le chargement et la persistance des agrégats ;
- les Domain Services encapsulent les règles métier transverses ;
- les Domain Events sont publiés uniquement après une transaction validée ;
- les Commands modifient le Domain Model ;
- les Queries ne modifient jamais le Domain Model ;
- la couche Application est indépendante des technologies d'exposition.

---

# 16. Hors périmètre

Cette User Story ne décrit pas :

- les API REST ;
- les Controllers ;
- les DTO ;
- les Endpoints HTTP ;
- l'authentification OAuth ;
- OpenID Connect ;
- JWT ;
- MFA ;
- Prisma ;
- PostgreSQL ;
- Express ;
- React ;
- les composants Frontend ;
- les migrations ;
- les tests.

Ces éléments seront définis dans les User Stories techniques suivantes.

---

# 17. Résultat attendu

À l'issue de cette User Story, la couche **Application** du domaine **Identity & Profile** est entièrement définie.

Les responsabilités, les Use Cases, les Commands, les Queries, les transactions, les règles d'orchestration et les dépendances sont validées.

Cette User Story constitue la référence de conception utilisée pour :

- US-014 — Backend Architecture ;
- US-015 — REST API ;
- US-016 — Database Design ;
- US-017 — Frontend Architecture ;
- US-018 — Security ;
- US-019 — Testing Strategy.

Toute implémentation de la couche Application devra respecter les principes définis dans ce document.