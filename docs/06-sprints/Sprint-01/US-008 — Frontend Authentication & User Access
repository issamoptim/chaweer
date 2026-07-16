# US-008 — Frontend Authentication & User Access

## Epic

**EP-001 — Identity & Authentication**

---

# User Story

**En tant que** visiteur de Chaweer,

**je souhaite** pouvoir créer un compte, me connecter et accéder facilement à mon espace personnel en utilisant soit mon adresse e-mail, soit mon compte Google,

**afin de** bénéficier d'une expérience d'authentification moderne, simple, fluide et sécurisée me permettant d'accéder immédiatement aux services proposés par Chaweer.

---

# Business Value

Cette User Story constitue la fondation de toute l'expérience d'authentification du Frontend.

Elle fournit l'ensemble des interfaces, composants, services et mécanismes permettant à un utilisateur de :

- créer un compte ;
- se connecter ;
- restaurer automatiquement sa session ;
- accéder aux fonctionnalités nécessitant une authentification ;
- se déconnecter de manière sécurisée.

Cette User Story établit également les conventions d'architecture qui seront réutilisées par l'ensemble des développements futurs du Frontend.

---

# Contexte

Le Backend dispose désormais de l'ensemble des services nécessaires à l'authentification.

Les fonctionnalités suivantes sont déjà disponibles :

- US-006 — Local Authentication
- US-007 — Google Authentication
- US-007.1 — Current User Endpoint (/auth/me)

US-008 exploite exclusivement ces services afin de construire le socle Frontend de l'authentification.

Aucune logique métier n'est implémentée côté Frontend.

Toutes les décisions de sécurité restent prises par le Backend.

---

# Objectif

Mettre en place une architecture Frontend moderne permettant :

- l'authentification Email ;
- l'authentification Google ;
- la gestion des sessions ;
- la restauration automatique de session ;
- la récupération de l'utilisateur connecté ;
- la protection des routes privées ;
- la séparation des parcours Grand Public et Professionnel.

Cette User Story constitue le point d'entrée de tous les utilisateurs authentifiés de Chaweer.

---

# Dépendances

Cette User Story dépend des User Stories suivantes :

- US-006 — Local Authentication
- US-007 — Google Authentication
- US-007.1 — Current User Endpoint

Aucune fonctionnalité décrite dans cette User Story ne doit être implémentée en contournant ces services Backend.

---

# Périmètre

US-008 couvre :

- Pages de connexion.
- Pages d'inscription.
- Authentification Email.
- Authentification Google (Google Identity Services).
- Intégration avec les endpoints Backend.
- Gestion de l'Access Token.
- Gestion de la session utilisateur.
- Restauration automatique de session.
- AuthProvider.
- AuthGuard.
- GuestGuard.
- Déconnexion.
- Gestion de l'utilisateur connecté.
- Gestion des erreurs d'authentification.
- Protection des routes privées.
- Responsive Design.
- Accessibilité des écrans d'authentification.
- Séparation des parcours Grand Public et Professionnel.

---

# Hors périmètre

Cette User Story ne couvre pas :

- Vérification Email.
- Mot de passe oublié.
- Réinitialisation du mot de passe.
- Changement de mot de passe.
- Gestion du profil utilisateur.
- Modification des informations personnelles.
- Onboarding Professionnel.
- Vérification documentaire.
- Gestion des abonnements.
- Gestion des assistants.
- Administration.
- Authentification Apple.
- Authentification LinkedIn.
- Authentification Microsoft.
- Multi-rôles utilisateur.

Ces fonctionnalités feront l'objet de User Stories dédiées.

---

# Principes d'architecture

US-008 applique les principes suivants :

- Le Backend est la seule source de vérité concernant l'identité de l'utilisateur.
- Le Frontend ne prend jamais de décision métier.
- Le Frontend ne valide jamais un JWT.
- Le Refresh Token reste exclusivement stocké dans un cookie HttpOnly.
- L'Access Token est conservé uniquement en mémoire.
- L'utilisateur connecté est récupéré exclusivement via :

```
GET /auth/me
```

- La restauration automatique de session suit obligatoirement le flux :

```
POST /auth/refresh

↓

GET /auth/me

↓

Initialisation AuthProvider
```

- Aucune information d'authentification ne doit être stockée dans :

  - localStorage
  - sessionStorage

- Toute communication avec les services d'authentification passe exclusivement par les services Frontend dédiés.

---

# Vision UX

L'authentification doit être :

