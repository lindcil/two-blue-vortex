// v0.9 — Susanoo redessiné : flammes de chakra translucides au bord mouvant, vraie anatomie (côtes, crâne, radius/cubitus),
// humanoïde au visage de tengu, plaques d’armure, épaulières, casque à cimier, magatama, noyau lumineux, assemblage progressif,
// scintillement des flammes au repos, rubans de l’épée, bouclier de Yata. Formes précalculées une fois (aucune allocation par image).
(() => { if (!window.MODE08) return;
  const TAU2 = Math.PI * 2, cl = (v) => Math.max(0, Math.min(1, v));
  const ca = (c, a) => VFX9.ca(c, a), W = (c, k) => VFX9.mixW(c, k);
  // --- géométrie ---
  const bez = (p0, p1, p2, p3, n = 10) => { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; };
  const ell = (cx, cy, rx, ry, a0 = 0, a1 = TAU2, n = 18) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const mir = (pts) => pts.map(([x, y]) => [-x, y]);
  const prep = (P) => { let L = 0; const cum = [0]; for (let i = 1; i < P.pts.length; i++) { L += Math.hypot(P.pts[i][0] - P.pts[i - 1][0], P.pts[i][1] - P.pts[i - 1][1]); cum.push(L); } P.L = L; P.cum = cum;
    // échantillons pour les flammes du bord (position + normale)
    P.smp = []; if (P.fl) { const st = P.fl; for (let d = 0; d < L; d += st) { let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const a = P.pts[i - 1], b = P.pts[i], k = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); const x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k; let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl; if (P.out && (nx * (x - P.out[0]) + ny * (y - P.out[1])) < 0) { nx = -nx; ny = -ny; } P.smp.push([x, y, nx, ny, d / L]); } } return P; };
  // une pièce = { pts, w (trait), fill (alpha), fl (pas des flammes), out (centre pour orienter les normales), s0/s1 (fenêtre d’assemblage), arm (pivot pour l’épée), kind }
  const part = (o) => prep(Object.assign({ w: 4, s0: 0, s1: 0.2 }, o));
  const BUILD = {};
  const shapes = (lvl) => { if (BUILD[lvl]) return BUILD[lvl]; const A = [];
    // 1 — cage thoracique : colonne, 7 paires de côtes, clavicules, bassin
    A.push(part({ pts: bez([0, -10], [8, -70], [-8, -140], [0, -205], 14), w: 7, fl: 26, out: [0, -110], s0: 0, s1: 0.18 }));
    [40, 58, 70, 76, 72, 62, 48].forEach((w, i) => { const y = -190 + i * 22; const R = bez([0, y], [w * 0.7, y - 16], [w * 1.05, y + 8], [w * 0.82, y + 30], 8); A.push(part({ pts: R, w: 5, fl: 30, out: [0, -110], s0: 0.06 + i * 0.03, s1: 0.2 + i * 0.03 })); A.push(part({ pts: mir(R), w: 5, fl: 30, out: [0, -110], s0: 0.06 + i * 0.03, s1: 0.2 + i * 0.03 })); });
    A.push(part({ pts: [[-80, -206], [0, -198], [80, -206]], w: 6, fl: 30, out: [0, -120], s0: 0.2, s1: 0.32 }));
    A.push(part({ pts: bez([-55, -10], [-60, 20], [60, 20], [55, -10], 10), w: 6, fl: 28, out: [0, -60], s0: 0.02, s1: 0.16 }));
    if (lvl >= 2) { // 2 — squelette : crâne, mâchoire, dents, cervicales, bras à deux os, mains
      A.push(part({ pts: ell(0, -240, 34, 38, Math.PI * 0.85, Math.PI * 2.15, 20), w: 5, fill: 0.14, fl: 18, out: [0, -240], s0: 0.3, s1: 0.45, kind: 'skull' }));
      A.push(part({ pts: [[-26, -226], [-22, -206], [-10, -198], [10, -198], [22, -206], [26, -226]], w: 5, fl: 22, out: [0, -230], s0: 0.38, s1: 0.48 }));
      for (let i = -2; i <= 2; i++) A.push(part({ pts: [[i * 7, -206], [i * 7, -198]], w: 2.5, s0: 0.45, s1: 0.5 }));
      for (const s of [-1, 1]) { A.push(part({ pts: [[s * 78, -204], [s * 112, -150], [s * 124, -128]], w: 7, fl: 24, out: [s * 60, -160], s0: 0.32, s1: 0.45, arm: s })); A.push(part({ pts: [[s * 120, -128], [s * 136, -70]], w: 4.5, fl: 30, out: [s * 100, -100], s0: 0.42, s1: 0.52, arm: s })); A.push(part({ pts: [[s * 128, -126], [s * 124, -68]], w: 4, s0: 0.42, s1: 0.52, arm: s }));
        for (let f = 0; f < 4; f++) A.push(part({ pts: [[s * 130, -66], [s * (128 + f * 5), -44 + (f % 2) * 4], [s * (130 + f * 6), -30]], w: 3, s0: 0.5, s1: 0.56, arm: s })); }
    }
    A.boneN = A.length;
    if (lvl >= 3) { // 3 — humanoïde : chair spectrale, visage de tengu, sourcils, crocs, magatama
      const torso = [[-108, -204], [-120, -150], [-104, -90], [-80, -40], [-60, 0], [60, 0], [80, -40], [104, -90], [120, -150], [108, -204], [60, -218], [-60, -218], [-108, -204]];
      A.push(part({ pts: torso, w: 4, fill: 0.16, fl: 20, out: [0, -110], s0: 0.5, s1: 0.68, kind: 'flesh' }));
      A.push(part({ pts: ell(0, -248, 40, 46, 0, TAU2, 24), w: 4, fill: 0.2, fl: 16, out: [0, -248], s0: 0.55, s1: 0.68, kind: 'face' }));
      A.push(part({ pts: [[-2, -254], [62, -236], [4, -230]], w: 4, fill: 0.35, s0: 0.62, s1: 0.72, kind: 'nose' }));
      A.push(part({ pts: [[-30, -268], [-8, -258]], w: 5, s0: 0.62, s1: 0.7 })); A.push(part({ pts: [[30, -268], [8, -258]], w: 5, s0: 0.62, s1: 0.7 }));
      A.push(part({ pts: [[-14, -214], [-10, -200]], w: 3, s0: 0.66, s1: 0.72 })); A.push(part({ pts: [[14, -214], [10, -200]], w: 3, s0: 0.66, s1: 0.72 }));
      A.push(part({ pts: bez([-60, -212], [-30, -180], [30, -180], [60, -212], 12), w: 2, s0: 0.66, s1: 0.74, kind: 'beads' }));
      for (const s of [-1, 1]) A.push(part({ pts: [[s * 108, -204], [s * 140, -140], [s * 140, -80]], w: 18, fl: 22, out: [s * 90, -150], s0: 0.58, s1: 0.7, arm: s, kind: 'limb' }));
    }
    if (lvl >= 4) { // 4 — samouraï : plaques du dō, ōsode, casque kabuto à cimier (kuwagata), menpō, épée, bouclier de Yata
      for (let i = 0; i < 4; i++) { const y = -170 + i * 30, w = 98 - i * 6; A.push(part({ pts: [[-w, y], [-w * 0.5, y + 10], [0, y + 12], [w * 0.5, y + 10], [w, y], [w, y + 24], [w * 0.5, y + 34], [0, y + 36], [-w * 0.5, y + 34], [-w, y + 24], [-w, y]], w: 3, fill: 0.3, s0: 0.68 + i * 0.03, s1: 0.78 + i * 0.03, kind: 'plate' })); }
      for (const s of [-1, 1]) for (let l = 0; l < 3; l++) { const y = -214 + l * 22; A.push(part({ pts: [[s * 96, y], [s * 150, y + 8], [s * 156, y + 28], [s * 100, y + 22], [s * 96, y]], w: 3, fill: 0.34, s0: 0.72 + l * 0.02, s1: 0.82 + l * 0.02, kind: 'plate' })); }
      A.push(part({ pts: ell(0, -262, 48, 34, Math.PI, TAU2, 16).concat([[48, -262], [-48, -262]]), w: 4, fill: 0.36, fl: 18, out: [0, -250], s0: 0.78, s1: 0.86, kind: 'plate' }));
      A.push(part({ pts: bez([-14, -290], [-50, -330], [-80, -360], [-70, -410], 10), w: 6, fl: 16, out: [-20, -330], s0: 0.84, s1: 0.92 })); A.push(part({ pts: bez([14, -290], [50, -330], [80, -360], [70, -410], 10), w: 6, fl: 16, out: [20, -330], s0: 0.84, s1: 0.92 }));
      A.push(part({ pts: [[0, -296], [-10, -318], [0, -340], [10, -318], [0, -296]], w: 3, fill: 0.5, s0: 0.86, s1: 0.92, kind: 'gem' }));
      A.push(part({ pts: [[-34, -230], [-24, -216], [24, -216], [34, -230]], w: 4, s0: 0.8, s1: 0.86 }));
    }
    if (lvl >= 5) { // 5 — parfait : ailes à plumes, jupe de plaques (kusazuri), jambes, seconde paire d’yeux
      for (const s of [-1, 1]) { for (let f = 0; f < 6; f++) { const a = -0.3 - f * 0.22; A.push(part({ pts: bez([s * 90, -190], [s * (160 + f * 14), -230 - f * 8], [s * (240 + f * 8), -180 + f * 6], [s * (210 + f * 16) + s * Math.cos(a) * 30, -60 + f * 26], 10), w: 5, fill: 0, fl: 22, out: [s * 90, -100], s0: 0.86 + f * 0.015, s1: 0.95 })); } }
      for (let i = 0; i < 5; i++) { const x = -80 + i * 40; A.push(part({ pts: [[x - 20, -6], [x + 20, -6], [x + 24, 60], [x - 24, 60], [x - 20, -6]], w: 3, fill: 0.28, s0: 0.88, s1: 0.96, kind: 'plate' })); }
    }
    BUILD[lvl] = A; return A; };
  // --- rendu ---
  const strokePart = (g, P, r) => { const n = P.pts.length; if (r <= 0) return; const lim = P.L * r; g.beginPath(); g.moveTo(P.pts[0][0], P.pts[0][1]); for (let i = 1; i < n; i++) { if (P.cum[i] > lim) { const a = P.pts[i - 1], b = P.pts[i], k = (lim - P.cum[i - 1]) / ((P.cum[i] - P.cum[i - 1]) || 1); g.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k); break; } g.lineTo(P.pts[i][0], P.pts[i][1]); } };
  const magatama = (g, x, y, r, a, c) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; g.beginPath(); g.arc(0, 0, r, 0, TAU2); g.fill(); g.beginPath(); g.moveTo(r, 0); g.quadraticCurveTo(r * 1.2, r * 1.6, -r * 0.3, r * 2.1); g.quadraticCurveTo(r * 0.4, r * 1.2, 0, r); g.fill(); g.restore(); };
  MODE08.drawSusanoo = function (g, x, y, lvl, c, o = {}) { const t = o.t || 0, b = o.build == null ? 1 : o.build, sw = o.sw || 0, face = o.face || 1, K = lvl >= 5 ? 1.5 : 1 + (lvl - 1) * 0.05; const tier = window.Q9 ? Q9.tier : 2;
    const A = shapes(lvl), light = W(c, 0.55), pale = W(c, 0.8), glow = SPR9.get('glow', c), lick = SPR9.get('lick', c), lickL = SPR9.get('lick', light);
    g.save(); g.translate(x, y); g.scale(K * face, K); g.rotate(Math.sin(t * 1.4) * 0.02); g.lineCap = 'round'; g.lineJoin = 'round';
    // aura extérieure (sprite) qui respire
    const br = 1 + Math.sin(t * 3) * 0.04; g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.22 * cl(b * 2); g.drawImage(glow, -230 * br, -380 * br, 460 * br, 460 * br); g.globalAlpha = 0.25 * cl(b * 2); g.drawImage(glow, -150, -260, 300, 300);
    const swA = -0.9 + sw * 2.4; // rotation du bras droit pendant le coup d’épée
    const armT = (P) => P.arm === 1 && lvl >= 2;
    // 1) remplissages translucides
    g.globalCompositeOperation = 'source-over';
    for (const P of A) { if (!P.fill) continue; const r = cl((b - P.s0) / (P.s1 - P.s0)); if (r <= 0) continue; if (armT(P)) { g.save(); g.translate(108, -204); g.rotate(swA * 0.5); g.translate(-108, 204); }
      g.globalAlpha = P.fill * r; g.fillStyle = P.kind === 'plate' ? ca(c, 1) : ca(light, 1); g.beginPath(); for (let i = 0; i < P.pts.length; i++) i ? g.lineTo(P.pts[i][0], P.pts[i][1]) : g.moveTo(P.pts[i][0], P.pts[i][1]); g.closePath(); g.fill(); if (armT(P)) g.restore(); }
    // 2) flammes de chakra du bord : langues orientées vers l’extérieur et vers le haut, qui scintillent
    g.globalCompositeOperation = 'lighter'; const every = tier === 2 ? 1 : tier === 1 ? 2 : 3; let si = 0;
    for (let pi = 0; pi < A.length; pi++) { const P = A[pi]; if (!P.smp.length || (lvl >= 3 && pi < A.boneN)) continue; const r = cl((b - P.s0) / (P.s1 - P.s0)); if (r <= 0) continue; const rot = armT(P); if (rot) { g.save(); g.translate(108, -204); g.rotate(swA * 0.5); g.translate(-108, 204); }
      for (const [sx, sy, nx, ny, d] of P.smp) { if (d > r || (si++ % every)) continue; const fl = Math.sin(t * 9 + sx * 0.13 + sy * 0.07), L = (16 + 10 * fl) * (P.kind === 'face' ? 1.3 : 1), ang = Math.atan2(ny * 0.4 - 0.6, nx * 0.4);
        g.save(); g.translate(sx + nx * 3, sy + ny * 3); g.rotate(ang + Math.PI / 2); g.globalAlpha = 0.32 + 0.2 * fl; g.drawImage(fl > 0.4 ? lickL : lick, -L * 0.4, -L * 1.2, L * 0.8, L * 1.5); g.restore(); }
      if (rot) g.restore(); }
    // 3) os / contours : trait coloré + cœur clair
    const boneA = lvl >= 4 ? 0.22 : lvl >= 3 ? 0.4 : 1;
    for (let pi = 0; pi < A.length; pi++) { const P = A[pi]; const r = cl((b - P.s0) / (P.s1 - P.s0)); if (r <= 0) continue; const rot = armT(P); if (rot) { g.save(); g.translate(108, -204); g.rotate(swA * 0.5); g.translate(-108, 204); } const ba = pi < A.boneN ? boneA : 1;
      strokePart(g, P, r); if (P.fill && r >= 1) g.closePath(); g.globalAlpha = 0.7 * ba; g.strokeStyle = c; g.lineWidth = P.w + 3; g.stroke(); g.globalAlpha = 0.5 * ba; g.strokeStyle = P.kind === 'limb' ? light : pale; g.lineWidth = Math.max(1.2, P.w * 0.45); g.stroke();
      if (P.kind === 'beads' && r >= 1) for (let i = 0; i < 5; i++) { const q = P.pts[2 + i * 2]; magatama(g, q[0], q[1] + 4, 5, 0.6 + i * 0.3, pale); }
      if (rot) g.restore(); }
    // yeux (crâne → orbites ; visage → fentes lumineuses)
    if (lvl >= 2 && b > 0.45) { g.globalAlpha = cl((b - 0.45) * 5); g.fillStyle = lvl >= 3 ? '#ffffff' : pale; const ey = lvl >= 3 ? -252 : -242;
      for (const s of [-1, 1]) { g.beginPath(); if (lvl >= 3) { g.moveTo(s * 26, ey - 4); g.lineTo(s * 8, ey + 2); g.lineTo(s * 24, ey + 4); } else g.ellipse(s * 13, ey, 8, 6, 0, 0, TAU2); g.fill(); g.drawImage(glow, s * 16 - 14, ey - 14, 28, 28); } if (lvl >= 5) { for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 22, ey + 22); g.lineTo(s * 8, ey + 26); g.lineTo(s * 20, ey + 28); g.fill(); } } }
    // épée de Totsuka (flamme) + ruban de taille
    if (lvl >= 4 && b > 0.8) { const a2 = cl((b - 0.8) * 5); g.save(); g.translate(140, -80); g.rotate(0.35 + sw * 1.9 - (sw > 0 ? 1.6 * Math.sin(sw * Math.PI) : 0)); g.globalAlpha = a2; g.drawImage(glow, -40, -300, 80, 320);
      g.fillStyle = ca(light, 0.75); g.beginPath(); g.moveTo(-8, 0); g.lineTo(-10, -240); g.quadraticCurveTo(0, -290, 10, -240); g.lineTo(8, 0); g.closePath(); g.fill(); g.strokeStyle = pale; g.lineWidth = 2; g.stroke();
      for (let i = 0; i < (tier ? 8 : 4); i++) { const yy = -30 - i * 28, L = 18 + 8 * Math.sin(t * 10 + i); g.save(); g.translate(i % 2 ? 9 : -9, yy); g.rotate(i % 2 ? 0.5 : -0.5); g.drawImage(lickL, -L * 0.4, -L * 1.3, L * 0.8, L * 1.5); g.restore(); }
      g.fillStyle = c; g.fillRect(-18, -4, 36, 8); g.restore();
      if (sw > 0.02) { for (let k = 0; k < (tier ? 5 : 3); k++) { const a0 = -2.8 + sw * 1.4, a1 = -1.2 + sw * 2.6 - k * 0.12; g.globalAlpha = 0.35 * sw * (1 - k / 5); g.strokeStyle = k ? c : light; g.lineWidth = 26 * sw * (1 - k / 6); g.beginPath(); g.arc(140, -80, 250 - k * 6, a0, a1); g.stroke(); } } }
    // bouclier de Yata : miroir octogonal, anneaux, tomoe tournants
    if (lvl >= 4 && b > 0.85) { const a3 = cl((b - 0.85) * 6), sx = -150, sy = -110; g.globalAlpha = 0.5 * a3; g.drawImage(SPR9.get('glow', '#ffd166'), sx - 80, sy - 80, 160, 160); g.globalAlpha = 0.8 * a3;
      g.fillStyle = 'rgba(255,220,140,.22)'; g.strokeStyle = '#ffe9a8'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU2 + Math.PI / 8; g.lineTo(sx + Math.cos(a) * 58, sy + Math.sin(a) * 58); } g.closePath(); g.fill(); g.stroke();
      g.lineWidth = 2; for (const rr of [44, 30]) { g.beginPath(); g.arc(sx, sy, rr, 0, TAU2); g.stroke(); } for (let i = 0; i < 3; i++) magatama(g, sx + Math.cos(t * 2 + i * TAU2 / 3) * 18, sy + Math.sin(t * 2 + i * TAU2 / 3) * 18, 6, t * 2 + i * TAU2 / 3, '#fff3c0'); }
    // Yasaka no Magatama en orbite (palier 3+) et noyau intérieur lumineux autour du porteur
    if (lvl >= 3 && b > 0.7) { g.globalAlpha = 0.85 * cl((b - 0.7) * 4); for (let i = 0; i < 3; i++) { const a = t * 1.6 + i * TAU2 / 3; magatama(g, Math.cos(a) * 150, -150 + Math.sin(a) * 34, 9, a * 2, pale); } }
    g.globalAlpha = 0.55 + 0.15 * Math.sin(t * 5); g.drawImage(SPR9.get('core', c), -46, -96, 92, 92); g.globalAlpha = 0.5; g.strokeStyle = pale; g.lineWidth = 2; g.beginPath(); g.ellipse(0, -50, 40 + Math.sin(t * 4) * 3, 52, 0, 0, TAU2); g.stroke();
    // assemblage : éclats qui convergent pendant la construction
    if (b < 1 && Math.random() < 0.6) FX.add({ k: 'sp', spr: 'ember', c: pale, x: x + (Math.random() - 0.5) * 300 * K, y: y - Math.random() * 300 * K, vx: 0, vy: 0, s: 3 + Math.random() * 3, life: 0.35, add: 1 });
    g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; };
})();
(() => { if (!window.MODE08) return; const st = MODE08.stage.bind(MODE08); MODE08.stage = function (h, n) { const r = st(h, n); try { const M = h.md, S = M && MODE08.F[M.fam].st[M.st - 1]; if (S && S.sus && !S.giant) Cam.tz = S.sus >= 4 ? 0.72 : S.sus >= 3 ? 0.8 : 0.9; } catch (e) {} return r; }; })();
