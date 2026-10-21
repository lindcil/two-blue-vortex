// v0.8 — Carte « à la Pokémon » : le monde est découpé en sections de taille fixe (quartiers du village, extérieurs).
// Franchir une bordure = transition encre rapide, seule la section courante est active. Intérieurs/arènes = salles séparées
// (maison, porte de Konoha pour les missions, arène du rival, terrain d’entraînement, carte du mode Créatif).
(() => {
  const COLS = [0, 1600, 3200, 4800], ROWS_IN = [330, 1320, 2300], ROWS_OUT = [2300, 3350, 4400];
  const NAMES = [['Quartier des Hokage', 'Académie', 'Hauteurs Est'], ['Grand-rue', 'Place du marché', 'Quartier des clans'], ['Porte & route', 'Plaine', 'Bois de l’Est'], ['Forêt Ouest', 'Rivière', 'Collines']];
  const SECS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const y0 = r < 2 ? ROWS_IN[r] : ROWS_OUT[r - 2], y1 = r < 2 ? ROWS_IN[r + 1] : ROWS_OUT[r - 1]; SECS.push({ id: r * 3 + c, n: NAMES[r][c], x: COLS[c], y: r === 0 ? 0 : y0, w: COLS[c + 1] - COLS[c], h: y1 - (r === 0 ? 0 : y0) }); }
  const secAt = (x, y) => SECS.find((s) => x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) || SECS[0];
  // ---------- transition encre ----------
  const ink = document.createElement('canvas'); ink.id = 'ink8'; ink.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:30;pointer-events:none;display:none'; document.body.appendChild(ink);
  let busy = false; const wipe = (mid, label) => { if (busy) { mid(); return; } busy = true; ink.width = innerWidth; ink.height = innerHeight; ink.style.display = 'block'; const g = ink.getContext('2d'), W = ink.width, H = ink.height, t0 = performance.now(), D = 210; let swapped = false;
    const B = []; for (let i = 0; i < 9; i++) B.push([i / 9 * H + rnd(-10, 10), rnd(0.85, 1.15), rnd(0, 0.15)]);
    const step = () => { const t = (performance.now() - t0) / D; g.clearRect(0, 0, W, H); g.fillStyle = '#0b1020';
      for (const [y, s, d] of B) { const k = t < 1 ? Math.min(1, Math.max(0, (t - d) * 1.3)) : 1, out = t > 1 ? Math.min(1, Math.max(0, (t - 1 - d) * 1.3)) : 0; const x0 = out * W * 1.2 - 40, x1 = k * W * 1.2 * s; if (x1 <= x0) continue; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y - 8, x1, y + 4); g.lineTo(x1 - 30, y + H / 9 + 22); g.quadraticCurveTo((x0 + x1) / 2, y + H / 9 + 30, x0, y + H / 9 + 18); g.fill(); }
      if (t >= 1 && !swapped) { swapped = true; mid(); } if (t > 0.9 && t < 1.6 && label) { g.fillStyle = '#e8eefc'; g.font = `400 ${Math.round(H / 18)}px ${getComputedStyle(document.body).getPropertyValue('--f-title') || 'serif'}`; g.textAlign = 'center'; g.globalAlpha = Math.min(1, (1.6 - t) * 3); g.fillText(label, W / 2, H / 2); g.globalAlpha = 1; }
      if (t < 2.25) requestAnimationFrame(step); else { ink.style.display = 'none'; busy = false; } }; step(); };
  // ---------- salles ----------
  const RX = 20000; // les salles vivent hors de la carte extérieure
  const ROOMS = {
    maison: { n: 'Maison', x: RX, y: 400, w: 1100, h: 760, spawn: [RX + 550, 1080] },
    porte: { n: 'Grande porte de Konoha', x: RX, y: 1500, w: 2800, h: 1800, spawn: [RX + 1400, 3150] },
    arene: { n: 'Arène', x: RX + 3200, y: 400, w: 1700, h: 1200, spawn: [RX + 3200 + 600, 1100] },
    entrainement: { n: 'Terrain d’entraînement', x: RX + 3200, y: 1900, w: 1700, h: 1200, spawn: [RX + 3200 + 500, 2600] },
    creatif: { n: 'Dōjō des techniques', x: RX + 5300, y: 400, w: 2200, h: 1500, spawn: [RX + 5300 + 700, 1300] } };
  for (const k in ROOMS) ROOMS[k].id = k;
  const Z = window.ZONE8 = { SECS, ROOMS, sec: null, room: null, ret: null, wipe, secAt,
    bounds() { const r = this.room || this.sec; return r ? [r.x, r.y, r.x + r.w, r.y + r.h] : [0, 0, W * K10, H * K10]; },
    inside(u) { const [x0, y0, x1, y1] = this.bounds(); return u.x >= x0 - 40 && u.x <= x1 + 40 && u.y >= y0 - 40 && u.y <= y1 + 40; },
    enter(id, o = {}) { const R = ROOMS[id], h = Game.hero; if (!R || !h) return; const go = () => { if (!this.room) this.ret = { x: h.x, y: h.y }; this.room = R; const dx = R.spawn[0] - h.x, dy = R.spawn[1] - h.y; h.x = R.spawn[0]; h.y = R.spawn[1];
        for (const u of [...(o.bring || []), ...Game.allies, ...Game.clones]) { if (!u) continue; u.x += dx; u.y += dy; if (u.hx != null) { u.hx += dx; u.hy += dy; } if (u.leash) { u.leash[0] += dx; u.leash[1] += dy; } u.x = clamp(u.x, R.x + 40, R.x + R.w - 40); u.y = clamp(u.y, R.y + 360, R.y + R.h - 40); }
        Cam.x = h.x; Cam.y = h.y; Proj.length = 0; o.after && o.after(R); }; o.instant ? go() : wipe(go, R.n); },
    exit(o = {}) { if (!this.room) return; const h = Game.hero; const go = () => { const R = this.room; this.room = null; if (this.ret) { const dx = this.ret.x - h.x, dy = this.ret.y - h.y; h.x = this.ret.x; h.y = this.ret.y + 10; for (const u of [...Game.allies, ...Game.clones]) { u.x += dx; u.y += dy; } }
        World.foes_ = World.foes_.filter((f) => !(f.x >= R.x - 50 && f.x <= R.x + R.w + 50 && f.y >= R.y - 50 && f.y <= R.y + R.h + 50) || f.tag === 'yard'); for (const f of World.foes_) if (f.tag === 'yard' && f.hx > W * K10) { f.x = f.hx = f.ox8 || f.hx; f.y = f.hy = f.oy8 || f.hy; }
        this.sec = secAt(h.x, h.y); Cam.x = h.x; Cam.y = h.y; Proj.length = 0; o.after && o.after(); }; o.instant ? go() : wipe(go, this.sec ? secAt(this.ret ? this.ret.x : h.x, this.ret ? this.ret.y : h.y).n : ''); } };
  // ---------- caméra / collisions bornées à la section ou à la salle ----------
  window.camBounds = () => (Game.titleMode ? [0, 0, 3200, 3000] : Z.bounds());
  const col = World.collide.bind(World); World.collide = function (u) { if (Z.room && (u.x > W * K10 - 30 || Z.inside(u))) { const R = Z.room; u.x = clamp(u.x, R.x + 30, R.x + R.w - 30); u.y = clamp(u.y, R.y + (R.top || 330), R.y + R.h - 24); for (const s of R.solids || []) if (u.x > s.x && u.x < s.x + s.w && u.y > s.y && u.y < s.y + s.h) { const l = u.x - s.x, r = s.x + s.w - u.x, t = u.y - s.y, b = s.y + s.h - u.y, m = Math.min(l, r, t, b); if (m === l) u.x = s.x; else if (m === r) u.x = s.x + s.w; else if (m === t) u.y = s.y; else u.y = s.y + s.h; } return; } return col(u); };
  // les unités hors de la zone active sont « déchargées » (gelées)
  const fu = foeUpdate; foeUpdate = function (f, dt) { if (!Game.titleMode && Game.hero && !Z.inside(f)) return; return fu(f, dt); };
  const wf = World.foes.bind(World); World.foes = function () { const L = wf(); return Game.hero && !Game.titleMode && (Z.room || Z.sec) ? L.filter((f) => Z.inside(f)) : L; };
  // ---------- boucle : franchissement de bordure ----------
  const up = Game.update.bind(Game); Game.update = function (dt) { const r = up(dt); const h = this.hero; if (!h || !this.running || this.titleMode) return r;
    if (!Z.room) { if (!Z.sec) Z.sec = secAt(h.x, h.y); const s = Z.sec; if (!busy && (h.x < s.x - 2 || h.x > s.x + s.w + 2 || h.y < s.y - 2 || h.y > s.y + s.h + 2) && !this.cine) { const n = secAt(h.x, h.y); if (n !== s) { const keep = { x: h.x, y: h.y }; this.cine = true; wipe(() => { Z.sec = n; h.x = keep.x; h.y = keep.y; Cam.x = h.x; Cam.y = h.y; this.cine = false; }, n.n); } } }
    else if (Z.room.id === 'maison' && !busy && h.y > Z.room.y + Z.room.h - 40 && Math.abs(h.x - (Z.room.x + Z.room.w / 2)) < 90) Z.exit();
    door(h); rooms(h); return r; };
  // ---------- portes : maison & mission de la porte ----------
  let home = null; const findHome = () => { if (home) return home; const H2 = World.props.filter((p) => p.kind === 'house' && p.y < K10 * (WALL_Y - 100) && p.x < K10 * 1500).sort((a, b) => Math.hypot(a.x - K10 * 800, a.y - K10 * 1250) - Math.hypot(b.x - K10 * 800, b.y - K10 * 1250))[0]; home = H2 ? { x: H2.x, y: H2.y + 8 } : { x: K10 * 800, y: K10 * 1250 }; return home; };
  let useHit = 0, doorK = null; const tryDoor = () => { if (doorK === 'maison') { doorK = null; UI.prompt(null); Z.enter('maison'); return true; } if (doorK === 'porte') { doorK = null; UI.prompt(null); gateMission(); return true; } return false; };
  addEventListener('keydown', (e) => { const ks = (Save.set.keys && Save.set.keys.use) || ['KeyE']; if (!e.repeat && ks.includes(e.code) && doorK && !Talk.on && tryDoor()) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  addEventListener('touchstart', (e) => { if (e.target && e.target.dataset && e.target.dataset.a === 'use' && doorK && tryDoor()) e.stopImmediatePropagation(); }, { passive: true, capture: true });
  const GATE = { x: K10 * 1600, y: K10 * (WALL_Y + 40) + 40 }; let gateDone = 0;
  const door = (h) => { if (Z.room || Game.cine || Game.mode !== 'voie' || Game.creative) { doorK = null; return; } const hm = findHome();
    doorK = null; if (Math.hypot(h.x - hm.x, h.y - hm.y) < 60) { doorK = 'maison'; UI.prompt(`<kbd>${Input.label('use')}</kbd> Entrer chez toi`); return; }
    if (Math.hypot(h.x - GATE.x, h.y - GATE.y) < 90 && Voie.rank && !/^a/.test(Voie.step || 'a') && !Voie.mis && !gateDone) { doorK = 'porte'; UI.prompt(`<kbd>${Input.label('use')}</kbd> Mission : garder la grande porte`); return; } };
  const gateMission = () => { Z.enter('porte', { after: (R) => { const waves = [['bandit', 'bandit', 'bandit'], ['bandit', 'deserter', 'bandit', 'stormer'], ['rogue', 'bandit', 'deserter']]; let w = 0;
      const spawnW = () => { const L = waves[w]; L.forEach((t, i) => { const f = spawnFoe(t, R.x + 600 + i * 420, R.y + 700 + (i % 2) * 220, {}); f.aggro = true; }); UI.reward('Vague ' + (w + 1) + '/3', '#ff9a2a'); };
      spawnW(); const iv = setInterval(() => { if (Z.room !== R) { clearInterval(iv); return; } if (!World.foes().some((f) => f.hp > 0 && !f.passive)) { w++; if (w < waves.length) spawnW(); else { clearInterval(iv); gateDone = 1; Game.gainXp(300); if (Voie.me && Voie.me.tree) Voie.me.pts++; UI.reward('Porte défendue ! +1 point', '#ffd166', 1); setTimeout(() => Z.exit(), 2200); setTimeout(() => (gateDone = 0), 120000); } } }, 600); } }); };
  // ---------- arène du rival / terrain d’entraînement ----------
  const sr = Voie.spawnRival.bind(Voie); Voie.spawnRival = function () { const r = sr.apply(this, arguments); if (Game.mode === 'voie' && !Z.room) Z.enter('arene', { bring: [r], instant: false }); return r; };
  const yd = Voie.yard.bind(Voie); Voie.yard = function () { const had = World.foes_.some((f) => f.tag === 'yard'); const r = yd.apply(this, arguments); if (!had && !Z.room && Game.mode === 'voie') { const Y = World.foes_.filter((f) => f.tag === 'yard'); Y.forEach((f) => { f.ox8 = f.hx; f.oy8 = f.hy; }); Game.later(0.4, () => { if (!Z.room) Z.enter('entrainement', { bring: Y }); }); } return r; };
  const rooms = (h) => { if (!Z.room || busy || Talk.on || (window.Scene && Scene.on)) return; const id = Z.room.id;
    if (id === 'arene' && !World.foes_.some((f) => f.tag === 'rival' && !f.gone && !f.passive && f.hp > 0)) { Z.room.endT = (Z.room.endT || 0) + 0.016; if (Z.room.endT > 1.5) { Z.room.endT = 0; Z.exit(); } }
    if (id === 'entrainement' && !World.foes_.some((f) => f.tag === 'yard')) { Z.exit(); } };
  // ---------- dessin des salles (couche sol, avant les personnages) ----------
  const wood = (g, x, y, w, h, c1, c2) => { g.fillStyle = c1; g.fillRect(x, y, w, h); g.strokeStyle = c2; g.lineWidth = 2; for (let yy = y; yy < y + h; yy += 26) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); } };
  const tree = (g, x, y, s = 1) => { g.fillStyle = '#5a3a20'; g.fillRect(x - 8 * s, y - 40 * s, 16 * s, 46 * s); g.fillStyle = '#2f6b3a'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.arc(x, y - 70 * s, 44 * s, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#3e8a4a'; g.beginPath(); g.arc(x - 14 * s, y - 84 * s, 22 * s, 0, TAU); g.fill(); };
  const DRAW = {
    maison(g, R) { const { x, y, w, h } = R; g.fillStyle = '#3a2a22'; g.fillRect(x - 400, y - 400, w + 800, h + 800); g.fillStyle = '#e9dcc0'; g.fillRect(x, y, w, 330); g.strokeStyle = '#7a5a3a'; g.lineWidth = 6; for (let i = 0; i <= 6; i++) { g.beginPath(); g.moveTo(x + i * w / 6, y); g.lineTo(x + i * w / 6, y + 330); g.stroke(); } g.fillStyle = '#7a5a3a'; g.fillRect(x, y + 316, w, 18);
      g.fillStyle = '#9fd3ff'; g.fillRect(x + 160, y + 90, 200, 130); g.strokeStyle = '#5a3a20'; g.lineWidth = 8; g.strokeRect(x + 160, y + 90, 200, 130); g.beginPath(); g.moveTo(x + 260, y + 90); g.lineTo(x + 260, y + 220); g.moveTo(x + 160, y + 155); g.lineTo(x + 360, y + 155); g.stroke(); // fenêtre
      g.fillStyle = '#c8b48a'; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { g.fillRect(x + 20 + i * 270, y + 340 + j * 200, 260, 190); g.strokeStyle = '#3a5a2a'; g.lineWidth = 4; g.strokeRect(x + 20 + i * 270, y + 340 + j * 200, 260, 190); } // tatamis
      g.fillStyle = '#5a3a20'; g.fillRect(x + 640, y + 120, 260, 190); g.fillStyle = '#8a6a40'; for (let i = 0; i < 3; i++) g.fillRect(x + 650, y + 130 + i * 60, 240, 50); // étagère
      g.fillStyle = '#f4efe6'; g.fillRect(x + 470, y + 120, 100, 80); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(x + 470, y + 120, 100, 80); g.fillStyle = '#3a3a5a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 495 + i * 25, y + 160, 9, 0, TAU); g.fill(); } // photo d’équipe
      g.fillStyle = '#e6e0f0'; g.fillRect(x + 760, y + 420, 260, 140); g.fillStyle = '#4a6ad0'; g.fillRect(x + 760, y + 470, 260, 90); g.strokeStyle = INK; g.strokeRect(x + 760, y + 420, 260, 140); // futon
      g.fillStyle = '#6a4a2a'; g.beginPath(); g.ellipse(x + 400, y + 520, 120, 50, 0, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#f4efe6'; g.beginPath(); g.arc(x + 380, y + 510, 12, 0, TAU); g.arc(x + 420, y + 525, 10, 0, TAU); g.fill(); // table basse + tasses
      g.fillStyle = '#8a3a2a'; g.fillRect(x + w / 2 - 80, y + h - 50, 160, 40); g.fillStyle = '#e8eefc'; g.font = '700 16px system-ui'; g.textAlign = 'center'; g.fillText('▼ Sortie', x + w / 2, y + h - 24); },
    porte(g, R) { const { x, y, w, h } = R; g.fillStyle = '#5f9a4c'; g.fillRect(x - 600, y - 600, w + 1200, h + 1200); g.fillStyle = '#c9a56a'; g.fillRect(x + w / 2 - 170, y + 300, 340, h - 300); g.fillStyle = '#b8945a'; for (let i = 0; i < 40; i++) g.fillRect(x + w / 2 - 160 + (i * 73) % 320, y + 320 + i * 37 % (h - 340), 14, 6);
      g.fillStyle = '#d8c7a0'; g.fillRect(x, y, w, 300); g.strokeStyle = '#a89070'; g.lineWidth = 3; for (let i = 0; i < w; i += 60) { g.beginPath(); g.moveTo(x + i, y + 40); g.lineTo(x + i, y + 300); g.stroke(); } g.fillStyle = '#7a3a2a'; g.fillRect(x, y + 20, w, 28); // muraille
      const gx = x + w / 2; g.fillStyle = '#2e7d4a'; g.fillRect(gx - 260, y - 40, 50, 360); g.fillRect(gx + 210, y - 40, 50, 360); g.fillStyle = '#3b9a5d'; g.fillRect(gx - 300, y - 70, 600, 60); g.fillStyle = '#245f39'; g.fillRect(gx - 320, y - 90, 640, 26); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(gx - 300, y - 70, 600, 60);
      g.fillStyle = '#f4efe6'; g.font = '700 40px serif'; g.textAlign = 'center'; g.fillText('阿', gx - 235, y + 200); g.fillText('吽', gx + 235, y + 200); g.fillStyle = '#e8d070'; g.font = '700 30px serif'; g.fillText('火', gx, y - 30);
      g.fillStyle = '#4a3a2a'; g.fillRect(gx - 210, y + 40, 420, 270); g.fillStyle = '#6a4a2a'; g.fillRect(gx - 200, y + 50, 195, 255); g.fillRect(gx + 5, y + 50, 195, 255); // portes ouvertes
      g.fillStyle = '#8a6a40'; g.fillRect(gx + 340, y + 360, 220, 120); g.fillStyle = '#3b9a5d'; g.fillRect(gx + 330, y + 340, 240, 30); g.fillStyle = '#e8eefc'; g.font = '700 16px system-ui'; g.fillText('Poste de garde', gx + 450, y + 430); // poste de garde
      for (let i = 0; i < 6; i++) { const lx = gx - 220 + (i % 2) * 440, ly = y + 420 + Math.floor(i / 2) * 420; g.fillStyle = '#5a3a20'; g.fillRect(lx - 4, ly - 60, 8, 60); g.fillStyle = '#ffb13d'; g.beginPath(); g.arc(lx, ly - 66, 12, 0, TAU); g.fill(); }
      for (let i = 0; i < 4; i++) { g.fillStyle = '#d0283a'; g.fillRect(x + 300 + i * 650, y + 60, 40, 180); g.fillStyle = '#f4efe6'; g.font = '700 22px serif'; g.fillText('忍', x + 320 + i * 650, y + 160); }
      for (let i = 0; i < 26; i++) tree(g, x + (i % 2 ? 60 : w - 60) + rnd(-1, 1) * 0, y + 380 + Math.floor(i / 2) * 120, 1.1); },
    arene(g, R) { const { x, y, w, h } = R; g.fillStyle = '#6a5a48'; g.fillRect(x - 600, y - 600, w + 1200, h + 1200); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#8a7a68' : '#7a6a58'; g.fillRect(x - 200, y + i * 50, w + 400, 50); } g.fillStyle = '#3a3a4a'; for (let i = 0; i < 140; i++) { g.beginPath(); g.arc(x - 180 + (i * 37) % (w + 360), y + 20 + (i % 6) * 50, 9, 0, TAU); g.fill(); } // gradins + public
      g.fillStyle = '#c9b38a'; g.beginPath(); g.ellipse(x + w / 2, y + 760, w / 2 - 40, 420, 0, 0, TAU); g.fill(); g.strokeStyle = '#7a6a48'; g.lineWidth = 10; g.stroke(); g.strokeStyle = 'rgba(120,100,70,.5)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x + w / 2, y + 760, 200, 90, 0, 0, TAU); g.stroke();
      g.fillStyle = '#d0283a'; g.fillRect(x + w / 2 - 120, y + 300, 240, 30); g.fillStyle = '#f4efe6'; g.font = '700 22px serif'; g.textAlign = 'center'; g.fillText('中忍', x + w / 2, y + 323); },
    entrainement(g, R) { const { x, y, w, h } = R; g.fillStyle = '#6fae5a'; g.fillRect(x - 600, y - 600, w + 1200, h + 1200); g.fillStyle = '#c9a56a'; g.beginPath(); g.ellipse(x + w / 2, y + 760, 560, 300, 0, 0, TAU); g.fill();
      for (let i = 0; i < 3; i++) { const px = x + w / 2 - 200 + i * 200, py = y + 520; g.fillStyle = '#7a5a3a'; g.fillRect(px - 14, py - 110, 28, 120); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(px - 14, py - 110, 28, 120); g.strokeStyle = '#3a2a1a'; g.beginPath(); g.moveTo(px - 14, py - 60); g.lineTo(px + 14, py - 50); g.stroke(); } // poteaux
      for (let i = 0; i < 3; i++) { const tx = x + 200 + i * 120, ty = y + 450; g.fillStyle = '#f4efe6'; g.beginPath(); g.arc(tx, ty - 60, 30, 0, TAU); g.fill(); g.fillStyle = '#d0283a'; g.beginPath(); g.arc(tx, ty - 60, 18, 0, TAU); g.fill(); g.fillStyle = '#f4efe6'; g.beginPath(); g.arc(tx, ty - 60, 7, 0, TAU); g.fill(); g.fillStyle = '#5a3a20'; g.fillRect(tx - 4, ty - 30, 8, 40); } // cibles
      g.strokeStyle = '#8a6a40'; g.lineWidth = 6; g.beginPath(); g.moveTo(x + 40, y + 360); g.lineTo(x + w - 40, y + 360); g.stroke(); for (let i = 0; i < 20; i++) { g.beginPath(); g.moveTo(x + 40 + i * (w - 80) / 19, y + 330); g.lineTo(x + 40 + i * (w - 80) / 19, y + 370); g.stroke(); }
      for (let i = 0; i < 10; i++) tree(g, x + 80 + i * 170, y + 330, 0.9); },
    creatif(g, R) { const { x, y, w, h } = R; g.fillStyle = '#141a30'; g.fillRect(x - 800, y - 800, w + 1600, h + 1600); g.fillStyle = '#1d2646'; g.fillRect(x, y + 300, w, h - 300); g.strokeStyle = 'rgba(143,211,255,.12)'; g.lineWidth = 1; for (let i = 0; i < w; i += 80) { g.beginPath(); g.moveTo(x + i, y + 300); g.lineTo(x + i, y + h); g.stroke(); } for (let j = 300; j < h; j += 80) { g.beginPath(); g.moveTo(x, y + j); g.lineTo(x + w, y + j); g.stroke(); }
      g.fillStyle = '#0e1326'; g.fillRect(x, y, w, 300); g.fillStyle = '#a46bff'; g.font = '400 48px serif'; g.textAlign = 'center'; g.globalAlpha = 0.5; g.fillText('術', x + w / 2, y + 200); g.globalAlpha = 1; g.strokeStyle = 'rgba(164,107,255,.4)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x + w / 2 + 300, y + 1000, 360, 160, 0, 0, TAU); g.stroke(); },
  };
  FX.custom({ x: 0, y: 0, life: 1e9, ground: 1, draw: (g) => { for (const k in ROOMS) { const R = ROOMS[k]; if (Z.room === R || (window.CREA8 && CREA8.on && k === 'creatif')) { g.save(); DRAW[k](g, R); g.restore(); } }
    // Iruka dessiné au terrain d’entraînement
    if (Z.room && Z.room.id === 'entrainement' && Voie.iruka) { const I = Voie.iruka; const sx = I.x, sy = I.y; I.x = Z.room.x + 300; I.y = Z.room.y + 700; I.face = 1; try { drawRig(g, I); } catch (e) {} I.x = sx; I.y = sy; } } });
  // objets solides des salles
  ROOMS.maison.solids = [{ x: RX + 640, y: 400 + 330, w: 260, h: 10 }, { x: RX + 280, y: 400 + 480, w: 240, h: 80 }];
  ROOMS.porte.top = 340; ROOMS.arene.top = 380; ROOMS.entrainement.top = 380; ROOMS.creatif.top = 330;
  ROOMS.maison.top = 340;
  // reprise de partie : remettre le héros sur la carte extérieure
  const sv = Game.startVoie.bind(Game); Game.startVoie = function () { Z.room = null; Z.sec = null; const r = sv.apply(this, arguments); if (this.hero && (this.hero.x >= 20000 || this.hero.x < K10 * 300)) { this.hero.x = K10 * 2250; this.hero.y = K10 * 900; } return r; };
  const st = Game.start.bind(Game); Game.start = function () { Z.room = null; Z.sec = null; return st.apply(this, arguments); };
})();
