/* ============ Combat v0.2 : héros, techniques (bibliothèque), alliés, IA, bêtes à queues ============ */
const SK = {
  rasen: { n: 'Rasengan', el: 'wind', k: '螺', cd: 3.5, ch: 22, sign: 'ne' },
  shiden: { n: 'Raiton : Shiden', el: 'bolt', k: '雷', cd: 3, ch: 18, sign: 'tora' },
  rappa: { n: 'Suiton : Rappa', el: 'water', k: '水', cd: 5, ch: 24, sign: 'tori' },
  bunshin: { n: 'Kage Bunshin', el: 'yang', k: '影', cd: 12, ch: 30, sign: 'mi' },
  gokakyu: { n: 'Katon : Gōkakyū', el: 'fire', k: '火', cd: 4, ch: 22, sign: 'tora' },
  kazekiri: { n: 'Fūton : Lames de vent', el: 'wind', k: '風', cd: 3.2, ch: 18, sign: 'tori' },
  suiryu: { n: 'Suiton : Suiryūdan', el: 'water', k: '龍', cd: 5, ch: 26, sign: 'ushi' },
  chidori: { n: 'Chidori', el: 'bolt', k: '千', cd: 4, ch: 24, sign: 'ushi' },
  ganchu: { n: 'Doton : Ganchūrō', el: 'earth', k: '土', cd: 4.5, ch: 22, sign: 'mi' },
  shadow: { n: 'Kagemane', el: 'yin', k: '影', cd: 9, ch: 22, sign: 'ne', clan: 1 },
  palms: { n: 'Hakke : 64 Paumes', el: 'yang', k: '掌', cd: 9, ch: 26, sign: 'tori', clan: 1 },
  expand: { n: 'Baika : Poing géant', el: 'yang', k: '倍', cd: 7, ch: 24, sign: 'ushi', clan: 1 },
  mind: { n: 'Shintenshin', el: 'yin', k: '心', cd: 10, ch: 24, sign: 'ne', clan: 1 },
  insects: { n: 'Nuée d’insectes', el: 'yin', k: '蟲', cd: 8, ch: 20, sign: 'mi', clan: 1 },
  fang: { n: 'Gatsūga', el: 'wind', k: '牙', cd: 6, ch: 22, sign: 'tora', clan: 1 },
  mokuton: { n: 'Mokuton : Racines', el: 'earth', k: '木', cd: 7, ch: 26, sign: 'mi', clan: 1 },
  genjutsu: { n: 'Sharingan : Genjutsu', el: 'yin', k: '写', cd: 10, ch: 22, sign: 'tori', clan: 1 },
  combo: { n: 'Formation d’équipe', el: 'yang', k: '班', cd: 14, ch: 20, sign: 'mi' },
  // ultimes (touche Ultime, jauge pleine)
  uzuhiko: { n: 'Karma : Rasengan Uzuhiko', el: 'wind', k: '渦', ult: 1, sign: 'ne' },
  kirin: { n: 'Kirin', el: 'bolt', k: '麒', ult: 1, sign: 'tatsu' },
  goryuka: { n: 'Katon : Gōryūka', el: 'fire', k: '炎', ult: 1, sign: 'tora' },
  daibakufu: { n: 'Suiton : Daibakufu', el: 'water', k: '瀑', ult: 1, sign: 'tori' },
  taigyoku: { n: 'Fūton : Shinkū Taigyoku', el: 'wind', k: '嵐', ult: 1, sign: 'ne' },
  doryu: { n: 'Doton : Dōmu', el: 'earth', k: '岩', ult: 1, sign: 'mi' },
};
const ELEM_SK = { fire: ['gokakyu', 'goryuka'], wind: ['kazekiri', 'taigyoku'], water: ['suiryu', 'daibakufu'], bolt: ['chidori', 'kirin'], earth: ['ganchu', 'doryu'] };
const Proj = [];
const skOf = (i) => SK[Game.skills[i]];
function heroUpdate(u, dt) {
  const G = Game; u.iframe = Math.max(0, (u.iframe || 0) - dt); for (const k in u.cd) u.cd[k] = Math.max(0, u.cd[k] - dt); u.ch = Math.min(u.maxCh, u.ch + dt * 7); u.relT = Math.max(0, (u.relT || 0) - dt);
  if (G.t - (G.lastHurt || -9) > 5 && u.hp < u.maxHp) u.hp = Math.min(u.maxHp, u.hp + dt * 4);
  if (u.sign) { u.sign.t += dt; if (u.sign.t > 0.55) u.sign = null; }
  u.combat = G.inCombat();
  const a = u.act; if (a) { a.t += dt; actStep(u, a, dt); if (a.t >= a.dur && u.act === a) { u.act = null; if (a.next) startM1(u, a.n + 1); else if (a.k === 'm1' || a.k === 'cast') u.relT = a.k === 'cast' ? 0.3 : 0; } }
  if (Input.pressed('atk')) u.buf = { k: 'atk', t: 0.18 }; if (Input.pressed('dodge')) u.buf = { k: 'dodge', t: 0.15 }; for (let i = 0; i < 4; i++) if (Input.pressed('s' + (i + 1))) u.buf = { k: 's', i, t: 0.15 }; if (Input.pressed('ult')) u.buf = { k: 'ult', t: 0.15 };
  if (u.buf) { u.buf.t -= dt; const b = u.buf; let used = false;
    if (b.k === 'dodge' && (!u.act || (u.act.k === 'm1' && u.act.t > u.act.dur * 0.35) || u.act.k === 'cast') && !u.cd.dodge) { dodge(u); used = true; }
    else if (b.k === 'atk') { if (!u.act) { startM1(u, 0); used = true; } else if (u.act.k === 'm1' && u.act.n < 2 && u.act.t > u.act.dur * 0.3) { u.act.next = true; used = true; } }
    else if (b.k === 's' && !u.act) { castSkill(u, skOf(b.i), Game.skills[b.i], true); used = true; }
    else if (b.k === 'ult' && !u.act) { castUlt(u); used = true; }
    if (used || b.t <= 0) u.buf = null; }
  const m = Input.move(); const busy = u.act && u.act.k !== 'cast';
  if (!busy) { const sp = (u.ninjaRun ? 300 : 260) * (u.st.slow > 0 ? 0.6 : 1); u.vx = lerp(u.vx, m.x * sp, 1 - Math.pow(0.0005, dt)); u.vy = lerp(u.vy, m.y * sp, 1 - Math.pow(0.0005, dt)); if (Math.abs(m.x) > 0.1) u.face = m.x < 0 ? -1 : 1; }
  const moving = Math.hypot(m.x, m.y) > 0.2; u.runT = moving && !u.combat ? (u.runT || 0) + dt : 0; u.ninjaRun = u.runT > 0.9;
  const near = nearestFoe(u, 240); u.aimFoe = near && !busy && !moving ? near : null;
  const px = u.x; u.x += u.vx * dt; u.y += u.vy * dt; World.collide(u); u.anim += dt * (Math.hypot(u.vx, u.vy) > 25 ? (u.ninjaRun ? 14 : 12) : 3); u.sq = lerp(u.sq, 0, 1 - Math.pow(0.0001, dt));
  if (moving && Math.sin(u.anim) * Math.sin(u.anim - dt * 12) < 0 && Math.random() < 0.5) FX.dust(u.x, u.y, 2);
  if (u.act && (u.act.k === 'dash' || u.act.k === 'rasen' || u.act.k === 'chidori' || u.act.k === 'fang')) { u.ghT = (u.ghT || 0) - dt; if (u.ghT <= 0) { u.ghT = 0.035; FX.ghost(u, u.act.k === 'chidori' ? '#9fb8ff' : u.act.k === 'fang' ? '#d8c8a0' : '#8fd3ff'); } } }
