# Susanoo — références de l'anime (v0.9.5)
Sources : Narutopedia (naruto.fandom.com/wiki/Susanoo), naruto-wiki.com/wiki/susanoo, NamuWiki, Beebom.

## Stades (repris dans le jeu, de 1 à 5)
1. **Cage thoracique** : des côtes de chakra se forment autour de l'utilisateur comme une aura. C'est une défense de base qui peut se fissurer.
2. **Squelette et un bras** : un bras squelettique (parfois relié à la cage) qui peut déjà tenir une arme. Le crâne apparaît, avec des orbites lumineuses.
3. **Humanoïde** : muscles puis peau sur les os. Seule la moitié haute est formée, avec visage, crocs et sourcils.
4. **Armure (yamabushi)** : capuche et armure, nez de tengu, masque, boucles d'oreilles en magatama.
5. **Complet (Kanseitai)** : forme colossale stabilisée, avec ailes, robes et armure ornée.

## Utilisateurs, couleurs et armes
| Utilisateur | Couleur (anime) | Signes distinctifs |
|---|---|---|
| Itachi | rouge (orange à l'état humanoïde) | Épée de Totsuka (lame de flamme sortant d'une jarre de saké), miroir de Yata, Yasaka no Magatama |
| Sasuke | violet | Cornes, sourire démoniaque, dents dentelées ; arc et flèches, sabres, flammes noires |
| Madara | bleu foncé | Tengu bleu, ailes, deux lames en forme de kriss/katana |
| Obito | bleu | |
| Kakashi | bleu clair / cyan | Katana, shuriken en forme de Kamui |
| Shisui | vert | Lance/épée et aiguilles de chakra |

## Règles visuelles retenues
- Corps en chakra translucide, en couches superposées, avec un bord lumineux et des flammes qui vacillent vers le haut.
- L'utilisateur flotte au centre de la cage, dans un noyau de chakra.
- Montée en puissance dans l'ordre flamme → os → chair → armure : d'abord des braises qui convergent, puis une teinte qui change selon la phase, puis un petit rebond à la fin.
- Attaques avec squash/stretch façon ZZZ : on se ramasse avant le coup, on s'étire pendant, puis le rebond. La réduction des flashs reste respectée.

# Animations de base — références (v0.9.6)
- **Naruto Storm (CyberConnect2)** : combo de corps à corps en 3 à 5 coups, chacun avec une pose propre (jab, coup de pied tournant, finisseur qui projette). Le Kawarimi laisse un nuage de fumée et une bûche, puis le personnage réapparaît dans le dos de l'ennemi. Course de Naruto avec les bras en arrière et le corps penché.
- **Demon Slayer : Hinokami Chronicles** : smear frames et traînées sur chaque frappe, hit-stop court sur les coups légers et long sur le finisseur, étincelles orientées dans le sens du coup.
- **Zenless Zone Zero** : anticipation marquée (compression), étirement pendant la frappe, prolongement puis rebond. Dash avec des images rémanentes, de la poussière au départ et une glissade de récupération. L'impact est lisible sans flash plein écran.
- **Principes retenus** : anticipation → frappe (smear et étirement) → prolongement → retour. Hit-stop d'environ 40 ms sur les coups normaux et 90 ms sur le finisseur. Les étincelles partent dans le sens du coup. Tout est réglable dans la table `ANIM10` (`src/8v_anim10.js`).
