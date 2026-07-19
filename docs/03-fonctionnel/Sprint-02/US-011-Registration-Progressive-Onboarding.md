---
title: US-011 — Registration & Progressive Onboarding
id: US-011
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-010 Identity & Profile Domain
next:
  - US-012 Identity & Profile Domain Model
---

# US-011 — Registration & Progressive Onboarding

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story décrit le parcours complet de création d'un compte ainsi que le principe de Progressive Onboarding adopté par Chaweer.

Elle définit les règles métier permettant de créer un compte, de compléter progressivement un profil personnel puis, le cas échéant, de devenir professionnel.

Elle ne décrit ni l'interface utilisateur, ni les API, ni les aspects techniques d'implémentation.

---

# 2. Vision

Chaweer adopte un modèle d'inscription simple.

L'utilisateur ne doit jamais être bloqué par un formulaire long.

Seules les informations strictement nécessaires sont demandées au moment où elles deviennent utiles.

Le passage d'un Client à un Professionnel est un processus naturel qui ne nécessite pas la création d'un nouveau compte.

---

# 3. Principes Produit

Le parcours repose sur les principes suivants :

- Zero Friction Onboarding ;
- Progressive Onboarding ;
- Progressive Profile Completion ;
- Privacy by Default ;
- Graceful Degradation ;
- Profile Sovereignty ;
- Marketplace First.

---

# 4. Modes d'inscription

En V1, un compte peut être créé via :

- Email ;
- Phone Number ;
- Google.

Quel que soit le mode choisi, le résultat est identique :

- création d'un Account ;
- création automatique d'un Profile ;
- attribution du rôle Client.

---

# 5. Parcours général

Le parcours utilisateur suit les étapes suivantes :

```
Visiteur

↓

Choix du mode d'inscription

↓

Création du compte

↓

Création automatique du Profile

↓

Compte actif

↓

Complétion progressive du Profile

↓

Utilisation de Chaweer

↓

(Option)

Devenir Professionnel

↓

Création d'un ProfessionalProfile Draft

↓

Complétion progressive

↓

Publication automatique
```

---

# 6. Progressive Onboarding

Le principe de Progressive Onboarding consiste à demander uniquement les informations nécessaires à chaque étape.

L'utilisateur peut commencer à utiliser la plateforme immédiatement après la création de son compte.

Les informations complémentaires sont demandées uniquement lorsqu'elles deviennent nécessaires.

---

# 7. Progressive Profile Completion

Le Profile évolue progressivement.

Exemples :

- nom ;
- prénom ;
- photo ;
- langue ;
- préférences.

Aucune information non indispensable ne bloque l'utilisation de la plateforme.

---

# 8. Création du ProfessionalProfile

Un Client peut décider à tout moment de devenir Professionnel.

Cette action entraîne automatiquement :

- la création d'un ProfessionalProfile ;
- son état initial Draft.

Aucune validation humaine n'est requise.

---

# 9. Cycle de vie

## 9.1 Profile

```
NonExistent

↓

Active

↓

Suspended

↓

Banned
```

---

## 9.2 ProfessionalProfile

```
NonExistent

↓

Draft

↓

Published

↓

Hidden

↓

Incomplete

↓

Archived

↓

Banned
```

---

## 9.3 Transitions autorisées

Draft → Published

Published → Hidden

Hidden → Published

Published → Incomplete

Incomplete → Published

Published → Archived

Hidden → Archived

Incomplete → Archived

Tous les états peuvent évoluer vers Banned.

---

# 10. Publication

La publication est automatique.

Aucune intervention d'un administrateur n'est nécessaire.

Le ProfessionalProfile devient visible dès que tous les critères métier sont satisfaits.

La certification constitue un processus indépendant.

---

# 11. Critères de publication

Le profil professionnel peut être publié lorsque les informations obligatoires sont renseignées.

Ces critères sont évalués automatiquement.

Toute modification entraînant la perte d'un critère provoque le passage automatique à l'état Incomplete.

---

# 12. Confidentialité

Le Profile est privé.

Le ProfessionalProfile est public.

Aucune donnée privée ne peut être exposée automatiquement.

Les informations personnelles restent accessibles uniquement à leur propriétaire ainsi qu'aux administrateurs autorisés.

---

# 13. Gestion des informations manquantes

L'absence d'une information facultative ne bloque jamais l'utilisation de Chaweer.

Lorsqu'une information obligatoire manque pour une fonctionnalité donnée, elle est demandée uniquement à ce moment.

Si un prénom n'est pas renseigné, la plateforme utilise une valeur d'affichage générique jusqu'à ce que le profil soit complété.


# 14. Règles métier

RM-011-01

Tout utilisateur doit posséder exactement un Account.

---

RM-011-02

La création d'un Account entraîne automatiquement la création d'un Profile.

---

RM-011-03

