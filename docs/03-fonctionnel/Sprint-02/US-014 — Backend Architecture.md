---
title: US-014 — Identity & Profile Backend Architecture
id: US-014
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-013 Identity & Profile Application Layer
next:
  - US-015 REST API
---

# US-014 — Identity & Profile Backend Architecture

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story décrit l'architecture backend du domaine **Identity & Profile**.

Elle définit l'organisation des composants, les responsabilités de chaque couche, les dépendances autorisées ainsi que les principes d'architecture qui garantissent la pérennité, la maintenabilité et l'évolutivité du backend.

Le backend constitue le **point central de la logique métier** de Chaweer et est conçu pour être consommé par plusieurs clients, notamment :

- Application Web ;
- Application Mobile ;
- Interface d'administration ;
- Éventuelles API partenaires.

---

# 2. Vision

Le backend est développé selon une approche **API First**.

Il représente la **source unique de vérité (Single Source of Truth)**.

Aucune logique métier n'est implémentée dans les applications clientes.

Toutes les décisions métier sont prises exclusivement dans le backend.

Les applications Web et Mobile consomment les mêmes Use Cases et appliquent les mêmes règles métier via les API exposées.

---

# 3. Principes d'architecture

L'architecture repose sur les principes suivants :

- séparation stricte des responsabilités ;
- indépendance vis-à-vis des technologies clientes ;
- logique métier centralisée ;
- architecture orientée domaine (DDD) ;
- forte cohésion des modules ;
- faible couplage entre les couches ;
- inversion des dépendances ;
- évolutivité ;
- testabilité ;
- réutilisabilité des Use Cases.

---

# 4. Clients supportés

Le backend est conçu pour être utilisé simultanément par :

- Application Web ;
- Application Mobile iOS ;
- Application Mobile Android ;
- Back-office d'administration ;
- Services internes ;
- Intégrations futures.

Tous les clients utilisent les mêmes API et les mêmes règles métier.

---

# 5. Source unique de vérité

Le backend est responsable de :

- l'identité des utilisateurs ;
- les profils ;
- les profils professionnels ;
- les droits d'accès ;
- les règles métier ;
- les validations métier ;
- les changements d'état ;
- les publications ;
- les événements métier.

Aucun client ne doit reproduire ces traitements.

---

# 6. Architecture générale

```text
                    Web

                     │

                 Mobile

                     │

               Admin Portal

                     │

             HTTPS / REST API

                     │

            Presentation Layer

                     │

           Application Layer

                     │

              Domain Layer

                     │

         Infrastructure Layer

                     │

               PostgreSQL
```

Chaque couche possède une responsabilité clairement définie et ne peut communiquer qu'avec les couches autorisées.

---

# 7. Les couches de l'architecture

Le backend est organisé en quatre couches principales.

Chaque couche possède une responsabilité unique et des dépendances strictement contrôlées.

---

# 7.1 Presentation Layer

## Rôle

La couche Presentation constitue le point d'entrée du backend.

Elle reçoit les requêtes provenant des différents clients :

- Application Web ;
- Application Mobile ;
- Back-office ;
- API externes.

Elle ne contient aucune logique métier.

## Responsabilités

- recevoir les requêtes HTTP ;
- authentifier les utilisateurs ;
- autoriser les accès ;
- valider le format des données (validation technique) ;
- transformer les DTO entrants ;
- invoquer les Use Cases de la couche Application ;
- transformer les réponses métier en réponses HTTP.

## Ne gère jamais

- les règles métier ;
- la persistance ;
- les Aggregate Roots ;
- les Domain Services.

---

# 7.2 Application Layer

## Rôle

La couche Application orchestre les cas d'utilisation.

Elle coordonne les composants du Domain Model.

Elle garantit les transactions.

## Responsabilités

- exécuter les Use Cases ;
- charger les Aggregate Roots ;
- appeler les Domain Services ;
- sauvegarder les agrégats ;
- publier les Domain Events ;
- gérer les transactions.

## Ne gère jamais

- les règles métier ;
- les contrôleurs HTTP ;
- les DTO REST ;
- Prisma ;
- PostgreSQL.

---

# 7.3 Domain Layer

Le Domain représente le cœur du backend.

Toutes les règles métier sont implémentées exclusivement dans cette couche.

Elle contient :

- Aggregate Roots ;
- Entities ;
- Value Objects ;
- Domain Services ;
- Domain Events ;
- Invariants ;
- Policies ;
- Factories ;
- Repository Interfaces.

