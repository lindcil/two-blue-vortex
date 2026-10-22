## v0.10.25 — Aide à la visée
- M1 et techniques visent le curseur, aimantés vers l’ennemi le plus proche du curseur (150 px / 17°).
- Sans souris (tactile, manette) : ennemi le plus proche.
- Réglage « Aim assist » (activé par défaut). Test tests/aim10.js.

## v0.10.24 — Zonage par lieux réels
- Le village entier est une seule zone (plus de frontière au milieu de Konoha, plus de changement de côté au bureau des missions).
- L’extérieur est une seconde zone : on change de zone uniquement en passant la grande porte.
- Le nom du quartier s’affiche discrètement quand on y entre.
- Test tests/zone10.js : traversée complète du village = 0 changement de zone.

## v0.10.23 — Performance
- Nombres de dégâts rendus une fois en sprite (texte −85 % CPU).
- Couleurs ombrées mises en cache ; au plus 24 textes flottants.

## v0.10.22 — Texte canvas, constellation, Susanoo
- Tout le texte dessiné sur le canvas passe par la langue (lieux, aides de mini-jeux, popups) ; audit : 0 manquant.
- Constellation : étoiles et tracés plus lisibles, libellés rapprochés, points plus gros, aide « Click a pulsing star… ».
- Susanoo de dos en diagonale : plus de visage visible à travers.
- Perf : police de la constellation mise en cache (plus de getComputedStyle à chaque image).

## v0.10.21 — Traduction complète
- Plus aucun texte manquant en anglais sur toute l’Histoire, Ta voie et les missions (test MISS vide).
- Titres de scènes, toasts de niveau/technique/réaction, menu touches traduits.
- Traductions idempotentes (corrige « Ura Renge (Hidden Lotus) (Hidden Lotus) »).

## v0.10.20 — Menus et techniques en anglais
- Menus, réglages, journal, dōjō, éditeur et réactions en anglais par défaut ; le français revient via l’option de langue.
- Noms de techniques : styles traduits (Fire Style, Wind Style…), noms japonais canon gardés, noms français traduits.
- Captures : screens/v10/ui/en-* et fr-*.

## v0.10.19 — Détente d’ultime, sceaux, Susanoo de dos
- Détente de l’ultime : image d’impact sombre (pas de flash), secousse, double onde de choc, poussière, écrasement/étirement.
- Sceaux à hauteur de poitrine, à l’échelle du héros.
- Susanoo vu de dos : arrière du crâne et colonne au lieu du visage.

## v0.10.18 — Mise en scène des ultimes
- Arbres, torii et tentes devant le héros s’estompent (fort pendant l’ultime) : le héros reste visible.
- HUD de quête masqué pendant les cinématiques (bandeau propre).
- Captures : screens/v10/ult/avant-* et apres-*.

## v0.10.17 — Torsion du buste, traduction
- Torsion : le buste s’incline vers la direction en diagonale (cisaillement léger), lecture 3/4 plus naturelle.
- Ura Renge traduit (Hidden Lotus) ; plus aucun texte manquant en anglais.
- Planche géants en 8 directions : screens/v10/look/geants-8directions.png.

## v0.10.16 — Missions rapprochées
- Missions hors murs : l’équipe part de la grande porte, camps juste au-delà (1,7–2,4 k px au lieu de 6–9,6 k).
- Chat, herbes, Kara rapprochés du bureau (1,2–2,1 k px).
- Test tests/mis10.js : marche réelle avec collisions, échoue au-delà de 2,6 k px.

## v0.10.15 — Audit des animations
- Chidori : course basse, main traînée en arrière (distinct du Rasengan).
- Ultime : accroupi (écrasement) → montée de puissance (tremblement) → détente étirée ; le visage reste visible.
- Planche d’audit : screens/v10/anim/.

## v0.10.14 — Sceaux Tigre, Dragon, Serpent lisibles
- Tigre : index+majeurs joints en une seule pointe.
- Dragon : mains en V, pouces et auriculaires tendus.
- Serpent : mains jointes en diagonale, poings entrelacés.

