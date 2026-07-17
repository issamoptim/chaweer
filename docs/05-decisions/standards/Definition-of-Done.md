# Definition of Done

> Version : 1.0

> Statut : Validé

> Auteur : Issam Majdoubi

> Relecture : CTO

---

# Objectif

La Definition of Done (DoD) définit les critères qu'une User Story, une tâche ou un Lot Fonctionnel doit satisfaire avant d'être considéré comme terminé.

Elle garantit un niveau de qualité homogène tout au long du projet Chaweer.

Aucun développement n'est considéré comme terminé tant que l'ensemble de ces critères n'est pas respecté.

---

# Principes

Chez Chaweer :

- une fonctionnalité terminée est une fonctionnalité utilisable ;
- la qualité prime sur la rapidité ;
- la documentation fait partie intégrante du développement ;
- une fonctionnalité ne doit jamais dégrader une fonctionnalité existante.

---

# Critères obligatoires

## 1. Fonctionnel

- Le besoin métier est entièrement couvert.
- Les critères d'acceptation de la User Story sont satisfaits.
- Aucun comportement non prévu n'a été introduit.

---

## 2. Frontend

- Les écrans sont terminés.
- Les validations utilisateur sont présentes.
- Les messages d'erreur sont compréhensibles.
- Le responsive est fonctionnel.
- Les composants respectent le Design System du projet.

---

## 3. Backend

- Les API sont développées.
- Les règles métier sont appliquées.
- Les erreurs sont correctement gérées.
- Les codes HTTP sont cohérents.

---

## 4. Base de données

- Les modèles Prisma sont à jour.
- Les migrations ont été créées si nécessaire.
- Les données existantes restent compatibles.

---

## 5. Sécurité

- Les contrôles d'accès sont respectés.
- Les données sensibles sont protégées.
- Les validations serveur sont implémentées.

---

## 6. Qualité du code

- Le code est lisible.
- Les conventions du projet sont respectées.
- Aucun code mort n'est laissé.
- Les duplications inutiles sont évitées.

---

## 7. Tests

Les principaux scénarios ont été vérifiés.

- scénario nominal ;
- cas d'erreur ;
- permissions ;
- validations.

Aucune régression connue ne subsiste.

---

## 8. Documentation

La documentation est mise à jour lorsque la fonctionnalité modifie :

- le modèle métier ;
- les référentiels métier ;
- un parcours utilisateur ;
- une décision d'architecture ;
- le Product Backlog si nécessaire.

---

## 9. Validation finale

Avant validation, les points suivants sont vérifiés :

- la fonctionnalité fonctionne ;
- les données sont cohérentes ;
- aucune régression majeure n'a été détectée ;
- le comportement est conforme au besoin métier.

---

# Critères de refus

Une User Story ou un Lot Fonctionnel ne peut pas être validé si :

- une partie du besoin est absente ;
- un bug bloquant est identifié ;
- la documentation obligatoire n'a pas été mise à jour ;
- une régression importante est constatée ;
- les règles métier ne sont pas respectées.

---

# Validation

La validation finale appartient au Product Owner.

Le passage à l'état **Done** signifie que la fonctionnalité est considérée comme prête à être intégrée à la branche principale du projet.

---

# Philosophie

Chez Chaweer, **Done** signifie :

- développé ;
- testé ;
- documenté ;
- validé ;
- intégrable sans risque dans le projet.

Une fonctionnalité simplement "codée" n'est pas considérée comme terminée.