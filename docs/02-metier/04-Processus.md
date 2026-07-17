# Chaweer — Processus Métier

> Version : 1.0
>
> Statut : Validé
>
> Auteur : Issam Majdoubi
>
> Relecture : CTO
>
> Dernière mise à jour : 15 juillet 2026

---

# 1. Objectif

Le présent document décrit les principaux processus métier de Chaweer.

Un processus métier représente une suite cohérente d'activités permettant à un acteur d'atteindre un objectif précis tout en créant de la valeur pour l'écosystème.

Il constitue la référence de l'organisation fonctionnelle de la plateforme.

Les règles de gestion détaillées sont décrites dans **05-Regles-de-Gestion.md**.

---

# 2. Principes

Les processus métier de Chaweer reposent sur plusieurs principes.

- chaque processus poursuit un objectif métier clairement identifié ;
- chaque acteur intervient selon un rôle défini ;
- les processus privilégient la simplicité et la transparence ;
- les processus sont indépendants de l'implémentation technique ;
- les processus évoluent progressivement au rythme des versions du produit.

---

# 3. Cartographie des processus métier

Les processus de Chaweer sont organisés en quatre grandes familles.

## Processus de gestion des professionnels

Ils couvrent l'ensemble du cycle de vie du professionnel au sein de la plateforme.

Ils comprennent notamment :

- inscription ;
- validation du compte ;
- gestion du profil ;
- gestion des offres ;
- gestion des disponibilités ;
- gestion des rendez-vous.

---

## Processus de gestion des demandeurs

Ils couvrent le parcours permettant à un particulier ou une entreprise d'accéder aux services proposés sur Chaweer.

Ils comprennent notamment :

- inscription ;
- gestion du profil ;
- recherche ;
- consultation des offres ;
- réservation.

---

## Processus de réalisation des prestations

Ils décrivent la manière dont une prestation est réalisée.

Version 1 :

- consultation vidéo.

Versions futures :

- demandes de prestation ;
- propositions commerciales ;
- missions ;
- livraisons.

---

## Processus support

Ces processus interviennent de manière transverse dans toute la plateforme.

Ils comprennent notamment :

- paiements ;
- notifications ;
- réputation ;
- administration.

---
# 4. Processus de gestion des professionnels

Les processus de gestion des professionnels couvrent l'ensemble du cycle de vie d'un professionnel sur Chaweer, depuis son inscription jusqu'à la gestion quotidienne de son activité.

---

## 4.1 Inscription du professionnel

### Objectif

Permettre à un professionnel de créer un compte afin de proposer ses services sur Chaweer.

### Déclencheur

Le professionnel souhaite rejoindre la plateforme.

### Acteurs concernés

- Professionnel
- Plateforme

### Déroulement

Le professionnel :

- crée son compte ;
- valide son adresse électronique ;
- complète son profil initial.

### Résultat

Un compte professionnel est créé.

Le professionnel peut poursuivre son processus d'onboarding.

---

## 4.2 Validation du compte professionnel

### Objectif

Vérifier l'identité et les informations professionnelles avant toute publication d'offres.

### Déclencheur

Le profil professionnel est complété.

### Acteurs concernés

- Professionnel
- Plateforme

### Déroulement

Le professionnel transmet les informations et justificatifs demandés.

La plateforme procède aux vérifications nécessaires.

Après validation, le compte est activé.

### Résultat

Le professionnel est autorisé à publier des offres.

---

## 4.3 Gestion du profil

### Objectif

Permettre au professionnel de maintenir ses informations à jour.

### Déclencheur

Le professionnel souhaite modifier son profil.

### Acteurs concernés

- Professionnel

### Déroulement

Le professionnel peut notamment mettre à jour :

- ses informations personnelles ;
- sa photo ;
- sa biographie ;
- ses domaines d'activité ;
- ses coordonnées professionnelles.

### Résultat

Le profil reflète les informations les plus récentes.

---

## 4.4 Gestion des offres

### Objectif

Permettre au professionnel de proposer ses services.

### Déclencheur

Le professionnel souhaite publier ou modifier une offre.

### Acteurs concernés

- Professionnel

### Déroulement

Le professionnel :

- active une prestation du catalogue officiel ;
- configure son offre ;
- la publie ;
- peut ensuite la modifier, la désactiver ou l'archiver.

### Résultat

L'offre devient disponible selon son état.

---

## 4.5 Gestion des disponibilités

### Objectif

Permettre au professionnel de gérer son agenda.

### Déclencheur

Le professionnel souhaite ouvrir ou modifier ses disponibilités.

### Acteurs concernés

- Professionnel

### Déroulement

Le professionnel :

- définit ses horaires ;
- ouvre des créneaux ;
- bloque certains créneaux ;
- met à jour son agenda.

### Résultat

Les créneaux disponibles peuvent être proposés aux demandeurs.

---

## 4.6 Gestion des rendez-vous

### Objectif

Permettre au professionnel de gérer les consultations réservées.

### Déclencheur

Une demande de réservation est reçue.

### Acteurs concernés

- Professionnel
- Demandeur

### Déroulement

Le professionnel peut :

- consulter les demandes ;
- confirmer un rendez-vous ;
- refuser un rendez-vous ;
- consulter son planning ;
- démarrer une consultation ;
- clôturer une consultation ;
- rédiger un compte rendu facultatif.

### Résultat

Le rendez-vous suit son cycle de vie jusqu'à sa clôture.

---

# 5. Processus de gestion des demandeurs

Les processus de gestion des demandeurs couvrent l'ensemble du parcours d'un particulier ou d'une entreprise souhaitant accéder aux services proposés sur Chaweer.

---

## 5.1 Inscription du demandeur

### Objectif

Permettre à un utilisateur de créer un compte Chaweer.

