/* ============ Personnages v0.2 : nouveau rig, poses exagérées (ZZZ), squash & stretch ============ */
// Repère local : +x = devant (u.face), angles des membres mesurés depuis la verticale basse, positif = vers l'avant.
// Une seule orientation pour tout le corps. Les poses sont interpolées (anticipation → frappe → retour avec dépassement).
const INK = '#0b1020';
const LOOKS = {
  boruto: { hair: '#f2d16b', hs: 'spiky', skin: '#f2c9a0', eye: '#3aa0ff', top: '#262b40', bot: '#1b1f2e', cloak: '#30364f', sword: 1, scar: 1, karma: 1 },
  sarada: { hair: '#1c1c28', hs: 'bob', skin: '#f2c9a0', eye: '#d0283a', top: '#b8323a', bot: '#2a2a3a', glasses: 1, band: 1 },
  code: { hair: '#e8e8f0', hs: 'slick', skin: '#e9d2c0', eye: '#e8e8f0', top: '#151520', bot: '#151520', marks: 1, cloak: '#1d1d2c' },
  kawaki: { hair: '#15151c', hs: 'messy', skin: '#e6c4a4', eye: '#cfd6e6', top: '#e8e8ee', bot: '#22222c', karma: 1, scarf: '#22222c' },
  jura: { hair: '#cfd8c8', hs: 'long', skin: '#d8e0d0', eye: '#9ce0a0', top: '#3c5a3c', bot: '#2a3a2a', marks: 1 },
  himawari: { hair: '#2b2f6a', hs: 'bob', skin: '#f2c9a0', eye: '#3aa0ff', top: '#e0b13a', bot: '#4a4a7a', kid: 0, band: 1 },
  deserter: { hair: '#2a2a2a', hs: 'buzz', skin: '#e0b890', eye: '#222', top: '#4a4a40', bot: '#2a2a28', mask: 1, band: 2 },
  kuro: { hair: '#1a1a1a', hs: 'slick', skin: '#d8b896', eye: '#ff4a4a', top: '#1b1b22', bot: '#141418', mask: 1, cloak: '#1b1b22', org: 1 },
  clone: { hair: '#f2d16b', hs: 'spiky', skin: '#f2c9a0', eye: '#3aa0ff', top: '#262b40', bot: '#1b1f2e', cloak: '#30364f', ghost: 1 },
};
const HAIRSTYLES = ['spiky', 'bob', 'long', 'pony', 'buns', 'pineapple', 'buzz', 'messy', 'slick', 'bald'];
const PAL = { skin: ['#f6d3b3', '#f2c9a0', '#e0b48c', '#c99a6e', '#a8764e', '#7a5236'], hair: ['#1c1c28', '#3a2a1e', '#6a4a2a', '#c0582a', '#f2d16b', '#e8e8f0', '#7a3d8f', '#2b2f6a', '#4a6a3a', '#b03040', '#888'],
  top: ['#3d5a3a', '#7a3d8f', '#c04a4a', '#3a7a6a', '#5aa0d0', '#e0b13a', '#e06a8a', '#6a6a8a', '#8a5a3a', '#2f4f7f', '#eeeeee', '#3a3a3a'], bot: ['#2a2a3a', '#1b1f2e', '#3a4a6a', '#2a3a2a', '#4a3a2a', '#555'] };
