# Chaweer — Contexte de développement web (handoff Devin)

> Paquet de contexte pour l'implémentation **front-end web** de Chaweer.
> Source de vérité : les maquettes haute-fidélité de ce projet (auth, profil). Ne pas réinventer de langage visuel.
> Périmètre de ce paquet : **web uniquement** (desktop / tablette / mobile responsive). Pas de natif mobile.

## Qu'est-ce que Chaweer
Plateforme juridique premium au Maroc mettant en relation citoyens/entreprises et avocats vérifiés (consultation vidéo/audio). Bilingue FR / العربية (RTL) / EN. Mobile-first (trafic majoritairement mobile).

## Comment lire ce paquet
- `01-design-system.md` — tokens, typographie, espacement, rayons, ombres, responsive, accessibilité. **À lire en premier.**
- `02-components.md` — inventaire des composants réutilisables + tous leurs états.
- `03-screens.md` — spécification écran par écran (sections, états, comportements, interactions).
- `04-content-i18n.md` — libellés FR/AR/EN, données d'exemple, règles de traduction/RTL.
- `05-engineering-notes.md` — pile recommandée, structure, conventions, définition of done.

## Règles d'or (non négociables)
1. **Fidélité au design system** : tokens exacts, aucun style « à peu près ».
2. **Accessibilité WCAG AA** : focus visible, navigation clavier, labels, contraste, aria-live sur les toasts.
3. **Responsive** : desktop / tablette / mobile — comportements décrits par écran.
4. **Sauvegarde explicite** : jamais d'auto-save. Confirmation avant de quitter si modifications en attente.
5. **Aucune perte de données** en cas d'erreur (le formulaire reste ouvert, valeurs conservées).