- simple ;
- rapide ;
- intuitive ;
- cohérente ;
- rassurante.

Le visiteur ne doit jamais être confronté à une complexité technique.

Les parcours Grand Public et Professionnel sont volontairement séparés afin d'offrir une expérience claire à chaque catégorie d'utilisateur.

Les appels à l'action destinés au Grand Public restent toujours prioritaires.

Le parcours Professionnel est accessible via un accès secondaire clairement identifié.
# Parcours utilisateur

## Parcours 1 — Connexion Grand Public

Depuis le Header, le visiteur clique sur :

```
Connexion
```

La page de connexion affiche immédiatement :

```
Continuer avec Google

──────────── ou ────────────

Adresse e-mail

Mot de passe

Se connecter

Mot de passe oublié ?

Créer un compte
```

En bas de la page, un accès secondaire est proposé :

```
Vous êtes avocat ?

Accéder à l'espace avocat
```

Cet accès est visuellement distinct et ne concurrence jamais les appels à l'action principaux.

---

## Parcours 2 — Inscription Grand Public

Depuis le Header :

```
Créer un compte
```

La page affiche immédiatement :

```
Continuer avec Google

──────────── ou ────────────

Continuer avec votre adresse e-mail
```

Le formulaire d'inscription n'est pas affiché immédiatement.

Il apparaît uniquement si l'utilisateur choisit l'inscription par Email.

En bas de la page est affiché :

```
Vous êtes avocat ?

Rejoindre Chaweer en tant qu'avocat
```

---

## Parcours 3 — Inscription Google

L'utilisateur clique :

```
Continuer avec Google
```

Le Frontend déclenche Google Identity Services (GIS).

Google renvoie un Authorization Code.

Le Frontend transmet ce code au Backend :

```
POST /auth/google/client
```

Le Backend :

- valide l'identité Google ;
- crée le compte si nécessaire ;
- crée la session ;
- émet un Access Token ;
- positionne le Refresh Token.

Le Frontend reçoit l'Access Token.

Le Frontend appelle immédiatement :

```
GET /auth/me
```

L'utilisateur connecté est chargé dans l'AuthProvider.

L'utilisateur est automatiquement redirigé vers l'accueil Grand Public.

Aucune saisie utilisateur n'est demandée.

---

## Parcours 4 — Inscription Email

Après avoir choisi :

```
Continuer avec votre adresse e-mail
```

Le formulaire apparaît.

Il contient :

- Prénom
- Nom
- Adresse e-mail
- Mot de passe
- Confirmation du mot de passe

Après validation :

```
POST /auth/register
```

Le Backend applique les règles définies dans US-006.

Le Frontend initialise ensuite la session utilisateur.

---

## Parcours 5 — Connexion Google

Le Frontend déclenche Google Identity Services.

Après authentification :

```
POST /auth/google/client

↓

Access Token

↓

GET /auth/me

↓

AuthProvider

↓

Accueil Grand Public
```

La connexion est entièrement transparente pour l'utilisateur.

---

## Parcours 6 — Connexion Email

Le Frontend appelle :

```
POST /auth/login
```

Après authentification :

```
Access Token

↓

GET /auth/me

↓

AuthProvider

↓

Accueil Grand Public
```

---

## Parcours 7 — Connexion Professionnelle

Depuis les pages publiques, le visiteur clique sur :

```
Je suis avocat
```

ou

```
Accéder à l'espace avocat
```

Il est redirigé vers le parcours professionnel.

Ce parcours est indépendant du parcours Grand Public.

Il utilise les endpoints professionnels prévus par le Backend.

Les règles fonctionnelles détaillées de ce parcours feront l'objet d'une User Story dédiée.

---

## Parcours 8 — Déconnexion

Depuis son espace, l'utilisateur clique :

```
Déconnexion
```

Le Frontend appelle :

```
POST /auth/logout
```

Puis :

- supprime l'Access Token en mémoire ;
- vide l'AuthProvider ;
- invalide le cache utilisateur ;
- redirige automatiquement vers l'accueil public.

---

## Parcours 9 — Restauration automatique de session

Au démarrage de l'application :

```
Application

↓

POST /auth/refresh

↓

Nouvel Access Token

↓

GET /auth/me

↓

Chargement de l'utilisateur

↓

Initialisation AuthProvider

↓

Application prête
```

Si le Refresh Token est valide :

- l'utilisateur retrouve immédiatement sa session.

Si le Refresh Token est invalide :