function nearestFoe(u, r) { let b = null, bd = r; for (const f of World.foes()) { if (f.type === 'dummy' && !(Game.inField(u) || f.tag === 'yard')) continue; if (f.passive) continue; const d = dist(f, u) - (f.kind === 'bijuu' ? 60 : 0); if (d < bd) { bd = d; b = f; } } return b; }
function aimAt(u) { const f = u.aimFoe || u.tgt || nearestFoe(u, 320); if (f) { u.face = f.x < u.x ? -1 : 1; return Math.atan2(f.y - u.y, f.x - u.x); } return u.face < 0 ? Math.PI : 0; }
function startM1(u, n) { const a = aimAt(u); u.act = { k: 'm1', n, t: 0, dur: [0.3, 0.34, 0.46][n], hit: false, a }; u.vx = Math.cos(a) * (n === 2 ? 60 : 150); u.vy = Math.sin(a) * 100; Sfx.play('swing'); }
function dodge(u) { const m = Input.move(); const a = Math.hypot(m.x, m.y) > 0.1 ? Math.atan2(m.y, m.x) : (u.face < 0 ? 0 : Math.PI); u.act = { k: 'dash', t: 0, dur: 0.24, a }; u.iframe = 0.3; u.cd.dodge = 0.45; u.vx = Math.cos(a) * 920; u.vy = Math.sin(a) * 660; if (Math.abs(Math.cos(a)) > 0.2) u.face = Math.cos(a) < 0 ? -1 : 1; FX.dust(u.x, u.y, 8); FX.shock(u.x, u.y, 'rgba(200,220,255,.6)', 40, 0.25, 4); Sfx.play('dodge'); Game.stat('dodge'); }
const pw = (u) => (u.isAlly ? 0.55 + (Game.lvl - 1) * 0.06 : Game.pow());
function actStep(u, a, dt) {
  if (a.k === 'm1') { u.vx *= 0.8; u.vy *= 0.8; u.x += u.vx * dt; u.y += u.vy * dt;
    if (!a.hit && a.t > a.dur * 0.32) { a.hit = true; const big = a.n === 2, col = u.isHero ? elc(Game.mainEl || 'wind') : u.isAlly ? elc(u.el) : '#ff9a8a';
      if (a.n === 0) FX.smear(u, a.a - 1.3, a.a + 1.1, 54, col, 0); else if (a.n === 1) FX.smear(u, a.a + 1.4, a.a - 1.2, 60, col, 0); else { FX.smear(u, a.a - 2.0, a.a + 2.0, 70, col, 1); FX.shock(u.x + Math.cos(a.a) * 40, u.y + Math.sin(a.a) * 20, col, 90, 0.35, 7); FX.dust(u.x + Math.cos(a.a) * 40, u.y, 10); }
      u.vx += Math.cos(a.a) * (big ? 260 : 120); u.vy += Math.sin(a.a) * (big ? 160 : 70); let n = 0;
      const list = u.team === 1 ? [] : World.foes(); for (const f of list) { if (f.passive) continue; const d = dist(f, u) - (f.kind === 'bijuu' ? 70 : 0); if (d > (big ? 96 : 80) + f.r * 0.3) continue; const da = Math.abs(((Math.atan2(f.y - u.y, f.x - u.x) - a.a + Math.PI * 3) % TAU) - Math.PI); if (da > 1.4 && d > 34) continue;
        hurt(f, [10, 12, 22][a.n] * pw(u), u, { k: big ? 1.6 : 0.4, big, el: u.imbue || null }); n++; }
      if (n && u.isHero) { Game.stat('m1'); Game.hitstop(big ? 0.075 : 0.035); Cam.shake(big ? 0.2 : 0.06); u.sq = big ? -0.3 : -0.12; } } }
  else if (a.k === 'dash') { u.x += u.vx * dt; u.y += u.vy * dt; u.vx *= 0.9; u.vy *= 0.9; }
  else if (a.k === 'cast') { if (a.t >= a.dur * 0.95 && !a.fired) { a.fired = true; fireSkill(u, a.S, a.id); } }
  else if (a.k === 'rasen' || a.k === 'chidori' || a.k === 'fang') { const sp = a.k === 'chidori' ? 900 : 760; u.vx = Math.cos(a.a) * sp; u.vy = Math.sin(a.a) * sp * 0.74; u.x += u.vx * dt; u.y += u.vy * dt; World.collide(u);
    for (const f of World.foes()) if (!a.hitSet.has(f) && !f.passive && dist(f, u) < 52 + f.r * (f.kind === 'bijuu' ? 1 : 0.5)) { a.hitSet.add(f); const h = u.hand || f;
      if (a.k === 'rasen') { hurt(f, 46 * pw(u), u, { el: 'wind', k: 2.2, big: 1 }); V.rasenHit(h.x, h.y); a.t = a.dur; }
      else if (a.k === 'chidori') { hurt(f, 50 * pw(u), u, { el: 'bolt', k: 1.4, big: 1 }); V.boltBurst(f.x, f.y - 40, 110); a.t = a.dur; }
      else { hurt(f, 18 * pw(u), u, { el: 'wind', k: 1, big: 0 }); FX.dust(f.x, f.y, 6); }
      if (u.isHero) { Cam.shake(0.3); Game.hitstop(0.08); } u.sq = -0.3; } if (a.t >= a.dur) { u.vx *= 0.2; u.vy *= 0.2; } }
  else if (a.k === 'ult') { if (a.t >= a.dur * 0.95 && !a.fired) { a.fired = true; fireUlt(u, a.id); } }
}
function castSkill(u, S, id, isHero) { if (!S) return; const G = Game; if (isHero) { const lk = G.skillLock(id); if (lk) { FX.text(u.x, u.y - 110, lk, '#93a3c6', 15); return; } if (u.cd[id] > 0) return; if (u.ch < S.ch) { FX.text(u.x, u.y - 110, 'Chakra', '#4aa8ff', 15); return; } u.ch -= S.ch; }
  u.cd[id] = S.cd * (u.isAlly ? 1.8 : 1); u.sign = { k: S.sign, t: 0 }; u.act = { k: 'cast', S, id, t: 0, dur: 0.26 }; u.aimA = aimAt(u); u.sq = -0.12; Sfx.play('tech'); if (isHero) G.stat('skill');
  FX.glow(u.x, u.y - 40, elc(S.el), 50, 0.3); }
