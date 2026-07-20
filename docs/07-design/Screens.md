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
Sections (dans l'ordre) : AppBar connecté → en-tête (avatar initiales + « Mon profil » + sous-titre) → **Carte Informations personnelles** (badge « Lecture seule ») → **Carte Langue** → **Carte Notifications** → **Carte Compte**.

Informations personnelles (grille 2 colonnes desktop, 1 col mobile) : Nom, Prénom, Email, Téléphone (si dispo), Pays, Ville (si dispo), Nationalité (si dispo), Langue. Renvoi vers « Modifier le profil » (US-022) pour éditer.
Langue : détectée automatiquement du navigateur, modifiable — chips FR / العربية / English (sélection = fond `#E6F2F0` + coche).
Notifications : switches indépendants **Email**, **Notifications push** (actifs) ; **SMS** disabled + badge « Bientôt disponible ».
Compte : action discrète « Supprimer mon compte » (danger-soft) → ouvre modale de confirmation (destruction définitive).

États couverts : **Défaut** ; **Chargement** (skeletons des valeurs, structure stable) ; **Champs vides** (options manquantes → « Non renseigné » gris, jamais de ligne vide) ; **Succès** (toast « Préférences enregistrées » après changement langue/switch) ; **Erreur** (carte calme + « Réessayer ») ; **Confirmation suppression** (modale, « Annuler » par défaut).

---

## US-022 — Modifier mon profil (édition) (réf. `E022 - Modifier mon profil.dc.html`)

But : modifier ses informations personnelles. Accès : Mon Compte → Modifier mon profil. Flux : éditer → Enregistrer → retour automatique vers Mon Compte.
Sections : en-tête (Retour ghost + « Modifier mon profil » + sous-titre) → **Carte formulaire** → **Actions** (Annuler / Enregistrer).

Champs :
- **Prénom** (texte, obligatoire), **Nom** (texte, obligatoire).
- **Téléphone** — lecture seule, cadenas, aide « Le numéro de téléphone est utilisé pour votre authentification. »
- **Email** — lecture seule, cadenas.
- **Pays** (select + recherche), **Ville** (select, dépend du pays), **Nationalité** (select + recherche). Saisie libre interdite.

Actions : **Annuler** (secondary) + **Enregistrer** (primary). Enregistrer **désactivé** tant qu'aucune modification n'est détectée. Sauvegarde **explicite** (jamais auto).

États couverts :
- **Loading** : skeletons sur champs éditables, champs désactivés.
- **Ready** : tout prérempli, Enregistrer désactivé.
- **Editing** : 1ʳᵉ modification → Enregistrer devient actif (vert).
- **Select ouvert** : dropdown + recherche intégrée ; Ville réinitialisée si Pays change.
- **Saving** : tous champs désactivés, spinner dans le bouton (« Enregistrement… »), anti double-soumission.
- **Success** : toast « Profil mis à jour avec succès. » → retour auto Mon Compte.
- **Error** : toast « Impossible de mettre à jour votre profil. », formulaire reste ouvert, aucune donnée perdue ; erreurs sous le champ concerné + focus au premier champ en erreur.
- **Confirmation avant quitter** : Retour/Annuler avec modifications en attente → modale « Quitter cette page ? » / « Vous avez des modifications non enregistrées. » → « Continuer la modification » (par défaut) | « Quitter sans enregistrer ».

Responsive : desktop formulaire centré ~700px (2 colonnes possibles) ; tablette 1 colonne espacements réduits ; mobile champs pleine largeur, boutons pleine largeur (Enregistrer au-dessus d'Annuler en `column-reverse`).
