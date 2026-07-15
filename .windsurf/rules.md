# AI Development Rules

## Principe général

Avant toute modification :

1. Lire AI-PLAYBOOK.md.
2. Lire les documents métier concernés.
3. Comprendre la User Story.
4. Analyser l'existant.

Ne jamais coder avant d'avoir compris le contexte.

---

# Règle 1 — Documentation

La documentation officielle fait foi.

Ne jamais inventer une règle métier.

En cas de doute, demander une clarification.

---

# Règle 2 — Architecture

Respecter strictement l'architecture définie dans AI-PLAYBOOK.md.

Ne jamais modifier l'architecture sans validation.

---

# Règle 3 — Backend

Toute logique métier appartient au backend.

Le frontend Web et le frontend Mobile ne contiennent jamais de logique métier.

---

# Règle 4 — API

Toute nouvelle fonctionnalité doit être développée sous forme d'API REST.

Les API doivent être utilisables aussi bien par le Web que par le Mobile.

---

# Règle 5 — Base de données

Prisma est l'unique couche d'accès à PostgreSQL.

Toute modification du schéma nécessite une migration.

---

# Règle 6 — Qualité

Écrire un code :

- simple ;
- lisible ;
- maintenable ;
- modulaire ;
- testé.

---

# Règle 7 — TypeScript

Utiliser TypeScript strict.

Ne jamais utiliser "any" sans justification.

---

# Règle 8 — Git

Une Pull Request correspond à une seule User Story.

Ne jamais mélanger plusieurs fonctionnalités.

---

# Règle 9 — Sécurité

Toujours :

- valider les entrées ;
- gérer les erreurs ;
- protéger les données sensibles.

---

# Règle 10 — Évolutivité

Toujours concevoir les fonctionnalités pour qu'elles soient réutilisables par :

- l'application Web ;
- l'application Mobile.

---

# Règle 11 — Décisions

L'IA peut proposer des améliorations.

Elle ne doit jamais appliquer une décision d'architecture sans validation.

---

# Règle 12 — Fin d'une User Story

Une User Story est terminée uniquement lorsque :

- le code compile ;
- les tests passent ;
- les critères d'acceptation sont respectés ;
- la documentation est mise à jour si nécessaire.