### Déclencheur

Le demandeur souhaite utiliser la plateforme.

### Acteurs concernés

- Demandeur
- Plateforme

### Déroulement

Le demandeur :

- crée son compte ;
- valide son adresse électronique ;
- complète son profil.

### Résultat

Le compte est créé.

---

## 5.2 Gestion du profil

### Objectif

Permettre au demandeur de maintenir ses informations personnelles.

### Déclencheur

Le demandeur souhaite modifier son profil.

### Acteurs concernés

- Demandeur

### Déroulement

Le demandeur peut notamment :

- modifier ses informations personnelles ;
- consulter son historique ;
- gérer ses informations de contact.

### Résultat

Le profil est mis à jour.

---

## 5.3 Recherche

### Objectif

Permettre au demandeur d'identifier le professionnel répondant le mieux à son besoin.

### Déclencheur

Le demandeur recherche une assistance juridique.

### Acteurs concernés

- Demandeur

### Déroulement

Le demandeur peut :

- rechercher un professionnel ;
- rechercher une prestation ;
- filtrer les résultats ;
- consulter les fiches professionnelles ;
- comparer plusieurs professionnels.

### Résultat

Le demandeur sélectionne le professionnel de son choix.

# 6. Processus de réalisation — Réservation d'une consultation vidéo

La réservation d'une consultation vidéo constitue le principal processus métier de la première version de Chaweer.

Il permet à un demandeur de réserver une consultation auprès d'un professionnel dans un cadre simple, transparent et sécurisé.

---

## 6.1 Objectif

Permettre à un demandeur de réserver une consultation vidéo avec un professionnel selon un créneau confirmé, un paiement sécurisé et un déroulement entièrement dématérialisé.

---

## 6.2 Déclencheur

Le demandeur souhaite réserver une consultation vidéo proposée par un professionnel.

---

## 6.3 Acteurs concernés

- Demandeur
- Professionnel
- Plateforme

---

## 6.4 Déroulement

### Étape 1 — Sélection du professionnel

Le demandeur peut accéder à une consultation selon deux parcours.

#### Recherche d'un professionnel

Le demandeur recherche un professionnel.

Après consultation de sa fiche, il sélectionne l'offre de consultation vidéo proposée.

---

#### Recherche d'une consultation vidéo

Le demandeur recherche directement des consultations vidéo.

Chaweer présente les professionnels proposant cette prestation.

Le demandeur choisit ensuite le professionnel souhaité.

Les deux parcours convergent vers le même processus de réservation.

---

### Étape 2 — Choix du créneau

Le demandeur consulte les disponibilités du professionnel.

Il sélectionne un créneau libre.

Cette action crée une demande de réservation.

Le rendez-vous n'est pas encore confirmé.

---

### Étape 3 — Confirmation du professionnel

Le professionnel reçoit la demande.

Il peut :

- confirmer le rendez-vous ;
- refuser la demande.

La réservation devient éligible au paiement uniquement après confirmation.

---

### Étape 4 — Paiement

Après confirmation, le demandeur reçoit une notification.

Il est invité à finaliser sa réservation en procédant au paiement.

La réservation devient effective uniquement après validation du paiement.

À défaut de paiement dans le délai prévu par la plateforme, la demande est automatiquement annulée et le créneau redevient disponible.

---

### Étape 5 — Préparation de la consultation

Après validation du paiement :

- la salle de visioconférence est créée automatiquement ;
- le lien est communiqué au demandeur et au professionnel ;
- le lien reste inactif.

Il devient accessible une heure avant le début de la consultation.

---

### Étape 6 — Réalisation de la consultation

À l'heure prévue :

- le demandeur rejoint la salle de visioconférence ;
- le professionnel rejoint la consultation ;
- la consultation se déroule.

---

### Étape 7 — Clôture

À l'issue de la consultation, le professionnel clôture la prestation.

Il peut, s'il le souhaite, rédiger un compte rendu.

Le compte rendu est partagé avec le demandeur.

Cette étape est facultative.

---

### Étape 8 — Évaluation

Une fois la consultation clôturée :

- le paiement suit son processus de versement au professionnel conformément aux règles financières de la plateforme ;
- le demandeur est invité à publier un avis ;
- les indicateurs de réputation du professionnel sont mis à jour.

---

## 6.5 Résultat

La consultation est terminée.

Les deux parties disposent d'un historique de la prestation.

La réputation du professionnel est mise à jour et le paiement est traité conformément aux règles de la plateforme.

---

## 6.6 Gestion des exceptions

### Refus de la demande

Le professionnel peut refuser une demande de réservation.

Le demandeur est immédiatement notifié.

Le créneau redevient disponible.

---

### Annulation par le professionnel

Le professionnel peut exceptionnellement annuler un rendez-vous confirmé.

Dans ce cas :

- le demandeur est immédiatement informé ;
- le paiement est intégralement remboursé ;
- cette annulation est prise en compte dans les indicateurs de réputation du professionnel.

---

### Absence du demandeur

Si le demandeur ne rejoint pas la consultation dans le délai de grâce défini par Chaweer :

- le professionnel peut déclarer le demandeur absent ;
- la consultation est considérée comme réalisée ;
- le paiement est versé au professionnel.

---

### Absence du professionnel

Si le professionnel ne rejoint pas la consultation dans le délai de grâce défini par Chaweer :

- le demandeur peut déclarer le professionnel absent ;
- le paiement est intégralement remboursé ;
- cette absence est prise en compte dans les indicateurs de réputation du professionnel.

---

### Incident technique

En cas d'incident empêchant le bon déroulement de la consultation, les parties peuvent signaler le problème à la plateforme.

Les modalités de traitement sont définies dans le document **10-Litiges.md**.
