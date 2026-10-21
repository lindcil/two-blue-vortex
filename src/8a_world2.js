// v0.7 — Carte agrandie (3200×3000 → 4800×4400) : Forêt de l’Est, Lac du Miroir, Ruines du Sud, Plateau des Pierres, Sanctuaire, Avant-poste, Ponts, Rizières.
(() => {
  const ZONES = [
    { id: 'foret_est', n: 'Forêt de l’Est', x: 4000, y: 1000, rx: 700, ry: 700, ic: '森', g: '#3d5f39' },
    { id: 'lac', n: 'Lac du Miroir', x: 4000, y: 3300, rx: 520, ry: 330, ic: '湖', g: '#3f7fb5', water: 1 },
    { id: 'ruines', n: 'Ruines du Sud', x: 1600, y: 3700, rx: 600, ry: 380, ic: '跡', g: '#8a7d68' },
    { id: 'plateau', n: 'Plateau des Pierres', x: 600, y: 3700, rx: 500, ry: 420, ic: '岩', g: '#9a8a6a' },
    { id: 'rizieres', n: 'Rizières', x: 2700, y: 3300, rx: 420, ry: 260, ic: '田', g: '#6e9a52' },
  ];
  window.ZONES07 = ZONES;
  const pr = World.prerender.bind(World);
  World.prerender = function () { const R = mulberry(77), P = this.props, poi = (id, x, y, n, ic) => this.pois.push({ id, x, y, n, ic });
    // végétation & repères
    for (let i = 0; i < 260; i++) { const x = 3300 + R() * 1450, y = 400 + R() * 1900; P.push({ kind: 'tree', x, y, s: 0.9 + R() * 0.7 }); }
    for (let i = 0; i < 140; i++) { const x = 60 + R() * 4700, y = 3050 + R() * 1300; if (ZONES.some((z) => z.water && Math.hypot((x - z.x) / z.rx, (y - z.y) / z.ry) < 1.1)) continue; if (Math.hypot(x - 1600, y - 3700) < 420 || Math.abs(x - 1600) < 90) continue; P.push({ kind: 'tree', x, y, s: 0.8 + R() * 0.6 }); }
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; P.push({ kind: 'pillar', x: 1600 + Math.cos(a) * 330, y: 3700 + Math.sin(a) * 200, h: 60 + R() * 70, broken: R() < 0.5 }); }
    for (let i = 0; i < 18; i++) P.push({ kind: 'boulder', x: 300 + R() * 650, y: 3400 + R() * 650, s: 0.7 + R() * 1.1 });
    for (const [x, y] of [[4300, 700], [3700, 1500]]) P.push({ kind: 'torii', x, y });
    for (let i = 0; i < 4; i++) P.push({ kind: 'tent', x: 3900 + i * 110, y: 2500 + (i % 2) * 70 });
    P.push({ kind: 'bridge', x: 3020, y: 1250 }); P.push({ kind: 'bridge', x: 3000, y: 2650 });
    for (let i = 0; i < 6; i++) P.push({ kind: 'lantern', x: 3500 + i * 220, y: 1250 });
    poi('foret_est', 4000, 1000, 'Forêt de l’Est', '森'); poi('sanctuaire', 4300, 700, 'Sanctuaire du renard', '社'); poi('lac', 4000, 3300, 'Lac du Miroir', '湖'); poi('ruines', 1600, 3700, 'Ruines du Sud', '跡');
    poi('plateau', 600, 3700, 'Plateau des Pierres', '岩'); poi('rizieres', 2700, 3300, 'Rizières', '田'); poi('avantposte', 4060, 2540, 'Avant-poste de l’Est', '営'); poi('cascade', 4650, 1900, 'Cascade', '滝');
    this.solids.push({ x: 4600, y: 1700, w: 200, h: 120 });
    pr();
    // peinture du sol des nouvelles zones
    const g = this.ground.getContext('2d'); const sc = this.gsc; g.save(); g.setTransform(sc, 0, 0, sc, 0, 0);
    g.fillStyle = 'rgba(30,45,25,.25)'; g.fillRect(3200, 0, 1600, H); g.fillStyle = 'rgba(30,45,25,.2)'; g.fillRect(0, 3000, W, H - 3000);
    for (const z of ZONES) { g.fillStyle = z.g; g.globalAlpha = z.water ? 1 : 0.6; g.beginPath(); g.ellipse(z.x, z.y, z.rx, z.ry, 0, 0, TAU); g.fill(); if (z.water) { g.strokeStyle = 'rgba(200,230,255,.35)'; g.lineWidth = 8; g.stroke(); g.lineWidth = 3; for (let i = 0; i < 30; i++) { g.beginPath(); const x = z.x + (R() - 0.5) * z.rx * 1.4, y = z.y + (R() - 0.5) * z.ry * 1.4; g.moveTo(x, y); g.lineTo(x + 30, y); g.stroke(); } } }
    g.globalAlpha = 1; g.strokeStyle = 'rgba(80,110,60,.6)'; g.lineWidth = 3; for (let y = 3080; y < 3540; y += 26) { g.beginPath(); g.moveTo(2300, y); g.lineTo(3100, y); g.stroke(); }
    g.strokeStyle = '#c9b08a'; g.lineCap = 'round'; g.lineWidth = 90; g.beginPath(); g.moveTo(1600, 2980); g.lineTo(1600, 3700); g.lineTo(600, 3700); g.moveTo(1600, 3300); g.lineTo(2700, 3300); g.lineTo(3600, 3300); g.moveTo(2700, 1250); g.lineTo(4300, 1250); g.lineTo(4300, 700); g.moveTo(3200, 2600); g.lineTo(4060, 2540); g.stroke();
    // rivière est prolongée jusqu’au lac + cascade
    g.strokeStyle = '#3f7fb5'; g.lineWidth = 70; g.beginPath(); g.moveTo(3000, 3000); g.bezierCurveTo(3200, 3300, 3400, 3350, 3500, 3300); g.moveTo(4700, 1800); g.bezierCurveTo(4500, 2400, 4300, 2900, 4100, 3100); g.stroke();
    g.restore(); };
  const dp = World.drawProp.bind(World);
  World.drawProp = function (g, p) { switch (p.kind) {
      case 'pillar': { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(p.x, p.y, 22, 7, 0, 0, TAU); g.fill(); g.fillStyle = '#a89a80'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(p.x - 16, p.y); g.lineTo(p.x - 16, p.y - p.h); if (p.broken) { g.lineTo(p.x - 4, p.y - p.h + 12); g.lineTo(p.x + 6, p.y - p.h - 6); } g.lineTo(p.x + 16, p.y - p.h + (p.broken ? 10 : 0)); g.lineTo(p.x + 16, p.y); g.closePath(); g.fill(); g.stroke(); return; }
      case 'boulder': { const s = p.s; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(p.x, p.y, 34 * s, 10 * s, 0, 0, TAU); g.fill(); g.fillStyle = '#8a8070'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(p.x - 32 * s, p.y); g.lineTo(p.x - 24 * s, p.y - 34 * s); g.lineTo(p.x + 4 * s, p.y - 46 * s); g.lineTo(p.x + 30 * s, p.y - 24 * s); g.lineTo(p.x + 32 * s, p.y); g.closePath(); g.fill(); g.stroke(); return; }
      case 'torii': { g.fillStyle = '#c0392b'; g.strokeStyle = INK; g.lineWidth = 3; for (const s of [-1, 1]) { g.fillRect(p.x + s * 50 - 7, p.y - 130, 14, 130); g.strokeRect(p.x + s * 50 - 7, p.y - 130, 14, 130); } g.fillRect(p.x - 80, p.y - 140, 160, 14); g.strokeRect(p.x - 80, p.y - 140, 160, 14); g.fillRect(p.x - 64, p.y - 112, 128, 10); g.strokeRect(p.x - 64, p.y - 112, 128, 10); return; }
      case 'tent': { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(p.x, p.y, 50, 12, 0, 0, TAU); g.fill(); g.fillStyle = '#c9b48a'; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(p.x - 48, p.y); g.lineTo(p.x, p.y - 70); g.lineTo(p.x + 48, p.y); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#5a4a32'; g.beginPath(); g.moveTo(p.x - 12, p.y); g.lineTo(p.x, p.y - 40); g.lineTo(p.x + 12, p.y); g.fill(); return; }
      case 'bridge': { g.fillStyle = '#8a6a44'; g.strokeStyle = INK; g.lineWidth = 3; g.fillRect(p.x - 70, p.y - 30, 140, 46); g.strokeRect(p.x - 70, p.y - 30, 140, 46); g.strokeStyle = 'rgba(11,16,32,.4)'; for (let k = -60; k < 70; k += 16) { g.beginPath(); g.moveTo(p.x + k, p.y - 30); g.lineTo(p.x + k, p.y + 16); g.stroke(); } return; }
    } return dp(g, p); };
})();
