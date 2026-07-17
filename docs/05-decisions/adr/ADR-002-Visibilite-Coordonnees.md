# ADR-002 — Visibilité des coordonnées des professionnels

> Statut : Validé
>
> Date : 13 juillet 2026
>
> Auteur : Issam Majdoubi
>
> Relecture : associés

## Contexte

Chaweer souhaite permettre aux visiteurs de découvrir librement les professionnels tout en encourageant la création d'un compte.

Une décision devait être prise concernant l'affichage du numéro de téléphone.

---

## Problème

Le numéro doit-il être :

- totalement visible ;
- totalement masqué ;
- partiellement masqué ?

---

## Options étudiées

### Option 1 : Numéro totalement visible

**Avantages**

- expérience fluide ;
- confiance immédiate.

**Inconvénients**

- faible incitation à créer un compte.

---

### Option 2 : Numéro totalement masqué

**Avantages**

- forte conversion vers l'inscription.

**Inconvénients**

- frustration ;
- perte de confiance.

---

### Option 3 : Numéro partiellement masqué (Décision r### Option 3 : e :

```
+212 6 12 ** ** **
```

Le numéro complet est affiché uniquement après authentification.

---

## Décision retenue

Les visiteurs anonymes peuvent consulter librement la fiche d'un professionnel.

Le numéro de téléphone est affiché de manière partiellement masquée.

L'utilisateur authentifié peut afficher le numéro complet.

---

## Conséquences

Les professionnels restent facilement identifiables.

Les visiteurs sont naturellement incités à créer un compte avant d'interagir avec eux.

Cette règle pourra évoluer selon la stratégie produit.

---

## Alternatives futures

Si la stratégie produit évolue, il sera possible d'afficher le numéro complet pour certains professionnels ou de le masquer entièrement pour d'autres, sans remettre en cause le principe général de protection des coordonnées.
