# 03 — Spécification des écrans (web)

Chaque écran liste : but, sections dans l'ordre, états, comportements responsive, interactions. Les maquettes de référence sont dans le projet (fichiers `.dc.html`).

---

## Module Authentification (réf. `E011 - Authentification.dc.html`)

Principes : **Google dominant** (premier, pleine largeur, partout) ; **zéro champ** avant l'écran d'inscription e-mail ; parcours avocat **en pied de page uniquement** ; aucune modale (chaque étape = écran plein).

### 1. Landing Authentication
Sections : logo → titre « Bienvenue sur Chaweer » → sous-titre → **GoogleButton** → séparateur « ou » → bouton primaire « Continuer avec l'e-mail » → micro-légal (Conditions/Confidentialité) → ProFooter avocat.
Desktop : carte 440px centrée ; option panneau de marque gauche 40% (dégradé `#134E4A→#0F766E`, points de confiance) — décoratif, aucune action. Tablette : carte seule. Mobile : pleine page, boutons empilés bas (zone pouce).
États : boutons default/hover/focus/loading. Aucun champ → aucune erreur.

### 2. Login
Sections : retour+logo → titre « Content de vous revoir » → GoogleButton → « ou » → champ Email → champ Mot de passe (œil) → lien « Mot de passe oublié ? » (droite) → bouton « Se connecter » (désactivé si champs vides/invalides) → « Pas encore de compte ? Créer un compte » → ProFooter.
États : disabled tant que non valide ; error global sous le bouton « E-mail ou mot de passe incorrect. » (jamais champ par champ) ; mot de passe vidé au refus, e-mail conservé ; loading « Connexion… ».