Le rôle initial attribué après la création d'un compte est Client.

---

RM-011-04

Un Account peut être associé à un ou plusieurs Identity Providers.

---

RM-011-05

Un Identity Provider ne peut appartenir qu'à un seul Account.

---

RM-011-06

Un utilisateur peut devenir Professionnel sans créer un nouveau compte.

---

RM-011-07

La création d'un ProfessionalProfile est immédiate après la demande de devenir Professionnel.

---

RM-011-08

Le ProfessionalProfile est créé dans l'état Draft.

---

RM-011-09

La publication est automatique lorsque tous les critères métier sont satisfaits.

---

RM-011-10

La certification n'est jamais un prérequis à la publication.

---

RM-011-11

La perte d'un critère de publication entraîne automatiquement le passage à l'état Incomplete.

---

RM-011-12

Un ProfessionalProfile Hidden n'apparaît jamais publiquement.

---

RM-011-13

Un ProfessionalProfile Archived n'apparaît jamais publiquement.

---

RM-011-14

Un ProfessionalProfile Banned n'apparaît jamais publiquement.

---

RM-011-15

Les informations privées du Profile ne sont jamais visibles dans le ProfessionalProfile.

---

RM-011-16

Les informations obligatoires sont demandées uniquement lorsqu'elles deviennent nécessaires.

---

RM-011-17

L'absence d'une information facultative ne bloque jamais l'utilisation de la plateforme.

---

RM-011-18

La suppression d'un compte est réalisée sous forme de suppression logique.

---

# 15. Permissions métier

## Client

Peut :

- créer un compte ;
- gérer son Profile ;
- devenir Professionnel.

---

## Professionnel

Peut :

- gérer son Profile ;
- gérer son ProfessionalProfile ;
- publier automatiquement son ProfessionalProfile lorsque les critères sont satisfaits ;
- masquer son ProfessionalProfile.

---

## Assistant

Peut agir au nom d'un Professionnel selon les permissions qui lui sont déléguées.

Les règles de délégation sont définies dans un domaine dédié.

---

## Administrateur

Peut :

- suspendre un compte ;
- bannir un compte ;
- consulter les informations nécessaires à l'administration de la plateforme.

---

# 16. Scénarios métier

## SC-011-01 — Création d'un compte

Le Visiteur choisit un Identity Provider.

Le système crée un Account.

Le système crée automatiquement un Profile.

Le rôle Client est attribué.

---

## SC-011-02 — Première connexion

L'utilisateur accède immédiatement à la plateforme.

Aucune information complémentaire n'est exigée.

---

## SC-011-03 — Complétion progressive

Au fil de l'utilisation, Chaweer demande uniquement les informations nécessaires.

---

## SC-011-04 — Devenir Professionnel

Le Client choisit de devenir Professionnel.

Le système crée un ProfessionalProfile Draft.

---

## SC-011-05 — Compléter le profil professionnel

Le Professionnel renseigne progressivement les informations requises.

---

## SC-011-06 — Publication automatique

Lorsque tous les critères sont satisfaits, le ProfessionalProfile devient Published.

---

## SC-011-07 — Masquer son profil

Le Professionnel masque volontairement son ProfessionalProfile.

Le statut devient Hidden.

---

## SC-011-08 — Réafficher son profil

Le ProfessionalProfile Hidden redevient Published dès lors que le Professionnel le rend visible.

---

## SC-011-09 — Profil incomplet

Une modification entraîne la perte d'un critère obligatoire.

Le ProfessionalProfile devient automatiquement Incomplete.

---

## SC-011-10 — Republication

Une fois les informations manquantes complétées, le ProfessionalProfile redevient Published.

---

## SC-011-11 — Suspension

Un administrateur suspend un utilisateur.

Le Profile passe à l'état Suspended.

---

## SC-011-12 — Bannissement

Un administrateur bannit un utilisateur.

Le Profile et le ProfessionalProfile deviennent inaccessibles.

# 17. Domain Events

Le domaine produit les événements métier suivants :

- AccountCreated
- IdentityProviderLinked
- IdentityProviderUnlinked
- PrimaryIdentityProviderChanged
- ProfileCreated
- ProfessionalProfileCreated
- ProfessionalProfilePublished
- ProfessionalProfileHidden
- ProfessionalProfileIncomplete
- ProfessionalProfileRepublished
- ProfessionalProfileArchived
- ProfileSuspended
- ProfileReactivated
- ProfileBanned
- ProfessionalProfileBanned

---

# 18. Invariants

Les invariants suivants doivent toujours être respectés.

