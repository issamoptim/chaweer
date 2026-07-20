# EP-03 — Onboarding des Professionnels

## Statut

Approuvé

---

# Vision

Permettre aux professionnels du droit de créer un profil professionnel fiable, complet et attractif, pouvant être vérifié par un administrateur puis publié dans l'annuaire Chaweer.

Bien que le MVP ne prenne en charge que les avocats, le modèle métier est conçu autour du concept générique de **Professionnel**, afin de permettre l'ajout futur d'autres professions juridiques sans remettre en cause le modèle de données.

---

# Objectifs

## Pour les professionnels

- Créer facilement leur profil professionnel.
- Compléter progressivement leur profil.
- Suivre le niveau de complétude de leur profil.
- Soumettre leur profil à validation.
- Être publié dans l'annuaire Chaweer.

## Pour Chaweer

- Garantir la qualité des profils publiés.
- Limiter les faux profils.
- Renforcer la confiance des utilisateurs.
- Standardiser les fiches professionnelles.
- Préparer les futures fonctionnalités (prise de rendez-vous, avis, paiement, intelligence artificielle, etc.).

---

# Périmètre du MVP

Le MVP prend en charge une seule profession :

- Avocat.

Le modèle métier reste néanmoins générique afin de permettre l'ajout de nouvelles professions dans les versions futures sans refonte de l'architecture.

---

# Hors périmètre

Les éléments suivants ne font pas partie du MVP :

- La gestion de plusieurs professions.
- La vérification automatique des documents.
- L'intégration avec des registres officiels.
- Les abonnements Premium.
- L'assistance par intelligence artificielle pour compléter le profil.
- Les statistiques avancées.

---

# Principes Produit

## Onboarding progressif

L'expérience d'onboarding doit être simple, intuitive et découpée en plusieurs étapes courtes et cohérentes.

## Profil en brouillon

Le profil professionnel est créé sous forme de brouillon et peut être complété sur plusieurs sessions.

## Sauvegarde permanente

Le professionnel ne doit jamais perdre sa progression. Les informations saisies sont enregistrées régulièrement afin de pouvoir reprendre l'onboarding à tout moment.

## Complétude visible

Le niveau de complétude du profil est affiché en permanence afin d'aider le professionnel à finaliser son profil.

## Publication contrôlée

Un profil n'est visible publiquement qu'après avoir satisfait les règles de publication et obtenu la validation d'un administrateur.

## Source unique de vérité

Le profil professionnel constitue la référence unique utilisée par l'ensemble des modules de Chaweer (annuaire, fiche publique, recherche, rendez-vous, paiements, avis, etc.).