function mulb(s) { return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeLook(seed, o = {}) { const R = mulb(seed * 7919 + 13), P = (a) => a[(R() * a.length) | 0];
  const L = { skin: P(PAL.skin), hair: P(PAL.hair), hs: P(HAIRSTYLES), eye: P(['#222', '#3a2a1e', '#3a5aa0', '#3a7a4a']), top: P(PAL.top), bot: P(PAL.bot) };
  const r = R(); if (r < 0.18) L.vest = '#4f6b3c'; else if (r < 0.28) L.apron = '#f2f2f2'; else if (r < 0.38) L.cloak = P(PAL.top); else if (r < 0.45) L.scarf = P(PAL.top);
  if (R() < 0.3) L.band = 1; if (R() < 0.08) L.glasses = 1; if (R() < 0.12) L.belly = 1; return Object.assign(L, o); }
function lookOf(u) { return typeof u.look === 'object' && u.look ? u.look : LOOKS[u.look] || u.lookObj || LOOKS.deserter; }
/* ---------- Poses ---------- */
const STANCE = { by: 0, lean: 0.12, sx: 1, sy: 1, head: 0, aF: 0.75, eF: 1.9, aB: 0.45, eB: 1.7, hF: 0.35, kF: -0.3, hB: -0.3, kB: -0.35, rot: 0, mouth: 0 };
const RELAX = { by: 0, lean: 0.02, sx: 1, sy: 1, head: 0, aF: 0.1, eF: 0.25, aB: -0.08, eB: 0.3, hF: 0.06, kF: -0.05, hB: -0.06, kB: -0.05, rot: 0, mouth: 0 };
const PK = Object.keys(STANCE);
function mixP(a, b, t) { const o = {}; for (const k of PK) o[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t; return o; }
const M1K = [ // [anticipation, frappe] ; retour vers la garde avec dépassement
  [{ aF: -0.35, eF: 2.3, aB: 0.6, eB: 1.9, lean: -0.14, sx: 0.9, sy: 1.1, hF: 0.3, kF: -0.4, hB: -0.45, kB: -0.4, mouth: 0 },
   { aF: 1.68, eF: 0, aB: 0.15, eB: 1.9, lean: 0.42, sx: 1.2, sy: 0.86, hF: 0.75, kF: -0.15, hB: -0.65, kB: -0.25, mouth: 1 }],
  [{ lean: -0.28, hF: -0.2, kF: -1.6, aF: 1.0, eF: 1.7, aB: -0.5, eB: 1.0, sx: 1.06, sy: 0.9, hB: -0.1, kB: -0.5, by: -2, mouth: 0 },
   { lean: -0.5, hF: 1.95, kF: -0.05, aF: 1.1, eF: 1.3, aB: -1.2, eB: 0.4, sx: 1.14, sy: 0.92, hB: -0.15, kB: -0.15, by: -8, mouth: 1 }],
  [{ by: -30, aF: 2.95, eF: 0.3, aB: 2.75, eB: 0.35, lean: -0.22, hF: 0.7, kF: -1.5, hB: 0.25, kB: -1.3, sx: 0.84, sy: 1.2, mouth: 1 },
   { by: 0, aF: 1.05, eF: 0.1, aB: 0.95, eB: 0.2, lean: 0.8, hF: 1.0, kF: -1.3, hB: -0.95, kB: -0.4, sx: 1.34, sy: 0.7, mouth: 1 }],
];
function poseOf(u) { const a = u.act, comb = u.combat, t = u.anim || 0, mv = Math.hypot(u.vx || 0, u.vy || 0);
  const base = comb ? STANCE : RELAX;
  if (u.hp <= 0 && !u.isNpc || u.down) { const k = clamp((u.deadT ?? u.downT0 ?? 1) / 0.35, 0, 1), e = ease.out(k); return { ...RELAX, rot: -1.5 * e, by: -Math.sin(k * Math.PI) * 14, aF: 2.2, eF: 0.4, aB: 2.6, eB: 0.2, hF: 0.6, kF: -0.4, hB: 0.2, kB: -0.2, sx: 1 + 0.15 * Math.sin(k * Math.PI), sy: 1 - 0.1 * Math.sin(k * Math.PI), head: -0.3 }; }
  if (a && a.k === 'm1') { const K = M1K[Math.min(2, a.n)], q = clamp(a.t / a.dur, 0, 1), A = { ...base, ...K[0] }, S = { ...base, ...K[1] };
    if (q < 0.28) return mixP(base, A, ease.out(q / 0.28)); if (q < 0.42) return mixP(A, S, ease.out((q - 0.28) / 0.14)); const r = (q - 0.42) / 0.58; return mixP(S, STANCE, ease.inout(r)); }
  if (a && a.k === 'cast') { const q = clamp(a.t / a.dur, 0, 1); return mixP(base, { ...STANCE, aF: 0.95, eF: 2.0, aB: 0.95, eB: 2.0, lean: 0.06, sx: 1.05, sy: 0.93, hF: 0.35, kF: -0.5, hB: -0.35, kB: -0.5, head: 0.12, by: 2 }, ease.out(Math.min(1, q * 2))); }
  if (u.relT > 0) { const q = 1 - u.relT / 0.3; return mixP({ ...STANCE, aF: 1.62, eF: 0, aB: -0.6, eB: 0.8, lean: 0.36, sx: 1.16, sy: 0.88, hF: 0.7, kF: -0.2, hB: -0.6, kB: -0.3, mouth: 1 }, STANCE, ease.inout(q)); }
  if (a && a.k === 'dash') { const q = clamp(a.t / a.dur, 0, 1); const air = { ...base, lean: 1.0, sx: 1.38, sy: 0.72, aF: -1.35, eF: 0.3, aB: -1.15, eB: 0.3, hF: 1.0, kF: -1.9, hB: 0.45, kB: -1.7, by: -10, head: -0.2 };
    if (q < 0.12) return mixP(base, { ...base, sy: 0.78, sx: 1.18, by: 2, kF: -0.9, kB: -0.9 }, q / 0.12); if (q < 0.75) return air; return mixP(air, { ...STANCE, sy: 0.85, sx: 1.12 }, (q - 0.75) / 0.25); }
  if (a && (a.k === 'rasen' || a.k === 'chidori' || a.k === 'fang')) { const s = Math.sin(t * 1.6); return { ...STANCE, aF: 1.5, eF: 0.05, aB: -1.1, eB: 0.4, lean: 0.62, hF: 0.9 * s, kF: -0.3 - Math.max(0, -s) * 1.3, hB: -0.9 * s, kB: -0.3 - Math.max(0, s) * 1.3, sx: 1.15, sy: 0.9, by: -Math.abs(s) * 4, mouth: 1 }; }
  if (a && a.k === 'ult') { const q = clamp(a.t / a.dur, 0, 1); return mixP({ ...STANCE, aF: 2.6, eF: 0.4, aB: 0.5, eB: 1.5, lean: -0.15, sy: 1.12, sx: 0.9, by: -6, head: -0.25, mouth: 1 }, { ...STANCE, aF: 1.6, eF: 0, lean: 0.5, sx: 1.25, sy: 0.82 }, q > 0.8 ? ease.out((q - 0.8) / 0.2) : 0); }
  if (u.hurtT > 0) { const k = u.hurtT / 0.2; return mixP(base, { ...base, lean: -0.6, head: -0.5, aF: -0.7, eF: 0.9, aB: -1.0, eB: 0.6, hF: 0.55, kF: -0.3, hB: -0.25, kB: -0.3, sx: 0.84, sy: 1.12, by: -3, mouth: 1 }, ease.out(k)); }
  if (mv > 25) { const s = Math.sin(t), c = Math.cos(t), sp = clamp(mv / 260, 0.4, 1.2);
    if (u.ninjaRun) return { ...base, lean: 0.62, aF: -1.25, eF: 0.25, aB: -1.05, eB: 0.25, hF: 1.05 * s, kF: -0.2 - Math.max(0, -s) * 1.6, hB: -1.05 * s, kB: -0.2 - Math.max(0, s) * 1.6, by: -Math.abs(c) * 6, sy: 1 - 0.06 * Math.abs(s), sx: 1 + 0.05 * Math.abs(s), head: -0.1, rot: 0 };
    return { ...base, lean: 0.18 + 0.2 * sp, aF: -0.95 * s * sp + 0.25, eF: 1.45, aB: 0.95 * s * sp + 0.25, eB: 1.45, hF: 0.9 * s * sp, kF: -0.15 - Math.max(0, -s) * 1.4 * sp, hB: -0.9 * s * sp, kB: -0.15 - Math.max(0, s) * 1.4 * sp, by: -Math.abs(c) * 5 * sp, sy: 1 - 0.05 * Math.abs(s), sx: 1 + 0.04 * Math.abs(s), head: 0 }; }
  const b = Math.sin(t * (comb ? 0.9 : 0.6)); const P = { ...base, sy: 1 + 0.03 * b, sx: 1 - 0.025 * b, by: comb ? Math.max(0, b) * 2 : 0 }; if (comb) { P.aF += b * 0.06; P.kF -= b * 0.08; P.kB -= b * 0.08; } else { P.aF += b * 0.04; P.aB -= b * 0.04; } return P; }
function animPose(u, dt) { const T = poseOf(u); if (!u.P) { u.P = { ...T }; return u.P; } const snap = u.act && (u.act.k === 'm1' || u.act.k === 'dash'); const k = 1 - Math.pow(snap ? 1e-9 : 1e-6, dt || 0.016); for (const key of PK) u.P[key] += (T[key] - u.P[key]) * k; return u.P; }
/* ---------- Dessin ---------- */
function drawRig(g, u, tint) { const L = lookOf(u); const P = u.P || poseOf(u); const s = (u.size || 1) * (L.kid || u.kid ? 0.8 : 1) * 1.28, kid = L.kid || u.kid;
  const sq = u.sq || 0, sx = P.sx * (1 - sq * 0.5), sy = P.sy * (1 + sq);
  g.save(); g.translate(u.x, u.y); if (!tint) { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 0, 17 * s * (1 + Math.min(0.4, -P.by / 60)), 6 * s, 0, 0, TAU); g.fill(); }
  g.scale(u.face * s * sx, s * sy); g.rotate(P.rot || 0); g.translate(0, P.by);
  const ghost = L.ghost || tint; if (L.ghost && !tint) g.globalAlpha *= 0.78; const flash = u.flash > 0 && !Save.set.rf;
  const C = (c) => (tint ? tint : flash ? '#ffffff' : c); const ink = tint ? 'rgba(0,0,0,0)' : INK;
  const limb = (x, y, a1, a2, l1, l2, w, c, end, endC) => { const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1, fx = kx + Math.sin(a1 + a2) * l2, fy = ky + Math.cos(a1 + a2) * l2; g.lineCap = 'round'; g.lineJoin = 'round';
    if (!tint) { g.strokeStyle = ink; g.lineWidth = w + 4; g.beginPath(); g.moveTo(x, y); g.lineTo(kx, ky); g.lineTo(fx, fy); g.stroke(); }
    g.strokeStyle = C(c); g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(kx, ky); g.lineTo(fx, fy); g.stroke();
    if (end === 'fist') { g.fillStyle = C(endC); g.strokeStyle = ink; g.lineWidth = 2.2; g.beginPath(); g.arc(fx, fy, 4.4, 0, TAU); g.fill(); if (!tint) g.stroke(); }
    else if (end === 'foot') { g.fillStyle = C('#20222e'); g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.ellipse(fx + 3, fy, 6, 3.2, a1 + a2 - 0.3, 0, TAU); g.fill(); if (!tint) g.stroke(); }
    return [fx, fy]; };
  const hipY = -31, legW = kid ? 6 : 7.5, armW = kid ? 5 : 6.2;
  limb(-3, hipY, P.hB, P.kB, 15, 15, legW, shade(L.bot), 'foot');
  // cape / écharpe derrière (traînée selon la vitesse)
  const vel = Math.min(1, Math.hypot(u.vx || 0, u.vy || 0) / 400), wav = Math.sin((u.anim || 0) * 1.3);
  g.save(); g.translate(0, hipY); g.rotate(P.lean);
  if (L.cloak) { g.fillStyle = C(L.cloak); g.strokeStyle = ink; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-8, -27); g.quadraticCurveTo(-16 - vel * 16, -6, -14 - vel * 24 + wav * 3, 22 - vel * 10); g.lineTo(-4 - vel * 10, 24 - vel * 6 + wav * 2); g.lineTo(6, 8); g.lineTo(8, -27); g.closePath(); g.fill(); if (!tint) g.stroke(); }
  const shoulder = (back) => [back ? -3 : 3, -24];
  const [sbx, sby] = shoulder(1); limb(sbx, sby, P.aB, P.eB, 12, 11, armW, shade(L.top), 'fist', shade(L.skin));
  // torse (trapèze arrondi) + bassin
  g.fillStyle = C(L.bot); g.strokeStyle = ink; g.lineWidth = 2.6; g.beginPath(); g.moveTo(-8, -4); g.lineTo(8, -4); g.lineTo(9, 4); g.lineTo(-9, 4); g.closePath(); g.fill(); if (!tint) g.stroke();
  const bw = L.belly ? 13 : 10; g.fillStyle = C(L.top); g.beginPath(); g.moveTo(-bw + 1, -29); g.quadraticCurveTo(0, -32, bw - 1, -29); g.lineTo(bw - (L.belly ? 0 : 2), -3); g.quadraticCurveTo(0, 1 + (L.belly ? 4 : 0), -bw + 2, -3); g.closePath(); g.fill(); if (!tint) g.stroke();
  if (!ghost) { g.fillStyle = 'rgba(255,255,255,.14)'; g.beginPath(); g.moveTo(2, -28); g.lineTo(bw - 2, -27); g.lineTo(bw - 3, -6); g.lineTo(4, -5); g.closePath(); g.fill(); }
  if (L.vest && !tint) { g.fillStyle = L.vest; g.beginPath(); g.moveTo(-bw + 1, -28); g.lineTo(bw - 1, -28); g.lineTo(bw - 2, -6); g.lineTo(-bw + 2, -6); g.closePath(); g.fill(); g.stroke(); g.fillStyle = shade(L.vest); g.fillRect(1, -20, 6, 6); g.fillRect(1, -12, 6, 5); }
  if (L.apron && !tint) { g.fillStyle = L.apron; g.fillRect(-6, -18, 13, 24); g.strokeRect(-6, -18, 13, 24); }
  if (L.org && !tint) { g.fillStyle = '#b02030'; g.beginPath(); g.arc(3, -16, 4, 0, TAU); g.fill(); }
  if (L.sword && !tint) { g.strokeStyle = '#11131b'; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, -34); g.lineTo(7, 4); g.stroke(); g.strokeStyle = '#c9a050'; g.lineWidth = 2; g.beginPath(); g.moveTo(-12, -34); g.lineTo(-9, -29); g.stroke(); }
  if (L.marks && !tint) { g.strokeStyle = '#7a6aff'; g.lineWidth = 1.6; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-5 + i * 4, -24); g.lineTo(-1 + i * 4, -9); g.stroke(); } }
  if (L.scarf && !tint) { g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.moveTo(-6, -29); g.quadraticCurveTo(-14 - vel * 18, -27 + wav * 3, -22 - vel * 22, -22 + wav * 5); g.stroke(); g.strokeStyle = L.scarf; g.lineWidth = 4.5; g.stroke(); }
  // tête (grosse, lisible) — légère traînée de rotation
  g.save(); g.translate(1.5, -32); g.rotate(P.head - P.lean * 0.35); drawHead(g, u, L, C, ink, tint, kid, vel, wav, P); g.restore();
  const [sfx, sfy] = shoulder(0); const hf = limb(sfx, sfy, P.aF, P.eF, 12, 11, armW, L.top, 'fist', L.skin); g.restore();
  limb(3, hipY, P.hF, P.kF, 15, 15, legW, L.bot, 'foot');
  g.restore();
  // position monde de la main avant (pour les VFX tenus en main)
  const lx = 3 + Math.sin(P.aF) * 12 + Math.sin(P.aF + P.eF) * 11, ly = -24 + Math.cos(P.aF) * 12 + Math.cos(P.aF + P.eF) * 11; const cl = Math.cos(P.lean), sl = Math.sin(P.lean);
  const rx = lx * cl - ly * sl, ry = lx * sl + ly * cl; u.hand = { x: u.x + u.face * s * sx * (rx + 0), y: u.y + s * sy * (hipY + ry + P.by) };
  if (!tint && u.sign && u.sign.t < 0.55) drawHands(g, u.x, u.y - 100 * s, u.sign.k, u.sign.t); }
