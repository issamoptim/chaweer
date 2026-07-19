# ADR-004 — Suppression des Comptes Utilisateurs

| Statut | Acceptée |
|---------|----------|
| Date | YYYY-MM-DD |
| Décideurs | Product Owner |

## Contexte

Chaweer permet à un utilisateur de supprimer son compte. Cette opération doit prévenir les suppressions accidentelles tout en respectant les exigences de sécurité et de conservation des données.

## Décision

- La suppression d'un compte est une **suppression logique (Soft Delete)**.
- Une **confirmation explicite** est requise avant la suppression.
- Une **réauthentification** est obligatoire :
  - mot de passe pour les comptes Email ;
  - revalidation du fournisseur d'identité pour les comptes OAuth (Google, etc.).
- Le compte est conservé pendant **30 jours** dans un état supprimé.
- Durant cette période, le compte peut être restauré.
- À l'issue des 30 jours, la suppression définitive est exécutée automatiquement.

## Conséquences

### Avantages

- Réduit les suppressions accidentelles.
- Renforce la sécurité des comptes.
- Permet la récupération d'un compte supprimé par erreur.
- Harmonise le comportement de la plateforme.

### Inconvénients

- Nécessite un mécanisme de purge automatique.
- Les données restent conservées pendant la période de restauration.

## Impact

Cette décision s'applique à :

- Authentification
- Gestion des comptes
- Profil utilisateur
- Administration
- Notifications
- Politique de conservation des données