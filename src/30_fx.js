/* ============ Caméra et effets (particules en pool, plafonnées) ============ */
const Cam = { x: 0, y: 0, z: 1, tz: 1, sh: 0, kx: 0, ky: 0,
  follow(t, dt) { this.x = lerp(this.x, t.x + (t.vx || 0) * 0.15, 1 - Math.pow(0.001, dt)); this.y = lerp(this.y, t.y - 30 + (t.vy || 0) * 0.12, 1 - Math.pow(0.001, dt)); this.z = lerp(this.z, this.tz, 1 - Math.pow(0.02, dt));
    this.sh = Math.max(0, this.sh - dt * 2.5); const s = this.sh * this.sh * 14 * Save.set.shake; this.kx = rnd(-s, s); this.ky = rnd(-s, s); },
  shake(v) { this.sh = Math.min(1, this.sh + v); },
};
const FX = {
  P: [], pool: [], T: [], cap() { return Save.set.low ? 260 : 1400; },
  add(o) { if (this.P.length >= this.cap()) return; const p = this.pool.pop() || {}; for (const k in p) delete p[k]; Object.assign(p, o); p.t = 0; this.P.push(p); },
  burst(x, y, c, n = 12, sp = 320) { n = Save.set.low ? Math.ceil(n / 3) : n; for (let i = 0; i < n; i++) { const a = rnd(0, TAU), s = rnd(sp * 0.3, sp); this.add({ k: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.7 - 60, c, s: rnd(2, 4.5), life: rnd(0.25, 0.55), g: 500 }); } },
  ring(x, y, c, r0, r1, life = 0.4) { this.add({ k: 'ring', x, y, c, r0, r1, life }); },
  smear(u, a0, a1, r, c, big) { this.add({ k: 'smear', u, a0, a1, r, c, big, life: big ? 0.2 : 0.14 }); },
  text(x, y, s, c = '#fff', size = 18, big) { this.T.push({ x, y, s, c, size, big, pop: big ? 1 : 0, t: 0, life: big ? 1.2 : 0.8, vy: -60 }); },
  bolt(x1, y1, x2, y2, c) { this.add({ k: 'bolt', x: x1, y: y1, x2, y2, c, life: 0.18, seed: Math.random() }); },
  smoke(x, y, n) { for (let i = 0; i < (Save.set.low ? 4 : n); i++) this.add({ k: 'smoke', x: x + rnd(-30, 30), y: y + rnd(-20, 10), vx: rnd(-30, 30), vy: rnd(-40, -10), c: '#c9d3e6', s: rnd(14, 26), life: rnd(0.6, 1.1), g: 0 }); },
  puddle(x, y, c, life) { this.add({ k: 'puddle', x, y, c, life, s: 50 }); },
  dust(x, y, n = 6) { for (let i = 0; i < (Save.set.low ? 2 : n); i++) this.add({ k: 'smoke', x: x + rnd(-14, 14), y, vx: rnd(-80, 80), vy: rnd(-30, 0), c: '#9a8f80', s: rnd(5, 10), life: rnd(0.3, 0.5), g: 0 }); },
  // --- v0.2 ---
  custom(o) { this.add(Object.assign({ k: 'fn' }, o)); },
  glow(x, y, c, r, life = 0.3, o = {}) { this.add(Object.assign({ k: 'glow', x, y, c, s: r, life }, o)); },
  mote(x, y, tx, ty, c, life) { this.add({ k: 'mote', x, y, x0: x, y0: y, tx, ty, c, life, s: rnd(2, 4.5), sw: rnd(-1, 1) }); },
  ghost(u, c) { if (!u.P) return; this.add({ k: 'ghost', snap: { x: u.x, y: u.y, face: u.face, P: { ...u.P }, look: u.look, size: u.size, kid: u.kid, sq: u.sq }, c, life: 0.22 }); },
  shock(x, y, c, r1, life = 0.5, w = 10) { this.add({ k: 'shock', x, y, c, r1, life, w }); },
  hitSpark(x, y, c, big, src) { const a0 = src ? Math.atan2(y - src.y + 34, x - src.x) : 0; this.add({ k: 'star', x, y, c, s: big ? 30 : 18, life: big ? 0.16 : 0.11, a: rnd(0, 1) });
    const n = Save.set.low ? 3 : big ? 12 : 6; for (let i = 0; i < n; i++) { const a = a0 + rnd(-0.9, 0.9), sp = rnd(250, big ? 700 : 480); this.add({ k: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, c, s: rnd(2, big ? 5 : 3.5), life: rnd(0.14, 0.32), g: 300 }); }
    if (big) this.ring(x, y + 30, c, 6, 60, 0.25); },
  dmg(x, y, v, kind, col) { // chiffres façon « pop » : gonflent puis rebondissent, s'empilent sans se chevaucher
    let oy = 0; for (const t of this.T) if (t.dmgN && Math.abs(t.x - x) < 40 && t.t < 0.35) oy -= 18; const c = kind === 'hero' ? '#ff6b5e' : kind === 'rx' ? col : kind === 'crit' ? '#ffd166' : '#ffffff';
    this.T.push({ x: x + rnd(-8, 8), y: y + oy, s: String(v), c, size: kind === 'crit' || kind === 'rx' ? 26 : kind === 'hero' ? 18 : 19, big: kind !== 'n', t: 0, life: 0.85, vy: -70, dmgN: 1, pop: 1 }); },
  update(dt) { for (let i = this.P.length - 1; i >= 0; i--) { const p = this.P[i]; p.t += dt; if (p.upd && p.t < p.life) p.upd(p, dt); if (p.t >= p.life) { this.P[i] = this.P[this.P.length - 1]; this.P.pop(); this.pool.push(p); continue; } if (p.vx != null) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.g) p.vy += p.g * dt; p.vx *= 0.96; } }
    for (let i = this.T.length - 1; i >= 0; i--) { const t = this.T[i]; t.t += dt; t.y += t.vy * dt; t.vy *= 0.92; if (t.t > t.life) this.T.splice(i, 1); } },
  draw(g, layer) { for (const p of this.P) { const q = p.t / p.life, al = 1 - q;
      const gl = p.k === 'puddle' || p.ground; if (layer === 0 && !gl) continue; if (layer === 1 && gl) continue;
      if (p.k === 'puddle') { g.globalAlpha = 0.45 * al; g.fillStyle = p.c; g.beginPath(); g.ellipse(p.x, p.y, p.s, p.s * 0.4, 0, 0, TAU); g.fill(); }
      else if (p.k === 'spark') { g.globalAlpha = al; g.strokeStyle = p.c; g.lineWidth = p.s; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); g.stroke(); }
      else if (p.k === 'smoke') { g.globalAlpha = 0.35 * al; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.s * (1 + q), 0, TAU); g.fill(); }
      else if (p.k === 'ring') { const r = lerp(p.r0, p.r1, ease.out(q)); g.globalAlpha = al; g.strokeStyle = p.c; g.lineWidth = 5 * al + 1; g.beginPath(); g.ellipse(p.x, p.y, r, r * 0.55, 0, 0, TAU); g.stroke(); }
      else if (p.k === 'bolt') { g.globalAlpha = al; g.strokeStyle = p.c; g.lineWidth = 3; g.beginPath(); g.moveTo(p.x, p.y); for (let i = 1; i < 7; i++) { const t = i / 7; g.lineTo(lerp(p.x, p.x2, t) + rnd(-12, 12), lerp(p.y, p.y2, t) + rnd(-12, 12)); } g.lineTo(p.x2, p.y2); g.stroke(); }
      else if (p.k === 'fn') { p.draw(g, p, q); }
      else if (p.k === 'glow') { g.globalCompositeOperation = 'lighter'; const r = p.s * (p.grow ? 1 + q * p.grow : 1); const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r); gr.addColorStop(0, p.c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = (p.a ?? 0.8) * al; g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, r, 0, TAU); g.fill(); g.globalCompositeOperation = 'source-over'; }
      else if (p.k === 'mote') { const e = ease.inout(q); const px = lerp(p.x0, p.tx, e) + Math.sin(q * 9 + p.sw * 5) * 22 * (1 - q) * p.sw, py = lerp(p.y0, p.ty, e) + Math.cos(q * 9) * 14 * (1 - q); g.globalAlpha = Math.min(1, q * 4) * 0.95; g.fillStyle = p.c; g.beginPath(); g.arc(px, py, p.s * (1 - q * 0.5), 0, TAU); g.fill(); }
      else if (p.k === 'ghost') { g.globalAlpha = 0.45 * al; drawRig(g, p.snap, p.c); }
      else if (p.k === 'shock') { const r = p.r1 * ease.out(q); g.globalAlpha = al; g.strokeStyle = p.c; g.lineWidth = p.w * al + 1; g.beginPath(); g.ellipse(p.x, p.y, r, r * 0.5, 0, 0, TAU); g.stroke(); g.globalAlpha = 0.25 * al; g.lineWidth = p.w * 2.5 * al; g.stroke(); }
      else if (p.k === 'star') { const r = p.s * (0.6 + q * 0.8); g.globalAlpha = al; g.fillStyle = '#fff'; g.strokeStyle = p.c; g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 8; i++) { const a = p.a + i * Math.PI / 4, rr = i % 2 ? r * 0.28 : r; g.lineTo(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr); } g.closePath(); g.stroke(); g.fill(); }
      else if (p.k === 'smear' && p.u) { // croissant ZZZ : épais, contour encré, couleur du personnage
        const u = p.u, e = ease.out(q), a0 = p.a0, a1 = lerp(p.a0, p.a1, Math.min(1, e * 1.6)), cx = u.x, cy = u.y - 34, r = p.r, th = (p.big ? 20 : 13) * (1 - q * 0.7);
        g.globalAlpha = 0.9 * al; g.fillStyle = p.c; g.beginPath(); const n = 14; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.75); } for (let i = n; i >= 0; i--) { const a = lerp(a0, a1, i / n), w = th * Math.sin((i / n) * Math.PI); g.lineTo(cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w) * 0.75); } g.closePath(); g.fill(); g.strokeStyle = '#0b1020'; g.lineWidth = 2; g.stroke(); }
    } g.globalAlpha = 1; },
  drawText(g) { for (const t of this.T) { const q = t.t / t.life; let s = 1; if (t.pop) s = t.t < 0.08 ? lerp(0.4, 1.6, t.t / 0.08) : t.t < 0.22 ? lerp(1.6, 1, ease.back((t.t - 0.08) / 0.14)) : 1; else if (t.big) s = 1 + Math.max(0, 0.4 - t.t * 2);
    g.globalAlpha = Math.min(1, (1 - q) * 3); g.font = `${Math.round(t.size * s)}px ${t.dmgN ? "'TBV Ext', 'Luckiest Guy'" : "'TBV Ext', 'Lilita One'"}, Impact, 'Arial Black', system-ui, sans-serif`; g.textAlign = 'center'; g.lineJoin = 'round'; g.lineWidth = 5; g.strokeStyle = INK; g.strokeText(t.s, t.x, t.y); g.fillStyle = t.c; g.fillText(t.s, t.x, t.y); } g.globalAlpha = 1; },
};
/* Signes des mains dessinés (pas de texte) : deux mains stylisées formant le mudra */
const SIGNS = { tora: [[-0.2, 0], [0.2, 0], 1], ushi: [[-0.25, 0.1], [0.25, -0.1], 0], ne: [[0, -0.1], [0, 0.1], 2], tori: [[-0.15, -0.15], [0.15, 0.15], 3], mi: [[-0.1, 0], [0.1, 0], 4] };
function drawHands(g, x, y, sign, t) { const S = SIGNS[sign] || SIGNS.tora; const sc = 1 + 0.25 * Math.max(0, 1 - t * 6); g.save(); g.translate(x, y); g.scale(sc, sc); g.globalAlpha = Math.min(1, (0.5 - t) * 5);
  for (const [i, side] of [[0, -1], [1, 1]]) { const [ox, oy] = S[i]; g.save(); g.translate(ox * 40, oy * 40); g.rotate(side * 0.25 + (S[2] % 2 ? side * 0.35 : 0)); g.fillStyle = '#f2c9a0'; g.strokeStyle = '#0b1020'; g.lineWidth = 2;
    g.beginPath(); g.roundRect ? g.roundRect(-7, -4, 14, 16, 5) : g.rect(-7, -4, 14, 16); g.fill(); g.stroke(); // paume
    const fingers = S[2] === 2 ? 1 : S[2] === 4 ? 4 : 2; for (let f = 0; f < fingers; f++) { g.beginPath(); g.roundRect ? g.roundRect(-6 + f * (12 / Math.max(1, fingers - 1 || 1)) - (fingers === 1 ? -4 : 0), -18, 4, 15, 2) : g.rect(-6 + f * 4, -18, 4, 15); g.fill(); g.stroke(); }
    g.beginPath(); g.ellipse(side * -7, 4, 3, 6, side * 0.6, 0, TAU); g.fill(); g.stroke(); g.restore(); }
  g.restore(); }
