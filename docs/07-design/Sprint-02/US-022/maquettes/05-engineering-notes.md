# 05 — Notes d'ingénierie (web front-end)

> Recommandations pour implémenter fidèlement. Adapter à la stack réelle du dépôt si elle diffère — la fidélité visuelle et comportementale prime sur le choix d'outils.

## Stack recommandée
- **React + TypeScript** (ou le framework déjà en place dans le repo).
- Styling : CSS Modules / Tailwind / styled-components — au choix, mais **exposer les tokens du §01 en variables** (`:root { --c-primary: #0F766E; ... }` ou config Tailwind) et n'utiliser que ces tokens.
- i18n : `react-i18next` ou équivalent ; clés = libellés du fichier `04`. Support RTL via `dir` sur `<html>`.
- Icônes : jeu linéaire léger (style Lucide/Feather) — trait 2px, `stroke-linecap:round`. Le logo Google reste l'asset officiel multicolore.
- Police : Plus Jakarta Sans (+ Tajawal pour AR) via `@fontsource` ou Google Fonts.

## Arborescence suggérée
```
src/
  styles/tokens.css        // variables du §01
  i18n/{fr,ar,en}.json     // libellés du §04
  components/
    Button/ GoogleButton/ TextInput/ Select/ ReadOnlyField/
    Switch/ Card/ Badge/ PageHeader/ Toast/ Modal/ Spinner/ Skeleton/
    AppBar/ ProFooter/
  features/
    auth/        // écrans 1–10 du §03
    profile/     // US-021 (view) + US-022 (edit)
  hooks/ useToast.ts  useUnsavedChangesGuard.ts
```

## Conventions
- **Composants contrôlés** ; état de formulaire local, `dirty` calculé par diff avec les valeurs initiales (→ pilote l'activation d'« Enregistrer »).
- **Sauvegarde explicite** : aucun appel réseau sans clic « Enregistrer ». Bloquer la double soumission pendant `saving`.
- **Garde de navigation** : intercepter route change + `beforeunload` quand `dirty` → modale « Quitter sans enregistrer ? ».
- **Select** : composant custom (pas `<select>` natif) pour la recherche intégrée et le style ; mais **rôle/aria combobox** + navigation clavier complète. Saisie libre interdite (input filtre la liste, ne crée pas de valeur). Ville dépend du Pays (reset à chaque changement de Pays).
- **ReadOnly** : rendre non focusable en édition (`tabindex=-1` ou `readOnly`), visuellement distinct (fond `#F2F1EF` + cadenas).
- **Toasts** : file unique, `aria-live="polite"`, auto-dismiss ~2.5s, pausable au survol.
- **Focus management** : au submit en erreur, `focus()` sur le premier champ invalide ; à l'ouverture de modale, piéger le focus, restaurer à la fermeture.
- **prefers-reduced-motion** : désactiver pulsations/slide, garder des états instantanés.

## Contrats d'API (à confirmer côté back — placeholders)
- `GET /me` → objet `user` (voir `04`). États UI : loading → ready | error.
- `PATCH /me` → body `{ prenom, nom, telephone, pays, ville, nationalite }` (jamais email : lecture seule). 200 → success (écran confirmation → redirect Mon Compte) ; 4xx/5xx → error (toast, formulaire conservé, erreurs de champ mappées sous les champs).
- `PATCH /me/preferences` → `{ langue?, notifications:{ email?, push? } }`. `sms` non modifiable.
- `DELETE /me` → suppression définitive (après confirmation modale).
Champ **email** n'est jamais envoyé en modification. **Téléphone est modifiable**.

## Implémentation réalisée (US-022 + US-021)

