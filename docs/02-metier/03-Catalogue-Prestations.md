# Chaweer — Catalogue des Prestations

> Version : 1.0  
> Statut : Validé  
> Auteur : Issam Majdoubi  
> Relecture : CTO  
> Dernière mise à jour : 15 juillet 2026

---

# 1. Objectif

Le présent document définit le catalogue officiel des prestations proposées sur Chaweer.

Il décrit les différents modèles de prestation, leur fonctionnement ainsi que les règles de structuration du catalogue.

Le catalogue constitue un référentiel métier unique permettant de garantir une expérience homogène pour les demandeurs, une gouvernance centralisée des prestations et une évolutivité maîtrisée de la plateforme.

---

# 2. Principes

Le catalogue de Chaweer repose sur plusieurs principes fondateurs.

## Catalogue officiel

Les prestations disponibles sur Chaweer sont définies exclusivement par la plateforme.

Les professionnels ne créent pas librement de nouveaux types de prestations.

Ils activent les prestations du catalogue officiel correspondant à leur activité.

Cette approche garantit :

- une expérience utilisateur cohérente ;
- une meilleure comparabilité entre professionnels ;
- une recherche plus pertinente ;
- une gouvernance métier simplifiée.

---

## Une prestation représente un service

Une prestation correspond à un service pouvant être proposé par un professionnel.

Elle ne représente ni un domaine du droit, ni un document particulier, ni un cas d'usage spécifique.

Exemples :

- Consultation vidéo
- Analyse juridique
- Rédaction juridique

---

## Une offre est la déclinaison d'une prestation

Lorsqu'un professionnel active une prestation du catalogue, il crée une offre.

Chaque offre hérite des caractéristiques de la prestation officielle tout en permettant au professionnel de configurer les paramètres autorisés.

---

# 3. Les modèles de prestation

Chaweer distingue deux modèles métier.

## Prestations à réservation directe

Ces prestations possèdent un prix connu à l'avance.

Le client réserve immédiatement la prestation.

Exemple :

- Consultation vidéo.

---

## Prestations avec proposition commerciale

Ces prestations nécessitent une analyse préalable du besoin.

Le client dépose une demande.

Le professionnel analyse la situation puis établit une proposition commerciale.

Après acceptation par le client, cette proposition devient le contrat de prestation.

Exemples :

- Analyse juridique.
- Rédaction juridique.

---

# 4. Périmètre fonctionnel des versions

Le modèle métier de Chaweer est conçu dès l'origine pour prendre en charge les deux modèles de prestation.

Leur déploiement fonctionnel sera toutefois progressif afin de garantir une montée en charge maîtrisée.

---

## Version 1

La première version de Chaweer est volontairement centrée sur la réservation de consultations vidéo.

Les professionnels pourront proposer :

- Consultation vidéo.

Cette première version permettra de valider :

- le référencement des professionnels ;
- la gestion des offres ;
- les agendas ;
- la réservation ;
- les paiements sécurisés ;
- les notifications ;
- la visioconférence ;
- les avis ;
- les premiers mécanismes de réputation.

L'objectif est de proposer une expérience simple, fluide et parfaitement maîtrisée avant d'introduire des processus métier plus complexes.

---

## Version 2

La deuxième version introduira les prestations reposant sur une proposition commerciale.

Les professionnels pourront alors proposer :

- Analyse juridique ;
- Rédaction juridique.

Cette évolution apportera notamment :

- le dépôt de demandes de prestation ;
- le formulaire hybride ;
- la demande de compléments ;
- la proposition commerciale ;
- la contractualisation ;
- les avenants ;
- le suivi des missions ;
- la livraison ;
- la validation des livrables.

Cette approche progressive permet de construire des fondations solides tout en préparant les futures évolutions de la plateforme.

---

# 5. Catalogue officiel

Le catalogue métier de Chaweer est conçu pour prendre en charge les prestations suivantes.

Leur disponibilité dépend de la version de la plateforme.

## Consultation vidéo

Consultation réalisée en visioconférence.

Le professionnel configure :

- la durée ;
- le prix ;
- la description ;
- les disponibilités de son agenda.

Les domaines d'activité sont hérités automatiquement du profil professionnel.

