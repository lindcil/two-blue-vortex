/* ============ Personnages : rig hiérarchique, héros, ennemis, combat ============ */
// Rig : racine › hanches › colonne › poitrine › cou › tête ; épaule › coude › main ; hanche › genou › pied.
// Une seule orientation (u.face = ±1) appliquée à tout le corps : jamais de membre qui regarde ailleurs.
const LOOKS = {
  boruto: { hair: '#f2d16b', skin: '#f2c9a0', top: '#262b40', bot: '#1b1f2e', cloak: '#30364f', hood: 0, sword: 1, scar: 1 },
  sarada: { hair: '#1c1c28', skin: '#f2c9a0', top: '#b8323a', bot: '#2a2a3a', glasses: 1 },
  code: { hair: '#e8e8f0', skin: '#e9d2c0', top: '#151520', bot: '#151520', marks: 1 },
  jura: { hair: '#cfd8c8', skin: '#d8e0d0', top: '#3c5a3c', bot: '#2a3a2a' },
  deserter: { hair: '#2a2a2a', skin: '#e0b890', top: '#4a4a40', bot: '#2a2a28', mask: 1 },
  clone: { hair: '#f2d16b', skin: '#f2c9a0', top: '#262b40', bot: '#1b1f2e', ghost: 1 },
};
function pose(u) { // angles (rad) pour : torse, bras avant/arrière (épaule, coude), jambes avant/arrière (hanche, genou), rebond
  const t = u.anim || 0, P = { lean: 0, sa: 0.2, ea: 0.4, sb: -0.2, eb: 0.4, ha: 0, ka: 0, hb: 0, kb: 0, bob: 0, head: 0 };
  const mv = Math.hypot(u.vx || 0, u.vy || 0);
  if (u.act && u.act.k === 'm1') { const a = u.act, q = clamp(a.t / a.dur, 0, 1); const ph = q < 0.25 ? -ease.out(q / 0.25) : q < 0.45 ? lerp(-1, 1.3, ease.out((q - 0.25) / 0.2)) : lerp(1.3, 0.9, ease.back((q - 0.45) / 0.55));
    if (a.n === 0) { P.sa = -0.6 + ph * 1.6; P.ea = 0.1; P.lean = ph * 0.25; } else if (a.n === 1) { P.sa = 1.8 - ph * 1.8; P.ea = -0.2; P.lean = -ph * 0.2; P.sb = 0.6; } else { P.sa = -1.6 + ph * 2.6; P.sb = -1.4 + ph * 2; P.ea = P.eb = 0; P.lean = ph * 0.4; P.ha = 0.6 * ph; P.hb = -0.5 * ph; }
    return P; }
  if (u.act && u.act.k === 'cast') { P.sa = -1.2; P.sb = -1.0; P.ea = 1.6; P.eb = 1.7; P.lean = 0.05; return P; }
  if (u.act && u.act.k === 'dash') { P.lean = 0.7; P.sa = 1.2; P.sb = 1.0; P.ha = -0.9; P.hb = 0.6; P.ka = 1.2; P.kb = 0.4; return P; }
  if (u.act && u.act.k === 'rasen') { P.lean = 0.55; P.sa = -1.45; P.ea = 0.1; P.sb = 0.9; P.ha = -0.7; P.hb = 0.7; P.ka = 0.9; return P; }
  if (u.hurtT > 0) { P.lean = -0.45; P.sa = 0.8; P.sb = 1.1; P.head = -0.3; return P; }
  if (u.down) { P.lean = -1.4; return P; }
  if (mv > 20) { const s = Math.sin(t), c = Math.cos(t); P.ha = s * 0.75; P.hb = -s * 0.75; P.ka = Math.max(0, -s) * 1.1 + 0.15; P.kb = Math.max(0, s) * 1.1 + 0.15; P.sa = -s * 0.8; P.sb = s * 0.8; P.ea = P.eb = 0.6; P.lean = Math.min(0.35, mv / 900); P.bob = Math.abs(c) * 3; }
  else { const b = Math.sin(t * 0.35); P.bob = b * 1.2; P.sa = 0.15 + b * 0.04; P.sb = -0.15 - b * 0.04; }
  return P; }
