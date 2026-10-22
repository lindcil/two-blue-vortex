// v0.9.5 — Susanoo plus fidèle à l'anime : couleur et armes selon l'utilisateur, bord lumineux qui vacille, montée flamme→os→chair→armure, squash/stretch façon ZZZ.
(() => { if (!window.MODE08 || !MODE08.drawSusanoo) return;
  const TAU = Math.PI * 2, cl = (v) => Math.max(0, Math.min(1, v));
  const USERS = { red: { c: '#ff3b3b', w: 'itachi' }, purple: { c: '#a46bff', w: 'sasuke' }, blue: { c: '#3d6bff', w: 'madara' }, green: { c: '#3dff8a', w: 'shisui' }, cyan: { c: '#5ee6ff', w: 'kakashi' } };
  MODE08.SUS_USERS = USERS;
  const sc = MODE08.susCol.bind(MODE08);
  MODE08.susCol = function () { if (Game.mode === 'voie' && Voie.me) { if (!Voie.me.susC || !USERS[Voie.me.susC]) Voie.me.susC = Object.keys(USERS)[Math.floor(Math.random() * 5)]; return USERS[Voie.me.susC].c; } return sc(); };
  const userOf = (c) => { for (const k in USERS) if (USERS[k].c === c) return USERS[k].w; return /^#ff/i.test(c) ? 'itachi' : 'sasuke'; };
  const base = MODE08.drawSusanoo;
  // silhouettes approximatives par stade (pour le bord lumineux) : [cx, cy, rx, ry]
  const SIL = [null, [0, -120, 92, 96], [10, -150, 120, 140], [0, -170, 150, 170], [0, -180, 175, 200], [0, -185, 190, 215]];
  const phaseCol = (b, c) => b < 0.35 ? '#ffffff' : b < 0.7 ? VFX9.mixW(c, 0.45) : c;
  const spr = (k, c) => SPR9.get(k, c);
  const blade = (g, x, y, a, L, c, lt) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = VFX9.ca(lt, 0.7); g.beginPath(); g.moveTo(-6, 0); g.lineTo(-9, -L * 0.7); g.quadraticCurveTo(-4, -L, 10, -L * 1.05); g.quadraticCurveTo(6, -L * 0.6, 7, 0); g.closePath(); g.fill(); g.strokeStyle = c; g.lineWidth = 2; g.stroke(); g.fillStyle = c; g.fillRect(-14, -3, 28, 6); g.restore(); };
  function weapons(g, w, lvl, c, lt, t, sw, a) { if (lvl < 4 || a <= 0) return; g.globalAlpha = a; g.globalCompositeOperation = 'lighter';
    if (w === 'sasuke') { // arc de Susanoo + flèche de flamme
      const pull = sw > 0 ? Math.sin(sw * Math.PI) : 0.15; g.save(); g.translate(-150, -150); g.strokeStyle = lt; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 130, -1.1, 1.1); g.stroke(); g.strokeStyle = c; g.lineWidth = 3; g.stroke(); const sx = Math.cos(1.1) * 130, sy = Math.sin(1.1) * 130, px = 40 + 70 * pull;
      g.lineWidth = 1.5; g.strokeStyle = VFX9.mixW(c, 0.7); g.beginPath(); g.moveTo(sx, -sy); g.lineTo(px, 0); g.lineTo(sx, sy); g.stroke(); g.fillStyle = VFX9.ca(lt, 0.85); g.beginPath(); g.moveTo(px, -3); g.lineTo(px - 210, -2); g.lineTo(px - 236, 0); g.lineTo(px - 210, 2); g.lineTo(px, 3); g.fill(); g.drawImage(spr('glow', c), px - 270, -30, 70, 60); g.restore(); }
    else if (w === 'madara') { // ailes + deux lames
      for (const s of [-1, 1]) { g.save(); g.translate(s * 60, -230); g.scale(s, 1); for (let i = 0; i < 6; i++) { const L = 130 + i * 18 + Math.sin(t * 3 + i) * 6, an = -0.5 + i * 0.22; g.save(); g.rotate(an); g.globalAlpha = a * (0.35 + 0.08 * i); g.drawImage(spr('lick', i % 2 ? lt : c), 0, -14, L, 28); g.restore(); } g.restore(); }
      g.globalAlpha = a; blade(g, 150, -70, 0.3 + sw * 1.6, 230, c, lt); blade(g, -150, -70, -0.3 - sw * 1.2, 230, c, lt); }
    else if (w === 'shisui') { g.save(); g.translate(140, -60); g.rotate(0.25 + sw * 1.4); g.strokeStyle = lt; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 60); g.lineTo(0, -260); g.stroke(); g.fillStyle = VFX9.ca(lt, 0.85); g.beginPath(); g.moveTo(-12, -250); g.lineTo(0, -310); g.lineTo(12, -250); g.fill(); g.restore();
      for (let i = 0; i < 6; i++) { const an = t * 1.2 + i * TAU / 6; g.save(); g.translate(Math.cos(an) * 170, -170 + Math.sin(an) * 50); g.rotate(an); g.fillStyle = lt; g.fillRect(-12, -1.5, 24, 3); g.restore(); } }
    else if (w === 'kakashi') { blade(g, 150, -70, 0.35 + sw * 1.8, 220, c, lt); g.save(); g.translate(-150, -120); g.rotate(t * 5 + sw * 9); g.fillStyle = VFX9.ca(lt, 0.8); for (let i = 0; i < 3; i++) { g.rotate(TAU / 3); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(50, -10, 62, 18); g.quadraticCurveTo(30, 6, 0, 10); g.fill(); } g.fillStyle = '#000a'; g.beginPath(); g.arc(0, 0, 9, 0, TAU); g.fill(); g.restore(); }
    g.globalCompositeOperation = 'source-over'; }
  MODE08.drawSusanoo = function (g, x, y, lvl, c, o = {}) { o = o || {}; const t = o.t || 0, b = o.build == null ? 1 : o.build, sw = o.sw || 0, face = o.face || 1, tier = window.Q9 ? Q9.tier : 2, rf = typeof Save !== 'undefined' && Save.set && Save.set.rf !== false;
    const w = userOf(c), lt = VFX9.mixW(c, 0.55), K = lvl >= 5 ? 1.5 : 1 + (lvl - 1) * 0.05, S = SIL[Math.max(1, Math.min(5, lvl))];
    // squash/stretch : ramassé pendant l'élan, étiré pendant le coup, rebond à la fin de la formation
    const pop = b < 1 ? 0 : 0, form = b > 0.85 && b < 1 ? Math.sin((b - 0.85) / 0.15 * Math.PI) * 0.08 : 0, ph = sw > 0 ? Math.sin(sw * Math.PI * 2) : 0;
    const sx = 1 + 0.16 * Math.max(0, ph) - 0.08 * Math.max(0, -ph) - form * 0.5, sy = 1 - 0.12 * Math.max(0, ph) + 0.1 * Math.max(0, -ph) + form;
    const dy = lvl <= 2 ? 70 : 40; // l'utilisateur flotte au centre de la cage
    g.save(); g.translate(x, y); g.scale(sx, sy); g.translate(-x, -y);
    // couches translucides derrière : halo en couches + bord lumineux qui vacille
    g.save(); g.translate(x, y + dy); g.scale(K * face, K); g.globalCompositeOperation = 'lighter'; const pc = phaseCol(b, c), a0 = cl(b * 1.6);
    for (let i = 0; i < 3; i++) { const k = 1 - i * 0.18; g.globalAlpha = (0.1 + i * 0.05) * a0; g.drawImage(spr('glow', i ? c : pc), S[0] - S[2] * 1.3 * k, S[1] - S[3] * 1.3 * k, S[2] * 2.6 * k, S[3] * 2.6 * k); }
    const n = [10, 22, 36][tier] + lvl * 3, lick = spr('lick', c), lickL = spr('lick', lt);
    for (let i = 0; i < n; i++) { const an = i / n * TAU, f = Math.sin(t * 8 + i * 1.7), ex = Math.cos(an), ey = Math.sin(an); if (ey > 0.6) continue; const L = (22 + 14 * f) * (1 + lvl * 0.08);
      g.save(); g.translate(S[0] + ex * S[2], S[1] + ey * S[3]); g.rotate(Math.atan2(ey * 0.5 - 0.9, ex * 0.5) + Math.PI / 2); g.globalAlpha = (0.18 + 0.14 * f) * a0; g.drawImage(f > 0.3 ? lickL : lick, -L * 0.35, -L * 1.3, L * 0.7, L * 1.5); g.restore(); }
    g.restore();
    base.call(MODE08, g, x, y + dy, lvl, c, Object.assign({}, o, { alt: w !== 'itachi' }));
    g.save(); g.translate(x, y + dy); g.scale(K * face, K); weapons(g, w, lvl, c, lt, t, sw, cl((b - 0.8) * 5)); g.restore();
    // phase de formation : teinte os (blanc) → chair (clair) → armure (couleur)
    if (b < 1) { g.save(); g.translate(x, y + dy); g.scale(K * face, K); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (rf ? 0.12 : 0.25) * (1 - b); g.drawImage(spr('glow', pc), S[0] - S[2], S[1] - S[3], S[2] * 2, S[3] * 2); g.restore(); }
    // ombre de lévitation sous l'utilisateur
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 0.25; g.fillStyle = c; g.beginPath(); g.ellipse(x, y + 6, 26 + Math.sin(t * 3) * 3, 6, 0, 0, TAU); g.fill();
    g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; };
  // la caméra et l'impact du coup : petit hitstop + secousse adoucie
  const sw0 = MODE08.swing && MODE08.swing.bind(MODE08); if (sw0) MODE08.swing = function (u) { sw0(u); try { Cam.shake((Save.set && Save.set.rf === false) ? 0.3 : 0.15); } catch (e) {} };
})();
