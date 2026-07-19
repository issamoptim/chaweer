---
title: US-019 — Identity & Profile Frontend Data Flow
id: US-019
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile

depends_on:
  - US-017 Frontend Architecture
  - US-018 Frontend Routing

next:
  - US-020 API Consumption
---

# US-019 — Identity & Profile Frontend Data Flow

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit la circulation des données au sein du domaine **Identity & Profile**.

Elle décrit :

- les flux de lecture ;
- les flux d'écriture ;
- la gestion du cache ;
- la synchronisation des données ;
- les responsabilités de chaque couche impliquée.

Elle ne décrit pas :

- l'architecture du module (US-017) ;
- le routage (US-018) ;
- les contrats REST (US-015) ;
- l'organisation de la couche API (US-020).

---

# 2. Prérequis

Les éléments suivants sont disponibles :

- QueryClient
- TanStack Query
- React Hook Form
- apiClient
- AuthProvider

Leur configuration est définie dans Sprint-00.

---

# 3. Principes

Le flux des données respecte les principes suivants.

## Source de vérité

Le Backend constitue l'unique source de vérité.

Le Frontend ne conserve aucune copie persistante des données métier.

---

## Flux unidirectionnel

Les données circulent toujours dans la même direction.

```text
Backend

↓

API

↓

Services

↓

Hooks

↓

Pages

↓

Components
```

Le résultat suit ensuite le chemin inverse jusqu'à l'interface.

---

## Séparation des responsabilités

Chaque couche possède une responsabilité unique.

| Couche | Responsabilité |
|---------|----------------|
| Hook | Exposer les données |
| Service | Orchestrer les opérations |
| API | Communiquer avec le Backend |

Aucune couche ne remplit le rôle d'une autre.

---

## Synchronisation

Les données affichées doivent toujours refléter l'état actuel du Backend.

Après chaque modification, le cache est synchronisé automatiquement.

---

# 4. Types de flux

Le domaine distingue deux catégories de flux.

## Lecture

Les données sont récupérées depuis le Backend afin d'être affichées.

Exemples :

- consultation du profil ;
- consultation du profil professionnel.

---

## Écriture

Les données sont envoyées au Backend afin de créer ou modifier une ressource.

Exemples :

- modification du profil ;
- création d'un profil professionnel ;
- publication d'un profil professionnel.

---

# 5. Flux de lecture

Toutes les opérations de lecture suivent le même cycle.

```text
Utilisateur

↓

Page

↓

Hook

↓

Service

↓

API

↓

Backend

↓

Réponse

↓

Mise en cache

↓

Affichage
```

Chaque couche intervient uniquement dans son périmètre.

---

# 6. Flux d'écriture

Toutes les opérations de création ou de modification suivent le même principe.

```text
Utilisateur

↓

Formulaire

↓

Validation

↓

Hook

↓

Service

↓

API

↓

Backend

↓

Confirmation

↓

Synchronisation

↓

Mise à jour de l'interface
```

La validation côté Frontend complète la validation réalisée par le Backend sans jamais la remplacer.

---

# 7. Gestion du cache

Le domaine **Identity & Profile** s'appuie sur le mécanisme de cache de l'application afin de limiter les appels réseau et de maintenir une interface réactive.

Le cache constitue une représentation temporaire des données du Backend.

Il ne remplace jamais la persistance.

---

## Objectifs

Le cache permet de :

- éviter les requêtes inutiles ;
- améliorer les performances ;
- partager les données entre plusieurs écrans ;
- maintenir une interface cohérente.

Le Backend reste toujours la source de vérité.

---

# 8. Cycle de synchronisation

Après chaque mutation réussie, le Frontend doit synchroniser les données affichées.

Le cycle est le suivant.

```text
Mutation

↓

Réponse Backend

↓

Invalidation du cache

↓

Nouvelle récupération

↓

Mise à jour automatique de l'interface
```

Cette synchronisation est transparente pour les composants.

---

# 9. Invalidation

Toute modification susceptible d'impacter une donnée déjà affichée entraîne une invalidation du cache correspondant.

Exemples :

| Opération | Données à synchroniser |
|------------|------------------------|
| Modification du profil | Profil utilisateur |
| Création du profil professionnel | Profil professionnel |
| Modification du profil professionnel | Profil professionnel |
| Publication du profil professionnel | Profil professionnel |

Les règles d'invalidation sont centralisées afin de garantir un comportement homogène dans tout le domaine.

---

# 10. Mutations

Une mutation représente toute opération modifiant l'état du système.

Le domaine **Identity & Profile** prend en charge notamment :

- création d'un profil professionnel ;
- modification du profil utilisateur ;
- modification du profil professionnel ;
- publication d'un profil professionnel ;
- dépublication d'un profil professionnel.

Toutes les mutations suivent le même cycle de traitement.

```text
Validation

↓

Mutation

↓

Réponse

↓

Synchronisation

↓

Actualisation de l'interface
```

---