function castUlt(u) { const G = Game, id = G.ultId; if (!id) return; const lk = G.ultLock(); if (lk) { FX.text(u.x, u.y - 110, lk, '#93a3c6', 15); return; } if (G.ultV < 100) { FX.text(u.x, u.y - 110, 'Ultime ' + Math.floor(G.ultV) + '%', '#ffd166', 15); return; }
  G.ultV = 0; const S = SK[id]; u.sign = { k: S.sign, t: 0 }; u.act = { k: 'ult', id, t: 0, dur: 0.7 }; u.iframe = 0.9; u.aimA = aimAt(u); Cam.tz = 1.15; G.later(1.6, () => (Cam.tz = 1)); Sfx.play('tech'); G.stat('ult'); if (id === 'uzuhiko') V.karma(u, 1.8); FX.glow(u.x, u.y - 40, elc(S.el), 120, 0.7, { grow: 0.5 }); }
function aoe(x, y, r, dmg, src, o) { for (const f of World.foes()) if (!f.passive && Math.hypot(f.x - x, f.y - y) < r + (f.kind === 'bijuu' ? 80 : 0)) hurt(f, dmg, src, o); }
function fireSkill(u, S, id) { const a = u.aimA, P = pw(u), h = u.hand || { x: u.x + u.face * 20, y: u.y - 40 };
  const proj = (o) => Proj.push(Object.assign({ x: h.x, y: h.y, team: 0, src: u, hit: new Set(), r: 16, life: 0.6 }, o));
  switch (id) {
    case 'rasen': u.act = { k: 'rasen', t: 0, dur: 0.34, a, hitSet: new Set() }; u.iframe = 0.3; u.sq = 0.25; V.rasenHand(u, 0.36, 1.35); return;
    case 'chidori': u.act = { k: 'chidori', t: 0, dur: 0.3, a, hitSet: new Set() }; u.iframe = 0.3; V.chidoriHand(u, 0.45); Sfx.play('rx'); return;
    case 'fang': u.act = { k: 'fang', t: 0, dur: 0.5, a, hitSet: new Set() }; u.iframe = 0.4; V.drill(u, 0.5, '#d8c8a0'); return;
    case 'shiden': proj({ vx: Math.cos(a) * 1100, vy: Math.sin(a) * 1100, life: 0.45, dmg: 34 * P, el: 'bolt', kind: 'bolt', pierce: 1 }); Cam.shake(0.1); V.boltBurst(h.x, h.y, 50); return;
    case 'rappa': for (let k = -2; k <= 2; k++) { const b = a + k * 0.18; proj({ vx: Math.cos(b) * 640, vy: Math.sin(b) * 640, life: 0.42, dmg: 14 * P, el: 'water', r: 22, kind: 'water', pierce: 1 }); } V.splash(h.x, h.y + 20, 30); return;
    case 'bunshin': for (const s of [1, -1]) { const c = makeUnit({ x: u.x + s * 40, y: u.y + 10, look: u.isHero && Game.mode === 'voie' ? Game.heroLook : 'clone', team: 0, isClone: true, hp: 60, maxHp: 60, life: 8, face: u.face, sp: 280, ghostC: 1 }); FX.smoke(c.x, c.y - 10, 10); Game.clones.push(c); if (Game.clones.length > 3) Game.clones.shift().gone = true; } return;
    case 'gokakyu': proj({ vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, life: 0.8, dmg: 30 * P, el: 'fire', r: 30, kind: 'fireball', boom: 90 }); FX.glow(h.x, h.y, 'rgba(255,140,40,1)', 60, 0.3); return;
    case 'kazekiri': for (let k = -1; k <= 1; k++) { const b = a + k * 0.22; Game.later(Math.abs(k) * 0.05, () => proj({ x: u.x, y: u.y - 36, vx: Math.cos(b) * 900, vy: Math.sin(b) * 900, life: 0.4, dmg: 16 * P, el: 'wind', r: 20, kind: 'blade', pierce: 1, ang: b })); } return;
    case 'suiryu': proj({ vx: Math.cos(a) * 560, vy: Math.sin(a) * 560, life: 1.3, dmg: 34 * P, el: 'water', r: 26, kind: 'dragon', home: 1, trail: [] }); V.splash(u.x, u.y, 50); return;
    case 'ganchu': V.spikes(u.x, u.y, a, 7, 0, (x, y) => aoe(x, y, 46, 12 * P, u, { el: 'earth', k: 0.6 })); return;
    case 'mokuton': V.spikes(u.x, u.y, a, 8, 1, (x, y) => { for (const f of World.foes()) if (Math.hypot(f.x - x, f.y - y) < 46) { hurt(f, 11 * P, u, { el: 'earth', k: 0.2 }); f.st.slow = 2.5; } }); return;
    case 'shadow': { const f = nearestFoe(u, 420); if (!f) { FX.text(u.x, u.y - 100, '…', '#93a3c6', 16); return; } V.shadow(u, f, 2.6); f.st.stun = Math.max(f.st.stun || 0, f.boss ? 1.2 : 2.5); hurt(f, 8 * P, u, { el: 'yin', k: 0 }); return; }
    case 'palms': { const f = nearestFoe(u, 140); V.trigram(u.x, u.y, 1); u.act = { k: 'cast', S, id: 'none', t: 0, dur: 0.75 }; for (let i = 0; i < 8; i++) Game.later(i * 0.08, () => { const t = f && f.hp > 0 ? f : nearestFoe(u, 140); if (!t) return; u.face = t.x < u.x ? -1 : 1; u.relT = 0.12; hurt(t, 6 * P, u, { el: 'yang', k: i === 7 ? 1.5 : 0.05, big: i === 7 }); FX.glow(t.x, t.y - 40, 'rgba(200,230,255,1)', 30, 0.12); }); return; }
    case 'expand': V.bigFist(u, a, (x, y) => aoe(x, y, 110, 34 * P, u, { el: 'yang', k: 2, big: 1 })); u.sq = 0.4; return;
    case 'mind': { const f = nearestFoe(u, 460); if (!f) return; V.mindBeam(u, f); f.st.confuse = f.boss ? 2 : 5; hurt(f, 6 * P, u, { el: 'yin', k: 0 }); return; }
    case 'insects': { const f = nearestFoe(u, 420) || u; V.swarm(f.x, f.y, 3); for (let i = 0; i < 6; i++) Game.later(i * 0.5, () => aoe(f.x, f.y, 80, 5 * P, u, { el: 'yin', k: 0 })); for (const g2 of World.foes()) if (dist(g2, f) < 80) g2.st.slow = 3; return; }
    case 'genjutsu': u.eyeFx = '#d0283a'; Game.later(1.2, () => (u.eyeFx = null)); V.tomoe(u.x, u.y); for (const f of World.foes()) if (dist(f, u) < 300) { f.st.stun = Math.max(f.st.stun || 0, f.boss ? 1 : 2.2); hurt(f, 6 * P, u, { el: 'yin', k: 0 }); } return;
    case 'combo': { const f = nearestFoe(u, 520); if (!f) return; let k = 0; for (const al of Game.allies) if (!al.down) { al.cd[al.skill] = 0; al.tgt = f; Game.later(0.1 + k * 0.18, () => { if (al.down) return; al.x = f.x - (k % 2 ? 60 : -60); al.y = f.y + 10; FX.smoke(al.x, al.y - 10, 6); castSkill(al, SK[al.skill], al.skill, false); }); k++; }
      const bond = Game.bondAvg(); Game.later(0.7, () => { if (bond >= 3 && f.hp > 0) { Game.impact(f.x, f.y, 0.12); hurt(f, 30 * P, u, { el: 'yang', big: 1, k: 1 }); } }); return; }
  } }
