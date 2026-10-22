// v0.9.6 — Animations de base, décrites en données (ANIM10) pour les régler facilement : combo M1, dash, Kawarimi (bûche), réactions aux coups, garde, course de Naruto.
// Ne touche ni aux dégâts ni aux timings de gameplay : seulement poses, VFX et hit-stop cosmétique (plafonné).
(() => {
  const TAU = Math.PI * 2, cl = (v) => Math.max(0, Math.min(1, v)), RF = () => !(typeof Save !== 'undefined' && Save.set && Save.set.rf === false);
  const ANIM10 = window.ANIM10 = {
    m1: [ // une pose distincte par coup : anticipation → frappe (smear) → prolongement → retour
      { ph: [0.24, 0.36, 0.7], follow: { aF: 1.9, eF: 0.1, lean: 0.55, sx: 1.08, sy: 0.94, hF: 0.8, kF: -0.2, hB: -0.7 }, stretch: 0.22, smear: [[-1.3, 1.1, 54], [-1.0, 1.3, 40]], sparks: { n: 6, sp: 380, spread: 0.5 }, hs: 0.04, shake: 0.06 },
      { ph: [0.24, 0.36, 0.7], follow: { lean: -0.35, hF: 2.2, kF: 0.05, aF: 1.3, aB: -1.4, by: -10, sx: 1.06, sy: 0.95 }, stretch: 0.26, smear: [[1.4, -1.2, 60], [1.1, -1.5, 46]], sparks: { n: 8, sp: 420, spread: 0.6 }, hs: 0.045, shake: 0.08 },
      { ph: [0.3, 0.4, 0.78], follow: { by: 6, aF: 0.9, aB: 0.8, lean: 0.95, sx: 1.2, sy: 0.82, hF: 1.1, kF: -1.4, hB: -1.1 }, stretch: 0.4, smear: [[-2.0, 2.0, 70], [-2.3, 1.7, 86], [-1.7, 2.3, 56]], sparks: { n: 16, sp: 620, spread: 0.9 }, hs: 0.09, shake: 0.22, fin: 1 } ],
    dash: { ghostEvery: 0.035, ghostLife: 0.22, ghostA: 0.4, dustStart: 8, skid: { t: 0.2, pose: { lean: -0.45, sx: 1.15, sy: 0.86, by: 3, hF: 0.9, kF: -0.4, hB: -0.9, kB: -0.6, aF: 0.2, aB: -0.4 } }, dustSkid: 6 },
    kawa: { poof: 14, logLife: 1.4, trailLife: 0.3, ring: 70 },
    react: { stretch: 0.28, sparks: 4, sp: 300 },
    guard: { aF: 2.2, eF: 2.4, aB: 2.0, eB: 2.4, lean: -0.1, sx: 0.94, sy: 1.04, hF: 0.4, kF: -0.6, hB: -0.4, kB: -0.6, by: 2, head: 0.15 },
    run: { min: 230, pose: { aF: -1.4, eF: 0.2, aB: -1.25, eB: 0.2, lean: 0.55, head: 0.15 } },
  };
  const ease = (k) => 1 - (1 - k) * (1 - k);
  // ── poses
  const po = poseOf; poseOf = function (u) { const a = u.act, P = po(u);
    if (a && a.k === 'm1' && !u.giant) { const D = ANIM10.m1[Math.min(2, a.n | 0)], q = cl(a.t / a.dur), K = M1K[Math.min(2, a.n | 0)], base = u.combat ? STANCE : P, A = { ...STANCE, ...K[0] }, S = { ...STANCE, ...K[1] }, F = { ...S, ...D.follow };
      if (q < D.ph[0]) return mixP(STANCE, A, ease(q / D.ph[0]));
      if (q < D.ph[1]) { const k = (q - D.ph[0]) / (D.ph[1] - D.ph[0]), o = mixP(A, S, k * k); o.sx *= 1 + D.stretch * Math.sin(k * Math.PI); o.sy *= 1 - D.stretch * 0.6 * Math.sin(k * Math.PI); return o; }
      if (q < D.ph[2]) return mixP(S, F, ease((q - D.ph[1]) / (D.ph[2] - D.ph[1])));
      return mixP(F, STANCE, ease((q - D.ph[2]) / (1 - D.ph[2]))); }
    if (!a && u.skidAt != null && Game.t - u.skidAt < ANIM10.dash.skid.t) return mixP({ ...STANCE, ...ANIM10.dash.skid.pose }, P, (Game.t - u.skidAt) / ANIM10.dash.skid.t);
    if (!a && u.guardT > 0) return { ...P, ...ANIM10.guard };
    if (!a && !(u.hurtT > 0) && u.isHero && Math.hypot(u.vx || 0, u.vy || 0) > ANIM10.run.min) return { ...P, ...ANIM10.run.pose };
    return P; };
  // ── VFX helpers
  const spark = (x, y, a, n, sp, spread, c) => { for (let i = 0; i < n; i++) { const an = a + (Math.random() - 0.5) * spread * 2, v = sp * (0.5 + Math.random() * 0.7); FX.add({ k: 'sp', spr: i % 3 ? 'ember' : 'star', c, x, y, vx: Math.cos(an) * v, vy: Math.sin(an) * v * 0.7, s: 3 + Math.random() * 4, life: 0.18 + Math.random() * 0.14, add: 1 }); } };
  const ghost = (u, c, life, A) => { const P = poseOf(u), s = { ...u, P, sq: u.sq || 0 }; FX.custom({ x: u.x, y: u.y, life, draw: (g, p, q) => { g.save(); g.globalAlpha = A * (1 - q); try { drawRig(g, s, c); } catch (e) {} g.restore(); } }); };
  // ── combo M1 et dash : on observe l'action
  let hitN = 0; const ht0 = hurt; hurt = function (t, dmg, src, o) { const kawa = t && t.isHero && t.kawa > 0 && src && !src.isHero, ox = t && t.x, oy = t && t.y; const r = ht0(t, dmg, src, o);
    if (kawa && t.kawa === 0) kawaFx(t, ox, oy);
    else if (t && !t.isHero && src && (src.isHero || src.isClone || src.isAlly) && dmg > 0) { hitN++; const R = ANIM10.react; t.sq = Math.max(t.sq || 0, R.stretch); if (Game.t - (ANIM10._rs || 0) < 0.06) return r; ANIM10._rs = Game.t; const a = Math.atan2(t.y - src.y, t.x - src.x); spark(t.x, t.y - 40, a, R.sparks, R.sp, 0.5, '#fff1d0'); }
    return r; };
  const as0 = actStep; actStep = function (u, a, dt) { const wasHit = a.hit, n0 = hitN; as0(u, a, dt);
    if (a.k === 'm1' && !wasHit && a.hit && !u.giant && u.isHero) { const D = ANIM10.m1[Math.min(2, a.n | 0)], col = elc(Game.mainEl || 'wind');
      for (let i = 1; i < D.smear.length; i++) FX.smear(u, a.a + D.smear[i][0], a.a + D.smear[i][1], D.smear[i][2], i === 1 ? '#ffffff' : col, D.fin ? 1 : 0);
      if (hitN > n0) { const x = u.x + Math.cos(a.a) * 46, y = u.y - 40 + Math.sin(a.a) * 24; spark(x, y, a.a, D.sparks.n, D.sparks.sp, D.sparks.spread, col); Game.hitstop(D.hs); Cam.shake(D.shake);
        if (D.fin && window.VFX9) VFX9.play([{ fx: 'star', c: col, size: 30 }, { fx: 'shock', c: col, r: 120, w: 8 }, { fx: 'screen', k: 'flash', a: 0.18 }], x, y); } }
    if (a.k === 'dash') { const D = ANIM10.dash; u.ghT = (u.ghT || 0) - dt; if (u.ghT <= 0 && u.isHero) { u.ghT = D.ghostEvery; ghost(u, u.isHero ? elc(Game.mainEl || 'wind') : '#ff9a8a', D.ghostLife, D.ghostA); }
      if (a.t + dt >= a.dur && !a.skid) { a.skid = 1; u.skidAt = Game.t; FX.dust(u.x, u.y, D.dustSkid); } } };
  const dg0 = dodge; dodge = function (u) { const r = dg0(u); try { FX.dust(u.x, u.y, ANIM10.dash.dustStart); u.ghT = 0; } catch (e) {} return r; };
  // ── Kawarimi : nuage de fumée, bûche avec kunai et parchemin, réapparition dans le dos avec traînée
  function kawaFx(t, ox, oy) { const K = ANIM10.kawa; FX.smoke(ox, oy - 20, K.poof); FX.smoke(t.x, t.y - 20, 5);
    FX.custom({ x: ox, y: oy, life: K.logLife, draw: (g, p, q) => { const fall = Math.min(1, q * 5), a = 1 - Math.max(0, (q - 0.7) / 0.3); g.save(); g.translate(ox, oy - 10); g.rotate(-1.3 * (1 - fall)); g.globalAlpha = a;
      g.fillStyle = '#7a5230'; g.fillRect(-14, -50, 28, 52); g.fillStyle = '#b8895a'; g.beginPath(); g.ellipse(0, -50, 14, 5, 0, 0, TAU); g.fill(); g.strokeStyle = '#8f6a44'; g.beginPath(); g.ellipse(0, -50, 7, 2.5, 0, 0, TAU); g.stroke();
      g.strokeStyle = '#5a3a20'; g.lineWidth = 1.5; for (const yy of [-36, -20, -6]) { g.beginPath(); g.moveTo(-14, yy); g.lineTo(14, yy + 2); g.stroke(); }
      g.fillStyle = '#c8ced8'; g.beginPath(); g.moveTo(-2, -30); g.lineTo(-26, -34); g.lineTo(-2, -26); g.fill(); g.fillStyle = '#333'; g.fillRect(-36, -33, 10, 3);
      g.fillStyle = '#f1e2b0'; g.fillRect(-46, -40, 9, 18); g.fillStyle = '#c0392b'; g.fillRect(-44, -36, 5, 10); g.restore(); } });
    const rf = RF(); FX.custom({ x: t.x, y: t.y, life: K.trailLife, draw: (g, p, q) => { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (rf ? 0.35 : 0.7) * (1 - q); g.strokeStyle = '#cfe0ff'; g.lineWidth = 10 * (1 - q); g.beginPath(); g.moveTo(ox, oy - 40); g.lineTo(t.x, t.y - 40); g.stroke(); g.lineWidth = 3; g.strokeStyle = '#fff'; g.stroke(); g.restore(); } });
    FX.ring(t.x, t.y - 40, '#cfe0ff', 12, K.ring, 0.3); try { ghost(t, '#cfe0ff', 0.25, 0.5); } catch (e) {} }
})();
