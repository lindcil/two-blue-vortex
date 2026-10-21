// v0.9 — Bibliothèque VFX déclarative + couche de performance.
// Primitives composables (particules-sprites, rubans, anneaux, ondes, arcs, croissants, éclats, décalques, faisceaux, distorsion, écran, caméra),
// préréglages par élément, sprites mis en cache hors écran, paliers de qualité, budget de particules, culling, zéro allocation dans la boucle de dessin.
(() => {
  const TAU2 = Math.PI * 2, R = Math.random, rr = (a, b) => a + R() * (b - a), rv = (v) => (Array.isArray(v) ? rr(v[0], v[1]) : v);
  const hx = (c) => { if (!c || c[0] !== '#') return [255, 255, 255]; if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; const n = parseInt(c.slice(1, 7), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const ca = (c, a) => { const [r, g, b] = hx(c); return `rgba(${r},${g},${b},${a})`; };
  const mixW = (c, k) => { const [r, g, b] = hx(c); const f = (v) => Math.round(v + (255 - v) * k).toString(16).padStart(2, '0'); return '#' + f(r) + f(g) + f(b); };
  // ---------- qualité / budget ----------
  const Q9 = (window.Q9 = { tier: 2, auto: true, ema: 16, budget: [300, 760, 1500], mul: [0.35, 0.65, 1], t: 0, last: 0, names: ['Basse', 'Moyenne', 'Haute'],
    tick(now) { const d = this.last ? now - this.last : 16; this.last = now; if (d > 200) return; this.ema += (d - this.ema) * 0.06; if (!this.auto) return; this.t += d;
      if (this.t < 1800) return; if (this.ema > 25 && this.tier > 0) { this.tier--; this.t = 0; } else if (this.ema < 14.5 && this.tier < 2) { this.tier++; this.t = 0; } },
    k() { return Save.set.low ? 0.3 : this.mul[this.tier]; }, rs() { return [0.62, 0.8, 1][this.tier]; }, ribs: [0, 12, 28], trav: [10, 26, 60] });
  FX.cap = function () { return Save.set.low ? 260 : Q9.budget[Q9.tier]; };
  // ---------- sprites mis en cache (hors écran, par forme × couleur) ----------
  const SZ = 64, SC = new Map();
  const PAINT = {
    glow(x, c) { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, ca(c, 1)); gr.addColorStop(0.35, ca(c, 0.55)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; x.fillRect(0, 0, SZ, SZ); },
    core(x, c) { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, ca(mixW(c, 0.5), 1)); gr.addColorStop(0.6, ca(c, 0.5)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; x.fillRect(0, 0, SZ, SZ); },
    ember(x, c) { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 14); gr.addColorStop(0, '#fff8d0'); gr.addColorStop(0.4, ca(c, 1)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; x.beginPath(); x.arc(32, 32, 14, 0, TAU2); x.fill(); },
    lick(x, c) { // langue de flamme : base ronde, pointe ondulée vers le haut
      const gr = x.createLinearGradient(0, 64, 0, 0); gr.addColorStop(0, '#fff3b0'); gr.addColorStop(0.35, ca(c, 1)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(40, 18, 52, 30, 48, 46); x.bezierCurveTo(46, 58, 18, 62, 16, 46); x.bezierCurveTo(14, 32, 28, 26, 32, 2); x.fill(); },
    drop(x, c) { x.fillStyle = ca(c, 0.95); x.beginPath(); x.moveTo(32, 6); x.bezierCurveTo(44, 26, 50, 36, 50, 44); x.arc(32, 44, 18, 0, Math.PI); x.bezierCurveTo(14, 36, 20, 26, 32, 6); x.fill(); x.strokeStyle = 'rgba(11,16,32,.8)'; x.lineWidth = 3; x.stroke(); x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(26, 40, 4, 7, 0.4, 0, TAU2); x.fill(); },
    shard(x, c) { x.fillStyle = c; x.strokeStyle = '#0b1020'; x.lineWidth = 3; x.beginPath(); x.moveTo(12, 40); x.lineTo(26, 12); x.lineTo(50, 18); x.lineTo(54, 42); x.lineTo(30, 54); x.closePath(); x.fill(); x.stroke(); x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.moveTo(26, 12); x.lineTo(50, 18); x.lineTo(36, 30); x.closePath(); x.fill(); x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.moveTo(30, 54); x.lineTo(54, 42); x.lineTo(36, 34); x.closePath(); x.fill(); },
    cres(x, c) { x.fillStyle = ca(c, 0.95); x.beginPath(); x.arc(32, 32, 28, -1.35, 1.35); x.arc(20, 32, 24, 1.2, -1.2, true); x.closePath(); x.fill(); x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(32, 32, 27, -1.0, 1.0); x.arc(26, 32, 25, 0.95, -0.95, true); x.fill(); },
    dust(x, c) { const gr = x.createRadialGradient(32, 32, 4, 32, 32, 30); gr.addColorStop(0, ca(c, 0.7)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(22 + (i * 7) % 20, 24 + (i * 11) % 18, 16, 0, TAU2); x.fill(); } },
    star(x, c) { x.fillStyle = '#ffffff'; x.strokeStyle = c; x.lineWidth = 3; x.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 7 : 28; x.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } x.closePath(); x.stroke(); x.fill(); },
    leaf(x, c) { x.fillStyle = c; x.strokeStyle = '#0b1020'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(10, 32); x.quadraticCurveTo(32, 6, 54, 32); x.quadraticCurveTo(32, 58, 10, 32); x.fill(); x.stroke(); x.beginPath(); x.moveTo(12, 32); x.lineTo(52, 32); x.stroke(); },
    wisp(x, c) { const gr = x.createRadialGradient(32, 40, 2, 32, 32, 30); gr.addColorStop(0, ca(mixW(c, 0.3), 0.9)); gr.addColorStop(1, ca(c, 0)); x.fillStyle = gr; x.beginPath(); x.moveTo(32, 2); x.quadraticCurveTo(58, 30, 40, 60); x.quadraticCurveTo(32, 50, 24, 60); x.quadraticCurveTo(6, 30, 32, 2); x.fill(); },
    // décalques au sol (dessinés avec un tirage aléatoire figé)
    scorch(x, c) { const gr = x.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(20,12,8,.85)'); gr.addColorStop(0.55, 'rgba(40,20,10,.5)'); gr.addColorStop(0.8, ca(c, 0.25)); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU2; x.strokeStyle = 'rgba(15,8,4,.6)'; x.lineWidth = 2; x.beginPath(); x.moveTo(32 + Math.cos(a) * 12, 32 + Math.sin(a) * 12); x.lineTo(32 + Math.cos(a + 0.2) * 30, 32 + Math.sin(a + 0.2) * 30); x.stroke(); } },
    crack(x, c) { x.fillStyle = 'rgba(30,22,14,.45)'; x.beginPath(); x.arc(32, 32, 14, 0, TAU2); x.fill(); x.strokeStyle = 'rgba(20,14,8,.95)'; x.lineCap = 'round'; for (let i = 0; i < 7; i++) { let a = i / 7 * TAU2 + 0.3, px = 32, py = 32; x.lineWidth = 3; x.beginPath(); x.moveTo(px, py); for (let k = 0; k < 4; k++) { a += (k % 2 ? 0.4 : -0.35); px += Math.cos(a) * 8; py += Math.sin(a) * 8; x.lineTo(px, py); x.lineWidth = 3 - k * 0.6; } x.stroke(); } },
    splat(x, c) { x.fillStyle = ca(c, 0.45); x.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU2, r = i % 2 ? 18 : 28; x.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } x.closePath(); x.fill(); x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.arc(26, 26, 6, 0, TAU2); x.fill(); },
    slash(x, c) { x.strokeStyle = 'rgba(20,24,30,.55)'; x.lineCap = 'round'; for (let i = 0; i < 3; i++) { x.lineWidth = 4 - i; x.beginPath(); x.moveTo(8 + i * 6, 50 - i * 4); x.quadraticCurveTo(32, 24 + i * 6, 56 - i * 3, 10 + i * 8); x.stroke(); } x.strokeStyle = ca(c, 0.4); x.lineWidth = 2; x.beginPath(); x.moveTo(10, 48); x.quadraticCurveTo(32, 26, 54, 12); x.stroke(); },
    burn(x, c) { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, ca(mixW(c, 0.4), 0.7)); gr.addColorStop(0.5, 'rgba(20,20,40,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); x.strokeStyle = ca(c, 0.8); x.lineWidth = 1.5; for (let i = 0; i < 6; i++) { let a = i * 1.1, px = 32, py = 32; x.beginPath(); x.moveTo(px, py); for (let k = 0; k < 4; k++) { a += (k % 2 ? 0.7 : -0.6); px += Math.cos(a) * 7; py += Math.sin(a) * 7; x.lineTo(px, py); } x.stroke(); } },
  };
  const SPR = (window.SPR9 = { get(k, c) { const key = k + c; let s = SC.get(key); if (s) return s; s = document.createElement('canvas'); s.width = s.height = SZ; const x = s.getContext('2d'); (PAINT[k] || PAINT.glow)(x, c || '#ffffff'); SC.set(key, s); return s; }, size: () => SC.size, PAINT });
  // ---------- nouvelles primitives dans FX ----------
  const ADD = (o) => FX.add(o);
  // rubans : points dans un Float32Array fixe (pas d’allocation par image)
  const RIBN = 14;
  // ---------- dessin optimisé : culling, sprites, regroupement des étincelles par couleur ----------
  const BUCK = new Map(); const bk = (key) => { let a = BUCK.get(key); if (!a) { a = []; BUCK.set(key, a); } return a; };
  let VX0 = 0, VX1 = 0, VY0 = 0, VY1 = 0;
  const view = () => { const vw = innerWidth, vh = innerHeight, z = clamp(vw / 1150, 0.62, 1.25) * Cam.z; VX0 = Cam.x - vw / 2 / z - 160; VX1 = Cam.x + vw / 2 / z + 160; VY0 = Cam.y - vh / 2 / z - 220; VY1 = Cam.y + vh / 2 / z + 220; };
  const CULL = { spark: 1, smoke: 1, ring: 1, glow: 1, mote: 0, shock: 1, star: 1, sp: 1, puddle: 1, decal: 1, arc9: 1, bolt: 0 };
  const STATS = (window.FX9STAT = { drawn: 0, culled: 0, batches: 0 });
  const baseDraw = FX.draw.bind(FX);
  FX.draw = function (g, layer) { view(); STATS.drawn = 0; STATS.culled = 0; STATS.batches = 0; for (const a of BUCK.values()) a.length = 0;
    const P = this.P; const lo = Q9.tier === 0;
    for (let i = 0; i < P.length; i++) { const p = P[i]; const gl = p.k === 'puddle' || p.ground || p.k === 'decal'; if (layer === 0 && !gl) continue; if (layer === 1 && gl) continue;
      if (CULL[p.k] && (p.x < VX0 || p.x > VX1 || p.y < VY0 || p.y > VY1)) { STATS.culled++; continue; }
      STATS.drawn++; const q = p.t / p.life, al = 1 - q;
      switch (p.k) {
        case 'spark': { const a = al > 0.66 ? 3 : al > 0.33 ? 2 : 1, w = p.s < 3 ? 2 : p.s < 4.2 ? 3.4 : 5; const arr = bk(p.c + '|' + w + '|' + a); arr.push(p); break; }
        case 'glow': { const r = p.s * (p.grow ? 1 + q * p.grow : 1); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (p.a ?? 0.8) * al; g.drawImage(SPR.get('glow', p.c && p.c[0] === '#' ? p.c : '#ffffff'), p.x - r, p.y - r, r * 2, r * 2); g.globalCompositeOperation = 'source-over'; break; }
        case 'sp': { // particule-sprite générique
          const s = p.s * (p.s1 != null ? 1 + (p.s1 - 1) * q : 1), al2 = (p.a ?? 1) * (p.fin ? Math.min(1, q * 6) : 1) * (p.hold ? (q < p.hold ? 1 : 1 - (q - p.hold) / (1 - p.hold)) : al);
          if (al2 <= 0.01) break; g.globalAlpha = al2; if (p.add) g.globalCompositeOperation = 'lighter'; const img = SPR.get(p.spr, p.c);
          if (p.stretch || p.rot || p.spin) { g.save(); g.translate(p.x, p.y); g.rotate(p.stretch ? Math.atan2(p.vy, p.vx) + Math.PI / 2 : (p.rot || 0) + (p.spin || 0) * p.t); const st = p.stretch ? 1 + Math.min(2.2, Math.hypot(p.vx, p.vy) / 380) : 1; g.drawImage(img, -s, -s * st, s * 2, s * 2 * st); g.restore(); }
          else g.drawImage(img, p.x - s, p.y - s, s * 2, s * 2);
          if (p.add) g.globalCompositeOperation = 'source-over'; break; }
        case 'decal': { const f = q < 0.08 ? q / 0.08 : q > 0.75 ? 1 - (q - 0.75) / 0.25 : 1; g.globalAlpha = (p.a ?? 0.85) * f; g.save(); g.translate(p.x, p.y); g.rotate(p.rot || 0); g.scale(1, 0.5); g.drawImage(SPR.get(p.dk, p.c), -p.r, -p.r, p.r * 2, p.r * 2); g.restore(); break; }
        case 'rib': { const n = p.n; if (n < 2) break; const A = p.pts; g.globalCompositeOperation = 'lighter';
          for (let pass = 0; pass < (lo ? 1 : 2); pass++) { g.beginPath(); for (let k = 0; k < n; k++) { const j = ((p.h - k) % RIBN + RIBN) % RIBN; const x = A[j * 2], y = A[j * 2 + 1]; k ? g.lineTo(x, y) : g.moveTo(x, y); }
            g.strokeStyle = pass ? '#ffffff' : p.c; g.globalAlpha = (pass ? 0.55 : 0.5) * al * (p.a ?? 1); g.lineWidth = (pass ? p.w * 0.32 : p.w) * (0.5 + al * 0.5); g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); }
          g.globalCompositeOperation = 'source-over'; break; }
        case 'arc9': { // éclair ramifié, recalculé toutes les 50 ms (graine figée entre-temps)
          if (!p.seg || p.t - (p.rt || 0) > 0.05) { p.rt = p.t; p.sd = R() * 1000; } let sd = p.sd; const rn = () => { sd = (sd * 9301 + 49297) % 233280; return sd / 233280 - 0.5; };
          g.globalCompositeOperation = 'lighter'; const segs = lo ? 5 : 8, L = Math.hypot(p.x2 - p.x, p.y2 - p.y), jit = (p.j || 0.22) * L;
          for (let pass = 0; pass < 2; pass++) { g.strokeStyle = pass ? '#ffffff' : p.c; g.lineWidth = pass ? 1.6 : (p.w || 5) * al + 1; g.globalAlpha = pass ? al : 0.55 * al; let sd0 = sd; g.beginPath(); g.moveTo(p.x, p.y); let bx = 0, by = 0;
            for (let i = 1; i < segs; i++) { const t = i / segs, ox = rn() * jit * (1 - Math.abs(t - 0.5)), oy = rn() * jit * (1 - Math.abs(t - 0.5)); const x = lerp(p.x, p.x2, t) + ox, y = lerp(p.y, p.y2, t) + oy; g.lineTo(x, y); if (i === 3) { bx = x; by = y; } }
            g.lineTo(p.x2, p.y2); if (!lo && p.br) { g.moveTo(bx, by); g.lineTo(bx + rn() * L * 0.6, by + rn() * L * 0.6); } g.stroke(); sd = sd0; }
          g.globalCompositeOperation = 'source-over'; p.seg = 1; break; }
        case 'dist': { // distorsion simulée : double anneau décalé (aberration chromatique) + voile
          const r = p.r * ease.out(q); g.globalCompositeOperation = 'lighter'; g.lineWidth = 6 * al + 1; g.globalAlpha = 0.45 * al;
          g.strokeStyle = 'rgba(255,90,90,1)'; g.beginPath(); g.ellipse(p.x - 3, p.y, r, r * 0.55, 0, 0, TAU2); g.stroke(); g.strokeStyle = 'rgba(90,160,255,1)'; g.beginPath(); g.ellipse(p.x + 3, p.y, r, r * 0.55, 0, 0, TAU2); g.stroke();
          g.globalAlpha = 0.12 * al; g.fillStyle = p.c || '#ffffff'; g.beginPath(); g.ellipse(p.x, p.y, r, r * 0.55, 0, 0, TAU2); g.fill(); g.globalCompositeOperation = 'source-over'; break; }
        case 'beam9': { g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.globalCompositeOperation = 'lighter'; const l = p.L * Math.min(1, q * 6), w = p.w * (q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3);
          g.globalAlpha = 0.5; g.drawImage(SPR.get('glow', p.c), -w, -w * 2, l + w * 2, w * 4); g.globalAlpha = 0.9; g.fillStyle = p.c; g.fillRect(0, -w * 0.45, l, w * 0.9); g.fillStyle = '#ffffff'; g.fillRect(0, -w * 0.16, l, w * 0.32);
          if (!lo) { g.globalAlpha = 0.6; g.strokeStyle = mixW(p.c, 0.5); g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); for (let s = 0; s <= 12; s++) { const xx = s / 12 * l, yy = Math.sin(s * 1.3 + Game.t * 30 + k * 2) * w * 0.6; s ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
          g.restore(); break; }
        default: { // types historiques : on délègue en lot à l’ancien dessin (un seul élément)
          LEG[0] = p; const keep = this.P; this.P = LEG; baseDraw(g, layer); this.P = keep; }
      }
    }
    // étincelles regroupées : un seul tracé par couleur × épaisseur × alpha
    for (const [key, arr] of BUCK) { if (!arr.length) continue; STATS.batches++; const i1 = key.indexOf('|'), i2 = key.lastIndexOf('|'); g.strokeStyle = key.slice(0, i1); g.lineWidth = +key.slice(i1 + 1, i2); g.globalAlpha = +key.slice(i2 + 1) / 3; g.lineCap = 'round'; g.beginPath(); for (const p of arr) { g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); } g.stroke(); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; };
  const LEG = [null];
  // mise à jour : rubans qui suivent leur porteur, retrait des textes sans splice
  const baseUpd = FX.update.bind(FX);
  FX.update = function (dt) { for (const p of this.P) if (p.k === 'rib') { const f = p.fol; if (f && !p.stop) { if (f.life != null && f.life <= 0 || f.gone || f.hp != null && f.hp <= 0) p.stop = 1; else { p.h = (p.h + 1) % RIBN; p.pts[p.h * 2] = f.x + (p.ox || 0); p.pts[p.h * 2 + 1] = f.y + (p.oy || 0); p.n = Math.min(RIBN, p.n + 1); p.t = 0; } } }
    else if (p.k === 'sp' && p.drag) { p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; }
    baseUpd(dt); };
  const RPOOL = []; // tampons des rubans réutilisés
  // ---------- texte : suppression O(1) ----------
  // ---------- sol : on ne copie que la portion visible de la carte ----------
  if (World.drawGround) { const dg = World.drawGround.bind(World); World.drawGround = function (g) { if (!this.ground || !this.gsc) return dg(g); view(); const x0 = Math.max(0, VX0), y0 = Math.max(0, VY0), x1 = Math.min(W, VX1), y1 = Math.min(H, VY1); if (x1 <= x0 || y1 <= y0) return; const s = this.gsc;
      g.drawImage(this.ground, x0 * s, y0 * s, (x1 - x0) * s, (y1 - y0) * s, x0, y0, x1 - x0, y1 - y0); for (const h of this.hazards) { g.globalAlpha = 0.5 * (1 - h.t / h.life) + 0.2; g.fillStyle = elc(h.el); g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r * 0.5, 0, 0, TAU2); g.fill(); g.globalAlpha = 1; } }; }
  // ---------- flamme en sprites (remplace 3 dégradés recréés à chaque image) ----------
  V.flame = function (g, x, y, r, t) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.5; g.drawImage(SPR.get('glow', '#ff4614'), x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); g.globalAlpha = 0.8; g.drawImage(SPR.get('glow', '#ff8c1e'), x - r * 1.1, y - r * 1.1, r * 2.2, r * 2.2);
    const n = Q9.tier ? 5 : 3; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + Math.sin(t * 7 + i * 2.1) * 0.5 + (i - (n - 1) / 2) * 0.35, l = r * (1.1 + 0.35 * Math.sin(t * 11 + i)); g.save(); g.translate(x + Math.cos(a) * r * 0.2, y); g.rotate(a + Math.PI / 2); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 0.8; g.drawImage(SPR.get('lick', '#ff7a22'), -r * 0.5, -l, r, l * 1.3); g.restore(); }
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.6; g.drawImage(SPR.get('core', '#ffd070'), x - r * 0.6, y - r * 0.6, r * 1.2, r * 1.2); g.restore(); };
  // ---------- dessin des projectiles sans allocation ----------
  if (typeof drawProj === 'function') { const PA = [], PB = [], SV = []; const dp0 = drawProj;
    drawProj = function (g) { PA.length = 0; PB.length = 0; SV.length = 0; for (const p of Proj) { SV.push(p); if (p.x < VX0 || p.x > VX1 || p.y < VY0 || p.y > VY1) continue; (p.draw ? PA : PB).push(p); }
      Proj.length = 0; for (const p of PB) Proj.push(p); try { dp0(g); } finally { Proj.length = 0; for (const p of SV) Proj.push(p); } for (const p of PA) { g.save(); p.draw(g, p); g.restore(); } }; }
  // ---------- API d’émission ----------
  const k = () => Q9.k(); const N = (n) => { const v = rv(n) * k(); return Math.floor(v) + (R() < v % 1 ? 1 : 0); };
  const col = (L, o) => { const c = L.c || o.c || '#ffffff'; return Array.isArray(c) ? c[(R() * c.length) | 0] : c; };
  const EMIT = {
    glow(L, x, y, o, s) { FX.glow(x, y, col(L, o), rv(L.r || 60) * s, rv(L.life || 0.3), { a: L.a ?? 0.8, grow: L.grow }); },
    burst(L, x, y, o, s) { const n = N(L.n || 10); const base = L.dir == null ? null : (o.a || 0) + L.dir; for (let i = 0; i < n; i++) { const a = base == null ? R() * TAU2 : base + rr(-(L.spread || 0.6), L.spread || 0.6), sp = rv(L.sp || [120, 380]) * s;
        const o2 = { k: 'sp', spr: L.spr || 'ember', c: col(L, o), x: x + rr(-1, 1) * (L.jx || 0) * s, y: y + rr(-1, 1) * (L.jy || 0) * s, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * (L.flat ?? 0.7) + (L.up || 0), g: L.g || 0, drag: L.drag || 0, s: rv(L.size || [3, 7]) * s, s1: L.s1, life: rv(L.life || [0.3, 0.6]), add: L.add ?? 1, stretch: L.stretch, rot: L.rot ? R() * TAU2 : 0, spin: L.spin ? rr(-L.spin, L.spin) : 0, hold: L.hold, a: L.a, fin: L.fin, ground: L.ground };
        if (L.conv) { o2.x = x + Math.cos(a) * sp * 0.4; o2.y = y + Math.sin(a) * sp * 0.3; o2.vx = -Math.cos(a) * sp * 1.6; o2.vy = -Math.sin(a) * sp * 1.2; o2.fin = 1; } ADD(o2); } },
    ring(L, x, y, o, s) { FX.ring(x, y, col(L, o), (L.r0 || 8) * s, rv(L.r || 80) * s, L.life || 0.35); },
    shock(L, x, y, o, s) { FX.shock(x, y, col(L, o), rv(L.r || 120) * s, L.life || 0.45, (L.w || 8) * s); },
    dist(L, x, y, o, s) { if (Q9.tier === 0) return; ADD({ k: 'dist', x, y, r: rv(L.r || 140) * s, c: col(L, o), life: L.life || 0.4 }); },
    licks(L, x, y, o, s) { const n = N(L.n || 6); for (let i = 0; i < n; i++) ADD({ k: 'sp', spr: 'lick', c: col(L, o), x: x + rr(-1, 1) * (L.w || 30) * s, y: y + rr(-6, 6), vx: rr(-30, 30), vy: -rv(L.sp || [80, 200]) * s, g: -60, s: rv(L.size || [12, 22]) * s, s1: 0.3, life: rv(L.life || [0.35, 0.6]), add: L.add ?? 0, rot: rr(-0.3, 0.3), spin: 0.6 }); },
    splash(L, x, y, o, s) { const n = N(L.n || 12); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + rr(-1.2, 1.2), sp = rv(L.sp || [220, 460]) * s; ADD({ k: 'sp', spr: 'drop', c: col(L, o), x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 1100, s: rv(L.size || [4, 8]) * s, life: rv([0.45, 0.75]), add: 0, stretch: 1 }); }
      FX.ring(x, y + 6, '#bfe6ff', 6 * s, 70 * s, 0.4); if (Q9.tier) FX.ring(x, y + 6, col(L, o), 4 * s, 46 * s, 0.55); },
    arcs(L, x, y, o, s) { const n = N(L.n || 4); for (let i = 0; i < n; i++) { const a = L.dir == null ? R() * TAU2 : (o.a || 0) + L.dir + rr(-0.8, 0.8), r = rv(L.r || [50, 120]) * s; ADD({ k: 'arc9', x, y, x2: x + Math.cos(a) * r, y2: y + Math.sin(a) * r * 0.7, c: col(L, o), w: (L.w || 4) * s, br: L.br ?? 1, life: rv(L.life || [0.12, 0.25]) }); } },
    bolt(L, x, y, o, s) { ADD({ k: 'arc9', x: x + (L.fx || 0), y: y - (L.h || 300) * s, x2: x, y2: y, c: col(L, o), w: (L.w || 7) * s, br: 1, j: 0.12, life: L.life || 0.22 }); },
    crescents(L, x, y, o, s) { const n = N(L.n || 4); for (let i = 0; i < n; i++) { const a = L.dir == null ? R() * TAU2 : (o.a || 0) + L.dir + rr(-(L.spread || 0.5), L.spread || 0.5), sp = rv(L.sp || [300, 600]) * s; ADD({ k: 'sp', spr: 'cres', c: col(L, o), x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6, drag: 3, s: rv(L.size || [10, 18]) * s, s1: 1.6, life: rv(L.life || [0.25, 0.4]), add: 1, rot: a, spin: 0 }); } },
    chunks(L, x, y, o, s) { const n = N(L.n || 8); for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + rr(-1.1, 1.1), sp = rv(L.sp || [240, 520]) * s; ADD({ k: 'sp', spr: 'shard', c: col(L, o), x: x + rr(-14, 14), y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 1300, s: rv(L.size || [5, 11]) * s, life: rv([0.5, 0.85]), add: 0, rot: 1, spin: 9 }); } EMIT.dustc({ n: (L.n || 8) * 0.8, c: '#a89478' }, x, y, o, s); },
    dustc(L, x, y, o, s) { const n = N(L.n || 6); for (let i = 0; i < n; i++) ADD({ k: 'sp', spr: 'dust', c: col(L, o), x: x + rr(-30, 30) * s, y: y + rr(-6, 6), vx: rr(-120, 120) * s, vy: rr(-60, -10), drag: 2.5, s: rv(L.size || [14, 26]) * s, s1: 2, life: rv(L.life || [0.5, 0.9]), add: 0, a: 0.55 }); },
    smoke(L, x, y, o, s) { FX.smoke(x, y, Math.max(1, N(L.n || 6))); },
    decal(L, x, y, o, s) { if (FX.P.reduce((a, p) => a + (p.k === 'decal'), 0) > [12, 30, 60][Q9.tier]) return; ADD({ k: 'decal', dk: L.dk || 'scorch', c: col(L, o), x, y: y + (L.oy || 0), r: rv(L.r || 60) * s, rot: L.dk === 'slash' ? (o.a || 0) : R() * TAU2, life: L.life || 6, a: L.a ?? 0.85, ground: 1 }); },
    beam(L, x, y, o, s) { ADD({ k: 'beam9', x, y, a: o.a || 0, L: (L.L || 400) * s, w: (L.w || 18) * s, c: col(L, o), life: L.life || 0.35 }); },
    trail(L, x, y, o) { const f = o.follow; if (!f || Q9.tier === 0 && !L.always) return; let nr = 0; for (const p of FX.P) if (p.k === 'rib') nr++; if (nr >= Q9.ribs[Q9.tier]) return; ADD({ k: 'rib', fol: f, pts: RPOOL.pop() || new Float32Array(RIBN * 2), h: 0, n: 0, w: L.w || 14, c: col(L, o), a: L.a, life: L.life || 0.25, ox: L.ox || 0, oy: L.oy || 0 }); },
    star(L, x, y, o, s) { ADD({ k: 'sp', spr: 'star', c: col(L, o), x, y, vx: 0, vy: 0, s: rv(L.size || 22) * s, s1: 1.5, life: L.life || 0.14, add: 0, rot: 1 }); },
    screen(L, x, y, o, s) { if (L.k === 'flash') { if (Save.set.rf) return; Game.impactT = Math.max(Game.impactT || 0, (L.a || 0.3) * 0.25); Game.impactAt = { x, y }; } else if (L.k === 'dark') Game.sky && Game.sky(L.a || 0.4, L.life || 0.6); },
    cam(L, x, y, o, s) { if (L.shake) Cam.shake(L.shake * s); if (L.hitstop) Game.hitstop(L.hitstop); if (L.zoom) { Cam.tz = L.zoom; Game.later(L.zt || 0.35, () => (Cam.tz = 1)); } },
    sfx(L) { try { Sfx.play(L.k || 'tech'); } catch (e) {} },
  };
  const PRESET = {};
  const VFX9 = (window.VFX9 = { EMIT, PRESET, SPR, ca, mixW,
    // une couche = { fx, …params, at (délai), p (probabilité), tier (palier min) } ; une liste ou un nom de préréglage « fire.impact »
    resolve(L) { if (typeof L === 'string') { const [e, ph] = L.split('.'); return (PRESET[e] && PRESET[e][ph]) || []; } return L || []; },
    play(L, x, y, o = {}) { const list = this.resolve(L); const s = o.s || 1; for (const l of list) { if (typeof l === 'string') { this.play(l, x, y, o); continue; } if (l.tier && Q9.tier < l.tier) continue; if (l.p != null && R() > l.p) continue; const f = EMIT[l.fx]; if (!f) continue;
        const dx = (l.ox || 0) * s, dy = (l.oy || 0) * s; if (l.at) Game.later(l.at, () => f(l, (o.follow ? o.follow.x : x) + dx, (o.follow ? o.follow.y : y) + dy, o, s)); else f(l, x + dx, y + dy, o, s); } },
    stat: STATS });
  // ---------- préréglages par élément ----------
  const E = { fire: ['#ff7a22', '#ffb13d', '#ff4a1a'], water: ['#4aa8ff', '#8fd3ff', '#2a6fd0'], bolt: ['#b98cff', '#e6d8ff', '#8fd3ff'], wind: ['#7fffd4', '#d8fff2', '#3fd9a8'], earth: ['#b08850', '#8a6a44', '#d6b98a'], yin: ['#a46bff', '#5a2a9a', '#e0c8ff'], yang: ['#ffd166', '#fff3c0', '#ffb13d'], none: ['#e8eefc', '#ffffff', '#c9d3e6'] };
  for (const [e, C] of Object.entries(E)) PRESET[e] = { charge: [{ fx: 'glow', r: 46, c: C[0], life: 0.35, a: 0.6 }, { fx: 'burst', conv: 1, n: 10, c: C, spr: 'ember', sp: [80, 160], size: [2, 4], life: [0.25, 0.35] }],
    muzzle: [{ fx: 'glow', r: 54, c: C[0], life: 0.22 }, { fx: 'burst', n: 8, c: C, spr: 'ember', dir: 0, spread: 0.5, sp: [200, 420], size: [2, 4], life: [0.15, 0.3] }],
    travel: [{ fx: 'burst', n: 1, c: C, spr: 'ember', sp: [10, 60], size: [2, 5], life: [0.2, 0.4] }],
    impact: [{ fx: 'star', c: C[0], size: 20 }, { fx: 'glow', r: 70, c: C[0], life: 0.25 }, { fx: 'burst', n: 10, c: C, spr: 'ember', sp: [180, 420], size: [2, 5], life: [0.2, 0.45], g: 300 }, { fx: 'ring', c: C[1], r: 60, life: 0.3 }, { fx: 'cam', shake: 0.06 }],
    big: [{ fx: 'dist', r: 170, c: C[0] }, { fx: 'shock', c: C[0], r: 160, w: 10 }, { fx: 'cam', shake: 0.25, hitstop: 0.05 }] };
  Object.assign(PRESET.fire, { travel: [{ fx: 'licks', n: 1, c: E.fire, w: 8, sp: [40, 90], size: [8, 14], life: [0.18, 0.3] }, { fx: 'burst', n: 1.2, c: E.fire, spr: 'ember', sp: [20, 90], g: -160, size: [2, 4], life: [0.3, 0.5] }, { fx: 'smoke', n: 1, p: 0.12, tier: 1 }],
    impact: [{ fx: 'star', c: '#ffb13d', size: 22 }, { fx: 'glow', r: 90, c: '#ff7a22', life: 0.3 }, { fx: 'licks', n: 7, c: E.fire, w: 34 }, { fx: 'burst', n: 14, c: E.fire, spr: 'ember', sp: [160, 420], g: -120, size: [2, 5], life: [0.35, 0.7] }, { fx: 'ring', c: '#ffd166', r: 70 }, { fx: 'smoke', n: 4, tier: 1 }, { fx: 'decal', dk: 'scorch', c: '#ff7a22', r: 46, oy: 30 }, { fx: 'cam', shake: 0.08 }] });
  Object.assign(PRESET.water, { travel: [{ fx: 'burst', n: 1.4, c: E.water, spr: 'drop', sp: [40, 140], g: 900, size: [2, 5], life: [0.3, 0.5], add: 0, stretch: 1 }, { fx: 'burst', n: 0.5, c: ['#e6f6ff'], spr: 'glow', sp: [10, 40], size: [6, 10], life: [0.2, 0.35] }],
    impact: [{ fx: 'splash', n: 14, c: E.water }, { fx: 'glow', r: 60, c: '#8fd3ff', life: 0.25, a: 0.5 }, { fx: 'dustc', n: 4, c: '#e6f6ff', size: [12, 22] }, { fx: 'decal', dk: 'splat', c: '#4aa8ff', r: 44, oy: 30, life: 4 }, { fx: 'cam', shake: 0.06 }] });
  Object.assign(PRESET.bolt, { charge: [{ fx: 'arcs', n: 3, c: E.bolt, r: [30, 60] }, { fx: 'glow', r: 44, c: '#b98cff', life: 0.3 }], travel: [{ fx: 'arcs', n: 0.5, c: E.bolt, r: [18, 40], br: 0, w: 2 }, { fx: 'burst', n: 0.8, c: ['#e6d8ff'], spr: 'ember', sp: [60, 200], size: [1.5, 3], life: [0.1, 0.2] }],
    impact: [{ fx: 'star', c: '#b98cff', size: 26 }, { fx: 'arcs', n: 5, c: E.bolt, r: [60, 130] }, { fx: 'glow', r: 80, c: '#b98cff', life: 0.2 }, { fx: 'burst', n: 10, c: E.bolt, spr: 'ember', sp: [300, 650], size: [1.5, 3.5], life: [0.12, 0.28], stretch: 1 }, { fx: 'decal', dk: 'burn', c: '#b98cff', r: 40, oy: 30, life: 4 }, { fx: 'screen', k: 'flash', a: 0.25 }, { fx: 'cam', shake: 0.08, hitstop: 0.03 }] });
  Object.assign(PRESET.wind, { charge: [{ fx: 'crescents', n: 3, c: E.wind, sp: [-200, -120], size: [8, 12] }, { fx: 'glow', r: 40, c: '#7fffd4', life: 0.3, a: 0.5 }], travel: [{ fx: 'crescents', n: 0.5, c: E.wind, sp: [30, 90], size: [6, 10], life: [0.15, 0.25] }, { fx: 'dustc', n: 0.3, c: '#d8fff2', size: [8, 14], tier: 1 }],
    impact: [{ fx: 'crescents', n: 6, c: E.wind, sp: [300, 700] }, { fx: 'ring', c: '#d8fff2', r: 90, life: 0.3 }, { fx: 'burst', n: 6, c: ['#6fbf5a', '#9fd36b'], spr: 'leaf', sp: [140, 320], size: [4, 7], life: [0.5, 0.9], add: 0, rot: 1, spin: 8, g: 120, drag: 2 }, { fx: 'dustc', n: 5, c: '#c9d3e6' }, { fx: 'decal', dk: 'slash', c: '#7fffd4', r: 46, oy: 30, life: 4 }, { fx: 'cam', shake: 0.06 }] });
  Object.assign(PRESET.earth, { charge: [{ fx: 'dustc', n: 4, c: '#a89478', oy: 40 }, { fx: 'chunks', n: 2, c: E.earth, sp: [120, 200], size: [3, 5], oy: 40 }], travel: [{ fx: 'dustc', n: 0.6, c: '#a89478', size: [8, 14] }, { fx: 'chunks', n: 0.25, c: E.earth, size: [3, 5], sp: [80, 160] }],
    impact: [{ fx: 'chunks', n: 10, c: E.earth }, { fx: 'shock', c: '#d6b98a', r: 110, w: 8 }, { fx: 'decal', dk: 'crack', c: '#8a6a44', r: 56, oy: 30, life: 6 }, { fx: 'cam', shake: 0.18, hitstop: 0.03 }] });
  Object.assign(PRESET.yin, { travel: [{ fx: 'burst', n: 1, c: E.yin, spr: 'wisp', sp: [20, 60], g: -80, size: [6, 10], life: [0.3, 0.5] }], impact: [{ fx: 'star', c: '#a46bff', size: 22 }, { fx: 'burst', n: 10, c: E.yin, spr: 'wisp', sp: [120, 300], g: -100, size: [6, 12], life: [0.3, 0.6] }, { fx: 'dist', r: 110, c: '#5a2a9a' }, { fx: 'cam', shake: 0.06 }] });
  Object.assign(PRESET.yang, { impact: [{ fx: 'star', c: '#ffd166', size: 24 }, { fx: 'glow', r: 90, c: '#ffd166', life: 0.3 }, { fx: 'burst', n: 12, c: E.yang, spr: 'ember', sp: [200, 480], size: [2, 5], life: [0.2, 0.5] }, { fx: 'ring', c: '#fff3c0', r: 80 }, { fx: 'cam', shake: 0.08 }] });
  // ---------- mise à niveau automatique de TOUTES les techniques ----------
  const elOf = (e) => (PRESET[e] ? e : 'none'); let FR = 0; const PREV = [];
  if (typeof projUpdate === 'function') { const pu = projUpdate; projUpdate = function (dt) { FR++; PREV.length = 0; for (const p of Proj) { PREV.push(p); if (!p._v9) { p._v9 = { e: elOf(p.el), acc: R() }; if (!p.noTrail9 && p.el !== 'earth' && (p.r || 16) >= 12 && p.life > 0.2) EMIT.trail({ w: Math.min(26, (p.r || 16) * 0.9), c: elc(p.el || 'none'), life: 0.22 }, p.x, p.y, { follow: p }); } }
      pu(dt); for (const p of Proj) p._a = FR;
      const kk = k(); let tb = Q9.trav[Q9.tier]; for (const p of Proj) { const v = p._v9; if (!v || p.noVfx9) continue; if (p.x < VX0 || p.x > VX1 || p.y < VY0 || p.y > VY1) continue; v.acc += dt * 34 * kk; if (v.acc >= 1 && tb > 0) { v.acc -= 1; tb--; VFX9.play(p.vfxTravel || PRESET[v.e].travel, p.x, p.y, { a: Math.atan2(p.vy, p.vx), s: Math.min(1.6, (p.r || 16) / 18) }); } }
      for (const p of PREV) if (p._a !== FR && p._v9 && !p.noVfx9 && (p.boom || !p.hit || !p.hit.size) && p.x > VX0 && p.x < VX1) VFX9.play(p.vfxImpact || PRESET[p._v9.e].impact, p.x, p.y + 6, { a: Math.atan2(p.vy, p.vx), s: Math.min(1.5, (p.r || 16) / 20) * (p.boom ? 1.4 : 0.8) }); }; }
  if (typeof hurt === 'function') { const hu = hurt; hurt = function (t, dmg, src, o = {}) { const d = hu.apply(this, arguments); if (d > 0 && t && !t.isHero && o && o.el && src && (src.isHero || src.isAlly || src.isClone) && (Game.t - (t._v9t || -9)) > 0.09) { t._v9t = Game.t; const e = elOf(o.el);
        VFX9.play(PRESET[e].impact, t.x, t.y - 34, { s: o.big ? 1.3 : 0.75, a: Math.atan2(t.y - src.y, t.x - src.x) }); if (o.big) VFX9.play(PRESET[e].big, t.x, t.y, { s: 1 }); } return d; }; }
  if (typeof castSkill === 'function') { const cs = castSkill; castSkill = function (u, S, id, isHero) { const cd0 = u.cd && u.cd[id]; const r = cs.apply(this, arguments); if (S && u.act && u.act.k === 'cast' && u.act.S === S && u.cd[id] !== cd0) { const e = elOf(S.el); const h = u.hand || { x: u.x + u.face * 20, y: u.y - 40 };
        VFX9.play(PRESET[e].charge, h.x, h.y, { a: u.aimA || 0 }); Game.later(0.22, () => VFX9.play(PRESET[e].muzzle, u.x + Math.cos(u.aimA || 0) * 30, u.y - 40, { a: u.aimA || 0 })); } return r; }; }
  // ---------- mesure de la fréquence d’images (palier automatique) ----------
  const tk = () => { Q9.tick(performance.now()); requestAnimationFrame(tk); }; requestAnimationFrame(tk);
})();
// icônes d’élément au-dessus des ennemis : rendues une fois hors écran puis copiées
(() => { if (typeof drawElIcon !== 'function') return; const de = drawElIcon, C = new Map();
  drawElIcon = function (g, el, x, y, r) { const key = el + '|' + r + '|' + (Save.set.cb || ''); let s = C.get(key); if (!s) { const S = Math.ceil(r * 2 + 12); s = document.createElement('canvas'); s.width = s.height = S * 2; const x2 = s.getContext('2d'); x2.scale(2, 2); de(x2, el, S / 2, S / 2, r); s.S = S; C.set(key, s); } g.drawImage(s, x - s.S / 2, y - s.S / 2, s.S, s.S); }; })();