function drawHead(g, u, L, C, ink, tint, kid, vel, wav, P) { const R = kid ? 12.5 : 11.5; const hy = -10;
  // cheveux arrière
  const lag = -vel * 6; g.strokeStyle = ink; g.lineWidth = 2.4; g.fillStyle = C(L.hair);
  if (L.hs === 'long') { g.beginPath(); g.moveTo(-10, hy - 6); g.quadraticCurveTo(-15 + lag, hy + 10, -11 + lag * 1.5 + wav * 2, hy + 24); g.lineTo(-2 + lag, hy + 20); g.lineTo(2, hy); g.closePath(); g.fill(); if (!tint) g.stroke(); }
  if (L.hs === 'pony') { g.beginPath(); g.moveTo(-9, hy - 10); g.quadraticCurveTo(-22 + lag, hy - 8 + wav * 2, -18 + lag * 2, hy + 18); g.quadraticCurveTo(-12 + lag, hy + 4, -6, hy - 4); g.closePath(); g.fill(); if (!tint) g.stroke(); }
  if (L.hs === 'buns') for (const bx of [-9, 6]) { g.beginPath(); g.arc(bx, hy - 12, 5.5, 0, TAU); g.fill(); if (!tint) g.stroke(); }
  if (L.hs === 'pineapple') { g.beginPath(); g.moveTo(-6, hy - 9); for (let i = 0; i < 5; i++) { g.lineTo(-12 + i * 3 + lag, hy - 22 - (i % 2) * 5); g.lineTo(-9 + i * 3, hy - 13); } g.closePath(); g.fill(); if (!tint) g.stroke(); }
  // visage
  g.fillStyle = C(L.skin); g.strokeStyle = ink; g.lineWidth = 2.6; g.beginPath(); g.ellipse(0, hy, R, R * 1.02, 0, 0, TAU); g.fill(); if (!tint) g.stroke();
  if (!tint) { // yeux (grands, orientés vers l'avant), bouche expressive
    const blink = Math.sin((u.anim || 0) * 0.37 + (u.x || 0)) > 0.985; const ey = hy - 1;
    for (const [ex, sc] of [[6.5, 1], [0.5, 0.75]]) { if (blink) { g.strokeStyle = INK; g.lineWidth = 1.6; g.beginPath(); g.moveTo(ex - 2.2 * sc, ey); g.lineTo(ex + 2.2 * sc, ey); g.stroke(); continue; }
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, ey, 2.5 * sc, 3.3 * sc, 0, 0, TAU); g.fill(); g.fillStyle = u.eyeFx || L.eye || '#222'; g.beginPath(); g.ellipse(ex + 0.7, ey + 0.3, 1.6 * sc, 2.4 * sc, 0, 0, TAU); g.fill();
      if (u.eyeFx === '#d0283a') { g.fillStyle = '#111'; g.beginPath(); g.arc(ex + 0.7, ey + 0.3, 0.7, 0, TAU); g.fill(); } }
    g.strokeStyle = INK; g.lineWidth = 1.8; g.beginPath(); g.moveTo(3, ey - 5); g.lineTo(8.5, ey - 5.6 + (u.combat ? 1.4 : 0)); g.stroke(); // sourcil
    if (P.mouth > 0.5) { g.fillStyle = '#5a1a20'; g.beginPath(); g.ellipse(6, hy + 6, 2.4, 2.2 * P.mouth, 0, 0, TAU); g.fill(); } else { g.beginPath(); g.moveTo(4, hy + 6); g.lineTo(8, hy + 5.6); g.stroke(); }
    if (L.scar) { g.strokeStyle = '#b25a4a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(6.5, ey - 7); g.lineTo(7.2, ey + 6); g.stroke(); }
    if (L.glasses) { g.strokeStyle = '#d04050'; g.lineWidth = 1.5; g.strokeRect(3.5, ey - 3, 6.5, 5.5); }
    if (L.marks) { g.strokeStyle = '#7a6aff'; g.lineWidth = 1.3; g.beginPath(); g.moveTo(-2, ey + 3); g.lineTo(3, ey + 8); g.stroke(); }
    if (u.karma > 0 || (L.karma && u.isHero && Game.ultA > 0)) { const k = clamp(u.karma || Game.ultA || 0, 0, 1); g.strokeStyle = `rgba(20,20,30,${0.9 * k})`; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-3, ey - 6); g.lineTo(-8 + -3 * k, ey - 2); g.lineTo(-4, ey + 4 * k); g.moveTo(-2, ey + 2); g.lineTo(-7, ey + 8 * k); g.stroke(); g.fillStyle = `rgba(80,180,255,${0.5 * k})`; g.beginPath(); g.arc(-6, ey - 2, 2 * k, 0, TAU); g.fill(); }
    if (L.mask) { g.fillStyle = '#2a2c36'; g.beginPath(); g.moveTo(-R + 1, hy + 1); g.lineTo(R, hy + 1); g.quadraticCurveTo(R - 2, hy + R, 0, hy + R); g.quadraticCurveTo(-R + 2, hy + R - 1, -R + 1, hy + 1); g.fill(); g.strokeStyle = INK; g.stroke(); } }
  // cheveux avant
  g.fillStyle = C(L.hair); g.strokeStyle = ink; g.lineWidth = 2.4; g.beginPath();
  if (L.hs === 'spiky') { g.moveTo(-12, hy + 2); const n = 7; for (let i = 0; i <= n; i++) { const a = Math.PI + 0.15 + (i / n) * (Math.PI - 0.1); const len = 18 + (i % 2) * 3; g.lineTo(Math.cos(a) * len - 2 + lag * (1 - i / n), hy - 2 + Math.sin(a) * len * 0.92); g.lineTo(Math.cos(a + 0.22) * 10.5, hy - 2 + Math.sin(a + 0.22) * 10.5); } g.lineTo(12, hy - 1); g.lineTo(9, hy - 4); g.lineTo(6, hy - 2); g.lineTo(4, hy - 6); g.closePath(); }
  else if (L.hs === 'messy') { g.moveTo(-12, hy + 3); for (let i = 0; i < 6; i++) { const a = Math.PI + 0.1 + (i / 5) * (Math.PI - 0.2); g.lineTo(Math.cos(a) * 16 + lag, hy - 1 + Math.sin(a) * 14); g.lineTo(Math.cos(a + 0.3) * 10, hy - 2 + Math.sin(a + 0.3) * 10); } g.lineTo(11, hy + 2); g.lineTo(8, hy - 4); g.closePath(); }
  else if (L.hs === 'slick') { g.moveTo(9, hy - 6); g.quadraticCurveTo(4, hy - 16, -6, hy - 13); g.lineTo(-18 + lag, hy - 11); g.lineTo(-11, hy - 6); g.lineTo(-17 + lag, hy - 2); g.lineTo(-11, hy); g.lineTo(-12, hy + 3); g.quadraticCurveTo(-13, hy - 10, 0, hy - 12.5); g.closePath(); }
  else if (L.hs === 'bob') { g.moveTo(10, hy - 2); g.quadraticCurveTo(10, hy - 15, -1, hy - 13.5); g.quadraticCurveTo(-14, hy - 12, -13, hy + 6); g.lineTo(-6, hy + 7); g.lineTo(-7, hy - 3); g.lineTo(3, hy - 7); g.closePath(); }
  else if (L.hs === 'buzz') { g.moveTo(11, hy - 4); g.quadraticCurveTo(4, hy - 14, -6, hy - 12); g.quadraticCurveTo(-12, hy - 9, -12, hy - 1); g.lineTo(-9, hy - 4); g.quadraticCurveTo(0, hy - 10, 11, hy - 4); }
  else if (L.hs === 'bald') { g.moveTo(-12, hy - 2); g.lineTo(-9, hy - 6); g.lineTo(-7, hy); g.closePath(); }
  else { g.moveTo(11, hy - 3); g.quadraticCurveTo(8, hy - 15, -2, hy - 13.5); g.quadraticCurveTo(-13, hy - 12, -12.5, hy + 2); g.lineTo(-7, hy - 1); g.lineTo(0, hy - 8); g.lineTo(5, hy - 5); g.closePath(); }
  g.fill(); if (!tint) g.stroke();
  if (L.band && !tint) { g.fillStyle = L.band === 2 ? '#555' : '#2a3a6a'; g.beginPath(); g.moveTo(-11, hy - 7); g.lineTo(11, hy - 6); g.lineTo(11, hy - 2.5); g.lineTo(-11, hy - 3.5); g.closePath(); g.fill(); g.fillStyle = '#b8c4d8'; g.fillRect(2.5, hy - 7, 7, 4); g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(2.5, hy - 7, 7, 4); if (L.band === 2) { g.beginPath(); g.moveTo(3, hy - 5); g.lineTo(9, hy - 5); g.stroke(); } }
  if (u.hood && !tint) { g.fillStyle = L.cloak || '#30364f'; g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.arc(-1, hy - 1, R + 2.5, Math.PI * 0.82, Math.PI * 2.08); g.lineTo(-13, hy + 12); g.closePath(); g.fill(); g.stroke(); } }