## v0.10.13 — Coiffures PNJ et géants orientés
- 7 coiffures génériques distinctes pour les PNJ (pointue, ébouriffée, plaquée, queue, ananas, carré, chignons) au lieu de clones des héros.
- Susanoo et bête géante suivent les 8 directions (compression de profil, dos estompé).

## v0.10.12 — Oreilles et lunettes
- Oreille en C à l arrière de la tête (plus de faux monocle).
- Lunettes de Sarada reculées, branche jusqu à l oreille.
- Tête du héros en jeu agrandie (x1.22).

## v0.10.11 — Visages : vrai profil anime
- Tête de profil : front, nez pointu, mâchoire, joue, oreille, cou.
- Contours colorés fins, cel-shading (ombre + liseré), œil en amande.
- Cheveux en mèches canon avec ombre et reflet ; franges au-dessus des yeux.
- Lunettes de Sarada recalées ; dos de tête refait ; LOD conservé.

## v0.10.10
- Visages refaits, plus doux : yeux simples avec reflet, bouche discrète, joues légères, cri et blessure adoucis. Plus de vue de face : la tête suit exactement le corps (profil, ou dos en montant).
- Cheveux : plus de traits d’encre dans la chevelure, les mèches s’arrêtent au front (les deux yeux restent visibles). Mitsuki canon (cheveux clairs, yeux de serpent dorés), Sarada yeux noirs.
- Lunettes en calque : deux verres, pont et branche. Marques violettes de Code/Jura retirées.

## v0.10.9
- Rig : jambes plus longues, épaules, col de veste, ceinture, vraies mains (paume + pouce), cape/écharpe à ressort.
- Vue de face et de dos à pleine largeur (seuls les ¾ sont compressés).

## v0.10.8
- Visages anime : yeux (iris, reflets, cils), sourcils, nez, bouche, expressions (neutre, colère, cri, blessé, clignement), dōjutsu dans l’œil (Sharingan, Byakugan, Jōgan).
- Coupes canon (Boruto, Sarada, Kawaki, Himawari, Code, Naruto, Sasuke, Mitsuki), moustaches Uzumaki, vraie vue de face, ¾ et de dos.
- Cou, respiration au repos, cheveux et bandeau à ressort. LOD : PNJ lointains simplifiés.

## v0.10.7
- Orientation 8 directions pour tous (héros, alliés, ennemis, PNJ) : rotation du corps, vue de dos en montant, tête et bras orientés.
- Attaques, techniques et esquives visent le vrai cap (souris, déplacement ou cible).

## v0.10.6
- Ta voie : le héros n’apparaît plus à l’autre bout de la carte (ancien recalage d’avant l’agrandissement). Les mannequins de la leçon 1 sont à côté de toi.
- Suivi de quête : flèche + distance, repère au sol sur l’objectif ; les leçons pointent les mannequins et le sensei.
- Mudrā : plus de texte, seulement les mains (12 sceaux canon + croix du Kage Bunshin), pop et halo de chakra.
- Test à pied : distance de marche donneur → objectif, leçon 1 jouée au clavier.

## v0.10.5
- Dialogues réécrits en anglais (voix propre à chaque personnage, répliques courtes) : histoire, Ta voie, PNJ, Iruka, rival, équipe, scènes QTE, objectifs et messages.
- Option Langue (menu pause) : EN par défaut, FR disponible. Textes dans lang/en.tsv, prêts pour la traduction.

## v0.10.4
- Quêtes réparées après l’agrandissement ×10 : camps des missions (bandits, Grimes, déserteur, Kurogane, escorte, Kara), vagues de la guerre, civils de l’examen, flammes du prologue, téléports des scènes, mode Créatif, embuscades, zone du chat Tora.
- Chapitre 1 : plus de blocage si les racines sont purifiées avant.
- Tests : audit d’atteignabilité de chaque objectif + bot qui joue Histoire, Ta voie et toutes les missions.

## v0.10.3
- Techniques de mode (Sharingan, Byakugan, Jōgan, Kāma, Ermite…) : animations faites main (anticipation, frappe, suite) + poses signatures (Gōkakyū, Amaterasu, Kaiten, Kirin…).

