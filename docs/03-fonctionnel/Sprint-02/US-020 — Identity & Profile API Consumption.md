---
title: US-020 — Identity & Profile API Consumption
id: US-020
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile

depends_on:
  - US-015 REST API
  - US-017 Frontend Architecture
  - US-019 Frontend Data Flow

next:
  - US-021 Profile Overview Page
---

# US-020 — Identity & Profile API Consumption

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit la manière dont le domaine **Identity & Profile** consomme les services REST mis à disposition par le Backend.

Elle décrit :

- l'organisation de la couche API ;
- les responsabilités de chaque niveau ;
- les conventions de consommation ;
- les règles de transformation des données ;
- les conventions de gestion des erreurs techniques.

Elle ne décrit pas :

- les endpoints REST (US-015) ;
- le flux des données (US-019) ;
- l'architecture Frontend (US-017).

---

# 2. Prérequis

Les éléments suivants sont disponibles :

- apiClient
- AuthProvider
- JWT Authentication
- REST API Identity
- Frontend Architecture
- Frontend Data Flow

Cette User Story décrit uniquement la couche de consommation des API.

---

# 3. Principes

La consommation des API respecte les principes suivants.

## Centralisation

Toutes les communications HTTP sont centralisées dans le dossier **api/**.

Aucun autre dossier du module ne réalise directement de requête HTTP.

---

## Découplage

Les composants React ignorent :

- les URLs ;
- les méthodes HTTP ;
- les headers ;
- l'authentification ;
- la sérialisation.

Ces responsabilités sont encapsulées dans la couche API.

---

## Contrats

Les échanges reposent exclusivement sur les contrats définis dans **US-015**.

Le Frontend ne redéfinit jamais les structures d'échange.

---

## Réutilisabilité

Chaque fonction API représente une opération métier unique.

Elle peut être utilisée par plusieurs services sans duplication.

---

# 4. Architecture

```text
Pages
    │
    ▼
Hooks
    │
    ▼
Services
    │
    ▼
API
    │
    ▼
apiClient
    │
    ▼
REST API
```

La couche API constitue la frontière entre le Frontend et le Backend.

---

# 5. Organisation

```text
features/

└── identity/

    ├── api/
    │      ├── profile.api.ts
    │      ├── professional.api.ts
    │      └── index.ts
    │
    ├── services/
    │
    └── types/
```

Le dossier **api/** regroupe uniquement les fonctions de communication avec le Backend.

---

# 6. Responsabilités de la couche API

La couche API est responsable de :

- appeler les endpoints REST ;
- transmettre les paramètres ;
- transmettre le corps des requêtes ;
- retourner les réponses du Backend.

Elle n'est jamais responsable :

- de logique métier ;
- de logique de présentation ;
- de gestion de l'interface utilisateur ;
- de navigation.

---

# 7. Responsabilités des services

Les services utilisent les fonctions du dossier **api/**.

Ils sont responsables de :

- orchestrer les opérations du domaine ;
- préparer les données destinées aux hooks ;
- centraliser les opérations métier du Frontend.

Ils ne connaissent jamais les composants React.

---

# 8. Transformation des données

Lorsque cela est nécessaire, les services peuvent transformer les données reçues du Backend afin de faciliter leur utilisation par le Frontend.

Ces transformations doivent :

- rester simples ;
- être déterministes ;
- ne jamais modifier le sens fonctionnel des données.

Les règles métier restent exclusivement appliquées par le Backend.

---

# 9. Organisation des fichiers API

Chaque ressource métier possède son propre fichier.

```text
api/
│
├── profile.api.ts
├── professional.api.ts
└── index.ts
```

Cette organisation garantit :

- une responsabilité claire par ressource ;
- une navigation simple dans le projet ;
- une évolution indépendante de chaque API.

Les fonctions sont regroupées selon le domaine métier et non selon la méthode HTTP.

---

# 10. Convention de nommage

Les fonctions exposées par la couche API utilisent un vocabulaire métier.

Exemples :

- getProfile()
- updateProfile()
- getProfessionalProfile()
- createProfessionalProfile()
- updateProfessionalProfile()
- publishProfessionalProfile()
- unpublishProfessionalProfile()

Les noms décrivent l'intention métier plutôt que le protocole de communication.

---

# 11. Gestion des erreurs techniques

La couche API est responsable de la propagation des erreurs techniques.

Exemples :

- erreur réseau ;
- délai d'attente dépassé ;
- serveur indisponible ;
- réponse invalide.

Elle ne décide jamais de la manière dont ces erreurs sont présentées à l'utilisateur.

L'affichage relève de la couche de présentation.

---

# 12. Authentification

Les informations d'authentification sont gérées par l'infrastructure commune de l'application.

La couche API du domaine :

- n'ajoute pas manuellement les jetons d'accès ;
- ne gère pas leur renouvellement ;
- ne contrôle pas les autorisations.

Ces responsabilités appartiennent au client HTTP partagé et au module d'authentification.

---

# 13. Journalisation

La couche API ne contient aucune logique de journalisation spécifique au domaine.

Les mécanismes de traçabilité, de monitoring et de journalisation sont mutualisés au niveau de l'infrastructure de l'application.

---

# 14. Principes de conception

Le domaine **Identity & Profile** applique les principes suivants.

## Une opération = une fonction

Chaque fonction API représente une opération métier unique.

---

## Responsabilité unique

La couche API communique avec le Backend.

Elle ne contient :

- ni logique métier ;
- ni logique d'interface ;
- ni logique de navigation.

---

## Encapsulation

Les détails de communication HTTP sont masqués au reste du module.

Les autres couches manipulent uniquement des opérations métier.

---

## Réutilisabilité

Une même fonction API peut être utilisée par plusieurs services sans duplication de code.

---

## Cohérence

Toutes les ressources du domaine suivent les mêmes conventions d'organisation et de nommage.

---

# 15. Évolutivité

Toute nouvelle ressource du domaine devra respecter cette organisation.

L'ajout d'une nouvelle opération implique :

- la création ou l'évolution du fichier API correspondant ;
- le respect des conventions de nommage ;
- l'absence de duplication avec les ressources existantes.

L'architecture générale du module ne doit pas être modifiée.

---

# 16. Résultat attendu

À l'issue de cette User Story, la couche de consommation des API du domaine **Identity & Profile** est entièrement définie.

Le document constitue la référence pour :

- l'organisation du dossier `api/` ;
- les responsabilités de la couche API ;
- les conventions de nommage ;
- les règles de consommation des services REST ;
- les principes de conception de l'intégration Frontend / Backend.

Les aspects suivants sont documentés dans des User Stories dédiées :

- **US-015 — REST API** : contrats et endpoints ;
- **US-017 — Frontend Architecture** : organisation du module ;
- **US-019 — Frontend Data Flow** : circulation des données et synchronisation.

---