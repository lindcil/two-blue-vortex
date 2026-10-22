/* ============ Boucle de jeu (deux modes : Histoire / Ta voie) ============ */
const cv = $('#cv'), g = cv.getContext('2d');
const STORY_LVL = { rasen: 1, shiden: 2, rappa: 3, bunshin: 4 };
const Game = {
  t: 0, hs: 0, impactT: 0, paused: true, cine: false, running: false, lvl: 1, xp: 0, clones: [], allies: [], extras: [], rxSeen: {}, stats: {}, timers: [], hints: {}, hintQ: null, ryo: 0, opened: {}, mode: 'histoire', skills: [], ultId: null, ultV: 0, ultA: 0, skyA: 0, skyT: 0, fdt: 0.016, mainEl: 'wind',
  pow() { return 1 + (this.lvl - 1) * 0.12; },
  later(t, f) { this.timers.push({ t, f }); },
  stat(k) { this.stats[k] = (this.stats[k] || 0) + 1; },
  sky(a, t) { this.skyA = a; this.skyT = t; },
  seenRx(id) { if (!this.rxSeen[id]) { this.rxSeen[id] = 1; const R = RX.find((r) => r.id === id); if (R) this.later(0.4, () => UI.toast('Réaction découverte : ' + R.k + ' ' + R.n + ' — ' + R.d)); } },
  hitstop(t) { this.hs = Math.max(this.hs, t); },
  impact(x, y, t) { this.impactT = t; this.impactAt = { x, y }; this.hitstop(t * 0.6); Cam.shake(0.5); },
  ultGain(d) { if (this.ultLock()) return; const was = this.ultV < 100; this.ultV = Math.min(100, this.ultV + d * 0.3); if (was && this.ultV >= 100) { Sfx.play('pop'); UI.reward('Ultime prêt — ' + Input.label('ult'), '#ffd166', 1); } },
  ultLock() { if (!this.ultId) return 'Aucun ultime'; if (this.mode === 'histoire') return Story.step.startsWith('p') ? 'Karma endormi' : null; return ['chunin', 'jonin'].includes(Voie.rank) ? null : 'Rang Chūnin requis'; },
  skillLock(id) { if (this.mode === 'histoire') { const l = STORY_LVL[id] || 1; return this.lvl < l ? 'Niveau ' + l + ' requis' : null; } const i = this.skills.indexOf(id), V2 = Voie;
    if (i === 1 && ['birth', 'a1', 'a2', 'a3', 'a4'].includes(V2.step)) return 'Après le diplôme'; if (i === 2 && ['birth', 'a1', 'a2'].includes(V2.step)) return 'Leçon 3'; if (i === 3 && (!this.allies.length || V2.rank === 'eleve')) return 'Avec ton équipe'; return null; },
  bondAvg() { if (this.mode === 'histoire') return 3; const b = Voie.bond; return ((b.t0 || 0) + (b.t1 || 0)) / 2; },
  inCombat() { const h = this.hero; return World.foes().some((f) => f.aggro && f.type !== 'dummy' && !f.passive && dist(f, h) < 650) || (this.inField(h) && World.foes().some((f) => f.type === 'dummy' && dist(f, h) < 260)) || World.foes().some((f) => f.tag === 'yard' && dist(f, h) < 200); },
  inField(u) { return Math.hypot(u.x - K10 * 2850, u.y - K10 * 1250) < 280 * K10; },
  hint(k) { if (this.hints[k]) return; this.hints[k] = 1; const n1 = this.skills[0] && SK[this.skills[0]].n; const M = { move: () => `<kbd>${Input.label('up')}</kbd><kbd>${Input.label('left')}</kbd><kbd>${Input.label('down')}</kbd><kbd>${Input.label('right')}</kbd> se déplacer`, atk: () => `<kbd>${Input.label('atk')}</kbd> frapper ×3`, dodge: () => `<kbd>${Input.label('dodge')}</kbd> esquiver le rouge`, s1: () => `<kbd>${Input.label('s1')}</kbd> ${n1}`, s2: () => `<kbd>${Input.label('s2')}</kbd> technique de clan`, s4: () => `<kbd>${Input.label('s4')}</kbd> formation d’équipe`, use: () => `<kbd>${Input.label('use')}</kbd> ${LANG10.t('parler / utiliser')}` };
    if (Input.lastDev === 'touch') { this.hintQ = { s: { move: 'Stick : se déplacer', atk: 'M1 : frapper ×3', dodge: '⤳ : esquiver le rouge', s1: '1 : ' + n1, s2: '2 : clan', s4: '4 : équipe', use: 'E : parler' }[k], t: 5 }; return; } if (M[k]) this.hintQ = { s: M[k](), t: 5 }; },
  unlockHint(k) { this.hint(k); },
  gainXp(n) { this.xp += n; FX.text(this.hero.x, this.hero.y - 120, '+' + n + ' XP', '#ffd166', 18, 1); while (this.xp >= this.lvl * 100) { this.xp -= this.lvl * 100; this.lvl++; const h = this.hero; h.maxHp += 15; h.hp = h.maxHp; h.maxCh += 10; h.ch = h.maxCh; Sfx.play('lvl'); UI.reward('Niveau ' + this.lvl, '#ffd166');
      if (this.mode === 'histoire') { const id = Object.keys(STORY_LVL).find((k) => STORY_LVL[k] === this.lvl); if (id) UI.toast('Nouvelle technique : ' + SK[id].k + ' ' + SK[id].n + ' (' + Input.label('s' + (this.skills.indexOf(id) + 1)) + ')'); } FX.shock(h.x, h.y, '#ffd166', 140, 0.6, 8); } },
  heroDown() { const h = this.hero; if (this.downing) return; this.downing = true; h.hp = 0; h.koT = 0; UI.toast('Tu tombes…'); setTimeout(() => ($('#fade').style.opacity = 1), 500);
    setTimeout(() => { const R = Story.respawn ? Story.respawn() : (Story.step.startsWith('p') ? [K10 * 1600, K10 * 1150] : [K10 * 1290, K10 * 980]); h.x = R[0]; h.y = R[1]; h.hp = h.maxHp; h.ch = h.maxCh; h.act = null; h.koT = null;
      for (const f of World.foes()) { f.aggro = false; if (!f.boss) { f.x = f.hx; f.y = f.hy; } f.hp = Math.max(f.hp, f.maxHp * 0.6); f.casting = null; } for (const a of this.allies) { a.down = false; a.hp = a.maxHp; a.x = h.x - 40; a.y = h.y; } Proj.length = 0;
      $('#fade').style.opacity = 0; this.downing = false; UI.toast('Tu te relèves.'); }, 1600); },
  spawnJura() { this.jura = makeUnit({ x: K10 * 250, y: K10 * 1560, look: 'jura', face: 1, team: 2 }); Talk.say([['', 'Une présence immense, à la lisière ouest.']]); },
  addAlly(d) { if (typeof d === 'string') d = { sarada: { id: 'sarada', n: 'Sarada', look: 'sarada', el: 'fire', skill: 'chidori', slot: 0 } }[d]; const a = makeUnit({ isAlly: true, team: 0, clan: d.clan, id: d.id, n: d.n || d.name, look: d.look, el: d.el, skill: d.skill || ELEM_SK[d.el][0], slot: d.slot || 0, x: this.hero.x - 60 - (d.slot || 0) * 30, y: this.hero.y + 20, hp: 150 + this.lvl * 12, maxHp: 150 + this.lvl * 12, r: 13, jin: d.jin });
    this.allies = this.allies.filter((o) => o.id !== a.id); this.allies.push(a); FX.smoke(a.x, a.y - 10, 6); return a; },
  save() { if (!this.hero || this.titleMode) return; const base = { v: 2, k10: 1, lvl: this.lvl, xp: this.xp, time: World.time, day: World.day, x: this.hero.x, y: this.hero.y, rx: this.rxSeen, ryo: this.ryo, opened: this.opened };
    if (this.mode === 'voie') Save.writeV(Object.assign(base, { voie: Voie.save() })); else Save.write(Object.assign(base, { step: Story.step, q: Story.q, flags: Story.flags, hood: this.hero.hood })); },
  boot(sv) { Sfx.init(); $('#title').style.display = 'none'; $('#create').style.display = 'none'; World.build(); makeNpcs(); this.lvl = 1; this.xp = 0; this.rxSeen = {}; this.opened = {}; this.ryo = 0; this.allies = []; this.extras = []; this.clones = []; this.ultV = 0; this.timers = []; this.cine = false; this.downing = false; this.jura = null; this.sarada = null;
    if (sv) { this.lvl = sv.lvl || 1; this.xp = sv.xp || 0; World.time = sv.time || 8; World.day = sv.day || 1; this.rxSeen = sv.rx || {}; this.ryo = sv.ryo || 0; this.opened = sv.opened || {}; } },
  heroStats(h) { h.maxHp = 120 + (this.lvl - 1) * 15; h.hp = h.maxHp; h.maxCh = 100 + (this.lvl - 1) * 10; h.ch = h.maxCh; },
  start(fresh) { const sv = fresh ? null : Save.game(); if (fresh) Save.wipe(); this.boot(sv); this.mode = 'histoire'; Story = Histoire; this.skills = ['rasen', 'shiden', 'rappa', 'bunshin']; this.ultId = 'uzuhiko'; this.mainEl = 'wind';
    this.hero = makeUnit({ isHero: true, look: 'boruto', team: 0, x: K10 * 1600, y: K10 * 1320, r: 13 }); this.heroStats(this.hero);
    if (sv) { const k = sv.k10 ? 1 : K10; this.hero.x = (sv.x || 1600) * k; this.hero.y = (sv.y || 1320) * k; this.hero.hood = sv.hood; } else { World.time = 9.5; Story.step = 'p0'; Story.q = {}; Story.flags = {}; }
    this.sarada = { id: 'sarada', n: 'Sarada', look: 'sarada', x: K10 * 1600, y: K10 * 920, r: 12, face: -1, vx: 0, vy: 0, anim: 0, isNpc: true, lines: ['Je trouverai un moyen d’annuler l’Omnipotence.', 'Sumire cherche de son côté. Fais attention à Kawaki.'] };
    if (sv && !sv.step.startsWith('p')) { this.sarada.x = K10 * 1640; this.sarada.y = K10 * 400; }
    Story.start(sv); if (sv && sv.step === 'c2') this.spawnJura(); if (sv && sv.step === 'k3') { Story.step = 'k2'; } this.go(!sv); },
  startVoie(created) { const sv = created ? null : Save.gameV(); this.boot(sv); this.mode = 'voie'; Story = Voie; if (created) { Voie.newGame(created); } else Object.assign(Voie, sv.voie);
    const me = Voie.me; this.skills = [ELEM_SK[me.el][0], CLANS[me.clan].sk, 'bunshin', 'combo']; this.ultId = CLAN_ULT[me.clan] || ELEM_SK[me.el][1]; this.mainEl = me.el; this.heroLook = me.look;
    this.hero = makeUnit({ isHero: true, look: me.look, team: 0, x: K10 * 2250, y: K10 * 900, r: 13, n: me.name }); this.heroStats(this.hero); if (sv) { const k = sv.k10 ? 1 : K10; this.hero.x = (sv.x || 2250) * k; this.hero.y = (sv.y || 900) * k; } else World.time = 8;
    if (Voie.step === 'j2') Voie.step = 'j1'; Voie.start(sv ? sv.voie : null); if (sv && Voie.step === 'j1' && !World.foes_.some((f) => f.tag === 'hide')) for (const [x, y] of [[K10 * 330, K10 * 1500], [K10 * 420, K10 * 1620]]) spawnFoe('kuro', x, y, { tag: 'hide' }); this.go(!sv); },
  go(isNew) { Cam.x = this.hero.x; Cam.y = this.hero.y; this.paused = false; this.running = true; this.titleMode = false; if (isNew) this.later(0.2, () => this.hint('move')); UI.objective(); },
  people() { return [...World.npcs, this.sarada, ...this.extras].filter((n) => n && !n.hidden); },
  interactables() { const h = this.hero, L = []; for (const n of this.people()) L.push({ d: dist(n, h), k: 'npc', o: n, s: (n.cat ? 'Attraper ' : 'Parler à ') + n.n });
    if (!this.inCombat()) for (const a of this.allies) if (!a.down) L.push({ d: dist(a, h) + 10, k: 'ally', o: a, s: 'Parler à ' + a.n });
    for (const p of World.pois) if (!['shinju1', 'shinju2', 'camp', 'field'].includes(p.id) && !(p.id.startsWith('chest') && this.opened[p.id])) L.push({ d: Math.hypot(p.x - h.x, p.y - h.y), k: 'poi', o: p, s: p.n }); return L.filter((x) => x.d < 72).sort((a, b) => a.d - b.d)[0]; },
  talkAlly(a) { const day = World.day, key = 'tk_' + a.id; const lines = { t0: ['On fait une bonne équipe, non ?', 'Un jour, on sera Jōnin. Tous les trois.', 'Merci de m’avoir couvert, tout à l’heure.'], t1: ['Parfois j’entends une voix… laisse tomber.', 'Tu crois qu’on peut choisir ce qu’on porte en soi ?', 'Le sable m’obéit mieux quand tu es là.'], sensei: ['Mange, dors, entraîne-toi. Dans cet ordre.', 'Je suis fier de vous. Ne le répétez pas.'], sarada: ['Concentre-toi. On le calme ensemble.'], rival: ['Ne crois pas que je te dois quelque chose.'] }[a.id] || ['…'];
    let up = false; if (this.mode === 'voie' && Voie.bond[a.id] != null && Voie.flags[key] !== day) { Voie.flags[key] = day; Voie.bond[a.id] = Math.min(5, Voie.bond[a.id] + 1); up = true; } Talk.say([[a.n, pick(lines)]], () => { if (up) UI.reward('Lien avec ' + a.n + ' : ' + Voie.bond[a.id], '#ff9ad0'); }); },
  usePoi(p) { const h = this.hero; const L = this.mode === 'voie' ? { memorial: 'Des noms gravés. Un jour, peut-être, le tien.', lookout: 'Tout Konoha, d’ici.', scroll1: 'Un parchemin sur l’histoire des clans.', scroll2: 'Un rapport sur Kurogane : « Ils recrutent les jeunes. »', board: 'Le bureau des missions.' } : { memorial: 'Des noms gravés. Le sien n’y est pas, et c’est bien ainsi.', lookout: 'Tout Konoha, d’ici. Le village qui t’a rayé de sa mémoire.', scroll1: 'L’Omnipotence d’Eida exauce un désir… et réécrit les souvenirs de tous.', scroll2: 'Une Marque de Griffe permet à Code de surgir là où elle est posée.', board: 'Le bureau des missions. Pas pour un fugitif.' };
    if (p.id === 'board' && this.mode === 'voie') return Voie.board();
    if (p.id === 'ichiraku') { if (World.time < 6 || World.time >= 22) return Talk.say([['', 'Fermé. Le rideau sent encore le bouillon.']]); h.hp = h.maxHp; h.ch = h.maxCh; return Talk.say([['Teuchi', 'Un grand bol, avec supplément œuf. Ça va mieux ?']]); }
    if (p.id.startsWith('chest')) { this.opened[p.id] = 1; this.ryo += 300; this.gainXp(40); UI.reward('Coffre : 300 ryō', '#ffd166'); this.save(); return; }
    Talk.say([['', L[p.id] || p.n]]); },
  update(dt) { Input.poll(); const h = this.hero; this.fdt = dt;
    if (Input.pressed('menu')) { if ($('#sheet').style.display === 'flex') UI.close(); else if (!Talk.on && this.running && !this.titleMode) UI.open('carte'); }
    if (Input.pressed('map') && !Talk.on && !this.titleMode) { if ($('#sheet').style.display === 'flex') UI.close(); else if (this.running) UI.open('carte'); }
    if (this.paused || !this.running) { Input.end(); return; }
    if (this.slowT > 0) { this.slowT -= dt; dt *= 0.35; } dt *= Save.set.speed; this.t += dt; for (let i = this.timers.length - 1; i >= 0; i--) { const T = this.timers[i]; T.t -= dt; if (T.t <= 0) { this.timers.splice(i, 1); T.f(); } }
    Talk.update(dt); FX.update(dt); UI.update(dt); if (this.impactT > 0) this.impactT -= dt; if (this.skyT > 0) this.skyT -= dt; else this.skyA = Math.max(0, this.skyA - dt);
    this.ultA = lerp(this.ultA, this.ultV >= 100 ? 1 : 0, dt * 3);
    if (Cine.on) { Cine.update(dt); Input.end(); return; }
    if (this.hs > 0) { this.hs -= dt; Input.end(); return; }
    World.update(dt);
    if (!this.cine && h.hp > 0) heroUpdate(h, dt); else { h.vx *= 0.8; h.vy *= 0.8; h.anim += dt * 3; if (h.koT != null) h.koT += dt; h.act = h.hp > 0 ? null : h.act; }
    for (const f of World.foes_) if (f.hp > 0 && !f.gone) foeUpdate(f, dt); World.foes_ = World.foes_.filter((f) => !(f.hp <= 0 && (f.deadT = (f.deadT || 0) + dt) > 0.7) && !f.gone || (f.tag === 'dummy' || f.tag === 'yard') && !f.gone);
    for (const c of this.clones) if (!c.gone) cloneUpdate(c, dt); this.clones = this.clones.filter((c) => !c.gone);
    for (const a of this.allies) if (!this.cine && !a.passive) allyUpdate(a, dt); else { a.anim += dt * 3; a.vx *= 0.8; a.vy *= 0.8; }
    projUpdate(dt); Story.update(dt);
    if (this.sarada) this.sarada.anim += dt * 3; if (this.jura) this.jura.anim += dt * 3; for (const e of this.extras) if (!e.cat) e.anim += dt * 3;
    if (!this.hints.dodge && World.foes().some((f) => f.act && f.act.k === 'wind' && dist(f, h) < 140)) this.hint('dodge');
    const it = !this.cine ? this.interactables() : null; if (it) { if (!this.hints.use) this.hint('use'); UI.prompt((Input.lastDev === 'touch' ? '<kbd>E</kbd> ' : `<kbd>${Input.label('use')}</kbd> `) + it.s);
      if (Input.pressed('use') && this.t - (Talk.endT || -9) > 0.3) { if (it.k === 'npc') { this.talkTo = it.o; it.o.face = h.x < it.o.x ? -1 : 1; if (it.o.onTalk) it.o.onTalk(); else if (it.o === this.sarada) Talk.say([['Sarada', pick(it.o.lines)]]); else Story.talkNpc(it.o); } else if (it.k === 'ally') this.talkAlly(it.o); else this.usePoi(it.o); } }
    else if (this.hintQ && this.hintQ.t > 0) { this.hintQ.t -= dt; UI.prompt(this.hintQ.s); } else UI.prompt(null);
    if (!Talk.on) this.talkTo = null;
    Cam.follow(h, dt); this.saveT = (this.saveT || 0) + dt; if (this.saveT > 10) { this.saveT = 0; this.save(); }
    Input.end(); },
  render() { const dpr = Math.min(Save.set.low ? 1 : 2, devicePixelRatio || 1) * (window.Q9 ? Q9.rs() : 1), vw = innerWidth, vh = innerHeight; if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0b1020'; g.fillRect(0, 0, cv.width, cv.height); if (!this.running || !this.hero) return;
    const z = clamp(vw / 1150, 0.62, 1.25) * Cam.z; const CB8 = window.camBounds ? camBounds() : [0, 0, 3200, 3000]; Cam.x = clamp(Cam.x, CB8[0] + vw / 2 / z, Math.max(CB8[0] + vw / 2 / z, CB8[2] - vw / 2 / z)); Cam.y = clamp(Cam.y, CB8[1] + vh / 2 / z, Math.max(CB8[1] + vh / 2 / z, CB8[3] - vh / 2 / z)); const W2 = () => { g.setTransform(dpr, 0, 0, dpr, dpr * vw / 2, dpr * vh / 2); if (Cam.rot) g.rotate(Cam.rot); g.scale(z, z); g.translate(-(Cam.x + Cam.kx), -(Cam.y + Cam.ky)); }; W2();
    const vx0 = Cam.x - vw / 2 / z - 200, vx1 = Cam.x + vw / 2 / z + 200, vy0 = Cam.y - vh / 2 / z - 200, vy1 = Cam.y + vh / 2 / z + 300;
    World.drawGround(g); FX.draw(g, 0);
    for (const it of Story.items) { const b = Math.sin(this.t * 4) * 4; g.fillStyle = '#ffd166'; g.beginPath(); g.moveTo(it.x, it.y - 30 + b); g.lineTo(it.x + 9, it.y - 18 + b); g.lineTo(it.x, it.y - 6 + b); g.lineTo(it.x - 9, it.y - 18 + b); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); }
    const D = []; for (const p of World.props) { const x = p.x == null ? Cam.x : p.x; if (p.kind === 'rock' || p.kind === 'wall' || (x > vx0 - 200 && x < vx1 + 200 && p.y > vy0 && p.y < vy1 + 200)) D.push([p.kind === 'rock' ? -1 : p.y, 0, p]); }
    const vis = (o) => o.x > vx0 && o.x < vx1 && o.y > vy0 && o.y < vy1 + 100;
    for (const n of this.people()) if (vis(n)) D.push([n.y, 1, n]); if (this.jura) D.push([this.jura.y, 1, this.jura]);
    for (const f of World.foes_) if (!f.gone && (vis(f) || f.kind === 'bijuu')) D.push([f.y, 2, f]); for (const c of this.clones) D.push([c.y, 1, c]); for (const a of this.allies) D.push([a.y, 1, a]); D.push([this.hero.y, 3, this.hero]); D.sort((a, b) => a[0] - b[0]);
    for (const [, k, o] of D) { if (k === 0) { World.drawProp(g, o); continue; } if (o.cat) { drawCat(g, o); continue; } animPose(o, this.fdt);
      if (k === 2) { g.globalAlpha = o.hp <= 0 ? Math.max(0, 1 - Math.max(0, (o.deadT || 0) - 0.35) * 3) : 1; if (o.kind) drawBeast(g, o); else drawRig(g, o); g.globalAlpha = 1; }
      else { if (o.ghostC) g.globalAlpha = 0.75; drawRig(g, o); g.globalAlpha = 1; if (o.isAlly) UI.allyHud(g, o); } }
    FX.draw(g, 1); drawProj(g); for (const f of World.foes_) if (f.hp > 0 && !f.gone && (vis(f) || f.boss)) UI.foeHud(g, f); if (!Cine.on) UI.heroHud(g, this.hero); FX.drawText(g);
    const dk = Math.max(World.dark(), this.skyA); g.setTransform(1, 0, 0, 1, 0, 0); if (dk > 0) { g.fillStyle = `rgba(10,18,48,${dk})`; g.fillRect(0, 0, cv.width, cv.height); W2(); World.drawLights(g); for (const p of FX.P) if (p.k === 'glow' || p.k === 'fn' && !p.ground) { } g.setTransform(1, 0, 0, 1, 0, 0); if (this.skyA > 0.1) { W2(); FX.draw(g, 1); g.setTransform(1, 0, 0, 1, 0, 0); } }
    // cadre d'impact (rare, gros moments seulement) : encre sombre + lignes de vitesse ; jamais blanc si « réduire les flashs »
    if (this.impactT > 0) { const a = Math.min(1, this.impactT * 8); g.fillStyle = Save.set.rf ? `rgba(6,10,24,${0.5 * a})` : `rgba(255,255,255,${0.55 * a})`; g.fillRect(0, 0, cv.width, cv.height); const ip = this.impactAt || Cam; const cx = (ip.x - Cam.x) * z * dpr + cv.width / 2, cy = (ip.y - 40 - Cam.y) * z * dpr + cv.height / 2; g.strokeStyle = Save.set.rf ? `rgba(58,160,255,${0.6 * a})` : `rgba(11,16,32,${0.85 * a})`; g.lineWidth = 3 * dpr;
      for (let i = 0; i < 34; i++) { const an = rnd(0, TAU), r0 = rnd(0.18, 0.32) * Math.max(cv.width, cv.height); g.beginPath(); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * r0 * 2.6, cy + Math.sin(an) * r0 * 2.6); g.stroke(); } }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); if (!Cine.on) { UI.compass(g, vw, vh); UI.bossHud(g, vw, vh); } Cine.draw(g, vw, vh);
    const h = this.hero; if (h.hp < h.maxHp * 0.3 && h.hp > 0) { const gr = g.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.35, vw / 2, vh / 2, Math.max(vw, vh) * 0.7); gr.addColorStop(0, 'rgba(120,20,30,0)'); gr.addColorStop(1, `rgba(120,20,30,${0.35 + Math.sin(this.t * 6) * 0.1})`); g.fillStyle = gr; g.fillRect(0, 0, vw, vh); } },
};
function drawCat(g, c) { g.save(); g.translate(c.x, c.y); g.scale(c.face, 1); const t = c.anim, run = Math.hypot(c.vx, c.vy) > 30 ? 1 : 0; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 0, 14, 4, 0, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 2;
  g.fillStyle = '#6a5a4a'; for (const lx of [-8, 8]) { g.beginPath(); g.moveTo(lx, -8); g.lineTo(lx + Math.sin(t + lx) * 4 * run, 0); g.stroke(); } g.beginPath(); g.ellipse(0, -12, 13, 7, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.arc(12, -18, 6, 0, TAU); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(9, -23); g.lineTo(10, -29); g.lineTo(13, -23); g.moveTo(13, -23); g.lineTo(16, -28); g.lineTo(17, -21); g.fill(); g.stroke(); g.strokeStyle = '#6a5a4a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-12, -14); g.quadraticCurveTo(-22, -24 + Math.sin(t) * 4, -18, -32); g.stroke(); g.fillStyle = '#c03030'; g.fillRect(8, -14, 8, 2); g.restore(); }
let last = performance.now();
function frame(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; try { Game.update(dt); Game.render(); } catch (e) { console.error(e); } requestAnimationFrame(frame); }
Save.load(); Input.init();
function refreshTitle() { const a = Save.game(), b = Save.gameV(); $('#bPlay').textContent = a ? 'Histoire — continuer' : 'Histoire'; $('#bNew').hidden = !a; $('#bVoie').textContent = b ? 'Ta voie — continuer' : 'Ta voie'; $('#bNewV').hidden = !b; }
refreshTitle();
$('#bPlay').onclick = () => Game.start(false); $('#bNew').onclick = () => Game.start(true); $('#bOpt').onclick = () => UI.open('acces');
$('#bVoie').onclick = () => (Save.gameV() ? Game.startVoie(null) : Create.open()); $('#bNewV').onclick = () => { Save.wipeV(); Create.open(); };
requestAnimationFrame(frame);
(function titleBg() { World.build(); makeNpcs(); World.time = 21.5; Cam.x = 1600; Cam.y = 900; Game.hero = makeUnit({ isHero: true, look: 'boruto', x: 1580, y: 960, hood: 1, face: 1 }); Game.sarada = null; Game.running = true; Game.paused = true; Game.titleMode = true;
  const tick = () => { if (!Game.titleMode) return; World.update(0.016); for (const n of World.npcs) n.anim += 0.1; Cam.x = 1600 + Math.sin(performance.now() / 6000) * 220; Game.hero.anim += 0.05; Game.fdt = 0.016; requestAnimationFrame(tick); }; tick();
  for (const k of ['start', 'startVoie']) { const st = Game[k].bind(Game); Game[k] = (f) => { Game.titleMode = false; Game.running = false; st(f); }; } })();