**Disponible dès la Version 1.**

---

## Analyse juridique

Prestation permettant au professionnel d'analyser une situation ou des documents transmis par le client.

Le professionnel configure :

- une description ;
- le délai moyen de traitement.

Le client formule sa demande via un formulaire hybride.

**Disponible à partir de la Version 2.**

---

## Rédaction juridique

Prestation permettant au professionnel de rédiger un acte ou un document juridique.

Le professionnel configure :

- une description ;
- le délai moyen de réalisation ;
- les actes et documents juridiques pris en charge.

Le client formule sa demande via un formulaire hybride.

**Disponible à partir de la Version 2.**

---

# 6. Configuration des offres

Chaque professionnel configure uniquement les paramètres autorisés pour chaque prestation.

## Consultation vidéo

Le professionnel définit :

- le prix ;
- la durée ;
- la description ;
- les disponibilités.

---

## Analyse juridique

Le professionnel définit :

- une description ;
- le délai moyen de traitement.

---

## Rédaction juridique

Le professionnel définit :

- une description ;
- le délai moyen de réalisation ;
- les actes et documents juridiques pris en charge.

---

# 7. Les domaines d'activité

Les domaines d'activité sont définis au niveau du profil du professionnel.

Ils s'appliquent automatiquement à l'ensemble de ses prestations.

Ils ne sont donc jamais configurés individuellement pour chaque offre.

---

# 8. Les actes et documents juridiques

Certaines prestations nécessitent un niveau de précision supérieur.

C'est notamment le cas de la rédaction juridique.

Pour ces prestations, Chaweer met à disposition un référentiel officiel des actes et documents juridiques.

Le professionnel sélectionne uniquement ceux qu'il prend effectivement en charge.

Exemples :

- Contrat de travail ;
- Contrat commercial ;
- Bail d'habitation ;
- Bail commercial ;
- Conditions Générales de Vente ;
- Statuts de société ;
- Pacte d'associés ;
- Mise en demeure ;
- Convention ;
- Accord de confidentialité (NDA).

Ce référentiel est utilisé pour :

- améliorer la recherche ;
- enrichir les filtres ;
- faciliter les recommandations ;
- produire des statistiques métier.

---

# 9. Les demandes de prestation

Les prestations reposant sur une proposition commerciale utilisent un formulaire hybride.

Chaque demande comprend :

## Informations structurées

- objet de la demande ;
- niveau d'urgence ;
- pièces jointes.

## Description libre

Le demandeur décrit sa situation avec ses propres mots.

## Documents

Le demandeur peut joindre tous les documents nécessaires à l'analyse.

Cette approche permet de guider les utilisateurs sans les contraindre.

---

# 10. Cycle de vie d'une offre

Une offre suit le cycle de vie suivant.

```text
Brouillon
      │
Publier
      │
      ▼
Active
      │
      ├────────────► Désactivée
      │                 │
      │                 └────────► Réactiver
      │
      └────────────► Archivée
```

## Brouillon

L'offre est en cours de création ou de configuration.

Elle n'est pas visible.

---

## Active

L'offre est publiée.

Elle est visible et peut recevoir des réservations ou des demandes.

---

## Désactivée

L'offre est temporairement indisponible.

Elle peut être réactivée à tout moment.

---

## Archivée

L'offre est définitivement retirée de l'activité du professionnel.

Elle ne peut plus être réactivée.

Son historique est conservé afin de préserver les missions, les contrats, les transactions, les avis ainsi que les obligations légales.

---

# 11. Évolutions futures

Le catalogue est conçu pour évoluer progressivement.

Chaque nouvelle prestation devra respecter les principes définis dans le présent document afin de préserver la cohérence de l'expérience utilisateur et la stabilité du modèle métier.

---

# Conclusion

Le catalogue des prestations constitue l'un des piliers du domaine métier de Chaweer.

Il établit un cadre commun entre les professionnels, les demandeurs et la plateforme.

Sa gouvernance centralisée garantit une expérience homogène, une recherche performante et une évolution maîtrisée du produit.

Le modèle métier est conçu dès aujourd'hui pour accueillir de nouvelles prestations et de nouvelles professions juridiques sans remettre en cause son architecture.