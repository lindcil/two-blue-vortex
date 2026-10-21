# Two Blue Vortex — Recherche (20 oct. 2026)

## 1. Interface : finition, hiérarchie, « juice »
- **Hiérarchie par urgence de décision** : l'info vitale (PV, menace immédiate) au point focal ; le secondaire en périphérie, contextuel, qui s'efface ; le rare dans les menus. « Si tout est mis en avant, rien ne l'est. » — gamedesign.gg, *Game UI Design Patterns*.
- **Gameplay d'abord** (Returnal) : les infos critiques au plus près du point focal, certaines diégétiques autour du personnage ; les moments de quasi-mort mobilisent tous les canaux (vignette, animation, son). — blog.playstation.com, *Unpacking Returnal's UX design* (2021).
- **Diégétique ≠ dogme** : partir de l'information, pas de l'esthétique ; une UI « immersive » illisible sous pression a échoué ; un menu pause plat est très bien. — falcon.so, *Diegetic UI*.
- **Données empiriques** : la santé se lit mieux sur un HUD ; une ligne de navigation spatiale bat la mini-carte ; redondance icône + monde pour l'arme active. — ScienceDirect, *Comparison of FPS information displays* (2017).
- **Lisibilité à vitesse** : contour/ombre sur tout élément HUD, tester sur le fond le plus chargé.
- **Game feel** : réponse immédiate, buffer d'entrée < 150 ms, hit-stop 40–80 ms réservé aux impacts lourds, secousse proportionnée, squash & stretch, easing partout, le son porte la moitié de l'impact. — egmatic.com, *How to Make Your Game Feel Good* (2026) ; r/gamedesign (« juice = feedback »).

