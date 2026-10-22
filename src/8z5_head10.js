// v0.10.11 — Tête anime de profil refaite (repères de tutoriel « anime side view » : crâne-cercle, oreille sur l'axe vertical
// au niveau du sourcil, nez sur le bas du cercle, menton à la même distance, mâchoire qui remonte vers l'oreille, coin du cou).
// Contours colorés (teinte sombre de la couleur, épais seulement sur la silhouette), ombre en aplat + liseré de lumière,
// cheveux en mèches canon (ombre + reflet), œil de profil en coin. Vue de dos assortie. LOD : PNJ lointains = ancien rendu.
(() => {
  const prev = drawHead;
  const dk = (c, n = 2) => { let x = c; for (let i = 0; i < n; i++) x = shade(x); return x; };
  const LTC = new Map(); const lt = (c, k = 0.35) => { const key = c + '|' + k; let v = LTC.get(key); if (v === undefined) { v = lt0(c, k); LTC.set(key, v); } return v; }; const lt0 = (c, k = 0.35) => String(c).replace(/^#(..)(..)(..)$/, (m, r, g, b) => '#' + [r, g, b].map((h) => { const v = parseInt(h, 16); return Math.round(v + (255 - v) * k).toString(16).padStart(2, '0'); }).join(''));
  const r = 10, c = -12; // crâne
  // ---------- silhouette du visage (profil, regard vers +x) ----------
  const facePath = (g) => { g.beginPath(); g.moveTo(-r * 0.2, c - r); g.bezierCurveTo(r * 0.55, c - r, r * 0.95, c - r * 0.6, r * 0.98, c - 1); // front
    g.quadraticCurveTo(r * 1.0, c + 3.2, r + 2.1, c + r - 0.6); // arête du nez → pointe
    g.quadraticCurveTo(r + 1.2, c + r + 1, r + 0.4, c + r + 0.9); g.quadraticCurveTo(r + 0.9, c + r + 2.2, r + 0.2, c + r + 3); // lèvres
    g.quadraticCurveTo(r + 0.3, c + r + 4.6, r - 1.6, c + r + 5.2); // menton
    g.quadraticCurveTo(r * 0.35, c + r + 4.4, -0.8, c + r + 0.6); // mâchoire vers l'oreille
    g.quadraticCurveTo(-r * 0.75, c + r * 0.85, -r, c + 1); g.bezierCurveTo(-r * 1.02, c - r * 0.7, -r * 0.6, c - r, -r * 0.2, c - r); g.closePath(); };
  // ---------- mèches : [angle sur le crâne (0 = avant, -π/2 = haut), longueur, largeur, courbure, longueur relative de la base] ----------
  const H = {
    boruto: { cap: 1, fr: [[-0.35, 6, 4.5, 0.5], [-0.75, 8, 5, 0.4], [-1.15, 9, 5, -0.1], [-1.55, 9.5, 5, -0.3], [-1.95, 9, 5, -0.5], [-2.35, 8, 5, -0.6], [-2.75, 6.5, 4.5, -0.7], [-3.1, 5, 4, -0.5]], bang: [[0, 7.5, 3], [-3, 6, 2.6]] },
    naruto: { cap: 1, fr: [[-0.4, 8, 5, 0.4], [-0.85, 11, 5.5, 0.2], [-1.3, 12, 5.5, -0.1], [-1.75, 12, 5.5, -0.3], [-2.2, 11, 5.5, -0.5], [-2.65, 9, 5, -0.6], [-3.05, 7, 4.5, -0.5], [-3.5, 5, 4, -0.3]], bang: [[0, 6, 3], [-3, 5, 2.6]] },
    kawaki: { cap: 1, fr: [[-0.4, 5, 4.5, 0.6], [-0.85, 6.5, 5, 0.2], [-1.3, 7, 5, -0.2], [-1.75, 7, 5, -0.5], [-2.2, 6.5, 5, -0.7], [-2.65, 6, 5, -0.8], [-3.1, 5, 4.5, -0.7]], bang: [[0, 6.5, 3], [-3, 5.5, 2.6]] },
    sasuke: { cap: 1, fr: [[-1.2, 5, 5, -0.4], [-1.8, 7, 5, -0.8], [-2.3, 9, 5, -0.9], [-2.75, 9, 5, -0.8], [-3.15, 7, 4.5, -0.6]], bang: [[0.5, 7.5, 3], [-2.8, 6, 2.6]] },
    code: { cap: 1, fr: [[-1.0, 5, 5, -0.9], [-1.5, 8, 5, -1.1], [-2.0, 10, 5, -1.1], [-2.5, 10, 5, -1], [-2.95, 7, 4.5, -0.8]], bang: [] },
    sarada: { cap: 1, bob: 1, fr: [], bang: [[0, 5.5, 3.4], [-3.2, 5.5, 3]] },
    hima: { cap: 1, bob: 0.7, fr: [[-1.55, 4, 3, -0.6], [-1.85, 3.5, 3, 0.4]], bang: [[0, 5, 3.2], [-3, 5, 3]] },
    mitsuki: { cap: 1, bob: 0.85, fr: [[-1.6, 2.5, 4, -0.5]], bang: [[0, 6.5, 3.2], [-3.2, 6, 3]] },
    long: { cap: 1, bob: 1, long: 1, fr: [], bang: [[0, 5, 3.4]] },
    // coiffures génériques (PNJ) : silhouettes distinctes des héros canon
    spiky: { cap: 1, fr: [[-0.6, 4, 4, 0.3], [-1.1, 5, 4.5, -0.1], [-1.6, 5.5, 4.5, -0.4], [-2.1, 5, 4.5, -0.6], [-2.6, 4, 4, -0.6]], bang: [[0, 5, 3]] },
    messy: { cap: 1, fr: [[-0.5, 3, 4, 0.8], [-1.0, 3.5, 4.5, -0.6], [-1.5, 3, 4.5, 0.7], [-2.0, 3.5, 4.5, -0.7], [-2.5, 3, 4, 0.6], [-2.95, 3, 4, -0.5]], bang: [[0, 6, 3.2], [-2.6, 5, 2.6]] },
    slick: { cap: 1, fr: [[-1.9, 4, 6, -1.2], [-2.5, 5, 5.5, -1.1]], bang: [] },
    pony: { cap: 1, fr: [[-3.0, 11, 3.4, -1.6], [-2.6, 3.5, 4.5, -0.2]], bang: [[0, 4.5, 3.4]] },
    pineapple: { cap: 1, fr: [[-2.05, 7, 2.6, -0.4], [-2.25, 8, 2.6, -0.2], [-2.45, 7, 2.6, 0.1], [-2.3, 3, 4.5, 0]], bang: [[0, 4, 3.4]] },
    bob: { cap: 1, bob: 0.75, fr: [], bang: [[0.4, 4.5, 3.6]] },
    buns: { cap: 1, fr: [[-1.45, 3.6, 6, 0], [-2.45, 3.6, 6, 0]], bang: [[0, 5, 3.2], [-3, 4.5, 2.8]] },
  };
  const ALIAS = { jura: 'long', buzz: 'buzz', bald: 'bald' };
  const hairDef = (hs) => H[hs] || H[ALIAS[hs]] || null;
  // une mèche effilée partant du crâne
  const clump = (g, a, len, w, bend, lg) => { const bx = Math.cos(a) * r * 0.98, by = c + Math.sin(a) * r * 0.98, nx = Math.cos(a), ny = Math.sin(a), tx = -ny, ty = nx;
    const ex = bx + nx * len + tx * bend * len * 0.6 + lg * 0.25 * len / 8, ey = by + ny * len + ty * bend * len * 0.6;
    g.moveTo(bx - tx * w, by - ty * w); g.quadraticCurveTo(bx + nx * len * 0.5 - tx * w * 0.3 + tx * bend * len * 0.5, by + ny * len * 0.5 - ty * w * 0.3 + ty * bend * len * 0.5, ex, ey);
    g.quadraticCurveTo(bx + nx * len * 0.45 + tx * w * 0.6 + tx * bend * len * 0.3, by + ny * len * 0.45 + ty * w * 0.6 + ty * bend * len * 0.3, bx + tx * w, by + ty * w); };
  const bangP = (p, k, lg) => { const [ox, len, w] = k; const x0 = r * 0.5 + ox, y0 = c - r * 0.78, tx = Math.min(r * 0.78, r * 0.66 + ox * 0.4) + lg * 0.05, ty = Math.min(c - 1.2, y0 + len);
    p.moveTo(x0 - w, y0 - 0.5); p.quadraticCurveTo(x0 - w * 0.2, y0 + len * 0.5, tx, ty); p.quadraticCurveTo(x0 + w * 0.6, y0 + len * 0.35, x0 + w * 0.7, y0 - 1); p.closePath(); };
  const capPath = (g, D, back) => { g.beginPath(); if (back) { g.ellipse(0, c, r + 1.2, r + 1.4, 0, 0, TAU); return; }
    // calotte : couvre le haut et l'arrière, ligne frontale sur le front, dégage l'oreille
    g.moveTo(r * 0.62, c - r * 0.72); g.bezierCurveTo(r * 0.3, c - r - 2.2, -r - 1.5, c - r - 1.5, -r - 1.4, c - 0.5);
    if (D.bob) { const b = D.bob; g.quadraticCurveTo(-r - 2.2, c + r * 0.9 * b + 2, -r * 0.6, c + r * 1.05 * b + (D.long ? 10 : 0)); g.lineTo(-r * 0.15, c + r * 0.95 * b + (D.long ? 8 : 0)); g.quadraticCurveTo(-r * 0.45, c + r * 0.3, -r * 0.35, c - 1.5); }
    else { g.quadraticCurveTo(-r * 0.95, c + r * 0.55, -r * 0.55, c + r * 0.62); g.quadraticCurveTo(-r * 0.4, c + 1, -r * 0.25, c - 2); }
    g.quadraticCurveTo(r * 0.2, c - r * 0.55, r * 0.62, c - r * 0.72); g.closePath(); };
  const sideLock = (g, D) => { if (!D.bob) return; const b = D.bob; g.moveTo(-r * 0.05, c - 2); g.quadraticCurveTo(r * 0.12, c + r * 0.5 * b, -r * 0.02, c + r * 0.95 * b + 1); g.lineTo(-r * 0.3, c + r * 0.8 * b); g.quadraticCurveTo(-r * 0.4, c + 1, -r * 0.5, c - 2); g.closePath(); };
  function hair(g, L, D, lg, back, tint, C) { const base = C(L.hair), sh = C(dk(L.hair, 1)), ol = C(dk(L.hair, 3)), hi = lt(L.hair, 0.5);
    const shape = (p) => { p.beginPath(); capPath(p, D, back); for (const k of D.fr) clump(p, k[0], k[1], k[2], k[3], lg); if (!back) { for (const k of D.bang) bangP(p, k, lg); sideLock(p, D); } };
    // silhouette : contour épais puis remplissage (seul le bord extérieur reste)
    shape(g); g.lineJoin = 'round'; if (!tint) { g.strokeStyle = ol; g.lineWidth = 2.6; g.stroke(); } g.fillStyle = base; g.fill();
    if (tint) return;
    // ombre en aplat (dessous / arrière), puis reflet
    g.save(); shape(g); g.clip(); g.fillStyle = sh; g.beginPath(); g.ellipse(-r * 0.75, c + r * 0.95, r * 1.15, r * 0.7, -0.3, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 0.9; for (const k of D.fr) { g.beginPath(); const a = k[0], bx = Math.cos(a) * r * 0.9, by = c + Math.sin(a) * r * 0.9; g.moveTo(bx, by); g.lineTo(bx + Math.cos(a) * k[1] * 0.55, by + Math.sin(a) * k[1] * 0.55); g.stroke(); }
    g.strokeStyle = hi; g.globalAlpha = 0.45; g.lineWidth = 1.2; g.lineCap = 'round'; g.beginPath(); g.arc(-0.5, c - 0.5, r * 0.8, -2.3, -1.4); g.stroke(); g.globalAlpha = 1; g.restore(); }
  // ---------- œil de profil (coin) ----------
  function eyeP(g, col, doj, ex, blink, L) { const x = r - 4.4, y = c + 3.2, an = ex === 'angry' ? 0.6 : 0; const lash = '#2a1a22';
    if (blink || ex === 'hurt') { g.strokeStyle = lash; g.lineWidth = 1.1; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 2.4, y + 0.6); g.quadraticCurveTo(x, y + (ex === 'hurt' ? 1.6 : 1.4), x + 2.2, y + 0.4); g.stroke(); return; }
    const eyeShape = (p) => { p.beginPath(); p.moveTo(x - 2.6, y - 2.4 + an * 0.5); p.quadraticCurveTo(x, y - 3.6 + an, x + 2.4, y - 2 + an); p.quadraticCurveTo(x + 2.3, y + 0.6, x + 1.6, y + 2.2); p.quadraticCurveTo(x - 0.8, y + 2.8, x - 2.4, y + 1.8); p.closePath(); };
    eyeShape(g); g.fillStyle = '#fbfbff'; g.fill(); g.save(); eyeShape(g); g.clip();
    const ir = doj === 'byakugan' ? '#dfe3f4' : col; g.fillStyle = dk(ir, 1); g.beginPath(); g.ellipse(x + 0.7, y + 0.1, 1.55, 2.9, 0, 0, TAU); g.fill(); g.fillStyle = ir; g.beginPath(); g.ellipse(x + 0.8, y + 0.7, 1.35, 2.2, 0, 0, TAU); g.fill();
    if (doj === 'sharingan') { g.fillStyle = 'rgba(20,10,14,.85)'; for (let i = 0; i < 3; i++) { const a = i * TAU / 3 + Game.t * 3; g.beginPath(); g.arc(x + 0.7 + Math.cos(a) * 0.9, y + 0.3 + Math.sin(a) * 1.5, 0.38, 0, TAU); g.fill(); } }
    else if (doj === 'snake') { g.fillStyle = 'rgba(30,20,10,.85)'; g.beginPath(); g.ellipse(x + 0.8, y + 0.4, 0.35, 1.9, 0, 0, TAU); g.fill(); }
    else if (doj === 'jogan') { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(x + 0.8, y + 0.4, 0.7, 0, TAU); g.fill(); }
    else if (doj !== 'byakugan') { g.fillStyle = 'rgba(14,12,26,.6)'; g.beginPath(); g.ellipse(x + 0.9, y + 0.5, 0.75, 1.5, 0, 0, TAU); g.fill(); }
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x + 1.3, y - 1.1, 0.75, 0.95, 0, 0, TAU); g.fill(); g.globalAlpha = 0.6; g.beginPath(); g.arc(x + 0.2, y + 1.6, 0.4, 0, TAU); g.fill(); g.globalAlpha = 1;
    g.fillStyle = 'rgba(90,110,160,.15)'; g.fillRect(x - 3, y - 4, 6, 2.2); g.restore();
    // cil supérieur (épais, pointe arrière), petit trait inférieur
    g.strokeStyle = lash; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 3.2, y - 3.0 + an * 0.5); g.lineTo(x - 2.6, y - 2.4 + an * 0.5); g.quadraticCurveTo(x, y - 3.6 + an, x + 2.4, y - 2 + an); g.stroke();
    g.lineWidth = 0.7; g.strokeStyle = 'rgba(42,26,34,.55)'; g.beginPath(); g.moveTo(x - 1.6, y + 2.3); g.quadraticCurveTo(x + 0.2, y + 2.7, x + 1.5, y + 2.1); g.stroke();
    // sourcil
    g.strokeStyle = L.brow || dk(L.hair === '#e8e8f0' ? '#9aa0b4' : L.hair, 1); g.lineWidth = 1.1; g.beginPath(); g.moveTo(x - 2.2, y - 5.2 + (ex === 'angry' || ex === 'shout' ? 0 : -0.3)); g.quadraticCurveTo(x + 0.2, y - 6.2 + an * 1.4, x + 2.6, y - 5.2 + an * 2.2); g.stroke(); }
  // ---------- tête complète ----------
  drawHead = function (g, u, L, C, ink, tint, kid, vel, wav, P) { if (tint || L.ghost || L.hs === 'bald' || L.hs === 'buzz') return prev.apply(this, arguments); const D0 = hairDef(L.hs); if (!D0 || (LOOK10 && LOOK10.LOD(u))) return prev.apply(this, arguments);
    const back = LOOK10.viewOf(u)[0] === 'back'; const S = u.spr10 || { x: 0, y: 0 }, lg = S.x * 1.2 - vel * 3; const D = L.hs === 'long' || L.hs === 'jura' ? H.long : D0;
    const sk = L.skin, skD = dk(sk, 1), skO = dk(sk, 3); g.save(); if (kid) g.scale(1.08, 1.08); if (u.isHero && !u.sheet10) { g.translate(0, c + r + 8); g.scale(1.22, 1.22); g.translate(0, -(c + r + 8)); }
    // cou + coin menton/cou
    g.fillStyle = skD; g.strokeStyle = skO; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-3.4, c + r - 1); g.lineTo(2.6, c + r + 1.5); g.lineTo(3.2, c + r + 8); g.lineTo(-3.6, c + r + 8); g.closePath(); g.fill(); g.stroke();
    if (back) { // dos : crâne + oreilles aux côtés + cheveux
      g.fillStyle = sk; g.strokeStyle = skO; g.lineWidth = 1.4; for (const ex of [-r - 0.6, r + 0.6]) { g.beginPath(); g.ellipse(ex, c + 2.5, 1.6, 2.6, 0, 0, TAU); g.fill(); g.stroke(); }
      hair(g, L, D, lg, true, tint, C);
      if (L.band) { g.fillStyle = L.band === 2 ? '#555' : '#2a3a6a'; g.strokeStyle = '#141a30'; g.lineWidth = 1; g.fillRect(-r - 1, c - 3.5, 2 * r + 2, 3.2); g.strokeRect(-r - 1, c - 3.5, 2 * r + 2, 3.2); g.strokeStyle = '#2a3a6a'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(-0.6, c - 2); g.quadraticCurveTo(-3 + lg, c + 4 + S.y, -4 + lg * 1.4, c + 9); g.moveTo(0.6, c - 2); g.quadraticCurveTo(1 + lg, c + 4, 0 + lg * 1.4, c + 10); g.stroke(); }
      g.restore(); return; }
    // cheveux arrière (longs) derrière le visage
    if (D.long) { g.fillStyle = dk(L.hair, 1); g.beginPath(); g.moveTo(-r, c); g.quadraticCurveTo(-r - 3 + lg, c + 14, -r + 2 + lg * 1.4, c + 22); g.lineTo(-2 + lg, c + 18); g.lineTo(0, c + 2); g.closePath(); g.fill(); }
    // visage : contour coloré, aplat d'ombre, liseré
    facePath(g); g.lineJoin = 'round'; g.strokeStyle = skO; g.lineWidth = 2.2; g.stroke(); g.fillStyle = sk; g.fill();
    g.save(); facePath(g); g.clip(); g.fillStyle = skD; g.globalAlpha = 0.55; g.beginPath(); g.moveTo(-r - 2, c - 2); g.quadraticCurveTo(-r * 0.2, c + 3, r * 0.2, c + r + 1); g.lineTo(r - 1, c + r + 6); g.lineTo(-r - 2, c + r + 8); g.closePath(); g.fill(); // ombre sous mâchoire / arrière
    g.globalAlpha = 0.5; g.strokeStyle = lt(sk, 0.6); g.lineWidth = 1.4; g.beginPath(); g.moveTo(r * 0.5, c - r * 0.85); g.quadraticCurveTo(r * 0.95, c - r * 0.5, r * 0.98, c); g.stroke(); g.restore(); // liseré
    // joue
    g.fillStyle = 'rgba(255,130,130,.13)'; g.beginPath(); g.ellipse(r * 0.42, c + r * 0.62, 2, 1.1, 0, 0, TAU); g.fill();
    // œil, bouche, détails
    const [col, doj] = (() => { const f = u.md && u.md.fam; const DJ = { sharingan: '#e0202e', byakugan: '#e8eaf6', jogan: '#7ad0ff' }; if (f && DJ[f]) return [DJ[f], f]; if (u.eyeFx) { const e = String(u.eyeFx).toLowerCase(); if (/^#(d0283a|ff3b4a|e0202e)$/.test(e)) return ['#e0202e', 'sharingan']; return [u.eyeFx, 'fx']; } return [L.eye || '#3a2a1e', L.snake ? 'snake' : null]; })();
    const ex = LOOK10.exprOf(u, P); const blink = ex !== 'shout' && (Math.sin(Game.t * 0.9 + (u.x || 0) * 0.013) > 0.992 || Math.sin(Game.t * 1.37 + (u.y || 0)) > 0.996);
    eyeP(g, col, doj, ex, blink, L);
    const mx = r + 0.3, my = c + r + 2.2; if (ex === 'shout' || P.mouth > 0.5) { g.fillStyle = '#7a3a42'; g.beginPath(); g.moveTo(mx - 1.6, my - 0.4); g.lineTo(mx + 0.2, my - 0.5); g.quadraticCurveTo(mx, my + 1.4, mx - 1.2, my + 1.2); g.closePath(); g.fill(); }
    else { g.strokeStyle = 'rgba(110,55,55,.7)'; g.lineWidth = 0.8; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - 1.4, my + (ex === 'angry' ? -0.2 : 0.2)); g.lineTo(mx, my); g.stroke(); }
    if (L.wh) { g.strokeStyle = 'rgba(110,70,55,.4)'; g.lineWidth = 0.6; for (let i = 0; i < L.wh; i++) { const yy = c + r * 0.55 + i * 1.3; g.beginPath(); g.moveTo(r * 0.25, yy + 0.4); g.lineTo(r * 0.62, yy); g.stroke(); } }
    if (L.scar) { g.strokeStyle = 'rgba(170,85,70,.55)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(r - 4.2, c - 2.4); g.lineTo(r - 3.8, c + 7); g.stroke(); }
    if (u.karma > 0 || (L.karma && u.isHero && Game.ultA > 0)) { const k = clamp(u.karma || Game.ultA || 0, 0, 1); g.strokeStyle = `rgba(20,20,30,${0.85 * k})`; g.lineWidth = 1.4; g.beginPath(); g.moveTo(r - 7.5, c + 0.5); g.lineTo(r - 10.5, c + 3); g.lineTo(r - 7.8, c + 6); g.stroke(); }
    if (L.mask) { g.fillStyle = '#2a2c36'; g.strokeStyle = '#121420'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-r * 0.3, c + 5); g.lineTo(r + 2.2, c + 5.5); g.lineTo(r + 0.6, c + r + 5.4); g.quadraticCurveTo(r * 0.3, c + r + 4.6, -0.8, c + r + 0.6); g.closePath(); g.fill(); g.stroke(); }
    // cheveux
    hair(g, L, D, lg, false, tint, C);
    // oreille
    g.fillStyle = sk; g.strokeStyle = skO; g.lineWidth = 0.9; g.beginPath(); g.moveTo(-3.2, c + 2.2); g.bezierCurveTo(-6.4, c + 1.4, -7, c + 6.6, -3.6, c + 7.4); g.lineTo(-3.2, c + 6.2); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-3.2, c + 2.2); g.bezierCurveTo(-6.4, c + 1.4, -7, c + 6.6, -3.6, c + 7.4); g.stroke(); g.strokeStyle = skD; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-3.9, c + 3.4); g.quadraticCurveTo(-5.4, c + 4.6, -4.2, c + 5.9); g.stroke();
    // bandeau
    if (L.band) { const bc = L.band === 2 ? '#555' : '#2a3a6a'; g.fillStyle = bc; g.strokeStyle = '#141a30'; g.lineWidth = 1; g.beginPath(); g.moveTo(-r - 1.2, c - 3.2); g.lineTo(r * 0.98, c - 5.2); g.lineTo(r * 1.0, c - 1.6); g.lineTo(-r - 1.2, c + 0.2); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#c8d2e4'; g.strokeStyle = '#59657e'; g.beginPath(); g.moveTo(r * 0.36, c - 4.9); g.lineTo(r * 0.94, c - 5.3); g.lineTo(r * 0.97, c - 1.7); g.lineTo(r * 0.36, c - 1.2); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = '#59657e'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(r * 0.55, c - 2.6); g.quadraticCurveTo(r * 0.72, c - 4.4, r * 0.9, c - 2.8); g.stroke(); if (L.band === 2) { g.beginPath(); g.moveTo(r * 0.4, c - 3.2); g.lineTo(r, c - 3.6); g.stroke(); }
      g.strokeStyle = bc; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-r - 1, c - 1.4); g.quadraticCurveTo(-r - 2.5 + lg, c + 1.5 + S.y, -r - 3.5 + lg * 1.2, c + 4.5); g.stroke(); }
    // lunettes (calque au-dessus de l'œil)
    if (L.glasses) { const x = r - 5.3, y = c + 3.2; g.save(); g.fillStyle = 'rgba(200,225,255,.12)'; g.strokeStyle = '#a8263a'; g.lineWidth = 0.9; g.beginPath(); g.roundRect ? g.roundRect(x - 2.9, y - 3.1, 5.6, 5, 1.5) : g.rect(x - 2.9, y - 3.1, 5.6, 5); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x + 2.7, y - 1.6); g.lineTo(r + 0.9, y - 2.2); g.stroke(); g.beginPath(); g.moveTo(r + 0.9, y - 3.2); g.lineTo(r + 1.7, y - 3.2); g.lineTo(r + 1.7, y + 1.8); g.lineTo(r + 0.9, y + 1.8); g.stroke(); g.beginPath(); g.moveTo(x - 2.9, y - 2.2); g.lineTo(-3.4, c + 3); g.stroke(); g.restore(); }
    if (u.hood) { g.fillStyle = L.cloak || '#30364f'; g.strokeStyle = dk(L.cloak || '#30364f', 2); g.lineWidth = 1.6; g.beginPath(); g.arc(-0.5, c, r + 2.6, Math.PI * 0.75, Math.PI * 2.05); g.lineTo(-r - 1, c + r + 4); g.closePath(); g.fill(); g.stroke(); }
    g.restore(); };
  window.HEAD10 = { H, hairDef };
})();
