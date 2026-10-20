/* ============ Monde : Konoha vivante ============ */
const W = 3200, H = 3000, WALL_Y = 2300;
const World = {
  time: 8, day: 1, props: [], solids: [], npcs: [], foes_: [], hazards: [], pois: [], ground: null, lights: [],
  foes() { return this.foes_.filter((f) => f.hp > 0 && !f.gone); },
  isNight() { return this.time >= 20 || this.time < 6; },
  dark() { const t = this.time; if (t >= 7 && t < 18) return 0; if (t >= 18 && t < 21) return (t - 18) / 3 * 0.62; if (t >= 21 || t < 5) return 0.62; return (7 - t) / 2 * 0.62; },
  build() {
    const R = mulberry(7); this.props = []; this.solids = []; this.pois = []; this.lights = [];
    const house = (x, y, w, h, roof, label) => { this.solids.push({ x: x - w / 2, y: y - h, w, h: h * 0.75 }); this.props.push({ kind: 'house', x, y, w, h, roof, label }); };
    // rocher des Hokage (falaise nord)
    this.solids.push({ x: 0, y: 0, w: W, h: 330 }); this.props.push({ kind: 'rock', x: 1600, y: 330 });
    // tour du Hokage, Académie, échoppes
    house(1600, 640, 260, 200, '#c0392b', 'Tour du Hokage'); house(2250, 640, 300, 170, '#2f6f8f', 'Académie');
    house(1290, 860, 150, 110, '#d35400', 'Ichiraku'); house(1930, 860, 150, 110, '#b05aa0', 'Fleurs Yamanaka'); house(1040, 1060, 160, 120, '#4f6d7a', 'Armurerie');
    for (let i = 0; i < 26; i++) { const x = 500 + R() * 2300, y = 1150 + R() * 1050; if (Math.abs(x - 1600) < 140 || Math.abs(y - 1500) < 70 || (x > 2500 && y < 1600)) continue; house(x, y, 120 + R() * 70, 90 + R() * 40, pick(['#7a3b2e', '#40566b', '#6b4f2a', '#355e4a']), null); }
    // mur d'enceinte avec la grande porte
    this.solids.push({ x: 0, y: WALL_Y, w: 1520, h: 40 }); this.solids.push({ x: 1680, y: WALL_Y, w: W - 1680, h: 40 }); this.props.push({ kind: 'wall', y: WALL_Y + 40 }); this.props.push({ kind: 'gate', x: 1600, y: WALL_Y + 40 });
    // arbres (forêt ouest, lisières, extérieur)
    for (let i = 0; i < 230; i++) { let x, y; const z = R(); if (z < 0.45) { x = R() * 480; y = 380 + R() * 2500; } else if (z < 0.7) { x = R() * W; y = WALL_Y + 80 + R() * 600; } else { x = 2700 + R() * 500; y = 1700 + R() * 600; } if (Math.hypot(x - 1600, y - 2700) < 260) continue; if (Math.hypot(x - 330, y - 1250) < 150 || Math.hypot(x - 380, y - 1900) < 150) continue; this.props.push({ kind: 'tree', x, y, s: 0.8 + R() * 0.6 }); this.solids.push({ x: x - 10, y: y - 10, w: 20, h: 14 }); }
    // lanternes (lumières la nuit)
    for (let x = 650; x < 2600; x += 190) for (const y of [960, 1580]) { this.props.push({ kind: 'lantern', x, y }); this.lights.push({ x, y: y - 40, r: 150 }); }
    for (let y = 700; y < 2250; y += 210) for (const x of [1490, 1710]) { this.props.push({ kind: 'lantern', x, y }); this.lights.push({ x, y: y - 40, r: 150 }); }
    // terrain d'entraînement : poteaux + mannequins à aura (on y apprend les réactions)
    this.props.push({ kind: 'field', x: 2850, y: 1250 }); for (let i = 0; i < 3; i++) this.props.push({ kind: 'post', x: 2760 + i * 90, y: 1180 });
    // lieux d'intérêt
    const poi = (id, x, y, n, ic) => this.pois.push({ id, x, y, n, ic });
    poi('ichiraku', 1290, 900, 'Ichiraku — bol de ramen (soin complet)', '麺'); poi('memorial', 2500, 1050, 'Stèle des héros', '碑'); poi('lookout', 1600, 360, 'Belvédère du rocher', '望');
    poi('field', 2850, 1250, 'Terrain d’entraînement', '練'); poi('shinju1', 330, 1250, 'Racines du Shinju', '樹'); poi('shinju2', 380, 1900, 'Racines du Shinju', '樹'); poi('camp', 1600, 2720, 'Camp de déserteurs', '賊');
    poi('scroll1', 640, 700, 'Parchemin : l’Omnipotence', '巻'); poi('scroll2', 2980, 820, 'Parchemin : les Marques de Griffe', '巻'); poi('chest1', 2500, 2000, 'Coffre', '箱'); poi('chest2', 900, 2150, 'Coffre', '箱');
    this.prerender(); },
  prerender() { const sc = Save.set.low ? 0.5 : 1; const c = document.createElement('canvas'); c.width = W * sc; c.height = H * sc; const g = c.getContext('2d'); g.scale(sc, sc); const R = mulberry(3);
    g.fillStyle = '#5d8a4e'; g.fillRect(0, 0, W, H); for (let i = 0; i < 2600; i++) { g.fillStyle = R() < 0.5 ? 'rgba(40,80,40,.18)' : 'rgba(130,170,90,.14)'; g.beginPath(); g.ellipse(R() * W, R() * H, 6 + R() * 26, 3 + R() * 10, 0, 0, TAU); g.fill(); }
    g.fillStyle = '#3d5f39'; g.fillRect(0, 0, 480, H); g.fillStyle = 'rgba(30,45,25,.35)'; g.fillRect(0, WALL_Y, W, H - WALL_Y);
    // routes
    g.strokeStyle = '#c9b08a'; g.lineCap = 'round'; g.lineWidth = 120; g.beginPath(); g.moveTo(560, 960); g.lineTo(2700, 960); g.moveTo(1600, 420); g.lineTo(1600, 2980); g.moveTo(560, 1580); g.lineTo(2600, 1580); g.moveTo(2400, 1580); g.lineTo(2850, 1250); g.stroke();
    g.strokeStyle = 'rgba(120,95,60,.25)'; g.lineWidth = 2; for (let i = 0; i < 400; i++) { const x = 560 + R() * 2140, y = 960 + rnd(-50, 50); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18, y + 2); g.stroke(); }
    // place centrale
    g.fillStyle = '#d6c09a'; g.beginPath(); g.ellipse(1600, 960, 260, 150, 0, 0, TAU); g.fill(); g.strokeStyle = '#a88d64'; g.lineWidth = 4; g.stroke();
    g.fillStyle = '#8fb3c9'; g.beginPath(); g.ellipse(1600, 960, 60, 34, 0, 0, TAU); g.fill();
    // rivière est
    g.strokeStyle = '#3f7fb5'; g.lineWidth = 70; g.beginPath(); g.moveTo(3200, 300); g.bezierCurveTo(2900, 900, 3150, 1500, 2950, 2300); g.lineTo(3000, 3000); g.stroke(); g.strokeStyle = 'rgba(200,230,255,.25)'; g.lineWidth = 6; g.stroke();
    // terrain d'entraînement
    g.fillStyle = '#b89e74'; g.beginPath(); g.ellipse(2850, 1250, 230, 130, 0, 0, TAU); g.fill();
    // zones du Shinju : racines qui crèvent le sol
    for (const [x, y] of [[330, 1250], [380, 1900]]) { g.fillStyle = 'rgba(40,20,40,.55)'; g.beginPath(); g.ellipse(x, y, 190, 110, 0, 0, TAU); g.fill(); g.strokeStyle = '#6b4a6e'; g.lineWidth = 9; for (let i = 0; i < 16; i++) { const a = R() * TAU; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * 90, y + Math.sin(a + 0.6) * 50, x + Math.cos(a) * 200, y + Math.sin(a) * 110); g.stroke(); } }
    // camp de déserteurs
    g.fillStyle = '#7d6a4f'; g.beginPath(); g.ellipse(1600, 2720, 230, 120, 0, 0, TAU); g.fill();
    this.ground = c; this.gsc = sc; },
  hazard(x, y, r, life, el) { this.hazards.push({ x, y, r, life, el, t: 0 }); },
  collide(u) { if (u.x < 20) u.x = 20; if (u.y < 340) u.y = 340; if (u.x > W - 20) u.x = W - 20; if (u.y > H - 20) u.y = H - 20;
    for (const s of this.solids) { if (u.x + u.r < s.x || u.x - u.r > s.x + s.w || u.y < s.y || u.y - u.r * 0.5 > s.y + s.h) continue; const dl = u.x + u.r - s.x, dr = s.x + s.w - (u.x - u.r), dt = u.y - s.y, db = s.y + s.h - (u.y - u.r * 0.5); const m = Math.min(dl, dr, dt, db); if (m === dl) u.x -= dl; else if (m === dr) u.x += dr; else if (m === dt) u.y -= dt; else u.y += db; } },
  update(dt) { this.time += dt / 20; if (this.time >= 24) { this.time -= 24; this.day++; }
    for (let i = this.hazards.length - 1; i >= 0; i--) { const h = this.hazards[i]; h.t += dt; if (h.t > h.life) { this.hazards.splice(i, 1); continue; } h.tick = (h.tick || 0) - dt; if (h.tick <= 0) { h.tick = 0.5; for (const f of this.foes()) if (Math.hypot(f.x - h.x, f.y - h.y) < h.r) hurt(f, 6, Game.hero, { el: h.el, k: 0 }); } }
    for (const n of this.npcs) npcUpdate(n, dt); },
  drawGround(g) { if (this.ground) g.drawImage(this.ground, 0, 0, W * this.gsc, H * this.gsc, 0, 0, W, H);
    for (const h of this.hazards) { g.globalAlpha = 0.5 * (1 - h.t / h.life) + 0.2; g.fillStyle = elc(h.el); g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r * 0.5, 0, 0, TAU); g.fill(); g.globalAlpha = 1; } },
  drawProp(g, p) { const night = this.dark() > 0.3;
    switch (p.kind) {
      case 'tree': { const s = p.s; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(p.x, p.y, 30 * s, 10 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#5a3d27'; g.fillRect(p.x - 5 * s, p.y - 40 * s, 10 * s, 40 * s); const sw = Math.sin(Game.t * 1.2 + p.x) * 2;
        for (const [ox, oy, r, c] of [[0, -70, 38, '#2f5a33'], [-18, -56, 26, '#3a6b3d'], [16, -60, 28, '#3f7543'], [sw, -86, 24, '#4c8a4c']]) { g.fillStyle = c; g.beginPath(); g.arc(p.x + ox * s, p.y + oy * s, r * s, 0, TAU); g.fill(); } break; }
      case 'house': { const { x, y, w, h } = p; g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - w / 2 + 8, y - 6, w, 14); g.fillStyle = '#e8dcc4'; g.fillRect(x - w / 2, y - h * 0.55, w, h * 0.55); g.fillStyle = '#3b2a1e'; g.fillRect(x - 14, y - 34, 28, 34);
        g.fillStyle = night ? '#ffcf7a' : '#6f8fa8'; g.fillRect(x - w / 2 + 14, y - h * 0.45, 22, 16); g.fillRect(x + w / 2 - 36, y - h * 0.45, 22, 16);
        g.fillStyle = p.roof; g.beginPath(); g.moveTo(x - w / 2 - 14, y - h * 0.55); g.lineTo(x - w / 2 + 10, y - h); g.lineTo(x + w / 2 - 10, y - h); g.lineTo(x + w / 2 + 14, y - h * 0.55); g.closePath(); g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x - w / 2 - 14, y - h * 0.58, w + 28, 6);
        if (p.label) { g.font = "400 15px 'TBV Ext', 'Lilita One', system-ui"; g.textAlign = 'center'; g.fillStyle = 'rgba(11,16,32,.75)'; const tw = g.measureText(p.label).width + 14; g.fillRect(x - tw / 2, y - h - 26, tw, 20); g.fillStyle = '#eef3ff'; g.fillText(p.label, x, y - h - 11); }
        if (p.label === 'Tour du Hokage') { g.fillStyle = '#eef3ff'; g.beginPath(); g.arc(x, y - h * 0.78, 22, 0, TAU); g.fill(); g.fillStyle = '#c0392b'; g.font = '700 26px serif'; g.fillText('火', x, y - h * 0.78 + 9); } break; }
      case 'rock': { g.fillStyle = '#8a7b6b'; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, 300); for (let x = W; x >= 0; x -= 80) g.lineTo(x, 300 + Math.sin(x * 0.03) * 22 + 20); g.closePath(); g.fill(); g.fillStyle = '#7a6b5c';
        for (let i = 0; i < 8; i++) { const fx = 960 + i * 170, fy = 170; g.fillStyle = i === 7 ? '#9a8a7a' : '#a5947f'; g.beginPath(); g.ellipse(fx, fy, 56, 72, 0, 0, TAU); g.fill(); g.fillStyle = '#5a4d40'; g.fillRect(fx - 26, fy - 10, 16, 6); g.fillRect(fx + 10, fy - 10, 16, 6); g.fillRect(fx - 12, fy + 26, 24, 5); if (i === 6) { g.fillStyle = '#5a4d40'; for (let k = -1; k <= 1; k += 2) for (let j = 0; j < 3; j++) g.fillRect(fx + k * 30, fy + j * 9, k * 16, 3); } }
        g.font = "400 15px 'TBV Ext', 'Lilita One', system-ui"; g.fillStyle = 'rgba(238,243,255,.7)'; g.textAlign = 'center'; g.fillText('Le Huitième n’a pas encore de visage.', 960 + 7 * 170, 270); break; }
      case 'wall': g.fillStyle = '#a3896a'; g.fillRect(0, WALL_Y, 1520, 40); g.fillRect(1680, WALL_Y, W - 1680, 40); g.fillStyle = '#7d6a52'; for (let x = 0; x < W; x += 40) if (x < 1520 || x > 1680) g.fillRect(x, WALL_Y, 3, 40); break;
      case 'gate': g.fillStyle = '#2e7d4a'; g.fillRect(1500, WALL_Y - 90, 20, 130); g.fillRect(1680, WALL_Y - 90, 20, 130); g.fillStyle = '#3b9a5d'; g.fillRect(1490, WALL_Y - 100, 220, 26); g.fillStyle = '#eef3ff'; g.font = '700 18px serif'; g.textAlign = 'center'; g.fillText('阿 吽', 1600, WALL_Y - 81); break;
      case 'lantern': g.fillStyle = '#3b2a1e'; g.fillRect(p.x - 2, p.y - 46, 4, 46); g.fillStyle = night ? '#ffcf7a' : '#e8b24a'; g.fillRect(p.x - 8, p.y - 58, 16, 16); break;
      case 'post': g.fillStyle = '#6b4f2a'; g.fillRect(p.x - 7, p.y - 60, 14, 60); g.fillStyle = '#a07a46'; g.fillRect(p.x - 12, p.y - 50, 24, 8); break;
      case 'field': break;
    } },
  drawLights(g) { const d = this.dark(); if (d <= 0.01) return; g.save(); g.globalCompositeOperation = 'lighter'; for (const L of this.lights) { const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r); gr.addColorStop(0, `rgba(255,190,110,${0.35 * d})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2); } g.restore(); },
};
function mulberry(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/* ---------- PNJ à routines ---------- */
const NPC_DEF = [
  { id: 'teuchi', n: 'Teuchi', look: { hair: '#eee', top: '#fff', bot: '#555' }, sched: [[6, 22, 1290, 905], [22, 6, 1180, 1300, 'home']], lines: ['Un bol ? Ça ne se refuse pas.', 'Tu me rappelles quelqu’un… un client qui criait plus fort.'], q: 'ramen' },
  { id: 'ino', n: 'Ino', look: { hair: '#f4e08a', top: '#7a3d8f', bot: '#3a2a4a' }, sched: [[8, 19, 1930, 905], [19, 8, 2100, 1250, 'home']], lines: ['Des chrysanthèmes ? Pour un deuil ? …Pardon.', 'Inojin s’entraîne trop. Comme son père à l’époque.'] },
  { id: 'kotetsu', n: 'Kotetsu', look: { hair: '#222', top: '#3d5a3a', bot: '#2a3a2a', band: 1 }, sched: [[0, 24, 1560, 2240]], patrol: [[1540, 2240], [1540, 2120]], lines: ['La porte reste ouverte. Pas les yeux.', 'Le camp au sud… quelqu’un devrait s’en occuper.'], q: 'camp' },
  { id: 'izumo', n: 'Izumo', look: { hair: '#4a3a2a', top: '#3d5a3a', bot: '#2a3a2a', band: 1 }, sched: [[0, 24, 1650, 2240]], patrol: [[1660, 2240], [1660, 2120]], lines: ['Encore une capuche. Les voyageurs aiment le mystère.', 'Shikamaru dort trois heures par nuit.'] },
  { id: 'haru', n: 'Haru', kid: 1, look: { hair: '#c0582a', top: '#e0b13a', bot: '#3a4a6a' }, sched: [[7, 20, 2150, 820], [20, 7, 2300, 1400, 'home']], lines: ['J’ai perdu mes shurikens d’entraînement ! Trois !', 'Plus tard je serai Hokage. Le Neuvième.'], q: 'shuriken' },
  { id: 'mei', n: 'Mei', kid: 1, look: { hair: '#2a2a3a', top: '#e06a8a', bot: '#3a3a5a' }, sched: [[7, 20, 2200, 840], [20, 7, 2000, 1700, 'home']], lines: ['On joue aux ninjas ! Tu fais le méchant ?', 'Le grand Kawaki est passé ce matin. Il fait peur.'] },
  { id: 'taro', n: 'Taro', kid: 1, look: { hair: '#6a4a2a', top: '#5aa0d0', bot: '#2a2a3a' }, sched: [[7, 20, 2120, 870], [20, 7, 1400, 1700, 'home']], lines: ['Course jusqu’à la stèle !', 'Mon père dit que Boruto est un monstre. Toi t’en penses quoi ?'] },
  { id: 'gen', n: 'Vieux Gen', look: { hair: '#bbb', top: '#6a5a4a', bot: '#4a3a2a' }, sched: [[6, 12, 2500, 1100], [12, 19, 1700, 1000], [19, 6, 900, 1400, 'home']], lines: ['J’ai connu le Septième tout petit. Il était bruyant, et bon.', 'Les racines à l’ouest bougent la nuit. Je n’invente rien.'] },
  { id: 'smith', n: 'Tenten', look: { hair: '#4a2a1a', top: '#c04a4a', bot: '#2a2a3a' }, sched: [[8, 20, 1040, 1100], [20, 8, 900, 1300, 'home']], lines: ['Lames, kunais, rouleaux. Pas de crédit.', 'Les parchemins de scellement partent comme des petits pains.'] },
  { id: 'guard3', n: 'Patrouilleur', look: { hair: '#222', top: '#3d5a3a', bot: '#2a3a2a', band: 1 }, sched: [[0, 24, 1600, 1580]], patrol: [[700, 1580], [2500, 1580], [2500, 960], [700, 960]], lines: ['Circulez. Ordre du Huitième.', 'Les Claw Grimes peuvent sortir de n’importe quelle marque.'] },
  { id: 'vend1', n: 'Marchande', look: { hair: '#7a3a2a', top: '#3a7a6a', bot: '#2a2a3a' }, sched: [[7, 18, 1440, 1000], [18, 7, 1300, 1800, 'home']], lines: ['Dango tout chauds !', 'Mon fils est genin. Il veut être comme Sarada.'] },
  { id: 'vend2', n: 'Passant', look: { hair: '#3a3a3a', top: '#6a6a8a', bot: '#2a2a3a' }, sched: [[6, 21, 1800, 1580], [21, 6, 2200, 1900, 'home']], walker: 1, lines: ['Belle journée pour ne rien faire.', 'Tu as entendu ? Code aurait été vu au nord.'] },
];
function makeNpcs() { World.npcs = NPC_DEF.map((d) => ({ ...d, x: d.sched[0][2], y: d.sched[0][3], vx: 0, vy: 0, r: 12, face: 1, tx: d.sched[0][2], ty: d.sched[0][3], wait: 0, pi: 0, anim: 0, isNpc: true, hidden: false, li: 0 })); }
function npcUpdate(n, dt) { const h = World.time; let S = n.sched.find((s) => (s[0] < s[1] ? h >= s[0] && h < s[1] : h >= s[0] || h < s[1])) || n.sched[0];
  n.home = S[4] === 'home'; n.wait -= dt;
  if (n.wait <= 0) { n.wait = rnd(1.5, 4); if (n.patrol && !n.home) { n.pi = (n.pi + 1) % n.patrol.length; [n.tx, n.ty] = n.patrol[n.pi]; } else if (n.kid && !n.home) { n.tx = S[2] + rnd(-140, 140); n.ty = S[3] + rnd(-60, 80); n.wait = rnd(0.6, 2); } else if (n.walker && !n.home) { n.tx = rnd(700, 2500); n.ty = pick([960, 1580]); n.wait = rnd(4, 8); } else { n.tx = S[2] + rnd(-25, 25); n.ty = S[3] + rnd(-10, 15); } }
  const dx = n.tx - n.x, dy = n.ty - n.y, d = Math.hypot(dx, dy); const sp = n.kid ? 150 : n.patrol ? 75 : 85; const talking = Game.talkTo === n;
  if (d > 6 && !talking) { n.vx = (dx / d) * sp; n.vy = (dy / d) * sp; n.x += n.vx * dt; n.y += n.vy * dt; n.face = dx < 0 ? -1 : 1; n.anim += dt * (n.kid ? 14 : 9); } else { n.vx = n.vy = 0; }
  n.hidden = n.home && d < 10; World.collide(n); }
