/* ============ Combat : héros, techniques, IA ============ */
const SKILLS = [
  { id: 'rasen', n: 'Rasengan', el: 'wind', k: '螺', cd: 3.5, ch: 22, sign: 'ne', lvl: 1 },
  { id: 'shiden', n: 'Raiton : Shiden', el: 'bolt', k: '雷', cd: 3, ch: 18, sign: 'tora', lvl: 2 },
  { id: 'rappa', n: 'Suiton : Rappa', el: 'water', k: '水', cd: 5, ch: 24, sign: 'tori', lvl: 3 },
  { id: 'bunshin', n: 'Kage Bunshin', el: 'yang', k: '影', cd: 12, ch: 30, sign: 'mi', lvl: 4 },
];
const Proj = [];
function heroUpdate(u, dt) {
  const G = Game; u.iframe = Math.max(0, (u.iframe || 0) - dt); for (const k in u.cd) u.cd[k] = Math.max(0, u.cd[k] - dt); u.ch = Math.min(u.maxCh, u.ch + dt * 6);
  if (G.t - (G.lastHurt || -9) > 5 && u.hp < u.maxHp) u.hp = Math.min(u.maxHp, u.hp + dt * 3); // régénération hors combat
  if (u.sign) { u.sign.t += dt; if (u.sign.t > 0.5) u.sign = null; }
  const a = u.act; if (a) { a.t += dt; actStep(u, a, dt); if (a.t >= a.dur) { u.act = null; if (a.next) startM1(u, a.n + 1); } }
  // buffer d'entrée (≈ 150 ms)
  if (Input.pressed('atk')) u.buf = { k: 'atk', t: 0.15 }; if (Input.pressed('dodge')) u.buf = { k: 'dodge', t: 0.15 }; for (let i = 0; i < 4; i++) if (Input.pressed('s' + (i + 1))) u.buf = { k: 's', i, t: 0.15 };
  if (u.buf) { u.buf.t -= dt; const b = u.buf; let used = false;
    if (b.k === 'dodge' && (!u.act || u.act.k === 'm1' && u.act.t > u.act.dur * 0.4) && !u.cd.dodge) { dodge(u); used = true; }
    else if (b.k === 'atk') { if (!u.act) { startM1(u, 0); used = true; } else if (u.act.k === 'm1' && u.act.n < 2 && u.act.t > u.act.dur * 0.35) { u.act.next = true; used = true; } }
    else if (b.k === 's' && !u.act) { cast(u, b.i); used = true; }
    if (used || b.t <= 0) u.buf = null; }
  const m = Input.move(); const busy = u.act && u.act.k !== 'cast';
  if (!busy) { const sp = 260 * (u.st.slow > 0 ? 0.6 : 1); u.vx = lerp(u.vx, m.x * sp, 1 - Math.pow(0.0005, dt)); u.vy = lerp(u.vy, m.y * sp, 1 - Math.pow(0.0005, dt)); if (Math.abs(m.x) > 0.1) u.face = m.x < 0 ? -1 : 1; }
  if (Math.hypot(m.x, m.y) > 0.1 && !busy) u.aim = Math.atan2(m.y, m.x);
  const near = nearestFoe(u, 240); if (near && !busy && Math.hypot(m.x, m.y) < 0.1) u.aimFoe = near; else u.aimFoe = null;
  u.x += u.vx * dt; u.y += u.vy * dt; World.collide(u); u.anim += dt * (Math.hypot(u.vx, u.vy) > 20 ? 11 : 3); u.sq = lerp(u.sq, 0, 1 - Math.pow(0.0001, dt));
}
function nearestFoe(u, r) { let b = null, bd = r; for (const f of World.foes()) { if (f.type === 'dummy' && !Game.inField(u)) continue; const d = dist(f, u); if (d < bd) { bd = d; b = f; } } return b; }
function aimAt(u) { const f = u.aimFoe || nearestFoe(u, 300); if (f) { u.face = f.x < u.x ? -1 : 1; return Math.atan2(f.y - u.y, f.x - u.x); } return u.face < 0 ? Math.PI : 0; }
function startM1(u, n) { const a = aimAt(u); u.act = { k: 'm1', n, t: 0, dur: n === 2 ? 0.36 : 0.26, hit: false, a }; u.vx = Math.cos(a) * 140; u.vy = Math.sin(a) * 100; Sfx.play('swing'); }
function dodge(u) { const m = Input.move(); const a = Math.hypot(m.x, m.y) > 0.1 ? Math.atan2(m.y, m.x) : (u.face < 0 ? Math.PI : 0); u.act = { k: 'dash', t: 0, dur: 0.2, a }; u.iframe = 0.26; u.cd.dodge = 0.45; u.sq = -0.35; u.vx = Math.cos(a) * 900; u.vy = Math.sin(a) * 650; FX.dust(u.x, u.y, 8); Sfx.play('dodge'); Game.stat('dodge'); }
function actStep(u, a, dt) {
  if (a.k === 'm1') { u.vx *= 0.82; u.vy *= 0.82; u.x += u.vx * dt; u.y += u.vy * dt;
    if (!a.hit && a.t > a.dur * 0.3) { a.hit = true; const big = a.n === 2; FX.smear(u, a.a + (big ? -1.9 : a.n ? 1.3 : -1.3), a.a + (big ? 1.9 : a.n ? -1.2 : 1.2), big ? 66 : 54, '#8fd3ff', big); let n = 0;
      for (const f of World.foes()) { const d = dist(f, u); if (d > (big ? 92 : 78) + f.r) continue; let da = Math.abs(((Math.atan2(f.y - u.y, f.x - u.x) - a.a + Math.PI * 3) % TAU) - Math.PI); if (da > 1.4 && d > 30) continue;
        hurt(f, [10, 12, 20][a.n] * Game.pow(), u, { k: big ? 1.6 : 0.4, big, el: u.imbue || null }); n++; }
      if (n) { Game.stat('m1'); if (big) Game.hitstop(0.06); Cam.shake(big ? 0.18 : 0.06); } } }
  else if (a.k === 'dash') { u.x += u.vx * dt; u.y += u.vy * dt; u.vx *= 0.9; u.vy *= 0.9; if (Math.random() < 0.5) FX.add({ k: 'smoke', x: u.x, y: u.y - 30, vx: 0, vy: 0, c: '#8fd3ff', s: 10, life: 0.2, g: 0 }); }
  else if (a.k === 'cast') { if (a.t >= a.dur * 0.95 && !a.fired) { a.fired = true; fire(u, a.i); } }
  else if (a.k === 'rasen') { u.x += Math.cos(a.a) * 760 * dt; u.y += Math.sin(a.a) * 560 * dt; World.collide(u); if (Math.random() < 0.8) FX.add({ k: 'spark', x: u.x + Math.cos(a.a) * 30, y: u.y - 34, vx: rnd(-80, 80), vy: rnd(-80, 80), c: elc('wind'), s: 3, life: 0.25, g: 0 });
    for (const f of World.foes()) if (!a.hitSet.has(f) && dist(f, u) < 50 + f.r) { a.hitSet.add(f); hurt(f, 46 * Game.pow(), u, { el: 'wind', k: 2.2, big: 1 }); FX.ring(f.x, f.y - 30, elc('wind'), 10, 120, 0.4); Cam.shake(0.3); Game.hitstop(0.07); a.t = a.dur; } }
}
function cast(u, i) { const S = SKILLS[i]; if (!S || Game.lvl < S.lvl) { if (S) FX.text(u.x, u.y - 100, 'Niveau ' + S.lvl + ' requis', '#93a3c6', 14); return; } if (u.cd[S.id] > 0) return; if (u.ch < S.ch) { FX.text(u.x, u.y - 100, 'Chakra', '#4aa8ff', 14); return; }
  u.ch -= S.ch; u.cd[S.id] = S.cd; u.sign = { k: S.sign, t: 0 }; u.act = { k: 'cast', i, t: 0, dur: 0.22 }; u.aimA = aimAt(u); Sfx.play('tech'); Game.stat('skill'); }