function fireUlt(u, id) { const P = Game.pow(), f = nearestFoe(u, 520), tx = f ? f.x : u.x + u.face * 220, ty = f ? f.y : u.y;
  if (id === 'uzuhiko') { const h = u.hand || u; V.uzuhiko(h.x, h.y, tx, ty, () => aoe(tx, ty, 190, 120 * P, u, { el: 'wind', k: 2.5, big: 1 })); return; }
  if (id === 'kirin') { V.kirin(tx, ty, () => aoe(tx, ty, 200, 130 * P, u, { el: 'bolt', k: 1.5, big: 1 })); return; }
  if (id === 'goryuka') { for (let i = 0; i < 5; i++) Game.later(i * 0.12, () => { const b = Math.atan2(ty - u.y, tx - u.x) + (i - 2) * 0.16; Proj.push({ x: u.x, y: u.y - 40, vx: Math.cos(b) * 620, vy: Math.sin(b) * 620, life: 0.9, dmg: 34 * P, el: 'fire', r: 30, kind: 'fireball', boom: 100, team: 0, src: u, hit: new Set() }); }); Game.later(0.8, () => Game.impact(tx, ty, 0.14)); return; }
  if (id === 'daibakufu') { Game.impact(u.x, u.y, 0.14); for (let i = 0; i < 9; i++) Game.later(i * 0.06, () => { const r = 60 + i * 34; for (let k = 0; k < 10; k++) { const an = k / 10 * TAU; V.splash(u.x + Math.cos(an) * r, u.y + Math.sin(an) * r * 0.55, 30); } aoe(u.x, u.y, r + 30, 14 * P, u, { el: 'water', k: 1.2 }); }); return; }
  if (id === 'taigyoku') { const h = u.hand || u; Proj.push({ x: h.x, y: h.y, vx: Math.cos(u.aimA) * 420, vy: Math.sin(u.aimA) * 420, life: 0.9, dmg: 90 * P, el: 'wind', r: 50, kind: 'vacuum', boom: 170, team: 0, src: u, hit: new Set(), ult: 1 }); return; }
  if (id === 'doryu') { Game.impact(u.x, u.y, 0.14); for (let k = 0; k < 8; k++) V.spikes(u.x, u.y, k / 8 * TAU, 5, 0, (x, y) => aoe(x, y, 46, 22 * P, u, { el: 'earth', k: 1.2 })); return; } }
