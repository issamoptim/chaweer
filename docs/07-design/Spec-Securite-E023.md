# Chaweer — US-023 Sécurité du compte — Spec d'implémentation (Devin)

> Périmètre : **web**. Cadre canonique identique à Mon profil / Modifier mon profil : **header Chaweer + contenu centré 760px, fond blanc, sans rail**.
> Le volet « Aperçu des écrans » présent dans la maquette interactive est **un outil de démo — à NE PAS implémenter**.
> Visuels : `visuels-securite/01-ecran.png` (Sécurité) · `02` (Google) · `03` (Suppression) · `04` (Mot de passe modifié) · `05` (Erreur API).

---

## 1. Tokens (identiques au design system Profil — rappel)

Vert primaire `#0F766E` · vert foncé (hover/toast) `#134E4A` · accent focus `#14B8A6` (`rgba(20,184,166,.40)`).
Fond page `#FFFFFF` · carte `#FFFFFF` · bordure carte `#E9E7E3` · séparateur `#F0EEEA`.
Texte `#1C1B1A` · secondaire `#6B6862` · atténué/label `#9A968E`.
Champ : bordure `#E7E5E1`, hauteur 50, radius 12 ; lecture seule fond `#F2F1EF` bordure `#EAE8E3`.
Erreur `#B4231F` ; danger fond `#FDF3F2`, bordure `#F3D9D7`, bordure bouton `#E9C9C7`, hover fond `#FBEAE9`, hover plein `#8F1B18`.
Bouton désactivé fond `#CFD8D6` / texte `#8A9997`.
Police **Plus Jakarta Sans**. Cartes radius 16, padding 26, ombre `0 1px 2px rgba(19,78,74,.04), 0 8px 24px rgba(19,78,74,.06)`.

## 2. Ossature
- Header : « Chaweer » 19/800 `#0F766E` à gauche ; « Avocats », « Mes rendez-vous » + avatar 36px `#0F766E` « IM » à droite ; `border-bottom:1px solid #E9E7E3`, padding `15px 40px`.
- Contenu : `max-width:760px`, centré, padding `40px 24px 64px`, colonne `gap:22px`.
- Titre « Sécurité » (28/700) + sous-titre « Gérez les accès et la protection de votre compte. ».
- **3 cartes verticales** : Compte → Mot de passe → Suppression du compte.

---

## 3. Carte « Compte » (lecture seule)
- Titre « Compte » (17/700) + description « Informations d'identification de votre compte. » (13.5/`#9A968E`).
- **Adresse e-mail** : label 13/`#9A968E`, valeur 15/500 (`issam.majdoubi@gec-groupe.com`). Séparateur `#F0EEEA` dessous.
- **Mode d'authentification** : label + **badge**.
  - Variante e-mail : badge neutre « E-mail et mot de passe » (texte `#6B6862`, fond `#F2F1EF`, bordure `#E7E5E1`, radius 20).
  - Variante Google : badge « Google » (texte `#0F766E`, fond `#E6F2F0`, bordure `#CDE5E1`).
- Aucune action, aucun champ éditable.

## 4. Carte « Mot de passe »
Deux variantes selon le mode d'authentification du compte :

### 4a. Variante E-mail + mot de passe (écran 01)
- 3 champs mot de passe (type password + bouton œil afficher/masquer à droite) :
  1. **Mot de passe actuel**
  2. **Nouveau mot de passe** — aide sous le champ : « 8 caractères minimum, avec au moins une lettre et un chiffre. »
  3. **Confirmation du nouveau mot de passe**
- Bouton **« Modifier le mot de passe »** (plein `#0F766E`, hauteur 50, radius 12), aligné à droite.
- Validation locale (erreurs affichées **sous le champ concerné**, texte `#B4231F`, bordure du champ `#B4231F`) :
  - actuel obligatoire · nouveau obligatoire + politique (≥8, une lettre, un chiffre) · confirmation obligatoire + identique au nouveau.
- Flux : validation locale → appel API → **Saving** (bouton spinner + « Modification… », champs grisés) → **Toast** succès/erreur.

