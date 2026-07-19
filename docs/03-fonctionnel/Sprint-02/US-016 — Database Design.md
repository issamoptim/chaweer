---
title: US-016 — Identity & Profile Database Design
id: US-016
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-015 REST API
next:
  - US-017 Frontend Architecture
---

# US-016 — Identity & Profile Database Design

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit le modèle de persistance du domaine **Identity & Profile**.

Elle décrit la traduction du Domain Model en un modèle relationnel implémenté dans PostgreSQL à l'aide de Prisma.

Ce document constitue la référence de la couche **Infrastructure**. Il précise les tables, les colonnes, les relations, les contraintes et les conventions de persistance nécessaires à l'implémentation du domaine.

Il ne décrit ni les règles métier ni le comportement fonctionnel des entités, qui sont définis dans les User Stories du Domain Model.

---

# 2. Principes de persistance

Le modèle de données respecte les principes suivants :

- le Domain Model est la source de vérité ;
- la base de données est une représentation persistante du domaine ;
- chaque Aggregate Root possède sa propre représentation relationnelle ;
- aucune logique métier n'est implémentée dans le schéma de données ;
- les contraintes fonctionnelles sont appliquées par la couche Domain ;
- la persistance est indépendante des API REST et des interfaces clientes ;
- chaque table possède une responsabilité unique.

---

# 3. Modèle relationnel

Le domaine **Identity & Profile** est composé des quatre tables suivantes.

```text
Account
│
├── IdentityProvider
│
└── Profile
      │
      └── ProfessionalProfile
```

Relations :

- un `Account` possède un ou plusieurs `IdentityProvider` ;
- un `Account` possède exactement un `Profile` ;
- un `Profile` peut posséder zéro ou un `ProfessionalProfile`.

---

# 4. Conventions de modélisation

Toutes les tables du domaine respectent les conventions suivantes.

## 4.1 Clés primaires

Toutes les entités utilisent un identifiant **UUID v7**.

Exemple :

```text
id UUID
```

Cette convention est appliquée à l'ensemble de la plateforme.

---

## 4.2 Clés étrangères

Toutes les relations utilisent également des UUID.

Exemple :

```text
accountId UUID

profileId UUID
```

---

## 4.3 Audit

Les tables métier possèdent les colonnes suivantes :

| Colonne | Description |
|----------|-------------|
| createdAt | Date de création |
| updatedAt | Date de dernière modification |

---

## 4.4 Suppression logique

Les entités persistantes utilisent une suppression logique.

| Colonne | Description |
|----------|-------------|
| deletedAt | Date de suppression logique |

Aucune suppression physique n'est effectuée sur les données métier.

---

## 4.5 Conventions de nommage

| Élément | Convention |
|----------|------------|
| Modèles Prisma | PascalCase |
| Tables PostgreSQL | snake_case |
| Colonnes | camelCase |
| Clés étrangères | `<entity>Id` |

Exemple :

| Prisma | PostgreSQL |
|----------|------------|
| ProfessionalProfile | professional_profile |
| IdentityProvider | identity_provider |

# 5. Table Account

## Description

La table **Account** représente le compte technique d'un utilisateur.

Elle est responsable de l'identité technique, de la sécurité et du cycle de vie du compte.

Elle ne contient aucune information personnelle ni professionnelle.

---

## Colonnes

| Colonne | Type | Nullable | Description |
|----------|------|----------|-------------|
| id | UUID | Non | Identifiant unique |
| status | AccountStatus | Non | Statut du compte |
| lastLoginAt | Timestamp | Oui | Dernière connexion |
| createdAt | Timestamp | Non | Date de création |
| updatedAt | Timestamp | Non | Date de dernière modification |
| deletedAt | Timestamp | Oui | Date de suppression logique |

---

## Relations

| Relation | Cardinalité |
|----------|-------------|
| IdentityProvider | 1 → N |
| Profile | 1 → 1 |

---

## Contraintes

- un Account possède exactement un Profile ;
- un Account possède au moins un IdentityProvider.

---

## Index

- PK(id)
- INDEX(status)
- INDEX(createdAt)

---

# 6. Table IdentityProvider

## Description

