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
- **Garde de navigation** : intercepter route change + `beforeunload` quand `dirty` → modale « Quitter cette page ? ».
- **Select** : composant custom (pas `<select>` natif) pour la recherche intégrée et le style ; mais **rôle/aria combobox** + navigation clavier complète. Saisie libre interdite (input filtre la liste, ne crée pas de valeur). Ville dépend du Pays (reset à chaque changement de Pays).
- **ReadOnly** : rendre non focusable en édition (`tabindex=-1` ou `readOnly`), visuellement distinct (fond `#F2F1EF` + cadenas).
- **Toasts** : file unique, `aria-live="polite"`, auto-dismiss ~2.5s, pausable au survol.
- **Focus management** : au submit en erreur, `focus()` sur le premier champ invalide ; à l'ouverture de modale, piéger le focus, restaurer à la fermeture.
- **prefers-reduced-motion** : désactiver pulsations/slide, garder des états instantanés.

## Contrats d'API (à confirmer côté back — placeholders)
- `GET /me` → objet `user` (voir `04`). États UI : loading → ready | error.
- `PATCH /me` → body `{ prenom, nom, pays, ville, nationalite }` (jamais email/téléphone : lecture seule). 200 → success (toast + redirect Mon Compte) ; 4xx/5xx → error (toast, formulaire conservé, erreurs de champ mappées sous les champs).
- `PATCH /me/preferences` → `{ langue?, notifications:{ email?, push? } }`. `sms` non modifiable.
- `DELETE /me` → suppression définitive (après confirmation modale).
Champs **email** et **téléphone** ne sont jamais envoyés en modification.

## Définition of Done (web)
- [ ] Tokens du §01 respectés (aucune valeur hors design system).
- [ ] Tous les composants du §02 avec leurs états (hover/focus/active/disabled/loading/error).
- [ ] Tous les écrans du §03 avec tous leurs états UI.
- [ ] Responsive desktop / tablette / mobile conforme.
- [ ] i18n FR/AR/EN + RTL fonctionnels.
- [ ] Accessibilité AA : clavier complet, focus visible, labels, aria-live, contraste, cibles ≥44px.
- [ ] Sauvegarde explicite + garde « modifications non enregistrées » + aucune perte de données en erreur.
- [ ] Select sans saisie libre ; Ville dépendante du Pays.
- [ ] Champs Email/Téléphone strictement lecture seule.

## Hors périmètre (ne pas implémenter)
Upload de photo de profil, sélecteur de thème, dark mode, gestion de mot de passe (dans les écrans profil), historique de sécurité/connexion, profil professionnel, abonnement, facturation, statistiques.