## v0.10.2
- Boucle à pas fixe + interpolation (fluide même à bas FPS), coût FPS nul.

# v0.10.1
- **Amaterasu** : vraies flammes noires (cœur noir opaque, liseré violet sombre, braises sombres), sans aucun orange.
- **Combo M1** : smears et impacts vérifiés image par image. Captures corrigées.
- **Éditeur** : les 17 nouvelles techniques sont dans la liste et l’export JSON.

# v0.10.0 — 17 nouvelles techniques canon
Chaque technique a sa propre pose d’incantation en images clés, ses couches VFX, ses prérequis dans la constellation et ses variantes.
- **Katon** : Zukokku, Bakufū Ranbu
- **Fūton** : Shinkū Renpa, Atsugai
- **Suiton** : Suikōdan, Bakusui Shōha
- **Raiton** : Chidori Eisō, Chidori Senbon
- **Doton** : Doroku Gaeshi, Retsudo Tenshō
- **Taijutsu** : Konoha Gōriki Senpū, Shishi Rendan
- **Ninjutsu** : Fūma Shuriken
- **Dōjutsu** : Hakke Kūshō (Hyūga), Shinra Tensei, Kamui (Uchiha), Amaterasu (Uchiha)

Les techniques élémentaires n’apparaissent que pour ton élément, les dōjutsu que pour ton clan.

# v0.9.9 — Fluidité
- **Poses** : mélange des poses par lissage exponentiel en temps réel, indépendant des FPS. Plus de saut entre repos, course, coup, réaction, dash et technique, pour le héros, les ennemis, les alliés et les PNJ.
- **Caméra et interface** : tremblement de caméra lissé (bruit continu), transitions douces des barres et panneaux.
- **Tests** : pas d’image déterministe (`SMOOTH10.manual` / `step`) pour des captures précises, avec un ennemi dans le champ.

# v0.9.8 — Constellation : l’espace mental
- **Image d’impact (cerveau) supprimée.** Transition douce : zoom sur le héros, puis un iris d’étoiles s’ouvre avec des étoiles étirées par la vitesse. La fermeture se fait en sens inverse.
- **Vide cosmique** : 3 couches d’étoiles en parallaxe et des nébuleuses qui dérivent.
- **Branches** : chaque branche est une constellation propre. Les étoiles acquises pulsent, les verrouillées restent pâles. Les techniques sont des glyphes satellites.
- **Navigation et déblocage** : survol, zoom à la molette, déplacement en glissant, double-clic pour recentrer. Le déblocage déclenche une onde, des étincelles et une ligne qui se trace.

# v0.9.7 — Grande carte et saut d’arbre
- **Cartes extérieures ×10 en surface** : décor, bâtiments, arbres, collisions, lumières, sections, PNJ, quêtes et ennemis passent à la nouvelle échelle. Tout le décor est plus grand. Les intérieurs ne changent pas. Les anciennes sauvegardes sont converties.
- **Bordures de zone** : aucun bâtiment n’est coupé. Les bâtiments sont recalés dans une seule section, et la bordure du mur d’enceinte passe sous le mur et la porte.
- **Vitesse** : déplacement ×1,9 à l’extérieur, course ninja ×2,6.
- **Saut d’arbre** : ESPACE pendant la course ninja fait bondir d’arbre en arbre en arc. Images rémanentes, lignes de vitesse, caméra qui recule, poussière et feuilles à l’atterrissage, pose de réception. Touche remappable. Forêts densifiées (environ 1 000 arbres).
- **Menu** : boutons « Écran titre » (sauvegarde puis retour au titre) et « Choix des jeux » (hub).

# v0.9.6 — Animations de base
- **Combo M1** : 3 poses distinctes (anticipation → frappe avec smear et étirement → prolongement → retour), hit-stop et étincelles orientées. Le finisseur a sa propre pose, un double smear et une onde de choc.
- **Dash** : images rémanentes, poussière au départ, penché, glissade de récupération.
- **Kawarimi** : nuage de fumée, bûche avec kunai et parchemin, réapparition dans le dos avec une traînée de lumière.
- **Autres mouvements** : réaction aux coups étirée avec étincelles, pose de garde bras croisés, course de Naruto.
- Tout est réglable dans `ANIM10`. L'équilibrage est inchangé.