function drawRig(g, u) { const L = LOOKS[u.look] || u.lookObj || LOOKS.deserter; const P = pose(u); const s = (u.size || 1);
  g.save(); g.translate(u.x, u.y); g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 0, 18 * s, 6 * s, 0, 0, TAU); g.fill();
  const sq = u.sq || 0; g.scale(u.face * s * (1 - sq * 0.5), s * (1 + sq)); if (L.ghost) g.globalAlpha = 0.72; if (u.flash > 0 && !Save.set.rf) g.filter = 'brightness(3)';
  const limb = (x, y, a1, a2, l1, l2, w, c) => { const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1, fx = kx + Math.sin(a1 + a2) * l2, fy = ky + Math.cos(a1 + a2) * l2; g.strokeStyle = '#0b1020'; g.lineCap = 'round'; g.lineWidth = w + 3; g.beginPath(); g.moveTo(x, y); g.lineTo(kx, ky); g.lineTo(fx, fy); g.stroke(); g.strokeStyle = c; g.lineWidth = w; g.stroke(); return [fx, fy]; };
  const hipY = -26 - P.bob; // hanches
  limb(-3, hipY, P.hb, P.kb, 13, 13, 7, L.bot); // jambe arrière
  g.save(); g.translate(0, hipY); g.rotate(P.lean); // colonne
  const arm = (sa, ea, back) => limb(back ? -4 : 4, -22, Math.PI - sa, -ea, 11, 11, 6, back ? shade(L.top) : L.top);
  const hb = arm(P.sb, P.eb, 1);
  if (L.cloak) { g.fillStyle = L.cloak; g.beginPath(); g.moveTo(-9, -26); g.quadraticCurveTo(-18 - Math.min(10, Math.hypot(u.vx || 0, u.vy || 0) / 40), 4, -12, 10); g.lineTo(6, 6); g.lineTo(8, -26); g.closePath(); g.fill(); g.strokeStyle = '#0b1020'; g.lineWidth = 2; g.stroke(); }
  g.fillStyle = L.top; g.strokeStyle = '#0b1020'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-9, -28); g.lineTo(9, -28); g.lineTo(7, 2); g.lineTo(-8, 2); g.closePath(); g.fill(); g.stroke(); // poitrine
  if (L.sword) { g.strokeStyle = '#1a1a22'; g.lineWidth = 4; g.beginPath(); g.moveTo(-10, -30); g.lineTo(8, 4); g.stroke(); }
  if (L.marks) { g.strokeStyle = '#6a6aff'; g.lineWidth = 1.5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-6 + i * 4, -24); g.lineTo(-2 + i * 4, -10); g.stroke(); } }
  // tête
  g.save(); g.translate(1, -34); g.rotate(P.head); g.fillStyle = L.skin; g.beginPath(); g.arc(0, -8, 10, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = '#0b1020'; g.fillRect(4, -10, 3, 4); if (L.scar) { g.strokeStyle = '#b25a4a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(5, -16); g.lineTo(6, -2); g.stroke(); }
  if (L.glasses) { g.strokeStyle = '#d04050'; g.lineWidth = 1.5; g.strokeRect(2, -12, 7, 5); }
  if (L.mask) { g.fillStyle = '#c9c0b0'; g.beginPath(); g.arc(1, -8, 9, -1.2, 1.4); g.fill(); }
  g.fillStyle = L.hair; g.strokeStyle = '#0b1020'; g.lineWidth = 2; g.beginPath(); // cheveux en pointes (Boruto) / génériques
  if (u.look === 'boruto' || u.look === 'clone') { g.moveTo(-11, -6); for (let i = 0; i < 6; i++) { const a = Math.PI + 0.2 + (i / 5) * (Math.PI - 0.4); g.lineTo(Math.cos(a) * 16 - 2, -9 + Math.sin(a) * 15); g.lineTo(Math.cos(a + 0.25) * 9, -9 + Math.sin(a + 0.25) * 9); } g.lineTo(11, -8); }
  else { g.arc(0, -10, 11, Math.PI * 0.95, Math.PI * 2.05); g.lineTo(9, -6); g.lineTo(-11, -4); } g.closePath(); g.fill(); g.stroke();
  if (u.hood) { g.fillStyle = L.cloak || '#30364f'; g.beginPath(); g.arc(-1, -9, 13, Math.PI * 0.85, Math.PI * 2.1); g.lineTo(-12, 2); g.closePath(); g.fill(); g.stroke(); }
  if (L.band) { g.fillStyle = '#7a8aa0'; g.fillRect(-9, -15, 18, 4); }
  g.restore();
  const hf = arm(P.sa, P.ea, 0); g.restore();
  limb(3, hipY, P.ha, P.ka, 13, 13, 7, L.bot); // jambe avant
  g.restore(); u.handF = { x: u.x + u.face * (hf[0] * Math.cos(P.lean)), y: u.y + hipY + hf[1] };
  if (u.sign && u.sign.t < 0.5) drawHands(g, u.x, u.y - 92, u.sign.k, u.sign.t); }
function shade(c) { return c.replace(/^#(..)(..)(..)$/, (m, r, gg, b) => '#' + [r, gg, b].map((h) => Math.round(parseInt(h, 16) * 0.75).toString(16).padStart(2, '0')).join('')); }
/* ---------- Monstres non humanoïdes ---------- */
function drawBeast(g, u) { g.save(); g.translate(u.x, u.y); g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 0, 24 * (u.size || 1), 7, 0, 0, TAU); g.fill(); const sq = u.sq || 0; g.scale(u.face * (u.size || 1) * (1 - sq * 0.4), (u.size || 1) * (1 + sq));
  const t = u.anim || 0, wind = u.act && u.act.k === 'wind' ? u.act.t / u.act.dur : 0;
  if (u.kind === 'grime') { g.fillStyle = '#14121c'; g.strokeStyle = '#000'; g.lineWidth = 2; g.beginPath(); g.moveTo(-26, -6); g.quadraticCurveTo(-30, -40 - wind * 10, 0, -44 - Math.sin(t) * 3); g.quadraticCurveTo(30, -40, 26, -6); g.quadraticCurveTo(0, 4, -26, -6); g.fill(); g.stroke();
    for (let i = 0; i < 4; i++) { g.strokeStyle = '#14121c'; g.lineWidth = 5; g.beginPath(); g.moveTo(-14 + i * 9, -8); g.lineTo(-18 + i * 11 + Math.sin(t + i) * 5, 2); g.stroke(); }
    g.strokeStyle = '#d8d8ff'; g.lineWidth = 2; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-8 + i * 7, -36); g.lineTo(-2 + i * 7, -16); g.stroke(); } g.fillStyle = wind ? '#ff5a5a' : '#ffe680'; g.beginPath(); g.arc(14, -30, 3.5, 0, TAU); g.fill(); }
  else if (u.kind === 'sprout') { g.fillStyle = '#5a3f5e'; g.strokeStyle = '#1a0f1c'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(-20 - wind * 6, -40, -6, -62 + Math.sin(t) * 2); g.quadraticCurveTo(10, -70, 14, -50); g.quadraticCurveTo(22, -20, 14, 0); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = '#5a3f5e'; g.lineWidth = 5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 10, -40); g.quadraticCurveTo(s * 30, -50 + Math.sin(t + s) * 6, s * (34 + wind * 12), -26); g.stroke(); }
    g.fillStyle = '#e0a0ff'; g.beginPath(); g.arc(6, -52, 4, 0, TAU); g.fill(); g.fillStyle = '#b07ab8'; g.beginPath(); g.arc(-4, -30, 6, 0, TAU); g.fill(); }
  else if (u.kind === 'dummy') { g.fillStyle = '#a07a46'; g.strokeStyle = '#3b2a1e'; g.lineWidth = 2; g.fillRect(-4, -60, 8, 60); g.beginPath(); g.ellipse(0, -48, 15, 18, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -72, 10, 0, TAU); g.fill(); g.stroke(); }
  g.restore(); }