### Composants créés / modifiés
- **`AppHeader`** (`components/AppHeader.tsx`) : barre blanche avec logo « Chaweer » 19px/800 `#0F766E`, liens de nav 14px/500 `#6B6862`, avatar 36px rond `#0F766E` avec initiales blanches. Présent sur **tous les écrans** profil (consultation, édition, confirmation, loading, error).
- **`PrimaryButton`** / **`SecondaryButton`** : utilisation de `cn()` (twMerge) pour fusionner `className` de base avec `className` passé en props (fix critique : `{...rest}` écrasait auparavant tous les styles).
- **`EditProfilePage`** : fond blanc, `AppHeader`, `max-w-760px`, `gap-22px`, padding `32px 24px 64px`. Carte `rounded-[16px]` border `#E9E7E3` padding 28 ombre carte. Actions **sous la carte** (pas dedans). Écran de confirmation dédié après save (pastille 72px + coche + titre + bouton retour). Focus ring `rgba(20,184,166,.40)`.
- **`ProfilePage`** : fond blanc, `AppHeader`, `max-w-760px`, `gap-22px`, padding `40px 24px 64px`.
- **`ProfileSummaryCard`** : `rounded-[16px]`, border `#E9E7E3`, avatar 64px `#0F766E`, nom 19px/700, texte 14px `#6B6862`.
- **`PersonalInfoCard`** : `rounded-[16px]`, border `#E9E7E3`, titre 17px/700, lien « Modifier mon profil » 14.5px/600 hover `#0F766E` (pas un bouton plein). Séparateurs `#F0EEEA`.
- **`InfoRow`** : label 13px/500 `#9A968E`, valeur 15px/500, padding 16px 0, « Non renseigné » `#B4AFA6`.
- **`PreferencesCard`** : `rounded-[16px]`, border `#E9E7E3`, pills langue 42px radius 10 (active `#0F766E`/blanc, inactive `#E7E5E1`/`#4B4A46`), toggles 46×28 (ON `#0F766E`, OFF `#D8D5D0`, disabled `#EDEBE7`), badge « Bientôt disponible » `#EEECE8`/`#8A8681`, séparateurs `#F0EEEA`.
- **`DangerZone`** : fond `#FDF3F2`, border `#F3D9D7`, `rounded-[16px]`, bouton danger-soft (blanc, texte `#B4231F`, border `#E9C9C7`, hover `#FBEAE9`).
- **`DeleteAccountModal`** : overlay `rgba(28,27,26,.42)`, `rounded-[16px]`, border `#E9E7E3`, icône corbeille sur pastille `#FBEAE9`, boutons Annuler / Supprimer définitivement `#B4231F`.
- **`ConfirmLeaveModal`** : titre « Quitter sans enregistrer ? », `rounded-[16px]`, border `#E9E7E3`, focus `rgba(20,184,166,.40)`.
- **`EditProfileSkeleton`** / **`ProfileSkeleton`** : fond blanc, `AppHeader`, `max-w-760px`, cards `rounded-[16px]` border `#E9E7E3`.
- **`SelectField`** : focus ring `rgba(20,184,166,.40)`.

### Décisions techniques
- **Ordre des champs** (E022) : Prénom → Nom → Email (lecture seule) → Téléphone → Pays+Ville (côte à côte, gap 18px, aide dessous) → Nationalité.
- **Actions sous la carte** (pas intégrées dans la carte) : Annuler + Enregistrer les modifications, alignées à droite, gap 12px.
- **Bascule du bouton Enregistrer** : `disabled={!isDirty || isSaving}` — `isDirty` calculé par diff entre valeurs du formulaire et valeurs initiales.
- **Écran confirmation** : `showConfirmation` state → vue dédiée (pas toast + redirect).
- **Garde de navigation** : `useBlocker(isDirty && !isSaving)` + modale `ConfirmLeaveModal`.
- **Police** : Plus Jakarta Sans via Google Fonts (config Tailwind `--font-sans`).
- **Aucune logique métier modifiée** : validation Zod, schéma API, permissions inchangés.

## Définition of Done (web)
- [x] Tokens du §01 respectés (aucune valeur hors design system).
- [x] Tous les composants du §02 avec leurs états (hover/focus/active/disabled/loading/error).
- [x] Tous les écrans du §03 avec tous leurs états UI.
- [x] Responsive desktop / tablette / mobile conforme.
- [ ] i18n FR/AR/EN + RTL fonctionnels.
- [x] Accessibilité AA : clavier complet, focus visible, labels, aria-live, contraste, cibles ≥44px.
- [x] Sauvegarde explicite + garde « modifications non enregistrées » + aucune perte de données en erreur.
- [x] Select sans saisie libre ; Ville dépendante du Pays.
- [x] Champs Email strictement lecture seule. Téléphone modifiable.
- [x] Header Chaweer (AppHeader) présent sur tous les écrans profil.
- [x] Fond de page blanc sur tous les écrans profil.
- [x] Actions (Annuler / Enregistrer) sous la carte, alignées à droite.
- [x] Écran de confirmation dédié après enregistrement.
- [x] Lien « Modifier mon profil » cliquable (hover `#0F766E`) sur la page consultation.

## Hors périmètre (ne pas implémenter)
Upload de photo de profil, sélecteur de thème, dark mode, gestion de mot de passe (dans les écrans profil), historique de sécurité/connexion, profil professionnel, abonnement, facturation, statistiques.
