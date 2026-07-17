# Modèle Métier – Chaweer

> Version : 1.0
>
> Statut : En rédaction
>
> Auteur : Issam Majdoubi
>
> Référentiel : Domaine Métier

---

# Objectif

Ce document décrit les objets métier qui composent le domaine fonctionnel de Chaweer.

Il constitue la référence du modèle métier de la plateforme.

Il ne décrit ni la structure technique de la base de données, ni les API, ni les interfaces utilisateur. Il décrit exclusivement les concepts métier manipulés par Chaweer, leurs responsabilités, leurs relations et leur cycle de vie.

Ce document sert de référence pour :

- la conception fonctionnelle ;
- la conception technique ;
- le développement ;
- les tests ;
- les évolutions futures de la plateforme.

---

# Principes de modélisation

Le modèle métier de Chaweer repose sur les principes suivants.

## Responsabilité unique

Chaque objet métier possède une responsabilité clairement définie.

Une information ne doit appartenir qu'à un seul objet métier.

---

## Séparation du métier et de la technique

Le présent document décrit uniquement le métier.

Les notions techniques (base de données, API, sécurité, authentification technique, Prisma, etc.) sont décrites dans le référentiel technique.

---

## Évolutivité

Le modèle est conçu afin de permettre l'intégration progressive de nouvelles fonctionnalités sans remettre en cause son architecture.

---

## Traçabilité

Les objets métier conservent leur historique conformément aux règles de gestion définies dans le document **05-Regles-de-Gestion.md**.

---

## Référentiel unique

Chaque objet métier constitue la source officielle des informations dont il est responsable.

Les autres objets utilisent ces informations sans les dupliquer.

---

# Vue d'ensemble du domaine

Le domaine métier de Chaweer est construit autour de neuf objets métier.

## Objets métier de la Version 1

| N° | Objet métier | Description |
|----|--------------|-------------|
| 1 | Utilisateur | Personne utilisant la plateforme Chaweer. |
| 2 | Professionnel | Utilisateur proposant des prestations juridiques. |
| 3 | Offre | Prestation commercialisée par un professionnel. |
| 4 | Agenda | Disponibilités du professionnel. |
| 5 | Créneau | Unité de réservation de l'agenda. |
| 6 | Réservation | Demande de consultation effectuée par un utilisateur. |
| 7 | Consultation | Prestation réalisée entre un utilisateur et un professionnel. |
| 8 | Paiement | Transaction financière associée à une réservation. |
| 9 | Avis | Évaluation laissée après une consultation. |

---

# Objets métier des versions futures

## Version 2

- Entreprise
- Notaire
- Adoul
- Commissaire de justice
- Expert judiciaire
- Traducteur assermenté

## Version 3

- Cabinet
- Collaborateur
- Assistant
- Mission juridique
- Devis
- Dossier juridique

Ces objets ne sont pas décrits dans le présent document.

---

# Carte du domaine métier

                            Utilisateur
                                  │
                                  │ 1
                                  │
                                  ▼ 0..1
                           Professionnel
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
               Offre          Agenda       Domaines d'activité
                 │                │
                 │           Créneaux
                 │                │
                 └────────────┬───┘
                              │
                        Réservation
                              │
              ┌───────────────┼────────────────┐
              │               │                │
         Paiement      Consultation        Avis

---

# Catalogue des objets métier

Le domaine métier de Chaweer est composé des objets suivants.

.

# Objet métier n°1 : Utilisateur

> Version : V1

---

# Définition

L'utilisateur représente toute personne physique utilisant la plateforme Chaweer.

Il constitue l'identité métier de la plateforme et permet d'accéder aux différents services proposés.

Dans la Version 1, tous les utilisateurs sont des personnes physiques.

---

# Rôle dans l'écosystème

L'utilisateur constitue le point d'entrée de l'ensemble des parcours métier de Chaweer.

Il peut utiliser la plateforme pour :

- rechercher un professionnel ;
- réserver une consultation ;
- effectuer un paiement ;
- suivre son historique ;
- publier un avis.

Certains utilisateurs peuvent également exercer une activité professionnelle sur la plateforme.

Ils disposent alors d'un objet métier **Professionnel** associé.

---

# Responsable métier

L'utilisateur est responsable des informations relatives à son identité.

Chaweer est responsable :

- de l'authentification ;
- de la sécurité du compte ;
- de son cycle de vie.