- aucun message d'erreur n'est affiché ;
- l'utilisateur reste simplement anonyme.

---

## Parcours 10 — Session expirée

Si une requête API retourne :

```
401 Unauthorized
```

Le Frontend tente automatiquement :

```
POST /auth/refresh
```

Si le renouvellement réussit :

- la requête initiale est rejouée automatiquement.

Si le renouvellement échoue :

- l'AuthProvider est réinitialisé ;
- l'utilisateur est redirigé vers :

```
/connexion
```

---

## Parcours 11 — Accès à une route protégée

Si un visiteur tente d'accéder à une page privée :

```
/mon-compte
```

sans être authentifié :

- AuthGuard bloque la navigation ;
- le visiteur est redirigé vers :

```
/connexion
```

Après authentification réussie, il est automatiquement renvoyé vers la page qu'il souhaitait consulter.

---

## Parcours 12 — Utilisateur déjà authentifié

Si un utilisateur déjà connecté tente d'accéder à :

```
/connexion
```

ou

```
/inscription
```

GuestGuard détecte la session active.

L'utilisateur est automatiquement redirigé vers son espace sans revoir les écrans d'authentification.
# Règles métier

## RM-001 — Le Backend est la source de vérité

Le Backend est l'unique source de vérité concernant :

- l'identité de l'utilisateur ;
- son authentification ;
- son autorisation ;
- son rôle ;
- son état de session.

Le Frontend ne prend jamais de décision métier.

---

## RM-002 — Deux méthodes d'authentification

Chaweer supporte deux méthodes d'authentification :

- Authentification locale (Email / Mot de passe)
- Authentification Google (Google Identity Services)

Les deux parcours doivent offrir une expérience utilisateur cohérente.

---

## RM-003 — Séparation des parcours

Chaweer distingue deux parcours indépendants :

- Grand Public
- Professionnel

Le parcours Grand Public est systématiquement mis en avant.

Le parcours Professionnel est accessible via un lien secondaire.

Aucune sélection "Client / Professionnel" n'est demandée pendant l'authentification.

---

## RM-004 — Parcours Grand Public

Les pages publiques utilisent exclusivement :

```
POST /auth/login

POST /auth/register

POST /auth/google/client
```

---

## RM-005 — Parcours Professionnel

Le parcours Professionnel utilise exclusivement les endpoints professionnels.

Il fera l'objet d'une User Story dédiée.

US-008 ne couvre pas son implémentation détaillée.

---

## RM-006 — AuthProvider unique

L'application possède un unique AuthProvider.

Il est responsable de :

- conserver l'utilisateur courant ;
- conserver l'Access Token ;
- restaurer la session ;
- exposer l'état d'authentification ;
- gérer login ;
- gérer logout ;
- gérer refresh.

Aucun autre composant ne doit gérer ces responsabilités.

---

## RM-007 — Source unique de l'utilisateur connecté

Le Frontend n'utilise jamais les données utilisateur provenant :

- du JWT ;
- de Google ;
- du Local Storage.

L'utilisateur connecté est obtenu exclusivement via :

```
GET /auth/me
```

---

## RM-008 — Gestion de l'Access Token

L'Access Token :

- est conservé uniquement en mémoire ;
- disparaît à la fermeture de l'onglet ;
- n'est jamais stocké dans le navigateur.

Il est interdit d'utiliser :

- localStorage
- sessionStorage
- IndexedDB

pour conserver un Access Token.

---

## RM-009 — Gestion du Refresh Token

Le Refresh Token :

- reste exclusivement dans un cookie HttpOnly ;
- n'est jamais accessible au JavaScript ;
- n'est jamais manipulé par le Frontend.

---

## RM-010 — Restauration automatique

Au démarrage de l'application, le Frontend exécute obligatoirement :

```
POST /auth/refresh

↓

GET /auth/me
```

Si les deux appels réussissent :

- AuthProvider passe à l'état "authenticated".

Sinon :

- AuthProvider passe à l'état "anonymous".

---

## RM-011 — États d'authentification

L'AuthProvider possède uniquement quatre états :

```
loading

authenticated

anonymous

error
```

Tous les composants utilisent exclusivement ces états.

---

## RM-012 — AuthGuard

Les routes privées sont protégées par AuthGuard.

Si l'utilisateur n'est pas authentifié :

```
↓

/connexion
```

---

## RM-013 — GuestGuard

Les routes publiques d'authentification utilisent GuestGuard.

