# US-006 — Local Authentication

## Business Value

Mettre en place le premier mécanisme complet d'authentification de Chaweer afin de permettre aux utilisateurs de créer un compte local sécurisé, de s'authentifier, de maintenir leur session et de se déconnecter selon les standards modernes de sécurité.

Cette User Story constitue le socle de tous les accès à la plateforme.

---

# Contexte

Le domaine Identity est déjà implémenté.

Le modèle User existe.

Les rôles existent.

Les statuts existent.

Le fournisseur d'authentification est déjà modélisé.

Cette User Story ajoute uniquement la logique d'authentification locale.

Google OAuth sera implémenté dans une User Story dédiée.

Le téléphone (OTP) sera implémenté en V2.

---

# Objectif

Implémenter une authentification locale complète comprenant :

- Register
- Login
- Refresh Token
- Logout
- JWT
- Hash des mots de passe
- Validation
- Cookies sécurisés
- Gestion des sessions

Cette User Story ne traite pas :

- Google OAuth
- OTP
- RBAC avancé
- Réinitialisation du mot de passe
- Vérification d'email (US dédiée)

---

# Architecture

L'architecture existante doit être conservée.

Aucune modification de l'organisation du projet n'est autorisée.

Aucune modification du domaine Identity existant.

Aucune modification Docker.

Aucune modification Prisma hors périmètre.

---

# Modèles

## User

Le modèle User existant est conservé.

Aucune modification métier.

---

## RefreshToken

Créer un nouveau modèle Prisma :

RefreshToken

Relation :

User 1 ---- N RefreshToken

Chaque connexion représente une session indépendante.

---

# Champs RefreshToken

Créer uniquement les champs nécessaires :

id

userId

tokenHash

expiresAt

createdAt

revokedAt (nullable)

---

# Règles métier

## Fournisseur

LOCAL uniquement.

Google OAuth est hors périmètre.

Téléphone hors périmètre.

---

## Email

Un email correspond à un seul compte.

Le système doit empêcher toute création de doublon.

---

## Password

Les mots de passe ne doivent jamais être stockés.

Utiliser exclusivement Argon2id.

Aucun autre algorithme n'est autorisé.

---

## Sessions

Les sessions multiples sont autorisées.

Chaque appareil possède son propre Refresh Token.

Exemples :

MacBook

iPhone

Chrome

Safari

Windows

Chaque session est indépendante.

---

## Refresh Token

Le Refresh Token ne doit jamais être stocké en clair.

Stocker uniquement son hash.

---

## Rotation

Chaque appel au endpoint Refresh :

révoque l'ancien Refresh Token

génère un nouveau Refresh Token

génère un nouveau JWT

remplace le cookie HttpOnly

---

## Logout

Logout :

supprime le cookie

révoque le Refresh Token

ne supprime pas les autres sessions

---

## Authentification

Une fois connecté :

Access Token

+

Refresh Token

Le Refresh Token est stocké uniquement dans un Cookie HttpOnly.

L'Access Token est destiné à être conservé uniquement en mémoire côté frontend.

Aucun stockage LocalStorage.

Aucun stockage SessionStorage.

---

# JWT

Deux tokens :

Access Token

Refresh Token

Durées :

Access Token :

15 minutes

Refresh Token :

30 jours

---

# Cookies

Refresh Token :

HttpOnly

Secure (production)

SameSite adapté

Le cookie ne doit jamais être accessible en JavaScript.

---

# Sécurité

Le fournisseur d'authentification est définitif.

LOCAL reste LOCAL.

GOOGLE restera GOOGLE (future US).

Aucun changement de fournisseur n'est autorisé.

---

# Hors périmètre

Ne pas créer :

Google OAuth

OTP

Password Reset

Email Verification

RBAC avancé

Permissions

AuditLog

Authentification téléphone

Authentification sociale
# Flux fonctionnels

## Register

### Endpoint

POST /auth/register

---

## Objectif

Créer un nouveau compte utilisateur utilisant le fournisseur LOCAL.

---

## Règles métier

Le fournisseur d'authentification est obligatoirement :

LOCAL

Le système doit empêcher la création d'un compte si l'adresse email existe déjà.

L'adresse email est unique quel que soit le fournisseur d'authentification.

Le mot de passe doit être hashé avec Argon2id avant toute persistance.

Le mot de passe ne doit jamais être journalisé.

Le mot de passe ne doit jamais être renvoyé dans une réponse API.

Le compte est créé avec :

