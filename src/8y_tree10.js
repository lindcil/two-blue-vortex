// v0.9.8 — Constellation refaite : plus d'image d'impact. Transition douce (zoom sur le héros → iris d'étoiles → espace mental),
// vide cosmique en parallaxe avec nébuleuses dérivantes, chaque branche est une constellation d'étoiles reliées par des lignes lumineuses.
// Survol, zoom (molette/pincement), déplacement (glisser), animation de déblocage. Peu de texte.
(() => { const T8 = window.TREE8; if (!T8 || !T8.UI) return; const { BR, MAXR } = T8, TAU = Math.PI * 2;
  const css = document.createElement('style'); css.textContent = `#tree10{position:fixed;inset:0;z-index:41;display:none;background:transparent;touch-action:none}#tree10 canvas{position:absolute;inset:0;width:100%;height:100%}
#tree10 .pt{position:absolute;right:18px;top:14px;color:#ffd166;font:700 16px var(--f-body);letter-spacing:.06em;text-shadow:0 0 10px rgba(255,209,102,.5)}#tree10 .x{position:absolute;left:14px;top:12px;font:700 14px var(--f-body);background:rgba(14,22,48,.6);color:#e8eefc;border:1px solid rgba(160,180,255,.25);border-radius:10px;padding:6px 10px;cursor:pointer}
#tree10 .tip{position:absolute;pointer-events:none;display:none;background:rgba(8,12,30,.82);border:1px solid rgba(160,180,255,.25);border-radius:10px;padding:6px 10px;color:#e8eefc;font:600 13px var(--f-body);backdrop-filter:blur(4px);transition:opacity .15s}#tree8,#mind8{display:none!important}`;
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'tree10'; box.innerHTML = '<canvas></canvas><div class="pt"></div><button class="x">✕</button><div class="tip"></div>'; document.body.appendChild(box);
  const cv = box.querySelector('canvas'), tip = box.querySelector('.tip'), ptEl = box.querySelector('.pt'); let W = 0, H = 0, dpr = 1, raf = 0;
  const R = mulberry(4242); const L1 = [], L2 = [], L3 = []; for (let i = 0; i < 260; i++) L1.push([R() * 2 - 0.5, R() * 2 - 0.5, 0.5 + R() * 0.8, R() * 6]); for (let i = 0; i < 120; i++) L2.push([R() * 2 - 0.5, R() * 2 - 0.5, 0.8 + R() * 1.2, R() * 6]); for (let i = 0; i < 40; i++) L3.push([R() * 2 - 0.5, R() * 2 - 0.5, 1.4 + R() * 1.6, R() * 6]);
  const NEB = [['#5b2a9a', 0.2, 0.3, 0.55], ['#1f4aa8', 0.75, 0.25, 0.5], ['#a8326b', 0.65, 0.78, 0.45], ['#1d7a8a', 0.25, 0.75, 0.5], ['#3a2a8a', 0.5, 0.5, 0.7]].map(([c, x, y, r], i) => { const s = document.createElement('canvas'); s.width = s.height = 256; const g = s.getContext('2d'); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, c + 'aa'); gr.addColorStop(0.45, c + '44'); gr.addColorStop(1, c + '00'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return { s, x, y, r, ph: i * 1.7 }; });
  // formes de constellations (unités normalisées ~[-1,1])
  const SH = { spiral: (i) => { const a = i * 0.7, r = 0.3 + i * 0.066; return [Math.cos(a) * r, Math.sin(a) * r]; }, lotus: (i) => { const a = -Math.PI / 2 + i / MAXR * TAU, r = 0.55 + 0.45 * Math.abs(Math.cos(a * 2.5)); return [Math.cos(a) * r, Math.sin(a) * r * 0.85]; },
    eye: (i) => { if (i < 10) { const a = i / 10 * TAU; return [Math.cos(a), Math.sin(a) * 0.42 * (Math.sin(a) > 0 ? 1 : 1)]; } return [(i - 10.5) * 0.22, 0]; }, star: (i) => { const k = (i * 2) % 5, a = -Math.PI / 2 + k * TAU / 5 + (i >= 5 ? Math.PI / 5 : 0), r = i < 5 ? 1 : i < 10 ? 0.45 : 0.15 * (i - 9); return [Math.cos(a) * r, Math.sin(a) * r]; },
    wave: (i) => [-1 + i / (MAXR - 1) * 2, Math.sin(i * 0.9) * 0.45], fan: (i) => { const a = -Math.PI * 0.85 + (i % 6) / 5 * Math.PI * 0.7, r = i < 6 ? 1 : 0.5; return [Math.cos(a) * r, Math.sin(a) * r + 0.4]; }, bolt: (i) => { const P = [[-0.3, -1], [0.25, -0.55], [-0.15, -0.3], [0.45, 0.15], [0, 0.35], [0.5, 1]]; const t = i / (MAXR - 1) * (P.length - 1), k = Math.min(P.length - 2, Math.floor(t)), f = t - k; return [P[k][0] + (P[k + 1][0] - P[k][0]) * f, P[k][1] + (P[k + 1][1] - P[k][1]) * f]; } };
  let nodes = [], cam = { x: 0, y: 0, z: 1, tx: 0, ty: 0, tz: 1 }, hover = null, hk = new Map(), fx = [], phase = 'off', t0 = 0, drag = null, from = { x: 0, y: 0 };
  const layout = () => { nodes = []; const Rr = 430; BR.forEach((b, bi) => { const a = -Math.PI / 2 + bi / BR.length * TAU, ox = Math.cos(a) * Rr, oy = Math.sin(a) * Rr * 0.82, S = 145, f = SH[b.shape] || SH.wave; b.cx = ox; b.cy = oy; for (let i = 0; i < MAXR; i++) { const [x, y] = f(i); nodes.push({ b, i, x: ox + x * S, y: oy + y * S, tw: R() * 6 }); } }); };
  layout();
  const me = () => Voie.me, rk = (b) => (me().tree[b.id] || 0);
  const techAt = () => { const out = []; const m = me(); for (const id of T8.pool()) { const r = T8.req(id); if (!r || !Object.keys(r).length) continue; const main = Object.keys(r).sort((a, b) => r[b] - r[a])[0]; out.push({ id, main, rank: r[main], ok: m.known.includes(id) }); } return out; };
  const fit = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cam.tz = Math.min(W / 1250, H / 1050) * 1.0; if (phase !== 'on') cam.z = cam.tz * 0.6; };
  const toS = (x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];
  const toW = (sx, sy) => [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y];
  const ease = (k) => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  let last = 0, ta = [];
  const draw = (now) => { const g = cv.getContext('2d'), t = now / 1000, dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; if (!me()) return; const rf = Save.set.rf !== false;
    const el = (now - t0) / 1000, open = phase === 'opening' ? ease(Math.min(1, el / 0.9)) : phase === 'closing' ? 1 - ease(Math.min(1, el / 0.45)) : 1;
    if (phase === 'opening' && el >= 0.9) phase = 'on'; if (phase === 'closing' && el >= 0.45) { finishClose(); return; }
    const kk = 1 - Math.exp(-dt * 9); cam.x += (cam.tx - cam.x) * kk; cam.y += (cam.ty - cam.y) * kk; const zt = phase === 'on' ? cam.tz : cam.tz * (0.55 + 0.45 * open); cam.z += (zt - cam.z) * (phase === 'on' ? kk : 1);
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
    // iris : l'espace mental s'ouvre depuis la position du héros
    const rad = Math.hypot(W, H) * open; g.save(); g.beginPath(); g.arc(from.x, from.y, Math.max(1, rad), 0, TAU); g.clip(); g.fillStyle = '#03040b'; g.fillRect(0, 0, W, H);
    // nébuleuses dérivantes (parallaxe lente)
    g.globalCompositeOperation = 'lighter'; for (const n of NEB) { const px = (n.x * W) - cam.x * 0.08 * cam.z + Math.sin(t * 0.05 + n.ph) * 40, py = (n.y * H) - cam.y * 0.08 * cam.z + Math.cos(t * 0.04 + n.ph) * 30, r = n.r * Math.max(W, H) * (1 + 0.05 * Math.sin(t * 0.2 + n.ph)); g.globalAlpha = 0.55 * open; g.drawImage(n.s, px - r, py - r, r * 2, r * 2); }
    // étoiles en 3 couches (profondeur), étirées pendant l'ouverture (effet de vitesse)
    const warp = phase === 'opening' ? (1 - open) * 60 : 0;
    const layer = (L, f, col) => { g.fillStyle = col; g.strokeStyle = col; for (const [x, y, s, p] of L) { const sx = ((x * W - cam.x * f * cam.z) % (W * 1.5) + W * 1.5) % (W * 1.5) - W * 0.25, sy = ((y * H - cam.y * f * cam.z) % (H * 1.5) + H * 1.5) % (H * 1.5) - H * 0.25; g.globalAlpha = (0.35 + 0.65 * Math.abs(Math.sin(t * 0.7 + p))) * open;
      if (warp > 1) { const dx = sx - from.x, dy = sy - from.y, d = Math.hypot(dx, dy) || 1; g.lineWidth = s; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx - dx / d * warp * f * 6, sy - dy / d * warp * f * 6); g.stroke(); } else g.fillRect(sx, sy, s, s); } };
    layer(L1, 0.05, '#aab4e8'); layer(L2, 0.15, '#d8defc'); layer(L3, 0.3, '#ffffff');
    // constellations
    ta = techAt(); const m = me();
    for (const b of BR) { const r = rk(b), ns = nodes.filter((n) => n.b === b);
      // lignes : acquises lumineuses, à venir pointillées très discrètes, ligne en cours de tracé (déblocage)
      for (let i = 1; i < ns.length; i++) { const [x0, y0] = toS(ns[i - 1].x, ns[i - 1].y), [x1, y1] = toS(ns[i].x, ns[i].y), on = i < r; const an = fx.find((f) => f.b === b && f.i === i && f.k === 'line'); const q = an ? Math.min(1, an.t / 0.5) : 1;
        if (on || an) { g.globalAlpha = 0.35 * open; g.strokeStyle = b.c; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + (x1 - x0) * q, y0 + (y1 - y0) * q); g.stroke(); g.globalAlpha = 0.9 * open; g.strokeStyle = '#ffffff'; g.lineWidth = 1.4; g.stroke(); }
        else { g.globalAlpha = 0.2 * open; g.strokeStyle = '#b8c4ff'; g.lineWidth = 1; g.setLineDash([3, 6]); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.setLineDash([]); } }
      for (const n of ns) { const [sx, sy] = toS(n.x, n.y), on = n.i < r, nx = n.i === r, hv = hover === n ? 1 : 0; const h0 = hk.get(n) || 0, h1 = h0 + (hv - h0) * Math.min(1, dt * 14); hk.set(n, h1);
        const pul = on ? 1 + 0.18 * Math.sin(t * 2.4 + n.tw) : 1, rr = (on ? 5.5 : nx ? 4.5 : 2.6) * pul * (1 + h1 * 0.6) * Math.max(0.7, cam.z);
        if (on || nx) { g.globalAlpha = (on ? 0.7 : 0.35 + 0.25 * Math.sin(t * 3)) * open; g.drawImage(SPR9.get('glow', b.c), sx - rr * 5, sy - rr * 5, rr * 10, rr * 10); }
        g.globalAlpha = (on ? 1 : nx ? 0.9 : 0.4 + 0.15 * Math.sin(t + n.tw)) * open; g.fillStyle = on ? '#ffffff' : nx ? b.c : '#8f9ac8'; g.beginPath(); g.arc(sx, sy, rr, 0, TAU); g.fill();
        if (on) { g.globalAlpha = 0.6 * open; g.strokeStyle = '#ffffff'; g.lineWidth = 1; g.beginPath(); g.moveTo(sx - rr * 2.4, sy); g.lineTo(sx + rr * 2.4, sy); g.moveTo(sx, sy - rr * 2.4); g.lineTo(sx, sy + rr * 2.4); g.stroke(); }
        if (nx && m.pts) { g.globalAlpha = 0.8 * open; g.strokeStyle = b.c; g.lineWidth = 1.5; g.beginPath(); g.arc(sx, sy, rr + 7 + Math.sin(t * 4) * 2, 0, TAU); g.stroke(); }
        // techniques accrochées : petits glyphes satellites
        const tk = ta.filter((x) => x.main === b.id && x.rank === n.i + 1); tk.forEach((x, j) => { const a = -0.8 + j * 0.7, gx = sx + Math.cos(a) * (rr + 16), gy = sy + Math.sin(a) * (rr + 16); g.globalAlpha = (x.ok ? 0.95 : 0.35) * open; g.fillStyle = x.ok ? (elc(SK[x.id].el) || '#fff') : '#b8c4ff'; g.font = '700 ' + Math.round(11 + 3 * cam.z) + 'px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(x.ok ? SK[x.id].k : '·', gx, gy); }); }
      // nom de branche : discret, sous la constellation
      const [lx, ly] = toS(b.cx, b.cy + 160); g.globalAlpha = 0.75 * open; g.fillStyle = b.c; g.font = '400 ' + Math.round(12 + 4 * cam.z) + 'px ' + (getComputedStyle(document.body).getPropertyValue('--f-title') || 'serif'); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText(b.n, lx, ly); g.globalAlpha = 0.5 * open; g.font = '700 ' + Math.round(10 + 2 * cam.z) + 'px ' + getComputedStyle(document.body).fontFamily; g.fillText(r + ' / ' + MAXR, lx, ly + 16); }
    // centre : l'esprit du héros
    const [cx, cy] = toS(0, 0); g.globalAlpha = (0.5 + 0.1 * Math.sin(t * 1.5)) * open; g.drawImage(SPR9.get('glow', '#a46bff'), cx - 90 * cam.z, cy - 90 * cam.z, 180 * cam.z, 180 * cam.z); g.globalAlpha = 0.9 * open; g.drawImage(SPR9.get('core', '#d8c8ff'), cx - 14 * cam.z, cy - 14 * cam.z, 28 * cam.z, 28 * cam.z);
    // effets de déblocage
    for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; if (f.t > f.life) { fx.splice(i, 1); continue; } const q = f.t / f.life; if (f.k === 'line') continue; const [sx, sy] = toS(f.x, f.y);
      if (f.k === 'burst') { g.globalAlpha = (1 - q) * 0.9; g.strokeStyle = f.c; g.lineWidth = 3 * (1 - q); g.beginPath(); g.arc(sx, sy, 8 + q * 90 * cam.z, 0, TAU); g.stroke(); g.globalAlpha = (1 - q) * (rf ? 0.5 : 0.9); g.drawImage(SPR9.get('glow', f.c), sx - 60 * (1 - q * 0.5), sy - 60 * (1 - q * 0.5), 120 * (1 - q * 0.5), 120 * (1 - q * 0.5));
        for (const p of f.ps) { const d = ease(q) * p.d * cam.z; g.globalAlpha = 1 - q; g.fillStyle = '#ffffff'; g.fillRect(sx + Math.cos(p.a) * d, sy + Math.sin(p.a) * d, 2, 2); } } }
    g.restore();
    // bord de l'iris pendant la transition
    if (open < 1) { g.globalAlpha = 0.8 * (1 - open); g.strokeStyle = '#c8b8ff'; g.lineWidth = 2; g.beginPath(); g.arc(from.x, from.y, Math.max(1, rad), 0, TAU); g.stroke(); }
    g.globalAlpha = 1; box.style.opacity = phase === 'closing' ? String(Math.max(0, open * 1.4)) : '1'; ptEl.textContent = '✦ ' + m.pts;
    raf = requestAnimationFrame(draw); };
  // ---------- entrées : survol, clic, glisser, molette, pincement ----------
  const pick = (sx, sy) => { let best = null, bd = 22; for (const n of nodes) { const [x, y] = toS(n.x, n.y), d = Math.hypot(x - sx, y - sy); if (d < bd) { bd = d; best = n; } } return best; };
  const showTip = (n, sx, sy) => { if (!n) { tip.style.display = 'none'; return; } const b = n.b, r = rk(b), m = me(); const tk = ta.filter((x) => x.main === b.id && x.rank === n.i + 1); tip.style.display = 'block'; tip.style.left = Math.min(W - 200, sx + 16) + 'px'; tip.style.top = sy + 12 + 'px';
    tip.innerHTML = `<b style="color:${b.c}">${b.n} · ${n.i + 1}</b>${n.i < r ? ' ✓' : n.i === r ? (m.pts ? ' — clic' : '') : ' 🔒'}${tk.length ? '<br>' + tk.map((x) => x.ok ? SK[x.id].n : '?').join(' · ') : ''}`; };
  cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, cx: cam.tx, cy: cam.ty, moved: 0 }; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 6) drag.moved = 1; if (drag.moved) { cam.tx = drag.cx - dx / cam.z; cam.ty = drag.cy - dy / cam.z; } } hover = pick(e.clientX, e.clientY); showTip(hover, e.clientX, e.clientY); cv.style.cursor = hover ? 'pointer' : drag && drag.moved ? 'grabbing' : 'grab'; });
  cv.addEventListener('pointerup', (e) => { const d = drag; drag = null; if (d && !d.moved) { const n = pick(e.clientX, e.clientY); if (n) invest(n); } });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); const k = Math.exp(-e.deltaY * 0.0015), base = Math.min(W / 1250, H / 1050); const [wx, wy] = toW(e.clientX, e.clientY); cam.tz = Math.max(base * 0.6, Math.min(base * 3, cam.tz * k)); cam.tx = wx - (e.clientX - W / 2) / cam.tz; cam.ty = wy - (e.clientY - H / 2) / cam.tz; }, { passive: false });
  cv.addEventListener('dblclick', () => { cam.tx = cam.ty = 0; cam.tz = Math.min(W / 1250, H / 1050); });
  const invest = (n) => { const m = me(); if (n.i !== rk(n.b) || !m.pts) { if (n.i > rk(n.b)) { cam.tx = n.x; cam.ty = n.y; } return; } const ok = T8.invest(n.b.id); if (!ok) return; try { Sfx.play('pop'); } catch (e) {}
    const ps = []; for (let i = 0; i < 18; i++) ps.push({ a: Math.random() * TAU, d: 30 + Math.random() * 60 }); fx.push({ k: 'burst', x: n.x, y: n.y, c: n.b.c, t: 0, life: 0.9, ps }); if (n.i > 0) fx.push({ k: 'line', b: n.b, i: n.i, t: 0, life: 0.5 }); cam.tx += (n.x - cam.tx) * 0.25; cam.ty += (n.y - cam.ty) * 0.25; };
  // ---------- ouverture / fermeture ----------
  const finishClose = () => { phase = 'off'; box.style.display = 'none'; cancelAnimationFrame(raf); tip.style.display = 'none'; Game.paused = false; Game.cine = false; Cam.tz = 1; };
  const TUI = T8.UI; TUI.open = function () { if (this.on || Game.mode !== 'voie' || !Voie.me || !Voie.me.tree || Game.cine) return; this.on = true; const h = Game.hero; Game.cine = true; Cam.tz = 1.9;
    // position écran du héros pour l'iris
    const z = Math.min(1.25, Math.max(0.62, innerWidth / 1150)) * Cam.z; from = { x: innerWidth / 2 + (h.x - Cam.x) * z, y: innerHeight / 2 + (h.y - 50 - Cam.y) * z };
    setTimeout(() => { Game.paused = true; fit(); cam.x = cam.tx = 0; cam.y = cam.ty = 0; cam.z = cam.tz * 0.55; box.style.display = 'block'; box.style.opacity = '1'; phase = 'opening'; t0 = performance.now(); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }, 260); };
  TUI.close = function () { if (!this.on) return; this.on = false; phase = 'closing'; t0 = performance.now(); from = { x: innerWidth / 2, y: innerHeight / 2 - 20 }; };
  box.querySelector('.x').onclick = () => TUI.close();
  addEventListener('resize', () => { if (TUI.on) fit(); });
  window.TREE10UI = { cam, nodes, invest, get phase() { return phase; } };
})();