function fire(u, i) { const S = SKILLS[i], a = u.aimA;
  if (S.id === 'rasen') { u.act = { k: 'rasen', t: 0, dur: 0.32, a, hitSet: new Set() }; u.iframe = 0.3; u.sq = 0.25; return; }
  if (S.id === 'shiden') { Proj.push({ x: u.x + Math.cos(a) * 30, y: u.y - 34, vx: Math.cos(a) * 1100, vy: Math.sin(a) * 1100, life: 0.45, dmg: 34, el: 'bolt', team: 0, r: 16, kind: 'bolt', src: u, hit: new Set(), pierce: 1 }); Cam.shake(0.1); return; }
  if (S.id === 'rappa') { for (let k = -2; k <= 2; k++) { const b = a + k * 0.18; Proj.push({ x: u.x, y: u.y - 30, vx: Math.cos(b) * 620, vy: Math.sin(b) * 620, life: 0.42, dmg: 14, el: 'water', team: 0, r: 22, kind: 'water', src: u, hit: new Set(), pierce: 1 }); } return; }
  if (S.id === 'bunshin') { FX.smoke(u.x + 40, u.y, 12); const c = makeUnit({ x: u.x + u.face * 40, y: u.y + 10, look: 'clone', team: 0, isClone: true, hp: 60, maxHp: 60, life: 8, face: u.face, sp: 280 }); Game.clones.push(c); return; }
}
function projUpdate(dt) { for (let i = Proj.length - 1; i >= 0; i--) { const p = Proj[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.life <= 0) { Proj.splice(i, 1); continue; }
    if (p.team === 0) { for (const f of World.foes()) if (!p.hit.has(f) && Math.hypot(f.x - p.x, f.y - 34 - p.y) < p.r + f.r + 6) { p.hit.add(f); hurt(f, p.dmg * Game.pow(), p.src, { el: p.el, k: 0.6 }); if (!p.pierce) p.life = 0; } }
    else { const h = Game.hero; if (h.hp > 0 && Math.hypot(h.x - p.x, h.y - 34 - p.y) < p.r + h.r) { hurt(h, p.dmg, p.src, { el: p.el, k: 0.5 }); p.life = 0; if (h.iframe > 0 && h.act && h.act.k === 'dash') { Game.stat('perfect'); FX.text(h.x, h.y - 100, 'Esquive parfaite', '#8fd3ff', 16); } } } } }