function projUpdate(dt) { for (let i = Proj.length - 1; i >= 0; i--) { const p = Proj[i]; p.life -= dt;
    if (p.home && p.team === 0) { const f = nearestFoe(p, 360); if (f) { const a = Math.atan2(f.y - 34 - p.y, f.x - p.x), cur = Math.atan2(p.vy, p.vx); let d = ((a - cur + Math.PI * 3) % TAU) - Math.PI; const n = cur + clamp(d, -4 * dt, 4 * dt), s = Math.hypot(p.vx, p.vy); p.vx = Math.cos(n) * s; p.vy = Math.sin(n) * s; } }
    p.x += p.vx * dt; p.y += p.vy * dt; if (p.trail) { p.trail.unshift([p.x, p.y]); if (p.trail.length > 16) p.trail.pop(); }
    if (p.kind === 'fireball' && Math.random() < 0.7) FX.add({ k: 'spark', x: p.x + rnd(-10, 10), y: p.y + rnd(-10, 10), vx: -p.vx * 0.2 + rnd(-40, 40), vy: -p.vy * 0.2 - 60, c: Math.random() < 0.5 ? '#ffd166' : '#ff6a2a', s: rnd(2, 4), life: 0.35, g: -100 });
    if (p.kind === 'vacuum') { for (const f of World.foes()) if (dist(f, p) < 200 && !f.boss) { f.vx += (p.x - f.x) * dt * 6; f.vy += (p.y + 34 - f.y) * dt * 6; } }
    let boom = p.life <= 0;
    if (p.team === 0) { for (const f of World.foes()) if (!f.passive && !p.hit.has(f) && Math.hypot(f.x - p.x, f.y - (f.kind === 'bijuu' ? 90 : 34) - p.y) < p.r + f.r * (f.kind === 'bijuu' ? 1 : 0.6) + 6) { p.hit.add(f); if (p.boom) { boom = true; break; } hurt(f, p.dmg, p.src, { el: p.el, k: 0.6 }); if (p.kind === 'water' || p.kind === 'dragon') V.splash(f.x, f.y, 30); if (!p.pierce) p.life = 0; } }
    else { const T = [Game.hero, ...Game.allies.filter((a) => !a.down)]; for (const h of T) if (h.hp > 0 && Math.hypot(h.x - p.x, h.y - 34 - p.y) < p.r + h.r) { const perfect = h.isHero && h.iframe > 0 && h.act && h.act.k === 'dash'; const dd = hurt(h, p.dmg, p.src, { el: p.el, k: 0.5 }); if (h.isHero && dd > 0) p.hitH = 1; p.life = 0; if (perfect && !p.dodged) { p.dodged = 1; Game.stat('perfect'); FX.text(h.x, h.y - 110, 'Esquive parfaite', '#8fd3ff', 18, 1); Game.ultGain(8); } break; } }
    if (boom && p.boom) { if (p.kind === 'vacuum') { V.rasenHit(p.x, p.y, 1.8); Game.impact(p.x, p.y, 0.14); } else V.fireBoom(p.x, p.y + 30, p.boom); aoe(p.x, p.y + 34, p.boom, p.dmg, p.src, { el: p.el, k: 1.2, big: 1 }); Cam.shake(0.25); p.life = 0; }
    if (p.life <= 0) { if (p.lesson && !p.hitH && Story.onLessonDodge) Story.onLessonDodge(); Proj.splice(i, 1); } } }
