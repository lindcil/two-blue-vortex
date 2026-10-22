// v0.10.26 — Konoha restructuré : îlots de maisons à taille humaine le long de vraies rues, rue marchande avec étals, quartier résidentiel dense.
// (avant : 26 maisons géantes posées au hasard dans un village agrandi ×3,16)
(() => {
  const ROADS_X = [900, 1600, 2200], ROADS_Y = [960, 1270, 1580, 1900];
  const onRoad = (x, y, w, h) => ROADS_X.some((r) => Math.abs(x - r) < (r === 1600 ? 95 : 40) + w / 2) || ROADS_Y.some((r) => y > r - (r === 1580 ? 120 : 40) && y - h < r + (r === 1580 ? 110 : 30));
  const ROOFS = ['#b8563a', '#a8483a', '#6c8ea3', '#7a5a3a', '#3f6f5f', '#8e6b4a', '#5b6f8a'];
  const bd = World.build.bind(World);
  World.build = function () { const r = bd(); if (Game.titleMode) return r; const R = mulberry(4242);
    // 1) retire les maisons anonymes du village et leurs collisions
    const old = this.props.filter((p) => p.kind === 'house' && !p.label && p.y < WALL_Y);
    for (const p of old) { const i = this.solids.findIndex((s) => Math.abs(s.x - (p.x - p.w / 2)) < 0.5 && Math.abs(s.y - (p.y - p.h)) < 0.5); if (i >= 0) this.solids.splice(i, 1); }
    this.props = this.props.filter((p) => !old.includes(p));
    const keep = this.props.filter((p) => p.kind === 'house' && p.label).map((p) => [p.x - p.w / 2 - 50, p.y - p.h - 40, p.x + p.w / 2 + 50, p.y + 60]);
    keep.push([2550, 1050, 3200, 1500]); // terrain d'entraînement
    const blocked = (x, y, w, h) => keep.some((k) => x + w / 2 > k[0] && x - w / 2 < k[2] && y > k[1] && y - h < k[3]) || this.pois.some((q) => Math.hypot(q.x - x, q.y - y) < 70);
    const house = (x, y, w, h, roof) => { this.solids.push({ x: x - w / 2, y: y - h, w, h: h * 0.75 }); this.props.push({ kind: 'house', x, y, w, h, roof, small10: 1 }); };
    // 2) îlots résidentiels : maisons ~1,5× la hauteur d'un ninja, alignées sur les rues
    let n = 0; for (let y = 760; y < 2240; y += 92) for (let x = 520; x < 3250; x += 104) { const w = 78 + R() * 18, h = 58 + R() * 12, jx = x + R() * 10, yy = y + R() * 6;
      if (onRoad(jx, yy, w, h)) continue; if (blocked(jx, yy, w, h)) continue; if (yy < 1000 && jx > 1250 && jx < 2500) continue; if (R() < 0.08) continue; house(jx, yy, w, h, ROOFS[(R() * ROOFS.length) | 0]); n++; }
    // 3) rue marchande (y = 1580) : étals des deux côtés
    for (let x = 1000; x < 2400; x += 130) { if (Math.abs(x - 1600) < 140) continue; for (const y of [1530, 1650]) { if (blocked(x, y, 70, 40)) continue; this.props.push({ kind: 'stall10', x, y, c: ROOFS[(R() * ROOFS.length) | 0] }); this.solids.push({ x: x - 34, y: y - 26, w: 68, h: 20 }); } }
    this.houses10 = n; return r; };
  // dessin des étals (coordonnées logiques, l'échelle K est appliquée par 8b)
  const dp = World.drawProp.bind(World);
  World.drawProp = function (g, p) { if (p.kind !== 'stall10') return dp(g, p); const { x, y } = p;
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(x, y + 2, 40, 9, 0, 0, TAU); g.fill();
    g.fillStyle = '#7a5a3a'; g.strokeStyle = INK; g.lineWidth = 2; g.fillRect(x - 34, y - 22, 68, 22); g.strokeRect(x - 34, y - 22, 68, 22);
    g.fillStyle = '#5a4028'; g.fillRect(x - 32, y - 56, 4, 34); g.fillRect(x + 28, y - 56, 4, 34);
    g.fillStyle = p.c; g.beginPath(); g.moveTo(x - 40, y - 52); g.lineTo(x + 40, y - 52); g.lineTo(x + 34, y - 64); g.lineTo(x - 34, y - 64); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = -30; i < 34; i += 16) g.fillRect(x + i, y - 52, 8, 4);
    g.fillStyle = '#e8c86a'; g.beginPath(); g.arc(x - 12, y - 25, 5, 0, TAU); g.arc(x + 4, y - 25, 5, 0, TAU); g.fill(); g.fillStyle = '#c0503a'; g.beginPath(); g.arc(x + 18, y - 25, 4, 0, TAU); g.fill(); };
})();