La table **IdentityProvider** représente un moyen d'authentification associé à un compte.

Un utilisateur peut disposer de plusieurs méthodes de connexion.

Exemples :

- Email
- Téléphone
- Google

---

## Colonnes

| Colonne | Type | Nullable | Description |
|----------|------|----------|-------------|
| id | UUID | Non | Identifiant unique |
| accountId | UUID | Non | Compte associé |
| providerType | IdentityProviderType | Non | Type de fournisseur |
| providerIdentifier | String | Non | Identifiant unique du fournisseur |
| isPrimary | Boolean | Non | Fournisseur principal |
| isVerified | Boolean | Non | État de vérification |
| verifiedAt | Timestamp | Oui | Date de vérification |
| createdAt | Timestamp | Non | Date de création |
| updatedAt | Timestamp | Non | Date de dernière modification |

---

## Relations

| Relation | Cardinalité |
|----------|-------------|
| Account | N → 1 |

---

## Contraintes

- un IdentityProvider appartient à un seul Account ;
- le couple `(providerType, providerIdentifier)` est unique ;
- un seul IdentityProvider peut être principal par Account.

---

## Index

- PK(id)
- INDEX(accountId)
- UNIQUE(providerType, providerIdentifier)
- INDEX(isPrimary)

---

# 7. Table Profile

## Description

La table **Profile** représente l'identité personnelle d'un utilisateur.

Elle regroupe les informations civiles ainsi que les préférences générales de l'utilisateur.

---

## Colonnes

| Colonne | Type | Nullable | Description |
|----------|------|----------|-------------|
| id | UUID | Non | Identifiant unique |
| accountId | UUID | Non | Compte associé |
| firstName | String | Non | Prénom |
| lastName | String | Non | Nom |
| avatarUrl | String | Oui | Photo de profil |
| birthDate | Date | Oui | Date de naissance |
| nationality | String | Oui | Nationalité |
| city | String | Oui | Ville |
| country | String | Oui | Pays |
| preferredLanguage | String | Oui | Langue préférée |
| bio | Text | Oui | Biographie personnelle |
| createdAt | Timestamp | Non | Date de création |
| updatedAt | Timestamp | Non | Date de dernière modification |
| deletedAt | Timestamp | Oui | Date de suppression logique |

---

## Relations

| Relation | Cardinalité |
|----------|-------------|
| Account | 1 → 1 |
| ProfessionalProfile | 1 → 0..1 |

---

## Contraintes

- un Profile appartient à un seul Account ;
- un Account possède un unique Profile ;
- un Profile peut exister sans ProfessionalProfile.

---

## Index

- PK(id)
- UNIQUE(accountId)
- INDEX(city)
- INDEX(country)
# 8. Table ProfessionalProfile

## Description

La table **ProfessionalProfile** représente l'identité professionnelle d'un utilisateur.

Elle contient les informations nécessaires à la publication d'un profil professionnel sur la plateforme.

Un `ProfessionalProfile` est toujours associé à un `Profile`.

Un `Profile` peut exister sans `ProfessionalProfile`.

---

## Colonnes

| Colonne | Type | Nullable | Description |
|----------|------|----------|-------------|
| id | UUID | Non | Identifiant unique |
| profileId | UUID | Non | Profil associé |
| slug | String | Non | Identifiant public unique utilisé dans les URLs |
| professionalTitle | String | Non | Titre professionnel affiché |
| professionId | UUID | Non | Profession principale |
| biography | Text | Oui | Présentation professionnelle |
| experienceYears | Integer | Oui | Nombre d'années d'expérience |
| publicationStatus | ProfessionalPublicationStatus | Non | État de publication du profil |
| verificationStatus | VerificationStatus | Non | État de vérification du professionnel |
| acceptsAppointments | Boolean | Non | Indique si le professionnel accepte les demandes de rendez-vous |
| createdAt | Timestamp | Non | Date de création |
| updatedAt | Timestamp | Non | Date de dernière modification |
| deletedAt | Timestamp | Oui | Date de suppression logique |

---

## Relations

| Relation | Cardinalité |
|----------|-------------|
| Profile | 1 → 1 |

---

## Contraintes