# v0.9.5 — Susanoo fidèle à l'anime
- Couleur et armes selon l'utilisateur : Itachi en rouge (Totsuka, Yata), Sasuke en violet (arc et flèche), Madara en bleu (ailes et deux lames), Shisui en vert (lance et aiguilles), Kakashi en cyan (lame et shuriken Kamui).
- Halo translucide en couches et bord de flammes qui vacille.
- L'utilisateur flotte dans la cage thoracique.
- Formation teintée flamme → os → chair → armure, avec un rebond à la fin.
- Squash/stretch façon ZZZ sur les coups. La réduction des flashs reste respectée.
- Références dans RESEARCH.md.

# v0.9.4 — Entraînement et quêtes du jour
- **8 activités au terrain d'entraînement** (E près d'une station). Chacune donne de l'XP de branche, et 100 XP valent un point de constellation.
  - **Méditation d'ermite** : reste immobile dans le cercle pendant que l'énergie naturelle afflue. Des feuilles tourbillonnent, le crapaud Fukasaku veille et des ennemis viennent interrompre. Elle débloque le **Mode Ermite** (Z, 3 paliers).
  - **Casse-rochers**, **contrôle du chakra** (grimper à l'arbre ou marcher sur l'eau, C pour doser), **stand de shuriken**.
  - **Dōjutsu** : trouve le vrai parmi les clones. **Affinité élémentaire** : feuilles à couper.
  - **Parcours de vitesse**, **clones** à suivre dans l'ordre.
- **Quêtes du jour** : 3 par jour, qui changent chaque jour (par exemple « Casser 10 rochers »). Petit panneau MISSION en haut à droite. Récompenses, avec un point de constellation si les 3 sont faites.
- **Bonus quotidien** avec une série de jours.

# v0.9.3 — Éditeur de techniques
- **Créatif → ✎ Éditeur** :
  - curseurs pour le temps, les dégâts, le nombre, la vitesse, la taille et les effets ;
  - choix de l'élément, de la couleur, de la forme et du projectile ;
  - ajout ou retrait de couches d'effets, JSON éditable ;
  - Tester et Boucle, avec rendu immédiat ;
  - Exporter et Copier le JSON, Sauver ; création de techniques perso.
- Guide `ADDING_TECHNIQUES.md` : une technique = un bloc de données.

# v0.9.2 — Susanoo redessiné
- **Flammes de chakra translucides** au bord mouvant, qui scintillent même au repos.
- **Anatomie réelle** : colonne, 7 paires de côtes, clavicules, crâne et mâchoire, bras à deux os et mains.
- **Humanoïde** au visage de tengu : yeux en fente, crocs, collier de magatama.
- **Samouraï** : plaques du plastron, épaulières, casque à cimier, épée de flammes avec rubans à chaque coup, bouclier de Yata.
- **Susanoo parfait** : ailes à plumes, jupe de plaques et seconde paire d'yeux.
- **Assemblage progressif** à chaque palier, noyau lumineux autour du porteur, couleur propre à chaque joueur, caméra qui recule selon la taille.

# v0.9.1 — Techniques en données
- Les techniques s'écrivent désormais comme un simple bloc de données : temps d'incantation et de récupération, animation, zone d'effet (projectile, cercle, cône, faisceau, ruée, pluie, mur, chaîne), couches d'effets, son et variantes.
- 11 techniques intermédiaires refaites avec des effets en couches : Hōsenka, Karyū Endan (version maintenue : dragon de feu), Kamaitachi, Shinkūgyoku, Teppōdama, Raikyū, Raijū Tsuiga, Doryūdan, Haisekishō, Daitoppa, Nagashi.
- Les techniques des modes à étages reçoivent aussi les effets de leur élément.

