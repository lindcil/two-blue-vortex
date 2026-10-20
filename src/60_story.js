/* ============ Histoire, dialogues, quêtes ============ */
const Talk = { q: [], cb: null, on: false, t: 0,
  say(lines, cb) { this.q = lines.slice(); this.cb = cb || null; this.on = true; Game.cine = true; this.next(); },
  next() { const L = this.q.shift(); const el = $('#talk'); if (!L) { el.style.display = 'none'; document.body.classList.remove('talking'); this.on = false; Game.cine = false; const c = this.cb; this.cb = null; if (c) c(); return; }
    el.style.display = 'block'; document.body.classList.add('talking'); el.querySelector('b').textContent = L[0]; el.querySelector('p').textContent = L[1]; el.querySelector('i').textContent = Input.lastDev === 'touch' ? 'toucher ▸' : (Input.label('use') + ' ▸'); this.t = 0; Sfx.play('ui'); },
  update(dt) { if (!this.on) return; this.t += dt; if (this.t > 0.25 && (Input.pressed('use') || Input.pressed('atk') || Input.hit.has('Space'))) this.next(); } };
$('#talk').addEventListener('click', () => Talk.on && Talk.t > 0.2 && Talk.next());
const QUESTS = {
  ramen: { n: 'La livraison d’Ayame', from: 'teuchi', steps: ['Récupère la caisse au terrain d’entraînement', 'Rapporte-la à Teuchi'], xp: 60 },
  shuriken: { n: 'Les shurikens de Haru', from: 'haru', steps: ['Trouve 3 shurikens (0/3)', 'Rends-les à Haru'], xp: 60 },
  camp: { n: 'Le camp au sud', from: 'kotetsu', steps: ['Disperse le camp de déserteurs', 'Préviens Kotetsu'], xp: 120 },
};
const Story = {
  step: 'p0', q: {}, items: [], flags: {},
  obj() { const s = this.step; return { p0: ['Prologue — Retour', 'Rejoins la place : Sarada est encerclée.'], p1: ['Prologue — Retour', 'Repousse les Claw Grimes.'], p2: ['Prologue — Retour', 'Les Grimes près des flammes portent Katon. Attise-les au Rasengan.'], p3: ['Prologue — Retour', 'Code.'],
    c0: ['Chapitre 1 — Fugitif', 'Retrouve Sarada au belvédère du rocher.'], c1: ['Chapitre 1 — Fugitif', 'Nettoie les racines du Shinju à l’ouest (' + this.zonesLeft() + ' zone' + (this.zonesLeft() > 1 ? 's' : '') + ').'], c2: ['Chapitre 1 — Fugitif', 'Quelqu’un attend à la lisière ouest.'], end: ['Chapitre 1 terminé', 'Konoha est à toi. Quêtes, camp, terrain d’entraînement…'] }[s] || ['', '']; },
  target() { return { p0: [1600, 960], p1: null, p2: [1450, 1010], p3: null, c0: [1600, 380], c1: this.zonesLeft() === 2 ? [330, 1250] : [380, 1900], c2: [250, 1560] }[this.step] || null; },
  zonesLeft() { return ['z1', 'z2'].filter((z) => !this.flags[z]).length; },
  allowAggro(f) { if (f.tag === 'plaza') return this.step === 'p1' || this.step === 'p2'; if (f.tag === 'code') return this.step === 'p3'; return true; },
  start(saved) {
    World.foes_ = []; Proj.length = 0; Game.clones = [];
    if (saved) Object.assign(this, { step: saved.step, q: saved.q || {}, flags: saved.flags || {} });
    // ennemis placés à la main
    if (this.step.startsWith('p')) { for (const [x, y] of [[1500, 900], [1700, 880], [1620, 1050]]) spawnFoe('grime', x, y, { tag: 'plaza' }); }
    if (!this.flags.z1) for (const [x, y] of [[300, 1200], [380, 1300], [260, 1310]]) spawnFoe('sprout', x, y, { tag: 'z1' });
    if (!this.flags.z2) for (const [x, y] of [[350, 1850], [430, 1950], [320, 1960]]) spawnFoe('sprout', x, y, { tag: 'z2' });
    if (!this.flags.camp) for (const [x, y] of [[1520, 2690], [1680, 2700], [1600, 2780], [1720, 2620]]) spawnFoe(Math.random() < 0.5 ? 'deserter' : 'grime', x, y, { tag: 'camp' }).type === 'grime' && 0;
    for (const p of [[[2650, 1900], [3000, 2100], [3000, 2700], [2650, 2600]], [[3000, 2700], [2650, 2600], [2650, 1900], [3000, 2100]]]) spawnFoe('stormer', p[0][0], p[0][1], { path: p, tag: 'patrol' });
    for (let i = 0; i < 3; i++) { const d = spawnFoe('dummy', 2760 + i * 90, 1290, { tag: 'dummy', dEl: ['fire', 'water', 'earth'][i] }); d.aura[d.dEl] = 99; }
    this.items = []; if (this.q.ramen === 1) this.items.push({ id: 'crate', x: 2850, y: 1150, n: 'Caisse d’Ichiraku' }); if (this.q.shuriken === 1) for (const [i, x, y] of [[0, 2700, 1110], [1, 1210, 1500], [2, 2300, 2150]]) if (!(this.flags['sh' + i])) this.items.push({ id: 'sh' + i, x, y, n: 'Shuriken' });
    if (this.step === 'p0' && !saved) Game.later(0.6, () => Talk.say([['', 'Konoha. Trois ans après l’Omnipotence.'], ['', 'Tout le monde croit que Boruto a tué son père.'], ['Sarada', 'Des Claw Grimes ? Ici ?!']], () => {}));
    UI.objective(); },
  onKill(f) { if (f.tag === 'plaza') { const left = World.foes().filter((x) => x.tag === 'plaza').length;
      if (this.step === 'p1' && left === 0) { this.set('p2'); Game.unlockHint('s1'); for (const [x, y] of [[1420, 990], [1480, 1040]]) { const g = spawnFoe('grime', x, y, { tag: 'plaza' }); g.aggro = true; } World.hazard(1450, 1010, 120, 9999, 'fire'); World.fireStall = true; Talk.say([['Boruto', 'Ils traversent les flammes… Le vent va s’en charger.']]); }
      else if (this.step === 'p2' && left === 0) { World.hazards = World.hazards.filter((h) => h.life < 9999); this.set('p3'); const c = spawnFoe('code', 1600, 760, { tag: 'code', look: 'code' }); c.aggro = false; Game.cine = true; Cam.tz = 1.25;
        Talk.say([['Code', 'Te voilà enfin, Boruto.'], ['Boruto', 'Tu t’en prends à mes amis pour m’attirer ? Mauvaise idée.'], ['Code', 'On verra si Sasuke t’a appris autre chose que fuir.']], () => { c.aggro = true; Cam.tz = 1; }); } }
    if (f.tag === 'z1' || f.tag === 'z2') { if (!World.foes().some((x) => x.tag === f.tag)) { this.flags[f.tag] = 1; UI.toast('Racines purifiées'); if (this.step === 'c1' && this.zonesLeft() === 0) { this.set('c2'); Game.spawnJura(); } else UI.objective(); Game.save(); } }
    if (f.tag === 'camp' && !World.foes().some((x) => x.tag === 'camp')) { this.flags.camp = 1; if (this.q.camp === 1) this.q.camp = 2; UI.toast('Camp dispersé'); Game.save(); } },
  set(s) { this.step = s; UI.objective(); Game.save(); },
  update(dt) { const h = Game.hero;
    if (this.step === 'p0' && Math.hypot(h.x - 1600, h.y - 960) < 260 && !Talk.on) { this.set('p1'); Game.hint('atk'); }
    if (this.step === 'p3') { const c = World.foes_.find((x) => x.tag === 'code'); if (c && c.hp < c.maxHp * 0.5 && !this.flags.codeOut) { this.flags.codeOut = 1; Game.impact(c.x, c.y, 0.2); c.aggro = false; c.act = null;
        Talk.say([['Code', 'Tch… Tu as changé.'], ['Code', 'Pas ici. Pas encore.'], ['Sarada', 'Boruto… c’est vraiment toi ?'], ['Boruto', 'Plus tard. Ce soir, au rocher. Seule.']], () => { c.gone = true; FX.smoke(c.x, c.y, 18); Game.hero.hood = 1; World.time = Math.max(World.time, 17.5); this.set('c0'); UI.toast('Chapitre 1 — Fugitif', 1); Game.sarada.x = 1640; Game.sarada.y = 400; }); } }
    if (this.step === 'c0' && Math.hypot(h.x - 1600, h.y - 400) < 120 && !Talk.on) Talk.say([['Sarada', 'Tout le monde t’a oublié. Sauf moi et Sumire.'], ['Boruto', 'Et Kawaki joue au fils parfait. Je sais.'], ['Sarada', 'Les racines à l’ouest… elles bougent. Ce n’est pas Code.'], ['Boruto', 'Le Shinju. J’y vais.']], () => this.set('c1'));
    if (this.step === 'c2' && Game.jura && Math.hypot(h.x - Game.jura.x, h.y - Game.jura.y) < 160 && !Talk.on) Talk.say([['???', 'Le petit fugitif. Tu sens l’arbre, toi aussi ?'], ['Boruto', 'Qui es-tu ?'], ['Jura', 'Jura. Je suis né du Shinju. Et j’ai faim de quelque chose de plus grand que toi.'], ['', 'Il disparaît entre les arbres.']], () => { Game.jura = null; FX.smoke(250, 1560, 20); this.set('end'); UI.toast('Chapitre 1 terminé — merci d’avoir joué', 1); UI.chapterCard(); });
    // ramassages
    for (let i = this.items.length - 1; i >= 0; i--) { const it = this.items[i]; if (Math.hypot(h.x - it.x, h.y - it.y) < 46) { this.items.splice(i, 1); Sfx.play('ui');
        if (it.id === 'crate') { this.q.ramen = 2; UI.toast('Caisse récupérée'); } else { this.flags[it.id] = 1; const n = ['sh0', 'sh1', 'sh2'].filter((k) => this.flags[k]).length; UI.toast('Shuriken ' + n + '/3'); if (n === 3) this.q.shuriken = 2; } Game.save(); } }
    // mannequins : l'aura revient toute seule (on y répète les réactions)
    for (const d of World.foes_) if (d.tag === 'dummy' && !Object.keys(d.aura).length) { d.re = (d.re == null ? 2.5 : d.re) - dt; if (d.re <= 0) { d.aura[d.dEl] = 99; d.re = 2.5; } } },
  talkNpc(n) { const id = n.id; const qid = n.q; const st = qid ? this.q[qid] || 0 : -1; const Q = QUESTS[qid];
    if (Q && st === 0) return Talk.say([[n.n, n.lines[0]], [n.n, { ramen: 'Ayame a laissé une caisse au terrain d’entraînement. Tu me la rapportes ?', shuriken: 'Ils sont tombés partout dans le village…', camp: 'Des déserteurs campent au sud de la porte. Personne n’a le temps.' }[qid]]], () => { this.q[qid] = 1; if (qid === 'ramen') this.items.push({ id: 'crate', x: 2850, y: 1150, n: 'Caisse' }); if (qid === 'shuriken') for (const [i, x, y] of [[0, 2700, 1110], [1, 1210, 1500], [2, 2300, 2150]]) this.items.push({ id: 'sh' + i, x, y, n: 'Shuriken' }); UI.toast('Quête : ' + Q.n); Game.save(); });
    if (Q && st === 2) return Talk.say([[n.n, { ramen: 'Merci ! Ce bol-là est pour moi.', shuriken: 'Tous les trois ! Tu es trop fort.', camp: 'Le camp est vide ? Je n’ai rien vu, alors.' }[qid]]], () => { this.q[qid] = 3; Game.gainXp(Q.xp * 5); UI.toast('Quête terminée : ' + Q.n); Game.save(); });
    n.li = (n.li || 0) + 1; Talk.say([[n.n, n.lines[n.li % n.lines.length]]]); },
};
