# Spec — Boutons « Annuler » & « Enregistrer les modifications » (E022)

```
┌──────────────────────────────────────────────────────────────────────┐
│  BARRE D'ACTIONS — alignée à droite, gap 12px, sous la carte           │
│                                                                        │
│                                   [ Annuler ]  [ Enregistrer les … ]   │
└──────────────────────────────────────────────────────────────────────┘
```

## Bouton « Annuler » (toujours identique)
| Propriété | Valeur |
|---|---|
| Fond | `#FFFFFF` |
| Texte | `#1C1B1A` |
| Bordure | `1.5px solid #E7E5E1` |
| Hover | fond `#F7F7F5` |
| Hauteur / radius | 50px / 12px |
| Focus | `box-shadow:0 0 0 3px rgba(20,184,166,.40)` |

## Bouton « Enregistrer les modifications » — 2 états

```
┌── ÉTAT 1 · AUCUNE MODIFICATION (désactivé / grisé) ────────────────────┐
│  fond #CFD8D6   ·   texte #8A9997   ·   curseur not-allowed            │
│  → l'utilisateur voit le bouton mais comprend qu'il est inactif        │
└────────────────────────────────────────────────────────────────────────┘
            │  dès qu'un champ change (Prénom, Nom, Téléphone,
            ▼  Pays, Ville ou Nationalité)  →  état devient actif
┌── ÉTAT 2 · MODIFICATION DÉTECTÉE (actif / vert) ───────────────────────┐
│  fond #0F766E   ·   texte #FFFFFF   ·   curseur pointer                │
│  hover #134E4A   ·   focus box-shadow 0 0 0 3px rgba(20,184,166,.40)   │
└────────────────────────────────────────────────────────────────────────┘
```

| État | Déclencheur | Fond | Texte | Curseur |
|---|---|---|---|---|
| **Désactivé** | à l'ouverture, aucun champ modifié | `#CFD8D6` | `#8A9997` | `not-allowed` |
| **Actif (vert)** | au moins un champ modifié | `#0F766E` | `#FFFFFF` | `pointer` |
| Hover (actif) | survol en état actif | `#134E4A` | `#FFFFFF` | `pointer` |
| Enregistrement | après clic | `#0F766E` | spinner + « Enregistrement… » | `default` |

Commun aux 2 états : hauteur 50px, radius 12px, police Plus Jakarta Sans 15px / 600.

**Règle de bascule (graphique) :** état 1 par défaut → passe en état 2 dès la première modification d'un champ → si l'utilisateur annule toutes ses modifications, revient en état 1.