Si l'utilisateur possède déjà une session valide :

```
↓

Accueil Grand Public
```

ou

```
↓

Espace Professionnel
```

L'utilisateur ne peut pas accéder aux pages :

- /connexion
- /inscription

tant qu'il est authentifié.

---

## RM-014 — Redirection après connexion

Après authentification réussie :

Le Frontend redirige automatiquement l'utilisateur vers :

- la page initialement demandée ;

ou, à défaut,

- l'accueil correspondant à son parcours.

Aucun écran intermédiaire n'est affiché.

---

## RM-015 — Gestion des erreurs

Le Frontend traduit les erreurs techniques en messages compréhensibles.

Exemples :

- Adresse e-mail ou mot de passe incorrect.
- Cette adresse e-mail est déjà utilisée.
- Ce compte est associé à une autre méthode de connexion.
- Votre session a expiré.
- Connexion Google annulée.
- Impossible de contacter le serveur.

Les messages d'erreur du Backend ne sont jamais affichés tels quels.

---

## RM-016 — États de chargement

Pendant toute opération d'authentification :

- les boutons sont désactivés ;
- un indicateur de chargement est affiché ;
- aucune double soumission n'est possible.

---

## RM-017 — Protection contre les doubles soumissions

Un utilisateur ne peut jamais lancer deux authentifications simultanément.

Les boutons :

- Connexion
- Créer un compte
- Continuer avec Google

deviennent temporairement inactifs.

---

## RM-018 — Conservation de la navigation

Si un utilisateur est redirigé vers :

```
/connexion
```

suite à une tentative d'accès à une page privée,

la page initialement demandée est mémorisée.

Après authentification réussie, il est automatiquement redirigé vers cette page.

---

## RM-019 — Déconnexion

La déconnexion :

- appelle :

```
POST /auth/logout
```

- supprime l'Access Token ;
- vide l'AuthProvider ;
- invalide le cache utilisateur ;
- redirige vers l'accueil public.

---

## RM-020 — Évolutivité

L'architecture doit permettre l'ajout futur de nouveaux fournisseurs d'identité :

- Apple
- LinkedIn
- Microsoft

sans modifier les composants existants.

---

## RM-021 — Cohérence UX

Quelle que soit la méthode d'authentification utilisée :

- Email
- Google

l'expérience utilisateur doit rester identique.

Les différences techniques ne doivent jamais être visibles par l'utilisateur.

---

## RM-022 — Réutilisabilité

Tous les composants d'authentification doivent être conçus pour être réutilisables.

Aucune logique métier ne doit être dupliquée entre :

- Connexion
- Inscription
- Google
- Professionnel

La mutualisation du code est obligatoire.
# Architecture Frontend

## Architecture générale

US-008 introduit une architecture modulaire dédiée à l'authentification.

Toutes les fonctionnalités d'authentification sont regroupées dans un module unique.

Aucun composant extérieur ne communique directement avec les endpoints d'authentification.

---

# Structure du projet

```
src/

├── app/
│
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── guards/
│       ├── hooks/
│       ├── pages/
│       ├── providers/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── layouts/
│
├── pages/
│
└── shared/
```

---

# AuthProvider

US-008 introduit un AuthProvider unique.

Il est responsable de :

- restaurer automatiquement la session ;
- conserver l'utilisateur courant ;
- conserver l'Access Token en mémoire ;
- exposer l'état d'authentification ;
- fournir les opérations login, logout et refresh ;
- centraliser les appels à `/auth/me`.

L'AuthProvider est monté une seule fois à la racine de l'application.

---

# AuthContext

L'AuthProvider expose un contexte React.

Les composants peuvent accéder à :

```
user

accessToken

isAuthenticated

isLoading

login()

loginWithGoogle()

logout()

refresh()

refetchUser()
```

Aucun composant ne manipule directement les appels HTTP.

---

# AuthService

Toute communication avec le Backend passe par AuthService.

Il encapsule :

```
POST /auth/login

POST /auth/register

POST /auth/google/client

POST /auth/logout

POST /auth/refresh

GET /auth/me
```

Aucun composant React n'appelle directement ces endpoints.

---

# GoogleAuthService

Les appels à Google Identity Services sont isolés dans un service dédié.

Responsabilités :

- initialisation de Google GIS ;
- récupération de l'Authorization Code ;
- transmission au Backend ;
- gestion des erreurs Google.

Toute la logique Google est isolée du reste de l'application.

---

# AuthGuard