- Un Account possède exactement un Profile.
- Un utilisateur possède au maximum un ProfessionalProfile.
- Un Account peut être associé à un ou plusieurs Identity Providers.
- Un IdentityProvider ne peut être associé qu'à un seul Account.
- Un ProfessionalProfile Published satisfait toujours les critères de publication.
- Les informations privées ne sont jamais visibles publiquement.
- Un ProfessionalProfile Hidden n'est jamais visible.
- Un ProfessionalProfile Incomplete n'est jamais visible.
- Un ProfessionalProfile Archived n'est jamais visible.
- Un ProfessionalProfile Banned n'est jamais visible.

---

# 19. Critères d'acceptation

AC-011-01

Un visiteur peut créer un compte avec Email, Phone Number ou Google.

---

AC-011-02

La création du compte crée automatiquement un Profile.

---

AC-011-03

Le rôle Client est attribué automatiquement.

---

AC-011-04

Le compte devient immédiatement utilisable.

---

AC-011-05

Les informations personnelles sont demandées progressivement.

---

AC-011-06

Un Client peut devenir Professionnel sans recréer un compte.

---

AC-011-07

La création d'un ProfessionalProfile est immédiate.

---

AC-011-08

Le ProfessionalProfile est créé à l'état Draft.

---

AC-011-09

Le ProfessionalProfile est publié automatiquement lorsque tous les critères sont satisfaits.

---

AC-011-10

La perte d'un critère entraîne automatiquement le passage à l'état Incomplete.

---

AC-011-11

Un ProfessionalProfile Hidden n'est jamais visible publiquement.

---

AC-011-12

Un ProfessionalProfile Archived n'est jamais visible publiquement.

---

AC-011-13

Les informations privées ne sont jamais exposées dans le ProfessionalProfile.

---

AC-011-14

La suppression d'un compte est réalisée sous forme de suppression logique.

---

AC-011-15

La certification reste indépendante de la publication.

# 20. Glossaire

| Terme | Définition |
|--------|------------|
| Account | Compte utilisateur permettant d'accéder à Chaweer. |
| IdentityProvider | Mode d'identification utilisé pour créer ou authentifier un Account. |
| Profile | Ensemble des informations privées de l'utilisateur. |
| ProfessionalProfile | Profil public visible dans la marketplace. |
| Draft | Profil professionnel non publié. |
| Published | Profil professionnel visible publiquement. |
| Hidden | Profil volontairement masqué par le professionnel. |
| Incomplete | Profil ne satisfaisant plus les critères de publication. |
| Archived | Profil définitivement retiré de la publication. |
| Banned | Profil interdit d'utilisation par décision administrative. |
| Progressive Onboarding | Collecte progressive des informations utilisateur. |
| Publication | Processus rendant un ProfessionalProfile visible publiquement. |

---

# 21. Dépendances

Cette User Story dépend de :

- US-009 — Identity & Profile Vision
- US-010 — Identity & Profile Domain

Elle constitue la base de :

- US-012 — Identity & Profile Domain Model
- US-013 — Application Layer
- US-014 — Backend Architecture
- US-015 — REST API
- US-016 — Database Design
- US-017 — Frontend Architecture
- US-018 — Security
- US-019 — Testing Strategy

---

# 22. Hors périmètre

Cette User Story ne décrit pas :

- les API REST ;
- les DTO ;
- les Controllers ;
- les Services applicatifs ;
- les Aggregate Roots ;
- les Value Objects ;
- la persistance ;
- la base de données ;
- les mécanismes OAuth ;
- les protocoles OpenID Connect ;
- le MFA ;
- les permissions détaillées ;
- la certification des professionnels ;
- la gestion des cabinets ;
- la gestion documentaire ;
- les consultations ;
- les rendez-vous ;
- les paiements ;
- les notifications ;
- la messagerie ;
- les avis.

---

# 23. Décisions Produit

Les décisions suivantes sont figées pour la V1 de Chaweer :

- un utilisateur possède un seul Account ;
- un Account possède exactement un Profile ;
- un utilisateur possède au maximum un ProfessionalProfile ;
- un Account peut être associé à un ou plusieurs Identity Providers ;
- les Identity Providers supportés en V1 sont Email, Phone Number et Google ;
- le rôle initial est Client ;
- le passage Client → Professionnel ne crée jamais un nouveau compte ;
- un ProfessionalProfile est créé à l'état Draft ;
- la publication est entièrement automatique ;
- la certification est indépendante de la publication ;
- les informations sont collectées progressivement ;
- les informations privées restent toujours distinctes des informations publiques ;
- la suppression d'un compte est réalisée sous forme de Soft Delete.

---

# 24. Résultat attendu

À l'issue de cette User Story, le processus complet d'inscription et de Progressive Onboarding est entièrement défini.

Les parcours utilisateurs, les règles métier, les cycles de vie, les permissions, les événements métier, les invariants et les critères d'acceptation sont validés.

Cette User Story constitue la référence fonctionnelle utilisée pour la conception du Domain Model (US-012) et des User Stories techniques du Sprint 02.