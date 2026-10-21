// v0.10.6 — Mudrā : plus aucun texte, seulement les mains. 12 sceaux canon + croix du Kage Bunshin, dessinés doigt par doigt
// (contour net, petit pop/écrasement entre deux sceaux, halo de chakra). Lisible en jeu (≈ 44 px).
(() => {
  const SKIN = '#f2c9a0', SH = '#d9a57a', INK = '#0b1020';
  // une main : origine = poignet, l'axe des doigts vers le haut (−y). f = [pouce, index, majeur, annulaire, auriculaire] : 1 tendu, 0 replié, 0.5 entrelacé
  function hand(g, x, y, rot, mir, f, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(mir, 1); g.lineJoin = 'round'; g.lineCap = 'round';
    const W = 13, Hh = 12, back = o.back;
    const fing = (i) => { const st = f[i + 1]; const fx = -W / 2 + 1.8 + i * 3.1, L = [10, 11.5, 10.5, 8][i] * (st === 1 ? 1 : st === 0.5 ? 0.62 : 0.34); g.beginPath(); g.moveTo(fx, -Hh + 1); g.lineTo(fx + (st === 0.5 ? (i % 2 ? 0.8 : -0.8) : 0), -Hh - L); g.lineWidth = 5.2; g.strokeStyle = INK; g.stroke(); g.lineWidth = 3; g.strokeStyle = st === 1 ? SKIN : SH; g.stroke(); };
    for (let i = 3; i >= 0; i--) fing(i);
    g.fillStyle = back ? SH : SKIN; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.roundRect ? g.roundRect(-W / 2, -Hh, W, Hh + 2, 4) : g.rect(-W / 2, -Hh, W, Hh + 2); g.fill(); g.stroke();
    // phalanges repliées visibles sur la paume
    g.strokeStyle = 'rgba(11,16,32,.35)'; g.lineWidth = 1; for (let i = 0; i < 4; i++) if (f[i + 1] !== 1) { const fx = -W / 2 + 1.8 + i * 3.1; g.beginPath(); g.moveTo(fx, -Hh + 2); g.lineTo(fx, -Hh + 5); g.stroke(); }
    // pouce
    const ta = f[0] === 1 ? -0.5 : f[0] === 0.5 ? -1.1 : -1.4, tl = f[0] === 1 ? 9 : 6; g.beginPath(); g.moveTo(-W / 2 + 1, -3); g.lineTo(-W / 2 + 1 + Math.sin(ta) * tl, -3 - Math.cos(ta) * tl); g.lineWidth = 5.4; g.strokeStyle = INK; g.stroke(); g.lineWidth = 3.2; g.strokeStyle = SKIN; g.stroke();
    // manche
    g.fillStyle = o.sleeve || '#2a3350'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.rect(-W / 2 - 1, 2, W + 2, 7); g.fill(); g.stroke(); g.restore(); }
  // sceaux : [main gauche, main droite] → [dx, dy, rot, doigts, back]
  const E = 1, C = 0, I = 0.5;
  const SEAL = {
    ne: [[-3, 3, 0.15, [C, C, C, C, C]], [3, -2, -0.1, [C, E, E, C, C]]],                       // Rat : index+majeur droits saisis dans le poing gauche
    ushi: [[-4, 0, -1.35, [E, E, E, E, E], 1], [5, 3, 0.2, [C, E, E, C, C]]],                    // Bœuf : main gauche à plat en travers, deux doigts droits levés
    tora: [[-4, 0, 0.12, [I, E, E, I, I]], [4, 0, -0.12, [I, E, E, I, I]]],                     // Tigre : index+majeurs joints vers le haut
    u: [[-5, 2, -0.2, [E, E, E, E, E]], [5, 0, 0.6, [C, C, C, C, C], 1]],                        // Lièvre
    tatsu: [[-4, 0, 0.1, [E, I, I, I, E]], [4, 0, -0.1, [E, I, I, I, E]]],                      // Dragon : pouces dressés, doigts entrelacés
    mi: [[-4, 0, 0.12, [I, I, I, I, I]], [4, 0, -0.12, [I, I, I, I, I]]],                       // Serpent : mains jointes, doigts entrelacés
    uma: [[-4, 0, 0.32, [E, E, I, I, I]], [4, 0, -0.32, [E, E, I, I, I]]],                      // Cheval : triangle index/pouces
    hitsuji: [[-3, 2, 0.05, [C, E, E, C, C]], [4, 0, -0.3, [C, C, C, C, C], 1]],                 // Bélier : index+majeur gauches levés, poing droit autour
    saru: [[-4, 0, 1.2, [E, E, E, E, E]], [4, 2, -1.2, [E, E, E, E, E], 1]],                     // Singe : paumes face à face, doigts croisés à l'horizontale
    tori: [[-4, 0, 0.55, [I, E, E, E, E]], [4, 0, -0.55, [I, E, E, E, E], 1]],                   // Oiseau : doigts écartés en ailes, pouces croisés
    inu: [[-1, -4, -1.5, [C, E, E, E, E], 1], [1, 4, 0, [C, C, C, C, C]]],                      // Chien : main gauche à plat sur le poing droit
    i: [[-5, 0, 0.9, [C, E, E, E, E], 1], [5, 0, -0.9, [C, E, E, E, E], 1]],                     // Sanglier : dos des mains, doigts joints vers le bas-avant
    bunshin: [[-2, 2, 0.78, [C, E, E, C, C]], [2, 2, -0.78, [C, E, E, C, C]]],                   // Croix du Kage Bunshin
  };
  const ORDER = ['ne', 'ushi', 'tora', 'u', 'tatsu', 'mi', 'uma', 'hitsuji', 'saru', 'tori', 'inu', 'i'];
  function drawSeal(g, x, y, k, s = 1, c = '#8fd3ff', glow = 1, sleeve) { const S = SEAL[k] || SEAL.tora; g.save(); g.translate(x, y); g.scale(s, s);
    if (glow > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(0, -8, 2, 0, -8, 30); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.globalAlpha = 0.55 * glow; g.fillStyle = gr; g.beginPath(); g.arc(0, -8, 30, 0, TAU); g.fill(); g.restore(); }
    // ordre : la main « back » derrière
    const L = S.map((h, i) => [h, i]).sort((a, b) => (b[0][4] ? 1 : 0) - (a[0][4] ? 1 : 0));
    for (const [[dx, dy, r, f, bk], i] of L) hand(g, dx, dy + 6, r, i ? -1 : 1, f, { back: bk, sleeve });
    g.restore(); }
  window.SEALS10 = { SEAL, ORDER, drawSeal, hand };
  // ---------- remplace les bulles à kanji par les mains ----------
  const lookSleeve = (u) => { try { const L = lookOf(u); return L.top || '#2a3350'; } catch (e) { return '#2a3350'; } };
  V.signFx = (u, el, n = 3, dur = 0.45) => { const c = elc(el || 'wind'); const seq = []; for (let i = 0; i < n - 1; i++) seq.push(SIGN_SEQ[(i * 2 + (u.x | 0)) % SIGN_SEQ.length]); seq.push(u.act && u.act.id === 'bunshin' ? 'bunshin' : (u.sign && u.sign.k) || 'tora');
    const T0 = Game.t, step = dur / n, sl = lookSleeve(u);
    FX.custom({ x: u.x, y: u.y, life: dur + 0.35, draw: (g, p, q) => { if (u.hp <= 0) return; const t = Game.t - T0, i = Math.min(n - 1, Math.floor(t / step)), lt = t - i * step, last = i === n - 1;
      const pop = lt < 0.08 ? 1 + 0.35 * (1 - lt / 0.08) : 1, sq = lt < 0.08 ? 1 - 0.18 * (1 - lt / 0.08) : 1; const end = last ? Math.max(0, 1 - (t - (n - 1) * step) / (step + 0.35)) : 1;
      const x = u.x + (u.face || 1) * 4, y = u.y - 116 * (u.size || 1); g.save(); g.globalAlpha = Math.min(1, end * 3); g.translate(x, y); g.scale(pop * 1.55, sq * pop * 1.55); drawSeal(g, 0, 0, seq[i], 1, c, 0.6 + 0.4 * (lt < 0.1 ? 1 : 0.5), sl); g.restore(); } });
    seq.forEach((s, i) => Game.later(i * step, () => { if (u.hp <= 0) return; const last = i === n - 1;
      for (let k = 0; k < 5; k++) FX.add({ k: 'spark', x: u.x, y: u.y - 116 * (u.size || 1), vx: rnd(-140, 140), vy: rnd(-160, 20), c, life: rnd(0.15, 0.3), s: rnd(2, 3) });
      Sfx.tone && Sfx.tone(520 + i * 120, 760 + i * 120, 0.07, 'triangle', 0.05);
      if (last) { FX.shock(u.x, u.y - 50, c, 70, 0.35, 6); FX.glow(u.x, u.y - 50, c, 60, 0.3); u.sq = 0.2; } })); };
  // les petites mains au-dessus de la tête (ancien rendu) sont remplacées par le même dessin
  drawHands = function (g, x, y, sign, t) { const a = Math.min(1, (0.55 - t) * 5); if (a <= 0) return; g.save(); g.globalAlpha = a; const pop = 1 + 0.25 * Math.max(0, 1 - t * 8); g.translate(x, y - 8); g.scale(1.3 * pop, 1.3 * pop); drawSeal(g, 0, 0, sign, 1, '#8fd3ff', 0.5); g.restore(); };
  // Kage Bunshin : croix
  const cs = castSkill; castSkill = function (u, S, id, isHero) { const r = cs(u, S, id, isHero); if (id === 'bunshin' && u.sign) u.sign.k = 'bunshin'; return r; };
})();
