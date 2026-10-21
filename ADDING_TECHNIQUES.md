# Ajouter une technique (v0.9)

Une technique est **un bloc de données**. Il n'y a aucun code moteur à écrire.

## 1. Le bloc
Ajoute une entrée dans `src/8q_tech9.js` (tableau `D`), ou appelle `TECH9.def({...})` depuis n'importe quel fichier `src/8*.js` :

```js
TECH9.def({
  id: 'suiryudan9', n: 'Suiton : Suiryūdan', el: 'water', glyph: '龍', cd: 7, ch: 30, sign: 'tora',
  cast: 0.35, end: 0.3,                                     // incantation (anticipation) et récupération, en s
  anim: [{ t: 0, sq: 0.3 }, { t: 0.35, sq: -0.3, lunge: -10, shake: 0.1 }],   // images clés : écrasement, recul, invulnérabilité, VFX
  hit: { shape: 'proj', n: 1, sp: 560, r: 30, life: 1.3, dmg: 34, home: 1, body: 'beast', aoe: 120 },
  vfx: { charge: 'water.charge', muzzle: 'water.muzzle', travel: 'water.travel',
         impact: ['water.impact', { fx: 'splash', n: 16 }, { fx: 'cam', shake: 0.2 }] },
  sfx: 'tech',
  variants: { hold: { hit: { n: 2, spread: 0.4 } }, terrain: { mul: { dmg: 1.3, r: 1.4 } } },
});
```

- **Formes** (`hit.shape`) :
  - `proj` : n, every, spread, jit, sp, r, life, pierce, home, boom, aoe, ret (boomerang), wave, grav, spin, body ;
  - `circle` : at self|aim|foe, r, delay (avec télégraphe), ticks ;
  - `cone` : range, arc ;
  - `beam` : L, w, ticks ;
  - `dash` : D, dur ;
  - `rain` : n, every, r ;
  - `wall` : len, h, life (bloque les projectiles ennemis) ;
  - `chain` : n, jump, falloff.
- **Effets communs** : dmg, kb, stun, slow, push, pull, big.
- **Corps des projectiles** (`hit.body`) : orb, flame, drop, blade, bolt, rock, beast.
- **Variantes** : les clés sont les contextes de VAR8 (hold, dash, combo, air, back, parry, mode, elem2, duo, clone, wall, low). Une variante fusionne ses champs dans le bloc ; `mul` multiplie les valeurs numériques de `hit`.

## 2. Les couches VFX
Une phase (charge, muzzle, travel, impact, after, tele) prend un nom de préréglage (`'fire.impact'`) ou une liste de couches.

- Chaque couche accepte `{ fx, …paramètres, at (délai), p (probabilité), tier (palier de qualité minimum), ox/oy }`.
- **Primitives** :

| Famille | Primitives |
|---|---|
| Lumière | glow, star |
| Particules | burst (sprite : ember, drop, shard, cres, dust, leaf, wisp, glow, core), licks (flammes), splash (gouttes), chunks (éclats de roche), dustc, smoke |
| Formes | ring, shock, arcs (éclairs ramifiés), bolt (foudre du ciel), crescents (vent), beam |
| Sol et sillage | decal (scorch, crack, splat, slash, burn), trail (ruban) |
| Écran et son | dist (distorsion), screen (flash qui respecte « réduire les flashs », ou dark), cam (shake, zoom, hitstop), sfx |

- **Préréglages** par élément : fire, water, bolt, wind, earth, yin, yang, none. Chacun contient charge, muzzle, travel, impact et big.
- Tous les projectiles et tous les coups élémentaires du jeu reçoivent automatiquement la traînée et l'impact de leur élément.

## 3. Tester en direct
Dans Créatif, ouvre **✎ Éditeur**. Tu peux :
- régler les curseurs, l'élément, la couleur, la forme et le corps ;
- ajouter ou retirer des couches, ou éditer le JSON ;
- cliquer sur **Tester** (ou **Boucle**) pour voir le résultat tout de suite ;
- **Exporter** le JSON et le coller dans `D`.

« Sauver » garde tes techniques dans le navigateur.

## 4. Modes
Les paliers de mode sont des données (`MODE08.F`). `MODE08.defFamily(id, { n, c, key, st: [{ n, sus, sk: [S8(...)], ult: [...] }] })` ajoute une famille complète. Les compétences de palier reçoivent les couches de leur élément.