status = PENDING_EMAIL_VERIFICATION

role = CLIENT

authProvider = LOCAL

Aucun JWT ne doit être retourné.

Aucun Refresh Token ne doit être créé.

La connexion ne sera autorisée qu'après validation de l'adresse email.

---

## Validation

Valider obligatoirement :

- email
- mot de passe
- prénom
- nom

Utiliser une validation côté serveur.

---

## Réponse

201 Created

```json
{
  "success": true,
  "data": {
    "message": "Votre compte a été créé. Veuillez vérifier votre adresse e-mail."
  }
}
```

---

# Login

## Endpoint

POST /auth/login

---

## Objectif

Authentifier un utilisateur LOCAL.

---

## Ordre des vérifications

Le backend doit impérativement respecter cet ordre.

### 1

Recherche de l'utilisateur par email.

---

### 2

Si aucun utilisateur :

Retourner

401 Unauthorized

Message :

Email ou mot de passe incorrect.

Ne jamais révéler que le compte n'existe pas.

---

### 3

Vérifier :

authProvider == LOCAL

Si le compte est GOOGLE :

Retourner

401 Unauthorized

Message :

Veuillez utiliser votre méthode de connexion habituelle.

---

### 4

Vérifier le mot de passe avec Argon2id.

En cas d'échec :

401 Unauthorized

Même message.

---

### 5

Vérifier le statut.

Si :

PENDING_EMAIL_VERIFICATION

Retourner

403 Forbidden

Message :

Votre adresse e-mail n'a pas encore été vérifiée.

---

### 6

Si :

SUSPENDED

Retourner

403 Forbidden

Message :

Votre compte est suspendu.

Veuillez contacter le support.

---

### 7

Connexion réussie

Créer :

Access Token

Créer :

Refresh Token

Stocker uniquement le hash du Refresh Token.

Créer une nouvelle session.

Créer le cookie HttpOnly.

Retourner :

200 OK

---

## Réponse

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "user": {
      ...
    }
  }
}
```

Le Refresh Token ne doit jamais apparaître dans le JSON.

Il est uniquement envoyé dans un Cookie HttpOnly.

---

# Refresh Token

## Endpoint

POST /auth/refresh

---

## Objectif

Renouveler une session utilisateur.

---

## Règles

Le Refresh Token est lu uniquement depuis le Cookie HttpOnly.

Ne jamais accepter un Refresh Token dans le body.

Ne jamais accepter un Refresh Token dans les headers.

---

## Vérifications

Le Refresh Token doit :

exister

ne pas être expiré

ne pas être révoqué

correspondre au hash enregistré

---

## Rotation

En cas de succès :

Révoquer l'ancien Refresh Token.

Créer un nouveau Refresh Token.

Créer un nouveau JWT.

Créer un nouveau Cookie HttpOnly.

Retourner :

200 OK

---

# Logout

## Endpoint

POST /auth/logout

---

## Objectif

Terminer uniquement la session courante.

---

## Traitement

Supprimer le Cookie HttpOnly.

Révoquer uniquement le Refresh Token correspondant.

Ne jamais supprimer les autres sessions.

---

## Réponse

204 No Content

---

# Sessions

Les connexions simultanées sont autorisées.

Chaque appareil possède son propre Refresh Token.

La déconnexion d'un appareil ne déconnecte pas les autres.

---

# Réponses API

Toutes les réponses doivent respecter le format standard du projet.

---

## Succès

```json
{
  "success": true,
  "data": {}
}
```

---

## Erreur

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect."
  }
}
```

---

# Codes d'erreur

Utiliser exclusivement les codes suivants.

VALIDATION_ERROR

INVALID_CREDENTIALS

EMAIL_ALREADY_EXISTS

EMAIL_NOT_VERIFIED

ACCOUNT_SUSPENDED

INVALID_REFRESH_TOKEN

TOKEN_EXPIRED

UNAUTHORIZED

FORBIDDEN

NOT_FOUND

CONFLICT

INTERNAL_ERROR

---

# Codes HTTP

201 Created

200 OK

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error

# Sécurité

## Principes généraux

Toute l'implémentation doit respecter les bonnes pratiques OWASP.

Ne jamais privilégier la simplicité au détriment de la sécurité.

Toute décision de sécurité non prévue dans cette User Story doit être signalée avant implémentation.

---

# Hash des mots de passe

Utiliser exclusivement :

Argon2id

Aucun autre algorithme n'est autorisé.

Interdictions :