function drawProj(g) { for (const p of Proj) { const c = elc(p.el); g.save();
    if (p.kind === 'bolt') { V.boltPath(g, p.x, p.y, p.x - p.vx * 0.06, p.y - p.vy * 0.06, 8, 3, c); FX.glow; g.fillStyle = '#fff'; g.beginPath(); g.arc(p.x, p.y, 6, 0, TAU); g.fill(); }
    else if (p.kind === 'water') { g.translate(p.x, p.y); g.rotate(Math.atan2(p.vy, p.vx)); g.fillStyle = '#4aa8ff'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 0, 20, 10, 0, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#e6f6ff'; g.beginPath(); g.ellipse(6, -3, 7, 3, 0, 0, TAU); g.fill(); }
    else if (p.kind === 'fireball') V.flame(g, p.x, p.y, p.r * (p.ult ? 1.4 : 1), Game.t + p.life);
    else if (p.kind === 'vacuum') V.orb(g, p.x, p.y, p.r, Game.t * 2, 'rgba(200,255,230,1)', 'rgba(60,200,160,.6)', '#ffffff', 7);
    else if (p.kind === 'blade') { g.translate(p.x, p.y); g.rotate(p.ang || 0); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(190,255,230,.9)'; g.beginPath(); g.arc(0, 0, 26, -1.3, 1.3); g.arc(-10, 0, 22, 1.2, -1.2, true); g.fill(); g.strokeStyle = 'rgba(190,255,230,.4)'; g.lineWidth = 2; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(-20 * k, -8); g.lineTo(-20 * k - 30, -8); g.moveTo(-20 * k, 8); g.lineTo(-20 * k - 30, 8); g.stroke(); } }
    else if (p.kind === 'dragon') { const T = p.trail; for (let k = T.length - 1; k >= 0; k--) { const r = lerp(22, 6, k / T.length); g.fillStyle = k % 3 ? '#3a8ae0' : '#6ec0ff'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(T[k][0], T[k][1] + Math.sin(Game.t * 12 + k) * 4, r, 0, TAU); g.fill(); g.stroke(); }
      g.translate(p.x, p.y); g.rotate(Math.atan2(p.vy, p.vx)); g.fillStyle = '#4aa8ff'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(34, 0); g.lineTo(6, -20); g.lineTo(-10, -12); g.lineTo(-10, 12); g.lineTo(6, 20); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(8, -8, 4, 0, TAU); g.fill(); g.strokeStyle = '#e6f6ff'; g.beginPath(); g.moveTo(-6, -16); g.lineTo(-24, -30); g.moveTo(-6, 16); g.lineTo(-24, 30); g.stroke(); }
    else if (p.kind === 'shuriken') { g.translate(p.x, p.y); g.rotate(Game.t * 25); g.fillStyle = '#c9d3e6'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 8; k++) { const r = k % 2 ? 4 : 12, a = k * Math.PI / 4; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.stroke(); }
    else { V.orb(g, p.x, p.y, 8, Game.t, c, 'rgba(0,0,0,0)', '#fff', 2); } g.restore(); } }
/* ---------- IA ennemie ---------- */
function pickTarget(f) { const h = Game.hero; let best = h.hp > 0 ? h : null, bd = best ? dist(h, f) : 1e9; for (const o of [...Game.clones, ...Game.allies]) if (!o.gone && !o.down && o.hp > 0) { const d = dist(o, f) + 40; if (d < bd) { bd = d; best = o; } } return best || h; }
function foeUpdate(f, dt) { const F = FOE[f.type], h = Game.hero; f.anim += dt * 6; f.sq = lerp(f.sq, 0, 1 - Math.pow(0.0001, dt)); f.hurtT = Math.max(0, f.hurtT - dt); f.flash = Math.max(0, f.flash - dt); f.seenHp = Math.max(0, f.seenHp - dt); f.relT = Math.max(0, (f.relT || 0) - dt); f.wob = Math.max(0, (f.wob || 0) - dt * 2);
  for (const k in f.aura) { f.aura[k] -= dt; if (f.aura[k] <= 0) delete f.aura[k]; } for (const k in f.st) f.st[k] = Math.max(0, f.st[k] - dt);
  if (f.st.burn > 0) { f.bt = (f.bt || 0) - dt; if (f.bt <= 0) { f.bt = 0.5; f.hp -= 3; FX.add({ k: 'spark', x: f.x + rnd(-8, 8), y: f.y - 30, vx: 0, vy: -90, c: elc('fire'), s: 3, life: 0.4, g: 0 }); if (f.hp <= 0) die(f, h); } }
  if (f.type === 'dummy') { f.x = f.hx; f.y = f.hy; f.vx = f.vy = 0; return; } // les mannequins ne quittent plus le cercle
  if (f.kind === 'bijuu') return beastUpdate(f, dt);
  f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= 0.86; f.vy *= 0.86; World.collide(f); f.combat = !!f.aggro;
  if (f.leash) { const d = Math.hypot(f.x - f.leash[0], f.y - f.leash[1]); if (d > f.leash[2]) { f.x = f.leash[0] + (f.x - f.leash[0]) * f.leash[2] / d; f.y = f.leash[1] + (f.y - f.leash[1]) * f.leash[2] / d; } }
  if (f.st.freeze > 0 || f.st.stun > 0 || f.passive) { f.act = null; return; }
  const slow = f.st.slow > 0 ? 0.45 : 1; let tgt = pickTarget(f); if (f.st.confuse > 0) { const o = World.foes().filter((o) => o !== f && o.type !== 'dummy').sort((a, b) => dist(a, f) - dist(b, f))[0]; if (o) tgt = o; }
  const dh = dist(tgt, f), dHome = Math.hypot(f.x - f.hx, f.y - f.hy);
  if (!f.aggro && h.hp > 0 && dist(h, f) < F.aggro && !Game.cine && Story.allowAggro(f)) { f.aggro = true; FX.text(f.x, f.y - 100, '!', '#ff6b5e', 30, true); }
  if (f.aggro && (dHome > 900 || h.hp <= 0) && !f.boss) f.aggro = false;
  if (f.act) { f.act.t += dt; if (f.act.k === 'wind' && f.act.t >= f.act.dur) { const A = f.act; f.act = { k: 'rec', t: 0, dur: 0.5 }; f.sq = 0.3;
      if (F.ranged || A.ranged) { const a = Math.atan2(tgt.y - f.y, tgt.x - f.x); Proj.push({ x: f.x, y: f.y - 34, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, life: 1.2, dmg: F.dmg, el: A.el || F.el, team: 1, r: 12, src: f, kind: (A.el || F.el) === 'water' ? 'water' : (A.el || F.el) === 'bolt' ? 'bolt' : 'orb', hit: new Set() }); }
      else { f.vx += Math.cos(A.a) * (f.boss ? 900 : 620); f.vy += Math.sin(A.a) * (f.boss ? 650 : 450); if (!f.kind) { f.act = { k: 'm1', n: f.boss ? (f.mc = ((f.mc || 0) + 1) % 3) : 0, t: 0.1, dur: 0.34, hit: true, a: A.a }; }
        Game.later(0.09, () => { if (f.hp > 0 && dist(tgt, f) < F.range + 24) hurt(tgt, F.dmg * (f.st.blind > 0 ? 0 : 1) * (tgt.isHero ? 1 : 0.6), f, { el: F.el, k: 0.8 }); }); } }
    else if (f.act.t >= f.act.dur) f.act = null; return; }
  if (f.aggro) { f.face = tgt.x < f.x ? -1 : 1; const want = F.range * 0.8;
    if (dh > want) { const a = Math.atan2(tgt.y - f.y, tgt.x - f.x); f.vx += Math.cos(a) * F.sp * slow * dt * 7; f.vy += Math.sin(a) * F.sp * slow * dt * 7; }
    else if (F.ranged && dh < 160) { const a = Math.atan2(f.y - tgt.y, f.x - tgt.x); f.vx += Math.cos(a) * F.sp * dt * 6; f.vy += Math.sin(a) * F.sp * dt * 6; }
    f.cdA = (f.cdA ?? rnd(0.4, 1.2)) - dt; if (f.cdA <= 0 && dh < F.range + 10) { f.cdA = (f.boss ? 1.0 : 1.7) + rnd(0, 0.8) / [0.7, 1, 1.3][Save.set.diff]; f.act = { k: 'wind', t: 0, dur: f.boss ? 0.4 : [0.8, 0.6, 0.48][Save.set.diff], a: Math.atan2(tgt.y - f.y, tgt.x - f.x) }; f.sq = -0.2; }
    // boss : une technique à distance de temps en temps (télégraphiée)
    if (f.boss && f.type !== 'sensei') { f.cdS = (f.cdS ?? 3) - dt; if (f.cdS <= 0 && dh < 420 && !f.act && F.spikes) { f.cdS = rnd(4, 5.5); f.sign = { k: 'mi', t: 0 }; f.act = { k: 'cast', t: 0, dur: 0.5 }; const a = Math.atan2(tgt.y - f.y, tgt.x - f.x); Game.later(0.45, () => { if (f.hp > 0 && !f.passive) V.spikes(f.x, f.y, a, 8, 1, (x, y) => { for (const t of [h, ...Game.allies]) if (!t.down && Math.hypot(t.x - x, t.y - y) < 44) hurt(t, F.dmg, f, { k: 1 }); }); }); }
    if (f.cdS <= 0 && dh < 420 && !f.act) { f.cdS = rnd(4, 6); f.sign = { k: 'tora', t: 0 }; f.act = { k: 'wind', t: 0, dur: 0.6, a: Math.atan2(tgt.y - f.y, tgt.x - f.x), ranged: 1, el: f.el || F.el || 'yin' }; } } }
  else {
    if (f.path) { f.pi = f.pi || 0; const [tx, ty] = f.path[f.pi]; const d = Math.hypot(tx - f.x, ty - f.y); if (d < 20) f.pi = (f.pi + 1) % f.path.length; else { f.vx += ((tx - f.x) / d) * F.sp * 0.5 * dt * 6; f.vy += ((ty - f.y) / d) * F.sp * 0.5 * dt * 6; f.face = tx < f.x ? -1 : 1; } }
    else if (dHome > 30) { f.vx += ((f.hx - f.x) / dHome) * F.sp * 0.4 * dt * 6; f.vy += ((f.hy - f.y) / dHome) * F.sp * 0.4 * dt * 6; } else if (Math.random() < 0.01) { f.vx += rnd(-60, 60); f.vy += rnd(-30, 30); } }
  if (f.sign) { f.sign.t += dt; if (f.sign.t > 0.55) f.sign = null; } }
/* ---------- Bête à queues : coup de queue, piétinement, rugissement, Bijūdama ---------- */
function beastUpdate(f, dt) { const h = Game.hero; f.anim += dt * 2.2; f.roar = Math.max(0, (f.roar || 0) - dt * 0.6);
  if (!f.aggro) { if (dist(h, f) < 900 && Story.allowAggro(f) && !Game.cine) { f.aggro = true; V.roar(f); } else return; }
  if (Game.cine) return; const tgt = pickTarget(f);
  if (f.casting) { f.vx *= 0.9; f.vy *= 0.9; return; }
  const d = dist(tgt, f); f.face = tgt.x < f.x ? -1 : 1;
  if (f.act) { f.act.t += dt; const A = f.act; if (A.t >= A.dur) { f.act = null;
      if (A.k === 'swipe') { const cx = f.x + f.face * 120, cy = f.y; FX.shock(cx, cy, '#ffd166', 240, 0.4, 10); FX.dust(cx, cy, 16); Cam.shake(0.4); for (const t of [h, ...Game.allies]) if (!t.down && Math.hypot(t.x - cx, t.y - cy) < 200) hurt(t, FOE.bijuu.dmg, f, { k: 2 }); f.sq = 0.1; }
      if (A.k === 'stomp') { FX.shock(f.x, f.y, '#fff', 320, 0.5, 12); V.cracks(f.x, f.y, 240, '#3a2a1a'); Cam.shake(0.6); for (const t of [h, ...Game.allies]) if (!t.down && dist(t, f) < 260) hurt(t, FOE.bijuu.dmg * 0.8, f, { k: 2.5 }); } } else return; }
  const want = 340; if (Math.abs(d - want) > 60) { const a = Math.atan2(tgt.y - f.y, tgt.x - f.x) * 1, s = d > want ? 1 : -0.6; f.vx = lerp(f.vx, Math.cos(a) * f.sp * s, dt * 2); f.vy = lerp(f.vy, Math.sin(a) * f.sp * s, dt * 2); } else { f.vx *= 0.9; f.vy *= 0.9; }
  f.x += f.vx * dt; f.y += f.vy * dt; World.collide(f); if (f.leash) { const L = f.leash, dd = Math.hypot(f.x - L[0], f.y - L[1]); if (dd > L[2]) { f.x = L[0] + (f.x - L[0]) * L[2] / dd; f.y = L[1] + (f.y - L[1]) * L[2] / dd; } }
  f.cdB = (f.cdB ?? 5) - dt; f.cdA = (f.cdA ?? 2) - dt; f.cdS = (f.cdS ?? 8) - dt;
  const k = [0.75, 1, 1.2][Save.set.diff];
  if (f.cdB <= 0) { f.cdB = 13 / k; V.bijuudama(f, () => pickTarget(f), (x, y) => { for (const t of [h, ...Game.allies]) if (!t.down && Math.hypot(t.x - x, t.y - y) < 230) hurt(t, 46, f, { k: 3 }); aoe(x, y, 230, 30, f, { k: 2 }); }); return; }
  if (f.cdS <= 0) { f.cdS = 9 / k; f.act = { k: 'stomp', t: 0, dur: 0.9 }; f.rear = 0.6; Game.later(0.7, () => (f.rear = 0)); FX.add({ k: 'fn', ground: 1, x: f.x, y: f.y, life: 0.9, draw: (g, p, q) => { g.globalAlpha = 0.25 + q * 0.5; g.strokeStyle = '#ff4a5a'; g.lineWidth = 4; g.beginPath(); g.ellipse(f.x, f.y, 260 * q, 120 * q, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(f.x, f.y, 260, 120, 0, 0, TAU); g.stroke(); } }); return; }
  if (f.cdA <= 0 && d < 300) { f.cdA = 3 / k; f.act = { k: 'swipe', t: 0, dur: 0.7 }; const cx = f.x + f.face * 120; FX.add({ k: 'fn', ground: 1, x: cx, y: f.y, life: 0.7, draw: (g, p, q) => { g.globalAlpha = 0.3 + q * 0.5; g.fillStyle = 'rgba(255,74,90,.25)'; g.strokeStyle = '#ff4a5a'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, f.y, 200, 92, 0, 0, TAU); g.fill(); g.stroke(); } }); } }
/* ---------- Alliés (coéquipiers, sensei) et clones ---------- */
function allyUpdate(a, dt) { const h = Game.hero; a.anim += dt * (Math.hypot(a.vx, a.vy) > 25 ? 12 : 3); a.hurtT = Math.max(0, a.hurtT - dt); a.flash = Math.max(0, (a.flash || 0) - dt); a.relT = Math.max(0, (a.relT || 0) - dt); a.sq = lerp(a.sq || 0, 0, 1 - Math.pow(0.0001, dt)); for (const k in a.cd) a.cd[k] = Math.max(0, a.cd[k] - dt);
  if (a.sign) { a.sign.t += dt; if (a.sign.t > 0.55) a.sign = null; }
  if (a.down) { a.koT = (a.koT || 0) + dt; a.reviveT -= dt; a.vx *= 0.8; a.vy *= 0.8; if (a.reviveT <= 0) { a.down = false; a.koT = 0; a.hp = a.maxHp * 0.6; FX.smoke(a.x, a.y - 20, 6); } return; }
  if (a.act) { a.act.t += dt; actStep(a, a.act, dt); if (a.act && a.act.t >= a.act.dur) { const n = a.act; a.act = null; if (n.k === 'm1' && n.n < 2 && Math.random() < 0.6) startM1(a, n.n + 1); } a.x += 0; World.collide(a); return; }
  let f = a.tgt && a.tgt.hp > 0 && !a.tgt.gone ? a.tgt : null; if (!f) { f = null; let bd = 520; for (const o of World.foes()) { if (o.type === 'dummy' || o.passive || !o.aggro && !Game.inCombat()) continue; const d = dist(o, h); if (d < bd) { bd = d; f = o; } } a.tgt = f; }
  a.combat = !!f; let tx, ty, sp = 270;
  if (f) { const d = dist(f, a) - (f.kind === 'bijuu' ? 120 : 0); a.face = f.x < a.x ? -1 : 1;
    if (a.cd[a.skill] <= 0 && d < 380 && Math.random() < 0.02) { castSkill(a, SK[a.skill], a.skill, false); return; }
    if (d < 64) { a.vx *= 0.5; a.vy *= 0.5; if ((a.cdM = (a.cdM || 0) - dt) <= 0) { a.cdM = rnd(0.5, 1.1); startM1(a, 0); } tx = a.x; ty = a.y; } else { const o = a.slot * 50; tx = f.x - Math.cos(Math.atan2(f.y - a.y, f.x - a.x)) * 56 + o * 0.3; ty = f.y + (a.slot - 1) * 20; } }
  else { tx = h.x - h.face * (50 + a.slot * 34); ty = h.y + (a.slot ? 26 : -22); sp = dist(a, h) > 220 ? 330 : 240; if (dist(a, h) > 900) { a.x = h.x - h.face * 60; a.y = h.y; FX.smoke(a.x, a.y - 10, 5); } }
  const dx = tx - a.x, dy = ty - a.y, d = Math.hypot(dx, dy); if (d > 12) { a.vx = lerp(a.vx, dx / d * sp, dt * 8); a.vy = lerp(a.vy, dy / d * sp, dt * 8); if (Math.abs(dx) > 8 && !f) a.face = dx < 0 ? -1 : 1; } else { a.vx *= 0.7; a.vy *= 0.7; }
  a.ninjaRun = !f && sp > 300; a.x += a.vx * dt; a.y += a.vy * dt; World.collide(a); }
function cloneUpdate(c, dt) { c.life -= dt; if (c.life <= 0 || c.hp <= 0) { c.gone = true; FX.smoke(c.x, c.y - 20, 8); return; } const f = nearestFoe(c, 500); c.anim += dt * 11; c.combat = !!f;
  if (c.act) { c.act.t += dt; actStep(c, c.act, dt); if (c.act && c.act.t >= c.act.dur) { const n = c.act; c.act = null; if (n.n < 2 && f && dist(f, c) < 80) startM1(c, n.n + 1); } return; }
  if (f) { const d = dist(f, c); c.face = f.x < c.x ? -1 : 1; if (d > 60) { const a = Math.atan2(f.y - c.y, f.x - c.x); c.vx = Math.cos(a) * c.sp; c.vy = Math.sin(a) * c.sp; c.x += c.vx * dt; c.y += c.vy * dt; } else { c.vx = c.vy = 0; c.tgt = f; startM1(c, 0); } } else { const h = Game.hero; c.vx = c.vy = 0; if (dist(h, c) > 80) { c.x = lerp(c.x, h.x - h.face * 50, dt * 3); c.y = lerp(c.y, h.y, dt * 3); c.vx = (h.x - c.x); } } World.collide(c); }