Le Domain est totalement indépendant des frameworks.

---

# 7.4 Infrastructure Layer

La couche Infrastructure implémente les interfaces définies par le Domain.

Elle assure la communication avec les technologies externes.

Elle contient notamment :

- implémentations des Repositories ;
- Prisma ORM ;
- PostgreSQL ;
- JWT ;
- OAuth ;
- Google Identity ;
- Email Provider ;
- SMS Provider ;
- stockage de fichiers ;
- cache ;
- services tiers.

Aucune règle métier n'y est implémentée.

---

# 8. Dépendances entre les couches

Les dépendances sont strictement unidirectionnelles.

```text
Presentation
      │
      ▼
Application
      │
      ▼
Domain
      ▲
      │
Infrastructure
```

Les règles suivantes s'appliquent :

- Presentation dépend uniquement de Application.
- Application dépend uniquement du Domain.
- Domain ne dépend d'aucune autre couche.
- Infrastructure dépend du Domain pour implémenter ses interfaces.

Le Domain ne connaît jamais Prisma, Express, PostgreSQL ou tout autre framework.

---

# 9. Organisation des modules

Le backend est organisé en modules métier (Bounded Contexts).

Exemple :

```text
src/

├── identity/
├── professionals/
├── appointments/
├── messaging/
├── reviews/
├── payments/
├── notifications/
├── moderation/
├── search/
└── shared/
```

Chaque module est autonome et possède sa propre architecture interne.

---

# 10. Architecture interne d'un module

Chaque module adopte la même structure afin de garantir la cohérence du projet.

```text
identity/

├── presentation/
│
├── application/
│
├── domain/
│
├── infrastructure/
│
└── shared/
```

Cette organisation facilite :

- la maintenance ;
- les tests ;
- l'évolution du domaine ;
- la réutilisation des composants ;
- le travail en parallèle de plusieurs équipes.

# 11. Flux d'exécution

Tous les clients (Web, Mobile ou futurs consommateurs) suivent le même parcours d'exécution.

```text
Client
(Web / Mobile / Admin)

        │

        ▼

REST API

        │

        ▼

Controller

        │

        ▼

Application Use Case

        │

        ▼

Aggregate Root

        │

        ▼

Domain Services

        │

        ▼

Repository Interface

        │

        ▼

Repository Implementation

        │

        ▼

Prisma ORM

        │

        ▼

PostgreSQL
```

Une fois la transaction validée, les Domain Events sont publiés afin de notifier les autres modules ou services intéressés.

---

# 12. Persistance

La persistance est entièrement isolée dans la couche Infrastructure.

Le Domain ne connaît jamais :

- PostgreSQL ;
- Prisma ;
- SQL ;
- les migrations ;
- les requêtes techniques.

Les Aggregate Roots sont persistés exclusivement au travers des Repository Interfaces définies dans le Domain.

Exemple :

```text
Application

↓

AccountRepository

↓

PrismaAccountRepository

↓

PostgreSQL
```

Cette approche garantit l'indépendance du Domain vis-à-vis de la technologie de stockage.

---

# 13. Repository Pattern

Les Repository Interfaces sont définies dans le Domain.

Leur implémentation est réalisée dans l'Infrastructure.

Le rôle d'un Repository est de :

- charger un Aggregate Root ;
- sauvegarder un Aggregate Root ;
- supprimer un Aggregate Root lorsque cela est autorisé par le domaine.

Un Repository ne contient jamais :

- de logique métier ;
- de validation métier ;
- de règles de publication ;
- de calculs métier.

Il constitue uniquement une abstraction de la persistance.

---

# 14. Domain Events

Les Domain Events permettent de propager les changements significatifs du domaine sans créer de dépendances fortes entre les modules.

Ils sont publiés uniquement après la validation de la transaction.

Exemples :

- AccountCreated
- IdentityProviderLinked
- IdentityProviderUnlinked
- ProfileCreated
- ProfessionalProfileCreated
- ProfessionalProfilePublished
- ProfessionalProfileHidden
- ProfessionalProfileArchived
- ProfileSuspended
- ProfileBanned

Les consommateurs de ces événements peuvent être :

- Notifications ;
- Search ;
- Analytics ;
- Audit ;
- Messaging ;
- tout autre module métier.

Le module **Identity & Profile** ne dépend jamais directement de ces consommateurs.

---

# 15. Communication entre modules

Les modules métier communiquent selon les principes suivants :

