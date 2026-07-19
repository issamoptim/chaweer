---
title: US-015 — Identity & Profile REST API
id: US-015
epic: EP-Identity
priority: Critical
status: Validé
owner: Product Team
module: Identity & Profile
depends_on:
  - US-014 Backend Architecture
next:
  - US-016 Database Design
---

# US-015 — Identity & Profile REST API

## Sprint

Sprint 02 — Identity & Profile

---

# 1. Objectif

Cette User Story définit les principes de conception des API REST du domaine **Identity & Profile**.

Elle décrit les conventions utilisées par le backend pour exposer les fonctionnalités du domaine aux différents clients.

Les API constituent le contrat officiel entre le backend et les consommateurs de services.

---

# 2. Vision

Le backend est développé selon une approche **API First**.

Les API sont conçues avant leur implémentation.

Tous les clients utilisent les mêmes API :

- Application Web ;
- Application Mobile iOS ;
- Application Mobile Android ;
- Back-office ;
- Services internes ;
- Intégrations partenaires.

Les API sont indépendantes des interfaces utilisateur.

---

# 3. Objectifs des API

Les API doivent être :

- cohérentes ;
- prévisibles ;
- versionnées ;
- documentées ;
- sécurisées ;
- facilement consommables ;
- indépendantes des technologies clientes.

---

# 4. Principes REST

Les API respectent les principes REST.

Chaque ressource possède une URI unique.

Les opérations utilisent les verbes HTTP standards.

| Verbe | Utilisation |
|--------|-------------|
| GET | Lecture |
| POST | Création |
| PUT | Remplacement |
| PATCH | Modification partielle |
| DELETE | Suppression logique lorsque le domaine l'autorise |

---

# 5. Ressources

Le domaine Identity & Profile expose notamment les ressources suivantes :

- Accounts
- Profiles
- Professional Profiles
- Identity Providers

Chaque ressource possède son propre cycle de vie et ses propres règles métier.

---

# 6. Versionnement

Toutes les API sont versionnées.

Exemple :

```
/api/v1/
```

Une nouvelle version majeure ne modifie jamais le comportement d'une version existante.

Les versions précédentes restent supportées durant leur période de compatibilité.

---

# 7. Convention des URI

Les URI utilisent :

- des noms au pluriel ;
- des noms explicites ;
- des ressources plutôt que des actions.

Exemples :

```
/api/v1/profiles

/api/v1/professional-profiles

/api/v1/accounts

/api/v1/identity-providers
```

Les URI ne doivent jamais contenir de logique métier.

# 8. Structure des endpoints

Les endpoints représentent les points d'entrée du backend.

Chaque endpoint correspond à un **Use Case** de la couche Application.

Un endpoint ne contient jamais de logique métier.

Son rôle est de :

- recevoir la requête HTTP ;
- valider le format des données ;
- appeler le Use Case correspondant ;
- retourner une réponse HTTP.

---

# 9. Mapping API → Use Cases

Chaque endpoint est associé à un unique Use Case.

Exemples :

| Endpoint | Use Case |
|----------|----------|
| POST /accounts | RegisterWithEmail |
| POST /accounts/google | RegisterWithGoogle |
| POST /accounts/phone | RegisterWithPhoneNumber |
| POST /identity-providers | LinkIdentityProvider |
| DELETE /identity-providers/{id} | UnlinkIdentityProvider |
| GET /profiles/me | GetCurrentUser |
| PATCH /profiles/me | UpdateProfile |
| POST /professional-profiles | BecomeProfessional |
| PATCH /professional-profiles/me | UpdateProfessionalProfile |
| POST /professional-profiles/me/publish | PublishProfessionalProfile |
| POST /professional-profiles/me/hide | HideProfessionalProfile |
| POST /professional-profiles/me/archive | ArchiveProfessionalProfile |

---

# 10. DTO (Data Transfer Objects)

Les DTO représentent les données échangées entre les clients et le backend.

Ils sont spécifiques à la couche Presentation.

Ils ne font jamais partie du Domain Model.

Deux catégories sont utilisées :

## Request DTO

Contiennent les données envoyées par le client.

Exemples :

- RegisterWithEmailRequest
- UpdateProfileRequest
- BecomeProfessionalRequest

---

## Response DTO

Contiennent les données renvoyées au client.

Exemples :

- ProfileResponse
- ProfessionalProfileResponse
- IdentityProviderResponse

---

Les DTO ne contiennent :

- aucune règle métier ;
- aucune logique métier ;
- aucun comportement.

Ils servent uniquement au transport des données.

