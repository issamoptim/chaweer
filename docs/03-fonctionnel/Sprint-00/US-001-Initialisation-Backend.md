# US-001 — Initialisation Backend

## Objectif

Mettre en place les fondations techniques du backend de Chaweer sans implémenter de logique métier.

Le résultat attendu est un backend moderne, maintenable et prêt à accueillir les futurs développements.

---

# Contexte

Chaweer est une plateforme numérique composée de plusieurs clients :

- API Backend
- Application Web
- Application Mobile

Le backend constitue l'unique source de vérité.

Aucune logique métier ne sera développée dans cette User Story.

Prisma sera installé dans la User Story US-003.

---

# Travail demandé

Créer un backend Node.js moderne dans :

apps/api

Le backend doit être développé avec :

- Node.js 22 LTS
- Express 5
- TypeScript
- Zod
- Pino
- dotenv
- Vitest
- Supertest
- ESLint
- Prettier

---

# Dépendances

Installer uniquement les dépendances nécessaires à cette User Story.

Ne pas installer Prisma.

Ne pas installer JWT.

Ne pas installer bcrypt.

Ne pas installer Swagger.

---

# Architecture attendue

Créer l'arborescence suivante.

```text
apps/api/

src/

    app.ts

    server.ts

    config/

    core/

        errors/

        middleware/

        logger/

    shared/

        types/

        utils/

        constants/

    modules/

    tests/

package.json

tsconfig.json

.env.example

.eslintrc

.prettierrc

.gitignore

README.md
```

---

# Configuration

Configurer :

- TypeScript strict
- ESLint
- Prettier
- Variables d'environnement
- Scripts npm
- Hot Reload pour le développement

---

# Scripts npm

Configurer au minimum :

```text
dev

build

start

test

lint

format
```

---

# Fonctionnalités attendues

Créer :

## Application Express

Créer une application Express correctement initialisée.

---

## Serveur

Créer le serveur HTTP.

Le port est lu depuis :

PORT

Valeur par défaut :

3000

---

## Health Check

Créer une route :

GET /health

Réponse attendue :

```json
{
  "status": "ok",
  "service": "chaweer-api"
}
```

---

## Gestion des erreurs

Préparer un middleware global de gestion des erreurs.

Aucune logique métier.

---

## Logger

Configurer Pino.

Le logger doit être prêt à être utilisé dans les prochaines User Stories.

---

## Validation

Préparer Zod.

Aucun schéma métier à créer.

---

## Variables d'environnement

Créer :

.env.example

avec :

```text
PORT=3000
NODE_ENV=development
```

---

# Contraintes

Ne créer :

- aucun modèle Prisma
- aucune migration
- aucune base PostgreSQL
- aucune authentification
- aucun module métier
- aucun endpoint métier
- aucun contrôleur métier

Cette User Story prépare uniquement les fondations techniques.

---

# Critères d'acceptation

Le projet compile.

Le projet démarre.

GET /health répond correctement.

Les scripts npm fonctionnent.

Aucune erreur ESLint.

Aucune erreur TypeScript.

Le code respecte AI-PLAYBOOK.md.

L'architecture respecte .windsurf/architecture.md.

---

# Tests attendus

Créer un test automatique vérifiant :

GET /health

Le test doit réussir.

---

# Livrables

Backend initialisé.

Architecture créée.

Configuration TypeScript.

Configuration ESLint.

Configuration Prettier.

Configuration Vitest.

Configuration Supertest.

Configuration Pino.

Configuration Zod.

Route /health.

Documentation README.

---

# Définition de Terminé

La User Story est terminée lorsque :

- le backend démarre ;
- les tests passent ;
- le lint passe ;
- le build passe ;
- la documentation est à jour ;
- aucun avertissement critique n'est présent.

---

# Statut

À faire