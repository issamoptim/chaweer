# US-007 — Google Authentication

---

# Business Value

Permettre aux utilisateurs de créer un compte et de se connecter avec leur compte Google de manière rapide, sécurisée et sans friction.

Cette User Story enrichit le système d'authentification existant en ajoutant Google comme second fournisseur d'identité tout en réutilisant l'ensemble de l'infrastructure de sécurité mise en place dans US-006.

L'objectif est d'offrir une expérience utilisateur moderne sans compromettre la sécurité, la cohérence des comptes ou l'architecture du domaine Identity.

---

# Contexte

Le domaine Identity est déjà implémenté.

L'authentification locale est entièrement opérationnelle.

Les fonctionnalités suivantes existent déjà :

- Authentification Email / Mot de passe
- JWT
- Refresh Token Rotation
- Sessions multiples
- Cookies HttpOnly
- Rate Limiting
- Gestion des rôles
- Gestion des statuts utilisateur
- Gestion centralisée des erreurs

Google Authentication doit venir s'intégrer dans cette architecture sans créer de mécanisme parallèle.

Tous les principes de sécurité définis dans US-006 restent applicables.

---

# Objectif

Ajouter Google comme second fournisseur d'authentification.

Cette User Story permet :

- la création automatique d'un compte lors de la première authentification Google ;
- la connexion des utilisateurs Google ;
- la génération des JWT ;
- la création des Refresh Tokens ;
- la gestion des sessions ;
- la réutilisation complète de l'infrastructure existante.

Cette User Story ne modifie pas l'authentification locale.

---

# Vision d'architecture

Google Authentication n'est pas un système indépendant.

Il constitue un fournisseur supplémentaire venant alimenter le domaine Identity.

Toutes les fonctionnalités suivantes doivent être partagées avec l'authentification locale :

- JWT
- Cookies
- Refresh Tokens
- Rotation
- Logout
- Gestion des sessions
- Middleware d'authentification
- Gestion des erreurs

Aucune duplication de logique n'est autorisée.

---

# Fournisseurs d'authentification

Version actuelle :

- LOCAL
- GOOGLE

Versions futures :

- APPLE
- LINKEDIN
- Téléphone + OTP

L'architecture doit permettre l'ajout d'un nouveau fournisseur sans refonte du domaine Identity.

---

# Règles métier

## Un compte = un fournisseur

Le fournisseur choisi lors de la création du compte reste définitif.

Exemple :

LOCAL

↓

toujours LOCAL

GOOGLE

↓

toujours GOOGLE

Le changement de fournisseur n'est pas autorisé.

La fusion automatique de plusieurs fournisseurs n'est pas autorisée.

---

## Adresse email

Un email correspond à un seul compte.

Exemples :

LOCAL

issam@gmail.com

↓

autorisé

GOOGLE

issam@gmail.com

↓

interdit si un compte LOCAL existe déjà.

Inversement :

LOCAL

issam@gmail.com

↓

interdit si un compte GOOGLE existe déjà.

Le système garantit cette unicité.

---

## Première authentification Google

Lorsqu'un utilisateur clique :

Continuer avec Google

deux situations existent.

### Cas 1

Le compte n'existe pas.

Le système crée automatiquement :

- le compte utilisateur ;
- l'identité Google associée ;
- la première session.

L'utilisateur est connecté immédiatement.

Aucun écran intermédiaire n'est affiché.

---

### Cas 2

Le compte existe déjà.

Si ce compte appartient déjà au fournisseur GOOGLE :

la connexion est autorisée.

Si ce compte appartient au fournisseur LOCAL :

aucun nouveau compte n'est créé.

La connexion est refusée.

Aucune fusion automatique n'est réalisée.

---

# Création automatique du profil

Google fournit notamment :

- email
- prénom
- nom
- photo de profil
- identifiant Google (sub)

Ces informations sont automatiquement enregistrées.

L'utilisateur n'a pas besoin de compléter son profil avant sa première connexion.

Le profil pourra être enrichi ultérieurement.

---

# Vérification de l'adresse email

Google garantit que l'adresse email transmise est vérifiée.

Par conséquent, les comptes créés via Google sont directement créés avec :

ACTIVE

Aucune vérification email supplémentaire n'est demandée.

---

# Mot de passe

Les comptes Google ne possèdent pas de mot de passe local.

Le champ :

passwordHash

reste nul.

Aucun mot de passe n'est créé.

Aucun mot de passe n'est demandé.

---

# Attribution du rôle