function shade(c) { return String(c).replace(/^#(..)(..)(..)$/, (m, r, gg, b) => '#' + [r, gg, b].map((h) => Math.round(parseInt(h, 16) * 0.72).toString(16).padStart(2, '0')).join('')); }
/* ---------- Bêtes à queues : vraies créatures (queues qui ondulent, mâchoire, rugissement) ---------- */
const BIJUU = {
  kurama: { n: 'Kurama', tails: 9, body: '#f07a1e', belly: '#ffc070', mark: '#7a1e08', eye: '#ffe14a', pupil: '#c01010', ears: 'fox', snout: 1.15 },
  matatabi: { n: 'Matatabi', tails: 2, body: '#3a6aff', belly: '#9fd0ff', mark: '#1a2a6a', eye: '#ffe14a', pupil: '#111', ears: 'fox', snout: 0.9 },
  songoku: { n: 'Son Gokū', tails: 4, body: '#c0362a', belly: '#e8a080', mark: '#5a1a10', eye: '#fff', pupil: '#111', ears: 'round', snout: 1.0 },
  gyuki: { n: 'Gyūki', horns: 1, tails: 8, body: '#7a4a9a', belly: '#c8a0d8', mark: '#2a1a3a', eye: '#fff', pupil: '#111', ears: 'round', snout: 1.05 },
  shukaku: { n: 'Shukaku', tails: 1, body: '#cfae70', belly: '#e8d29e', mark: '#2f3f8f', eye: '#ffe14a', pupil: '#111', ears: 'round', snout: 0.85 },
};
function beastMouth(u) { const s = u.size || 1, D = BIJUU[u.bj]; const jx = 104 * (D.snout || 1), hy = -112 + (u.rear || 0) * -20; return { x: u.x + u.face * s * jx, y: u.y + s * hy }; }
function drawBijuu(g, u) { const D = BIJUU[u.bj], s = u.size || 1, t = u.anim || 0, roar = u.roar || 0, jaw = Math.max(roar, u.jaw || 0), rear = u.rear || 0, walk = Math.min(1, Math.hypot(u.vx, u.vy) / 120);
  g.save(); g.translate(u.x, u.y); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(0, 0, 120 * s, 26 * s, 0, 0, TAU); g.fill();
  const sq = u.sq || 0, br = Math.sin(t * 1.1) * 0.02; g.scale(u.face * s * (1 - sq * 0.3 - br), s * (1 + sq * 0.5 + br)); g.lineJoin = 'round'; g.lineCap = 'round';
  const C = (c) => (u.flash > 0 && !Save.set.rf ? '#fff' : c);
  // queues (derrière le corps) : chaînes de segments, chaque queue avec sa phase
  const n = D.tails; for (let i = 0; i < n; i++) { const spread = n === 1 ? 0 : (i / (n - 1) - 0.5); let a = -Math.PI * 0.5 - 0.95 - spread * 1.9, x = -62, y = -86; const seg = n === 1 ? 16 : 13, len = n === 1 ? 11 : 12.5; const pts = [[x, y]];
    for (let j = 0; j < seg; j++) { a += Math.sin(t * 1.7 + i * 0.8 + j * 0.42) * 0.11 + (n === 1 ? 0.07 : 0.03) + roar * 0.02; x += Math.cos(a) * len; y += Math.sin(a) * len; pts.push([x, y]); }
    const w0 = n === 1 ? 34 : 20; for (const pass of [0, 1]) for (let j = 0; j < seg; j++) { const w = lerp(w0, 5, j / seg); g.strokeStyle = pass ? C(j > seg * 0.75 ? D.belly : D.body) : INK; g.lineWidth = pass ? w : w + 5; g.beginPath(); g.moveTo(pts[j][0], pts[j][1]); g.lineTo(pts[j + 1][0], pts[j + 1][1]); g.stroke(); }
    if (n === 1) { g.strokeStyle = D.mark; g.lineWidth = 3; for (let j = 3; j < seg - 2; j += 3) { g.beginPath(); g.arc(pts[j][0], pts[j][1], lerp(w0, 5, j / seg) * 0.35, 0, TAU); g.stroke(); } } }
  g.save(); g.rotate(-rear * 0.35);
  // pattes (arrière puis avant), cycle de marche
  const leg = (x, ph, back) => { const s1 = Math.sin(t * 2.4 + ph) * 0.5 * walk; const hip = [x, -64], kn = [x + Math.sin(s1) * 26, -36], ft = [x + Math.sin(s1) * 30 + (back ? -4 : 6), -2 - Math.max(0, Math.cos(t * 2.4 + ph)) * 8 * walk];
    g.strokeStyle = INK; g.lineWidth = 26; g.beginPath(); g.moveTo(...hip); g.lineTo(...kn); g.lineTo(...ft); g.stroke(); g.strokeStyle = C(back ? shade(D.body) : D.body); g.lineWidth = 21; g.stroke();
    g.fillStyle = C(D.mark); g.beginPath(); g.ellipse(ft[0] + 6, ft[1], 14, 7, 0, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); };
  leg(-46, Math.PI, 1); leg(40, 0, 1);
  // corps
  g.fillStyle = C(D.body); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.ellipse(-4, -76, 74, 40, -0.08, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = C(D.belly); g.beginPath(); g.ellipse(14, -58, 46, 18, -0.1, 0, Math.PI); g.fill();
  g.strokeStyle = D.mark; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-40 + i * 22, -108); g.quadraticCurveTo(-34 + i * 22, -92, -44 + i * 22, -80); g.stroke(); }
  leg(-30, Math.PI * 0.5, 0); leg(56, Math.PI * 1.5, 0);
  // cou + tête
  const hx = 76 + rear * 6, hy = -112 - rear * 20 + Math.sin(t * 1.1) * 2 - roar * 6; const hr = -0.15 * roar - rear * 0.2;
  g.fillStyle = C(D.body); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(34, -100); g.quadraticCurveTo(58, -128, hx, hy - 12); g.lineTo(hx + 8, hy + 22); g.quadraticCurveTo(52, -66, 38, -60); g.closePath(); g.fill(); g.stroke();
  if (u.swallow > 0) { g.fillStyle = C(D.belly); g.beginPath(); g.arc(lerp(hx, 30, u.swallow), lerp(hy + 8, -90, u.swallow), 14 * (1 - u.swallow * 0.4), 0, TAU); g.fill(); g.stroke(); }
  g.save(); g.translate(hx, hy); g.rotate(hr); const sn = D.snout || 1;
  if (D.horns) for (const sx of [-1, 1]) { g.fillStyle = '#efe6d0'; g.beginPath(); g.moveTo(-4 + sx * 8, -20); g.quadraticCurveTo(-4 + sx * 34, -34, -4 + sx * 30, -62 + Math.sin(t * 2) * 2); g.quadraticCurveTo(-4 + sx * 22, -36, -4 + sx * 2, -16); g.closePath(); g.fill(); g.stroke(); }
  if (D.ears === 'fox') for (const [ex, ey, w] of [[-14, -18, 1], [4, -22, 0.9]]) { g.fillStyle = C(D.body); g.beginPath(); g.moveTo(ex - 10, ey + 6); g.lineTo(ex - 6 + Math.sin(t * 2 + ex) * 2, ey - 34 * w); g.lineTo(ex + 10, ey + 4); g.closePath(); g.fill(); g.stroke(); g.fillStyle = D.mark; g.beginPath(); g.moveTo(ex - 5, ey + 2); g.lineTo(ex - 5, ey - 22 * w); g.lineTo(ex + 4, ey + 2); g.fill(); }
  else for (const ex of [-14, 6]) { g.fillStyle = C(D.body); g.beginPath(); g.arc(ex, -20, 11, 0, TAU); g.fill(); g.stroke(); }
  // crâne
  g.fillStyle = C(D.body); g.beginPath(); g.ellipse(0, 0, 32, 26, 0, 0, TAU); g.fill(); g.stroke();
  // mâchoire inférieure (s'ouvre pour rugir / charger la Bijūdama)
  g.save(); g.translate(14, 10); g.rotate(jaw * 0.65); g.fillStyle = C(D.belly); g.beginPath(); g.moveTo(-6, 0); g.lineTo(34 * sn, 4); g.quadraticCurveTo(30 * sn, 16, 0, 16); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(6 + i * 7 * sn, 3); g.lineTo(9 + i * 7 * sn, -4); g.lineTo(12 + i * 7 * sn, 3); g.fill(); } g.restore();
  if (jaw > 0.1) { g.fillStyle = '#3a0a10'; g.beginPath(); g.moveTo(10, 8); g.lineTo(40 * sn, 6); g.lineTo(36 * sn, 8 + jaw * 20); g.closePath(); g.fill(); }
  // museau supérieur
  g.fillStyle = C(D.body); g.beginPath(); g.moveTo(10, -10); g.quadraticCurveTo(44 * sn, -10, 48 * sn, 4); g.lineTo(12, 10); g.closePath(); g.fill(); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(46 * sn, 1, 3.5, 0, TAU); g.fill();
  g.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(18 + i * 7 * sn, 8); g.lineTo(21 + i * 7 * sn, 15); g.lineTo(24 + i * 7 * sn, 8); g.fill(); }
  // yeux + marques
  g.fillStyle = D.mark; g.beginPath(); g.moveTo(-6, -14); g.quadraticCurveTo(14, -16, 24, -6); g.quadraticCurveTo(10, -2, -4, -4); g.fill();
  g.fillStyle = C(D.eye); g.beginPath(); g.ellipse(10, -8, 8, 5, -0.15, 0, TAU); g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); g.fillStyle = D.pupil; g.beginPath(); if (D.ears === 'fox') g.ellipse(12, -8, 1.8, 4.6, 0, 0, TAU); else { for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, r = k % 2 ? 1.5 : 4; g.lineTo(12 + Math.cos(a) * r, -8 + Math.sin(a) * r); } } g.fill();
  g.restore(); g.restore(); g.restore(); }