### 4b. Variante Google (écran 02)
- Pas de formulaire. **Carte informative** : bloc fond `#F2F1EF`, bordure `#EAE8E3`, radius 12, padding 18 ; pastille blanche + **logo Google**, titre « Votre mot de passe est géré par Google. », texte « Votre compte utilise la connexion Google. Pour modifier votre mot de passe, rendez-vous dans les paramètres de votre compte Google. »
- **Aucune action.**

## 5. Carte « Suppression du compte » (écran 03)
- Style danger : fond `#FDF3F2`, bordure `#F3D9D7`, radius 16, padding 26.
- Titre « Suppression du compte » (17/700, `#1C1B1A`). Texte : « La suppression de votre compte est définitive et irréversible. Vos données, rendez-vous et échanges seront supprimés. »
- Bouton **« Supprimer mon compte »** (blanc, texte `#B4231F`, bordure `#E9C9C7`, 44px, hover fond `#FBEAE9`).
- Clic → **Dialog de confirmation** (jamais de suppression directe) : overlay `rgba(28,27,26,.42)`, carte blanche radius 16 padding 28, icône corbeille sur pastille `#FBEAE9`, titre « Supprimer votre compte ? », texte « Cette action est irréversible… », boutons **Annuler** (blanc bordé, par défaut) / **Supprimer définitivement** (`#B4231F`, hover `#8F1B18`). Échap = Annuler, focus piégé.

---

## 6. États (liste des écrans)
| Écran | Clé | Description | Visuel |
|---|---|---|---|
| E023-01 | `ready` (variante e-mail) | Page complète, formulaire mot de passe actif | `01-ecran.png` |
| E023-02 | `google` | Carte mot de passe = info Google, badge Google | `02-ecran.png` |
| E023-03 | `delete` | Dialog de confirmation de suppression | `03-ecran.png` |
| E023-04 | `success` | Toast vert « Votre mot de passe a été modifié. » | `04-ecran.png` |
| E023-05 | `error` | Toast rouge + champ « Mot de passe actuel » en erreur : « Le mot de passe actuel est incorrect. » | `05-ecran.png` |
| — | `loading` | Skeletons pulsés (valeurs Compte + 3 champs) | (état de chargement) |
| — | `saving` | Bouton spinner « Modification… », champs grisés | (transitoire) |

**Toast** : `position:fixed`, bas-centre, radius 12, padding `12px 18px` ; succès fond `#134E4A` + coche sur pastille `#14B8A6` ; erreur fond `#B4231F` + icône. Auto-masquage ~2,6 s, `aria-live=polite`.

## 7. Messages (i18n — aucun texte codé en dur)
- Succès : « Votre mot de passe a été modifié. »
- Erreur API : « Le mot de passe actuel est incorrect. »
- Google : « Votre mot de passe est géré par Google. »
- Suppression : « Cette action est irréversible. »

## 8. Composants du Design System à réutiliser
Card · Input · Password Input (avec œil) · Button (primaire / secondaire / danger) · Alert (info Google) · Dialog (suppression) · Badge (mode d'auth) · Divider (séparateurs) · Spinner (bouton saving) · Toast. **Ne créer aucun composant spécifique.**

## 9. Responsive
- Desktop / Tablette : cartes centrées, largeur limitée (760).
- Mobile : une colonne, boutons pleine largeur si nécessaire, dialog en `padding:24px`.

## 10. Accessibilité (WCAG AA)
Navigation clavier, focus visible (`box-shadow:0 0 0 3px rgba(20,184,166,.40)`), labels associés aux champs, erreurs annoncées (`aria-describedby` + `aria-live`), contrastes conformes, cibles ≥ 44px, dialog avec focus piégé + Échap.

## 11. Hors périmètre (ne pas implémenter)
Changement d'e-mail, MFA, gestion des sessions, historique de connexion, appareils, passkeys, OTP, changement de fournisseur d'authentification. **Et : ne pas implémenter le volet « Aperçu des écrans ».**
