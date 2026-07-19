# Design Specification — US-023 Sécurité du compte

# 1. Objectif

Définir précisément la conception fonctionnelle et visuelle de la page **Sécurité**.

Ce document décrit la structure de l'interface, les composants, les interactions, les validations, les états et les règles d'affichage.

Il constitue la référence de développement de cette User Story.

---

# 2. Vue d'ensemble

La page **Sécurité** appartient à l'espace **Mon compte**.

Elle regroupe toutes les fonctionnalités liées à la protection du compte utilisateur.

Les informations personnelles sont volontairement exclues de cette page et restent gérées dans **Mon profil (US-022)**.

---

# 3. Layout

La page est composée de trois cartes affichées verticalement.

```
Compte

────────────────────────────

Mot de passe

────────────────────────────

Suppression du compte
```

Les cartes sont espacées de manière homogène.

Chaque carte possède :

- un titre ;
- une description (si nécessaire) ;
- son contenu ;
- ses actions.

---

# 4. Carte « Compte »

## Objectif

Présenter les informations d'identification du compte.

## Contenu

Adresse e-mail

Mode d'authentification

## Comportement

Tous les champs sont en lecture seule.

Aucune modification n'est possible.

---

# 5. Carte « Mot de passe »

## Variante Email + Mot de passe

Le formulaire contient :

- Mot de passe actuel
- Nouveau mot de passe
- Confirmation

Bouton :

- Modifier le mot de passe

---

## Variante Google

Le formulaire est remplacé par une carte informative.

Le message explique que :

- l'authentification est gérée par Google ;
- le mot de passe doit être modifié depuis Google.

Aucune action n'est proposée.

---

# 6. Carte « Suppression du compte »

Cette carte est isolée des autres fonctionnalités.

Elle contient :

- une explication ;
- un bouton de suppression.

Le bouton ouvre une fenêtre de confirmation.

La suppression n'est jamais exécutée directement.

---

# 7. Composants

La page utilise uniquement les composants du Design System.

- Card
- Input
- Password Input
- Button
- Alert
- Dialog
- Badge
- Divider
- Spinner
- Toast

Aucun composant spécifique à cette page ne doit être créé sans justification.

---

# 8. Interactions

## Chargement

Affichage des Skeletons.

---

## Modification du mot de passe

Validation locale.

↓

Appel API.

↓

Loading.

↓

Toast succès ou erreur.

---

## Suppression

Clic

↓

Dialogue de confirmation

↓

Confirmation utilisateur

↓

Appel API

↓

Redirection selon le résultat

---

# 9. Validations

## Mot de passe actuel

Obligatoire.

---

## Nouveau mot de passe

Obligatoire.

Respect de la politique de sécurité.

---

## Confirmation

Obligatoire.

Doit être identique au nouveau mot de passe.

---

Les erreurs sont affichées directement sous le champ concerné.

---

# 10. États

La page gère :

- Loading
- Ready
- Saving
- Success
- Error

La carte Mot de passe possède également une variante Google.

---

# 11. Responsive

## Desktop

Cartes centrées.

Largeur limitée.

---

## Tablet

Même organisation.

Espacements adaptés.

---

## Mobile

Cartes sur une colonne.

Boutons pleine largeur lorsque nécessaire.

---

# 12. Accessibilité

Respect du Design System.

- navigation clavier ;
- focus visible ;
- labels associés ;
- annonces des erreurs ;
- contraste conforme.

---

# 13. Messages

Les messages utilisateurs doivent être explicites.

Exemples :

Succès :

- Votre mot de passe a été modifié.

Erreur :

- Le mot de passe actuel est incorrect.

Google :

- Votre mot de passe est géré par Google.

Suppression :

- Cette action est irréversible.

---

# 14. Animations

Animations discrètes.

- apparition des cartes ;
- ouverture de la modale ;
- affichage des toasts ;
- loading du bouton.

Les animations ne doivent jamais ralentir les interactions.

---

# 15. Contraintes techniques

- Respect du Design System.
- Aucun style spécifique hors Design System sans justification.
- Responsive obligatoire.
- Aucun texte codé en dur (internationalisation).
- Respect des règles d'accessibilité.
- Aucune régression sur l'espace **Mon compte**.

---

# 16. Hors périmètre

Ne sont pas couverts :

- changement d'adresse e-mail ;
- authentification multifacteur ;
- gestion des sessions ;
- historique des connexions ;
- appareils connectés ;
- passkeys ;
- OTP ;
- modification du fournisseur d'authentification.