- un ProfessionalProfile appartient à un seul Profile ;
- un Profile possède au maximum un ProfessionalProfile ;
- le slug est unique ;
- la profession principale est obligatoire.

---

## Index

- PK(id)
- UNIQUE(profileId)
- UNIQUE(slug)
- INDEX(professionId)
- INDEX(publicationStatus)
- INDEX(verificationStatus)
- INDEX(createdAt)

---

# 9. Vue d'ensemble du modèle

Le domaine **Identity & Profile** est représenté par les relations suivantes.

```text
                 Account
                    │
        ┌───────────┴───────────┐
        │                       │
IdentityProvider            Profile
                                │
                                │ 0..1
                                ▼
                     ProfessionalProfile
```

## Cardinalités

| Relation | Cardinalité |
|----------|-------------|
| Account → IdentityProvider | 1 → N |
| Account → Profile | 1 → 1 |
| Profile → ProfessionalProfile | 1 → 0..1 |

Ce schéma constitue le modèle relationnel du domaine **Identity & Profile**.

# 10. Énumérations (Enums)

Le domaine **Identity & Profile** utilise les énumérations suivantes.

---

## AccountStatus

Décrit l'état d'un compte utilisateur.

| Valeur | Description |
|---------|-------------|
| ACTIVE | Compte actif |
| SUSPENDED | Compte suspendu |
| BANNED | Compte définitivement banni |

---

## IdentityProviderType

Décrit le type d'un fournisseur d'identité.

| Valeur |
|---------|
| EMAIL |
| PHONE |
| GOOGLE |

Le modèle est extensible afin de permettre l'ajout de nouveaux fournisseurs d'identité.

---

## ProfessionalPublicationStatus

Décrit l'état de publication d'un profil professionnel.

| Valeur | Description |
|---------|-------------|
| DRAFT | Profil en cours de création |
| INCOMPLETE | Profil incomplet |
| PUBLISHED | Profil publié |
| HIDDEN | Profil masqué |
| ARCHIVED | Profil archivé |
| BANNED | Publication interdite |

---

## VerificationStatus

Décrit l'état de vérification d'un professionnel.

| Valeur | Description |
|---------|-------------|
| UNVERIFIED | Aucune vérification |
| PENDING | Vérification en cours |
| VERIFIED | Professionnel vérifié |
| REJECTED | Vérification refusée |

---

# 11. Contraintes globales

Le modèle de persistance applique les contraintes suivantes.

## Unicité

- chaque `Account` possède un unique `Profile` ;
- un `Profile` possède au maximum un `ProfessionalProfile` ;
- un `IdentityProvider` appartient à un seul `Account` ;
- le couple (`providerType`, `providerIdentifier`) est unique ;
- le `slug` d'un `ProfessionalProfile` est unique.

---

## Intégrité référentielle

Toutes les relations sont matérialisées par des clés étrangères.

La suppression d'une entité ne doit jamais créer de références orphelines.

---

## Audit

Les dates `createdAt` et `updatedAt` sont conservées pour toutes les entités persistantes.

Les entités métier utilisent une suppression logique via `deletedAt`.

---

# 12. Règles de conception

Le modèle de persistance respecte les règles suivantes :

- le Domain Model constitue la source de vérité ;
- chaque table possède une responsabilité unique ;
- chaque table représente une entité du domaine ;
- les relations sont explicites et matérialisées par des clés étrangères ;
- les identifiants utilisent des UUID v7 ;
- les dates sont stockées en UTC ;
- les noms des tables utilisent le format `snake_case` ;
- les modèles Prisma utilisent le format `PascalCase` ;
- les colonnes utilisent le format `camelCase`.

---

# 13. Résultat attendu

À l'issue de cette User Story, le modèle de persistance du domaine **Identity & Profile** est entièrement défini.

Le document fournit :

- la structure des tables ;
- les relations entre les entités ;
- les colonnes et leurs types ;
- les contraintes d'intégrité ;
- les index principaux ;
- les conventions de modélisation ;
- les énumérations utilisées par le domaine.

Il constitue la référence officielle pour l'implémentation du schéma PostgreSQL et des modèles Prisma du domaine **Identity & Profile**.