### 3. Register
Sections : retour+logo → titre « Créer votre compte » → sous-titre « Quelques secondes suffisent. » → GoogleButton → « ou » → bouton « S'inscrire avec un e-mail » → « Déjà un compte ? Se connecter » → micro-légal → ProFooter.
Aucun champ ici (choix de méthode d'abord).

### 4. Email Registration
Sections : retour+logo → titre → **Nom complet** → **E-mail** → **Mot de passe** (œil + jauge robustesse 3 paliers) → **case consentement unique** (Conditions/Confidentialité, obligatoire) → bouton « Créer mon compte » (désactivé tant qu'invalide) → « Déjà un compte ? Se connecter ».
Champs volontairement absents : confirmer mot de passe, téléphone, confirmer e-mail.
États : validation temps réel ; « e-mail déjà utilisé → se connecter » (récupération 1 clic) ; loading « Création… ».

### 5. Google Loading
Écran plein calme : logo + spinner accent + « Connexion sécurisée avec Google… » + « Vous allez être redirigé. » **Garde-fou** : après ~8s, lien « Ça prend plus de temps que prévu ? Réessayer ».

### 6. Authentication Error
Icône alerte désaturée (`#B4231F`) → titre « La connexion n'a pas abouti » → texte orienté solution → bouton « Réessayer » (rejoue la même méthode) → lien « Utiliser une autre méthode » → « Contacter le support ». Ton calme, jamais alarmant.

### 7. Forgot Password
Sections : retour+logo → titre « Réinitialiser votre mot de passe » → sous-titre → champ E-mail (pré-rempli si venu du Login) → bouton « Envoyer le lien » → « Retour à la connexion ».
Après envoi : confirmation **neutre** (« Si un compte existe pour cet e-mail, un lien a été envoyé »), « Renvoyer » avec compte à rebours 30s (anti-énumération de comptes).

### 8. Session Restoring
Transition brève : logo + spinner/skeleton de la page cible. Session persistante par défaut (pas de case « rester connecté »).

### 9. Logged-in Transition
Coche verte animée (~600ms) + « Vous êtes connecté » → redirection automatique vers la **destination d'origine** (deep-link respecté, ex. la réservation en cours).

### 10. Professional Entry
Écran dédié « Espace avocat » (badge contextuel) : titre « Développez votre cabinet » → GoogleButton + « Continuer avec l'e-mail » (mêmes composants) → « Pas encore sur Chaweer ? Rejoindre en tant qu'avocat » → lien retour « ← Je suis un particulier ». Accessible seulement via le ProFooter des écrans grand public.

---

## US-021 — Mon Profil (consultation) (réf. `E021 - Mon Profil.dc.html`)

But : consulter ses informations et préférences. **Lecture seule** pour les infos personnelles (l'édition = US-022).
Cadre : header Chaweer + contenu centré (760px), fond de page blanc, colonne flex `gap:22px`, padding `40px 24px 64px`.
Sections (dans l'ordre) : **H1 « Mon profil »** → **Carte Identité** → **Carte Informations personnelles** → **Carte Préférences** → **Carte Zone de danger**.

### Carte Identité
Avatar 64px `#0F766E` (initiales blanches 22px/700) + Nom (19/700) · « Compte Grand Public » (14/`#6B6862`) · email (14/`#6B6862`).

### Carte Informations personnelles
En-tête : titre (17/700) à gauche ; **« Modifier mon profil »** à droite (lien 14.5/600 `#1C1B1A` → hover `#0F766E`).
Champs empilés (label 13/500 `#9A968E` au-dessus, valeur 15/500 dessous, `padding:16px 0`, `border-bottom:1px solid #F0EEEA`) : **Prénom** · **Nom** · **Email** · **Téléphone** · **Pays** · **Ville** (`Non renseigné` couleur `#B4AFA6` si vide) · **Nationalité**.
Lecture seule stricte — aucune édition sur cet écran.

### Carte Préférences
Titre « Préférences ».
**Langue de l'interface** : 3 pills — **Français / العربية / English**. Active : fond `#0F766E`, texte blanc. Inactive : fond blanc, bordure `#E7E5E1`, texte `#4B4A46`. 42px, radius 10.
**Notifications** : 3 lignes (`space-between`, `padding:15px 0`, séparateur `#F0EEEA`) :
- **Notifications par e-mail** — toggle ON.
- **Notifications push** — toggle ON.
- **Notifications SMS** + pill « Bientôt disponible » — toggle **désactivé**, libellé `#9A968E`.
Toggle : piste 46×28 radius 999 ; ON `#0F766E`, OFF `#D8D5D0`, désactivé `#EDEBE7` ; genou blanc 22px, transition 180ms.

### Carte Zone de danger
Fond `#FDF3F2`, bordure `#F3D9D7`, radius 16, padding 26. Titre « Zone de danger » (17/700). Bouton **« Supprimer mon compte »** (blanc, texte `#B4231F`, bordure `#E9C9C7`, 44px, hover fond `#FBEAE9`).

États couverts : **Défaut** ; **Chargement** (skeletons des valeurs, structure stable) ; **Champs vides** (→ « Non renseigné » `#B4AFA6`, jamais de ligne vide) ; **Succès** (toast « Préférences enregistrées » fond `#134E4A` après changement langue/switch) ; **Erreur** (carte calme + « Réessayer ») ; **Confirmation suppression** (modale : icône corbeille pastille `#FBEAE9`, « Supprimer votre compte ? », boutons Annuler / Supprimer définitivement `#B4231F`).

---

## US-022 — Modifier mon profil (édition + confirmation) (réf. `E022 - Modifier mon profil.dc.html`)

But : modifier ses informations personnelles. Accès : Mon Profil → Modifier mon profil. Flux : éditer → Enregistrer → **écran confirmation** → retour Mon Profil.
Cadre : header Chaweer + contenu centré (760px), fond de page blanc, colonne flex `gap:22px`, padding `32px 24px 64px`.
Deux vues pilotées par l'état : **formulaire** / **confirmation**. + modale « quitter sans enregistrer ».

### Vue formulaire
Sections : **« ← Retour »** (13.5/600 `#0F766E`) → H1 « Modifier mon profil » + sous-titre « Mettez à jour vos informations personnelles. » (14.5/`#6B6862`) → **Carte formulaire** (champs en colonne `gap:20px`).

Champs :
- **Prénom*** — input éditable.
- **Nom*** — input éditable. Vidé au submit → bordure `#B4231F` + « Le nom est obligatoire. » (13/`#B4231F`).
- **Email** — **lecture seule** (cadenas dans le label, fond `#F2F1EF`, bordure `#EAE8E3`).
- **Téléphone*** — **input éditable** (modifiable, aucun texte d'aide).
- **Pays*** + **Ville*** — **côte à côte**, grille 2 colonnes `gap:18px`. Selects stylés (`appearance:none`, chevron custom). Ville : placeholder « Sélectionner une ville ». Sous la grille : aide « La ville dépend du pays sélectionné. » (12.5/`#9A968E`).
- **Nationalité*** — select stylé.

**Actions** (alignées à droite, `gap:12px`, **sous la carte**) : **Annuler** (blanc, bordure 1.5px `#E7E5E1`, texte `#1C1B1A`, hover fond `#F7F7F5`, h=50, radius 12) · **Enregistrer les modifications** (primaire, fond `#0F766E`, texte blanc, hover `#134E4A`, focus anneau `rgba(20,184,166,.40)`, h=50, radius 12). Enregistrer **désactivé** (fond `#CFD8D6`, texte `#8A9997`, `cursor:not-allowed`) tant que rien n'a changé ; **vert** dès la 1ʳᵉ modification ; revient à l'état désactivé si tout est annulé. Sauvegarde explicite. Pendant l'enregistrement : spinner + « Enregistrement… », champs désactivés (fond `#F2F1EF`).

### Vue confirmation (écran dédié)
Contenu centré `max-width:520px` ; carte blanche padding `44px 32px`, centrée. Pastille 72px `#0F766E` + coche blanche (animations `pop` 400ms + tracé `check` 500ms). Titre « Profil mis à jour » (22/700). Texte « Vos informations ont bien été enregistrées. » (15/`#6B6862`). Bouton **« Retour à mon profil »** (primaire) → E021.

### Modale « Quitter sans enregistrer ? »
Déclenchée par Retour/Annuler avec modifs non enregistrées. Titre « Quitter sans enregistrer ? » + texte de perte. Boutons : **Continuer la modification** (primaire, par défaut) / **Quitter sans enregistrer** (blanc). Échap = continuer.

États couverts :
- **Loading** : skeletons pulsés, champs désactivés.
- **Ready** : tout prérempli, Enregistrer désactivé.
- **Editing** : 1ʳᵉ modification → Enregistrer devient actif (vert).
- **Select ouvert** : dropdown + recherche intégrée ; Ville réinitialisée si Pays change.
- **Saving** : tous champs désactivés (fond `#F2F1EF`), spinner dans le bouton (« Enregistrement… »), anti double-soumission, largeur bouton figée.
- **Confirmation** : écran dédié (§ ci-dessus).
- **Error** : toast rouge « Impossible de mettre à jour votre profil. », formulaire conservé, erreurs sous le champ + focus au 1er champ fautif.
- **Quitter** : modale (§ ci-dessus).

Responsive : desktop formulaire centré 760px (Pays+Ville en 2 colonnes) ; tablette 1 colonne espacements réduits ; mobile champs pleine largeur, boutons pleine largeur (Enregistrer au-dessus d'Annuler en `column-reverse`).
