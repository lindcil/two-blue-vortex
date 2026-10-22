// v0.10.44 — Maisons de style Konoha (coordonnées logiques, avant 8b) : murs crème/pêche à poteaux de bois, toits arrondis à tuiles et avant-toit, fenêtres à cadre et volets,
// noren sur les boutiques, réservoirs d'eau sur les toits, variété par hachage. Formes simples, aucun dégradé (perf).
(() => {
  const WALL = ['#efe2c6', '#f2d6bc', '#e6e0d2', '#efd9a8', '#dfe6e2'], TANK = ['#7f9aa6', '#9aa8a0', '#a07a5a'];
  const hs = (p) => { if (p.hs10 == null) { let v = Math.floor(p.x * 13.1 + p.y * 7.7); v = (v ^ (v >> 7)) * 2654435761 >>> 0; p.hs10 = v; } return p.hs10; };
  const dp = World.drawProp.bind(World);
  World.drawProp = function (g, p) { if (p.kind !== 'house') return dp(g, p); const night = this.dark() > 0.3, { x, y, w, h } = p, H = hs(p), L = x - w / 2, R = x + w / 2, wy = y - h * 0.58;
    // ombre
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(x + 8, y + 2, w * 0.56, 9, 0, 0, TAU); g.fill();
    // murs
    g.fillStyle = WALL[H % WALL.length]; g.fillRect(L, wy, w, y - wy); g.fillStyle = 'rgba(80,60,40,.18)'; g.fillRect(L, y - 8, w, 8); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(L, wy, w, 4);
    g.fillStyle = '#6a4a32'; g.fillRect(L, wy, 4, y - wy); g.fillRect(R - 4, wy, 4, y - wy); if (w > 120) g.fillRect(x - 2 + (H % 3 - 1) * w * 0.18, wy, 3, y - wy);
    // fenêtres
    const nW = w > 150 ? 3 : 2, ww = Math.min(22, w * 0.18), wh = Math.min(16, (y - wy) * 0.32), top = wy + (y - wy) * 0.18;
    for (let i = 0; i < nW; i++) { const cx = nW === 2 ? (i ? R - w * 0.24 : L + w * 0.24) : L + w * (0.18 + i * 0.32); if (Math.abs(cx - x) < 22) continue; g.fillStyle = '#5a4030'; g.fillRect(cx - ww / 2 - 2, top - 2, ww + 4, wh + 4); g.fillStyle = night ? ((H >> i) & 1 ? '#ffd27a' : '#3a4256') : '#7fa6bf'; g.fillRect(cx - ww / 2, top, ww, wh); g.fillStyle = 'rgba(90,64,48,.9)'; g.fillRect(cx - 1, top, 2, wh); g.fillRect(cx - ww / 2, top + wh / 2 - 1, ww, 2); if (!night) { g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(cx - ww / 2 + 2, top + 2, 4, wh / 2 - 3); } }
    // porte : noren pour les lieux nommés, porte coulissante sinon
    if (p.label) { g.fillStyle = '#3b2a1e'; g.fillRect(x - 16, y - 36, 32, 36); g.fillStyle = H & 1 ? '#2a4a8a' : '#a83a2a'; for (let k = 0; k < 3; k++) g.fillRect(x - 15 + k * 10.3, y - 36, 9, 16); }
    else { g.fillStyle = '#4a3424'; g.fillRect(x - 13, y - 32, 26, 32); g.fillStyle = '#d8c8a8'; g.fillRect(x - 11, y - 30, 10, 26); g.fillRect(x + 1, y - 30, 10, 26); g.strokeStyle = 'rgba(74,52,36,.7)'; g.lineWidth = 1; g.beginPath(); for (let k = 1; k < 4; k++) { g.moveTo(x - 11, y - 30 + k * 6.5); g.lineTo(x + 11, y - 30 + k * 6.5); } g.stroke(); }
    // toit arrondi à la Konoha : avant-toit, bombé, rangées de tuiles
    const ry = y - h, eave = 14, rc = p.roof || '#c0583a';
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(L - eave + 4, wy, w + eave * 2 - 8, 6);
    g.fillStyle = rc; g.beginPath(); g.moveTo(L - eave, wy + 2); g.quadraticCurveTo(L - 2, ry + (wy - ry) * 0.35, L + 12, ry + 4); g.quadraticCurveTo(x, ry - 10, R - 12, ry + 4); g.quadraticCurveTo(R + 2, ry + (wy - ry) * 0.35, R + eave, wy + 2); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1.5; g.beginPath(); for (let k = 1; k < 4; k++) { const yy = ry + (wy - ry) * (k / 4) + 2, ex = eave * (k / 4); g.moveTo(L - ex + 4, yy); g.lineTo(R + ex - 4, yy); } g.stroke();
    g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(L + 14, ry + 6); g.quadraticCurveTo(x, ry - 6, R - 14, ry + 6); g.quadraticCurveTo(x, ry + 2, L + 14, ry + 6); g.fill();
    g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(L - eave, wy, w + eave * 2, 3);
    // réservoir d'eau (≈ 45 % des maisons sans nom)
    if (!p.label && H % 20 < 9) { const tx = x + ((H >> 4) % 2 ? 1 : -1) * w * 0.22, tb = ry + 2, tr = Math.min(13, w * 0.11), th = 20; g.fillStyle = '#3a3a3a'; g.fillRect(tx - tr + 2, tb - 8, 2, 8); g.fillRect(tx + tr - 4, tb - 8, 2, 8);
      g.fillStyle = TANK[H % 3]; g.fillRect(tx - tr, tb - 8 - th, tr * 2, th); g.beginPath(); g.ellipse(tx, tb - 8 - th, tr, 4, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(tx - tr, tb - 8 - th * 0.45, tr * 2, 3); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(tx - tr + 3, tb - 6 - th, 3, th - 4); }
    else if (!p.label && H % 20 < 13) { g.fillStyle = '#8a8a8a'; g.fillRect(x + w * 0.25, ry - 10, 4, 14); g.fillRect(x + w * 0.25 - 6, ry - 10, 16, 3); } // antenne
    if (p.label) { g.font = "400 15px 'TBV Ext', 'Lilita One', system-ui"; g.textAlign = 'center'; g.fillStyle = 'rgba(11,16,32,.75)'; const tw = g.measureText(p.label).width + 14; g.fillRect(x - tw / 2, ry - 30, tw, 20); g.fillStyle = '#eef3ff'; g.fillText(p.label, x, ry - 15); }
    if (p.label === 'Tour du Hokage') { g.fillStyle = '#eef3ff'; g.beginPath(); g.arc(x, y - h * 0.78, 22, 0, TAU); g.fill(); g.fillStyle = '#c0392b'; g.font = '700 26px serif'; g.textAlign = 'center'; g.fillText('火', x, y - h * 0.78 + 9); }
  };
})();
