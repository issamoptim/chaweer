# US-021 – Consulter Mon Profil

**Sprint :** Sprint 02  
**Module :** Gestion des Comptes – Grand Public  
**Priorité :** Haute  
**Acteur principal :** Utilisateur Grand Public

---

# 1. Objectif

Permettre à un utilisateur Grand Public authentifié de consulter les informations de son profil personnel ainsi que certains paramètres de son compte.

Cette fonctionnalité est exclusivement destinée au profil **Grand Public**. Les informations propres aux Professionnels sont couvertes par les User Stories **US-023** à **US-025**.

---

# 2. Acteurs

- Utilisateur Grand Public authentifié

---

# 3. Préconditions

- L'utilisateur est authentifié.
- Le compte n'est pas supprimé.
- Le compte n'est pas désactivé.

---

# 4. Déclencheur

L'utilisateur sélectionne **Mon Profil** depuis le menu de l'application.

---

# 5. Parcours principal

1. L'utilisateur ouvre son profil.
2. Le système récupère les informations du compte.
3. Le système affiche les informations personnelles.
4. Le système affiche les paramètres disponibles.
5. L'utilisateur consulte les informations.

> Cette User Story est uniquement en consultation. Aucune modification n'est réalisée.

---

# 6. Informations affichées

## 6.1 Informations personnelles

| Champ | Affichage |
|--------|-----------|
| Nom | Oui |
| Prénom | Oui |
| Email | Oui |
| Téléphone | Oui si renseigné |
| Pays | Oui |
| Ville | Oui si renseignée |
| Nationalité | Oui si renseignée |
| Langue | Oui |

---

## 6.2 Photo de profil

Aucune photo de profil n'est gérée.

Le profil Grand Public ne possède pas d'avatar.

---

## 6.3 Langue

La langue est détectée automatiquement lors de la première utilisation à partir de la langue du navigateur.

Langues supportées :

- Français
- العربية
- English

La langue actuellement utilisée est affichée.

---

## 6.4 Fuseau horaire

Le fuseau horaire de l'application est fixé à :

**Africa/Casablanca**

Il n'est pas affiché comme paramètre configurable.

---

## 6.5 Préférences de notifications

Le profil affiche les préférences de notifications.

Canaux disponibles :

- Emails
- Notifications Push
- SMS *(fonctionnalité prévue pour une version future)*

Chaque canal possède un état :

- Activé
- Désactivé

Les notifications de sécurité ne sont pas concernées par ces préférences.

---

## 6.6 Suppression du compte

Le profil affiche l'action :

**Supprimer mon compte**

Son comportement est défini dans **ADR-004 – Suppression des Comptes Utilisateurs**.

---

# 7. Règles métier

### RB-021-001

Le profil Grand Public ne contient aucune information professionnelle.

---

### RB-021-002

Le nom est optionnel.

---

### RB-021-003

Le prénom est optionnel.

---

### RB-021-004

L'adresse email est affichée.

- Si l'inscription est réalisée par email, cet email constitue l'identifiant de connexion.
- Si l'inscription est réalisée via Google, l'email Google constitue l'identifiant d'authentification.

---

### RB-021-005

Le téléphone est affiché uniquement lorsqu'il est renseigné.

Si, dans une version future, l'inscription par téléphone est activée :

- le numéro d'authentification est stocké en base de données ;
- il n'est pas affiché dans le profil ;
- il ne peut pas être modifié par l'utilisateur.

---

### RB-021-006

Le pays est affiché.

Valeur par défaut :

**Maroc**

---

### RB-021-007

La ville est affichée uniquement lorsqu'elle est renseignée.

---

### RB-021-008

La nationalité est affichée uniquement lorsqu'elle est renseignée.

---

### RB-021-009

Aucune photo de profil n'est gérée.

---

### RB-021-010

La langue affichée correspond à la langue actuellement utilisée par l'application.

---

### RB-021-011

Le fuseau horaire utilisé est toujours **Africa/Casablanca**.

---

### RB-021-012

Les préférences de notifications affichent indépendamment l'état de chaque canal.

---

### RB-021-013

Les notifications de sécurité restent obligatoires indépendamment des préférences utilisateur.

---

### RB-021-014

Le profil permet d'accéder à la suppression du compte conformément à **ADR-004**.

---

### RB-021-015

Aucun historique des connexions n'est affiché.

---

### RB-021-016

Aucun choix de thème n'est proposé.

La charte graphique officielle de Chaweer est appliquée à tous les utilisateurs.

---

# 8. Cas alternatifs

## CA-021-001 — Téléphone absent

Le téléphone n'est pas affiché.

---

## CA-021-002 — Ville absente

La ville n'est pas affichée.

---

## CA-021-003 — Nationalité absente

La nationalité n'est pas affichée.

---

## CA-021-004 — Notifications SMS indisponibles

Le canal SMS sera affiché uniquement lorsque cette fonctionnalité sera disponible.

---

# 9. Cas d'erreur

## CE-021-001 — Utilisateur non authentifié

Le système refuse l'accès.

L'utilisateur est redirigé vers la page de connexion.

---

## CE-021-002 — Compte supprimé

L'accès est refusé conformément à **ADR-004**.

---

# 10. Critères d'acceptation

- Le profil affiche uniquement les informations du Grand Public.
- Aucune information professionnelle n'est visible.
- Aucun avatar n'est affiché.
- Les informations optionnelles ne sont affichées que lorsqu'elles sont renseignées.
- La langue actuellement utilisée est affichée.
- Les préférences de notifications sont visibles.
- Le fuseau horaire n'est pas configurable.
- Aucun historique des connexions n'est affiché.
- Aucun thème n'est configurable.
- L'utilisateur peut accéder à l'action **Supprimer mon compte** conformément à **ADR-004**.
```