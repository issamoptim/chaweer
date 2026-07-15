# US-002 — Initialisation Frontend

## Business Value

Disposer d'une application Web moderne, évolutive et maintenable, prête à accueillir les fonctionnalités métier de Chaweer.

Cette User Story prépare uniquement les fondations techniques du frontend.

Aucune fonctionnalité métier n'est développée.

---

# Contexte

Chaweer est une plateforme composée de plusieurs clients :

- API Backend
- Application Web
- Application Mobile (future)

Le frontend Web consomme exclusivement l'API REST.

Aucune logique métier ne doit être implémentée dans cette User Story.

---

# Objectif

Initialiser une application React moderne dans :

apps/web

Cette application servira de base à l'ensemble du développement du MVP.

---

# Stack technique

Utiliser exclusivement :

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- React Router v7
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Lucide React
- ESLint
- Prettier
- Vitest
- React Testing Library

Ne pas utiliser Redux.

Ne pas utiliser Material UI.

Ne pas utiliser Bootstrap.

---

# Travail demandé

Créer une application React entièrement fonctionnelle.

Configurer :

- Vite
- TypeScript
- Tailwind
- ESLint
- Prettier
- React Router
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Lucide React
- Vitest
- React Testing Library

---

# Architecture attendue

Créer la structure suivante.

```text
apps/web/

src/

    main.tsx

    App.tsx

    app/

    assets/

    components/

        ui/

        common/

    features/

    hooks/

    layouts/

    lib/

    routes/

    services/

    styles/

    tests/

    types/

public/

package.json

tsconfig.json

vite.config.ts

eslint.config.mjs

.prettierrc

.env.example

README.md
```

---

# Fonctionnalités attendues

Créer uniquement :

## Layout principal

Un layout général de l'application.

---

## Routing

Configurer React Router.

Créer :

/

404

---

## Pages

Créer uniquement :

Home

NotFound

Aucune autre page.

---

## UI

Configurer shadcn/ui.

Créer uniquement les composants nécessaires au démarrage.

---

## Styling

Configurer Tailwind.

Créer un thème propre.

Aucun design métier.

---

## TanStack Query

Configurer QueryClient.

Le rendre disponible dans toute l'application.

---

## Variables d'environnement

Créer :

.env.example

avec :

```text
VITE_API_URL=http://localhost:3000
```

---

# Contraintes

Ne créer :

- aucune authentification
- aucune page métier
- aucun appel API
- aucun formulaire métier
- aucune logique métier
- aucun état global Redux

Le frontend doit uniquement être prêt à accueillir les futures fonctionnalités.

---

# Critères d'acceptation

Le projet démarre.

La page Home s'affiche.

La page 404 fonctionne.

Le routing fonctionne.

Tailwind fonctionne.

shadcn/ui est installé.

Le build fonctionne.

Les tests passent.

ESLint ne retourne aucune erreur.

TypeScript ne retourne aucune erreur.

---

# Tests attendus

Créer au minimum :

- un test de rendu de Home
- un test de la page 404

---

# Livrables

Application React initialisée.

Architecture créée.

Tailwind configuré.

React Router configuré.

TanStack Query configuré.

React Hook Form configuré.

Zod configuré.

shadcn/ui installé.

Lucide React installé.

Tests configurés.

README créé.

---

# Définition de Terminé

La User Story est terminée lorsque :

- l'application démarre ;
- le build fonctionne ;
- les tests passent ;
- ESLint passe ;
- TypeScript passe ;
- la documentation est à jour.

---

# Statut

À faire