Le rôle dépend exclusivement du parcours d'inscription.

Le frontend ne choisit jamais le rôle.

Le backend le détermine selon le point d'entrée utilisé.

Exemple :

Connexion Google Client

↓

CLIENT

Connexion Google Professionnel

↓

PROFESSIONAL

Le navigateur ne peut jamais demander un rôle arbitraire.

---

# Professionnels

Lors du lancement de la plateforme,

les professionnels peuvent créer leur compte immédiatement.

Ils peuvent :

- compléter leur profil ;
- publier leurs informations ;
- répondre aux questions ;
- recevoir des rendez-vous.

En revanche,

aucun badge de vérification n'est attribué automatiquement.

Le processus de vérification des professionnels sera implémenté dans une User Story dédiée.

---

# External Identity

Le système ne doit pas se baser uniquement sur l'adresse email.

L'identifiant unique fourni par Google (`sub`) doit être conservé.

Une entité dédiée doit être utilisée afin de permettre, à terme, l'ajout d'autres fournisseurs d'identité (Apple, LinkedIn, etc.) sans modifier le modèle `User`.

Cette entité constitue la référence entre un utilisateur Chaweer et son identité externe.

---
# Architecture du domaine Identity

Google Authentication ne doit pas introduire un modèle spécifique à Google.

L'architecture doit être conçue pour accueillir plusieurs fournisseurs d'identité.

Pour cette raison, les identités externes doivent être isolées dans une entité dédiée.

Le modèle `User` reste la référence métier unique.

Chaque identité externe est rattachée à un seul utilisateur.

Cette architecture permettra ultérieurement d'ajouter :

- Apple
- LinkedIn
- Microsoft (si nécessaire)
- Authentification par téléphone
- Tout autre fournisseur OAuth/OpenID Connect

sans modifier le modèle `User`.

---

# Modèle ExternalIdentity

Créer un nouveau modèle Prisma :

ExternalIdentity

Ce modèle représente le lien entre un utilisateur Chaweer et un fournisseur d'identité externe.

Il contient uniquement les informations nécessaires à l'authentification.

Le modèle `User` continue de porter les informations métier.

---

## Champs

Créer uniquement les champs suivants :

id

userId

provider

providerUserId

createdAt

updatedAt

---

## provider

Enum.

Valeurs :

GOOGLE

Les autres fournisseurs seront ajoutés dans leurs User Stories respectives.

---

## providerUserId

Correspond au champ :

sub

retourné par Google.

Cet identifiant est immuable.

Il constitue la véritable identité Google.

L'authentification ne doit jamais dépendre uniquement de l'adresse email.

---

## Contraintes

Le couple :

provider

+

providerUserId

doit être unique.

Un utilisateur ne peut posséder qu'une seule identité Google.

---

## Relation

User

1

↓

N

ExternalIdentity

Cette architecture permet de supporter plusieurs fournisseurs dans le futur.

---

# Flux d'authentification Google

Le projet utilise **Google Identity Services (GIS)** comme mécanisme d'authentification côté client.

Le frontend ne réalise pas un flux OAuth basé sur une redirection complète de l'application.

Après authentification auprès de Google, le frontend obtient un **Authorization Code** via Google Identity Services puis le transmet au backend à l'aide d'une requête HTTPS POST sécurisée.

Le backend est le seul responsable :

- de l'échange du code auprès de Google ;
- de la validation de l'identité Google ;
- de la création ou récupération du compte Chaweer ;
- de la création de la session ;
- de la génération des JWT Chaweer ;
- de la création du Refresh Token ;
- de la création du Cookie HttpOnly.

Le backend reste l'unique source de vérité.

Aucune donnée utilisateur provenant directement du navigateur n'est considérée comme fiable.

---

# Parcours d'authentification

## Étape 1

L'utilisateur clique :

**Continuer avec Google**

---

## Étape 2

Le frontend déclenche Google Identity Services.

Google authentifie l'utilisateur.

Après consentement, Google retourne un **Authorization Code** au frontend.

---

## Étape 3

Le frontend envoie immédiatement ce code au backend via une requête HTTPS POST.

Exemple :

POST

/auth/google/client

ou

/auth/google/professional

selon le parcours choisi.

Le frontend n'envoie jamais :

- le rôle ;
- les informations utilisateur ;
- l'adresse email.

Il transmet uniquement le code fourni par Google.

---

## Étape 4

Le backend échange l'Authorization Code auprès de Google afin d'obtenir les informations d'identité officielles.

Le backend valide obligatoirement :