---

# Données métier

## Identité

- Nom
- Prénom

---

## Coordonnées

- Adresse e-mail
- Numéro de téléphone

---

## Authentification

- Mode de connexion
    - Email
    - Téléphone
    - Compte Google

- Identifiant de connexion

---

## Préférences

- Langue

---

## Traçabilité

- Date d'inscription
- Dernière connexion

---

## Statut

- Actif
- Suspendu
- Fermé

---

# Capacités

Un utilisateur peut :

- créer un compte ;
- s'authentifier ;
- gérer ses informations personnelles ;
- rechercher un professionnel ;
- réserver une consultation ;
- effectuer un paiement ;
- consulter son historique ;
- publier un avis.

Les fonctionnalités disponibles dépendent de son éventuel statut de professionnel.

---

# Relations

Un utilisateur peut :

- créer plusieurs réservations ;
- effectuer plusieurs paiements ;
- publier plusieurs avis.

Un utilisateur peut également être associé à un professionnel.

Cardinalités :

Utilisateur (1) -------- (0..1) Professionnel

Utilisateur (1) -------- (N) Réservation

Utilisateur (1) -------- (N) Paiement

Utilisateur (1) -------- (N) Avis

---

# Cycle de vie

Créé

↓

Actif

↓

Suspendu

↓

Fermé

---

# Règles de gestion associées

- RG-CPT

---

# Objectif Business

L'utilisateur constitue le client principal de Chaweer.

Il représente toute personne utilisant la plateforme, qu'elle recherche un professionnel ou qu'elle exerce une activité juridique.

---

# Évolutions futures

## Version 2

- Utilisateur Entreprise

## Version 3

- Comptes multi-utilisateurs
- Gestion d'organisations

---

# Objet métier n°2 : Professionnel

> Version : V1

---

# Définition

Le professionnel représente un utilisateur habilité à proposer des prestations juridiques sur la plateforme Chaweer.

Il constitue le fournisseur de services de la marketplace.

Dans la Version 1, le seul type de professionnel pris en charge est **l'Avocat**.

---

# Rôle dans l'écosystème

Le professionnel met son expertise juridique à disposition des utilisateurs.

Il construit progressivement sa réputation grâce à la qualité de ses prestations et aux avis laissés par ses clients.

Le professionnel est au cœur du modèle économique de Chaweer.

---

# Responsable métier

Le professionnel est responsable :

- des informations de son profil professionnel ;
- des offres qu'il publie ;
- de son agenda ;
- de ses disponibilités.

Chaweer est responsable :

- de la publication de son profil ;
- du respect des règles de la plateforme ;
- de la suspension éventuelle du profil.

---

# Données métier

## Profession

- Profession
- Barreau
- Numéro d'inscription professionnelle

---

## Présentation

- Photo
- Biographie
- Années d'expérience

---

## Coordonnées professionnelles

- Ville
- Adresse professionnelle
- Nom du cabinet (facultatif)

---

## Expertise

- Domaines d'activité
- Langues parlées

---

## Vérification

- Statut de vérification

Dans la Version 1, aucun contrôle systématique n'est effectué par Chaweer.

La plateforme pourra suspendre un professionnel en cas de signalement ou d'anomalie.

Un système de vérification officielle sera introduit dans une version ultérieure.

---

# Capacités

Le professionnel peut :

- compléter son profil professionnel ;
- publier ses offres ;
- activer ou désactiver ses offres ;
- gérer son agenda ;
- bloquer des créneaux ;
- confirmer une réservation ;
- refuser une réservation ;
- proposer un autre créneau ;
- réaliser une consultation ;
- clôturer une consultation ;
- publier un compte rendu ;
- répondre à un avis.

---

# Relations

Le professionnel est obligatoirement associé à un utilisateur.

Il possède :

- plusieurs offres ;
- un agenda ;
- plusieurs réservations ;
- plusieurs consultations ;
- plusieurs avis.

Cardinalités

Utilisateur (1) -------- (0..1) Professionnel

Professionnel (1) -------- (N) Offre

Professionnel (1) -------- (1) Agenda

Professionnel (1) -------- (N) Réservation

Professionnel (1) -------- (N) Consultation

Professionnel (1) -------- (N) Avis

---

# Cycle de vie

Créé

↓

Profil complété

↓

Actif

↓

Suspendu

↓