- MD5
- SHA1
- SHA256
- bcrypt
- scrypt
- chiffrement réversible

Le mot de passe ne doit jamais :

- être stocké en clair
- être journalisé
- être renvoyé dans une réponse API
- être affiché dans une erreur

---

# JWT

Les JWT doivent être signés.

Ne jamais utiliser l'algorithme "none".

Les secrets doivent provenir exclusivement des variables d'environnement.

Ne jamais écrire un secret dans le code source.

---

# Refresh Token

Le Refresh Token ne doit jamais être :

- stocké en clair
- renvoyé dans le JSON
- accepté dans le body
- accepté dans les query parameters
- accepté dans les headers

Le Refresh Token est transporté uniquement par Cookie HttpOnly.

---

# Cookie

Configurer le Cookie avec les attributs adaptés :

HttpOnly

Secure (production)

SameSite

Path

Max-Age

Le cookie doit être supprimé lors du Logout.

---

# Validation

Toutes les données entrantes doivent être validées.

Aucune donnée utilisateur ne doit être utilisée avant validation.

Les validations doivent être centralisées.

---

# Rate Limiting

Implémenter une protection contre les attaques par force brute.

Appliquer une limitation :

- par adresse IP
- par adresse email

Le système doit automatiquement lever la limitation après expiration.

Ne jamais bloquer définitivement un utilisateur.

---

# Account Enumeration

Le système ne doit jamais permettre de déterminer si une adresse email existe.

Les réponses suivantes doivent être identiques :

- email inexistant
- mot de passe incorrect

Toujours retourner :

401 Unauthorized

Message :

Email ou mot de passe incorrect.

---

# Sessions

Chaque connexion crée une nouvelle session.

Chaque session possède son propre Refresh Token.

Le Logout ne révoque que la session courante.

Les autres appareils restent connectés.

---

# Rotation des Refresh Tokens

Chaque appel :

POST /auth/refresh

doit :

- invalider l'ancien Refresh Token
- créer un nouveau Refresh Token
- créer un nouveau JWT
- remplacer le Cookie HttpOnly

Aucun Refresh Token ne doit être réutilisable.

---

# Variables d'environnement

Toutes les valeurs sensibles doivent provenir des variables d'environnement.

Exemples :

JWT Secret

Durée des Tokens

Configuration des Cookies

Aucun secret ne doit être versionné.

---

# Logging

Ne jamais journaliser :

- mots de passe
- JWT
- Refresh Tokens
- secrets
- variables sensibles

Les logs doivent rester exploitables sans divulguer d'informations confidentielles.

---

# Performances

Le Login doit effectuer uniquement les traitements nécessaires.

Ne jamais effectuer de requêtes inutiles.

Les index Prisma doivent être utilisés efficacement.

---

# Qualité

Le code doit respecter :

- SOLID
- Clean Code
- Separation of Concerns
- Single Responsibility Principle

Aucune duplication importante.

Aucune logique métier dans les Controllers.

---

# Gestion des erreurs

Toutes les erreurs doivent être centralisées.

Aucune stack trace ne doit être exposée au client.

Les messages utilisateurs doivent être compréhensibles.

Les erreurs internes doivent être journalisées.

---

# Vérifications obligatoires

Avant de terminer :

Exécuter :

prisma format

prisma validate

prisma generate

npm run build

npm run lint

npm test

Corriger toute erreur avant la fin de l'implémentation.

---

# Tests obligatoires

Vérifier au minimum :

## Register

Création réussie

Email déjà utilisé

Validation des champs

Mot de passe hashé

Statut initial

---

## Login

Connexion valide

Email inconnu

Mot de passe incorrect

Compte suspendu

Email non vérifié

Compte Google utilisant le Login LOCAL

---

## Refresh

Refresh valide

Refresh expiré

Refresh révoqué

Rotation du Refresh Token

Cookie remplacé

---

## Logout

Révocation de la session courante

Suppression du Cookie

Conservation des autres sessions

---

# Critères d'acceptation

Le Register fonctionne.

Le Login fonctionne.

Le Refresh fonctionne.

Le Logout fonctionne.

Les JWT sont générés.

Les Refresh Tokens sont hashés.

Les Cookies HttpOnly sont correctement configurés.

Les Sessions multiples fonctionnent.

Les Refresh Tokens sont rotatifs.

Le Rate Limiting est actif.

Les erreurs sont standardisées.

Les réponses API respectent le contrat du projet.

Aucune logique Google OAuth.