function drawProj(g) { for (const p of Proj) { const c = elc(p.el); g.save(); g.translate(p.x, p.y); if (p.kind === 'bolt') { g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); for (let k = 1; k < 5; k++) g.lineTo(-p.vx * 0.012 * k + rnd(-7, 7), -p.vy * 0.012 * k + rnd(-7, 7)); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 5, 0, TAU); g.fill(); }
    else if (p.kind === 'water') { g.fillStyle = c; g.globalAlpha = 0.75; g.beginPath(); g.ellipse(0, 0, 18, 10, Math.atan2(p.vy, p.vx), 0, TAU); g.fill(); }
    else { g.fillStyle = c; g.beginPath(); g.arc(0, 0, 9, 0, TAU); g.fill(); g.strokeStyle = '#0b1020'; g.lineWidth = 2; g.stroke(); } g.restore(); } }
/* ---------- IA : ennemis placés, aggro, télégraphie, laisse ---------- */
function foeUpdate(f, dt) { const F = FOE[f.type], h = Game.hero; f.anim += dt * 6; f.sq = lerp(f.sq, 0, 1 - Math.pow(0.0001, dt)); f.hurtT = Math.max(0, f.hurtT - dt); f.flash = Math.max(0, f.flash - dt); f.seenHp = Math.max(0, f.seenHp - dt);
  for (const k in f.aura) { f.aura[k] -= dt; if (f.aura[k] <= 0) delete f.aura[k]; } for (const k in f.st) f.st[k] = Math.max(0, f.st[k] - dt);
  if (f.st.burn > 0) { f.bt = (f.bt || 0) - dt; if (f.bt <= 0) { f.bt = 0.5; f.hp -= 3; FX.add({ k: 'spark', x: f.x + rnd(-8, 8), y: f.y - 30, vx: 0, vy: -90, c: elc('fire'), s: 3, life: 0.4, g: 0 }); if (f.hp <= 0) die(f, h); } }
  f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= 0.86; f.vy *= 0.86; World.collide(f); if (f.type === 'dummy') return;
  if (f.st.freeze > 0 || f.st.stun > 0) { f.act = null; return; }
  const slow = f.st.slow > 0 ? 0.45 : 1; let tgt = h; if (f.st.confuse > 0) { const o = World.foes().filter((o) => o !== f && o.type !== 'dummy').sort((a, b) => dist(a, f) - dist(b, f))[0]; if (o) tgt = o; }
  const clone = Game.clones.find((c) => !c.gone && dist(c, f) < dist(h, f)); if (clone && f.st.confuse <= 0) tgt = clone;
  const dh = dist(tgt, f), dHome = Math.hypot(f.x - f.hx, f.y - f.hy);
  if (!f.aggro && h.hp > 0 && dist(h, f) < F.aggro && !Game.cine && Story.allowAggro(f)) { f.aggro = true; FX.text(f.x, f.y - 90, '!', '#ff6b5e', 26, true); }
  if (f.aggro && (dHome > 900 || h.hp <= 0) && !f.boss) f.aggro = false;
  if (f.act) { f.act.t += dt; if (f.act.k === 'wind' && f.act.t >= f.act.dur) { const A = f.act; f.act = { k: 'rec', t: 0, dur: 0.5 }; f.sq = 0.3;
      if (F.ranged) { const a = Math.atan2(tgt.y - f.y, tgt.x - f.x); Proj.push({ x: f.x, y: f.y - 34, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, life: 1.2, dmg: F.dmg, el: F.el, team: 1, r: 12, src: f, kind: F.el, hit: new Set() }); }
      else { f.vx += Math.cos(A.a) * (f.boss ? 900 : 620); f.vy += Math.sin(A.a) * (f.boss ? 650 : 450); setTimeout(() => { if (f.hp > 0 && dist(tgt, f) < F.range + 20) { if (tgt === h) hurt(h, F.dmg * (f.st.blind > 0 ? 0 : 1), f, { el: F.el, k: 0.8 }); else if (tgt.isClone) { tgt.hp -= F.dmg; if (tgt.hp <= 0) die(tgt); } else hurt(tgt, F.dmg, f, { k: 0.5 }); } }, 90); } }
    else if (f.act.t >= f.act.dur) f.act = null; return; }
  if (f.aggro) { f.face = tgt.x < f.x ? -1 : 1; const want = F.ranged ? F.range * 0.8 : F.range * 0.8;
    if (dh > want) { const a = Math.atan2(tgt.y - f.y, tgt.x - f.x); f.vx += Math.cos(a) * F.sp * slow * dt * 7; f.vy += Math.sin(a) * F.sp * slow * dt * 7; }
    else if (F.ranged && dh < 160) { const a = Math.atan2(f.y - tgt.y, f.x - tgt.x); f.vx += Math.cos(a) * F.sp * dt * 6; f.vy += Math.sin(a) * F.sp * dt * 6; }
    f.cdA = (f.cdA || rnd(0.3, 1)) - dt; if (f.cdA <= 0 && dh < F.range + 10) { f.cdA = (f.boss ? 0.9 : 1.6) + rnd(0, 0.8) / [0.7, 1, 1.4][Save.set.diff]; f.act = { k: 'wind', t: 0, dur: f.boss ? 0.32 : [0.75, 0.55, 0.42][Save.set.diff], a: Math.atan2(tgt.y - f.y, tgt.x - f.x) }; f.sq = -0.2; } }
  else { // routine : patrouille ou garde du camp
    if (f.path) { f.pi = f.pi || 0; const [tx, ty] = f.path[f.pi]; const d = Math.hypot(tx - f.x, ty - f.y); if (d < 20) f.pi = (f.pi + 1) % f.path.length; else { f.vx += ((tx - f.x) / d) * F.sp * 0.5 * dt * 6; f.vy += ((ty - f.y) / d) * F.sp * 0.5 * dt * 6; f.face = tx < f.x ? -1 : 1; } }
    else if (dHome > 30) { f.vx += ((f.hx - f.x) / dHome) * F.sp * 0.4 * dt * 6; f.vy += ((f.hy - f.y) / dHome) * F.sp * 0.4 * dt * 6; } else if (Math.random() < 0.01) { f.vx += rnd(-60, 60); f.vy += rnd(-30, 30); } } }
