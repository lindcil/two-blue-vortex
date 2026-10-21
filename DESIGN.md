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

## v0.8
### Modes à étages (`8g_modes.js`)
- Activation : C maintenu au-delà du max (dōjutsu, clan) ; Z (manteau, bijū). On monte d'étage en maintenant la touche, si la jauge de combat le permet. Indicateur : pastilles sous la barre de PV, plus une icône d'œil.
- Sharingan : 9 étages (1, 2, 3 tomoe, Mangekyō, puis Susanoo côtes, squelette, humanoïde, samouraï, parfait). Le stade parfait est un géant contrôlable : M1 géant, caméra dézoomée.
- Autres familles : Byakugan/Tenseigan 5, Jōgan 4, Kāma 4, manteau 5, Nara 4, Akimichi 4, Yamanaka 3, Aburame 3, Inuzuka 4, Senju 4.
- Pages : X (modifiable) bascule entre 4 techniques de base et 4 techniques du mode ; balayage sur mobile. Chaque étage a son ultime.
- Limite : les techniques des modes viennent d'une fabrique commune (`S8`, 9 comportements). Elles ont des noms et couleurs canon, mais une forme partagée.
### Constellation (`8i_tree.js`)
- 7 branches (nin, tai, gen, élément, contrôle, clan, corps) de 12 rangs. 3 points au départ, +1 par niveau et par mission.
- Les techniques sont cachées (« ? ») tant que leurs prérequis de stats ne sont pas atteints. 2e élément au niveau 8 avec élément ≥ 4.
- Ouverture : zoom sur le visage, impact dans le cerveau (adouci avec « réduire les flashs »), puis l'espace mental.
- Ultime de base selon la branche dominante, jamais Susanoo.
### Variantes (`8j_var.js`)
- 13 contextes : tap, maintien, dash, combo, air, recul, parade, mode, élément, duo, clone, terrain, PV bas.
- 4 à 6 variantes par technique : **328 variantes sur 64 techniques**. Une icône d'arc signale chaque variante.
- Signatures faites main : Rasengan maintenu (clone, Ōdama), Rasengan et Chidori en dash, Gōkakyū géant, 128 Paumes, souffle en recul, Kage Shuriken.
### IA et équilibrage (`8h_ai.js`)
- Rôles des ennemis : mêlée, flanc, distance, soutien.
- Garde après 3 à 5 M1, puis parade et contre. Esquive des techniques annoncées, appât et repli, super-armure des ennemis lourds, phases de boss à 66 % et 33 %.
- Joueur : M1 ×0,7, dégressifs, verrou de 0,38 s après le 3e coup ; temps de recharge ×1,3 ; invulnérabilité d'esquive ≤ 0,17 s ; ultime ×0,65.
- Vérifié par bots : le spam de M1 perd, le jeu propre gagne.
### Zones (`8k_zones.js`)
- 12 sections reliées par un volet d'encre. Salles à part : maison, Grande Porte (2800×1800, 3 vagues), arène (rival), terrain d'entraînement (Iruka), Créatif. L'état du joueur est conservé d'une zone à l'autre.
### Créatif (`8n_crea.js`) et mises en scène (`8m_set.js`)
- Galerie avec filtres, aperçu, variantes, cibles, ralenti, caméra, rejouer, hitbox, remise à zéro des cratères.
- 11 mises en scène : Chibaku, Mekkyaku, Daibakufu, Kirin, Rasenshuriken, golem, Bijūdama, Shinra, Amaterasu, Indra, Daikokuten. En jeu, elles sont débloquées par les étages de mode et la constellation.
### Scènes (`8o_scenes08.js`)
- 8 scènes en Histoire, déclenchées aux étapes p1, p2, p3, c1, c3, k1, k3 et end.
- 12 nouvelles vignettes : 34 au total.