- un module n'accède jamais directement à la base de données d'un autre module ;
- un module ne manipule jamais les Aggregate Roots d'un autre module ;
- les échanges se font via des API internes, des interfaces ou des Domain Events ;
- chaque module reste propriétaire de son modèle métier.

Cette isolation favorise l'évolutivité et limite le couplage entre les domaines.

---

# 16. Extensibilité

L'architecture backend est conçue pour évoluer sans remettre en cause les fondations existantes.

Elle permet notamment :

- l'ajout de nouveaux Identity Providers (Apple, Microsoft, FranceConnect, etc.) ;
- l'intégration de nouveaux modules métier ;
- l'exposition de nouvelles API ;
- l'ajout de nouveaux clients (Web, Mobile, Desktop, partenaires) ;
- le remplacement d'une technologie d'infrastructure (ORM, base de données, fournisseur d'authentification, etc.) sans impact sur le Domain Model.

L'objectif est de garantir une architecture durable, modulaire et indépendante des choix technologiques.

# 17. Règles de conception

Le backend **Identity & Profile** respecte les principes suivants.

## Centralisation de la logique métier

Toutes les règles métier sont implémentées dans le Domain.

Aucune logique métier ne doit être présente dans :

- les Controllers ;
- les DTO ;
- les Middlewares ;
- les Repositories ;
- les clients Web ;
- les applications Mobile.

---

## API First

Le backend est développé selon une approche **API First**.

Toutes les fonctionnalités sont exposées sous forme d'API indépendantes des interfaces clientes.

Les API constituent le contrat officiel entre le backend et les différents consommateurs.

---

## Multi-clients

Le backend est conçu pour servir simultanément plusieurs clients :

- Application Web ;
- Application Mobile iOS ;
- Application Mobile Android ;
- Back-office ;
- API partenaires futures.

Tous les clients utilisent les mêmes Use Cases et les mêmes règles métier.

Aucun comportement métier ne dépend du type de client.

---

## Indépendance technologique

Le Domain Model reste indépendant :

- d'Express ;
- de NestJS ;
- de Prisma ;
- de PostgreSQL ;
- de MongoDB ;
- de JWT ;
- des fournisseurs OAuth ;
- des frameworks Frontend.

Le remplacement d'une technologie ne doit nécessiter aucune modification du Domain.

---

## Inversion des dépendances

Les couches supérieures ne dépendent jamais des implémentations techniques.

Les dépendances sont exprimées via des interfaces.

Les implémentations sont fournies par la couche Infrastructure.

---

## Faible couplage

Chaque module métier possède :

- ses Aggregate Roots ;
- ses Repositories ;
- ses Use Cases ;
- ses Domain Events.

Les modules communiquent uniquement par des contrats explicites.

---

## Forte cohésion

Toutes les responsabilités liées à l'identité sont regroupées dans le module **Identity & Profile**.

Le module est responsable de l'ensemble du cycle de vie des comptes, profils et fournisseurs d'identité.

---

## Testabilité

Chaque couche peut être testée indépendamment.

Les tests unitaires ciblent principalement le Domain.

Les tests d'intégration valident les interactions entre les couches.

Les tests end-to-end vérifient les parcours fonctionnels exposés par les API.

---

# 18. Hors périmètre

Cette User Story ne décrit pas :

- les endpoints REST détaillés ;
- les contrats OpenAPI ;
- les DTO ;
- les formats JSON ;
- les stratégies JWT ;
- OAuth 2.0 ;
- OpenID Connect ;
- MFA ;
- la configuration Prisma ;
- les migrations PostgreSQL ;
- les composants React ;
- les composants Mobile ;
- les pipelines CI/CD ;
- le déploiement.

Ces éléments seront spécifiés dans les User Stories dédiées.

---

# 19. Résultat attendu

À l'issue de cette User Story, l'architecture backend du domaine **Identity & Profile** est entièrement définie.

Elle établit les principes de conception qui guideront l'ensemble du développement backend de Chaweer.

Le backend est conçu comme une plateforme **API First**, indépendante des interfaces clientes, capable de servir simultanément les applications Web, Mobile et les futures intégrations.

Ce document constitue la référence d'architecture pour les User Stories suivantes :

- **US-015 — REST API**
- **US-016 — Database Design**
- **US-017 — Frontend Architecture**
- **US-018 — Security**
- **US-019 — Testing Strategy**

Toute implémentation du backend devra respecter les principes définis dans cette User Story afin de garantir la cohérence, la maintenabilité et l'évolutivité de la plateforme Chaweer.