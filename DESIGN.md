# Two Blue Vortex — Design (tranche verticale)

**Principe** : l'inverse des jeux Shinobi. Pas de barres, pas de panneaux latéraux, pas de roue de techniques. Une UI « à l'encre bleue » qui vit autour du personnage et s'efface quand elle ne sert pas.

## UI
- **Halo de Boruto (diégétique)** : PV = anneau sous les pieds (n'apparaît que blessé ou en combat), chakra = arc intérieur. Chaîne M1 = 3 points sous l'anneau.
- **Arc de techniques** : 4 glyphes sur un arc au-dessus de Boruto, chacun avec un anneau de recharge et la touche ; l'arc se replie en exploration, se déploie en combat.
- **Objectif** : une seule ligne en haut à gauche, qui pâlit après 6 s. Boussole = flèche au bord de l'écran vers l'objectif (navigation spatiale, pas de mini-carte permanente).
- **Ennemis** : auras = pastilles forme + lettre + couleur (lisibles daltoniens) ; PV = fine ligne qui n'apparaît qu'une fois touché.
- **Réactions** : nom court + idéogramme qui jaillit du point d'impact.
- Typo : *Space Grotesk* (titres) / *Inter* (texte), repli système ; texte 100–200 %.
- Menu : feuille plein écran à onglets horizontaux (Carte · Quêtes · Ninjutsu · Réglages · Accessibilité).

## Combat
- M1 en chaîne de 3 (anticipation → frappe éclair → tenue → retour avec dépassement), le 3ᵉ coup projette. Esquive avec i-frames + squash/stretch. 4 techniques avec signes des mains dessinés : **Rasengan** (Vent), **Raiton : Shiden** (Foudre), **Suiton : Rappa** (Eau), **Kage Bunshin** (Yang).
- Hit-stop seulement sur les gros moments (finisseur, réaction majeure, boss). « Réduire les flashs » activé par défaut : cadres d'impact à l'encre sombre, jamais blancs.

## Réactions (7 éléments : Katon, Fūton, Suiton, Raiton, Doton, Yin, Yang)
| A + B | Réaction | Effet |
|---|---|---|
| Feu + Vent | **Embrasement** | brûlure qui se propage aux voisins |
| Eau + Foudre | **Conduction** | dégâts en chaîne sur les cibles mouillées, étourdit |
| Terre + Eau | **Boue** | ralentit fortement |
| Feu + Eau | **Vapeur** | aveugle (rate ses attaques), ×1,5 |
| Foudre + Terre | **Mise à terre** | brise la garde/armure |
| Vent + Eau | **Gel** | fige 1,5 s |
| Feu + Terre | **Lave** | flaque brûlante |
| Feu + Foudre | **Surcharge** | explosion + recul |
| Vent + (Feu/Eau/Foudre) déjà posé | **Tourbillon** | propage l'aura aux voisins (le Vent est propagateur) |
| Yin + élément | **Mirage** | la cible attaque ses alliés 2 s |
| Yang + élément | **Vitalité** | soigne Boruto d'une part des dégâts |
| Yin + Yang | **Onmyō** | rupture : gros dégâts purs, cadre d'impact |

## Monde
Konoha : rocher des Hokage, rue d'Ichiraku, Académie, Fleuriste Yamanaka, porte principale, terrains d'entraînement, forêt ouest. PNJ à routines (cycle jour/nuit, 1 h = 20 s) : commerçants à leur étal le jour, enfants qui jouent, gardes en ronde, lanternes la nuit. Ennemis **placés** : camp de déserteurs au sud, patrouille sur la route est, **zones de rejetons du Shinju** à l'ouest (racines vivantes). Pas d'apparition aléatoire.

## Histoire (texte réduit de moitié)
- **Prologue — Retour** : les Claw Grimes de Code envahissent Konoha. Tutoriel par la pratique : bouger → frapper → esquiver → technique → réaction. Boruto atterrit sur Code et sauve Sarada ; duel court, Code se replie.
- **Chapitre 1 — Fugitif** : capuche rabattue, Boruto parcourt le village de nuit et de jour, retrouve Sarada, nettoie les zones du Shinju, et aperçoit **Jura** à la lisière.
- Quêtes secondaires : Ichiraku (livraison), Haru (shurikens perdus), Kotetsu (camp de déserteurs).

## Accessibilité
Difficulté (Histoire / Normal / Défi), daltonisme (protan/deutan/tritan + formes toujours présentes), taille de texte, remappage complet clavier + manette, tactile (stick + boutons larges), vitesse de jeu, secousse, réduire les flashs (actif), qualité basse.

## Préférences reprises
AZERTY ZQSD + flèches par défaut, tout remappable, XP ×5, peu de texte, cadres d'impact rares, squash & stretch, animation ZZZ exagérée, rig hiérarchique à orientation unique, signes des mains dessinés.
