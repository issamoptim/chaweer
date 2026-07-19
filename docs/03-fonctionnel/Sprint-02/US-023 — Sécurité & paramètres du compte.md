# US-023 — Sécurité du compte

## 1. Objectif

Permettre à un utilisateur authentifié de consulter les informations de sécurité de son compte et d'effectuer les actions autorisées selon son mode d'authentification.

Cette User Story vise à garantir la sécurité du compte tout en offrant à l'utilisateur les fonctionnalités essentielles de gestion de son authentification.

---

# 2. Contexte

Après avoir complété la gestion de son profil (US-022), l'utilisateur doit pouvoir accéder à une page dédiée à la sécurité de son compte.

Cette page regroupe exclusivement les fonctionnalités liées à l'authentification et à la protection du compte.

Les informations personnelles (nom, prénom, téléphone, pays, ville, nationalité, préférences, etc.) restent gérées par l'US-022.

---

# 3. Objectifs métier

Cette User Story permet à l'utilisateur de :

- consulter les informations de sécurité de son compte ;
- connaître son mode d'authentification ;
- modifier son mot de passe lorsque cela est autorisé ;
- comprendre lorsque son mot de passe est géré par un fournisseur externe ;
- supprimer son compte après confirmation explicite.

---

# 4. Parcours utilisateur

Depuis **Mon compte**, l'utilisateur accède à la rubrique **Sécurité**.

Cette page lui permet :

- de consulter les informations de sécurité ;
- de modifier son mot de passe si son compte utilise l'authentification Email + Mot de passe ;
- de comprendre que son mot de passe est géré par Google lorsqu'il utilise ce fournisseur ;
- d'initier la suppression de son compte.

---

# 5. Périmètre

## Inclus

- Consultation des informations de sécurité.
- Affichage du fournisseur d'authentification.
- Affichage de l'adresse e-mail.
- Changement du mot de passe (Email + Mot de passe uniquement).
- Suppression du compte.
- Confirmation de suppression.
- Gestion des états de chargement, succès et erreur.

## Hors périmètre

Cette User Story ne couvre pas :

- modification de l'adresse e-mail ;
- modification du numéro de téléphone ;
- changement du fournisseur d'authentification ;
- liaison ou suppression d'un compte Google ;
- authentification multifacteur (2FA) ;
- gestion des appareils connectés ;
- historique des connexions ;
- gestion des sessions ;
- passkeys ;
- OTP SMS ;
- OTP Email.

Les conséquences métier liées à la suppression du compte seront définies ultérieurement dans les User Stories relatives :

- aux consultations ;
- aux rendez-vous ;
- aux réservations ;
- aux paiements ;
- aux obligations réglementaires.

---

# 6. Structure de la page

La page **Sécurité** est organisée en trois sections.

## 6.1 Informations du compte

Cette section affiche :

- le fournisseur d'authentification ;
- l'adresse e-mail.

Ces informations sont consultables uniquement.

---

## 6.2 Mot de passe

### Compte Email + Mot de passe

La section permet :

- la saisie du mot de passe actuel ;
- la saisie d'un nouveau mot de passe ;
- la confirmation du nouveau mot de passe.

### Compte Google

Le formulaire de changement de mot de passe n'est pas affiché.

Un message informe l'utilisateur que son authentification est gérée par Google.

---

## 6.3 Zone de danger

Cette section permet d'initier la suppression du compte.

La suppression nécessite une confirmation explicite avant exécution.

Cette section est volontairement isolée visuellement afin de signaler son caractère sensible.

---

# 7. Acteurs

## Utilisateur authentifié

Peut consulter les informations de sécurité de son compte et effectuer les actions autorisées.

---

# 8. Cas d'utilisation

## UC-01 — Consulter les paramètres de sécurité

L'utilisateur consulte les informations de sécurité de son compte.

---

## UC-02 — Modifier son mot de passe

Disponible uniquement pour les comptes utilisant l'authentification Email + Mot de passe.

---

## UC-03 — Consulter les informations d'un compte Google

L'utilisateur visualise que son authentification est gérée par Google.

Aucune modification du mot de passe n'est proposée.

---

## UC-04 — Demander la suppression du compte

L'utilisateur initie la suppression de son compte.

Une confirmation explicite est demandée avant toute exécution.

---

# 9. Règles métier

## RM-01

Le fournisseur d'authentification est défini lors de la création du compte.

Il ne peut jamais être modifié par l'utilisateur.

---

## RM-02

L'adresse e-mail constitue l'identifiant principal du compte.

Elle est affichée en lecture seule.

---

## RM-03

Le changement de mot de passe est disponible uniquement pour les comptes utilisant l'authentification Email + Mot de passe.

---

## RM-04

Les comptes authentifiés via Google ne disposent pas d'un mot de passe Chaweer.

La gestion du mot de passe est assurée par Google.

---

## RM-05

Le changement de mot de passe nécessite :

- le mot de passe actuel ;
- un nouveau mot de passe ;
- une confirmation du nouveau mot de passe.

---

## RM-06

Le nouveau mot de passe doit respecter la politique de sécurité définie par Chaweer.

---

## RM-07

La confirmation du mot de passe doit être identique au nouveau mot de passe.

---

## RM-08

Une confirmation explicite est obligatoire avant toute suppression du compte.

---

## RM-09

La suppression du compte est considérée comme une opération sensible.

Elle nécessite une validation volontaire de l'utilisateur.

---

## RM-10

Cette User Story ne définit pas les règles métier pouvant empêcher la suppression d'un compte.

Ces règles seront précisées dans les User Stories dédiées :

- aux consultations ;
- aux rendez-vous ;
- aux réservations ;
- aux paiements ;
- aux obligations réglementaires.

---

# 10. États

La page doit gérer les états suivants :

- chargement des informations ;
- données disponibles ;
- modification du mot de passe en cours ;
- succès ;
- erreur ;
- suppression en cours.

---

# 11. Préconditions

- utilisateur authentifié ;
- compte actif.

---

# 12. Postconditions

Après exécution :

- les informations de sécurité restent cohérentes avec le mode d'authentification ;
- le mot de passe est mis à jour lorsque l'opération est autorisée ;
- la suppression est exécutée selon les règles métier applicables.

---

# 13. Critères d'acceptation

## Consultation

- Les informations de sécurité sont affichées.
- Le fournisseur d'authentification est visible.
- L'adresse e-mail est visible.

---

## Compte Email + Mot de passe

- Le formulaire de changement de mot de passe est affiché.
- Le changement de mot de passe est possible après validation.

---

## Compte Google

- Le formulaire de changement de mot de passe n'est pas affiché.
- Un message indique que le mot de passe est géré par Google.

---

## Adresse e-mail

- L'adresse e-mail est affichée.
- Elle ne peut jamais être modifiée depuis cette page.

---

## Suppression du compte

- Une confirmation est obligatoire.
- L'utilisateur est informé du caractère irréversible de l'opération.
- Aucune suppression n'est effectuée sans confirmation explicite.

---

# 14. Dépendances

- US-008 — Authentification
- US-021 — Vue d'ensemble du profil
- US-022 — Gestion du profil utilisateur

---

# 15. Évolutions futures

Les User Stories suivantes pourront enrichir cette fonctionnalité :

- vérification de l'adresse e-mail ;
- authentification multifacteur (2FA) ;
- gestion des appareils connectés ;
- historique des connexions ;
- gestion des sessions ;
- passkeys ;
- changement d'adresse e-mail ;
- liaison de plusieurs fournisseurs d'authentification ;
- règles métier de suppression liées aux consultations, rendez-vous, réservations et paiements.