/* ============ Mode RPG « Ta voie » : naissance, Académie, équipe, missions D→S, arc personnel ============ */
const CLANS = {
  uchiha: { n: 'Uchiha', sk: 'genjutsu', look: { hair: '#1c1c28', hs: 'messy', eye: '#2a2a3a' }, intro: ['Un éventail rouge et blanc sur ton berceau.', 'Les Uchiha sont peu nombreux. Chaque naissance est une promesse.'] },
  hyuga: { n: 'Hyūga', sk: 'palms', look: { hair: '#2a2a3a', hs: 'long', eye: '#e8e8f8' }, intro: ['Des yeux pâles, presque blancs.', 'Chez les Hyūga, on apprend la garde avant de marcher.'] },
  nara: { n: 'Nara', sk: 'shadow', look: { hair: '#2a2a2a', hs: 'pineapple' }, intro: ['Ton père bâille en te tenant.', 'Chez les Nara, les ombres sont des alliées.'] },
  akimichi: { n: 'Akimichi', sk: 'expand', look: { hair: '#a04a2a', hs: 'messy', belly: 1 }, intro: ['Un banquet pour ta naissance. Trois jours.', 'Chez les Akimichi, la force vient du cœur… et du ventre.'] },
  yamanaka: { n: 'Yamanaka', sk: 'mind', look: { hair: '#f4e08a', hs: 'pony', eye: '#5aa0d0' }, intro: ['L’odeur des fleurs de la boutique familiale.', 'Chez les Yamanaka, on lit les cœurs.'] },
  aburame: { n: 'Aburame', sk: 'insects', look: { hair: '#2a2a1a', hs: 'buzz', glasses: 1, cloak: '#4a5a3a' }, intro: ['Un bourdonnement doux autour de ton berceau.', 'Chez les Aburame, on ne se bat jamais seul.'] },
  inuzuka: { n: 'Inuzuka', sk: 'fang', look: { hair: '#4a2a1a', hs: 'spiky' }, intro: ['Un chiot dort contre toi.', 'Chez les Inuzuka, la meute passe avant tout.'] },
  senju: { n: 'Senju', sk: 'mokuton', look: { hair: '#3a2a1e', hs: 'long' }, intro: ['Une graine germe sur le rebord de la fenêtre.', 'Un sang Senju, rare et ancien, coule en toi.'] },
};
const NAMES = ['Aoi', 'Haruto', 'Ren', 'Sora', 'Yuki', 'Kaito', 'Hina', 'Daichi', 'Mio', 'Riku', 'Akari', 'Takeru', 'Nao', 'Kenta', 'Emi', 'Shun', 'Tsubasa', 'Rin', 'Kaede', 'Hayato', 'Asuka', 'Jin', 'Koharu', 'Ryū'];
const ELS5 = ['fire', 'wind', 'water', 'bolt', 'earth'];
const RANKS = { eleve: 'Élève', genin: 'Genin', chunin: 'Chūnin', jonin: 'Jōnin' };
const MISSIONS = {
  chat: { r: 'D', n: 'Rattraper le chat Tora', d: 'Il s’est encore enfui dans le village.' },
  herbes: { r: 'D', n: 'Herbes médicinales', d: 'Trois touffes dans la forêt ouest.' },
  livraison: { r: 'D', n: 'Livraison Ichiraku', d: 'Un bol pour la boutique Yamanaka.' },
  bandits: { r: 'C', n: 'Bandits sur la route', d: 'Un camp au sud de la porte.' },
  grimes: { r: 'C', n: 'Nid de Claw Grimes', d: 'Hors les murs, à l’est.' },
  deserteur: { r: 'B', n: 'Déserteur de rang B', d: 'Il se cache au sud-ouest avec deux complices.' },
  cellule: { r: 'A', n: 'Cellule de Kurogane', d: 'Une planque au sud-est.' },
};
const RANK_MIS = { eleve: [], genin: ['D', 'C'], chunin: ['C', 'B'], jonin: ['B', 'A'] };
function genNinja(seed, clan, el, o = {}) { const R = mulb(seed), P = (a) => a[(R() * a.length) | 0]; const C = CLANS[clan]; const name = o.name || P(NAMES); const look = makeLook(seed, Object.assign({ band: 1 }, C.look, o.look || {})); delete look.apron;
  return { name, clan, el, look, n: name + ' ' + C.n, skill: R() < 0.5 ? C.sk : ELEM_SK[el][0] }; }
