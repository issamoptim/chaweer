# AI PLAYBOOK

## Mission du projet

Décrire Chaweer comme une plateforme numérique mettant en relation des utilisateurs et des professionnels du droit.

Chaweer est une marketplace juridique marocaine.

La Version 1 permet uniquement aux avocats de proposer des consultations vidéo.

Les versions futures intégreront d'autres professions juridiques ainsi que des prestations plus complexes.

---

## Vision

Construire une plateforme juridique marocaine moderne, évolutive et multi-clients.

---

## Plateformes

Le projet comporte trois applications.

- API Backend
- Application Web
- Application Mobile

Le backend est partagé.

Aucune logique métier ne doit dépendre d'une plateforme.

---

## Architecture

Architecture API First.

Le backend constitue l'unique source de vérité.

Toutes les interfaces consomment la même API REST.

---

## Stack officielle

Backend

- Node.js 22 LTS
- TypeScript
- Express
- Prisma
- PostgreSQL
- Zod

Web

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui

Mobile

- React Native
- Expo
- TypeScript

---

## Principes

- Domain-Driven Design (DDD)
- API First
- Clean Architecture
- Modularité
- Simplicité
- Évolutivité

---

## Workflow

User Story

↓

Implémentation

↓

Tests

↓

Code Review

↓

Merge

---

## Règles

- Ne jamais inventer une règle métier.
- Toujours consulter la documentation avant de coder.
- Ne jamais casser une API existante.
- Ne jamais modifier Prisma sans migration.
- Ne jamais mettre de logique métier dans le frontend.
- Une Pull Request = une seule User Story.

---

## Documentation de référence

Avant toute implémentation consulter :

1. .windsurf/project.md
2. .windsurf/architecture.md
3. .windsurf/rules.md
4. docs/