function drawBeast(g, u) { if (u.kind === 'bijuu') return drawBijuu(g, u); g.save(); g.translate(u.x, u.y); g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 0, 24 * (u.size || 1), 7, 0, 0, TAU); g.fill();
  const sq = u.sq || 0, t = u.anim || 0, wind = u.act && u.act.k === 'wind' ? u.act.t / u.act.dur : 0; const dying = u.hp <= 0 ? clamp((u.deadT || 0) / 0.4, 0, 1) : 0;
  g.scale(u.face * (u.size || 1) * (1 - sq * 0.4 + wind * 0.15 + dying * 0.5), (u.size || 1) * (1 + sq - wind * 0.12 - dying * 0.6)); const C = (c) => (u.flash > 0 && !Save.set.rf ? '#fff' : c);
  if (u.kind === 'grime') { const lunge = u.act && u.act.k === 'rec' ? 1 - u.act.t / u.act.dur : 0; g.fillStyle = C('#14121c'); g.strokeStyle = '#000'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-26, -6); g.quadraticCurveTo(-30 - wind * 8, -40 - wind * 12, 0 + lunge * 8, -46 - Math.sin(t) * 4); g.quadraticCurveTo(32 + lunge * 10, -40, 26, -6); g.quadraticCurveTo(0, 4, -26, -6); g.fill(); g.stroke();
    for (let i = 0; i < 4; i++) { g.strokeStyle = '#14121c'; g.lineWidth = 6; g.beginPath(); g.moveTo(-14 + i * 9, -8); g.quadraticCurveTo(-20 + i * 11 + Math.sin(t * 1.5 + i) * 7, -2, -16 + i * 10 + Math.sin(t * 1.5 + i) * 9, 3); g.stroke(); }
    g.strokeStyle = '#d8d8ff'; g.lineWidth = 2.4; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-8 + i * 7, -38); g.lineTo(-2 + i * 7, -16); g.stroke(); }
    g.fillStyle = wind ? '#ff5a5a' : '#ffe680'; g.beginPath(); g.ellipse(14, -31, 4 + wind * 2, 3.5, 0, 0, TAU); g.fill();
    // griffe qui se lève (anticipation) puis fauche
    g.save(); g.translate(20, -24); g.rotate(-1.4 * wind + lunge * 1.6); g.strokeStyle = '#000'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, 0); g.lineTo(22, -6); g.stroke(); g.strokeStyle = '#e8e8ff'; g.lineWidth = 2.5; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(20, -6); g.lineTo(32, -14 + k * 6); g.stroke(); } g.restore(); }
  else if (u.kind === 'sprout') { g.fillStyle = C('#5a3f5e'); g.strokeStyle = '#1a0f1c'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(-20 - wind * 8, -40, -6, -62 + Math.sin(t) * 3 - wind * 8); g.quadraticCurveTo(10, -72, 14, -50); g.quadraticCurveTo(22, -20, 14, 0); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = '#5a3f5e'; g.lineWidth = 6; for (const s2 of [-1, 1]) { g.beginPath(); g.moveTo(s2 * 10, -40); g.quadraticCurveTo(s2 * 30, -50 + Math.sin(t + s2) * 8, s2 * (34 + wind * 16), -26 - wind * 10); g.stroke(); }
    g.fillStyle = '#e0a0ff'; g.beginPath(); g.arc(6, -52, 4 + wind * 2, 0, TAU); g.fill(); g.fillStyle = '#b07ab8'; g.beginPath(); g.arc(-4, -30, 6, 0, TAU); g.fill(); }
  else if (u.kind === 'dummy') { const w = Math.sin((u.wob || 0) * 18) * (u.wob || 0) * 0.6; g.rotate(w); g.fillStyle = C('#a07a46'); g.strokeStyle = '#3b2a1e'; g.lineWidth = 2.5; g.fillRect(-4, -60, 8, 60); g.strokeRect(-4, -60, 8, 60); g.beginPath(); g.ellipse(0, -48, 15, 18, 0, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -72, 10, 0, TAU); g.fill(); g.stroke(); g.strokeStyle = '#3b2a1e'; g.beginPath(); g.moveTo(-14, -50); g.lineTo(14, -50); g.stroke(); }
  g.restore(); }