- la signature ;
- issuer ;
- audience ;
- expiration ;
- email_verified ;
- providerUserId (sub).

Si l'une de ces validations échoue,

l'authentification est refusée.

---

## Étape 5

Une fois le token Google validé,

le backend récupère exclusivement les informations officielles retournées par Google :

- sub
- email
- given_name
- family_name
- picture
- email_verified

Aucune information provenant du frontend n'est utilisée.

---

## Étape 6

Recherche d'une ExternalIdentity.

### Cas 1

ExternalIdentity trouvée

↓

connexion.

---

### Cas 2

Aucune ExternalIdentity.

↓

Recherche d'un utilisateur avec le même email.

Si aucun utilisateur n'existe :

création automatique :

- User
- ExternalIdentity
- Session

Puis connexion.

---

### Cas 3

Un utilisateur existe déjà avec le même email

mais appartient au fournisseur LOCAL.

↓

Connexion refusée.

Aucune fusion automatique.

Aucun nouveau compte.

---

## Étape 7

Le backend génère les éléments de sécurité Chaweer :

- JWT Access Token
- Refresh Token
- Session
- Cookie HttpOnly

Puis retourne exactement le même format de réponse que celui utilisé par US-006.

Google Authentication doit réutiliser intégralement l'infrastructure d'authentification existante.

Aucune architecture parallèle ne doit être créée.

---

# Architecture retenue

Google Authentication est considéré comme un fournisseur d'identité supplémentaire.

Le protocole OAuth/OpenID Connect est utilisé uniquement pour authentifier l'utilisateur auprès de Google.

Une fois cette authentification terminée,

Chaweer utilise exclusivement son propre système de sécurité :

- JWT Chaweer
- Refresh Tokens Chaweer
- Sessions Chaweer
- Cookies Chaweer

Les tokens Google ne sont jamais utilisés pour sécuriser les API métier de Chaweer.

Ils servent uniquement à établir l'identité de l'utilisateur lors de l'authentification.
---

# Création du compte

Lors de la première connexion Google :

Créer :

User

Créer :

ExternalIdentity

Créer :

Refresh Token

Créer :

JWT

Créer :

Cookie HttpOnly

Retourner la réponse d'authentification.

---

# Sessions

Le fonctionnement doit être identique à US-006.

Chaque connexion crée une nouvelle session.

Chaque session possède son propre Refresh Token.

La rotation reste obligatoire.

---

# JWT

Google n'utilise jamais directement ses propres tokens pour sécuriser les API Chaweer.

Après authentification Google,

Chaweer génère ses propres :

Access Token

Refresh Token

Les JWT Google ne sont jamais utilisés comme token d'API.

---

# Cookies

Le Refresh Token est stocké dans un cookie.

Conserver exactement les mêmes paramètres que US-006.

HttpOnly

Secure

SameSite

Path

MaxAge

Aucune différence avec LOCAL.

---

# Déconnexion

Logout Google

↓

révocation de la session Chaweer uniquement.

Le compte Google reste connecté chez Google.

Cette User Story ne gère pas la déconnexion du compte Google.

---

# Sécurité

Le backend ne fait jamais confiance aux informations envoyées par le navigateur.

Le backend valide systématiquement :

- signature du token Google
- issuer
- audience
- expiration
- email_verified

Avant toute création de session.

---

# Protection contre les doublons

Le système interdit :

deux comptes Chaweer utilisant le même email.

Le système interdit également :

deux ExternalIdentity

ayant le même :

provider

+

providerUserId

---

# Gestion des erreurs

Créer des erreurs métier dédiées.

Exemples :

Google Authentication Failed

Invalid Google Token

Google Account Already Linked

Provider Mismatch

Invalid Google Identity

Les messages retournés au client ne doivent jamais révéler d'informations sensibles.

---

# Réutilisation de l'existant

US-007 doit réutiliser :

Password Service

JWT Service

Refresh Token Service

Cookie Service

Error Handler

Rate Limiter

Validation Middleware

Prisma Client

Aucune duplication de logique n'est autorisée.

Les composants existants doivent être étendus lorsque cela est pertinent.

---

# Hors périmètre technique

Cette User Story ne doit pas implémenter :

Apple Authentication

LinkedIn Authentication

Téléphone OTP

Association de plusieurs fournisseurs à un même compte

Changement de fournisseur

Fusion de comptes

Suppression du compte Google

Révocation des permissions Google

Badge de vérification des professionnels

Workflow de validation des professionnels

---
