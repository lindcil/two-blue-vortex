// v0.10.0 — Nouvelles techniques canon (données TECH9) : pose propre à chacune (images clés), couches VFX dédiées,
// prérequis dans la constellation (stats de branche), variantes. Ajouter/régler une technique = modifier ce tableau.
(() => { if (!window.TECH9 || !window.TREE8) return;
  // ---------- poses d'incantation en images clés (q = 0..1 sur la durée du cast) ----------
  const run0 = TECH9.run.bind(TECH9); TECH9.run = function (u, id, v) { const r = run0(u, id, v); const M = this.get(id, v); if (M && M.pose && u.act && u.act.k === 'cast') u.act.pose10 = M.pose; return r; };
  const sm = (k) => k * k * (3 - 2 * k);
  const po = poseOf; poseOf = function (u) { const P = po(u), a = u && u.act; if (!a || a.k !== 'cast' || !a.pose10) return P; const K = a.pose10, q = Math.max(0, Math.min(1, a.t / a.dur)); let i = 0; while (i < K.length - 1 && K[i + 1][0] <= q) i++;
    const A = { ...STANCE, ...K[i][1] }, B = K[i + 1] ? { ...STANCE, ...K[i + 1][1] } : A, span = K[i + 1] ? K[i + 1][0] - K[i][0] : 1; return mixP(A, B, K[i + 1] ? sm((q - K[i][0]) / span) : 1); };
  const P = { // bibliothèque de poses (réutilisées comme points de départ, chaque technique compose les siennes)
    sign: { aF: 1.2, eF: 2.2, aB: 1.2, eB: 2.2, lean: 0.05, head: 0.1, sy: 0.96, sx: 1.04 }, breath: { aF: 1.0, eF: 2.0, aB: 0.9, eB: 2.1, lean: -0.25, head: -0.3, sy: 1.08, sx: 0.94, by: -2, mouth: 1 },
    blow: { aF: 1.3, eF: 1.9, aB: 0.6, eB: 1.6, lean: 0.4, head: 0.25, sx: 1.18, sy: 0.88, mouth: 1 }, palmF: { aF: 1.62, eF: 0, aB: -0.8, eB: 0.6, lean: 0.5, hF: 0.8, kF: -0.3, hB: -0.7, kB: -0.4, sx: 1.2, sy: 0.86 },
    crouch: { by: 8, sy: 0.82, sx: 1.12, hF: 1.0, kF: -1.6, hB: -0.6, kB: -1.5, lean: 0.25 }, slam: { by: 6, aF: 2.6, eF: 0.3, aB: 2.4, eB: 0.3, lean: 0.7, sy: 0.8, sx: 1.22, hF: 1.1, kF: -1.4, hB: -0.8, kB: -1.0 },
    spin: { aF: 1.6, eF: 0.2, aB: -1.6, eB: 0.2, hF: 1.6, kF: -0.1, hB: -0.2, kB: -0.4, lean: -0.2, rot: 0.3 }, throw: { aF: 2.4, eF: 0.6, aB: -0.6, eB: 1.0, lean: -0.3, sx: 0.92, sy: 1.08, head: -0.1 }, release: { aF: 1.5, eF: 0.0, aB: -0.9, eB: 0.5, lean: 0.55, sx: 1.22, sy: 0.85, hF: 0.7, kF: -0.2, hB: -0.7 },
    eye: { aF: 1.9, eF: 2.6, aB: 0.5, eB: 1.6, head: 0.15, lean: 0.05, sx: 1, sy: 1.02 }, arms: { aF: 2.8, eF: 0.4, aB: 2.7, eB: 0.4, lean: -0.1, sy: 1.1, sx: 0.92, by: -4, head: -0.2, mouth: 1 } };
  const k = (...a) => a; // [q, pose]
  const D = [
    // ---- Katon
    { id: 'zukokku', n: 'Katon : Zukokku', el: 'fire', glyph: '劫', cd: 8, ch: 30, sign: 'tora', cast: 0.45, end: 0.4, cat: 'fire', req: { elem: 6, nin: 3 },
      pose: [k(0, P.sign), k(0.45, { ...P.breath, by: -4 }), k(0.55, P.blow), k(1, { ...P.blow, lean: 0.55 })], anim: [{ t: 0.45, sq: -0.3, shake: 0.2 }],
      hit: { shape: 'cone', range: 420, arc: 0.85, dmg: 34, kb: 2, big: 1 },
      vfx: { charge: ['fire.charge', { fx: 'licks', n: 3, w: 18 }], muzzle: [{ fx: 'dist', r: 140, c: '#ff4a1a' }, { fx: 'licks', n: 14, w: 60 }, { fx: 'cam', shake: 0.25, hitstop: 0.04 }], travel: [{ fx: 'licks', n: 3, w: 46, size: [14, 26] }, { fx: 'smoke', n: 1 }], impact: ['fire.impact', { fx: 'decal', dk: 'scorch', r: 60 }] },
      variants: { hold: { hit: { range: 560, arc: 1.1, dmg: 42 }, cast: 0.7 }, terrain: { hit: { arc: 1.4 } } } },
    { id: 'bakufu', n: 'Katon : Bakufū Ranbu', el: 'fire', glyph: '爆', cd: 7, ch: 26, sign: 'mi', cast: 0.3, end: 0.35, cat: 'fire', req: { elem: 4, ctrl: 2 },
      pose: [k(0, P.crouch), k(0.5, { ...P.spin, rot: -0.3 }), k(0.75, { ...P.spin, rot: 0.4, aF: 2.2, aB: -2.0 }), k(1, P.spin)], anim: [{ t: 0.2, sq: 0.2 }, { t: 0.3, sq: -0.25 }],
      hit: { shape: 'circle', at: 'self', r: 190, dmg: 26, kb: 1.6, ticks: 2, every: 0.35 },
      vfx: { charge: 'fire.charge', impact: [{ fx: 'licks', n: 18, w: 170 }, { fx: 'ring', r: 190, c: '#ff7a22', life: 0.35 }, { fx: 'burst', n: 24, c: ['#ffb13d', '#ff4a1a'], spr: 'ember', sp: [200, 420], size: [2, 4] }, { fx: 'decal', dk: 'scorch', r: 150, oy: 20 }, { fx: 'cam', shake: 0.18 }] },
      variants: { air: { hit: { r: 240 } } } },
    // ---- Fūton
    { id: 'renpa', n: 'Fūton : Shinkū Renpa', el: 'wind', glyph: '連', cd: 5, ch: 22, sign: 'tori', cast: 0.18, end: 0.3, cat: 'wind', req: { elem: 3, tai: 1 },
      pose: [k(0, { ...P.breath, lean: -0.3 }), k(0.4, P.blow), k(0.7, { ...P.blow, aF: 0.6, lean: 0.6 }), k(1, P.blow)], anim: [{ t: 0.18, sq: -0.2, lunge: -6 }],
      hit: { shape: 'proj', n: 3, every: 0.08, aimEach: 1, spread: 0.25, jit: 0.2, sp: 900, r: 22, life: 0.5, dmg: 11, pierce: 1, body: 'blade' },
      vfx: { charge: 'wind.charge', muzzle: [{ fx: 'ring', r: 36, c: '#d8fff2', life: 0.15 }, { fx: 'crescents', n: 2, dir: 0, spread: 0.2 }], travel: [{ fx: 'crescents', n: 1, sp: [20, 60], size: [6, 10], life: [0.1, 0.16] }], impact: 'wind.impact' },
      variants: { combo: { hit: { n: 5, every: 0.06 } }, dash: { hit: { shape: 'dash', D: 240, dmg: 16, r: 70 } } } },
    { id: 'atsugai', n: 'Fūton : Atsugai', el: 'wind', glyph: '圧', cd: 9, ch: 34, sign: 'tatsu', cast: 0.5, end: 0.3, cat: 'wind', req: { elem: 8, nin: 4 },
      pose: [k(0, P.sign), k(0.5, { ...P.breath, by: -6, sy: 1.12 }), k(0.62, { ...P.blow, sx: 1.3, sy: 0.8 }), k(1, P.blow)], anim: [{ t: 0.5, sq: -0.35, shake: 0.2 }],
      hit: { shape: 'circle', at: 'foe', range: 460, r: 170, dmg: 44, delay: 0.35, big: 1, push: 500 },
      vfx: { charge: ['wind.charge', { fx: 'dist', r: 60, c: '#d8fff2' }], tele: [{ fx: 'burst', conv: 1, n: 16, c: ['#d8fff2', '#7fffd4'], spr: 'wisp', sp: [120, 260], size: [6, 10] }], impact: [{ fx: 'dist', r: 190, c: '#bfffe0' }, { fx: 'shock', c: '#d8fff2', r: 210, w: 12 }, { fx: 'crescents', n: 10, dir: 0, spread: 3.1, sp: [400, 700] }, { fx: 'dustc', n: 10, c: '#c9d3e6' }, { fx: 'cam', shake: 0.3, hitstop: 0.05 }] } },
    // ---- Suiton
    { id: 'suikodan', n: 'Suiton : Suikōdan', el: 'water', glyph: '鮫', cd: 6, ch: 26, sign: 'tora', cast: 0.3, end: 0.2, cat: 'water', req: { elem: 3, nin: 1 },
      pose: [k(0, P.sign), k(0.4, { ...P.throw, aF: 2.0 }), k(0.6, P.release), k(1, P.release)], anim: [{ t: 0.3, sq: -0.25, lunge: 8 }],
      hit: { shape: 'proj', n: 1, sp: 640, r: 24, life: 1.2, dmg: 30, home: 1, body: 'beast', aoe: 80 }, c: '#4aa8ff',
      vfx: { charge: ['water.charge', { fx: 'splash', n: 4 }], muzzle: ['water.muzzle', { fx: 'splash', n: 8 }], travel: [{ fx: 'burst', n: 1, c: ['#8fd3ff'], spr: 'drop', sp: [40, 120], size: [3, 5], add: 0, g: 400 }], impact: ['water.impact', { fx: 'splash', n: 14, s: 1.4 }] },
      variants: { clone: { hit: { n: 3, spread: 0.4, dmg: 20 } } } },
    { id: 'bakusui', n: 'Suiton : Bakusui Shōha', el: 'water', glyph: '波', cd: 10, ch: 36, sign: 'ushi', cast: 0.5, end: 0.4, cat: 'water', req: { elem: 8, ctrl: 3 },
      pose: [k(0, P.breath), k(0.5, { ...P.breath, by: -8, sy: 1.15, head: -0.4 }), k(0.6, { ...P.slam, by: 0 }), k(1, P.slam)], anim: [{ t: 0.5, sq: -0.4, shake: 0.3 }],
      hit: { shape: 'circle', at: 'self', r: 280, dmg: 30, kb: 2.5, push: 600, slow: 1.5 },
      vfx: { charge: ['water.charge', { fx: 'burst', conv: 1, n: 12, c: ['#8fd3ff'], spr: 'drop', sp: [80, 180], add: 0 }], impact: [{ fx: 'splash', n: 30, s: 2 }, { fx: 'ring', r: 280, c: '#8fd3ff', life: 0.45 }, { fx: 'shock', c: '#4aa8ff', r: 300, w: 16 }, { fx: 'decal', dk: 'splat', r: 220, c: '#2a6fd0', oy: 20 }, { fx: 'cam', shake: 0.3 }] },
      variants: { terrain: { hit: { r: 340 } } } },
    // ---- Raiton
    { id: 'eiso', n: 'Raiton : Chidori Eisō', el: 'bolt', glyph: '鋭', cd: 6, ch: 26, sign: 'saru', cast: 0.25, end: 0.3, cat: 'bolt', req: { elem: 5, nin: 2 },
      pose: [k(0, { ...P.throw, aF: -0.4, eF: 1.8 }), k(0.45, { ...P.palmF, sx: 1.3, sy: 0.8, lean: 0.7 }), k(1, P.palmF)], anim: [{ t: 0.25, sq: -0.3, lunge: 10 }],
      hit: { shape: 'beam', L: 520, w: 12, dmg: 36, dur: 0.25, stun: 0.6 }, c: '#e6d8ff',
      vfx: { charge: ['bolt.charge', { fx: 'arcs', n: 3, r: [20, 40] }], muzzle: [{ fx: 'star', c: '#ffffff', size: 22 }, { fx: 'arcs', n: 6, r: [40, 90] }, { fx: 'cam', shake: 0.15 }], impact: 'bolt.impact' },
      variants: { parry: { hit: { stun: 1.4 } }, hold: { hit: { L: 700, w: 18, dmg: 44 }, cast: 0.45 } } },
    { id: 'csenbon', n: 'Raiton : Chidori Senbon', el: 'bolt', glyph: '針', cd: 4.5, ch: 20, sign: 'tora', cast: 0.16, end: 0.2, cat: 'bolt', req: { elem: 2 },
      pose: [k(0, { ...P.throw, aF: 2.8 }), k(0.5, { ...P.release, aF: 1.2 }), k(1, P.release)], anim: [{ t: 0.16, sq: -0.2 }],
      hit: { shape: 'proj', n: 7, spread: 0.12, sp: 1100, r: 8, life: 0.45, dmg: 5.5, body: 'bolt', stun: 0.15 }, c: '#e6d8ff',
      vfx: { muzzle: [{ fx: 'arcs', n: 4, r: [20, 50] }, { fx: 'glow', r: 40, c: '#b98cff', life: 0.15 }], travel: [{ fx: 'burst', n: 0.5, c: ['#e6d8ff'], spr: 'ember', sp: [20, 60], size: [1, 2], life: [0.08, 0.14] }], impact: [{ fx: 'arcs', n: 2, r: [14, 30] }] },
      variants: { air: { hit: { n: 11, spread: 0.18 } } } },
    // ---- Doton
    { id: 'dorokug', n: 'Doton : Doroku Gaeshi', el: 'earth', glyph: '返', cd: 8, ch: 24, sign: 'i', cast: 0.3, end: 0.3, cat: 'earth', req: { elem: 3, ctrl: 1 },
      pose: [k(0, P.crouch), k(0.5, { ...P.slam, aF: 2.9, aB: 2.8 }), k(0.65, { ...P.slam, aF: 0.4, aB: 0.4, by: 10, sy: 0.75 }), k(1, P.slam)], anim: [{ t: 0.3, sq: -0.4, shake: 0.2, vfx: [{ fx: 'chunks', n: 10, oy: 40 }] }],
      hit: { shape: 'wall', dist: 90, len: 200, h: 130, dmg: 12, life: 4 }, c: '#8a6a44',
      vfx: { charge: 'earth.charge', impact: [{ fx: 'chunks', n: 14 }, { fx: 'dustc', n: 10 }, { fx: 'decal', dk: 'crack', r: 90, oy: 20 }], travel: [{ fx: 'dustc', n: 3 }] } },
    { id: 'retsudo', n: 'Doton : Retsudo Tenshō', el: 'earth', glyph: '転', cd: 9, ch: 32, sign: 'mi', cast: 0.42, end: 0.4, cat: 'earth', req: { elem: 7, tai: 2 },
      pose: [k(0, P.sign), k(0.4, { ...P.arms, by: -6 }), k(0.55, { ...P.slam, by: 12, sy: 0.72, sx: 1.3 }), k(1, P.slam)], anim: [{ t: 0.42, sq: -0.45, shake: 0.35 }],
      hit: { shape: 'cone', range: 380, arc: 0.7, dmg: 32, kb: 2.2, push: 400, slow: 1 },
      vfx: { charge: 'earth.charge', muzzle: [{ fx: 'shock', c: '#d6b98a', r: 120, w: 10 }, { fx: 'cam', shake: 0.3, hitstop: 0.05 }], travel: [{ fx: 'chunks', n: 2 }, { fx: 'dustc', n: 2 }, { fx: 'decal', dk: 'crack', r: 40 }], impact: 'earth.impact' } },
    // ---- Taijutsu
    { id: 'goriki', n: 'Konoha Gōriki Senpū', el: 'yang', glyph: '旋', cd: 5, ch: 14, sign: 'ne', cast: 0.18, end: 0.3, cat: 'tai', req: { tai: 3, body: 2 },
      pose: [k(0, P.crouch), k(0.35, { ...P.spin, hF: 2.0, rot: -0.5, by: -10 }), k(0.7, { ...P.spin, hF: 1.8, rot: 0.6, by: -8, sx: 1.25, sy: 0.85 }), k(1, P.spin)], anim: [{ t: 0.1, sq: 0.25 }, { t: 0.18, sq: -0.3, shake: 0.1 }],
      hit: { shape: 'circle', at: 'self', r: 130, dmg: 22, kb: 2.6 }, c: '#7ad07a',
      vfx: { impact: [{ fx: 'crescents', n: 8, dir: 0, spread: 3.1, sp: [300, 500], size: [12, 18] }, { fx: 'ring', r: 140, c: '#d8fff2', life: 0.25 }, { fx: 'dustc', n: 8, c: '#c9b08a' }, { fx: 'cam', shake: 0.15, hitstop: 0.05 }] },
      variants: { combo: { hit: { dmg: 30, r: 150 } }, air: { hit: { r: 170 } } } },
    { id: 'shishi', n: 'Shishi Rendan', el: 'yang', glyph: '獅', cd: 7, ch: 18, sign: 'tora', cast: 0.12, end: 0.3, cat: 'tai', req: { tai: 6, body: 4 },
      pose: [k(0, { ...P.crouch, lean: 0.7 }), k(0.5, { ...P.palmF, hF: 2.2, kF: -0.1, lean: -0.3, by: -16 }), k(0.8, { ...P.slam, by: 4 }), k(1, P.slam)], anim: [{ t: 0.12, sq: -0.3 }, { t: 0.32, shake: 0.25 }],
      hit: { shape: 'dash', D: 300, dur: 0.24, r: 70, dmg: 40, big: 1 }, c: '#ffd166',
      vfx: { travel: [{ fx: 'dustc', n: 1 }, { fx: 'burst', n: 1, c: ['#ffd166'], spr: 'ember', sp: [60, 160], size: [2, 3] }], impact: [{ fx: 'star', c: '#ffd166', size: 32 }, { fx: 'shock', c: '#ffffff', r: 140, w: 8 }, { fx: 'chunks', n: 8 }, { fx: 'decal', dk: 'crack', r: 70, oy: 30 }, { fx: 'cam', shake: 0.3, hitstop: 0.08 }] },
      variants: { dash: { hit: { D: 400 } } } },
    // ---- Ninjutsu
    { id: 'fuma', n: 'Fūma Shuriken', el: 'yang', glyph: '風', cd: 5, ch: 12, sign: 'ne', cast: 0.28, end: 0.25, cat: 'nin', req: { nin: 2, body: 1 },
      pose: [k(0, { ...P.throw, aF: 3.0, eF: 0.8, lean: -0.45 }), k(0.55, { ...P.release, lean: 0.6 }), k(1, P.release)], anim: [{ t: 0.28, sq: -0.25, lunge: 6 }],
      hit: { shape: 'proj', n: 1, sp: 700, r: 34, life: 1.3, dmg: 24, pierce: 1, ret: 1, spin: 1, body: 'blade' }, c: '#c8ced8',
      vfx: { muzzle: [{ fx: 'crescents', n: 2, dir: 0, spread: 0.3 }], travel: [{ fx: 'burst', n: 0.6, c: ['#ffffff'], spr: 'ember', sp: [30, 80], size: [1, 2], life: [0.1, 0.16] }], impact: [{ fx: 'star', c: '#ffffff', size: 18 }, { fx: 'burst', n: 8, c: ['#ffd166', '#ffffff'], spr: 'ember', sp: [120, 260], size: [1.5, 3] }] },
      variants: { clone: { hit: { n: 2, spread: 0.6, dmg: 18 } } } },
    // ---- Dōjutsu
    { id: 'kusho', n: 'Hakke Kūshō', el: 'yang', glyph: '空', cd: 5, ch: 18, sign: 'ne', cast: 0.2, end: 0.25, cat: 'eye', clan: ['hyuga'], req: { clan: 2, tai: 2 },
      pose: [k(0, { ...P.eye, aF: -0.2 }), k(0.4, { ...P.crouch, aF: 0.4, eF: 2.2 }), k(0.55, { ...P.palmF, sx: 1.3, sy: 0.8 }), k(1, P.palmF)], anim: [{ t: 0.2, sq: -0.3, lunge: 10 }],
      hit: { shape: 'cone', range: 300, arc: 0.4, dmg: 24, kb: 3, push: 800 }, c: '#d8e6ff',
      vfx: { charge: [{ fx: 'glow', r: 30, c: '#d8e6ff', life: 0.25 }], muzzle: [{ fx: 'dist', r: 110, c: '#d8e6ff' }, { fx: 'ring', r: 60, c: '#ffffff', life: 0.2 }, { fx: 'cam', shake: 0.15, hitstop: 0.04 }], travel: [{ fx: 'ring', r: 30, c: '#d8e6ff', life: 0.15 }], impact: [{ fx: 'shock', c: '#ffffff', r: 90, w: 6 }] },
      variants: { hold: { hit: { range: 420, dmg: 34 }, cast: 0.4 } } },
    { id: 'shinra', n: 'Shinra Tensei', el: 'yin', glyph: '神', cd: 14, ch: 40, sign: 'mi', cast: 0.5, end: 0.4, cat: 'eye', req: { clan: 8, gen: 4 },
      pose: [k(0, P.eye), k(0.5, { ...P.arms, aF: 1.6, aB: 1.6, eF: 0.2, eB: 0.2, by: -6 }), k(0.6, { ...P.arms, aF: 0.9, aB: 0.9, sx: 1.15, sy: 0.9 }), k(1, P.arms)], anim: [{ t: 0.5, sq: -0.3, shake: 0.45, iframe: 0.4 }],
      hit: { shape: 'circle', at: 'self', r: 340, dmg: 40, kb: 4, push: 1100, big: 1 }, c: '#c8b8ff',
      vfx: { charge: [{ fx: 'burst', conv: 1, n: 20, c: ['#c8b8ff', '#ffffff'], spr: 'wisp', sp: [160, 300], size: [5, 9] }, { fx: 'dist', r: 70, c: '#c8b8ff' }], impact: [{ fx: 'dist', r: 340, c: '#c8b8ff' }, { fx: 'shock', c: '#ffffff', r: 360, w: 18 }, { fx: 'ring', r: 340, c: '#c8b8ff', life: 0.5 }, { fx: 'dustc', n: 18, c: '#c9d3e6' }, { fx: 'decal', dk: 'crack', r: 130, oy: 20 }, { fx: 'screen', k: 'flash', a: 0.25 }, { fx: 'cam', shake: 0.5, hitstop: 0.08 }] } },
    { id: 'kamui', n: 'Kamui', el: 'yin', glyph: '神', cd: 12, ch: 34, sign: 'tora', cast: 0.4, end: 0.3, cat: 'eye', clan: ['uchiha'], req: { clan: 6, gen: 3 },
      pose: [k(0, { ...P.eye, aF: 2.1 }), k(0.6, { ...P.eye, aF: 2.1, head: 0.3, lean: 0.15 }), k(1, P.eye)], anim: [{ t: 0.4, sq: -0.2, shake: 0.15 }],
      hit: { shape: 'circle', at: 'foe', range: 480, r: 120, dmg: 46, delay: 0.55, pull: 0.6, stun: 0.8 }, c: '#5a2a9a',
      vfx: { tele: [{ fx: 'dist', r: 120, c: '#5a2a9a' }, { fx: 'burst', conv: 1, n: 18, c: ['#a46bff', '#2a1a4a'], spr: 'wisp', sp: [140, 260], size: [5, 9], add: 0 }], impact: [{ fx: 'dist', r: 160, c: '#2a1a4a' }, { fx: 'ring', r: 30, c: '#a46bff', life: 0.4 }, { fx: 'arcs', n: 4, r: [30, 80], c: '#a46bff' }, { fx: 'cam', shake: 0.2, hitstop: 0.05 }] } },
    { id: 'amaterasu', n: 'Amaterasu', el: 'fire', glyph: '天', cd: 13, ch: 36, sign: 'tora', cast: 0.35, end: 0.3, cat: 'eye', clan: ['uchiha'], c: '#1a0a1a', req: { clan: 5, elem: 3 },
      pose: [k(0, { ...P.eye, aF: 2.2, head: 0.2 }), k(0.5, { ...P.eye, aF: 2.2, head: -0.1, lean: 0.25, sx: 1.06 }), k(1, P.eye)], anim: [{ t: 0.35, sq: -0.2, shake: 0.12 }],
      hit: { shape: 'circle', at: 'foe', range: 520, r: 90, dmg: 18, delay: 0.25, ticks: 4, every: 0.45, slow: 1.5 },
      vfx: { charge: [{ fx: 'glow', r: 24, c: '#ff2a3a', life: 0.3 }], tele: [{ fx: 'glow', r: 40, c: '#ff2a3a', life: 0.25 }], impact: [{ fx: 'licks', n: 10, w: 70, c: '#1a0a1a' }, { fx: 'burst', n: 10, c: ['#2a0a2a', '#5a1a3a'], spr: 'ember', sp: [40, 120], g: -200, size: [3, 5], add: 0 }, { fx: 'decal', dk: 'burn', r: 70, oy: 10 }] } },
  ];
  for (const e of D) TECH9.def(e);
  // ---------- constellation : prérequis + filtre par élément / clan ----------
  const NEW = {}; for (const e of D) { TREE8.REQ[e.id] = e.req; NEW[e.id] = e; }
  const pool0 = TREE8.pool; TREE8.pool = function () { const me = Voie.me, L = pool0.call(this); return L.filter((id) => { const e = NEW[id]; if (!e) return true; if (['fire', 'wind', 'water', 'bolt', 'earth'].includes(e.cat) && e.cat !== me.el && e.cat !== me.el2) return false; if (e.clan && !e.clan.includes(me.clan)) return false; return true; }); };
  window.SKILLS10 = D.map((e) => e.id);
})();