Archivé

---

# Règles de gestion associées

- RG-PRO
- RG-OFR
- RG-AGD
- RG-RES
- RG-CNS
- RG-AVI

---

# Objectif Business

Le professionnel constitue le principal créateur de valeur de la plateforme.

Il commercialise ses prestations, réalise les consultations et construit progressivement sa réputation.

La qualité des professionnels référencés conditionne directement la confiance accordée à Chaweer.

---

# Évolutions futures

## Version 2

Le modèle sera étendu aux professions suivantes :

- Notaire
- Adoul
- Commissaire de justice
- Expert judiciaire
- Traducteur assermenté

Les professionnels pourront bénéficier :

- d'un badge de vérification ;
- d'un contrôle automatique de leur appartenance à leur ordre professionnel.

## Version 3

Le professionnel pourra être rattaché à :

- un cabinet ;
- une équipe ;
- un ou plusieurs collaborateurs ;
- un ou plusieurs assistants.

Des habilitations permettront de déléguer certaines actions, notamment :

- gestion de l'agenda ;
- confirmation des réservations ;
- suivi des consultations.

---

# Objet métier n°3 : Domaine d'activité

> Version : V1

---

# Définition

Le domaine d'activité représente un domaine d'expertise juridique dans lequel un professionnel exerce son activité.

Il permet de qualifier les compétences du professionnel et de faciliter la recherche des utilisateurs.

Les domaines d'activité constituent un référentiel métier administré par Chaweer.

---

# Rôle dans l'écosystème

Les domaines d'activité permettent :

- de décrire les compétences d'un professionnel ;
- de faciliter la recherche d'un professionnel ;
- de filtrer les résultats ;
- d'associer les offres à une expertise juridique ;
- d'améliorer la pertinence du classement.

Ils constituent un vocabulaire commun utilisé dans l'ensemble de la plateforme.

---

# Responsable métier

Le référentiel des domaines d'activité est administré exclusivement par Chaweer.

Le professionnel sélectionne un ou plusieurs domaines parmi ceux proposés.

Il ne peut pas créer de nouveaux domaines.

---

# Données métier

Chaque domaine d'activité possède notamment :

## Identification

- Nom
- Description

## Classification

- Catégorie juridique
- Ordre d'affichage

## Statut

- Actif
- Archivé

---

# Capacités

Chaweer peut :

- créer un domaine d'activité ;
- modifier sa description ;
- l'archiver ;
- le réactiver.

Le professionnel peut :

- sélectionner un ou plusieurs domaines ;
- retirer un domaine de son profil.

---

# Relations

Un domaine d'activité peut être associé à :

- plusieurs professionnels ;
- plusieurs offres.

Un professionnel peut être associé à plusieurs domaines d'activité.

Une offre est rattachée à un ou plusieurs domaines d'activité.

Cardinalités

Domaine (1) -------- (N) Professionnel

Domaine (1) -------- (N) Offre

Professionnel (N) -------- (N) Domaine

Offre (N) -------- (N) Domaine

---

# Cycle de vie

Créé

↓

Actif

↓

Archivé

---

# Règles de gestion associées

- RG-PRO
- RG-OFR

---

# Objectif Business

Les domaines d'activité permettent d'harmoniser la présentation des compétences des professionnels.

Ils garantissent une expérience de recherche homogène et facilitent la mise en relation entre les utilisateurs et les professionnels.

---

# Évolutions futures

Version 2

- Hiérarchie des domaines
- Sous-domaines
- Domaines recommandés automatiquement

Version 3

- Taxonomie multi-niveaux
- Compétences spécialisées
- Certifications par domaine

# Objet métier n°4 : Offre

> Version : V1

---

# Définition

L'offre représente une prestation juridique proposée par un professionnel sur la plateforme Chaweer.

Elle est créée à partir d'une prestation du catalogue officiel de Chaweer et personnalisée par le professionnel selon son activité.

L'offre constitue l'élément commercial visible par les utilisateurs et pouvant faire l'objet d'une réservation.

---

# Rôle dans l'écosystème

L'offre constitue le lien entre :

- le catalogue officiel des prestations ;
- le professionnel ;
- les utilisateurs.

Elle permet au professionnel de commercialiser ses prestations tout en garantissant une présentation homogène sur l'ensemble de la plateforme.

Une réservation est toujours effectuée sur une offre.

---