/* ---------- Création ---------- */
function makeUnit(o) { return Object.assign({ x: 0, y: 0, vx: 0, vy: 0, r: 14, face: 1, hp: 100, maxHp: 100, team: 1, aura: {}, st: {}, cd: {}, anim: Math.random() * 6, sq: 0, armor: 0, hurtT: 0, flash: 0 }, o); }
const FOE = {
  grime: { n: 'Claw Grime', hp: 60, dmg: 8, sp: 200, kind: 'grime', range: 52, xp: 14, aggro: 380 },
  sprout: { n: 'Rejeton du Shinju', hp: 90, dmg: 10, sp: 120, kind: 'sprout', range: 70, el: 'earth', xp: 22, aggro: 300 },
  deserter: { n: 'Déserteur', hp: 85, dmg: 9, sp: 170, look: 'deserter', range: 360, el: 'fire', ranged: 1, xp: 24, aggro: 420 },
  stormer: { n: 'Ninja errant', hp: 100, dmg: 10, sp: 180, look: 'deserter', range: 330, el: 'bolt', ranged: 1, xp: 28, aggro: 420 },
  bandit: { n: 'Bandit', hp: 55, dmg: 7, sp: 175, look: 'deserter', range: 56, xp: 12, aggro: 360 },
  kuro: { n: 'Kurogane', hp: 130, dmg: 12, sp: 210, look: 'kuro', range: 300, el: 'bolt', ranged: 1, xp: 40, aggro: 480 },
  code: { n: 'Code', hp: 560, dmg: 14, sp: 320, look: 'code', range: 70, xp: 200, aggro: 900, boss: 1, size: 1.15 },
  kawaki: { n: 'Kawaki', hp: 900, dmg: 15, sp: 300, look: 'kawaki', range: 76, xp: 300, aggro: 900, boss: 1, size: 1.12 },
  jura: { n: 'Jura', hp: 1100, dmg: 14, sp: 240, look: 'jura', range: 76, el: 'earth', xp: 320, aggro: 900, boss: 1, size: 1.15, spikes: 1 },
  rogue: { n: 'Déserteur de rang B', hp: 420, dmg: 13, sp: 260, look: 'deserter', range: 70, el: 'fire', xp: 150, aggro: 700, boss: 1, size: 1.1 },
  rival: { n: 'Rival', hp: 380, dmg: 11, sp: 280, range: 70, xp: 120, aggro: 900, boss: 1 },
  leader: { n: 'Shiki de Kurogane', hp: 1400, dmg: 16, sp: 300, look: 'kuro', range: 80, el: 'yin', xp: 500, aggro: 1000, boss: 1, size: 1.2 },
  sensei: { n: 'Sensei', hp: 1e9, dmg: 4, sp: 300, range: 60, xp: 0, aggro: 900, boss: 1 },
  bijuu: { n: 'Bête à queues', hp: 2600, dmg: 18, sp: 90, kind: 'bijuu', range: 190, xp: 900, aggro: 1400, boss: 1, size: 1 },
  dummy: { n: 'Mannequin', hp: 1e9, dmg: 0, sp: 0, kind: 'dummy', range: 0, xp: 0, aggro: 0 },
};
function spawnFoe(type, x, y, extra) { const F = FOE[type]; const k = [0.7, 1, 1.25][Save.set.diff]; const u = makeUnit(Object.assign({ type, n: F.n, x, y, hx: x, hy: y, hp: F.hp * k, maxHp: F.hp * k, look: F.look, kind: F.kind, sp: F.sp, size: F.size || 1, seenHp: 0 }, extra || {}));
  if (extra && extra.hpMul) u.hp *= extra.hpMul; u.maxHp = u.hp; if (u.kind === 'bijuu') { u.r = 90; u.size = extra && extra.size || 1.5; } World.foes_.push(u); return u; }