## 2. Minimalisme vs densité
- Persistant uniquement si la décision est seconde-à-seconde (PV pendant le combat). Le reste apparaît **quand il compte** : PV qui apparaissent quand on est touché, invites seulement près d'un interactif, objectif sur une ligne qui s'estompe.
- Ne pas cacher un état essentiel par minimalisme : densité adaptative (plus d'info en combat, presque rien en exploration).

## 3. Accessibilité
- Les 4 plaintes les plus fréquentes : **remappage, taille du texte, daltonisme, sous-titres**. — gameaccessibilityguidelines.com/basic.
- Jamais d'info par la couleur seule : forme, motif, icône, texte ; préréglages daltoniens utiles mais laisser le choix ; les filtres plein écran ne suffisent pas. — Accessible Games Initiative (mars 2025) ; IGDA GA-SIG.
- Texte : ≥ 18 px à 1080p sur PC, mise à l'échelle jusqu'à 200 % sans perte. — Xbox Accessibility Guideline 101.
- Police lisible et large, casse mixte, fond opaque derrière le texte. — RNIB Gaming Devkit.
- Moteur : vitesse de jeu réglable, contrôles larges et espacés au tactile, toute l'UI accessible avec le même périphérique, réglages sauvegardés, choix large de difficultés, tutoriel interactif, avancer le texte à son rythme.

## 4. Réactions élémentaires
- Genshin : un élément pose une **aura** (jauge qui décroît), un 2ᵉ élément la **consomme** pour une réaction ; coefficients différents selon l'ordre ; Anemo/Geo ne posent pas d'aura (ils déclenchent Swirl/Crystallize) ; Swirl **propage** l'aura aux voisins ; Electro-Charged fait coexister deux auras et tique 1×/s. — KQM TCL *Elemental Gauge Theory* ; Genshin Wiki.
- Leçons retenues : auras visibles et décroissantes, réactions lisibles (icône + nom court + couleur + forme), un élément « propagateur » (le Vent ≈ Anemo), une réaction à durée (Conduction ≈ Electro-Charged), contre-jeu (la Terre arrête la Foudre, comme dans Naruto).

## 5. Bien commencer un RPG
- Les 5 premières minutes répondent à : « Je peux le faire ? » (compétence), « Je comprends ? » (contexte), « Je veux la suite ? » (accroche). — gamedesign.gg, *The First 5 Minutes*.
- Un verbe à la fois, échec bon marché, découverte par la pratique (Celeste) ; 0–1 min un verbe qui fait du bien ; 3–6 min un 2ᵉ verbe puis la combinaison ; 6–10 min objectif lisible, boucle bouclée. — hayao.dev, *Onboarding*.
- « Le joueur est là pour jouer » : pas de pavé d'intro ; trois phrases max, le reste se découvre. — Rampant Games, *Four Guidelines for an RPG Introduction*.

## 6. Canon — Boruto: Two Blue Vortex (début)
- Trois ans après l'**Omnipotence** d'Eida (Ada), tout le monde croit que Boruto a tué Naruto ; seules **Sarada** et **Sumire** gardent la vérité. **Shikamaru** est Huitième Hokage. **Kawaki** veille sur Naruto et Hinata scellés dans la dimension du Daikokuten. **Himawari** s'entraîne avec Chōchō et doute.
- **Code** infiltre Konoha avec des **Marques de Griffe** et lâche ses **Claw Grimes** pour attirer Boruto ; Boruto revient et atterrit sur le visage de Code pour protéger Sarada (ch. 1). — Narutopedia *Boruto's Return Arc* ; Comic Book Revolution, GameRant, Siliconera (récaps ch. 1).
- Ensuite naissent les **clones du Shinju** (Jura, Hidari, Matsuri, Ryū…), groupe mystérieux qui vise Konoha ; l'un d'eux est lié à la disparition de Sasuke.

---
## v0.2 — Typographie Fortnite et « game feel » Epic

### Typographie
- Le logo et, longtemps, les menus de Fortnite utilisent **Burbank Big Condensed Black** (House Industries, police commerciale). Depuis le Chapitre 5, l'interface est passée à *Heading Now*. Les textes secondaires (fil des éliminations) sont en *Noto Sans*. Sources : fontkind.com/famous/fortnite-font, designyourway.net/blog/fortnite-font, madegooddesigns.com/what-font-does-fortnite-use.
- Équivalents libres (OFL) : Anton, Teko, Oswald, Barlow Condensed, Bebas Neue (le plus proche en compression : **Anton**).
- **Choix pour TBV :**
  - **Lilita One** pour l'interface (lourde, compacte, coins arrondis, lisible en petit, accents français complets) ;
  - **Luckiest Guy** pour les chiffres de dégâts, les réactions et les récompenses (aspect « pop » cartoon) ;
  - repli système : `Impact, 'Arial Black', system-ui`.
  - Les deux polices sont chargées sans bloquer le rendu (`media=print` + `onload`, `display=swap`).
- Règles : majuscules et chasse serrée pour les titres et les boutons, casse normale pour les dialogues (qui restent lisibles), contour encré épais sur tout texte posé dans le monde.

### « Game feel » satisfaisant (Epic / Fortnite)
- **Couleurs des chiffres de dégâts** (Fortnite) : bleu = bouclier, blanc = normal, jaune = critique. Dans TBV : blanc = normal, jaune = coup final de chaîne / critique, couleur de l'élément = réaction. Source : gamerjournalist.com (dégâts Fortnite Ch4).
- **Celia Hodent** (ancienne directrice UX d'Epic) recommande de réserver le rouge au danger : la vie du joueur doit être verte (ou d'une couleur neutre) pour que le rouge des dégâts ressorte. Elle conseille aussi de toujours afficher la touche de l'action contextuelle, pour réduire la charge mémoire. Les points faibles de la récolte jouent des notes qui montent quand on les enchaîne (récompense sonore). Sources : celiahodent.com/ux-practices-epic-games, Ars Technica « Fortnite UX Designer Breaks Down Fortnite's UI/UX ».
- **« Juice »** : flash au contact, particules d'impact, secousse, arrêt sur image (hit-stop), son réactif. Le retour doit **confirmer l'action et communiquer un état**, pas seulement décorer (r/gamedesign, « Game feel vs game juice »).
- **Application dans TBV v0.2 :**
  - chiffres de dégâts qui « pop » (×1,6 puis rebond à ×1) et s'empilent sans se chevaucher ;
  - la hauteur du son de frappe monte avec la chaîne ;
  - sons en couches : clic d'attaque + coup sourd + note ;
  - boutons qui rebondissent au survol et à l'appui, toasts de récompense avec dépassement (overshoot) ;
  - anneau de vie **vert**, rouge réservé aux dégâts et aux télégraphes ;
  - silhouettes lisibles : contour encré épais, grosse tête, une seule couleur dominante par personnage.

## v0.7 — Vendre la vitesse (course ninja)
Sources : notes de mise en scène des jeux et analyses vidéo (Naruto Storm 4/Connections, Demon Slayer Hinokami Chronicles, Dragon Ball Sparking! Zero, Genshin Impact sprint). Ce qu'ils utilisent :
- **Champ de vision / dézoom** : Storm et Sparking Zero élargissent le FOV de 5 à 10 % en sprint, puis le resserrent à l'arrêt. → Implémenté : dézoom de 8 %, avec lissage.
- **Lignes de vitesse en bord d'écran** (manga, Hinokami, Sparking Zero) : traits radiaux en périphérie, jamais au centre. → Implémenté : overlay léger, atténué avec « réduire les flashs ».
- **Traînées de vent / streaks** derrière le personnage (Genshin, Storm). → Implémenté : traits courts orientés selon la vitesse.
- **Bouffées de poussière aux appuis** (Genshin, Hinokami). → Implémenté : toutes les 0,16 s.
- **Images rémanentes / motion blur** (Storm, Hinokami). → Implémenté : fantômes bleutés espacés (plus espacés avec réduire les flashs).
- **Caméra en avance / retard** (lead) : la caméra anticipe la direction. → Déjà présent (suivi avec avance selon la vitesse), conservé.
- **Souffle du vent** (Genshin, Sparking Zero) : bruit filtré dont le volume suit la vitesse. → Implémenté (WebAudio, bruit passe-bande).
- **Légère inclinaison de l'écran dans les virages** (Storm, Sparking Zero). → Implémenté : 0,05 rad, amorti.
- **Dérapage à l'arrêt** (Storm, Hinokami) : écrasement, poussière, gravillons. → Implémenté.
- Non retenu : flou de mouvement plein écran (coûteux en 2D, risque d'inconfort), flash blanc d'accélération (contraire à « réduire les flashs »).
Pose : après ~1,6 s de course continue, le héros passe en sprint ninja (bras balayés vers l'arrière, buste penché à 0,85 rad, cadence d'animation ×1,5, 440 px/s au lieu de 260).

## v0.7 — Vignettes entre missions (référence : Demon Slayer Hinokami Chronicles)
Hinokami place entre les chapitres des « mémoires » et des mini-jeux courts (entraînement avec Shinobu, repas, exercices de souffle) : un décor dédié, deux ou trois répliques, une interaction simple (appui au bon moment, martèlement), une récompense. On garde cette structure : 22 vignettes de 20 à 40 s, toutes passables (Échap ou « Passer »), jouables au clavier, à la souris et au tactile.