---

# 11. Pagination

Toutes les collections doivent être paginées.

La pagination garantit :

- de bonnes performances ;
- une consommation réseau maîtrisée ;
- une expérience utilisateur fluide.

Paramètres standards :

```
?page=1

&pageSize=20
```

Le backend applique une taille maximale configurable afin d'éviter les requêtes excessives.

---

# 12. Tri

Les ressources peuvent être triées.

Exemple :

```
?sort=lastName

?sort=createdAt

?sort=rating
```

L'ordre est précisé via :

```
asc

desc
```

Exemple :

```
?sort=createdAt&order=desc
```

---

# 13. Filtres

Les ressources peuvent être filtrées selon leurs propriétés métier.

Exemples :

```
?city=Casablanca

?specialty=FamilyLaw

?language=French

?published=true
```

Les filtres disponibles sont définis par chaque domaine métier.

---

# 14. Recherche

Les ressources peuvent exposer une recherche textuelle.

Exemple :

```
?q=immobilier
```

La recherche est indépendante des filtres et peut être combinée avec :

- pagination ;
- tri ;
- critères métier.

---

# 15. Format des dates

Toutes les dates sont exprimées au format **ISO 8601** en UTC.

Exemple :

```text
2026-07-17T14:35:42Z
```

Le backend est responsable de la gestion des fuseaux horaires.

Les applications clientes convertissent ensuite les dates dans le fuseau de l'utilisateur.

# 16. Authentification

Les API sont protégées selon le niveau d'accès requis.

Les mécanismes d'authentification sont définis dans le domaine **Security**, mais les API doivent être conçues pour les supporter.

Les principaux modes d'accès sont :

- accès public ;
- utilisateur authentifié ;
- professionnel authentifié ;
- administrateur.

L'identité de l'utilisateur est déterminée avant l'exécution du Use Case.

---

# 17. Autorisation

L'autorisation est contrôlée par le backend.

Chaque Use Case vérifie que l'utilisateur possède les droits nécessaires.

Les applications clientes ne décident jamais des permissions.

Exemples :

- un utilisateur peut modifier son propre Profile ;
- un professionnel peut modifier son ProfessionalProfile ;
- un administrateur peut suspendre ou bannir un utilisateur.

---

# 18. Codes HTTP

Les API utilisent les codes HTTP standards.

| Code | Signification |
|-------|---------------|
| 200 OK | Requête réussie |
| 201 Created | Ressource créée |
| 204 No Content | Succès sans contenu |
| 400 Bad Request | Requête invalide |
| 401 Unauthorized | Authentification requise |
| 403 Forbidden | Accès refusé |
| 404 Not Found | Ressource introuvable |
| 409 Conflict | Conflit métier |
| 422 Unprocessable Entity | Données valides mais règle métier non respectée |
| 429 Too Many Requests | Limite de requêtes dépassée |
| 500 Internal Server Error | Erreur interne |

Le backend utilise le code HTTP le plus représentatif de la situation rencontrée.

---

# 19. Format des réponses

Toutes les API retournent un format de réponse cohérent.

## Succès

```json
{
  "data": {
    ...
  },
  "meta": {
    ...
  }
}
```

Le champ `meta` est optionnel et peut contenir :

- pagination ;
- informations de version ;
- nombre total d'éléments ;
- liens de navigation.

---

## Erreur

```json
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile not found."
  }
}
```

Chaque erreur possède :

- un code stable destiné aux clients ;
- un message lisible ;
- un statut HTTP approprié.

Les clients ne doivent jamais interpréter les messages textuels ; ils doivent s'appuyer sur le code d'erreur.

---

# 20. Validation des requêtes

La validation est réalisée en deux niveaux.

## Validation technique

Effectuée dans la couche Presentation.

Elle vérifie notamment :

- les champs obligatoires ;
- le format des données ;
- les types ;
- les contraintes de longueur ;
- les formats (email, téléphone, UUID, etc.).

Une requête invalide n'atteint jamais la couche Domain.

---

## Validation métier

Effectuée dans le Domain.

Elle vérifie les règles fonctionnelles, par exemple :

- unicité d'un IdentityProvider ;
- existence d'un Account ;
- respect des critères de publication ;
- invariants des Aggregate Roots.

Les règles métier ne sont jamais implémentées dans les DTO ou les Controllers.

---

# 21. Idempotence

Les opérations doivent être conçues pour éviter les effets de bord lors des répétitions involontaires.

En particulier :