/* ---------- Dégâts ---------- */
function hurt(t, dmg, src, o = {}) { if (!t || t.hp <= 0 || t.gone) return 0; if (t.isHero && (t.iframe > 0 || Game.cine)) return 0; if (t.isHero) dmg *= 1.2; if (t.isAlly && t.down) return 0;
  let r = { dmg, rx: null }; if (o.el && !t.isHero && !t.isAlly) r = applyEl(src, t, o.el, dmg); let d = r.dmg * (t.armor ? 0.6 : 1); if (t.isHero) d *= [0.5, 1, 1.35][Save.set.diff]; if (t.guard) d *= 0.35;
  if (t.type === 'dummy') { t.hp = t.maxHp; t.wob = 1; } else if (t.type === 'sensei') { t.hp = t.maxHp; if (t.onTag) t.onTag(); } else t.hp -= d;
  t.hurtT = t.kind === 'bijuu' ? 0.08 : 0.2; t.flash = 0.09; t.sq = t.kind === 'bijuu' ? -0.06 : -0.28; t.seenHp = 4;
  if (o.k !== 0 && src && t.type !== 'dummy' && t.kind !== 'bijuu') { const a = Math.atan2(t.y - src.y, t.x - src.x); const kb = (o.k || 1) * (t.boss ? 110 : 260); t.vx += Math.cos(a) * kb; t.vy += Math.sin(a) * kb; }
  const crit = o.big || r.rx; FX.hitSpark(t.x, t.y - (t.kind === 'bijuu' ? 90 : 36), o.el ? elc(o.el) : t.isHero ? '#ff6b5e' : '#ffd166', crit, src);
  if (!(t.isAlly && d < 1)) FX.dmg(t.x, t.y - (t.kind === 'bijuu' ? 150 : 72) * 1, Math.round(d), t.isHero ? 'hero' : r.rx ? 'rx' : crit ? 'crit' : 'n', r.rx ? elc(o.el) : null);
  if (!t.isHero && src && (src.isHero || src.isClone || src.isAlly)) { Game.combo = (Game.t - (Game.comboT || -9) < 1.4 ? (Game.combo || 0) + 1 : 1); Game.comboT = Game.t; if (src.isHero) Game.ultGain(d); }
  Sfx.hit(o.big ? 2 : t.isHero ? -1 : 1, Game.combo || 0); if (t.isHero) { Cam.shake(0.25); Game.lastHurt = Game.t; }
  if (Story.onHit) Story.onHit(t, src); if (t.isHero) t.hpPop = 1; if (t.hp <= 0) die(t, src); return d; }
function die(t, src) { if (t.isHero) return Game.heroDown(); if (t.isAlly) { t.hp = 1; t.down = true; t.downT0 = 0; t.reviveT = 7; FX.smoke(t.x, t.y - 10, 6); return; } if (t.isClone) { t.gone = true; FX.smoke(t.x, t.y - 20, 10); return; } t.deadT = 0; FX.burst(t.x, t.y - 30, '#ffd166', 22); FX.smoke(t.x, t.y - 10, 8); FX.ring(t.x, t.y, '#ffd166', 10, 80, 0.4);
  if (t.boss) { Game.impact(t.x, t.y, 0.18); } const xp = (FOE[t.type] || { xp: 10 }).xp * 5; Game.gainXp(xp); Story.onKill(t); }