# Responsable métier

Le professionnel est responsable de ses offres.

Il définit notamment :

- les prestations qu'il souhaite proposer ;
- le prix ;
- la durée (si applicable) ;
- la description.

Chaweer est responsable du catalogue officiel des prestations.

Le professionnel ne peut pas créer librement de nouveaux types de prestations.

---

# Données métier

## Identification

- Titre
- Description

---

## Prestation

- Référence de la prestation du catalogue officiel

---

## Tarification

### Prestations à réservation directe

- Prix fixe

Exemple :

- Consultation vidéo

### Prestations sur devis

- Fourchette tarifaire indicative

Exemples :

- Analyse juridique
- Rédaction juridique

Le prix définitif est fixé lors de la proposition commerciale.

---

## Paramètres

- Durée (si applicable)
- Active
- Date de création
- Date d'archivage

---

## Domaine d'activité

Une offre est rattachée à un ou plusieurs domaines d'activité du professionnel.

---

# Capacités

Le professionnel peut :

- créer une offre ;
- activer une offre ;
- désactiver une offre ;
- archiver une offre ;
- modifier son prix ;
- modifier sa durée ;
- modifier sa description.

Les modifications s'appliquent uniquement aux nouvelles réservations.

---

# Relations

Une offre :

- appartient à un professionnel ;
- est basée sur une prestation du catalogue officiel ;
- est associée à un ou plusieurs domaines d'activité ;
- peut recevoir plusieurs réservations.

Cardinalités

Professionnel (1) -------- (N) Offre

Catalogue des prestations (1) -------- (N) Offre

Offre (N) -------- (N) Domaine d'activité

Offre (1) -------- (N) Réservation

---

# Cycle de vie

Créée

↓

Active

↓

Désactivée

↓

Archivée

Une offre archivée est conservée afin de préserver l'historique des réservations.

---

# Règles de gestion associées

- RG-OFR

---

# Objectif Business

L'offre permet au professionnel de commercialiser ses prestations de manière simple et homogène.

Elle garantit :

- une expérience utilisateur cohérente ;
- une comparaison facilitée entre professionnels ;
- une standardisation des prestations proposées sur Chaweer.

---

# Évolutions futures

## Version 2

Ajout des prestations sur devis :

- Analyse juridique
- Rédaction juridique

avec génération de propositions commerciales.

---

## Version 3

Ajout :

- Représentation devant les juridictions ;
- Prestations complexes ;
- Prestations multi-intervenants ;
- Options complémentaires ;
- Offres promotionnelles.

---

# Objet métier n°4 : Catalogue des prestations

> Version : V1

---

# Définition

Le catalogue des prestations constitue le référentiel officiel des prestations commercialisables sur Chaweer.

Il définit les prestations que les professionnels sont autorisés à proposer sur la plateforme.

Le catalogue est administré exclusivement par Chaweer.

---

# Rôle dans l'écosystème

Le catalogue garantit :

- une nomenclature unique des prestations ;
- une présentation homogène des offres ;
- une comparaison simple entre professionnels ;
- une évolution maîtrisée de la plateforme.

Les professionnels ne créent jamais librement un type de prestation.

Ils activent une prestation existante du catalogue.

---

# Responsable métier

Chaweer est seul responsable du catalogue.

Le professionnel peut uniquement :

- activer une prestation ;
- la personnaliser dans les limites autorisées.

---

# Données métier

Chaque prestation possède notamment :

## Identification

- Nom
- Description

---

## Catégorie

- Consultation
- Mission (Version 2)

---

## Type de réservation

- Réservation immédiate
- Sur devis

---

## Paramètres autorisés

- Durée configurable
- Prix fixe
- Fourchette tarifaire
- Compte rendu
- Agenda requis

---

## Disponibilité

- Active
- Archivée

---

# Prestations de la Version 1

## Consultation vidéo

Caractéristiques

- réservation directe
- prix fixe
- durée configurable

---

# Prestations prévues Version 2

## Analyse juridique

- sur devis

---

## Rédaction juridique

- sur devis

---

# Prestations prévues Version 3

## Représentation

- sur devis
- mission

---

# Capacités

Chaweer peut :

- créer une prestation ;
- modifier une prestation ;
- désactiver une prestation ;
- archiver une prestation.

Le professionnel peut :

- activer une prestation ;
- la configurer ;
- la désactiver.

---