# 11. États d'exécution

Chaque opération du domaine expose un état permettant au Frontend d'adapter l'interface.

| État | Description |
|-------|-------------|
| Pending | Opération en cours |
| Success | Opération terminée avec succès |
| Error | Une erreur est survenue |

Ces états sont utilisés pour :

- afficher un indicateur de chargement ;
- désactiver temporairement certaines actions ;
- afficher un message de confirmation ;
- informer l'utilisateur en cas d'erreur.

Leur représentation graphique reste propre aux composants d'interface.

---

# 12. Validation des données

Avant toute opération d'écriture, les données saisies sont validées côté Frontend.

Cette validation permet :

- d'améliorer l'expérience utilisateur ;
- de détecter les erreurs de saisie le plus tôt possible ;
- de limiter les requêtes inutiles.

La validation Frontend ne remplace jamais la validation réalisée par le Backend.

Les règles métier restent exclusivement appliquées côté serveur.

---

# 13. Cohérence des données

Toutes les vues affichant une même ressource doivent présenter des informations identiques.

Une modification réalisée depuis un écran doit être automatiquement répercutée sur les autres écrans concernés après synchronisation.

Aucun écran ne doit conserver des données devenues obsolètes après une mutation.

--- 
# 14. Gestion des erreurs

La gestion des erreurs suit le même principe pour toutes les opérations du domaine.

L'objectif est de garantir un comportement cohérent indépendamment de la fonctionnalité concernée.

---

## Erreurs de validation

Les erreurs de saisie sont détectées avant l'envoi de la requête.

Exemples :

- champ obligatoire ;
- format invalide ;
- longueur incorrecte ;
- valeur hors limites.

Ces erreurs sont affichées directement dans le formulaire.

---

## Erreurs métier

Les erreurs retournées par le Backend sont propagées jusqu'à la couche de présentation.

Exemples :

- profil inexistant ;
- profil professionnel introuvable ;
- publication impossible ;
- ressource inaccessible.

Le Frontend les affiche sans reproduire les règles métier.

---

## Erreurs techniques

Les erreurs liées à l'infrastructure sont gérées par les mécanismes communs de l'application.

Exemples :

- perte de connexion ;
- indisponibilité du serveur ;
- délai d'attente dépassé.

Le domaine **Identity & Profile** ne redéfinit pas leur traitement.

---

# 15. Principes de circulation des données

Le flux de données respecte les règles suivantes.

## Backend First

Le Backend est l'unique source de vérité.

Aucune donnée métier n'est considérée comme valide tant qu'elle n'a pas été confirmée par le serveur.

---

## Flux unique

Toutes les opérations suivent le même chemin.

```text
Lecture

Backend
    │
    ▼
API
    │
    ▼
Service
    │
    ▼
Hook
    │
    ▼
Page
    │
    ▼
Composants
```

```text
Écriture

Composants
    │
    ▼
Page
    │
    ▼
Hook
    │
    ▼
Service
    │
    ▼
API
    │
    ▼
Backend
```

Cette uniformité simplifie le développement et facilite la maintenance.

---

## Synchronisation systématique

Toute mutation entraînant une modification des données doit provoquer une synchronisation du cache concerné.

Les composants ne réalisent jamais eux-mêmes cette synchronisation.

---

## Indépendance des composants

Les composants d'interface ne connaissent jamais :

- les endpoints REST ;
- les mécanismes de cache ;
- les règles de synchronisation ;
- les détails de communication réseau.

Ils consomment uniquement les données mises à leur disposition.

---

# 16. Règles de conception

Le domaine **Identity & Profile** applique les règles suivantes.

- le Backend constitue toujours la source de vérité ;
- les lectures et les écritures suivent un flux unique ;
- les composants restent indépendants des mécanismes de récupération des données ;
- les règles de synchronisation sont centralisées ;
- les mutations déclenchent systématiquement une mise à jour des données concernées ;
- les validations Frontend améliorent l'expérience utilisateur sans remplacer les validations du Backend ;
- chaque couche possède une responsabilité unique.

---

# 17. Évolutivité

Toute nouvelle fonctionnalité du domaine devra respecter les principes définis dans cette User Story.

Les nouveaux flux devront :

- suivre l'architecture existante ;
- utiliser les mécanismes communs de synchronisation ;
- respecter la séparation des responsabilités ;
- conserver un flux unidirectionnel.

---

# 18. Résultat attendu

À l'issue de cette User Story, la circulation des données du domaine **Identity & Profile** est entièrement définie.

Le document constitue la référence pour :

- les flux de lecture ;
- les flux d'écriture ;
- la synchronisation des données ;
- la gestion du cache ;
- les mutations ;
- les règles de circulation des données.

Les aspects suivants sont documentés dans des User Stories dédiées :

- **US-017 — Frontend Architecture** : organisation du module ;
- **US-018 — Frontend Routing** : navigation du domaine ;
- **US-020 — API Consumption** : intégration avec les services REST.

---