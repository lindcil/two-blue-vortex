/* ============ Boucle de jeu ============ */
const cv = $('#cv'), g = cv.getContext('2d');
const Game = {
  t: 0, hs: 0, impactT: 0, paused: true, cine: false, running: false, lvl: 1, xp: 0, clones: [], rxSeen: {}, stats: {}, timers: [], hints: {}, hintQ: null, ryo: 0, opened: {},
  pow() { return 1 + (this.lvl - 1) * 0.12; },
  later(t, f) { this.timers.push({ t, f }); },
  stat(k) { this.stats[k] = (this.stats[k] || 0) + 1; },
  seenRx(id) { if (!this.rxSeen[id]) { this.rxSeen[id] = 1; const R = RX.find((r) => r.id === id); if (R) this.later(0.4, () => UI.toast('Réaction découverte : ' + R.k + ' ' + R.n + ' — ' + R.d)); } },
  hitstop(t) { this.hs = Math.max(this.hs, t); },
  impact(x, y, t) { this.impactT = t; this.impactAt = { x, y }; this.hitstop(t * 0.6); Cam.shake(0.5); },
  inCombat() { const h = this.hero; return World.foes().some((f) => f.aggro && f.type !== 'dummy' && dist(f, h) < 600) || (this.inField(h) && World.foes().some((f) => f.type === 'dummy' && dist(f, h) < 260)); },
  inField(u) { return Math.hypot(u.x - 2850, u.y - 1250) < 280; },
  hint(k) { if (this.hints[k]) return; this.hints[k] = 1; const M = { move: () => `<kbd>${Input.label('up')}</kbd><kbd>${Input.label('left')}</kbd><kbd>${Input.label('down')}</kbd><kbd>${Input.label('right')}</kbd> ou flèches : se déplacer`, atk: () => `<kbd>${Input.label('atk')}</kbd> frapper — enchaîne 3 fois`, dodge: () => `<kbd>${Input.label('dodge')}</kbd> esquiver au cercle rouge`, s1: () => `<kbd>${Input.label('s1')}</kbd> Rasengan (Fūton)`, use: () => `<kbd>${Input.label('use')}</kbd> parler / interagir` };
    if (Input.lastDev === 'touch') { this.hintQ = { s: { move: 'Stick gauche : se déplacer', atk: 'M1 : frapper ×3', dodge: '⤳ : esquiver au cercle rouge', s1: '1 : Rasengan', use: 'E : parler' }[k], t: 5 }; return; } this.hintQ = { s: M[k](), t: 5 }; },
  unlockHint(k) { this.hint(k); },
  gainXp(n) { this.xp += n; FX.text(this.hero.x, this.hero.y - 110, '+' + n + ' xp', '#ffd166', 14); while (this.xp >= this.lvl * 100) { this.xp -= this.lvl * 100; this.lvl++; const h = this.hero; h.maxHp += 15; h.hp = h.maxHp; h.maxCh += 10; h.ch = h.maxCh; Sfx.play('lvl'); UI.toast('Niveau ' + this.lvl, 1); const S = SKILLS.find((s) => s.lvl === this.lvl); if (S) UI.toast('Nouvelle technique : ' + S.k + ' ' + S.n + ' (' + Input.label('s' + (SKILLS.indexOf(S) + 1)) + ')'); FX.ring(h.x, h.y, '#ffd166', 10, 120, 0.6); } },
  heroDown() { const h = this.hero; if (this.downing) return; this.downing = true; h.hp = 0; $('#fade').style.opacity = 1; UI.toast('Tu tombes…');
    setTimeout(() => { const pro = Story.step.startsWith('p'); h.x = pro ? 1600 : 1290; h.y = pro ? 1150 : 980; h.hp = h.maxHp; h.ch = h.maxCh; h.act = null; for (const f of World.foes()) { f.aggro = false; if (!f.boss) { f.x = f.hx; f.y = f.hy; } f.hp = Math.max(f.hp, f.maxHp * 0.5); } $('#fade').style.opacity = 0; this.downing = false; UI.toast('Tu te relèves. Ichiraku t’a recousu.'); }, 1100); },
  spawnJura() { this.jura = makeUnit({ x: 250, y: 1560, look: 'jura', face: 1, team: 2 }); Talk.say([['', 'Une présence immense, à la lisière ouest.']]); },
  save() { if (!this.hero) return; Save.write({ v: 1, step: Story.step, q: Story.q, flags: Story.flags, lvl: this.lvl, xp: this.xp, time: World.time, day: World.day, x: this.hero.x, y: this.hero.y, rx: this.rxSeen, ryo: this.ryo, opened: this.opened, hood: this.hero.hood }); },
  start(fresh) { Sfx.init(); const sv = fresh ? null : Save.game(); if (fresh) Save.wipe(); $('#title').style.display = 'none'; World.build(); makeNpcs();
    this.hero = makeUnit({ isHero: true, look: 'boruto', team: 0, x: 1600, y: 1320, hp: 120, maxHp: 120, ch: 100, maxCh: 100, r: 13 }); this.lvl = 1; this.xp = 0; this.rxSeen = {}; this.opened = {};
    if (sv) { this.lvl = sv.lvl || 1; this.xp = sv.xp || 0; World.time = sv.time || 8; World.day = sv.day || 1; this.hero.x = sv.x || 1600; this.hero.y = sv.y || 1320; this.rxSeen = sv.rx || {}; this.ryo = sv.ryo || 0; this.opened = sv.opened || {}; this.hero.hood = sv.hood; this.hero.maxHp = 120 + (this.lvl - 1) * 15; this.hero.hp = this.hero.maxHp; this.hero.maxCh = 100 + (this.lvl - 1) * 10; this.hero.ch = this.hero.maxCh; }
    else { World.time = 9.5; Story.step = 'p0'; Story.q = {}; Story.flags = {}; }
    this.sarada = { id: 'sarada', n: 'Sarada', look: 'sarada', x: 1600, y: 920, r: 12, face: -1, vx: 0, vy: 0, anim: 0, isNpc: true, lines: ['Je trouverai un moyen d’annuler l’Omnipotence.', 'Sumire cherche de son côté. Fais attention à Kawaki.'] };
    if (sv && !sv.step.startsWith('p')) { this.sarada.x = 1640; this.sarada.y = 400; }
    Story.start(sv); Cam.x = this.hero.x; Cam.y = this.hero.y; this.paused = false; this.running = true; if (!sv) this.later(0.2, () => this.hint('move')); },
  interactables() { const h = this.hero, L = []; for (const n of [...World.npcs, this.sarada]) if (n && !n.hidden) L.push({ d: dist(n, h), k: 'npc', o: n, s: 'Parler à ' + n.n }); for (const p of World.pois) if (!['shinju1', 'shinju2', 'camp', 'field'].includes(p.id) && !(p.id.startsWith('chest') && this.opened[p.id])) L.push({ d: Math.hypot(p.x - h.x, p.y - h.y), k: 'poi', o: p, s: p.n }); return L.filter((x) => x.d < 72).sort((a, b) => a.d - b.d)[0]; },
  usePoi(p) { const h = this.hero; const L = { memorial: 'Des noms gravés. Le sien n’y est pas, et c’est bien ainsi.', lookout: 'Tout Konoha, d’ici. Le village qui t’a rayé de sa mémoire.', scroll1: 'L’Omnipotence d’Eida exauce un désir… et réécrit les souvenirs de tous.', scroll2: 'Une Marque de Griffe permet à Code de surgir là où elle est posée.' };
    if (p.id === 'ichiraku') { if (World.time < 6 || World.time >= 22) return Talk.say([['', 'Fermé. Le rideau sent encore le bouillon.']]); h.hp = h.maxHp; h.ch = h.maxCh; return Talk.say([['Teuchi', 'Un grand bol, avec supplément œuf. Ça va mieux ?']]); }
    if (p.id.startsWith('chest')) { this.opened[p.id] = 1; this.ryo += 300; this.gainXp(40); UI.toast('Coffre : 300 ryō'); this.save(); return; }
    Talk.say([['', L[p.id] || p.n]]); },
  update(dt) { Input.poll(); const h = this.hero;
    if (Input.pressed('menu')) { if ($('#sheet').style.display === 'flex') UI.close(); else if (!Talk.on) UI.open('carte'); }
    if (Input.pressed('map') && !Talk.on) { if ($('#sheet').style.display === 'flex') UI.close(); else UI.open('carte'); }
    if (this.paused || !this.running) { Input.end(); return; }
    dt *= Save.set.speed; this.t += dt; for (let i = this.timers.length - 1; i >= 0; i--) { const T = this.timers[i]; T.t -= dt; if (T.t <= 0) { this.timers.splice(i, 1); T.f(); } }
    Talk.update(dt); FX.update(dt); UI.update(dt); if (this.impactT > 0) this.impactT -= dt;
    if (this.hs > 0) { this.hs -= dt; Input.end(); return; }
    World.update(dt);
    if (!this.cine && h.hp > 0) heroUpdate(h, dt); else { h.vx *= 0.8; h.vy *= 0.8; h.anim += dt * 3; }
    for (const f of World.foes_) if (f.hp > 0 && !f.gone) foeUpdate(f, dt); World.foes_ = World.foes_.filter((f) => !(f.hp <= 0 && (f.deadT = (f.deadT || 0) + dt) > 0.5) && !f.gone || f.tag === 'dummy');
    for (const c of this.clones) if (!c.gone) cloneUpdate(c, dt); this.clones = this.clones.filter((c) => !c.gone);
    projUpdate(dt); Story.update(dt);
    if (this.sarada) { this.sarada.anim += dt * 3; } if (this.jura) this.jura.anim += dt * 3;
    // hints contextuels
    if (!this.hints.dodge && World.foes().some((f) => f.act && f.act.k === 'wind' && dist(f, h) < 140)) this.hint('dodge');
    const it = !this.cine ? this.interactables() : null; if (it) { if (!this.hints.use) this.hint('use'); UI.prompt((Input.lastDev === 'touch' ? '<kbd>E</kbd> ' : `<kbd>${Input.label('use')}</kbd> `) + it.s); if (Input.pressed('use')) { if (it.k === 'npc') { this.talkTo = it.o; it.o.face = h.x < it.o.x ? -1 : 1; if (it.o === this.sarada) Talk.say([['Sarada', pick(it.o.lines)]]); else Story.talkNpc(it.o); } else this.usePoi(it.o); } }
    else if (this.hintQ && this.hintQ.t > 0) { this.hintQ.t -= dt; UI.prompt(this.hintQ.s); } else UI.prompt(null);
    if (!Talk.on) this.talkTo = null;
    Cam.follow(h, dt); this.saveT = (this.saveT || 0) + dt; if (this.saveT > 10) { this.saveT = 0; this.save(); }
    Input.end(); },
  render() { const dpr = Math.min(Save.set.low ? 1 : 2, devicePixelRatio || 1), vw = innerWidth, vh = innerHeight; if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0b1020'; g.fillRect(0, 0, cv.width, cv.height); if (!this.running) return;
    const z = clamp(vw / 1150, 0.62, 1.25) * Cam.z; g.setTransform(dpr * z, 0, 0, dpr * z, dpr * vw / 2 - (Cam.x + Cam.kx) * dpr * z, dpr * vh / 2 - (Cam.y + Cam.ky) * dpr * z);
    const vx0 = Cam.x - vw / 2 / z - 200, vx1 = Cam.x + vw / 2 / z + 200, vy0 = Cam.y - vh / 2 / z - 200, vy1 = Cam.y + vh / 2 / z + 300;
    World.drawGround(g); FX.draw(g, 0);
    // marqueurs d'objets et de lieux
    for (const it of Story.items) { const b = Math.sin(this.t * 4) * 4; g.fillStyle = '#ffd166'; g.beginPath(); g.moveTo(it.x, it.y - 30 + b); g.lineTo(it.x + 9, it.y - 18 + b); g.lineTo(it.x, it.y - 6 + b); g.lineTo(it.x - 9, it.y - 18 + b); g.fill(); g.strokeStyle = '#0b1020'; g.lineWidth = 2; g.stroke(); }
    const D = []; for (const p of World.props) { const x = p.x == null ? Cam.x : p.x; if (p.kind === 'rock' || p.kind === 'wall' || (x > vx0 - 200 && x < vx1 + 200 && p.y > vy0 && p.y < vy1 + 200)) D.push([p.kind === 'rock' ? -1 : p.y, 0, p]); }
    for (const n of World.npcs) if (!n.hidden) D.push([n.y, 1, n]); if (this.sarada) D.push([this.sarada.y, 1, this.sarada]); if (this.jura) D.push([this.jura.y, 1, this.jura]);
    for (const f of World.foes_) if (!f.gone) D.push([f.y, 2, f]); for (const c of this.clones) D.push([c.y, 1, c]); D.push([this.hero.y, 3, this.hero]); D.sort((a, b) => a[0] - b[0]);
    for (const [, k, o] of D) { if (k === 0) World.drawProp(g, o); else if (k === 2) { g.globalAlpha = o.hp <= 0 ? Math.max(0, 1 - (o.deadT || 0) * 2) : 1; if (o.kind) drawBeast(g, o); else drawRig(g, o); g.globalAlpha = 1; } else { if (o.isHero && o.iframe > 0 && o.act && o.act.k === 'dash') g.globalAlpha = 0.6; drawRig(g, o); g.globalAlpha = 1; } }
    FX.draw(g, 1); drawProj(g); for (const f of World.foes_) if (f.hp > 0 && !f.gone && f.x > vx0 && f.x < vx1) UI.foeHud(g, f); UI.heroHud(g, this.hero); FX.drawText(g);
    // nuit : voile bleu puis lumières chaudes
    const dk = World.dark(); g.setTransform(1, 0, 0, 1, 0, 0); if (dk > 0) { g.fillStyle = `rgba(10,18,48,${dk})`; g.fillRect(0, 0, cv.width, cv.height); g.setTransform(dpr * z, 0, 0, dpr * z, dpr * vw / 2 - (Cam.x + Cam.kx) * dpr * z, dpr * vh / 2 - (Cam.y + Cam.ky) * dpr * z); World.drawLights(g); g.setTransform(1, 0, 0, 1, 0, 0); }
    // cadre d'impact (rare) : encre sombre + lignes de vitesse ; jamais blanc si « réduire les flashs »
    if (this.impactT > 0) { const a = Math.min(1, this.impactT * 8); g.fillStyle = Save.set.rf ? `rgba(6,10,24,${0.45 * a})` : `rgba(255,255,255,${0.5 * a})`; g.fillRect(0, 0, cv.width, cv.height); const cx = cv.width / 2, cy = cv.height / 2; g.strokeStyle = Save.set.rf ? `rgba(58,160,255,${0.6 * a})` : `rgba(11,16,32,${0.8 * a})`; g.lineWidth = 3 * dpr; for (let i = 0; i < 28; i++) { const an = rnd(0, TAU), r0 = rnd(0.25, 0.4) * Math.max(cv.width, cv.height); g.beginPath(); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * r0 * 2.2, cy + Math.sin(an) * r0 * 2.2); g.stroke(); } }
    g.setTransform(dpr, 0, 0, dpr, 0, 0); UI.compass(g, vw, vh);
    const h = this.hero; if (h.hp < h.maxHp * 0.3 && h.hp > 0) { const gr = g.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.35, vw / 2, vh / 2, Math.max(vw, vh) * 0.7); gr.addColorStop(0, 'rgba(120,20,30,0)'); gr.addColorStop(1, `rgba(120,20,30,${0.35 + Math.sin(this.t * 6) * 0.1})`); g.fillStyle = gr; g.fillRect(0, 0, vw, vh); } },
};
let last = performance.now();
function frame(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; try { Game.update(dt); Game.render(); } catch (e) { console.error(e); } requestAnimationFrame(frame); }
Save.load(); Input.init();
const sv0 = Save.game(); if (sv0) { $('#bPlay').textContent = 'Continuer'; $('#bNew').hidden = false; }
$('#bPlay').onclick = () => Game.start(false); $('#bNew').onclick = () => Game.start(true); $('#bOpt').onclick = () => { UI.open('acces'); };
addEventListener('keydown', (e) => { if (!Game.running && $('#title').style.display !== 'none' && (e.code === 'Enter' || e.code === 'Space') && $('#sheet').style.display !== 'flex') Game.start(false); });
requestAnimationFrame(frame);
// fond animé de l'écran titre : le village en arrière-plan, de nuit
(function titleBg() { World.build(); makeNpcs(); World.time = 21.5; Cam.x = 1600; Cam.y = 900; Game.hero = makeUnit({ isHero: true, look: 'boruto', x: 1580, y: 960, hood: 1, face: 1 }); Game.sarada = null; Game.running = true; Game.paused = true; Game.titleMode = true;
  const tick = () => { if (!Game.titleMode) return; World.update(0.016); for (const n of World.npcs) n.anim += 0.1; Cam.x = 1600 + Math.sin(performance.now() / 6000) * 220; Game.hero.anim += 0.05; requestAnimationFrame(tick); }; tick();
  const st = Game.start.bind(Game); Game.start = (f) => { Game.titleMode = false; Game.running = false; st(f); }; })();
