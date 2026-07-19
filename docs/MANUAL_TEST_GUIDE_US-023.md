# US-023 — Sécurité du compte : Guide de test manuel

Ce guide est destiné au Product Owner pour valider manuellement la fonctionnalité "Sécurité du compte" avant la mise en production.

---

## 1. Préparation de l'environnement

### 1.1 Démarrer le backend (API)

```bash
cd apps/api
npm run dev
```

L'API démarre sur **http://localhost:3000**.

Vérifier que l'API est en ligne : ouvrez **http://localhost:3000/health** dans votre navigateur. Vous devez voir :

```json
{ "success": true, "data": { "status": "ok", "service": "chaweer-api" } }
```

### 1.2 Démarrer le frontend (Web)

```bash
cd apps/web
npm run dev
```

Le frontend démarre sur **http://localhost:5173**.

### 1.3 Variables d'environnement requises

Le backend nécessite un fichier `.env` dans `apps/api/` avec les variables suivantes (déjà configurées dans l'environnement de développement) :

| Variable | Valeur (développement) | Rôle |
|---|---|---|
| `PORT` | `3000` | Port de l'API |
| `DATABASE_URL` | URL de connexion PostgreSQL | Base de données |
| `JWT_SECRET` | (secret, min. 32 caractères) | Signature des tokens JWT |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth | Connexion Google |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth | Connexion Google |
| `CORS_ORIGINS` | `http://localhost:5173` | Origines autorisées |

Aucune variable supplémentaire n'est nécessaire pour tester US-023.

### 1.4 Comptes de test

#### Compte LOCAL (e-mail + mot de passe)

Si vous n'avez pas déjà un compte LOCAL actif :

1. Allez sur **http://localhost:5173/inscription**
2. Remplissez le formulaire d'inscription (prénom, nom, e-mail, mot de passe)
3. Le mot de passe doit contenir : **8 caractères minimum, une majuscule, une minuscule, un chiffre** (ex: `Test1234!`)
4. Si l'application nécessite une vérification e-mail, vérifiez votre boîte de réception
5. Une fois le compte vérifié/actif, connectez-vous sur **http://localhost:5173/connexion**

> **Note** : Pour les tests de changement de mot de passe, notez bien le mot de passe que vous avez choisi lors de l'inscription. Vous en aurez besoin pour le champ "Mot de passe actuel".

#### Compte GOOGLE

1. Allez sur **http://localhost:5173/connexion**
2. Cliquez sur le bouton "Se connecter avec Google"
3. Authentifiez-vous avec un compte Google
4. Vous êtes redirigé vers l'application, connecté

> Si vous n'avez pas de compte Google de test, vous pouvez utiliser n'importe quel compte Google personnel. L'application créera automatiquement un compte avec le statut `ACTIVE` et `authProvider = GOOGLE`.

---

## 2. Informations du compte

### 2.1 L'e-mail est affiché correctement

- **Objectif** : Vérifier que l'adresse e-mail de l'utilisateur connecté s'affiche sur la page Sécurité.

- **Préconditions** :
  - Le backend et le frontend sont démarrés
  - Vous êtes connecté avec un compte LOCAL

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Regardez la section "Compte" en haut de la page

- **Résultat UI attendu** :
  - La page affiche un titre "Sécurité" avec le sous-titre "Gérez les accès et la protection de votre compte."
  - La section "Compte" affiche votre adresse e-mail dans le champ "Adresse e-mail"
  - L'e-mail affiché correspond exactement à l'e-mail du compte connecté

- **Résultat API attendu** :
  - `GET /auth/me` retourne `200` avec `{ success: true, data: { ..., email: "votre@email.com", authProvider: "LOCAL" } }`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 2.2 Le fournisseur d'authentification est affiché correctement

- **Objectif** : Vérifier que la méthode de connexion s'affiche correctement selon le type de compte.

- **Préconditions** :
  - Le backend et le frontend sont démarrés

- **Étapes** :
  1. Connectez-vous avec un compte LOCAL
  2. Naviguez vers **http://localhost:5173/mon-compte/securite**
  3. Regardez le champ "Méthode de connexion" dans la section "Compte"
  4. Déconnectez-vous
  5. Connectez-vous avec un compte GOOGLE
  6. Naviguez vers **http://localhost:5173/mon-compte/securite**
  7. Regardez le champ "Méthode de connexion"

- **Résultat UI attendu** :
  - **Compte LOCAL** : Un badge gris avec le texte "E-mail et mot de passe"
  - **Compte GOOGLE** : Un badge vert/teal avec le texte "Google"

- **Résultat API attendu** :
  - `GET /auth/me` retourne `authProvider: "LOCAL"` pour un compte local
  - `GET /auth/me` retourne `authProvider: "GOOGLE"` pour un compte Google

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 3. Changement de mot de passe

> **Important** : Les tests suivants nécessitent un compte LOCAL. Si vous utilisez un compte Google, passez à la section 3.6.

### 3.1 Changement de mot de passe réussi

- **Objectif** : Vérifier qu'un utilisateur LOCAL peut changer son mot de passe avec des informations valides.

- **Préconditions** :
  - Connecté avec un compte LOCAL
  - Vous connaissez votre mot de passe actuel

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Dans la section "Mot de passe", remplissez :
     - **Mot de passe actuel** : votre mot de passe actuel
     - **Nouveau mot de passe** : un nouveau mot de passe valide (ex: `NouveauMdp1!`)
     - **Confirmer le nouveau mot de passe** : le même nouveau mot de passe
  3. Cliquez sur "Modifier le mot de passe"

- **Résultat UI attendu** :
  - Le bouton affiche "Modification…" avec un spinner pendant la requête
  - Un message de succès (toast) vert apparaît : "Votre mot de passe a été modifié."
  - Les trois champs sont vidés après le succès

- **Résultat API attendu** :
  - `PATCH /auth/password` retourne `200` avec `{ success: true, data: { message: "Votre mot de passe a été modifié." } }`

- **Résultat base de données attendu** :
  - Le champ `passwordHash` de l'utilisateur est mis à jour avec le hash du nouveau mot de passe

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.2 Mot de passe actuel incorrect

- **Objectif** : Vérifier qu'une erreur s'affiche quand le mot de passe actuel est incorrect.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Remplissez :
     - **Mot de passe actuel** : un mot de passe volontairement erroné (ex: `WrongPass1!`)
     - **Nouveau mot de passe** : `NouveauMdp1!`
     - **Confirmer le nouveau mot de passe** : `NouveauMdp1!`
  3. Cliquez sur "Modifier le mot de passe"

- **Résultat UI attendu** :
  - Un message d'erreur (toast) rouge apparaît : "Le mot de passe actuel est incorrect."
  - Les champs ne sont pas vidés

- **Résultat API attendu** :
  - `PATCH /auth/password` retourne `401` avec `{ success: false, error: { code: "INVALID_CREDENTIALS", message: "Le mot de passe actuel est incorrect." } }`

- **Résultat base de données attendu** :
  - Aucune modification — le `passwordHash` reste inchangé

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.3 Nouveau mot de passe trop faible

- **Objectif** : Vérifier que la validation empêche les mots de passe faibles.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Remplissez :
     - **Mot de passe actuel** : votre mot de passe actuel
     - **Nouveau mot de passe** : `court1` (trop court, pas de majuscule)
     - **Confirmer le nouveau mot de passe** : `court1`
  3. Cliquez sur "Modifier le mot de passe"

- **Résultat UI attendu** :
  - Un message d'erreur rouge apparaît sous le champ "Nouveau mot de passe" : "Le mot de passe doit contenir au moins 8 caractères."
  - La soumission est bloquée (pas de requête API)

- **Résultat API attendu** :
  - Aucune requête n'est envoyée (validation côté client)

- **Résultat base de données attendu** :
  - Aucune modification

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.4 Les mots de passe ne correspondent pas

- **Objectif** : Vérifier que la validation détecte une non-correspondance entre le nouveau mot de passe et sa confirmation.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Remplissez :
     - **Mot de passe actuel** : votre mot de passe actuel
     - **Nouveau mot de passe** : `NouveauMdp1!`
     - **Confirmer le nouveau mot de passe** : `DifferentMdp2!`
  3. Cliquez sur "Modifier le mot de passe"

- **Résultat UI attendu** :
  - Un message d'erreur rouge apparaît sous le champ "Confirmer le nouveau mot de passe" : "Les mots de passe ne correspondent pas."
  - La soumission est bloquée (pas de requête API)

- **Résultat API attendu** :
  - Aucune requête n'est envoyée (validation côté client)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.5 Le nouveau mot de passe est identique au mot de passe actuel

- **Objectif** : Vérifier que le système refuse un nouveau mot de passe identique au mot de passe actuel.

- **Préconditions** :
  - Connecté avec un compte LOCAL
  - Vous connaissez votre mot de passe actuel

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Remplissez les trois champs avec votre mot de passe actuel (identique dans les trois)
  3. Cliquez sur "Modifier le mot de passe"

- **Résultat UI attendu** :
  - Un message d'erreur (toast) rouge apparaît : "Le nouveau mot de passe doit être différent du mot de passe actuel."
  - Les champs ne sont pas vidés

- **Résultat API attendu** :
  - `PATCH /auth/password` retourne `422` avec `{ success: false, error: { code: "VALIDATION_ERROR", message: "Le nouveau mot de passe doit être différent du mot de passe actuel." } }`

- **Résultat base de données attendu** :
  - Aucune modification — le `passwordHash` reste inchangé

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.6 Un compte Google ne peut pas changer de mot de passe

- **Objectif** : Vérifier qu'un utilisateur Google voit un message d'information au lieu du formulaire de changement de mot de passe.

- **Préconditions** :
  - Connecté avec un compte GOOGLE

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Regardez la section "Mot de passe"

- **Résultat UI attendu** :
  - Le formulaire de changement de mot de passe **n'est pas affiché**
  - À la place, un encadré d'information avec le logo Google affiche :
    - Titre : "Votre mot de passe est géré par Google"
    - Texte : "Vous êtes connecté via Google. Votre mot de passe est géré par votre compte Google. Vous pouvez le modifier sur myaccount.google.com."
    - Le lien "myaccount.google.com" pointe vers `https://myaccount.google.com/security` et s'ouvre dans un nouvel onglet

- **Résultat API attendu** :
  - Aucune requête de changement de mot de passe n'est possible

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.7 La connexion fonctionne avec le nouveau mot de passe

- **Objectif** : Vérifier qu'après un changement de mot de passe, la connexion réussit avec le nouveau mot de passe.

- **Préconditions** :
  - Vous avez réussi le test 3.1 (changement de mot de passe)
  - Vous connaissez le nouveau mot de passe

- **Étapes** :
  1. Déconnectez-vous (bouton dans l'en-tête)
  2. Naviguez vers **http://localhost:5173/connexion**
  3. Saisissez votre e-mail et le **nouveau** mot de passe
  4. Cliquez sur "Se connecter"

- **Résultat UI attendu** :
  - La connexion réussit
  - Vous êtes redirigé vers la page d'accueil ou la page de profil

- **Résultat API attendu** :
  - `POST /auth/login` retourne `200` avec un `accessToken`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 3.8 La connexion avec l'ancien mot de passe échoue

- **Objectif** : Vérifier qu'après un changement de mot de passe, l'ancien mot de passe ne fonctionne plus.

- **Préconditions** :
  - Vous avez réussi le test 3.1 (changement de mot de passe)
  - Vous connaissez l'ancien mot de passe

- **Étapes** :
  1. Déconnectez-vous
  2. Naviguez vers **http://localhost:5173/connexion**
  3. Saisissez votre e-mail et l'**ancien** mot de passe
  4. Cliquez sur "Se connecter"

- **Résultat UI attendu** :
  - La connexion échoue
  - Un message d'erreur s'affiche : "Email ou mot de passe incorrect."

- **Résultat API attendu** :
  - `POST /auth/login` retourne `401` avec `{ success: false, error: { code: "INVALID_CREDENTIALS" } }`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 4. Suppression de compte

> **Attention** : Ces tests suppriment définitivement le compte utilisé. Utilisez un compte de test dédié, pas votre compte principal.

### 4.1 Ouverture du dialogue de confirmation

- **Objectif** : Vérifier que le dialogue de confirmation s'ouvre quand on clique sur "Supprimer mon compte".

- **Préconditions** :
  - Connecté avec un compte de test (LOCAL ou GOOGLE)

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte/securite**
  2. Descendez jusqu'à la section "Supprimer le compte" (fond rose/rouge)
  3. Cliquez sur le bouton "Supprimer mon compte"

- **Résultat UI attendu** :
  - Une fenêtre modale s'ouvre au centre de l'écran avec un overlay sombre semi-transparent en arrière-plan
  - La modale affiche :
    - Une icône de corbeille (rouge) dans un cercle rose
    - Le titre "Supprimer votre compte ?"
    - Le texte : "La suppression de votre compte est définitive. Toutes vos données seront supprimées et cette action ne peut pas être annulée."
    - Deux boutons : "Annuler" (à gauche) et "Supprimer définitivement" (à droite, en rouge)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.2 Annulation de la suppression

- **Objectif** : Vérifier que cliquer sur "Annuler" ferme la modale sans supprimer le compte.

- **Préconditions** :
  - Le dialogue de confirmation est ouvert (test 4.1 réussi)

- **Étapes** :
  1. Cliquez sur le bouton "Annuler"

- **Résultat UI attendu** :
  - La modale se ferme
  - La page de sécurité est affichée à nouveau
  - Le compte est toujours actif (vous êtes toujours connecté)

- **Résultat API attendu** :
  - Aucune requête `DELETE /auth/account` n'est envoyée

- **Résultat base de données attendu** :
  - Aucune modification — le statut de l'utilisateur reste `ACTIVE`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.3 Confirmation de la suppression

- **Objectif** : Vérifier que cliquer sur "Supprimer définitivement" supprime le compte.

- **Préconditions** :
  - Connecté avec un compte de test que vous souhaitez supprimer
  - Le dialogue de confirmation est ouvert

- **Étapes** :
  1. Cliquez sur le bouton "Supprimer définitivement"

- **Résultat UI attendu** :
  - Le bouton affiche "Suppression…" avec un spinner
  - Les deux boutons sont désactivés pendant la suppression
  - Après la suppression, vous êtes redirigé vers la page de connexion (**http://localhost:5173/connexion**)
  - Vous n'êtes plus connecté

- **Résultat API attendu** :
  - `DELETE /auth/account` retourne `204 No Content` (corps vide)
  - Le cookie `refresh_token` est effacé (header `Set-Cookie` avec `Max-Age=0`)

- **Résultat base de données attendu** :
  - Le champ `status` de l'utilisateur passe de `ACTIVE` à `DELETED`
  - Tous les refresh tokens actifs de cet utilisateur sont révoqués (champ `revokedAt` défini avec la date/heure actuelle)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.4 Le compte est soft-deleted en base de données

- **Objectif** : Vérifier directement en base de données que le compte est marqué comme supprimé (soft delete).

- **Préconditions** :
  - Le test 4.3 a été réussi
  - Accès à la base de données PostgreSQL

- **Étapes** :
  1. Ouvrez un terminal et connectez-vous à PostgreSQL :
     ```bash
     psql -d chaweer
     ```
  2. Exécutez la requête suivante en remplaçant l'e-mail par celui du compte supprimé :
     ```sql
     SELECT id, email, status, "authProvider" FROM "User" WHERE email = 'votre@email.com';
     ```

- **Résultat base de données attendu** :
  - La ligne existe toujours (le compte n'est pas physiquement supprimé)
  - Le champ `status` est `DELETED`
  - Le champ `authProvider` est inchangé (`LOCAL` ou `GOOGLE`)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.5 Le refresh token est révoqué

- **Objectif** : Vérifier que les refresh tokens ont été révoqués après la suppression.

- **Préconditions** :
  - Le test 4.3 a été réussi
  - Accès à la base de données PostgreSQL

- **Étapes** :
  1. Dans psql, exécutez :
     ```sql
     SELECT id, "userId", "revokedAt" FROM "RefreshToken" WHERE "userId" = (SELECT id FROM "User" WHERE email = 'votre@email.com');
     ```

- **Résultat base de données attendu** :
  - Tous les refresh tokens de cet utilisateur ont un champ `revokedAt` non-null (date/heure de la suppression)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.6 L'utilisateur est déconnecté

- **Objectif** : Vérifier que l'utilisateur est automatiquement déconnecté après la suppression.

- **Préconditions** :
  - Le test 4.3 a été réussi

- **Étapes** :
  1. Observez l'URL après redirection — elle doit être `/connexion`
  2. Essayez de naviguer directement vers **http://localhost:5173/mon-compte**

- **Résultat UI attendu** :
  - Vous êtes redirigé vers `/connexion` (page de connexion)
  - Tenter d'accéder à `/mon-compte` redirige également vers `/connexion`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.7 Le compte LOCAL supprimé ne peut plus s'authentifier

- **Objectif** : Vérifier qu'un compte LOCAL supprimé ne peut pas se reconnecter.

- **Préconditions** :
  - Le test 4.3 a été réussi avec un compte LOCAL
  - Vous connaissez l'e-mail et le mot de passe du compte supprimé

- **Étapes** :
  1. Sur la page de connexion (**http://localhost:5173/connexion**)
  2. Saisissez l'e-mail et le mot de passe du compte supprimé
  3. Cliquez sur "Se connecter"

- **Résultat UI attendu** :
  - La connexion échoue
  - Un message d'erreur s'affiche : "Adresse e-mail ou mot de passe incorrect."

- **Résultat API attendu** :
  - `POST /auth/login` retourne `401` avec `INVALID_CREDENTIALS` (le compte avec statut `DELETED` ne peut pas se connecter, même message que des identifiants invalides pour éviter l'énumération de comptes)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.8 Le compte GOOGLE supprimé propose la réinscription

- **Objectif** : Vérifier qu'un compte GOOGLE supprimé est invité à recréer son compte.

- **Préconditions** :
  - Le test 4.3 a été réussi avec un compte GOOGLE

- **Étapes** :
  1. Allez sur **http://localhost:5173/connexion**
  2. Cliquez sur "Se connecter avec Google"
  3. Authentifiez-vous avec le compte Google supprimé

- **Résultat UI attendu** :
  - Une page "Compte supprimé" s'affiche avec le message "Ce compte a été supprimé. Souhaitez-vous le recréer ?"
  - Un bouton "Recréer mon compte" est visible
  - Un lien "Retour à la connexion" est visible

- **Résultat API attendu** :
  - `POST /auth/google/client` retourne `403` avec `{ success: false, error: { code: "ACCOUNT_DELETED" } }`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 4.9 Réactivation du compte GOOGLE après confirmation

- **Objectif** : Vérifier que cliquer sur "Recréer mon compte" réactive le compte Google.

- **Préconditions** :
  - Le test 4.8 a été réussi

- **Étapes** :
  1. Cliquez sur "Recréer mon compte"
  2. Authentifiez-vous à nouveau avec Google

- **Résultat UI attendu** :
  - Vous êtes connecté à l'application
  - Le compte est réactivé

- **Résultat API attendu** :
  - `POST /auth/google/client` avec `reactivate: true` retourne `200` avec un `accessToken`

- **Résultat base de données attendu** :
  - Le champ `status` de l'utilisateur passe de `DELETED` à `ACTIVE`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 5. Navigation

### 5.1 Accès depuis la page Profil

- **Objectif** : Vérifier qu'un lien vers la page Sécurité est présent sur la page Profil.

- **Préconditions** :
  - Connecté avec n'importe quel compte

- **Étapes** :
  1. Naviguez vers **http://localhost:5173/mon-compte**
  2. Descendez en bas de la page
  3. Cherchez la carte "Sécurité du compte" avec une icône de bouclier
  4. Cliquez sur cette carte

- **Résultat UI attendu** :
  - La page Profil affiche une carte avec :
    - Une icône de bouclier (vert/teal)
    - Le titre "Sécurité du compte"
    - Le texte "Mot de passe, méthode de connexion, suppression du compte"
    - Le lien "Gérer" (vert/teal) à droite
  - Au clic, vous êtes redirigé vers **http://localhost:5173/mon-compte/securite**

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 5.2 Accès direct par URL

- **Objectif** : Vérifier que la page Sécurité est accessible directement via son URL.

- **Préconditions** :
  - Connecté avec n'importe quel compte

- **Étapes** :
  1. Saisissez directement **http://localhost:5173/mon-compte/securite** dans la barre d'adresse

- **Résultat UI attendu** :
  - La page Sécurité s'affiche directement
  - Toutes les sections sont visibles (Compte, Mot de passe, Supprimer le compte)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 5.3 Un utilisateur non connecté est redirigé

- **Objectif** : Vérifier qu'un utilisateur non authentifié ne peut pas accéder à la page Sécurité.

- **Préconditions** :
  - Être déconnecté

- **Étapes** :
  1. Saisissez directement **http://localhost:5173/mon-compte/securite** dans la barre d'adresse

- **Résultat UI attendu** :
  - Vous êtes redirigé vers **http://localhost:5173/connexion**
  - La page de connexion s'affiche

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 6. Responsive

### 6.1 Affichage Desktop (≥ 1024px)

- **Objectif** : Vérifier que la page s'affiche correctement sur grand écran.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Ouvrez la page **http://localhost:5173/mon-compte/securite**
  2. Agrandissez la fenêtre du navigateur à ≥ 1024px de large

- **Résultat UI attendu** :
  - Le contenu est centré avec une largeur maximale de 760px
  - Les cartes sont bien espacées (gap entre les sections)
  - Le formulaire de mot de passe affiche les champs en pleine largeur
  - Le bouton "Modifier le mot de passe" est aligné à droite

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 6.2 Affichage Tablet (768px – 1023px)

- **Objectif** : Vérifier que la page s'affiche correctement sur tablette.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Redimensionnez la fenêtre du navigateur entre 768px et 1023px
  2. Ou utilisez les DevTools du navigateur (F12) > Mode responsive > iPad

- **Résultat UI attendu** :
  - Le contenu s'adapte avec des marges latérales réduites (`px-6`)
  - Toutes les sections restent lisibles
  - Aucun débordement horizontal (pas de scroll horizontal)
  - La modale de suppression s'affiche correctement centrée

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 6.3 Affichage Mobile (< 768px)

- **Objectif** : Vérifier que la page s'affiche correctement sur mobile.

- **Préconditions** :
  - Connecté avec un compte LOCAL

- **Étapes** :
  1. Redimensionnez la fenêtre du navigateur à 375px (iPhone) ou utilisez les DevTools
  2. Parcourez toute la page en scrollant

- **Résultat UI attendu** :
  - Le contenu occupe toute la largeur avec des marges latérales de 24px (`px-6`)
  - Les champs de mot de passe sont en pleine largeur
  - Le bouton "Modifier le mot de passe" reste aligné à droite
  - Dans la modale de suppression, les boutons "Annuler" et "Supprimer définitivement" se disposent côte à côte ou l'un au-dessus de l'autre selon l'espace disponible (`flex-wrap`)
  - Aucun débordement horizontal

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 7. Accessibilité

### 7.1 Navigation au clavier

- **Objectif** : Vérifier que tous les éléments interactifs sont accessibles au clavier.

- **Préconditions** :
  - Connecté avec un compte LOCAL
  - Sur la page **http://localhost:5173/mon-compte/securite**

- **Étapes** :
  1. Appuyez sur `Tab` plusieurs fois pour parcourir la page

- **Résultat UI attendu** :
  - Le focus se déplace logiquement : en-tête → champ "Mot de passe actuel" → champ "Nouveau mot de passe" → champ "Confirmer" → bouton "Modifier le mot de passe" → bouton "Supprimer mon compte"
  - Chaque élément focusé affiche un anneau de focus visible (outline coloré)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.2 Focus trap dans la modale

- **Objectif** : Vérifier que le focus est piégé dans la modale de suppression quand elle est ouverte.

- **Préconditions** :
  - Sur la page Sécurité
  - La modale de suppression est ouverte (cliquez sur "Supprimer mon compte")

- **Étapes** :
  1. Appuyez sur `Tab` plusieurs fois

- **Résultat UI attendu** :
  - Le focus se déplace uniquement entre les éléments de la modale (bouton "Annuler", bouton "Supprimer définitivement")
  - Le focus ne sort pas de la modale vers les éléments en arrière-plan
  - La modale reçoit le focus à l'ouverture

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.3 La touche Escape ferme la modale

- **Objectif** : Vérifier que la touche Escape ferme la modale de confirmation.

- **Préconditions** :
  - La modale de suppression est ouverte

- **Étapes** :
  1. Appuyez sur la touche `Escape`

- **Résultat UI attendu** :
  - La modale se ferme
  - Le focus revient à l'élément qui l'avait ouvert (le bouton "Supprimer mon compte")

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.4 Étiquettes (Labels)

- **Objectif** : Vérifier que tous les champs ont des étiquettes associées correctement.

- **Préconditions** :
  - Sur la page Sécurité avec un compte LOCAL

- **Étapes** :
  1. Cliquez sur le texte "Mot de passe actuel" (l'étiquette)
  2. Cliquez sur le texte "Nouveau mot de passe"
  3. Cliquez sur le texte "Confirmer le nouveau mot de passe"

- **Résultat UI attendu** :
  - Cliquer sur chaque étiquette place le curseur dans le champ correspondant
  - Chaque champ a un `id` unique et son étiquette est associée via `htmlFor`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.5 Support du lecteur d'écran

- **Objectif** : Vérifier que les sections et la modale sont correctement annoncées par un lecteur d'écran.

- **Préconditions** :
  - Un lecteur d'écran est activé (VoiceOver sur macOS : `Cmd + F5`)

- **Étapes** :
  1. Naviguez sur la page Sécurité avec le lecteur d'écran
  2. Ouvrez la modale de suppression

- **Résultat UI attendu** :
  - Chaque section est annoncée avec son titre ("Compte", "Mot de passe", "Supprimer le compte")
  - La modale est annoncée comme un dialogue (`role="dialog"`, `aria-modal="true"`)
  - Le titre de la modale "Supprimer votre compte ?" est lu

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.6 Focus visible

- **Objectif** : Vérifier que tous les éléments interactifs ont un indicateur de focus visible.

- **Préconditions** :
  - Sur la page Sécurité

- **Étapes** :
  1. Utilisez `Tab` pour naviguer entre les éléments

- **Résultat UI attendu** :
  - Les champs de saisie affichent un anneau de focus
  - Le bouton "Modifier le mot de passe" affiche un anneau de focus
  - Le bouton "Supprimer mon compte" affiche un anneau de focus rouge
  - Dans la modale, les boutons "Annuler" et "Supprimer définitivement" affichent un anneau de focus

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 7.7 Messages d'erreur

- **Objectif** : Vérifier que les messages d'erreur sont affichés et accessibles.

- **Préconditions** :
  - Sur la page Sécurité avec un compte LOCAL

- **Étapes** :
  1. Saisissez un nouveau mot de passe trop court (ex: `abc`)
  2. Cliquez en dehors du champ ou appuyez sur `Tab`

- **Résultat UI attendu** :
  - Un message d'erreur rouge apparaît sous le champ
  - Le message est associé au champ via `aria-describedby` pour les lecteurs d'écran
  - Le champ est marqué comme invalide avec `aria-invalid="true"`

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 8. Régression

> Ces tests vérifient que les fonctionnalités existantes n'ont pas été cassées par l'implémentation de US-023.

### 8.1 Inscription

- **Étapes** :
  1. Déconnectez-vous
  2. Allez sur **http://localhost:5173/inscription**
  3. Remplissez le formulaire et inscrivez-vous

- **Résultat attendu** : L'inscription fonctionne comme avant (message de succès, e-mail de vérification si applicable)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.2 Connexion

- **Étapes** :
  1. Allez sur **http://localhost:5173/connexion**
  2. Connectez-vous avec un compte LOCAL valide

- **Résultat attendu** : La connexion réussit, vous êtes redirigé vers l'application

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.3 Déconnexion

- **Étapes** :
  1. En étant connecté, cliquez sur le bouton de déconnexion dans l'en-tête

- **Résultat attendu** : Vous êtes déconnecté et redirigé vers la page de connexion

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.4 Connexion Google

- **Étapes** :
  1. Déconnectez-vous
  2. Allez sur **http://localhost:5173/connexion**
  3. Cliquez sur "Se connecter avec Google"
  4. Authentifiez-vous avec Google

- **Résultat attendu** : La connexion Google réussit, vous êtes connecté à l'application

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.5 Page Profil

- **Étapes** :
  1. Connectez-vous
  2. Naviguez vers **http://localhost:5173/mon-compte**

- **Résultat attendu** :
  - La page Profil s'affiche correctement
  - La carte "Sécurité du compte" est visible en bas de page (avec icône bouclier)
  - L'ancienne section "Zone de danger" n'est plus présente

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.6 Modification du profil

- **Étapes** :
  1. Sur la page Profil, cliquez sur "Modifier mon profil"
  2. Modifiez un champ (ex: prénom ou nom)
  3. Sauvegardez

- **Résultat attendu** : La modification est sauvegardée avec un message de succès

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.7 Préférences

- **Étapes** :
  1. Sur la page Profil, modifiez une préférence dans la section "Préférences"
  2. Sauvegardez

- **Résultat attendu** : Les préférences sont sauvegardées avec un message de succès

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

### 8.8 Persistance de l'authentification

- **Étapes** :
  1. Connectez-vous
  2. Rafraîchissez la page (F5 ou `Cmd + R`)
  3. Fermez l'onglet et rouvrez **http://localhost:5173**

- **Résultat attendu** : Vous restez connecté après le rafraîchissement et la réouverture de l'onglet (le refresh token est utilisé pour restaurer la session)

- **Pass / Fail** : ☐ Pass  ☐ Fail

---

## 9. Checklist finale de validation

Imprimez cette checklist et cochez chaque case pendant votre parcours de validation.

### Environnement

- ☐ Backend démarré sur `http://localhost:3000`
- ☐ Frontend démarré sur `http://localhost:5173`
- ☐ `/health` répond `200 OK`
- ☐ Compte LOCAL de test créé/identifié
- ☐ Compte GOOGLE de test identifié

### Informations du compte

- ☐ **2.1** — L'e-mail est affiché correctement
- ☐ **2.2** — Le fournisseur d'authentification est affiché correctement (LOCAL et GOOGLE)

### Changement de mot de passe

- ☐ **3.1** — Changement de mot de passe réussi
- ☐ **3.2** — Mot de passe actuel incorrect → erreur
- ☐ **3.3** — Mot de passe trop faible → erreur de validation
- ☐ **3.4** — Non-correspondance des mots de passe → erreur
- ☐ **3.5** — Nouveau mot de passe identique à l'actuel → erreur 422
- ☐ **3.6** — Compte Google → message d'information (pas de formulaire)
- ☐ **3.7** — Connexion avec le nouveau mot de passe → réussit
- ☐ **3.8** — Connexion avec l'ancien mot de passe → échoue

### Suppression de compte

- ☐ **4.1** — Ouverture du dialogue de confirmation
- ☐ **4.2** — Annulation → la modale se ferme, compte intact
- ☐ **4.3** — Confirmation → compte supprimé, redirection vers connexion
- ☐ **4.4** — Base de données : `status = DELETED`
- ☐ **4.5** — Base de données : refresh tokens révoqués
- ☐ **4.6** — Utilisateur déconnecté, accès protégés bloqués
- ☐ **4.7** — Connexion avec compte LOCAL supprimé → échoue
- ☐ **4.8** — Connexion avec compte GOOGLE supprimé → page "Compte supprimé"
- ☐ **4.9** — Réactivation du compte GOOGLE après confirmation

### Navigation

- ☐ **5.1** — Lien "Sécurité du compte" sur la page Profil → navigue vers `/mon-compte/securite`
- ☐ **5.2** — Accès direct par URL → la page s'affiche
- ☐ **5.3** — Utilisateur non connecté → redirigé vers `/connexion`

### Responsive

- ☐ **6.1** — Desktop (≥ 1024px) → affichage correct
- ☐ **6.2** — Tablette (768–1023px) → affichage correct
- ☐ **6.3** — Mobile (< 768px) → affichage correct

### Accessibilité

- ☐ **7.1** — Navigation au clavier (Tab)
- ☐ **7.2** — Focus trap dans la modale
- ☐ **7.3** — Escape ferme la modale
- ☐ **7.4** — Étiquettes cliquables associent les champs
- ☐ **7.5** — Lecteur d'écran annonce les sections et la modale
- ☐ **7.6** — Focus visible sur tous les éléments interactifs
- ☐ **7.7** — Messages d'erreur affichés et accessibles

### Régression

- ☐ **8.1** — Inscription fonctionne
- ☐ **8.2** — Connexion fonctionne
- ☐ **8.3** — Déconnexion fonctionne
- ☐ **8.4** — Connexion Google fonctionne
- ☐ **8.5** — Page Profil s'affiche (avec carte Sécurité, sans Zone de danger)
- ☐ **8.6** — Modification du profil fonctionne
- ☐ **8.7** — Préférences fonctionnent
- ☐ **8.8** — Persistance de l'authentification (refresh + reopen)

### Résultat global

- ☐ **VALIDÉ** — Toutes les cases sont cochées, la fonctionnalité est prête pour la mise en production
- ☐ **NON VALIDÉ** — Une ou plusieurs cases ne sont pas cochées, des corrections sont nécessaires

---

## Notes pour le Product Owner

- **Tests 3.1, 3.5, 3.7, 3.8, 4.3–4.7** : Ces tests modifient ou suppriment des données. Utilisez un compte de test dédié, jamais votre compte principal.
- **Test 3.5** (mot de passe identique) : Le frontend affiche désormais le message exact de l'API : "Le nouveau mot de passe doit être différent du mot de passe actuel."
- **Tests 4.3–4.7** : Créez un nouveau compte de test spécifiquement pour ces tests, car le compte sera supprimé.
- **Rate limiting** : Le endpoint `PATCH /auth/password` est protégé par un rate limiter (100 requêtes par 15 minutes par IP en développement). Si vous dépassez cette limite pendant les tests, attendez 15 minutes ou redémarrez le backend.