# Relations

Une prestation du catalogue peut être utilisée par plusieurs professionnels.

Chaque offre est obligatoirement basée sur une prestation du catalogue.

Cardinalités

Catalogue (1)

↓

(N)

Offres

---

# Cycle de vie

Créée

↓

Active

↓

Archivée

---

# Règles de gestion associées

- RG-OFR

---

# Objectif Business

Le catalogue garantit une plateforme homogène.

Il évite :

- les doublons ;
- les intitulés incohérents ;
- les prestations fantaisistes.

Il permet également à Chaweer de faire évoluer progressivement les services proposés sans remettre en cause le modèle métier.

---

# Évolutions futures

Version 2

- Prestations sur devis

Version 3

- Prestations complexes
- Missions
- Packs de prestations
- Options

# Objet métier n°5 : Offre

> Version : V1

---

# Définition

L'offre représente la déclinaison commerciale d'une prestation du catalogue officiel proposée par un professionnel.

Elle permet au professionnel de commercialiser une prestation en définissant ses propres conditions d'exécution, dans les limites autorisées par Chaweer.

Une offre est toujours basée sur une prestation du catalogue officiel.

---

# Rôle dans l'écosystème

L'offre constitue le lien entre :

- le professionnel ;
- le catalogue officiel des prestations ;
- les réservations.

Elle représente l'élément visible par les utilisateurs lors de leur recherche.

Une réservation est toujours réalisée sur une offre.

---

# Responsable métier

Le professionnel est responsable de ses offres.

Il peut :

- activer une prestation du catalogue ;
- définir son prix ;
- définir la durée (si applicable) ;
- personnaliser sa description ;
- activer ou désactiver son offre.

Chaweer est responsable des caractéristiques de la prestation du catalogue.

---

# Données métier

## Identification

- Titre (généré à partir de la prestation)
- Description personnalisée

---

## Référence

- Prestation du catalogue

---

## Domaine(s) d'activité

Une offre est rattachée à un ou plusieurs domaines d'activité du professionnel.

---

## Conditions commerciales

### Tarification

Selon la prestation :

- Prix fixe
- Fourchette tarifaire

---

### Durée

Lorsque la prestation le permet :

- durée configurable

Exemple :

Consultation vidéo

30 min

45 min

60 min

---

## Disponibilité

- Active
- Désactivée
- Archivée

---

## Traçabilité

- Date de création
- Date de dernière modification
- Date d'archivage

---

# Capacités

Le professionnel peut :

- créer une offre ;
- modifier son prix ;
- modifier sa durée ;
- modifier sa description ;
- activer une offre ;
- désactiver une offre ;
- archiver une offre.

Les modifications n'impactent jamais les réservations déjà effectuées.

---

# Relations

Une offre :

- appartient à un professionnel ;
- référence une prestation du catalogue ;
- est associée à un ou plusieurs domaines d'activité ;
- peut être réservée plusieurs fois.

Cardinalités

Professionnel (1)
        │
        ▼
      Offre (N)

Catalogue des prestations (1)
        │
        ▼
      Offre (N)

Offre (N)
        │
        ▼
Domaine d'activité (N)

Offre (1)
        │
        ▼
Réservation (N)

---

# Cycle de vie

Créée

↓

Active

↓

Désactivée

↓

Archivée

Une offre archivée reste consultable dans les historiques mais n'est plus proposée aux utilisateurs.

---

# Règles de gestion associées

- RG-OFR

---

# Objectif Business

L'offre permet à chaque professionnel de personnaliser son activité commerciale tout en respectant le cadre défini par Chaweer.

Elle garantit :

- une présentation homogène ;
- une comparaison facilitée entre professionnels ;
- une gestion autonome des prestations proposées.

---

# Évolutions futures

## Version 2

Les offres pourront intégrer :

- délais d'exécution ;
- options complémentaires ;
- pièces justificatives demandées au client.

## Version 3

Les offres pourront proposer :

- packs de prestations ;
- prestations composées ;
- remises ;
- promotions ;
- prestations multi-intervenants.

# Objet métier n°6 : Agenda

> Version : V1

---

# Définition

L'agenda représente les disponibilités d'un professionnel sur la plateforme Chaweer.

Il permet de définir les périodes durant lesquelles le professionnel accepte de recevoir des réservations.

L'agenda constitue la source officielle des disponibilités du professionnel.

