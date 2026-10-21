// v0.10.8 — « Lookmaxing » : visages anime (iris, reflet, cils, sourcils, nez, bouche, expressions, clignement, dōjutsu dans l'œil),
// silhouettes de cheveux canon, moustaches Uzumaki, vraies vues de face / ¾ / dos, cou, respiration, cheveux et écharpe à ressort, LOD.
(() => {
  // ---------- looks canon supplémentaires ----------
  Object.assign(LOOKS.boruto, { hs: 'boruto', wh: 2, brow: '#c9a640' });
  Object.assign(LOOKS.himawari, { hs: 'hima', wh: 2 });
  Object.assign(LOOKS.sarada, { hs: 'sarada', eye: '#2a2232' });
  Object.assign(LOOKS.kawaki, { hs: 'kawaki' });
  Object.assign(LOOKS.code, { hs: 'code' });
  Object.assign(LOOKS.clone, { hs: 'boruto', wh: 2 });
  LOOKS.naruto = LOOKS.naruto || { hair: '#f2c94c', hs: 'naruto', wh: 3, skin: '#f0c49a', eye: '#3a8cff', top: '#f07a2a', bot: '#1b1f2e', cloak: '#f4f1ea', band: 1 };
  LOOKS.sasuke = LOOKS.sasuke || { hair: '#1a1a26', hs: 'sasuke', skin: '#efd2b8', eye: '#1a1a26', top: '#2a2438', bot: '#1b1b26', cloak: '#3a3448', sword: 1 };
  LOOKS.mitsuki = LOOKS.mitsuki || { hair: '#cfe0e8', hs: 'mitsuki', skin: '#e4ecef', eye: '#f2c23a', snake: 1, top: '#f2f2f2', bot: '#3a3a5a', band: 1 };
  const DOJ = { sharingan: '#e0202e', byakugan: '#e8eaf6', jogan: '#7ad0ff', rinnegan: '#a48ad8' };
  const eyeOf = (u, L) => { const f = u.md && u.md.fam; if (f && DOJ[f]) return [DOJ[f], f]; if (u.eyeFx) { const e = String(u.eyeFx).toLowerCase(); if (/^#(d0283a|ff3b4a|e0202e)$/.test(e)) return [DOJ.sharingan, 'sharingan']; return [u.eyeFx, 'fx']; } return [L.eye || '#3a2a1e', L.snake ? 'snake' : null]; };
  // ---------- vue selon le cap ----------
  const viewOf = (u) => { if (u.hd == null) return ['side', 0]; const vz = -Math.sin(u.hd); return vz > 0.45 ? ['back', vz] : ['side', vz]; };
  // ---------- expression ----------
  const exprOf = (u, P) => { const a = u.act; if (u.flash > 0 || (u.hurtT || 0) > 0 || (a && a.k === 'hurt')) return 'hurt'; if (a && (a.k === 'm1' || a.k === 'cast' || a.k === 'ult' || a.k === 'dash')) return 'shout'; if (P.mouth > 0.5) return 'shout'; if (u.combat || u.aggro) return 'angry'; return 'neutral'; };
  // ---------- ressorts (cheveux / écharpe) ----------
  const spring = (u, dt) => { const S = u.spr10 || (u.spr10 = { x: 0, v: 0, y: 0, vy: 0 }); const tx = -Math.max(-1, Math.min(1, (u.vx || 0) * (u.face || 1) / 420)) * 7, ty = Math.max(-1, Math.min(1, (u.vy || 0) / 420)) * 3;
    S.v += ((tx - S.x) * 120 - S.v * 9) * dt; S.x += S.v * dt; S.vy += ((ty - S.y) * 120 - S.vy * 9) * dt; S.y += S.vy * dt; };
  const gu = Game.update.bind(Game); Game.update = function (dt) { const r = gu(dt); if (this.hero && !this.titleMode) { spring(this.hero, dt); for (const f of World.foes_) if (!f.gone) spring(f, dt); for (const a of this.allies || []) spring(a, dt); for (const n of World.npcs || []) if (Math.abs(n.x - Cam.x) < 900) spring(n, dt); } return r; };
  // respiration au repos
  const po = poseOf; poseOf = function (u) { const P = po(u); if (!u || u.act || Math.hypot(u.vx || 0, u.vy || 0) > 30) return P; const b = Math.sin(Game.t * 2.2 + (u.x || 0) * 0.01); return Object.assign({}, P, { by: (P.by || 0) + b * 0.7, sy: (P.sy || 1) * (1 + b * 0.012), aF: P.aF + b * 0.04, aB: P.aB - b * 0.04 }); };
  // ---------- dessin ----------
  const old = drawHead;
  const LOD = (u) => { if (u.isHero || u.boss || (Game.allies || []).includes(u)) return 0; if (Save.set.low) return 1; const d = Math.hypot(u.x - Cam.x, u.y - Cam.y); return d > 700 ? 1 : 0; };
  const line = (g, pts, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); };
  // un œil anime. sx < 1 = vu de biais
  function eye(g, x, y, sc, sx, col, doj, ex, blink, side) { g.save(); g.translate(x, y); g.scale(sc, sc); g.lineCap = 'round';
    if (blink || ex === 'hurt') { g.strokeStyle = '#2a1c22'; g.lineWidth = 1.3; g.beginPath(); if (ex === 'hurt') { g.moveTo(-2.3, 0.2); g.quadraticCurveTo(0, -1.4, 2.3, 0.2); } else { g.moveTo(-2.4, 0.6); g.quadraticCurveTo(0, 2, 2.4, 0.6); } g.stroke(); g.restore(); return; }
    const h = ex === 'angry' || ex === 'shout' ? 3.4 : 3.9;
    g.fillStyle = '#fbfbff'; g.beginPath(); g.ellipse(0, 0.4, 2.5, h, 0, 0, TAU); g.fill();
    const ir = doj === 'byakugan' ? '#dfe3f4' : col; const gr = g.createLinearGradient(0, -h, 0, h); gr.addColorStop(0, shade(shade(ir))); gr.addColorStop(0.55, ir); gr.addColorStop(1, ir); g.fillStyle = gr; g.beginPath(); g.ellipse(0.5, 0.8, 1.95, h - 0.5, 0, 0, TAU); g.fill();
    if (doj === 'sharingan') { g.fillStyle = 'rgba(20,10,14,.85)'; for (let i = 0; i < 3; i++) { const a = i * TAU / 3 + Game.t * 3; g.beginPath(); g.arc(0.5 + Math.cos(a) * 1.15, 1 + Math.sin(a) * 1.5, 0.42, 0, TAU); g.fill(); } }
    else if (doj === 'jogan') { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(0.5, 1, 0.8, 0, TAU); g.fill(); }
    else if (doj === 'snake') { g.fillStyle = 'rgba(30,20,10,.85)'; g.beginPath(); g.ellipse(0.6, 1, 0.45, 2.2, 0, 0, TAU); g.fill(); }
    else if (doj !== 'byakugan') { g.fillStyle = 'rgba(16,14,30,.55)'; g.beginPath(); g.ellipse(0.6, 1.1, 1.1, 1.7, 0, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.ellipse(1.2, -0.6, 0.9, 1.1, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(-0.2, 2.3, 0.45, 0, TAU); g.fill();
    g.strokeStyle = '#2a1c22'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-2.4, -h * 0.5); g.quadraticCurveTo(0, -h - 0.5, 2.6, -h * 0.45); g.stroke();
    g.restore(); }
  function brow(g, x, y, sx, ex, c, side) { const a = ex === 'angry' || ex === 'shout' ? 1.1 : ex === 'hurt' ? -0.9 : 0; g.strokeStyle = c; g.lineWidth = 1.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 2.8 * sx, y - 0.2 - a * side * 0.3); g.lineTo(x + 2.8 * sx, y - 0.6 + a * side * 0.6); g.stroke(); }
  function mouth(g, x, y, ex, sx, mo) { g.strokeStyle = INK; g.lineWidth = 1.4; g.lineCap = 'round';
    if (ex === 'shout' || mo > 0.5) { g.fillStyle = '#7a3a42'; g.beginPath(); g.moveTo(x - 1.2 * sx, y - 0.2); g.lineTo(x + 1.2 * sx, y - 0.2); g.quadraticCurveTo(x + 0.8 * sx, y + 1.7, x, y + 1.7); g.quadraticCurveTo(x - 0.8 * sx, y + 1.7, x - 1.2 * sx, y - 0.2); g.fill(); return; g.fillStyle = '#d85a6a'; g.beginPath(); g.ellipse(x, y + 2.6, 1.2 * sx, 0.7, 0, 0, TAU); g.fill(); return; }
    if (ex === 'hurt') { g.fillStyle = 'rgba(110,50,55,.7)'; g.beginPath(); g.ellipse(x, y + 0.6, 0.9 * sx, 0.8, 0, 0, TAU); g.fill(); return; }
    g.strokeStyle = 'rgba(80,40,40,.75)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(x - 1.2 * sx, y); g.quadraticCurveTo(x, y + (ex === 'angry' ? -0.3 : 0.6), x + 1.2 * sx, y); g.stroke(); }
  // cheveux : forme canon. fr = 1 face, 0 profil. lg = traînée ressort
  function hairBack(g, L, hy, R, fr, lg, C, ink, tint) { g.fillStyle = C(L.hair); g.strokeStyle = ink; g.lineWidth = 2.4; const hs = L.hs; g.beginPath();
    if (hs === 'sarada' || hs === 'hima' || hs === 'bob') { g.ellipse(lg * 0.3, hy + 1, R * 1.15, R * 1.12, 0, 0, TAU); }
    else if (hs === 'mitsuki') { g.moveTo(-R, hy - 2); g.quadraticCurveTo(-R - 3 + lg, hy + 10, -R + 2 + lg * 1.4, hy + 15); g.lineTo(R - 2 + lg * 0.6, hy + 15); g.quadraticCurveTo(R + 2, hy + 8, R, hy - 2); g.closePath(); }
    else if (hs === 'long' || hs === 'code') { g.moveTo(-R + 1, hy - 4); g.quadraticCurveTo(-R - 4 + lg, hy + 12, -R + 1 + lg * 1.5, hy + 22); g.lineTo(-2 + lg, hy + 18); g.lineTo(2, hy); g.closePath(); }
    else if (hs === 'sasuke') { g.moveTo(-R + 2, hy - 8); for (let i = 0; i < 4; i++) { g.lineTo(-R - 7 + lg - i * 0.5, hy - 10 + i * 5); g.lineTo(-R + 1, hy - 6 + i * 5); } g.closePath(); }
    else if (hs === 'pony') { g.moveTo(-9, hy - 10); g.quadraticCurveTo(-22 + lg, hy - 8, -18 + lg * 2, hy + 18); g.quadraticCurveTo(-12 + lg, hy + 4, -6, hy - 4); g.closePath(); }
    else if (hs === 'buns') { g.arc(-9, hy - 12, 5.5, 0, TAU); g.moveTo(11.5, hy - 12); g.arc(6, hy - 12, 5.5, 0, TAU); }
    else { g.restore && 0; g.beginPath(); g.closePath(); return; }
    g.fill(); if (!tint) g.stroke(); }
  function spikes(g, cx, hy, R, n, len, spread, lg, tilt) { for (let i = 0; i <= n; i++) { const a = Math.PI + (Math.PI - spread * 2) * (i / n) + spread + tilt; const l = len * (i % 2 ? 1 : 0.8); g.lineTo(cx + Math.cos(a) * (R + l) + lg * (1 - i / n), hy + Math.sin(a) * (R + l) * 0.95); g.lineTo(cx + Math.cos(a + 0.2) * (R - 1), hy + Math.sin(a + 0.2) * (R - 1)); } }
  function hairFront(g, L, hy, R, fr, lg, C, ink, tint, back) { const hs = L.hs; g.fillStyle = C(L.hair); g.strokeStyle = ink; g.lineWidth = 2.4; g.beginPath();
    const off = fr ? 0 : -1.5;
    if (back) { g.ellipse(off, hy - 1, R * 1.06, R * 1.04, 0, 0, TAU); g.fill(); if (!tint) g.stroke(); g.beginPath(); if (hs === 'boruto' || hs === 'naruto' || hs === 'spiky' || hs === 'sasuke' || hs === 'kawaki' || hs === 'messy') { g.moveTo(-R, hy - 2); spikes(g, 0, hy - 2, R, 6, hs === 'kawaki' || hs === 'messy' ? 5 : 8, 0.2, lg * 0.4, 0); g.lineTo(R, hy - 2); g.closePath(); g.fill(); if (!tint) g.stroke(); } return; }
    if (hs === 'boruto' || hs === 'naruto' || hs === 'spiky') { const big = hs === 'naruto' ? 9 : 7; g.moveTo(-R - 1 + off, hy + 2); spikes(g, off, hy - 2, R, fr ? 8 : 7, big, fr ? 0.05 : 0.15, lg, fr ? 0 : -0.1); g.lineTo(R + 1, hy - 1);
      if (fr) { g.lineTo(R - 1, hy - 6); for (let i = 0; i < 5; i++) { g.lineTo(R - 3 - i * 4.4, hy - 4.5 + (i % 2) * 1.5 + (hs === 'boruto' && i === 1 ? 2.5 : 0)); g.lineTo(R - 5 - i * 4.4, hy - 8); } } else { g.lineTo(9, hy - 6); g.lineTo(6, hy - 4 + (hs === 'boruto' ? 2 : 0)); g.lineTo(4, hy - 8); } g.closePath(); }
    else if (hs === 'sasuke') { g.moveTo(R, hy - 2); g.quadraticCurveTo(R - 1, hy - 14, -1, hy - 13); g.lineTo(-R - 6 + lg, hy - 12); g.lineTo(-R, hy - 7); g.lineTo(-R - 5 + lg, hy - 4); g.lineTo(-R, hy + 1); g.quadraticCurveTo(-R, hy - 10, 2, hy - 11); g.lineTo(fr ? 4 : 7, hy + 6); g.lineTo(fr ? 1 : 4, hy - 6); g.lineTo(fr ? -5 : -2, hy + 3); g.lineTo(-4, hy - 9); g.closePath(); }
    else if (hs === 'sarada' || hs === 'bob' || hs === 'hima') { g.moveTo(R + 1, hy + (fr ? 6 : 0)); g.quadraticCurveTo(R + 1, hy - 15, 0, hy - 13.5); g.quadraticCurveTo(-R - 2, hy - 12, -R - 1, hy + 7); g.lineTo(-R + 4, hy + 7); g.lineTo(-R + 3, hy - 4); if (fr) { g.lineTo(-3, hy - 6); g.lineTo(-1, hy - 3); g.lineTo(3, hy - 7); g.lineTo(R - 3, hy - 3); g.lineTo(R - 2, hy + 6); } else { g.lineTo(3, hy - 7); g.lineTo(7, hy - 4); } g.closePath(); }
    else if (hs === 'mitsuki') { g.moveTo(R + 0.5, hy + 1); g.quadraticCurveTo(R + 1, hy - 14, 0, hy - 13.5); g.quadraticCurveTo(-R - 1, hy - 12, -R - 0.5, hy + 5); g.lineTo(-R + 3, hy + 3); g.lineTo(-R + 3, hy - 5); g.lineTo(1, hy - 7); g.lineTo(4, hy - 5); g.lineTo(7, hy - 7.5); g.lineTo(R - 1, hy - 5); g.closePath(); }
    else if (hs === 'kawaki' || hs === 'messy') { g.moveTo(-R - 1, hy + 3); for (let i = 0; i < 7; i++) { const a = Math.PI + 0.1 + (i / 6) * (Math.PI - 0.2); g.lineTo(Math.cos(a) * (R + 5 + (i % 2) * 2) + lg, hy - 1 + Math.sin(a) * (R + 3)); g.lineTo(Math.cos(a + 0.25) * (R - 1), hy - 2 + Math.sin(a + 0.25) * (R - 1)); } g.lineTo(R, hy + 2); g.lineTo(fr ? 2 : 8, hy - 3); g.lineTo(fr ? -2 : 5, hy + 1); g.closePath(); }
    else if (hs === 'code' || hs === 'slick') { g.moveTo(R - 2, hy - 6); g.quadraticCurveTo(4, hy - 16, -6, hy - 13); g.lineTo(-R - 7 + lg, hy - 11); g.lineTo(-R, hy - 6); g.lineTo(-R - 6 + lg, hy - 2); g.lineTo(-R, hy); g.lineTo(-R - 1, hy + 3); g.quadraticCurveTo(-R - 2, hy - 10, 0, hy - 12.5); g.closePath(); }
    else if (hs === 'pineapple') { g.moveTo(-6, hy - 9); for (let i = 0; i < 5; i++) { g.lineTo(-12 + i * 3 + lg, hy - 22 - (i % 2) * 5); g.lineTo(-9 + i * 3, hy - 13); } g.lineTo(R - 1, hy - 4); g.quadraticCurveTo(0, hy - 14, -R, hy - 2); g.closePath(); }
    else if (hs === 'buzz') { g.moveTo(R, hy - 4); g.quadraticCurveTo(4, hy - 14, -6, hy - 12); g.quadraticCurveTo(-R - 1, hy - 9, -R - 1, hy - 1); g.lineTo(-9, hy - 4); g.quadraticCurveTo(0, hy - 10, R, hy - 4); }
    else if (hs === 'bald') { g.moveTo(-R, hy - 2); g.lineTo(-9, hy - 6); g.lineTo(-7, hy); g.closePath(); }
    else { g.moveTo(R, hy - 3); g.quadraticCurveTo(8, hy - 15, -2, hy - 13.5); g.quadraticCurveTo(-R - 1, hy - 12, -R - 0.5, hy + 2); g.lineTo(-7, hy - 1); g.lineTo(0, hy - 8); g.lineTo(5, hy - 5); g.closePath(); }
    if (!tint) { g.lineWidth = 4; g.stroke(); } g.fill(); }
  const OLDHS = { boruto: 'spiky', naruto: 'spiky', sarada: 'bob', hima: 'bob', kawaki: 'messy', code: 'slick', sasuke: 'slick', mitsuki: 'bob' };
  drawHead = function (g, u, L, C, ink, tint, kid, vel, wav, P) { if (LOD(u) || L.ghost && tint) { const h = OLDHS[L.hs]; if (h) { const a = [...arguments]; a[2] = Object.assign({}, L, { hs: h }); return old.apply(this, a); } return old.apply(this, arguments); }
    const R = kid ? 12.5 : 11.5, hy = -10, S = u.spr10 || { x: 0, y: 0 }, lg = S.x * 1.2 - vel * 3; const [view] = viewOf(u); const back = view === 'back' || view === 'qback'; const fr = view === 'front' ? 1 : view === 'q' ? 0.5 : 0;
    // cou
    g.fillStyle = C(shade(L.skin)); g.strokeStyle = ink; g.lineWidth = 2; g.beginPath(); g.rect(-3.2, hy + R - 3, 6.4, 6); g.fill(); if (!tint) g.stroke();
    if (!back) hairBack(g, L, hy, R, fr, lg, C, ink, tint);
    // crâne/visage : profil légèrement en pointe vers l'avant (menton)
    g.fillStyle = C(L.skin); g.strokeStyle = ink; g.lineWidth = 2.6; g.beginPath();
    if (fr === 1) { g.moveTo(-R, hy - 2); g.quadraticCurveTo(-R, hy - R - 1, 0, hy - R - 1); g.quadraticCurveTo(R, hy - R - 1, R, hy - 2); g.quadraticCurveTo(R - 1, hy + 7, 0, hy + R + 0.5); g.quadraticCurveTo(-R + 1, hy + 7, -R, hy - 2); }
    else { g.moveTo(-R, hy); g.quadraticCurveTo(-R, hy - R - 1, 0, hy - R - 1); g.quadraticCurveTo(R + 0.5, hy - R, R + 0.5, hy - 1); g.quadraticCurveTo(R + 1, hy + 6, R - 2 + fr * -2, hy + R - 1); g.quadraticCurveTo(2, hy + R + 1.5, -4, hy + R - 1); g.quadraticCurveTo(-R, hy + 7, -R, hy); }
    g.fill(); if (!tint) g.stroke();
    if (!tint && !back) { const [col, doj] = eyeOf(u, L); const ex = exprOf(u, P); const blink = ex !== 'shout' && (Math.sin(Game.t * 0.9 + (u.x || 0) * 0.013) > 0.992 || Math.sin(Game.t * 1.37 + (u.y || 0)) > 0.996); const ey = hy + 0.5;
      const bc = L.brow || shade(L.hair === '#e8e8f0' ? '#b0b0c0' : L.hair);
      eye(g, 4.8, ey, 1, 1, col, doj, ex, blink, 1); brow(g, 5, ey - 5.6, 0.8, ex, bc, 1); line(g, [R - 1.2, ey + 2.6, R - 0.4, ey + 3.6], 0.9, 'rgba(150,90,70,.5)'); mouth(g, 7, hy + 7.4, ex, 0.8, P.mouth);
      // joues / moustaches
      if (L.wh) { g.strokeStyle = 'rgba(90,60,45,.45)'; g.lineWidth = 0.7; for (let i = 0; i < L.wh; i++) { const yy = ey + 3.5 + i * 1.6; if (fr === 1) for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 4.5, yy); g.lineTo(sd * 8, yy - 0.6 + i * 0.4); g.stroke(); } else { g.beginPath(); g.moveTo(3.2, yy + 0.6); g.lineTo(6, yy + 0.2 + i * 0.3); g.stroke(); } } }
      if (ex !== 'hurt' && ex !== 'angry') { g.fillStyle = 'rgba(255,130,130,.12)'; g.beginPath(); g.ellipse(3, ey + 4.6, 1.8, 0.9, 0, 0, TAU); g.fill(); }
      if (L.scar) { g.strokeStyle = 'rgba(178,90,74,.7)'; g.lineWidth = 1; const sx = fr === 1 ? 4.4 : 6.4; g.beginPath(); g.moveTo(sx, ey - 7); g.lineTo(sx + 0.6, ey + 5.5); g.stroke(); }
      if (L.glasses) { g.save(); g.lineJoin = 'round'; g.fillStyle = 'rgba(200,225,255,.14)'; g.strokeStyle = '#a8263a'; g.lineWidth = 1;
        g.beginPath(); g.roundRect ? g.roundRect(1.7, ey - 3.3, 6.2, 5.9, 1.8) : g.rect(1.7, ey - 3.3, 6.2, 5.9); g.fill(); g.stroke(); // verre proche
        g.beginPath(); g.moveTo(7.9, ey - 1.6); g.lineTo(R + 0.6, ey - 1.9); g.stroke(); // pont vers le verre lointain
        g.beginPath(); g.moveTo(R + 0.4, ey - 3.4); g.lineTo(R + 1.6, ey - 3.4); g.lineTo(R + 1.6, ey + 2.6); g.lineTo(R + 0.4, ey + 2.6); g.stroke(); // verre lointain (raccourci)
        g.beginPath(); g.moveTo(1.7, ey - 2.4); g.lineTo(-4.5, ey - 3.2); g.stroke(); g.restore(); } // branche vers l'oreille
      
      if (u.karma > 0 || (L.karma && u.isHero && Game.ultA > 0)) { const k = clamp(u.karma || Game.ultA || 0, 0, 1); g.strokeStyle = `rgba(20,20,30,${0.9 * k})`; g.lineWidth = 1.8; const kx = fr === 1 ? -4.4 : -3; g.beginPath(); g.moveTo(kx, ey - 6); g.lineTo(kx - 5 - 3 * k, ey - 2); g.lineTo(kx - 1, ey + 4 * k); g.stroke(); }
      if (L.mask) { g.fillStyle = '#2a2c36'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(-R + 1, hy + 2); g.lineTo(R, hy + 2); g.quadraticCurveTo(R - 2, hy + R, 0, hy + R); g.quadraticCurveTo(-R + 2, hy + R - 1, -R + 1, hy + 2); g.fill(); g.stroke(); } }
    if (!back && !tint) { g.save(); g.beginPath(); g.rect(-60, -80, 120, 140); g.moveTo(-4, hy - 4.6); g.lineTo(R + 6, hy - 4.6); g.lineTo(R + 6, hy + R + 4); g.lineTo(-4, hy + R + 4); g.closePath(); g.clip('evenodd'); hairFront(g, L, hy, R, fr, lg, C, ink, tint, back); g.restore(); } else hairFront(g, L, hy, R, fr, lg, C, ink, tint, back);
    if (L.band && !tint) { g.fillStyle = L.band === 2 ? '#555' : '#2a3a6a'; g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-R, hy - 7.5); g.lineTo(R, hy - 6.5); g.lineTo(R, hy - 3); g.lineTo(-R, hy - 4); g.closePath(); g.fill(); g.stroke();
      if (!back) { const px = fr === 1 ? -3.5 : 2.5; g.fillStyle = '#c8d2e4'; g.fillRect(px, hy - 7.4, 7, 4.2); g.strokeRect(px, hy - 7.4, 7, 4.2); g.beginPath(); g.moveTo(px + 1.5, hy - 5.2); g.quadraticCurveTo(px + 3.5, hy - 7, px + 5.5, hy - 5.2); g.stroke(); if (L.band === 2) { g.beginPath(); g.moveTo(px, hy - 5.3); g.lineTo(px + 7, hy - 5.3); g.stroke(); } }
      else { g.strokeStyle = '#2a3a6a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-1, hy - 5); g.quadraticCurveTo(-6 + lg, hy + 2 + S.y, -9 + lg * 1.4, hy + 7); g.moveTo(1, hy - 5); g.quadraticCurveTo(-2 + lg, hy + 3, -4 + lg * 1.4, hy + 9); g.stroke(); } }
    if (u.hood && !tint) { g.fillStyle = L.cloak || '#30364f'; g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.arc(-1, hy - 1, R + 2.5, Math.PI * 0.82, Math.PI * 2.08); g.lineTo(-13, hy + 12); g.closePath(); g.fill(); g.stroke(); } };
  // la vue de dos de v0.10.7 (cheveux plaqués) est remplacée par le rendu ci-dessus
  window.LOOK10 = { viewOf, exprOf, eye, LOD };
})();