Aucune logique OTP.

Aucune régression sur US-005.

Build OK.

Lint OK.

Tests OK.
# Livrables

L'implémentation devra produire uniquement les livrables suivants.

## Modèles Prisma

Création du modèle :

RefreshToken

Migration Prisma associée.

---

## Backend

Implémentation des endpoints :

POST /auth/register

POST /auth/login

POST /auth/refresh

POST /auth/logout

---

## Sécurité

Implémentation :

JWT

Refresh Tokens

Rotation des Refresh Tokens

Cookie HttpOnly

Hash Argon2id

Rate Limiting

Validation des données

Gestion centralisée des erreurs

---

## Documentation

Mettre à jour uniquement la documentation concernée.

Ne jamais modifier une documentation hors périmètre.

---

# Hors périmètre

Ne pas implémenter :

Google OAuth

Téléphone

OTP

Password Reset

Forgot Password

Reset Password

Change Password

Email Verification

RBAC avancé

Permissions

Audit Log

2FA

Magic Link

Social Login

Apple Login

GitHub Login

Administration

Gestion des appareils

Historique des connexions

Toute fonctionnalité non explicitement demandée.

---

# Définition de Terminé

La User Story est considérée comme terminée uniquement si :

Le modèle RefreshToken existe.

La migration Prisma est appliquée.

Le Prisma Client est généré.

Le Register fonctionne.

Le Login fonctionne.

Le Refresh fonctionne.

Le Logout fonctionne.

Les mots de passe sont hashés.

Les JWT sont générés.

Les Refresh Tokens sont hashés.

Les Cookies HttpOnly sont correctement configurés.

Les Sessions multiples fonctionnent.

Le Rate Limiting fonctionne.

Toutes les validations fonctionnent.

Les réponses API respectent le contrat.

Les erreurs sont standardisées.

Build OK.

Lint OK.

Tests OK.

Aucune régression sur les User Stories précédentes.

---

# Auto-review obligatoire

Avant de terminer l'implémentation :

Relire intégralement cette User Story.

Vérifier chaque Critère d'acceptation.

Vérifier que chaque règle métier est respectée.

Vérifier que rien hors périmètre n'a été ajouté.

Vérifier qu'aucune architecture n'a été modifiée.

Vérifier qu'aucune dépendance inutile n'a été installée.

Vérifier que tous les secrets proviennent des variables d'environnement.

Vérifier que tous les Refresh Tokens sont hashés.

Vérifier que tous les Cookies sont HttpOnly.

Vérifier que tous les JWT sont correctement signés.

Corriger toute erreur avant de terminer.

---

# Garde-fous

Avant toute implémentation :

Lire obligatoirement :

AI-PLAYBOOK.md

.windsurf/project.md

.windsurf/architecture.md

.windsurf/rules.md

US-005-Identity-Domain.md

US-006-Local-Authentication.md

Ces documents constituent la référence officielle du projet.

---

# En cas de doute

Ne jamais improviser.

Si une décision d'architecture est nécessaire :

Arrêter immédiatement.

Présenter les différentes options.

Attendre une validation.

---

# Interdictions

Ne jamais :

Modifier un fichier hors périmètre.

Modifier l'architecture.

Créer un nouveau dossier sans nécessité.

Installer une dépendance non justifiée.

Utiliser une bibliothèque non maintenue.

Modifier Docker.

Modifier Prisma hors périmètre.

Modifier le domaine Identity.

Modifier les User Stories précédentes.

Introduire une dette technique.

Contourner une erreur.

Masquer une erreur.

---

# Vérifications finales

Exécuter obligatoirement :

prisma format

prisma validate

prisma migrate dev

prisma generate

npm run build

npm run lint

npm test

Toutes les commandes doivent réussir.

Aucune erreur ne doit rester.

---

# Rapport final

Le rapport final devra contenir uniquement :

## Fichiers créés

## Fichiers modifiés

## Dépendances installées

## Commandes exécutées

## Résultat des vérifications

## Résultat des tests

## Auto-review

## Éventuels points d'attention

Aucune information inutile.

---

# Workflow

Cette User Story doit obligatoirement être réalisée selon le workflow suivant :

1. Analyse de la User Story
2. Vérification de la documentation officielle
3. Production d'un plan détaillé
4. Attente de validation
5. Implémentation
6. Auto-review complète
7. Vérifications techniques
8. Rapport final

L'implémentation ne doit jamais commencer sans validation explicite du plan.

---

# Statut

À faire