Les pages privées utilisent AuthGuard.

Responsabilités :

- vérifier si l'utilisateur est authentifié ;
- attendre la fin de la restauration automatique de session ;
- rediriger vers `/connexion` si nécessaire.

---

# GuestGuard

Les pages publiques utilisent GuestGuard.

Responsabilités :

- empêcher un utilisateur connecté d'accéder aux pages :
  - /connexion
  - /inscription

Dans ce cas :

redirection automatique vers l'accueil correspondant.

---

# Hooks

US-008 introduit des hooks spécialisés.

Exemples :

```
useAuth()

useLogin()

useRegister()

useGoogleLogin()

useLogout()

useCurrentUser()
```

Les composants utilisent exclusivement ces hooks.

---

# Gestion des requêtes

Les appels réseau sont centralisés.

Le Frontend utilise React Query pour :

- récupération de l'utilisateur connecté ;
- invalidation du cache ;
- rechargement après connexion ;
- rechargement après déconnexion.

Aucun composant ne gère manuellement son cache.

---

# Gestion de la session

Flux officiel :

```
Application démarre

↓

POST /auth/refresh

↓

Access Token

↓

GET /auth/me

↓

AuthProvider

↓

Application prête
```

---

# Gestion des erreurs

Les erreurs sont normalisées.

Le Frontend traduit les codes Backend en messages utilisateur.

Exemple :

```
INVALID_CREDENTIALS

↓

Adresse e-mail ou mot de passe incorrect.
```

```
PROVIDER_MISMATCH

↓

Ce compte utilise une autre méthode de connexion.
```

```
GOOGLE_AUTH_FAILED

↓

Impossible de se connecter avec Google.
```

---

# États des écrans

Chaque écran possède les états suivants :

```
Idle

Loading

Success

Error
```

Pendant Loading :

- boutons désactivés ;
- spinner affiché ;
- aucune double soumission.

---

# Responsive Design

Les écrans doivent fonctionner sur :

- Desktop
- Tablette
- Mobile

Les composants sont responsives dès leur conception.

---

# Accessibilité

Les écrans d'authentification doivent respecter :

- navigation clavier ;
- ordre logique du focus ;
- labels accessibles ;
- contraste suffisant ;
- messages d'erreur accessibles.

---

# Réutilisabilité

Tous les composants sont conçus pour être réutilisables.

Exemples :

- AuthLayout
- AuthCard
- AuthHeader
- AuthFooter
- GoogleButton
- LoginForm
- RegisterForm
- PasswordField
- EmailField

Aucune duplication de code n'est autorisée.

---

# Bibliothèques

US-008 s'appuie sur :

- React
- React Router
- TanStack Query
- React Hook Form
- Zod
- Google Identity Services

Toute nouvelle dépendance devra être justifiée.

---

# Prérequis Backend

US-008 dépend des endpoints suivants :

```
POST /auth/register

POST /auth/login

POST /auth/google/client

POST /auth/logout

POST /auth/refresh

GET /auth/me
```

Aucun autre endpoint n'est requis pour cette User Story.

---

# Contraintes

Le Frontend :

- ne décode jamais le JWT pour obtenir l'utilisateur ;
- ne stocke jamais le Refresh Token ;
- ne stocke jamais l'Access Token dans localStorage ou sessionStorage ;
- ne décide jamais des rôles ;
- ne reproduit jamais les validations métier du Backend.

Toutes les décisions métier restent centralisées côté Backend.
# Critères d'acceptation

## AC-001 — Connexion Email

Étant donné qu'un utilisateur possède un compte local valide,

Lorsqu'il saisit correctement son adresse e-mail et son mot de passe,

Alors :

- il est authentifié ;
- la session est créée ;
- l'utilisateur est chargé via `GET /auth/me` ;
- il est redirigé automatiquement vers l'accueil Grand Public.

---

## AC-002 — Connexion Google

Étant donné qu'un utilisateur possède un compte Google valide,

Lorsqu'il clique sur :

```
Continuer avec Google
```

Alors :

- Google Identity Services est lancé ;
- le Backend authentifie l'utilisateur ;
- l'utilisateur est chargé via `GET /auth/me` ;
- il est redirigé automatiquement.

---

## AC-003 — Inscription Email

Lorsqu'un visiteur complète correctement le formulaire d'inscription,

Alors :

- le compte est créé ;
- la session est ouverte ;
- le profil utilisateur est récupéré ;
- l'utilisateur est redirigé.

---

