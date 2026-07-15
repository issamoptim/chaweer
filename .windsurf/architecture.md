# Architecture

## Vision

Chaweer est une plateforme composée de plusieurs clients consommant une API REST commune.

Le backend est l'unique source de vérité.

---

## Architecture globale

```
                PostgreSQL
                     │
                  Prisma
                     │
              Express REST API
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   React Web               React Native
       (Vite)                  (Expo)
```

---

## Principes

- API First
- Domain-Driven Design (DDD)
- Clean Architecture
- Modularité
- Séparation des responsabilités
- Faible couplage
- Forte cohésion

---

## Backend

Le backend :

- implémente toutes les règles métier ;
- expose une API REST ;
- valide toutes les données ;
- gère la sécurité ;
- accède seul à PostgreSQL via Prisma.

---

## Frontend Web

Le frontend Web :

- consomme exclusivement l'API REST ;
- ne contient aucune logique métier ;
- gère uniquement l'interface utilisateur.

---

## Application Mobile

L'application mobile :

- consomme exactement la même API REST ;
- partage les mêmes règles métier ;
- possède sa propre interface utilisateur.

---

## Base de données

- PostgreSQL est la base officielle.
- Prisma est l'unique couche d'accès aux données.
- Aucune requête SQL directe sans justification.

---

## Structure des applications

apps/

- api/
- web/
- mobile/

---

## Domaines métier

Le projet est organisé autour des domaines suivants :

- Utilisateur
- Professionnel
- Domaine d'activité
- Catalogue des prestations
- Offre
- Agenda
- Créneau
- Réservation
- Consultation
- Paiement
- Avis

---

## Règles d'architecture

- Aucun accès direct à la base depuis le frontend.
- Toute logique métier est centralisée dans le backend.
- Toute nouvelle fonctionnalité doit être pensée pour être utilisable par le Web et le Mobile.
- Les modules doivent être indépendants autant que possible.