/* ---------- Création ---------- */
function makeUnit(o) { return Object.assign({ x: 0, y: 0, vx: 0, vy: 0, r: 14, face: 1, hp: 100, maxHp: 100, team: 1, aura: {}, st: {}, cd: {}, anim: 0, sq: 0, armor: 0, hurtT: 0, flash: 0 }, o); }
const FOE = {
  grime: { n: 'Claw Grime', hp: 55, dmg: 9, sp: 210, look: null, kind: 'grime', range: 52, xp: 14, aggro: 380 },
  sprout: { n: 'Rejeton du Shinju', hp: 80, dmg: 11, sp: 120, kind: 'sprout', range: 70, el: 'earth', xp: 22, aggro: 300 },
  deserter: { n: 'Déserteur', hp: 85, dmg: 10, sp: 170, look: 'deserter', range: 360, el: 'fire', ranged: 1, xp: 24, aggro: 420 },
  stormer: { n: 'Ninja errant', hp: 95, dmg: 12, sp: 180, look: 'deserter', range: 330, el: 'bolt', ranged: 1, xp: 28, aggro: 420 },
  code: { n: 'Code', hp: 520, dmg: 16, sp: 330, look: 'code', range: 70, xp: 200, aggro: 900, boss: 1, size: 1.15 },
  dummy: { n: 'Mannequin', hp: 1e9, dmg: 0, sp: 0, kind: 'dummy', range: 0, xp: 0, aggro: 0 },
};
function spawnFoe(type, x, y, extra) { const F = FOE[type]; const k = [0.7, 1, 1.3][Save.set.diff]; const u = makeUnit(Object.assign({ type, n: F.n, x, y, hx: x, hy: y, hp: F.hp * k, maxHp: F.hp * k, look: F.look, kind: F.kind, sp: F.sp, size: F.size || 1, seenHp: 0 }, extra || {})); u.maxHp = u.hp; World.foes_.push(u); return u; }
/* ---------- Dégâts ---------- */
function hurt(t, dmg, src, o = {}) { if (!t || t.hp <= 0 || t.gone) return 0; if (t.isHero && (t.iframe > 0 || Game.cine)) return 0;
  let r = { dmg, rx: null }; if (o.el && !t.isHero) r = applyEl(src, t, o.el, dmg); let d = r.dmg * (t.armor ? 0.6 : 1); if (t.isHero) d *= [0.5, 1, 1.4][Save.set.diff];
  if (t.type === 'dummy') { t.hp = t.maxHp; } else t.hp -= d;
  t.hurtT = 0.18; t.flash = 0.1; t.sq = -0.25; t.seenHp = 4; if (o.k !== 0 && src) { const a = Math.atan2(t.y - src.y, t.x - src.x); const kb = (o.k || 1) * (t.boss ? 120 : 260); t.vx += Math.cos(a) * kb; t.vy += Math.sin(a) * kb; }
  FX.burst(t.x, t.y - 34, o.el ? elc(o.el) : (t.isHero ? '#ff6b5e' : '#ffd166'), o.big ? 16 : 8); FX.text(t.x + rnd(-10, 10), t.y - 70, Math.round(d), t.isHero ? '#ff8a7e' : r.rx ? '#fff' : '#eef3ff', o.big ? 22 : 16);
  Sfx.play(o.big ? 'heavy' : t.isHero ? 'hurt' : 'hit'); if (t.isHero) { Cam.shake(0.25); Game.lastHurt = Game.t; }
  if (t.hp <= 0) die(t, src); return d; }
function die(t, src) { if (t.isHero) return Game.heroDown(); if (t.isClone) { t.gone = true; FX.smoke(t.x, t.y - 20, 10); return; } t.deadT = 0; FX.burst(t.x, t.y - 30, '#ffd166', 20); FX.smoke(t.x, t.y - 10, 8);
  if (t.boss) { Game.impact(t.x, t.y, 0.18); } Game.gainXp(FOE[t.type].xp * 5); Story.onKill(t); }
