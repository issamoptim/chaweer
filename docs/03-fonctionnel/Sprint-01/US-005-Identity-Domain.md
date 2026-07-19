# US-005 — Identity Domain

## Business Value

Établir le domaine d'identité de Chaweer afin de fournir une base solide, sécurisée et évolutive pour l'ensemble des mécanismes d'authentification et d'autorisation.

Cette User Story ne met en œuvre aucune logique d'authentification.

Elle définit uniquement le modèle de données d'identité.

---

# Contexte

Chaweer permettra plusieurs méthodes d'authentification.

Version 1 :

- Email + mot de passe
- Google OAuth

Version 2 :

- Téléphone + OTP

Le modèle de données doit être conçu dès aujourd'hui pour supporter cette évolution sans refonte.

---

# Objectif

Créer le domaine Identity dans Prisma.

Aucune route.

Aucun service.

Aucun contrôleur.

Aucun JWT.

Aucun middleware.

Uniquement le modèle de données.

---

# Règles métier

## Fournisseur d'authentification

Le fournisseur choisi lors de la création du compte est définitif.

Un utilisateur créé avec :

- LOCAL

se connectera toujours avec :

- Email + mot de passe

Un utilisateur créé avec :

- GOOGLE

se connectera toujours avec :

- Google OAuth

Le changement de fournisseur n'est pas autorisé.

---

## Adresse email

Un email correspond à un seul compte.

Cette règle est valable quel que soit le fournisseur.

Exemples :

LOCAL + issam@gmail.com

GOOGLE + issam@gmail.com

=> interdit.

Le système doit garantir l'unicité.

---

## Identifiant

Utiliser :

Prisma CUID

```
id String @id @default(cuid())
```

---

# Modèles

Créer uniquement :

## User

## Enum Role

CLIENT

PROFESSIONAL

ADMIN

## Enum AuthProvider

LOCAL

GOOGLE

## Enum UserStatus

PENDING_EMAIL_VERIFICATION

ACTIVE

SUSPENDED

DELETED

---

# Champs User

Créer uniquement les champs suivants.

id

email

passwordHash (nullable)

firstName

lastName

avatarUrl (nullable)

role

authProvider

status

createdAt

updatedAt

---

# Contraintes

email unique

index sur :

email

role

status

authProvider

Aucune autre contrainte.

---

# Migration

Créer la migration Prisma.

Générer le Prisma Client.

---

# Hors périmètre

Ne pas créer :

- JWT
- Login
- Register
- Logout
- Refresh Token
- Google OAuth
- Téléphone
- OTP
- Middleware
- Routes REST
- Contrôleurs
- Services
- Validation métier

---

# Qualité

Respecter les bonnes pratiques Prisma 7.

Vérifier la documentation officielle avant toute implémentation.

Ne jamais revenir à un pattern Prisma 5/6.

---

# Vérifications obligatoires

Exécuter :

prisma format

prisma validate

prisma migrate dev

prisma generate

npm run build

npm run lint

npm test

Corriger toute erreur avant de terminer.

---

# Critères d'acceptation

Le modèle User est créé.

Les enums sont créés.

Les contraintes sont correctes.

La migration est générée.

Le Prisma Client est généré.

Le build fonctionne.

Le lint fonctionne.

Les tests passent.

Aucune logique métier n'a été ajoutée.

---

# Livrables

schema.prisma

Migration Prisma

Prisma Client

Documentation mise à jour

---

# Définition de Terminé

La User Story est terminée lorsque :

- le domaine Identity est entièrement modélisé ;
- la migration est appliquée ;
- Prisma Client est généré ;
- build, lint et tests passent ;
- aucune logique d'authentification n'existe encore.

---

# Statut

À faire