---

# Rôle dans l'écosystème

L'agenda permet :

- de publier les disponibilités du professionnel ;
- de calculer les créneaux réservables ;
- d'éviter les doubles réservations ;
- de gérer les indisponibilités.

Toutes les réservations sont effectuées à partir des disponibilités définies dans l'agenda.

---

# Responsable métier

Le professionnel est responsable de son agenda.

Il définit :

- ses horaires habituels ;
- ses périodes d'indisponibilité ;
- ses exceptions.

Chaweer calcule automatiquement les créneaux réservables.

---

# Données métier

## Planning hebdomadaire

Pour chaque jour :

- Heure de début
- Heure de fin

Exemple

Lundi

09h00 - 18h00

---

## Exceptions

Le professionnel peut définir :

- Congés
- Jours fériés
- Formation
- Absence exceptionnelle

---

## Paramètres de réservation

- Délai minimum avant réservation
- Délai maximum de réservation
- Temps de pause entre deux consultations
- Fuseau horaire

---

## Statut

- Actif
- Suspendu

---

# Capacités

Le professionnel peut :

- définir ses horaires ;
- modifier ses horaires ;
- bloquer une période ;
- débloquer une période ;
- suspendre temporairement son agenda.

---

# Relations

Un agenda appartient à un seul professionnel.

Il permet de générer plusieurs créneaux.

Il peut recevoir plusieurs réservations.

Cardinalités

Professionnel (1)

↓

Agenda (1)

Agenda (1)

↓

Créneau (N)

---

# Cycle de vie

Créé

↓

Actif

↓

Suspendu

↓

Archivé

---

# Règles de gestion associées

- RG-AGD

---

# Objectif Business

L'agenda permet au professionnel de gérer simplement ses disponibilités tout en garantissant la cohérence des réservations.

---

# Évolutions futures

Version 2

- Synchronisation Google Calendar

- Synchronisation Outlook

- Synchronisation Apple Calendar

Version 3

- Synchronisation multi-agendas

- Agenda partagé Cabinet

- Gestion des assistants

# Objet métier n°7 : Créneau

> Version : V1

---

# Définition

Le créneau représente une plage horaire réservable générée à partir des disponibilités de l'agenda.

Il constitue l'unité de réservation de Chaweer.

---

# Rôle dans l'écosystème

Le créneau permet :

- de proposer des horaires disponibles ;
- de recevoir une réservation ;
- de garantir qu'une même plage horaire ne peut être réservée qu'une seule fois.

---

# Responsable métier

Les créneaux sont générés automatiquement par Chaweer.

Le professionnel ne crée jamais un créneau manuellement.

Le professionnel agit uniquement sur son agenda.

---

# Données métier

- Date
- Heure de début
- Heure de fin
- Durée
- Disponibilité

---

# États

Disponible

Réservé

Bloqué

Expiré

---

# Capacités

Chaweer peut :

- générer les créneaux ;
- supprimer les créneaux devenus obsolètes ;
- bloquer un créneau ;
- réserver un créneau.

---

# Relations

Chaque créneau appartient à un agenda.

Un créneau peut être associé à une réservation.

Cardinalités

Agenda (1)

↓

Créneau (N)

Créneau (1)

↓

Réservation (0..1)

---

# Cycle de vie

Généré

↓

Disponible

↓

Réservé

↓

Terminé

ou

↓

Expiré

---

# Règles de gestion associées

- RG-AGD
- RG-RES

---

# Objectif Business

Le créneau constitue l'unité élémentaire permettant aux utilisateurs de réserver une consultation en toute sécurité.

---

# Évolutions futures

Version 2

- Créneaux récurrents

- Créneaux prioritaires

- Créneaux réservés aux clients Premium

# Objet métier n°8 : Réservation

> Version : V1

---

# Définition

La réservation représente la demande effectuée par un utilisateur afin de réserver une consultation auprès d'un professionnel.

Elle constitue le point de départ du processus de prestation.

Une réservation est toujours associée :

- à un utilisateur ;
- à un professionnel ;
- à une offre ;
- à un créneau.

---

# Rôle dans l'écosystème

La réservation coordonne l'ensemble du processus métier.

Elle permet :

- de réserver un créneau disponible ;
- d'obtenir la confirmation du professionnel ;
- de déclencher le paiement ;
- de créer la consultation.

Elle constitue le pivot entre :