- les opérations de lecture sont naturellement idempotentes ;
- les opérations de mise à jour doivent produire le même résultat si elles sont rejouées avec les mêmes données ;
- les opérations de création sensibles (par exemple après une perte réseau) pourront s'appuyer sur des mécanismes d'idempotence définis par le domaine Security et l'infrastructure.

Cette approche améliore la fiabilité des échanges entre le backend et les clients Web ou Mobile.

---

# 22. Compatibilité ascendante

L'évolution des API ne doit pas casser les applications existantes.

Les principes suivants s'appliquent :

- les nouvelles propriétés sont ajoutées de manière compatible ;
- les propriétés existantes ne changent pas de signification ;
- les suppressions nécessitent une nouvelle version majeure ;
- les comportements existants restent stables pendant toute la durée de vie de la version de l'API.

Ces règles garantissent une évolution progressive des applications Web, Mobile et des intégrations externes.

# 23. Documentation des API

Toutes les API REST doivent être documentées de manière centralisée.

La documentation constitue le contrat officiel entre le backend et les consommateurs.

Elle doit décrire notamment :

- les ressources exposées ;
- les endpoints disponibles ;
- les paramètres ;
- les Request DTO ;
- les Response DTO ;
- les codes HTTP ;
- les erreurs possibles ;
- les mécanismes d'authentification.

La documentation doit être générée automatiquement à partir du code lorsque cela est possible.

---

# 24. Évolutivité

Les API sont conçues pour évoluer sans casser les clients existants.

Les principes suivants s'appliquent :

- ajouter de nouveaux endpoints sans modifier les existants ;
- enrichir les Response DTO de manière compatible ;
- introduire de nouveaux paramètres optionnels ;
- versionner les changements incompatibles ;
- conserver des conventions homogènes dans l'ensemble de la plateforme.

Cette approche permet une évolution continue des applications Web et Mobile.

---

# 25. Performances

Les API doivent être optimisées pour limiter les échanges réseau.

Les principes suivants sont appliqués :

- pagination systématique des collections ;
- sélection ciblée des données retournées ;
- limitation des requêtes coûteuses ;
- optimisation des temps de réponse ;
- réduction du volume des payloads.

Les Response DTO doivent contenir uniquement les informations nécessaires au client.

---

# 26. Observabilité

Chaque appel API doit pouvoir être observé et diagnostiqué.

Le backend doit permettre :

- la journalisation des requêtes ;
- la traçabilité des erreurs ;
- le suivi des performances ;
- la corrélation des requêtes via un identifiant unique ;
- la mesure des indicateurs techniques (latence, taux d'erreur, débit, etc.).

Ces mécanismes facilitent l'exploitation et le support de la plateforme.

---

# 27. Règles de conception

Les API REST respectent les principes suivants :

- une ressource représente un concept métier ;
- un endpoint correspond à un Use Case ;
- les URI représentent des ressources et non des actions métier ;
- les Request DTO et Response DTO sont indépendants du Domain Model ;
- les validations techniques sont réalisées avant l'appel du Use Case ;
- les règles métier sont exécutées exclusivement dans le Domain ;
- les réponses utilisent des formats cohérents sur l'ensemble des modules ;
- les codes HTTP reflètent le résultat réel de l'opération ;
- les API sont indépendantes des interfaces clientes ;
- les API sont conçues selon une approche **API First** et **Multi-clients**.

---

# 28. Hors périmètre

Cette User Story ne décrit pas :

- l'implémentation des Controllers ;
- les Middlewares ;
- la configuration Express ou NestJS ;
- les stratégies JWT ;
- OAuth 2.0 ;
- OpenID Connect ;
- MFA ;
- la persistance des données ;
- Prisma ;
- PostgreSQL ;
- les composants Frontend Web ;
- les composants Mobile ;
- les tests d'intégration.

Ces éléments seront détaillés dans les User Stories correspondantes.

---

# 29. Résultat attendu

À l'issue de cette User Story, les principes de conception des API REST du domaine **Identity & Profile** sont entièrement définis.

Les conventions d'URI, les ressources, les DTO, les mécanismes de pagination, les filtres, les réponses HTTP, les validations, les règles d'évolution et les principes d'architecture constituent un contrat unique entre le backend et l'ensemble des clients.

Cette User Story sert de référence pour :

- **US-016 — Database Design**
- **US-017 — Frontend Architecture**
- **US-018 — Security**
- **US-019 — Testing Strategy**

Toute implémentation des API REST devra respecter les conventions définies dans ce document afin de garantir la cohérence, la stabilité et la pérennité de la plateforme Chaweer.