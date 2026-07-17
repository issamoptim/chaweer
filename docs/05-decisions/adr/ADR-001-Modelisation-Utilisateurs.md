# ADR-001 — Modélisation des utilisateurs

> Statut : Validé
>
> Date : 13 juillet 2026
>
> Auteur : Issam Majdoubi
>
> Relecture : associés

## Contexte

Chaweer s'adresse à plusieurs catégories d'utilisateurs, notamment les particuliers et les entreprises.

Une décision devait être prise concernant leur modélisation.

---

## Problème

Faut-il créer deux objets métier distincts (Particulier et Entreprise) ou un seul objet Utilisateur avec plusieurs types ?

---

## Options étudiées

### Option 1 : Deux objets métier

**Avantages**

- représentation métier explicite ;
- évolution indépendante.

**Inconvénients**

- duplication importante des fonctionnalités ;
- architecture plus complexe ;
- maintenance plus coûteuse.

---

### Option 2 : Un objet métier unique (Décision retenue)

Créer un objet métier **UtCréer un objet métied'Créer un objet métier **UtCréer un objet métied'Crée
- - - - - - - - - informations spécifiques seront ajoutées selon le type.

---

## Décision retenue

Chaweer adopte un objet métier unique **Utilisateur**.

Le type d'utilisateur permettra de distinguer :

- Particulier
- Entreprise

Les fonctionnalités restent identiques.

Seules certaines informations de profil diffèrent.

---

## Conséquences

Le modèle métier reste simple.

Les futures fonctionnalités spécifiques aux entreprises pourront être ajoutées sans modifier l'architecture générale.

---

## Alternatives futures

Si les besoins des particuliers et des entreprises divergent significativement à l'avenir, il sera possible d'introduire des sous-types ou des comportements spécifiques sans remettre en cause l'objet métier unique.
