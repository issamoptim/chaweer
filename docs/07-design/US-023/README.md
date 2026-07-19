# README — US-023 Sécurité du compte

# Objectif

La page **Sécurité** permet à un utilisateur authentifié de gérer les éléments liés à la protection de son compte.

Elle centralise les informations relatives à l'authentification ainsi que les actions ayant un impact sur la sécurité du compte.

Les informations personnelles (nom, prénom, téléphone, pays, ville, nationalité, préférences, etc.) ne sont pas gérées par cette page et restent couvertes par l'US-022.

---

# Position dans le parcours utilisateur

Cette page est accessible depuis l'espace **Mon compte**.

```
Mon compte
    ├── Mon profil
    └── Sécurité
```

Elle constitue l'unique point d'entrée des fonctionnalités liées à la sécurité du compte.

---

# Objectifs UX

La page doit permettre à l'utilisateur de :

- comprendre rapidement comment son compte est authentifié ;
- consulter les informations de sécurité de son compte ;
- modifier son mot de passe lorsque cela est autorisé ;
- comprendre pourquoi cette action n'est pas disponible avec un compte Google ;
- supprimer son compte de manière volontaire et sécurisée.

L'ensemble des informations doit être présenté de façon simple, lisible et rassurante.

---

# Principes de conception

La page repose sur les principes suivants :

- simplicité ;
- clarté ;
- cohérence avec le reste de l'espace **Mon compte** ;
- prévention des erreurs ;
- protection contre les actions irréversibles.

Les actions les plus sensibles sont volontairement placées en fin de page.

---

# Architecture de la page

La page est organisée en trois sections.

## 1. Compte

Cette section présente les informations d'identification du compte.

Elle affiche :

- l'adresse e-mail ;
- le mode d'authentification.

Ces informations sont consultables uniquement.

Aucune modification n'est possible depuis cette page.

---

## 2. Mot de passe

Cette section dépend du mode d'authentification.

### Compte Email + Mot de passe

Le formulaire de changement de mot de passe est disponible.

### Compte Google

Le formulaire est remplacé par un message indiquant que le mot de passe est géré par Google.

---

## 3. Suppression du compte

Cette section regroupe les actions irréversibles.

Elle permet à l'utilisateur de supprimer définitivement son compte après confirmation explicite.

Elle est volontairement séparée des autres sections afin d'éviter toute manipulation accidentelle.

---

# Variantes

La page possède deux variantes principales.

## Variante 1 — Compte Email + Mot de passe

Affiche :

- les informations du compte ;
- le formulaire de changement de mot de passe ;
- la suppression du compte.

---

## Variante 2 — Compte Google

Affiche :

- les informations du compte ;
- un message indiquant que l'authentification est gérée par Google ;
- la suppression du compte.

Le formulaire de changement de mot de passe n'est pas affiché.

---

# Responsive

## Desktop

Présentation sous forme de cartes verticales centrées.

---

## Tablette

Même organisation avec adaptation des espacements.

---

## Mobile

Les cartes sont empilées sur une seule colonne.

Les zones d'action restent facilement accessibles.

---

# États de l'interface

La page doit gérer les états suivants :

- chargement ;
- affichage normal ;
- validation du formulaire ;
- succès ;
- erreur ;
- compte Google ;
- confirmation de suppression.

---

# Contraintes UX

- Les informations en lecture seule sont clairement identifiées.
- Les actions sensibles nécessitent une confirmation explicite.
- Les messages d'erreur ne doivent jamais divulguer d'informations sensibles.
- La suppression du compte est visuellement distincte des autres fonctionnalités.
- L'utilisateur doit toujours comprendre pourquoi certaines actions sont indisponibles.

---

# Accessibilité

La page doit respecter les règles d'accessibilité du Design System :

- navigation clavier complète ;
- ordre de tabulation cohérent ;
- messages d'erreur accessibles ;
- contraste conforme ;
- lecteurs d'écran compatibles.

---

# Documents associés

- US-023 — Sécurité du compte
- Design-Specification.md
- user-flows.md
- ui-decisions.md
- validation.md