## AC-004 — Inscription Google

Lorsqu'un visiteur choisit Google,

Alors :

- aucune information personnelle n'est demandée ;
- le compte est créé automatiquement si nécessaire ;
- la session est ouverte ;
- l'utilisateur est redirigé.

---

## AC-005 — Déconnexion

Lorsqu'un utilisateur clique sur :

```
Déconnexion
```

Alors :

- `/auth/logout` est appelé ;
- l'Access Token est supprimé de la mémoire ;
- l'AuthProvider est réinitialisé ;
- le cache utilisateur est vidé ;
- l'utilisateur est redirigé vers l'accueil public.

---

## AC-006 — Restauration automatique

Au démarrage de l'application :

Le Frontend exécute automatiquement :

```
POST /auth/refresh

↓

GET /auth/me
```

Si les deux appels réussissent :

- la session est restaurée.

Sinon :

- l'utilisateur reste anonyme.

---

## AC-007 — Utilisateur courant

Toutes les informations de l'utilisateur connecté proviennent exclusivement de :

```
GET /auth/me
```

Aucune autre source n'est utilisée.

---

## AC-008 — Routes privées

Toute tentative d'accès à une route protégée sans session valide entraîne une redirection vers :

```
/connexion
```

---

## AC-009 — Routes publiques

Un utilisateur déjà authentifié ne peut pas accéder à :

- /connexion
- /inscription

Il est automatiquement redirigé vers son espace.

---

## AC-010 — Séparation des parcours

Les interfaces publiques distinguent clairement :

- le parcours Grand Public ;
- le parcours Professionnel.

Les actions principales restent destinées au Grand Public.

Le parcours Professionnel est accessible via un lien secondaire.

---

## AC-011 — Gestion des erreurs

Les erreurs du Backend sont traduites en messages utilisateur compréhensibles.

Aucune erreur technique interne n'est affichée.

---

## AC-012 — Sécurité

Le Frontend :

- ne stocke jamais le Refresh Token ;
- ne stocke jamais l'Access Token dans localStorage ;
- ne stocke jamais l'Access Token dans sessionStorage ;
- ne décode jamais le JWT pour construire l'utilisateur.

---

## AC-013 — Responsive

Les écrans fonctionnent correctement sur :

- Desktop ;
- Tablette ;
- Mobile.

---

## AC-014 — Accessibilité

Les formulaires sont entièrement utilisables :

- au clavier ;
- avec un lecteur d'écran ;
- avec un ordre de focus cohérent.

---

# Tests attendus

Les tests doivent couvrir au minimum :

## Tests unitaires

- AuthProvider
- AuthService
- GoogleAuthService
- AuthGuard
- GuestGuard
- Hooks d'authentification

---

## Tests d'intégration

- Connexion Email
- Connexion Google
- Inscription Email
- Inscription Google
- Déconnexion
- Restauration automatique de session
- Redirection après connexion
- Redirection des routes protégées
- Redirection des routes publiques
- Gestion des erreurs Backend

---

## Tests E2E

Les parcours suivants doivent être validés :

- Première inscription Email
- Première inscription Google
- Connexion Email
- Connexion Google
- Déconnexion
- Recharge de la page avec session valide
- Recharge avec session expirée
- Accès à une route privée
- Accès à une route publique en étant connecté

---

# Définition de Terminé (Definition of Done)

La User Story est considérée comme terminée lorsque :

- toutes les pages d'authentification sont développées ;
- l'architecture Frontend est conforme à cette spécification ;
- AuthProvider est opérationnel ;
- AuthGuard est opérationnel ;
- GuestGuard est opérationnel ;
- Google Identity Services est intégré ;
- tous les endpoints Backend sont utilisés conformément à US-006, US-007 et US-007.1 ;
- aucun Access Token n'est persisté dans le navigateur ;
- toutes les routes protégées fonctionnent ;
- les tests passent avec succès ;
- aucune régression n'est introduite.

---

# Contraintes

Cette User Story ne doit entraîner :

- aucune modification de l'architecture Backend ;
- aucune modification des endpoints existants ;
- aucune modification des contrats API ;
- aucune duplication de logique métier.

---

# Statut

**Sprint :** Sprint 01

**Priorité :** Haute

**Dépendances :**

- US-006 — Local Authentication
- US-007 — Google Authentication
- US-007.1 — Current User Endpoint

**État :**

☐ À faire

☐ En cours

☒ Prête pour le plan d'implémentation

☐ Terminée