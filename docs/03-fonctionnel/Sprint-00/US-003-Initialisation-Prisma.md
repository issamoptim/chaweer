# US-003 — Initialisation Prisma

## Business Value

Mettre en place l'infrastructure de persistance des données de Chaweer afin de garantir une base solide, maintenable et évolutive pour toutes les futures fonctionnalités métier.

Cette User Story ne crée aucun objet métier.

Elle prépare uniquement l'infrastructure Prisma.

---

# Contexte

Chaweer utilise :

- PostgreSQL
- Prisma ORM

Toutes les données de la plateforme transiteront exclusivement par Prisma.

Aucun accès SQL direct ne sera utilisé dans l'application.

Cette User Story prépare uniquement :

- Prisma
- PostgreSQL
- Prisma Client
- Migrations
- Configuration

Aucun modèle métier ne doit être créé.

---

# Objectif

Configurer complètement Prisma dans :

apps/api

Le backend doit être prêt à accueillir les futurs modèles métier.

---

# Travail demandé

Installer :

- prisma
- @prisma/client

Initialiser Prisma.

Créer :

apps/api/prisma/

schema.prisma

---

# Provider

Configurer :

provider = "postgresql"

Datasource :

DATABASE_URL

---

# Générateur

Configurer :

generator client

avec :

provider = "prisma-client-js"

---

# Premier schema.prisma

Le fichier doit uniquement contenir :

- generator
- datasource

Aucun model.

Aucune enum.

Aucun type.

---

# Variables d'environnement

Créer :

.env

Créer :

.env.example

Ajouter :

DATABASE_URL

Exemple :

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chaweer"

---

# Scripts npm

Ajouter :

prisma:generate

prisma:migrate

prisma:studio

prisma:format

---

# Prisma Client

Configurer la génération automatique.

Créer un client Prisma réutilisable.

Créer :

src/core/database/

prisma.ts

Le client devra être singleton.

---

# Docker

Ne pas créer Docker.

Docker sera traité dans US-004.

---

# Migrations

Créer uniquement :

la migration initiale Prisma.

Elle ne doit contenir aucun modèle.

---

# Contraintes

Ne pas créer :

- User
- Professional
- Review
- Offer
- Appointment
- Booking
- Consultation
- Payment
- Notification

Ne créer :

- aucune table
- aucune relation
- aucune enum
- aucun seed

Ne créer aucune logique métier.

---

# Architecture attendue

Créer uniquement :

apps/api/

prisma/

schema.prisma

src/

core/

database/

prisma.ts

---

# Qualité

Utiliser les dernières versions stables officiellement publiées.

Respecter AI-PLAYBOOK.md.

Respecter .windsurf/architecture.md.

---

# Vérifications obligatoires

Exécuter :

npm run prisma:generate

npm run prisma:format

npm run build

npm run lint

npm test

Corriger toutes les erreurs.

---

# Critères d'acceptation

Prisma est installé.

Prisma Client est généré.

schema.prisma est valide.

Le build fonctionne.

Le lint fonctionne.

Les tests existants passent.

Aucune erreur TypeScript.

Aucun modèle métier n'existe.

---

# Livrables

Installation Prisma.

Configuration PostgreSQL.

schema.prisma.

Prisma Client singleton.

Scripts npm.

Variables d'environnement.

Documentation mise à jour.

---

# Définition de Terminé

La User Story est terminée lorsque :

- Prisma est entièrement configuré.
- Le client est généré.
- Le projet compile.
- Les tests passent.
- Le lint passe.
- Aucun modèle métier n'a été créé.

---

# Statut

À faire