# v0.9 — 21 octobre 2026 — Couche VFX et performances
- **Toutes les techniques ont des effets plus riches** : traînées, étincelles, éclats et marques au sol propres à chaque élément (langues de feu, gouttes, éclairs ramifiés, croissants de vent, éclats de roche). Anticipation à l'incantation, effets d'impact plus marqués. « Réduire les flashs » est respecté.
- **Performances** : effets lumineux pré-rendus, particules regroupées au dessin, rien de dessiné hors écran, et la qualité s'ajuste toute seule (budget de particules, résolution de rendu). Scène chargée en test : 11,4 → 14 images/s sur processeur ralenti ×4.

# v0.8 — 21 octobre 2026 — Modes, constellation, variantes, carte en sections, Créatif
- **Modes à étages** (C maintenu au-delà du max pour les dōjutsu, Z pour le manteau ; on monte d'étage en maintenant la touche, avec la jauge de combat) :
  - Sharingan 1 → 2 → 3 tomoe → Mangekyō → Susanoo côtes → squelette → humanoïde → samouraï → parfait (géant contrôlable, coups et techniques géants) ;
  - Byakugan (5 étages, puis Tenseigan), Jōgan (4), Kāma (4), manteau de chakra / bijū (5) ;
  - modes de clan : Nara, Akimichi, Yamanaka, Aburame, Inuzuka, Senju.
  - Susanoo redessiné façon anime : contour en flammes, armure, épée et ailes au stade parfait.
- **8 techniques par 2 pages** : la touche X (modifiable) tourne la page ; balayage sur mobile. 4 icônes, petit indicateur de page. Chaque étage a son ultime sur R.
- **Constellation** (T, ou ✦ sur mobile) : zoom sur le visage, impact dans l'esprit (version douce si « réduire les flashs »), puis l'espace mental. 7 branches, 24 nouvelles techniques canon, des étoiles « ? » cachées jusqu'à ce que les stats soient atteintes, 2e élément au niveau 8.
- **Ultimes refaits** : l'ultime de base dépend de ta branche dominante (Renge, Kokuangyō, Ōkasho, Senkō, élément ou clan). Plus jamais Susanoo d'office.
- **328 variantes de techniques** sur 64 techniques (4 à 6 chacune) : tap, maintien, dash, combo, aérien, recul, parade, mode, élément, duo, clone, terrain, PV bas. Exemple : Rasengan maintenu = un clone t'aide à former l'Ōdama.
- **IA bien plus maligne** : rôles de groupe (mêlée, flanc, distance, soutien), garde puis contre après 3 à 5 coups d'affilée, esquive des techniques annoncées, phases de boss. **Le spam de M1 perd.**
- **Joueur rééquilibré** : M1 plus faibles et dégressifs, temps de recharge ×1,3, esquive plus courte, ultime plus lent à charger.
- **Carte en 12 sections** avec transition à l'encre : maison, terrain d'entraînement (Iruka), arène (rival), et mission de la Grande Porte sur une grande zone à part.
- **Créatif** : carte de test avec galerie (filtres élément / type / rareté / variante), aperçu, mannequins et cibles, ralenti, caméra, rejouer, hitbox.
- **11 grandes scènes cinématiques** : Chibaku Tensei (vrai cratère), Gōka Mekkyaku, Daibakufu, Kirin, Rasenshuriken, golem Doton, Bijūdama, Shinra Tensei, Amaterasu, Flèche d'Indra, Daikokuten.
- **Nouvelles scènes** : 8 scènes en Histoire (le retour, les affiches, le rocher, la planque, Kawaki sur les toits, l'écho de Kurama, le serment, l'épilogue) et 12 nouvelles vignettes (34 au total).
- Missions un peu plus dures.

# v0.7 — 21 octobre 2026 — Scènes, techniques et commandes
- **Scènes mises en scène** : plus de carte générique pour les moments clés de Ta voie. Chacun a son décor animé :
  - salle de classe de l'Académie ;
  - cérémonie de remise des bandeaux ;
  - rencontre d'équipe sur un toit : le sensei et les deux coéquipiers se présentent un par un, puis tu choisis le nom de l'équipe (nom proposé, généré ou personnalisé), affiché sur un carton titre puis dans le journal et l'onglet Équipe ;
  - terrain des clochettes ;
  - bureau du Hokage pour le choix des missions ;
  - épreuve écrite de l'examen Chūnin : salle remplie de candidats qui écrivent (crayons animés), surveillant qui fait sa ronde, ton rival assis à côté, quiz chronométré de 3 questions ;
  - arène de l'examen avec ses spectateurs ;
  - camp de guerre de nuit.
- **Ellipses** : transitions au pinceau d'encre avec carton (« Le lendemain », « Quelques heures plus tard »…) et mini-montage de 2 à 3 cases. Elles t'amènent directement au bon endroit. Exemple : après l'écrit, direction Ichiraku avec Iruka pour un QTE de ramen (le bol se vide pendant que tu martèles), puis l'arène. En Histoire, des transitions marquent aussi le passage d'un chapitre à l'autre.
- **22 vignettes entre les missions**, façon Hinokami : repas d'équipe, entraînement avec le sensei, duel avec le rival, méditation sous la cascade, tir de shurikens, grimper aux arbres, marcher sur l'eau, pêche aux poissons rouges au festival, pêche avec un coéquipier, course pour le Hokage, chat Tora, visite à l'hôpital, discussion nocturne sur le toit, bains publics, autographes pour les élèves, leçon de l'ancien du clan, shōgi avec Shikamaru, concours de cuisine, étoiles filantes, combat d'entraînement, course de fond, parchemin du clan.
  - Chacune a son décor, un QTE léger (martèlement, timing, maintien, suite de touches, quiz) et une récompense : Endurance, Chakra, Force, lien, ryō ou technique.
  - Elles sont choisies selon le contexte (nuit, PV bas, celles pas encore vues) et toutes passables avec Échap ou « Passer ».
- **Techniques refondues** :
  - 15 techniques élémentaires : Hōsenka, Karyū Endan, Haisekishō, Daitoppa, Kamaitachi (boomerang), Shinkūgyoku, Suijinheki, Suirō, Teppōdama, Raikyū (en chaîne), Nagashi, Raijū Tsuiga, Doryūheki (bloque les projectiles), Doryūdan, Yomi Numa ;
  - 8 techniques de clan avancées : Sōshūha, Kaiten, Kubishibari, Nikudan Sensha, Shinranshin, Mushi Bunshin, Garōga, Jukai Kōtan ;
  - chacune a son animation et ses VFX propres.
- **Clan et techniques tirés au sort** en Ta voie : le clan est tiré à la naissance et la première technique dans ton élément. D'autres techniques se débloquent ensuite : au diplôme, à la 3e et à la 7e mission, et la technique de clan avancée en devenant Chūnin. On les équipe dans Menu › Ninjutsu. Le choix libre du clan et des techniques est réservé au nouveau mode **Créatif** (écran titre, aucune sauvegarde).
- **Commandes** (AZERTY par défaut, toutes modifiables) :
  - 1 2 3 4 : techniques ;
  - A ou clic droit : dash ;
  - Z (maintenu) : charge du manteau de chakra ;
  - C (maintenu) : charge de chakra. Au-delà du maximum, continuer à maintenir charge ton dōjutsu ou ton mode de clan (Sharingan, Byakugan…, Jōgan en Histoire).
  - Déplacement : flèches par défaut, ou préréglage ZQSD (la charge de mode passe alors sur F), choisi au premier lancement.
  - Rappels de touches, astuces et boutons tactiles (Z, C) mis à jour.
- **Course ninja** : après ~1,6 s de course, sprint bras en arrière. Lignes de vitesse, dézoom, traînées, poussière, images rémanentes, souffle du vent, légère inclinaison dans les virages et dérapage à l'arrêt. « Réduire les flashs » est respecté.
- **Carte agrandie** : elle passe de 3200×3000 à 4800×4400, avec Forêt de l'Est, Sanctuaire du renard, Avant-poste, Cascade, Lac du Miroir, Rizières, Ruines du Sud et Plateau des Pierres, plus des ponts et des chemins.
- Menu : bouton « Retour à la sélection des jeux » (sauvegarde, avec confirmation en plein combat).
- Inclut le correctif 0.6.2 : plus de pose « touché » figée pendant les scènes.

# v0.6.2 — 21 octobre 2026 (correctif)
- Ton personnage ne reste plus figé en pose « touché » (penché en arrière) pendant les scènes de chapitre. La pose de coup reçu du héros ne se terminait jamais et les alliés se figeaient pendant les cinématiques. Désormais, chaque début et fin de dialogue ou de scène remet tout le monde en pose de repos et te rend la main, dans les deux modes.

# v0.6.1 — 21 octobre 2026
- Porte du village : Kotetsu et Izumo montent la garde de part et d’utre de l’ouverture, ils ne bloquent plus le passage.

# Two Blue Vortex — Notes de version

## v0.6 — « Boutique & Kara » (21/10/2026)
- Boutique de Tenten (près de l'Armurerie, touche E) : écran plein façon gacha, cartes par rareté, aperçu animé de ton personnage avec la tenue. Pilule, parchemin d'ultime, kunai à sceau, 6 tenues à porter (gardées entre les parties).
- Arc Kara (après la fin de Ta voie) : Delta au nord-est, puis Kashin Kōji la nuit au camp sud-ouest, avec ton équipe.
- Onglet Journal : tes choix (rival, examen, Shukaku), missions, bijū apaisés, équipe.
- Carte : épingles pour la mission en cours, le bureau, la boutique et le bijū errant.
- Gyūki a ses cornes.
- Académie, leçon 3 plus simple : la technique OU un clone sur un mannequin suffit.

## v0.5 — « Vague 3 » (21/10/2026)
- Bijū errants (Ta voie, à partir de Chūnin) : Matatabi, Son Gokū et Gyūki rôdent hors des murs. Calme-les sous 35 % de PV pour gagner beaucoup d'XP et de ryō.
- Embuscades : des ninjas errants surgissent pendant que tu te promènes sans mission.
- Missions de rang S (Jōnin) : Escorte du daimyō, et Kara avec Kashin Kōji en boss. Les missions de rang A s'ouvrent dès Chūnin.
- Indicateur de sauvegarde automatique, en bas à droite.

## v0.4 — « Vague 1 » (21/10/2026)
- Réglage « Cinématiques d'ultime » : Toujours, La 1re fois (par défaut) ou Jamais. Les 15 ultimes ont été testés par script et touchent tous leurs cibles.
- Cut-in : vrai portrait en buste, cadrage serré.
- Caméra : roulis (angle hollandais) pendant les signes et la charge, recul à l'impact.
- Musique procédurale par ambiance : jour, nuit, combat, boss, titre. Réglage du volume.
- Villageois plus variés : enfants, anciens aux cheveux gris, marchands.
- Équilibrage : ennemis plus solides selon ton rang en Ta voie (Genin ×1,15, Chūnin ×1,4, Jōnin ×1,7), boss +25 %.
- Tactile : boutons Ultime et Esquive agrandis, toucher l'écran passe la cinématique.
- Branches de Ta voie rejouées par bot : choix « poursuivre » à l'examen et Shukaku sans « parler ».

## v0.3 — « Cinématiques » (20/10/2026)
- Ultimes façon Storm : courte séquence de 2,5 à 3,2 s qu'on peut passer (J / E / Échap). Bandes noires, zoom sur le lanceur, portrait en cut-in avec le nom de la technique, mudras, charge, lignes de vitesse vers la cible, impact puis ralenti, retour au jeu.
- Ultime pour chaque clan de Ta voie : Susanoo (Uchiha), Hakke 64 Shō (Hyūga), Kage Kubi Shibari (Nara), Chōdan Bakugeki (Akimichi), Shinranshin (Yamanaka), Mushidama (Aburame), Garōga (Inuzuka), Jukai Kōtan (Senju).
- Histoire : Kawaki lance Daikokuten (cubes signalés au sol), Sarada lance Susanoo contre Kurama. En Ta voie, les coéquipiers lancent leur ultime pendant les combats de boss.
- Mudras : tourbillon de chakra autour des mains, kanji lumineux à la couleur de l'élément pour chaque signe, étincelles, onde sur le dernier signe.
- Esquive : images rémanentes, lignes de vitesse, nuage de poussière, traînée teintée par l'élément, éclat au départ et à l'arrivée, coup de pinceau.
- La caméra ne sort plus de la carte. Ennemis un peu plus dangereux (+20 % de dégâts).
- Le cadre d'impact reste réservé aux points culminants et respecte « réduire les flashs ».

## v0.2 — « Ta voie » (20/10/2026)
**Animations & VFX (priorité)**
- Nouveau rig plus grand : idle, course (ninja run), chaîne M1 avec anticipation/smear/follow-through, incantation avec mudras dessinés, esquive, coup reçu, K.O. Squash & stretch, orientation cohérente.
- Vrais bijū : Kurama (9 queues) et Shukaku, queues qui ondulent, tête, gueule, rugissement.
- Séquence Bijūdama complète : rassemblement de particules, sphère sombre/claire compressée, avalée, tirée, onde de choc, dôme. Zone rouge au sol avant l'impact.
- VFX refaits : Rasengan, Chidori, Kirin (ciel noir + dragon), Katon, Suiton (dragon), Fūton, Doton, marques du Karma, Uzuhiko, techniques de clan.
- Nouvelle action Ultime (R / Y / 極), jauge qui se charge en combat.

**Typo & feel (recherche Fortnite/Epic, voir RESEARCH.md)**
- Lilita One (style Burbank) + Luckiest Guy pour les dégâts, police de secours pour ū/ō.
- Vie en vert, rouge réservé au danger. Chiffres de dégâts qui « pop », notes qui montent le long d'une chaîne, sons superposés, boutons rebondissants.

**Mode RPG « Ta voie »**
- Création : nom, clan (8) ou hasard, coiffure, couleurs. Élément tiré au sort à la naissance.
- Intro de clan, Académie (3 leçons), duel du rival, diplôme Genin, équipe de 2 coéquipiers + jōnin avec liens, test des clochettes.
- Missions D→S au bureau, rangs Genin → Chūnin → Jōnin.
- Arc original : rival, organisation criminelle, examen Chūnin (choix), Shukaku (choix selon le lien), guerre, fin qui dépend de tes choix.

**Histoire**
- Jura devient un vrai boss. Nouveau chapitre 2 « Kurama » : Kawaki, Himawari, combat contre Kurama avec Sarada.

**Corrections**
- Les mannequins restent dans le cercle. Les PNJ ne sont plus tous dessinés en déserteur ; villageois variés.
- Dialogues qui se relançaient en boucle avec E. Cinématique de naissance qui bloquait le héros.
- Bras qui pointaient vers le haut. Textes canvas en police par défaut.
- Équilibrage : PV des boss augmentés (Jura ×1.6, Kawaki ×1.5, Kurama ×1.4).

## v0.1 — « Tranche verticale » (20/10/2026)
- Prologue + Chapitre 1 (Fugitif) : Grimes sur la place, Embrasement à l'étal, Code, Sarada au belvédère, 2 zones Shinju, Jura.
- Combat : chaîne M1 en 3 coups, esquive (i-frames), 4 techniques (Rasengan, Shiden, Rappa, Kage Bunshin) avec mudras dessinés.
- 7 éléments (Katon, Fūton, Suiton, Raiton, Doton, Yin, Yang) et leurs réactions, avec icônes forme + kanji (lisibles en daltonien).
- Nouveau HUD sans barres : anneau de vie au sol, arc de chakra, arc de techniques au-dessus de la tête, flèche d'objectif.
- Konoha vivant : 12 PNJ avec routines, jour/nuit, dialogues, 3 quêtes annexes, camps, patrouilles, zones Shinju, POI.
- Accessibilité : ZQSD + flèches, tout remappable (2 touches par action), manette, tactile, taille du texte, daltonisme, réduction des flashs activée par défaut, mode basse conso, secousses réglables.
- XP ×5. Sauvegarde locale.
