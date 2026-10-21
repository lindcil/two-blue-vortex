// v0.9.7 — Cartes extérieures ×10 en surface (échelle linéaire K10 = √10) : décor, collisions, lumières, sections et PNJ agrandis.
// Les bâtiments ne sont plus jamais coupés par une bordure de section. Saut d'arbre en arbre (ESPACE pendant la course ninja).
(() => {
  const K = K10;
  // ---------- 1) après construction : on recale les bâtiments dans une seule section, puis on agrandit tout ----------
  let SEC0 = null; const secsLogical = () => { const Z = window.ZONE8; if (!Z) return null; if (!SEC0) { SEC0 = Z.SECS.map((s) => ({ ...s }));
      // la bordure nord/sud passe sous le mur d'enceinte (le mur et la porte restent entiers dans une seule section)
      for (const s of SEC0) { if (s.y === WALL_Y) { s.y = WALL_Y + 120; s.h -= 120; } else if (s.y + s.h === WALL_Y) s.h += 120; } }
    return SEC0; };
  const BUILD_KINDS = { house: 1, tent: 1, torii: 1, field: 1, pillar: 1, bridge: 0 };
  const extent = (p) => p.kind === 'house' ? [p.w / 2 + 14, p.h + 30, 18] : p.kind === 'field' ? [240, 140, 140] : p.kind === 'torii' ? [70, 140, 10] : [60, 80, 12];
  const fixCuts = (W0) => { const S = secsLogical(); if (!S) return 0; let moved = 0;
    for (const p of W0.props) { if (!BUILD_KINDS[p.kind] || p.x == null) continue; const [hw, up, dn] = extent(p); const s = S.find((s) => p.x >= s.x && p.x < s.x + s.w && p.y >= s.y && p.y < s.y + s.h); if (!s) continue;
      const nx = Math.min(Math.max(p.x, s.x + hw + 8), s.x + s.w - hw - 8), ny = Math.min(Math.max(p.y, s.y + up + 8), s.y + s.h - dn - 8); if (nx === p.x && ny === p.y) continue;
      const dx = nx - p.x, dy = ny - p.y; if (p.kind === 'house') for (const so of W0.solids) if (Math.abs(so.x - (p.x - p.w / 2)) < 0.5 && Math.abs(so.y - (p.y - p.h)) < 0.5) { so.x += dx; so.y += dy; }
      for (const q of W0.pois) if (Math.hypot(q.x - p.x, q.y - p.y) < 60) { q.x += dx; q.y += dy; } p.x = nx; p.y = ny; moved++; }
    return moved; };
  World.cuts = () => { const Z = window.ZONE8; if (!Z) return []; const out = []; for (const p of World.props) { if (!BUILD_KINDS[p.kind] || p.lx == null) continue; const [hw, up, dn] = extent(p).map((v) => v * K);
      for (const s of Z.SECS) { const inX = p.x - hw < s.x + s.w && p.x + hw > s.x, inY = p.y - up < s.y + s.h && p.y + dn > s.y; const inside = p.x - hw >= s.x && p.x + hw <= s.x + s.w && p.y - up >= s.y && p.y + dn <= s.y + s.h; if (inX && inY && !inside) { out.push([p.kind, p.label || '', Math.round(p.x), Math.round(p.y), s.n]); break; } } } return out; };
  const scaleWorld = (W0) => { const Z = window.ZONE8, S = secsLogical();
    for (const p of W0.props) { p.lx = p.x; p.ly = p.y; if (p.x != null) p.x *= K; if (p.y != null) p.y *= K; }
    for (const s of W0.solids) { s.x *= K; s.y *= K; s.w *= K; s.h *= K; }
    for (const l of W0.lights) { l.x *= K; l.y *= K; l.r *= K; } for (const q of W0.pois) { q.x *= K; q.y *= K; }
    if (Z && S) Z.SECS.forEach((s, i) => { const o = S[i]; s.x = o.x * K; s.y = o.y * K; s.w = o.w * K; s.h = o.h * K; });
    // forêt plus dense pour les sauts d'arbre (hors bâtiments et routes)
    const R = mulberry(1010); let add = 0; for (let i = 0; i < 900 && add < 420; i++) { const x = (40 + R() * 4720) * K, y = (360 + R() * 4000) * K; const lx = x / K, ly = y / K;
      if (Math.abs(lx - 1600) < 110 || Math.abs(ly - 960) < 90 || Math.abs(ly - 1580) < 90) continue; if (lx > 500 && lx < 2800 && ly > 420 && ly < 2300 && R() < 0.85) continue;
      if (W0.solids.some((s) => x > s.x - 120 && x < s.x + s.w + 120 && y > s.y - 120 && y < s.y + s.h + 160)) continue; if (window.ZONES07 && ZONES07.some((z) => z.water && Math.hypot((lx - z.x) / z.rx, (ly - z.y) / z.ry) < 1.15)) continue;
      const s0 = 0.9 + R() * 0.7; W0.props.push({ kind: 'tree', x, y, lx, ly, s: s0 }); W0.solids.push({ x: x - 10 * K, y: y - 10 * K, w: 20 * K, h: 14 * K }); add++; }
    W0.trees10 = W0.props.filter((p) => p.kind === 'tree'); W0.k10 = 1; };
  const bd = World.build.bind(World); World.build = function () { const r = bd(); if (!Game.titleMode && window.ZONE8) { this.moved10 = fixCuts(this); scaleWorld(this); } else this.k10 = 0; return r; };
  // ---------- 2) dessin : décor et sol dessinés en coordonnées logiques sous une échelle K ----------
  const dp = World.drawProp.bind(World); World.drawProp = function (g, p) { if (!this.k10 || p.lx === undefined) return dp(g, p); const x = p.x, y = p.y; p.x = p.lx; p.y = p.ly; g.save(); g.scale(K, K); try { dp(g, p); } finally { g.restore(); p.x = x; p.y = y; } };
  const dg = World.drawGround.bind(World); World.drawGround = function (g) { if (!this.k10 || !this.ground) return dg(g); const vw = innerWidth, vh = innerHeight, z = Math.max(0.3, clamp(vw / 1150, 0.62, 1.25) * Cam.z), s = this.gsc;
    const x0 = Math.max(0, (Cam.x - vw / 2 / z - 100) / K), y0 = Math.max(0, (Cam.y - vh / 2 / z - 100) / K), x1 = Math.min(W, (Cam.x + vw / 2 / z + 100) / K), y1 = Math.min(H, (Cam.y + vh / 2 / z + 100) / K);
    if (x1 > x0 && y1 > y0) { g.save(); g.scale(K, K); g.drawImage(this.ground, x0 * s, y0 * s, (x1 - x0) * s, (y1 - y0) * s, x0, y0, x1 - x0, y1 - y0); g.restore(); }
    for (const h of this.hazards) { g.globalAlpha = 0.5 * (1 - h.t / h.life) + 0.2; g.fillStyle = elc(h.el); g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r * 0.5, 0, 0, TAU); g.fill(); g.globalAlpha = 1; } };
  const cl0 = World.collide.bind(World); World.collide = function (u) { if (!this.k10 || (window.ZONE8 && ZONE8.room) || u.x > W * K + 200) return cl0(u); if (u.x < 20) u.x = 20; if (u.y < 340 * K) u.y = 340 * K; if (u.x > W * K - 20) u.x = W * K - 20; if (u.y > H * K - 20) u.y = H * K - 20;
    for (const s of this.solids) { if (u.x + u.r < s.x || u.x - u.r > s.x + s.w || u.y < s.y || u.y - u.r * 0.5 > s.y + s.h) continue; const dl = u.x + u.r - s.x, dr = s.x + s.w - (u.x - u.r), dt = u.y - s.y, db = s.y + s.h - (u.y - u.r * 0.5); const m = Math.min(dl, dr, dt, db); if (m === dl) u.x -= dl; else if (m === dr) u.x += dr; else if (m === dt) u.y -= dt; else u.y += db; } };
  if (Save.set && Save.set.keys && !Save.set.keys.jump10) Save.set.keys.jump10 = ['Space'];
  // ---------- 3) les alliés suivent malgré la vitesse ----------
  const up0 = Game.update.bind(Game); Game.update = function (dt) { const r = up0(dt); const h = this.hero; if (h && World.k10 && window.ZONE8 && !ZONE8.room && !this.titleMode) { for (const a of this.allies) if (!a.down && Math.hypot(a.x - h.x, a.y - h.y) > 900) { a.x = h.x - h.face * 60; a.y = h.y + 20; FX.smoke(a.x, a.y - 20, 4); } TREE10.update(h, dt); } return r; };
  // ---------- 4) saut d'arbre en arbre ----------
  const TREE10 = window.TREE10 = { jump: null, cd: 0, range: [180, 760], dur: 0.42, arc: 150,
    pick(h) { const T = World.trees10 || []; const a = Math.hypot(h.vx, h.vy) > 40 ? Math.atan2(h.vy, h.vx) : (h.face < 0 ? Math.PI : 0); let best = null, bs = -1e9;
      for (const t of T) { const dx = t.x - h.x, dy = t.y - h.y, d = Math.hypot(dx, dy); if (d < this.range[0] || d > this.range[1]) continue; const da = Math.abs(((Math.atan2(dy, dx) - a + Math.PI * 3) % TAU) - Math.PI); if (da > 0.6) continue; const sc = -da * 400 - Math.abs(d - 480) * 0.4; if (sc > bs) { bs = sc; best = t; } }
      return best || { x: h.x + Math.cos(a) * 420, y: h.y + Math.sin(a) * 300, none: 1 }; },
    start(h) { const t = this.pick(h); const tx = t.x + (t.none ? 0 : -Math.sign(t.x - h.x || 1) * 0), ty = t.y + (t.none ? 0 : 12); this.jump = { x0: h.x, y0: h.y, x1: tx, y1: ty, t: 0, dur: this.dur * (0.8 + Math.hypot(tx - h.x, ty - h.y) / 1500), tree: t.none ? null : t, gh: 0 };
      h.face = tx < h.x ? -1 : 1; h.iframe = Math.max(h.iframe || 0, 0.25); h.sq = 0.35; FX.dust(h.x, h.y, 12); Cam.shake(0.08); Cam.tz = 0.78; try { Sfx.play('dodge'); } catch (e) {} },
    update(h, dt) { this.cd = Math.max(0, this.cd - dt); const J = this.jump;
      if (!J) { if (h.ninjaRun && !h.act && this.cd <= 0 && (Input.pressed('jump10') || Input.pressed('dodge') && Input.is('jump10'))) this.start(h); if (h.jz) h.jz = Math.max(0, h.jz - dt * 600); return; }
      J.t += dt; const q = Math.min(1, J.t / J.dur), e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; h.x = J.x0 + (J.x1 - J.x0) * e; h.y = J.y0 + (J.y1 - J.y0) * e; h.jz = Math.sin(q * Math.PI) * this.arc * (0.7 + Math.hypot(J.x1 - J.x0, J.y1 - J.y0) / 1600); h.vx = (J.x1 - J.x0) / J.dur * 0.6; h.vy = (J.y1 - J.y0) / J.dur * 0.6; h.runT = Math.max(h.runT || 0, 1.7); h.ninjaRun = true;
      J.gh -= dt; if (J.gh <= 0) { J.gh = Save.set.rf ? 0.05 : 0.03; const s = { ...h, y: h.y, P: poseOf(h), jz: h.jz }; FX.custom({ x: h.x, y: h.y, life: 0.25, draw: (g, p, qq) => { g.save(); g.globalAlpha = 0.4 * (1 - qq); g.translate(0, -s.jz); try { drawRig(g, s, '#8fd3ff'); } catch (e) {} g.restore(); } }); }
      if (Math.random() < 0.7) { const L = 60 + Math.random() * 80, yy = h.y - h.jz - 20 - Math.random() * 60, a = Math.atan2(J.y1 - J.y0, J.x1 - J.x0) + Math.PI; FX.custom({ x: h.x, y: yy, life: 0.2, draw: (g, p, qq) => { g.save(); g.globalAlpha = 0.6 * (1 - qq); g.strokeStyle = '#e6f6ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + Math.cos(a) * L, p.y + Math.sin(a) * L); g.stroke(); g.restore(); } }); }
      Cam.tz = 0.74 + 0.04 * Math.cos(q * Math.PI * 2);
      if (q >= 1) { this.jump = null; this.cd = 0.08; h.jz = 0; h.land10 = Game.t; h.sq = -0.32; FX.dust(h.x, h.y, 14); if (J.tree) { for (let i = 0; i < 8; i++) FX.add({ k: 'sp', spr: 'leaf', c: '#7fbf5a', x: J.tree.x + rnd(-40, 40) * J.tree.s * K, y: J.tree.y - rnd(60, 160) * J.tree.s, vx: rnd(-80, 80), vy: rnd(-40, 60), s: 4 + Math.random() * 3, life: 0.8, add: 0 }); } Cam.shake(0.1); Cam.tz = 0.84; } } };
  // pose d'atterrissage et hauteur du saut (rendu)
  const po = poseOf; poseOf = function (u) { const P = po(u); if (u && u.isHero && TREE10.jump) { const q = TREE10.jump.t / TREE10.jump.dur; return { ...P, lean: 0.9, sx: 1.2, sy: 0.82, aF: -1.9, aB: -1.7, eF: 0.2, eB: 0.2, hF: q < 0.5 ? 1.5 : 0.7, kF: q < 0.5 ? -2.2 : -0.6, hB: q < 0.5 ? 0.9 : -0.8, kB: q < 0.5 ? -2.0 : -0.6, head: -0.1, rot: 0.15 * u.face * (q - 0.5) }; }
    if (u && u.land10 != null && Game.t - u.land10 < 0.22) { const k = (Game.t - u.land10) / 0.22; return mixP({ ...P, by: 8, sy: 0.78, sx: 1.18, hF: 1.2, kF: -1.8, hB: -1.0, kB: -1.6, aF: 0.4, aB: -0.6, lean: 0.5 }, P, k); } return P; };
  const dr = drawRig; drawRig = function (g, u, tint) { if (!u || !u.jz) return dr(g, u, tint); g.save(); g.translate(0, -u.jz); try { dr(g, u, tint); } finally { g.restore(); } if (!tint) { g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(u.x, u.y, 18, 6, 0, 0, TAU); g.fill(); } };
})();
