# Prompt Devin — US-023 Sécurité du compte (avec écrans + images)

> À coller dans Devin. Fichiers joints : `11-spec-securite-E023.md` (spec détaillée) + les 5 images ci-dessous.
> Écran de référence propre (sans outil de démo) : `E023 - Sécurité (propre).dc.html`.

## Images de référence (dossier `visuels-securite/`)
| # | Écran | Fichier |
|---|---|---|
| E023-01 | Sécurité (variante e-mail + mot de passe) | `visuels-securite/01-ecran.png` |
| E023-02 | Compte Google (mot de passe géré par Google) | `visuels-securite/02-ecran.png` |
| E023-03 | Confirmation de suppression (dialog) | `visuels-securite/03-ecran.png` |
| E023-04 | Mot de passe modifié (toast succès) | `visuels-securite/04-ecran.png` |
| E023-05 | Erreur API (toast + champ en erreur) | `visuels-securite/05-ecran.png` |

---

## Prompt

Implémente la page **Sécurité du compte (US-023)** de Chaweer en te basant **exactement** sur les 5 images fournies (`visuels-securite/01→05`) et la spec `11-spec-securite-E023.md`. Web, responsive, dans la continuité des écrans Mon profil / Modifier mon profil déjà réalisés (même design system).

**Cadre (identique aux autres écrans) :** fond de page blanc `#FFFFFF` ; header Chaweer (logo `#0F766E` à gauche ; « Avocats », « Mes rendez-vous » + avatar « IM » à droite ; `border-bottom:1px solid #E9E7E3`) ; contenu **centré `max-width:760px`**, padding `40px 24px 64px`, cartes espacées de 22px. Police **Plus Jakarta Sans**. Cartes : radius 16, bordure `#E9E7E3`, ombre douce `0 1px 2px rgba(19,78,74,.04),0 8px 24px rgba(19,78,74,.06)`.

**Structure — 3 cartes verticales :**
1. **Compte** (image 01) — lecture seule : Adresse e-mail (`issam.majdoubi@gec-groupe.com`) + Mode d'authentification en **badge** (« E-mail et mot de passe » neutre `#F2F1EF`/`#6B6862` ; ou « Google » `#E6F2F0`/`#0F766E` selon le compte). Aucune édition.
2. **Mot de passe** — deux variantes :
   - **E-mail (image 01)** : 3 champs mot de passe (Mot de passe actuel / Nouveau / Confirmation) avec bouton œil afficher-masquer ; aide sous le nouveau : « 8 caractères minimum, avec au moins une lettre et un chiffre. » ; bouton plein `#0F766E` « Modifier le mot de passe » aligné à droite. Erreurs **sous le champ** (texte + bordure `#B4231F`).
   - **Google (image 02)** : pas de formulaire, bloc informatif (fond `#F2F1EF`, logo Google) « Votre mot de passe est géré par Google. » + explication, **aucune action**.
3. **Suppression du compte (image 03)** — carte danger (fond `#FDF3F2`, bordure `#F3D9D7`) : texte « définitive et irréversible… » + bouton « Supprimer mon compte » (blanc, texte `#B4231F`, bordure `#E9C9C7`). Clic → **dialog de confirmation** (jamais de suppression directe) : « Supprimer votre compte ? », boutons Annuler (par défaut) / Supprimer définitivement (`#B4231F`).

**États à couvrir :** Loading (skeletons), Ready, Saving (bouton spinner « Modification… », champs grisés), **Success — image 04** (toast vert `#134E4A` « Votre mot de passe a été modifié. »), **Erreur — image 05** (toast rouge `#B4231F` « Le mot de passe actuel est incorrect. » + champ « Mot de passe actuel » en erreur). Toast fixé en bas-centre, `aria-live=polite`, auto-masquage ~2,6 s.

**Validations (mot de passe) :** actuel obligatoire ; nouveau obligatoire + politique (≥8, une lettre, un chiffre) ; confirmation obligatoire + identique au nouveau. Erreurs sous le champ concerné.

**Composants du Design System uniquement :** Card, Input, Password Input, Button, Alert, Dialog, Badge, Divider, Spinner, Toast. **Ne crée aucun composant spécifique.**

**Accessibilité (WCAG AA) :** navigation clavier, focus visible (`box-shadow:0 0 0 3px rgba(20,184,166,.40)`), labels associés, erreurs annoncées, contrastes conformes, cibles ≥ 44px, dialog avec focus piégé + Échap.

**i18n :** aucun texte codé en dur (utilise les clés de traduction).

**Hors périmètre — ne pas implémenter :** changement d'e-mail, MFA, sessions, historique de connexion, appareils, passkeys, OTP, changement de fournisseur d'authentification. **Ne reproduis pas** l'éventuel volet « Aperçu des écrans » (c'est un outil de démo maquette, pas un élément de la page).

Respecte les couleurs, tailles et emplacements de la spec `11-spec-securite-E023.md` sans dévier.