- l'agenda ;
- le paiement ;
- la consultation.

---

# Responsable métier

La réservation est administrée par Chaweer.

Le demandeur peut :

- créer une réservation ;
- l'annuler selon les règles définies.

Le professionnel peut :

- confirmer ;
- refuser ;
- proposer un autre créneau.

---

# Données métier

## Identification

- Numéro de réservation

---

## Acteurs

- Utilisateur
- Professionnel

---

## Objet réservé

- Offre
- Créneau

---

## Informations commerciales

- Prix
- Durée

Ces informations sont figées au moment de la réservation.

Les modifications ultérieures de l'offre n'impactent jamais une réservation existante.

---

## Statut

- En attente de confirmation
- Confirmée
- Refusée
- En attente de paiement
- Payée
- Annulée
- Expirée
- Terminée

---

## Traçabilité

- Date de création
- Date de confirmation
- Date de paiement
- Date de clôture

---

# Capacités

Le demandeur peut :

- créer une réservation ;
- annuler une réservation selon la politique d'annulation.

Le professionnel peut :

- confirmer ;
- refuser ;
- proposer un nouveau créneau.

Chaweer peut :

- expirer automatiquement une réservation ;
- notifier les parties ;
- créer la consultation.

---

# Relations

Une réservation est associée à :

- un utilisateur ;
- un professionnel ;
- une offre ;
- un créneau ;
- un paiement ;
- une consultation.

---

Cardinalités

Utilisateur (1)
        │
        ▼
Réservation (N)

Professionnel (1)
        │
        ▼
Réservation (N)

Offre (1)
        │
        ▼
Réservation (N)

Créneau (1)
        │
        ▼
Réservation (0..1)

Réservation (1)
        │
        ├────────► Paiement (1)
        │
        └────────► Consultation (1)

---

# Cycle de vie

Créée

↓

En attente de confirmation

↓

Confirmée

↓

En attente de paiement

↓

Payée

↓

Consultation réalisée

↓

Terminée

Cas alternatifs

↓

Refusée

↓

Annulée

↓

Expirée

---

# Règles de gestion associées

- RG-RES
- RG-PAY

---

# Objectif Business

La réservation constitue le contrat de réservation entre un utilisateur et un professionnel.

Elle garantit la disponibilité du créneau réservé et assure la coordination de l'ensemble des étapes précédant la réalisation de la consultation.

---

# Évolutions futures

## Version 2

- Réservation de missions sur devis
- Réservation multi-prestations
- Validation automatique

## Version 3

- Réservations récurrentes
- Réservations pour cabinet
- Réservations multi-professionnels

## Objet métier n°9 : Consultation

> Version : V1

---

# Définition

La consultation représente la prestation juridique réalisée entre un utilisateur et un professionnel à la suite d'une réservation confirmée et payée.

Elle constitue l'exécution effective de la prestation.

Une consultation est toujours issue d'une réservation.

---

# Rôle dans l'écosystème

La consultation matérialise l'exécution de la prestation vendue.

Elle permet :

- la réalisation de l'échange entre le client et le professionnel ;
- la clôture de la prestation ;
- la rédaction éventuelle d'un compte rendu ;
- le dépôt d'un avis.

La consultation marque la fin du processus commercial.

---

# Responsable métier

Le professionnel est responsable du bon déroulement de la consultation.

Chaweer fournit les moyens techniques permettant sa réalisation.

---

# Données métier

## Identification

- Numéro de consultation

---

## Origine

- Réservation

---

## Participants

- Utilisateur
- Professionnel

---

## Informations

- Date
- Heure prévue
- Heure réelle de début
- Heure réelle de fin
- Durée prévue
- Durée réelle

---

## Mode de réalisation

Dans la Version 1

- Consultation vidéo

---

## Visioconférence

- Lien de connexion
- Date d'activation
- Salle d'attente

---

## Compte rendu

Le professionnel peut publier :

- un compte rendu
- une conclusion

Le compte rendu est facultatif.

Une fois publié, il ne peut plus être modifié.

---

## Statut

- Planifiée
- En attente
- En cours
- Terminée
- Annulée

---

# Capacités

Le professionnel peut :

- démarrer la consultation ;
- terminer la consultation ;
- publier un compte rendu.

L'utilisateur peut :

- rejoindre la consultation ;
- consulter le compte rendu.

Chaweer peut :