const Voie = { mode: 'voie',
  step: 'birth', q: {}, items: [], flags: {}, rank: 'eleve', done: 0, mis: null, bond: {}, me: null, team: null, lesson: 0,
  obj() { const s = this.step, m = this.mis; const T = { birth: ['Naissance', '…'], a1: ['Académie — Leçon 1', 'Frappe les mannequins de la cour (' + Math.min(9, this.lesson) + '/9).'], a2: ['Académie — Leçon 2', 'Esquive les shurikens d’Iruka (' + Math.min(4, this.lesson) + '/4).'], a3: ['Académie — Leçon 3', 'Utilise ta technique et le Kage Bunshin sur un mannequin.'],
      a4: ['Examen de sortie', 'Ton rival. Le premier à flancher perd.'], a5: ['Genin', 'Iruka t’attend devant l’Académie : ton équipe.'], a6: ['Test des clochettes', 'Touche ton sensei 3 fois (' + this.lesson + '/3).'],
      free: ['Rang ' + RANKS[this.rank], m ? `${m.r} — ${m.n}` + (m.need ? ` (${m.got || 0}/${m.need})` : '') : 'Prends une mission au bureau (tour du Hokage).'],
      r1: ['Arc I — L’Ombre', 'Ton rival t’attend à la grande porte. Ce soir.'], r2: ['Arc I — L’Ombre', 'Ton rival.'],
      x1: ['Arc II — L’Examen Chūnin', 'Rejoins l’arène (terrain d’entraînement).'], x2: ['Arc II — L’Examen Chūnin', 'Le combat.'], x3: ['Arc II — Invasion', this.flags.exam === 'chase' ? 'Poursuis Yaiba dans la forêt ouest.' : 'Protège la place.'],
      j1: ['Arc III — Le Réceptacle', 'Kurogane a enlevé ' + (this.team ? this.team.t1.name : '') + '. Planque à l’ouest.'], j2: ['Arc III — Le Réceptacle', 'Shukaku.'],
      w1: ['Arc IV — La Guerre', 'Kurogane attaque la grande porte. Tiens la ligne (vague ' + (this.wave || 1) + '/3).'], w2: ['Arc IV — La Guerre', this.flags.rival === 'left' ? 'Ton rival, passé à l’ennemi.' : 'Shiki de Kurogane.'], w3: ['Arc IV — La Guerre', 'Shiki de Kurogane.'],
      fin: ['Ta voie', 'Jōnin. Konoha te doit beaucoup. Le monde reste ouvert.'] };
    return T[s] || ['', '']; },
  target() { const s = this.step, m = this.mis; if (['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].includes(s)) return [2250, 790]; if (s === 'r1') return [1600, 2200]; if (s === 'x1') return [2850, 1250]; if (s === 'x3') return this.flags.exam === 'chase' ? [420, 1500] : [1600, 960]; if (s === 'j1') return [380, 1560]; if (s === 'w1') return [1600, 2420];
    if (s === 'free') { if (!m) return [1600, 700]; if (m.tx) return [m.tx, m.ty]; if (m.id === 'chat' && this.cat) return [this.cat.x, this.cat.y]; const it = this.items[0]; if (it) return [it.x, it.y]; } return null; },
  allowAggro(f) { if (f.tag === 'rival') return this.step === 'a4' || this.step === 'r2' || this.step === 'x2' || this.step === 'w2'; if (f.tag === 'sensei') return this.step === 'a6'; return true; },
  /* ---------- création → naissance ---------- */
  newGame(c) { const el = pick(ELS5); this.me = { name: c.name, clan: c.clan, el, look: Object.assign({}, c.look) }; const R = mulb(Date.now() & 0xffff); const others = Object.keys(CLANS).filter((k) => k !== c.clan); const pk = () => others.splice((R() * others.length) | 0, 1)[0];
    const t0 = genNinja(R() * 1e6 | 0, pk(), pick(ELS5)), t1 = genNinja(R() * 1e6 | 0, pk(), pick(ELS5)), se = genNinja(R() * 1e6 | 0, pk(), pick(ELS5), { look: { vest: '#4f6b3c' } }), rv = genNinja(R() * 1e6 | 0, pk(), pick(ELS5), { look: { scarf: '#2a2a3a' } });
    t1.jin = 1; this.team = { t0, t1, sensei: se, rival: rv, num: 3 + (R() * 12 | 0) }; this.step = 'birth'; this.rank = 'eleve'; this.done = 0; this.mis = null; this.flags = {}; this.bond = { t0: 0, t1: 0, sensei: 0 }; this.lesson = 0; },
  save() { return { step: this.step, rank: this.rank, done: this.done, mis: this.mis, flags: this.flags, bond: this.bond, me: this.me, team: this.team, lesson: this.lesson, q: this.q, wave: this.wave }; },
  start(sv) { World.foes_ = []; Proj.length = 0; Game.clones = []; Game.allies = []; Game.extras = []; this.items = [];
    if (sv) Object.assign(this, sv); const S = this.step;
    this.iruka = { id: 'iruka', n: 'Iruka', look: makeLook(5, { hair: '#3a2a1e', hs: 'pony', vest: '#4f6b3c', band: 1, skin: '#e0b48c', scar: 1 }), x: 2250, y: 760, r: 12, face: 1, vx: 0, vy: 0, anim: 0, isNpc: true, onTalk: () => this.talkIruka() };
    this.desk = { id: 'desk', n: 'Bureau des missions', look: makeLook(9, { vest: '#4f6b3c', band: 1 }), x: 1640, y: 700, r: 12, face: -1, vx: 0, vy: 0, anim: 0, isNpc: true, onTalk: () => this.board() };
    Game.extras.push(this.iruka, this.desk);
    if (['a1', 'a2', 'a3'].includes(S)) this.yard();
    if (['a6', 'free', 'r1', 'r2', 'x1', 'x2', 'x3', 'j1', 'w1', 'w2', 'w3', 'fin'].includes(S)) this.formTeam(S === 'j1' || S === 'j2');
    // monde : ennemis placés hors les murs (camps, patrouilles, zones)
    if (!this.flags.camp) for (const [x, y] of [[1520, 2690], [1680, 2700], [1600, 2780]]) spawnFoe('bandit', x, y, { tag: 'camp' });
    for (const p of [[[2650, 1900], [3000, 2100], [3000, 2700], [2650, 2600]]]) spawnFoe('stormer', p[0][0], p[0][1], { path: p, tag: 'patrol' });
    for (const [x, y] of [[300, 1200], [380, 1300]]) spawnFoe('sprout', x, y, { tag: 'wild' });
    for (let i = 0; i < 3; i++) { const d = spawnFoe('dummy', 2760 + i * 90, 1290, { tag: 'dummy', dEl: ['fire', 'water', 'earth'][i] }); d.aura[d.dEl] = 99; }
    if (this.mis) this.setupMission(this.mis, true);
    if (S === 'a4') this.spawnRival(2250, 830, 1); if (S === 'a6') { const se = spawnFoe('sensei', 2250, 860, { tag: 'sensei', look: this.team.sensei.look, n: this.team.sensei.name, leash: [2250, 860, 300] }); se.aggro = true; se.onTag = () => this.tag(se); }
    if (S === 'r2') this.step = 'r1'; if (S === 'x2' || S === 'x3') { if (S === 'x3') { this.step = 'x3'; this.flags.examDone = 0; Game.later(0.5, () => this.examEnd()); } else this.step = 'x1'; } if (S.startsWith('w') && S !== 'fin') { this.step = 'w1'; this.wave = 0; this.nextWave(); }
    if (S === 'birth') Game.later(0.5, () => this.birth());
    UI.objective(); },
  birth() { const C = CLANS[this.me.clan], el = this.me.el, E = ELS[el]; Game.cine = true; World.time = 6.5;
    Talk.say([['', C.intro[0]], ['', C.intro[1]], ['', '12 ans plus tard. Le papier à chakra, dans ta main…']], () => { const h = Game.hero; Game.cine = true;
      ({ fire: () => V.fireBoom(h.x, h.y, 60), water: () => V.splash(h.x, h.y, 60), wind: () => V.spiral(h.x, h.y - 40, 80, '#bfffe0'), bolt: () => V.boltBurst(h.x, h.y - 40, 90), earth: () => { FX.dust(h.x, h.y, 16); V.cracks(h.x, h.y, 80, '#3a2a1a'); } })[el]();
      Sfx.play('pop'); UI.reward(E.k + ' ' + E.n, elc(el)); Game.later(1.1, () => Talk.say([['Iruka', 'Ton affinité : ' + E.n + '. Bienvenue à l’Académie, ' + this.me.name + '.'], ['Iruka', 'Montre-moi tes poings d’abord. Dans la cour.']], () => { Game.cine = false; this.set('a1'); this.yard(); Game.hint('atk'); })); }); },
  yard() { if (World.foes_.some((f) => f.tag === 'yard')) return; for (let i = 0; i < 3; i++) spawnFoe('dummy', 2170 + i * 80, 830, { tag: 'yard' }); },
  onHit(t, src) { if (t.tag === 'yard' && src && src.isHero) { if (this.step === 'a1' && src.act && src.act.k === 'm1') { this.lesson++; UI.objective(); if (this.lesson >= 9) this.next('a2'); }
      if (this.step === 'a3') { if (src.act && src.act.k === 'm1') return; this.flags.l3t = 1; this.checkL3(); } }
    if (t.tag === 'yard' && src && src.isClone && this.step === 'a3') { this.flags.l3c = 1; this.checkL3(); } },
  checkL3() { if (this.flags.l3t && this.flags.l3c && this.step === 'a3') this.next('a4'); },
  next(s) { this.lesson = 0; Sfx.play('pop'); UI.reward('Réussi !', '#ffd166');
    if (s === 'a2') Talk.say([['Iruka', 'Bien. Maintenant, esquive.']], () => { this.set('a2'); Game.hint('dodge'); });
    if (s === 'a4') Talk.say([['Iruka', 'Tu es prêt pour l’examen.'], [this.team.rival.name, 'Prêt ? Contre moi ? On verra ça.']], () => { this.set('a4'); World.foes_ = World.foes_.filter((f) => f.tag !== 'yard'); this.spawnRival(2250, 830, 1); });
    if (s === 'a3') Talk.say([['Iruka', 'Dernière leçon : ta technique ' + SK[Game.skills[0]].n + ', puis le Kage Bunshin. Sur un mannequin.']], () => { this.set('a3'); Game.hint('s1'); }); },
  spawnRival(x, y, lvl) { const R = this.team.rival; const r = spawnFoe('rival', x, y, { tag: 'rival', look: R.look, n: R.name, el: R.el, hpMul: lvl, leash: [x, y, 420] }); r.aggro = true; return r; },
  formTeam(missing1) { const T = this.team; Game.allies = []; Game.addAlly(Object.assign({ id: 't0', slot: 0 }, T.t0)); if (!missing1) Game.addAlly(Object.assign({ id: 't1', slot: 1 }, T.t1)); if (this.withSensei()) Game.addAlly(Object.assign({ id: 'sensei', slot: 2 }, T.sensei, { n: T.sensei.name + '-sensei' })); },
  withSensei() { return ['x3', 'j1', 'j2', 'w1', 'w2', 'w3'].includes(this.step) || (this.mis && 'BA'.includes(this.mis.r)); },
  talkIruka() { const s = this.step, T = this.team;
    if (s === 'a5') return Talk.say([['Iruka', 'Équipe ' + T.num + ' : ' + this.me.name + ', ' + T.t0.name + ' ' + CLANS[T.t0.clan].n + ', ' + T.t1.name + ' ' + CLANS[T.t1.clan].n + '.'], ['Iruka', 'Votre sensei : ' + T.sensei.name + ' ' + CLANS[T.sensei.clan].n + '.'], [T.sensei.name, 'Trois coups. Touchez-moi trois fois avant la nuit, et vous êtes à moi.']],
      () => { this.formTeam(); this.set('a6'); this.lesson = 0; const se = spawnFoe('sensei', 2250, 860, { tag: 'sensei', look: T.sensei.look, n: T.sensei.name, leash: [2250, 860, 300] }); se.aggro = true; se.onTag = () => this.tag(se); });
    Talk.say([['Iruka', pick(['Les mannequins ne mordent pas. Enfin, presque.', 'Chaque ninja a commencé dans cette cour.', 'Ton rival s’entraîne tous les soirs. Je dis ça…'])]]); },
  tag(se) { if (se.tagCd > Game.t) return; se.tagCd = Game.t + 0.8; this.lesson++; FX.smoke(se.x, se.y - 20, 10); FX.custom({ x: se.x, y: se.y, life: 0.8, draw: (g, p, q) => { g.globalAlpha = 1 - q; g.fillStyle = '#8a6a3a'; g.strokeStyle = INK; g.lineWidth = 2; g.save(); g.translate(p.x, p.y - 20); g.rotate(0.3); g.fillRect(-18, -8, 36, 16); g.strokeRect(-18, -8, 36, 16); g.restore(); } });
    se.x = 2250 + rnd(-200, 200); se.y = 860 + rnd(-60, 80); Sfx.play('pop'); UI.objective();
    if (this.lesson >= 3) { se.gone = true; Talk.say([[this.team.sensei.name, 'Pas mal. Vous avez joué en équipe : c’est ça, le test.'], [this.team.sensei.name, 'Équipe ' + this.team.num + ', au travail. Le bureau des missions vous attend.']], () => { for (const k of ['t0', 't1']) this.bond[k]++; this.rank = 'genin'; this.set('free'); UI.reward('Équipe ' + this.team.num, '#8fd3ff'); Game.unlockHint('s4'); }); } },
  /* ---------- missions ---------- */
  board() { if (this.step !== 'free') return Talk.say([['Bureau', this.rank === 'eleve' ? 'Les élèves n’ont pas de missions.' : 'Une affaire urgente passe avant tout.']]); if (this.mis) return Talk.say([['Bureau', 'Termine d’abord : ' + this.mis.n + '.']]);
    const ok = RANK_MIS[this.rank]; const L = Object.entries(MISSIONS).filter(([, m]) => ok.includes(m.r)); const pick3 = L.sort(() => Math.random() - 0.5).slice(0, 3);
    Talk.choose([['Bureau', 'Rang ' + RANKS[this.rank] + '. Missions disponibles :']], pick3.map(([id, m]) => `${m.r} · ${m.n}`).concat(['Plus tard']), (i) => { if (i >= pick3.length) return; const [id, m] = pick3[i]; this.mis = Object.assign({ id }, m); this.setupMission(this.mis); Talk.say([['Bureau', m.d]]); UI.objective(); Game.save(); }); },
  setupMission(m, reload) { const h = Game.hero; m.got = m.got || 0; m.tx = null;
    if (m.id === 'chat') { this.cat = { id: 'cat', n: 'Tora', look: null, cat: 1, x: 1900 + rnd(-300, 300), y: 1300 + rnd(-200, 200), r: 10, face: 1, vx: 0, vy: 0, anim: 0, isNpc: true, onTalk: () => { this.catCaught(); } }; Game.extras.push(this.cat); m.need = 0; }
    if (m.id === 'herbes') { m.need = 3; for (let i = m.got; i < 3; i++) this.items.push({ id: 'herb' + i, x: 560 + rnd(0, 300), y: 700 + i * 520 + rnd(0, 200), n: 'Herbe' }); }
    if (m.id === 'livraison') { m.need = 0; m.stage = m.stage || 0; if (!m.stage) this.items.push({ id: 'bol', x: 1290, y: 930, n: 'Bol' }); else m.tx = 1930, m.ty = 900; }
    const camp = (type, n, x, y, boss) => { m.tx = x; m.ty = y; m.need = n + (boss ? 1 : 0); if (reload && m.got >= m.need) return; for (let i = 0; i < n; i++) spawnFoe(type, x + rnd(-120, 120), y + rnd(-60, 60), { tag: 'mis' }); if (boss) spawnFoe(boss, x, y, { tag: 'mis' }); m.got = 0; };
    if (m.id === 'bandits') camp('bandit', 5, 1000, 2700); if (m.id === 'grimes') camp('grime', 6, 2700, 2650); if (m.id === 'deserteur') camp('stormer', 2, 600, 2750, 'rogue'); if (m.id === 'cellule') camp('kuro', 5, 2500, 2850);
    if (!reload) this.formTeam(); },
  catCaught() { const c = this.cat; if (!c) return; FX.smoke(c.x, c.y, 6); Game.extras = Game.extras.filter((e) => e !== c); this.cat = null; Talk.say([['', 'Tora se débat… puis ronronne.']], () => this.finishMission()); },
  finishMission() { const m = this.mis; if (!m) return; const XP = { D: 40, C: 80, B: 160, A: 260 }[m.r]; this.mis = null; this.done++; Game.gainXp(XP * 5); Game.ryo += XP * 10; for (const k of ['t0', 't1']) this.bond[k] = Math.min(5, (this.bond[k] || 0) + (Math.random() < 0.6 ? 1 : 0)); if ('BA'.includes(m.r)) this.bond.sensei = Math.min(5, (this.bond.sensei || 0) + 1);
    UI.reward('Mission ' + m.r + ' réussie', '#ffd166'); this.formTeam(); this.beat(); UI.objective(); Game.save(); },
  /* ---------- arc personnel ---------- */
  beat() { const d = this.done, f = this.flags;
    if (d >= 2 && !f.r) { f.r = 1; World.time = 21; Game.later(1.2, () => Talk.say([['', 'Un message glissé sous ta porte : « La grande porte. Ce soir. »']], () => this.set('r1'))); return; }
    if (d >= 4 && !f.x) { f.x = 1; Game.later(1.2, () => Talk.say([[this.team.sensei.name, 'Je vous ai inscrits à l’examen Chūnin. Ne me faites pas honte.']], () => this.set('x1'))); return; }
    if (d >= 6 && !f.j) { f.j = 1; Game.later(1.2, () => Talk.say([[this.team.t0.name, this.team.t1.name + ' a disparu ! Des traces de Kurogane… à l’ouest.'], [this.team.sensei.name, 'Il y a une chose que tu ignores. ' + this.team.t1.name + ' porte Shukaku.']], () => { this.set('j1'); this.formTeam(true); for (const [x, y] of [[330, 1500], [420, 1620], [300, 1650], [460, 1480]]) spawnFoe('kuro', x, y, { tag: 'hide' }); })); return; }
    if (d >= 8 && !f.w) { f.w = 1; Game.later(1.2, () => Talk.say([['', 'Les cloches d’alarme. Kurogane marche sur Konoha.']], () => { this.set('w1'); this.wave = 0; this.nextWave(); })); } },
  nextWave() { this.wave = (this.wave || 0) + 1; UI.objective(); for (let i = 0; i < 3 + this.wave; i++) { const f = spawnFoe(i % 2 ? 'kuro' : 'grime', 1600 + rnd(-260, 260), 2560 + rnd(-40, 120), { tag: 'war' }); f.aggro = true; } },
  onKill(f) { const m = this.mis;
    if (f.tag === 'camp' && !World.foes().some((x) => x.tag === 'camp')) { this.flags.camp = 1; UI.toast('Camp dispersé'); }
    if (f.tag === 'mis' && m) { m.got = (m.got || 0) + 1; UI.objective(); if (!World.foes().some((x) => x.tag === 'mis')) this.finishMission(); }
    if (f.tag === 'hide' && !World.foes().some((x) => x.tag === 'hide')) { const T = this.team.t1, h = Game.hero; Talk.say([['Shiki', 'Trop tard. Le Réceptacle s’ouvre.'], [T.name, 'Cours… il… sort !']], () => { const b = spawnFoe('bijuu', 380, 1560, { tag: 'shukaku', bj: 'shukaku', n: 'Shukaku', size: 1.6, leash: [380, 1560, 360], hpMul: 0.9 }); FX.smoke(b.x, b.y - 60, 30); V.roar(b); this.set('j2'); }); }
    if (f.tag === 'war' && !World.foes().some((x) => x.tag === 'war')) { if (this.wave < 3) { UI.reward('Vague ' + this.wave + ' repoussée', '#ffd166'); Game.later(1.5, () => this.nextWave()); } else this.warBoss(); }
    if (f.tag === 'yaiba') this.examEnd();
    if (f.tag === 'invader' && !World.foes().some((x) => x.tag === 'invader')) this.examEnd();
    if (f.tag === 'shiki') this.ending(); },
  warBoss() { const left = this.flags.rival === 'left'; if (left) { Talk.say([[this.team.rival.name, 'Tu n’as pas su me retenir. Maintenant, regarde ce que je suis devenu.']], () => { this.set('w2'); const r = this.spawnRival(1600, 2500, 3.2); r.look = Object.assign({}, r.look, { cloak: '#1b1b22', org: 1 }); r.karma = 1; }); }
    else Talk.say([[this.team.rival.name, 'Je suis là. Pour Konoha.'], ['Shiki', 'Des enfants. Toujours des enfants.']], () => { Game.addAlly(Object.assign({ id: 'rival', slot: 3 }, this.team.rival)); this.shiki(); }); },
  shiki() { this.set('w3'); const s = spawnFoe('leader', 1600, 2500, { tag: 'shiki', leash: [1600, 2450, 420] }); s.aggro = true; },
  ending() { const f = this.flags; this.rank = 'jonin'; const L = [['', 'Kurogane est brisé. Shiki ne se relèvera pas.']]; L.push(['', f.rival === 'left' ? 'Ton rival est vivant. Il dort sous bonne garde. Un jour, peut-être…' : 'Ton rival se tient à tes côtés. Comme toujours.']); L.push(['', f.shuk === 'talk' ? this.team.t1.name + ' et Shukaku ont trouvé un accord. Une première.' : this.team.t1.name + ' porte Shukaku, scellé de force. La cicatrice reste.']); L.push(['', f.exam === 'protect' ? 'Le village se souvient que tu as protégé les siens.' : 'Le village murmure que tu as abandonné la place.']); L.push(['Hokage', 'Jōnin ' + this.me.name + ' ' + CLANS[this.me.clan].n + '. Ta voie ne fait que commencer.']);
    Talk.say(L, () => { this.set('fin'); UI.reward('Jōnin', '#ffd166'); UI.chapterCard(); }); },
  examEnd() { if (this.flags.examDone) return; this.flags.examDone = 1; this.rank = 'chunin'; Talk.say([[this.team.sensei.name, 'L’invasion est repoussée. L’examen aussi, d’ailleurs… mais le conseil a vu ton combat.'], ['', 'Promu Chūnin. Ultime débloqué : ' + SK[Game.ultId].n + ' (' + Input.label('ult') + ').']], () => { this.set('free'); UI.reward('Chūnin', '#ffd166'); Game.ultV = 100; }); },
  update(dt) { const h = Game.hero, S = this.step;
    if (S === 'a2') { this.thT = (this.thT || 1.5) - dt; const I = this.iruka; if (this.thT <= 0 && !Talk.on) { this.thT = 1.1; const a = Math.atan2(h.y - 34 - (I.y - 40), h.x - I.x); I.face = h.x < I.x ? -1 : 1; Proj.push({ x: I.x, y: I.y - 40, vx: Math.cos(a) * 480, vy: Math.sin(a) * 480, life: 1.2, dmg: 4, el: null, team: 1, r: 10, src: I, kind: 'shuriken', hit: new Set(), lesson: 1 }); Sfx.play('swing'); } }
    if (S === 'a4' || S === 'r2' || S === 'x2' || S === 'w2') { const r = World.foes_.find((x) => x.tag === 'rival' && !x.gone); if (r && r.hp < r.maxHp * (S === 'w2' ? 0.05 : 0.3) && !r.passive) { r.passive = true; r.act = null; Game.impact(r.x, r.y, 0.15); this.rivalDone(S, r); } }
    if (S === 'r1' && Math.hypot(h.x - 1600, h.y - 2200) < 160 && !Talk.on) { const R = this.team.rival; Talk.choose([[R.name, 'Kurogane m’a fait une offre. La force, vite. Pas des missions de chat.'], [R.name, 'Tu vas m’arrêter ?']], ['Te retenir (combat)', 'Te laisser partir'], (i) => { if (i === 0) { this.set('r2'); this.spawnRival(1600, 2150, 1.6); } else { this.flags.rival = 'left'; Talk.say([[R.name, 'Adieu.']], () => this.set('free')); } }); }
    if (S === 'x1' && Math.hypot(h.x - 2850, h.y - 1250) < 220 && !Talk.on) { const stay = this.flags.rival !== 'left'; Talk.say([['Arbitre', 'Finale de l’examen Chūnin. ' + this.me.name + ' contre ' + (stay ? this.team.rival.name : 'un genin de Suna') + '.']], () => { this.set('x2'); const r = stay ? this.spawnRival(2950, 1250, 2) : spawnFoe('rival', 2950, 1250, { tag: 'rival', look: makeLook(77, { hair: '#c0582a', band: 2 }), n: 'Genin de Suna', hpMul: 2, el: 'wind', leash: [2850, 1250, 260] }); r.aggro = true; Game.allies.forEach((a) => (a.passive = true)); }); }
    if (S === 'j2') { const b = World.foes_.find((x) => x.tag === 'shukaku'); if (b && b.hp < b.maxHp * 0.35 && !b.passive) { b.passive = true; b.casting = null; Game.impact(b.x, b.y, 0.22); const T = this.team.t1; const opts = ['Le sceller de force']; if ((this.bond.t1 || 0) >= 3) opts.unshift('Lui parler (lien ' + this.bond.t1 + ')');
        Talk.choose([['Shukaku', 'Encore un sceau ? Encore une prison ?!']], opts, (i) => { const talk = opts[i].startsWith('Lui'); this.flags.shuk = talk ? 'talk' : 'seal'; for (let k = 0; k < 50; k++) FX.mote(b.x + rnd(-150, 150), b.y - rnd(20, 200), b.x, b.y, '#cfae70', rnd(0.6, 1.2)); b.gone = true;
          Talk.say(talk ? [[T.name, 'Shukaku… on peut avancer ensemble.'], ['Shukaku', '…Hmpf. Pour cette fois.']] : [['', 'Le sceau se referme dans un cri.'], [T.name, 'Merci… je crois.']], () => { this.bond.t1 = Math.min(5, (this.bond.t1 || 0) + (talk ? 2 : 0)); this.set('free'); this.formTeam(); UI.reward('Arc III terminé', '#ffd166'); }); }); } }
    if (S === 'w2' && !World.foes_.some((x) => x.tag === 'rival' && !x.gone) && !Talk.on && !this.flags.w2t) { this.flags.w2t = 1; this.shiki(); }
    if (this.mis && this.mis.id === 'chat' && this.cat) { const c = this.cat; c.t = (c.t || 0) - dt; const d = dist(c, h); if (d < 160) { const a = Math.atan2(c.y - h.y, c.x - h.x) + rnd(-0.6, 0.6); c.vx = Math.cos(a) * 230; c.vy = Math.sin(a) * 230; } else if (c.t <= 0) { c.t = rnd(1, 3); c.vx = rnd(-80, 80); c.vy = rnd(-50, 50); } c.x = clamp(c.x + c.vx * dt, 700, 2500); c.y = clamp(c.y + c.vy * dt, 900, 2150); World.collide(c); c.anim += dt * 12; c.face = c.vx < 0 ? -1 : 1; if (World.collideHit) {} }
    for (let i = this.items.length - 1; i >= 0; i--) { const it = this.items[i]; if (Math.hypot(h.x - it.x, h.y - it.y) < 46) { this.items.splice(i, 1); Sfx.play('pop'); const m = this.mis; if (!m) continue;
        if (it.id.startsWith('herb')) { m.got++; UI.objective(); if (m.got >= 3) this.finishMission(); } if (it.id === 'bol') { m.stage = 1; m.tx = 1930; m.ty = 900; UI.toast('Bol récupéré : direction Yamanaka'); } } }
    if (this.mis && this.mis.id === 'livraison' && this.mis.stage === 1 && Math.hypot(h.x - 1930, h.y - 905) < 90) this.finishMission(); },
  rivalDone(S, r) { const R = this.team.rival;
    if (S === 'a4') Talk.say([[R.name, 'Tch. Coup de chance.'], ['Iruka', 'Vous êtes tous les deux diplômés. Portez ce bandeau avec fierté.']], () => { r.gone = true; Game.hero.look = Object.assign({}, Game.hero.look, { band: 1 }); Game.heroLook = Game.hero.look; this.me.look.band = 1; this.rank = 'genin'; UI.reward('Genin !', '#ffd166'); Game.unlockHint('s2'); this.set('a5'); });
    if (S === 'r2') Talk.say([[R.name, '…Pourquoi tu te bats autant pour moi ?'], [this.me.name, 'Parce que tu es mon rival. Pas le leur.']], () => { r.gone = true; this.flags.rival = 'stay'; this.set('free'); UI.reward('Arc I terminé', '#ffd166'); });
    if (S === 'x2') { r.gone = true; Game.allies.forEach((a) => (a.passive = false)); Talk.choose([['', 'Des explosions sur la place ! Des capes noires : Kurogane envahit l’examen.'], [this.team.sensei.name, 'Yaiba, leur lieutenant, fuit vers l’ouest.']], ['Protéger les civils', 'Poursuivre Yaiba'], (i) => { this.flags.exam = i ? 'chase' : 'protect'; this.set('x3'); this.formTeam();
        if (i) { const y = spawnFoe('rogue', 420, 1500, { tag: 'yaiba', n: 'Yaiba de Kurogane', look: 'kuro', hpMul: 1.4, leash: [420, 1500, 400] }); y.aggro = true; } else for (let k = 0; k < 6; k++) { const f = spawnFoe(k % 2 ? 'kuro' : 'grime', 1600 + rnd(-220, 220), 960 + rnd(-110, 110), { tag: 'invader' }); f.aggro = true; } }); }
    if (S === 'w2') Talk.say([[R.name, 'Je… voulais juste être fort.'], [this.me.name, 'Tu l’es. Reviens.']], () => { r.gone = true; }); },
  set(s) { this.step = s; UI.objective(); Game.save(); },
  talkNpc(n) { n.li = (n.li || 0) + 1; const G = { teuchi: ['Un bol ? Ça ne se refuse pas.', 'Les genins mangent gratis le jour de leur diplôme.'], ino: ['Des fleurs pour ton sensei ? Bonne idée.', 'Inojin s’entraîne trop. Comme son père.'], kotetsu: ['La porte reste ouverte. Pas les yeux.', 'Des capes noires rôdent au sud. Kurogane, qu’ils disent.'], izumo: ['Encore une mission ? Signe ici.', 'Shikamaru dort trois heures par nuit.'], haru: ['Tu es à l’Académie toi aussi ?', 'Plus tard je serai Hokage !'], mei: ['On joue aux ninjas ! Tu fais le méchant ?'], taro: ['Course jusqu’à la stèle !'], gen: ['J’ai connu le Septième tout petit. Il était bruyant, et bon.', 'Kurogane… on m’a dit qu’ils recrutent les jeunes.'], smith: ['Lames, kunais, rouleaux. Pas de crédit.'], guard3: ['Circulez.', 'Les Claw Grimes sortent la nuit.'], vend1: ['Dango tout chauds !'], vend2: ['Belle journée pour ne rien faire.'] }[n.id] || n.lines || ['…']; Talk.say([[n.n, G[n.li % G.length]]]); },
  onLessonDodge() { if (this.step !== 'a2') return; this.lesson++; UI.objective(); FX.text(Game.hero.x, Game.hero.y - 110, 'Esquivé !', '#8fd3ff', 18, 1); if (this.lesson >= 4) this.next('a3'); },
  respawn() { return this.step.startsWith('a') ? [2250, 900] : [1290, 980]; },
};