function cloneUpdate(c, dt) { c.life -= dt; if (c.life <= 0 || c.hp <= 0) { c.gone = true; FX.smoke(c.x, c.y - 20, 8); return; } const f = nearestFoe(c, 500); c.anim += dt * 10;
  if (c.act) { c.act.t += dt; if (c.act.k === 'm1') { if (!c.act.hit && c.act.t > 0.08) { c.act.hit = true; FX.smear(c, c.act.a - 1.2, c.act.a + 1.2, 50, elc('yang'), 0); if (f && dist(f, c) < 80) hurt(f, 9 * Game.pow(), Game.hero, { el: 'yang', k: 0.4 }); } if (c.act.t > 0.3) c.act = null; } return; }
  if (f) { const d = dist(f, c); c.face = f.x < c.x ? -1 : 1; if (d > 60) { const a = Math.atan2(f.y - c.y, f.x - c.x); c.x += Math.cos(a) * c.sp * dt; c.y += Math.sin(a) * c.sp * dt; c.vx = Math.cos(a) * c.sp; c.vy = 0; } else { c.vx = 0; c.act = { k: 'm1', n: 0, t: 0, dur: 0.3, a: Math.atan2(f.y - c.y, f.x - c.x) }; } } else { const h = Game.hero; if (dist(h, c) > 80) { c.x = lerp(c.x, h.x - h.face * 50, dt * 3); c.y = lerp(c.y, h.y, dt * 3); } } World.collide(c); }