- générer le lien vidéo ;
- activer le lien une heure avant ;
- gérer la salle d'attente.

---

# Relations

Une consultation :

- provient d'une réservation ;
- est réalisée par un professionnel ;
- concerne un utilisateur ;
- peut donner lieu à un avis.

Cardinalités

Réservation (1)

↓

Consultation (1)

Consultation (1)

↓

Avis (0..1)

---

# Cycle de vie

Créée

↓

Planifiée

↓

En attente

↓

En cours

↓

Terminée

Cas alternatifs

↓

Annulée

---

# Règles de gestion associées

- RG-CNS
- RG-AVI

---

# Objectif Business

La consultation constitue la prestation effectivement réalisée entre un professionnel et un utilisateur.

Elle représente la finalité de l'ensemble du processus de réservation.

---

# Évolutions futures

Version 2

- Consultation téléphonique
- Consultation présentielle

Version 3

- Consultation collaborative
- Partage de documents
- Signature électronique
- Enregistrement (si autorisé)

# Objet métier n°10 : Paiement

> Version : V1

---

# Définition

Le paiement représente la transaction financière réalisée par un utilisateur afin de confirmer une réservation.

Il garantit la sécurisation de la prestation avant sa réalisation.

---

# Rôle dans l'écosystème

Le paiement intervient après la confirmation de la réservation par le professionnel.

Il déclenche la validation définitive de la réservation.

Le paiement constitue également le point de départ du reversement au professionnel.

---

# Responsable métier

Chaweer est responsable de la gestion du paiement.

Le professionnel est responsable de la facturation de sa prestation.

---

# Données métier

## Identification

- Référence de paiement

---

## Montant

- Montant payé
- Devise (MAD)

---

## Moyen de paiement

- Carte bancaire

(V1)

---

## Statut

- En attente
- Réussi
- Échoué
- Remboursé

---

## Reversement

- Date de reversement
- Statut du reversement

---

# Capacités

Chaweer peut :

- encaisser un paiement ;
- rembourser un paiement ;
- reverser les fonds ;
- générer un reçu.

Le professionnel :

- émet la facture.

---

# Relations

Le paiement appartient à une réservation.

Cardinalités

Réservation (1)

↓

Paiement (1)

---

# Cycle de vie

Créé

↓

Réussi

↓

Reversé

ou

↓

Remboursé

---

# Règles de gestion associées

- RG-PAY

---

# Objectif Business

Le paiement sécurise les échanges financiers entre l'utilisateur et le professionnel.

Il garantit le respect des engagements de chaque partie.

---

# Évolutions futures

Version 2

- Paiement en plusieurs fois

- Wallet

Version 3

- Paiement entreprise

- Paiement international

# Objet métier n°11 : Avis

> Version : V1

---

# Définition

L'avis représente l'évaluation laissée par un utilisateur à l'issue d'une consultation réalisée.

Il contribue à la réputation du professionnel.

---

# Rôle dans l'écosystème

L'avis permet :

- d'informer les futurs utilisateurs ;
- d'améliorer la confiance ;
- d'alimenter le score de réputation.

---

# Responsable métier

L'utilisateur est responsable de son avis.

Chaweer est responsable de sa modération.

Le professionnel peut y répondre.

---

# Données métier

## Évaluation

- Note (1 à 5 étoiles)

---

## Commentaire

- Texte libre

---

## Auteur

Affichage :

Prénom + initiale

Exemple

Ahmed B.

---

## Réponse du professionnel

Une seule réponse.

---

## Statut

- Publié
- Signalé
- Retiré

---

# Capacités

L'utilisateur peut :

- publier un avis.

Le professionnel peut :

- répondre.

Chaweer peut :

- retirer un avis.

---

# Relations

Un avis est lié à :

- une consultation ;
- un utilisateur ;
- un professionnel.

Une consultation ne peut avoir qu'un seul avis.

---

# Cycle de vie

Publié

↓

Signalé (optionnel)

↓

Retiré (optionnel)

---

# Règles de gestion associées

- RG-AVI

---

# Objectif Business

Les avis renforcent la transparence et la confiance entre les utilisateurs et les professionnels.

Ils constituent l'un des principaux facteurs de réputation.

---

# Évolutions futures

Version 2

- Critères détaillés

Version 3

- Réputation IA

- Analyse sémantique

- Détection automatique des abus