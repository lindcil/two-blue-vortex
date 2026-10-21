// Vague 1 (v0.4) : réglage des cinématiques, musique procédurale, villageois variés, équilibrage par rang, tactile.
(() => { const tr = UI.t_reglages.bind(UI); UI.t_reglages = function () { return this.row('Cinématiques d’ultime', this.sel('cine', Save.set.cine || 'first', [['always', 'Toujours'], ['first', 'La 1re fois'], ['never', 'Jamais']])) + this.row('Musique', this.rng('mus', Save.set.mus, 0, 1, 0.05)) + tr(); }; })();
addEventListener('touchstart', () => { if (Cine.on && Cine.on.t > 0.35) Cine.skip(); }, { passive: true });
// Musique : pentatonique, change selon jour / nuit / combat / boss.
const Music = { t: 0, step: 0, mood: '', start() { if (this.iv || !Sfx.ctx) return; this.iv = setInterval(() => this.tick(), 125); },
  moodNow() { if (!Game.running || Game.titleMode) return 'title'; const bs = World.foes().some((f) => (f.boss || f.kind === 'bijuu') && f.aggro && !f.passive); if (bs) return 'boss'; if (World.foes().some((f) => f.aggro && !f.passive && dist(f, Game.hero) < 500)) return 'fight'; return World.dark() > 0.3 ? 'night' : 'day'; },
  tick() { const c = Sfx.ctx; if (!c || c.state !== 'running' || !(Save.set.mus > 0) || !(Save.set.vol > 0) || document.hidden) return; const m = this.moodNow(); this.mood = m; const s = this.step++;
    const M = { day: { root: 220, sc: [0, 2, 4, 7, 9], bpm: 2, prog: [0, 5, 3, 4] }, night: { root: 196, sc: [0, 3, 5, 7, 10], bpm: 4, prog: [0, 3, 5, 3] }, title: { root: 174.6, sc: [0, 2, 4, 7, 9], bpm: 4, prog: [0, 3, 4, 0] }, fight: { root: 164.8, sc: [0, 3, 5, 7, 10], bpm: 1, prog: [0, 0, 3, 5] }, boss: { root: 146.8, sc: [0, 1, 5, 7, 8], bpm: 1, prog: [0, 1, 0, 6] } }[m];
    const V0 = Save.set.mus * 0.5, nt = (st) => M.root * Math.pow(2, st / 12), bar = (s >> 4) % 4, chord = M.prog[bar];
    if (s % 16 === 0) for (const st of [0, 7, 12]) Sfx.tone(nt(chord + st) / 2, nt(chord + st) / 2, 1.9, 'triangle', 0.02 * V0);
    if (s % M.bpm === 0 && Math.random() < (m === 'day' || m === 'title' ? 0.45 : m === 'night' ? 0.3 : 0.6)) { const d = M.sc[(Math.random() * M.sc.length) | 0] + (Math.random() < 0.3 ? 12 : 0); Sfx.tone(nt(d + chord) * 2, nt(d + chord) * 2, m === 'night' ? 0.5 : 0.18, m === 'boss' ? 'sawtooth' : 'sine', 0.018 * V0); }
    if (m === 'fight' || m === 'boss') { if (s % 4 === 0) Sfx.tone(120, 40, 0.15, 'sine', 0.12 * V0); if (s % 8 === 4) Sfx.tone(2500, 600, 0.08, 0, 0.05 * V0, 0, 1); if (m === 'boss' && s % 2 === 0) Sfx.tone(6000, 3000, 0.03, 0, 0.02 * V0, 0, 1); }
    else if (s % 32 === 0 && World.dark() > 0.3) Sfx.tone(3200, 2800, 0.12, 'sine', 0.008 * V0); } };
(() => { const si = Sfx.init.bind(Sfx); Sfx.init = function () { si(); Music.start(); }; })();
// Villageois : enfants, anciens, marchands
(() => { const ml = makeLook; makeLook = function (seed, o = {}) { const L = ml(seed, {}); if (o.band || o.vest) return Object.assign(L, o); const R = mulb(seed * 31 + 7)(), R2 = mulb(seed * 57 + 3)();
  if (R < 0.16) { L.kid = 1; delete L.vest; delete L.band; } else if (R < 0.3) { L.hair = R2 < 0.5 ? '#d8d8d8' : '#9a9a9a'; L.elder = 1; delete L.band; if (R2 < 0.4) L.hs = 'buns'; } else if (R < 0.4) { L.apron = '#f2e2c0'; L.scarf = L.scarf || '#c0582a'; }
  return Object.assign(L, o); }; })();
// Équilibrage par rang (Ta voie) et boss plus coriaces
const RANK_MUL = { eleve: 1, genin: 1.15, chunin: 1.4, jonin: 1.7 };
(() => { const sf = spawnFoe; spawnFoe = function (type, x, y, extra) { const u = sf(type, x, y, extra); if (u && type !== 'dummy' && type !== 'sensei') { let k = Game.mode === 'voie' ? RANK_MUL[Voie.rank] || 1 : 1; if (u.boss) k *= 1.25; u.hp *= k; u.maxHp = u.hp; u.rankK = k; } return u; };
  const hu = hurt; hurt = function (t, dmg, src, o) { if (t && t.isHero && src && src.rankK) dmg *= Math.sqrt(src.rankK); return hu(t, dmg, src, o); }; })();
