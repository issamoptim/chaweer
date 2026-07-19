---
title: US-017 — Identity & Profile Frontend Architecture
id: US-017
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile

depends_on:
  - US-002 Initialisation Frontend
  - US-015 REST API
  - US-016 Database Design

next:
  - US-018 Frontend Routing
---

# US-017 — Identity & Profile Frontend Architecture

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit l'architecture Frontend du domaine **Identity & Profile**.

Elle décrit :

- la place du module dans l'application ;
- son organisation interne ;
- les responsabilités de chaque dossier ;
- les dépendances autorisées ;
- les règles d'architecture du module.

Elle ne décrit pas :

- le routage (US-018) ;
- la gestion des données et du cache (US-019) ;
- l'intégration avec les API (US-020).

La stack Frontend est définie dans **US-002 – Initialisation Frontend** et n'est pas redéfinie dans ce document.

---

# 2. Prérequis

Cette User Story s'appuie sur les éléments déjà disponibles :

- Sprint-00 — Initialisation Frontend
- Sprint-01 — Authentification
- US-015 — REST API
- US-016 — Database Design

Les composants techniques communs (AuthProvider, QueryClient, apiClient, Guards, etc.) sont considérés comme existants.

---

# 3. Positionnement dans l'application

Le domaine **Identity & Profile** constitue un module fonctionnel autonome.

Il est responsable de toutes les interfaces permettant à un utilisateur authentifié de gérer :

- son identité personnelle ;
- son profil professionnel.

Il s'intègre à l'architecture globale sans modifier les modules existants.

```text
Application
│
├── Core
├── Shared
├── Auth
├── Identity & Profile
├── Search
├── Questions
├── Booking
└── Administration
```

Chaque module possède son propre périmètre fonctionnel et reste indépendant des autres modules.

---

# 4. Dépendances du module

Le module **Identity & Profile** peut utiliser uniquement les ressources suivantes.

```text
Identity & Profile
│
├── Core
├── Shared
├── Auth
└── API Client
```

Il ne dépend jamais directement :

- d'un autre domaine métier ;
- d'un composant spécifique à un autre module ;
- d'une logique métier externe.

Les échanges entre domaines transitent exclusivement par les services communs de l'application.

---

# 5. Organisation du module

L'ensemble des ressources du domaine est regroupé dans un module unique.

```text
src/
└── features/
    └── identity/
        ├── api/
        ├── components/
        ├── hooks/
        ├── layouts/
        ├── pages/
        ├── schemas/
        ├── services/
        ├── types/
        ├── utils/
        └── index.ts
```

Cette organisation permet :

- une forte cohésion fonctionnelle ;
- un faible couplage avec les autres modules ;
- une évolution indépendante du domaine ;
- une maintenance simplifiée.

Chaque dossier possède une responsabilité clairement identifiée.

---

# 6. Responsabilités des dossiers

## api/

Contient les fonctions de communication avec les API du domaine.

Responsabilités :

- centraliser les appels réseau ;
- isoler les détails techniques de communication ;
- constituer le point d'entrée unique vers les services Backend.

---

## components/

Regroupe les composants d'interface réutilisables du domaine.

Ils représentent uniquement des éléments visuels ou de composition.

Ils ne portent aucune responsabilité métier.

---

## pages/

Regroupe les pages fonctionnelles du domaine.

Chaque page représente un écran complet de l'application.

Elle compose les composants nécessaires mais ne contient pas de logique métier.

---

## layouts/

Contient les layouts spécifiques au domaine.

Ils définissent uniquement la structure générale des pages.

Ils ne contiennent aucune logique fonctionnelle.

---

## hooks/

Expose les fonctionnalités du domaine aux composants React.

Les détails d'implémentation restent entièrement masqués aux consommateurs du module.

---

## services/

Contient les services applicatifs propres au domaine.

Ils regroupent les opérations fonctionnelles nécessaires au fonctionnement du module.

Ils restent indépendants des composants React.

---
## schemas/

Contient les schémas de validation du domaine.

Responsabilités :

- définir les règles de validation des formulaires ;
- centraliser les contraintes de saisie ;
- garantir la cohérence des données avant leur traitement.

Les schémas sont spécifiques au domaine et ne contiennent aucune logique d'affichage.

---

## types/

Regroupe les types et interfaces TypeScript utilisés par le domaine.

Responsabilités :

- définir les modèles manipulés par le Frontend ;
- partager les contrats internes du module ;
- améliorer la sécurité de typage.

Les types ne contiennent aucune logique métier.

---

## utils/

Contient les fonctions utilitaires du domaine.

Responsabilités :

- mutualiser les traitements génériques ;
- éviter la duplication de code ;
- fournir des fonctions pures et réutilisables.

Les utilitaires restent indépendants de React et des composants.

---

## index.ts

Constitue le point d'entrée public du module.

Il expose uniquement les éléments destinés à être consommés par les autres parties de l'application.

L'arborescence interne du module reste ainsi encapsulée.

---

# 7. Principes d'architecture

Le module **Identity & Profile** applique les principes suivants.

## Modularité

Toutes les ressources du domaine sont regroupées dans un module unique.

Le domaine peut évoluer indépendamment des autres modules de l'application.

---

## Responsabilité unique

Chaque dossier possède une responsabilité clairement définie.

Une fonctionnalité ne doit exister qu'à un seul endroit.

---

## Encapsulation

L'organisation interne du module est masquée aux consommateurs.

Les échanges avec le reste de l'application passent uniquement par l'API publique du module.

---

## Faible couplage

Le domaine ne dépend jamais directement d'un autre domaine métier.

Toute interaction inter-modules passe par les mécanismes communs de l'application.

---

## Réutilisabilité

Les composants, layouts, utilitaires et types sont conçus pour être réutilisés à l'intérieur du domaine sans duplication.

---

# 8. Dépendances autorisées

Le module peut dépendre des éléments suivants.

```text
Core
Shared
Auth
API Client
```

Le module ne doit jamais dépendre directement :

- de Search ;
- de Questions ;
- de Booking ;
- d'Administration ;
- d'un autre domaine fonctionnel.

Cette règle garantit l'indépendance du domaine.

---

# 9. Organisation des dépendances

Les dépendances suivent une organisation hiérarchique.

```text
Pages
   │
   ▼
Components
   │
   ▼
Services
   │
   ▼
API
```

Chaque niveau ne peut dépendre que des niveaux inférieurs ou des modules communs (`Core`, `Shared`, `Auth`).

Les dépendances circulaires entre dossiers sont interdites.

---

# 10. Évolutivité

Toute nouvelle fonctionnalité du domaine doit respecter l'organisation définie dans cette User Story.

L'ajout d'un écran, d'un composant ou d'un service ne doit pas remettre en cause la structure générale du module.

Les nouveaux éléments doivent être intégrés dans le dossier correspondant à leur responsabilité.

---

# 11. Résultat attendu

À l'issue de cette User Story, l'architecture Frontend du domaine **Identity & Profile** est définie.

Le document constitue la référence pour :

- l'organisation du module ;
- les responsabilités des dossiers ;
- les dépendances autorisées ;
- les règles d'architecture ;
- les principes de conception.

Les aspects suivants sont volontairement documentés dans des User Stories dédiées :

- **US-018 — Frontend Routing** : navigation et routes du domaine ;
- **US-019 — Frontend Data Flow** : circulation des données, cache et synchronisation ;
- **US-020 — API Consumption** : consommation des services REST.

---