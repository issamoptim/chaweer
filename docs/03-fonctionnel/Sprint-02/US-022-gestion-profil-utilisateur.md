# US-022 — Gestion du profil utilisateur

## Statut

Ready for Development

---

# Objectif

Permettre à un utilisateur authentifié de modifier les informations de son profil personnel afin de maintenir ses données à jour de manière simple, sécurisée et intuitive.

Cette User Story complète **US-021 – Consultation du profil utilisateur**.

---

# Valeur métier

- Garantir des informations utilisateur fiables et à jour.
- Améliorer l'expérience utilisateur.
- Préparer l'utilisateur avant son éventuelle inscription en tant que professionnel.
- Réduire les sollicitations du support pour les modifications de profil.

---

# Acteurs

## Acteur principal

- Utilisateur authentifié

---

# Dépendances

- US-021 — Consultation du profil utilisateur

---

# Préconditions

- L'utilisateur est authentifié.
- Le profil utilisateur existe.
- L'utilisateur consulte son propre profil.
- Les référentiels Pays, Ville et Nationalité sont disponibles.

---

# Périmètre

Cette User Story couvre :

- Consultation des informations personnelles.
- Modification des informations autorisées.
- Validation métier des données.
- Sauvegarde des modifications.
- Confirmation de la mise à jour.
- Gestion des erreurs fonctionnelles.

---

# Hors périmètre

Cette User Story ne couvre pas :

- Changement du mot de passe.
- Changement d'adresse e-mail.
- Suppression du compte.
- Paramètres utilisateur.
- Notifications.
- Profil professionnel.

Ces fonctionnalités seront couvertes par des User Stories dédiées.

---

# Parcours utilisateur

1. L'utilisateur ouvre la page **Mon Compte**.
2. Il clique sur **Modifier mon profil**.
3. Le formulaire est prérempli avec ses informations actuelles.
4. L'utilisateur modifie une ou plusieurs informations autorisées.
5. Il clique sur **Enregistrer**.
6. Le système valide les données.
7. Les modifications sont enregistrées.
8. Le profil est immédiatement mis à jour.
9. Un message de confirmation est affiché.
10. L'utilisateur est redirigé vers la page **Mon Compte**.

---

# Fonctionnalités

## Consultation

Le système affiche les informations personnelles de l'utilisateur.

### Informations modifiables

- Prénom
- Nom
- Téléphone
- Pays
- Ville
- Nationalité

### Informations en lecture seule

- Adresse e-mail (identifiant d'authentification)
- Type de compte
- Date de création du compte

---

## Modification

L'utilisateur peut modifier les informations autorisées.

Le formulaire est prérempli avec les données existantes.

---

## Sauvegarde

Après validation :

- les modifications sont enregistrées ;
- les nouvelles informations sont immédiatement disponibles ;
- aucun rechargement complet de la page n'est nécessaire.

---

## Annulation

L'utilisateur peut quitter l'écran sans enregistrer ses modifications.

Aucune donnée n'est modifiée.

---

# Règles métier

### RM-01

Le profil utilisateur existe dès la création du compte.

---

### RM-02

Seul le propriétaire du compte peut modifier son profil.

---

### RM-03

L'utilisateur peut modifier toutes les informations de son profil, à l'exception de l'identifiant utilisé par son fournisseur d'authentification.

Aujourd'hui, Chaweer supporte uniquement :

- Email + Mot de passe
- Google

Dans les deux cas, l'identifiant est l'adresse e-mail. L'e-mail reste en lecture seule.

Le téléphone ne sert pas d'identifiant d'authentification. Il est modifiable.

---

### RM-04

Les informations affichées doivent toujours correspondre aux données enregistrées.

---

### RM-05

Les modifications sont atomiques.

Toutes les informations sont enregistrées dans une seule opération.

En cas d'erreur, aucune modification partielle ne doit être persistée.

---

### RM-06

Les valeurs **Pays**, **Ville** et **Nationalité** proviennent exclusivement des référentiels de l'application.

Aucune saisie libre n'est autorisée.

---

### RM-07

Les espaces en début et fin de texte sont automatiquement supprimés avant validation.

---

# Autorisations

Un utilisateur authentifié peut uniquement consulter et modifier son propre profil.

Toute tentative d'accès ou de modification du profil d'un autre utilisateur doit être refusée.

---

# Validation métier

Les champs suivants sont tous facultatifs :

- Prénom
- Nom
- Téléphone
- Pays
- Ville
- Nationalité

Le formulaire peut être enregistré même si ces champs sont vides.

Les listes suivantes utilisent exclusivement des listes déroulantes :

- Pays
- Ville
- Nationalité

Chaque liste propose une option « Sélectionner… » qui remet la valeur à null.

Si le pays est vidé, la ville est automatiquement remise à null.

Le système empêche l'enregistrement de données invalides.

---

# États métier

## Chargement

Les données du profil sont en cours de récupération.

---

## Consultation

Les informations sont affichées.

---

## Édition

Le formulaire est modifiable.

---

## Sauvegarde

Les modifications sont en cours d'enregistrement.

---

## Succès

Le profil est mis à jour avec succès.

---

## Erreur

Les modifications ne sont pas enregistrées.

Le formulaire reste disponible afin que l'utilisateur puisse corriger ou réessayer.

---

# Gestion des erreurs

Le système doit gérer notamment :

- données invalides ;
- perte de connexion ;
- erreur serveur ;
- double soumission ;
- utilisateur non authentifié ;
- session expirée.

Aucune donnée valide ne doit être perdue.

---

# Postconditions

Après une mise à jour réussie :

- les nouvelles informations sont persistées ;
- les informations affichées correspondent aux données enregistrées ;
- le profil reste cohérent ;
- aucune autre donnée utilisateur n'est modifiée.

---

# Critères d'acceptation

### AC-01

L'utilisateur peut accéder à l'écran de modification depuis son profil.

---

### AC-02

Le formulaire est prérempli avec les données existantes.

---

### AC-03

Les informations autorisées peuvent être modifiées.

---

### AC-04

Les informations en lecture seule ne peuvent pas être modifiées.

---

### AC-05

Les validations empêchent l'enregistrement de données invalides.

---

### AC-06

Les modifications sont enregistrées avec succès.

---

### AC-07

Le profil affiche immédiatement les nouvelles informations.

---

### AC-08

Seul le propriétaire du compte peut modifier son profil.

---

### AC-09

Le bouton **Enregistrer** reste désactivé tant qu'aucune modification n'a été effectuée.

---

### AC-10

Une tentative de quitter la page avec des modifications non enregistrées demande une confirmation à l'utilisateur.

---

# Cas limites

- Aucun changement effectué.
- Modification d'un seul champ.
- Modification de plusieurs champs.
- Tentative de modification d'un champ en lecture seule.
- Double clic sur **Enregistrer**.
- Fermeture de la page avec des modifications non enregistrées.
- Retour navigateur pendant l'édition.
- Session expirée pendant l'édition.
- Erreur serveur pendant la sauvegarde.
- Perte de connexion pendant la sauvegarde.

---

# Références

- US-021 — Consultation du profil utilisateur
- US-022-DESIGN-SPECIFICATION.md

---

# Definition of Done

- Fonctionnalité entièrement opérationnelle.
- Responsive Desktop / Tablet / Mobile.
- Validation métier implémentée.
- États UI conformes à la Design Specification.
- Messages de succès et d'erreur.
- Tests unitaires.
- Tests d'intégration.
- Documentation mise à jour.