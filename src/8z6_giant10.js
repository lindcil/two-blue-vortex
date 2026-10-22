// v0.10.13 — géants (Susanoo / bête) orientés en 8 directions : compression de profil + vue de dos estompée
(() => { if (!window.MODE08) return;
  const wrap = (name) => { const f = MODE08[name]; if (!f) return; MODE08[name] = function (g, x, y, lvl, c, o) { const h = Game.hero, a = h && h.hd != null ? h.hd : h && h.aimA;
      if (a == null || !isFinite(a)) return f.apply(this, arguments); const vz = -Math.sin(a), az = Math.abs(vz); if (az < 0.2) return f.apply(this, arguments);
      const k = 1 - 0.3 * Math.sin(Math.PI * 0.5 * Math.min(1, az)), back = vz > 0.45 ? Math.min(1, (vz - 0.45) / 0.3) : 0;
      g.save(); g.translate(x, y); g.scale(k, 1 - 0.06 * az); if (back) g.globalAlpha *= 1 - 0.3 * back; g.translate(-x, -y); const r = f.apply(this, arguments);
      if (back > 0.3 && name === 'drawSusanoo') backSus(g, x, y, lvl, c, back, o); g.restore(); return r; }; };
  // Susanoo vu de dos : le visage est recouvert par l'arrière du crâne (casque/flammes), colonne vertébrale lumineuse
  const SIL = [null, [0, -120, 92, 96], [10, -150, 120, 140], [0, -170, 150, 170], [0, -180, 175, 200], [0, -185, 190, 215]];
  function backSus(g, x, y, lvl, c, a, o) { const L = Math.max(1, Math.min(5, lvl | 0)), S = SIL[L], K = lvl >= 5 ? 1.5 : 1 + (lvl - 1) * 0.05, f = (o && o.face) || 1;
    const hy = S[1] - S[3] + 112 * S[3] / 170, hr = 40 * S[2] / 150, b = (o && o.build != null) ? o.build : 1; if (b < 0.6) return;
    g.save(); g.translate(x, y); g.scale(K * f, K); g.globalAlpha *= a * Math.min(1, (b - 0.6) * 2.5);
    g.fillStyle = shade(shade(shade(c))); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.ellipse(S[0], hy, hr, hr * 1.08, 0, 0, TAU); g.fill(); g.stroke();
    g.lineWidth = 3; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(S[0] + i * hr * 0.3, hy - hr * 0.6); g.quadraticCurveTo(S[0] + i * hr * 0.45, hy - hr * 1.5, S[0] + i * hr * 0.2, hy - hr * 1.9); g.stroke(); }
    g.globalCompositeOperation = 'lighter'; g.lineWidth = 5; g.strokeStyle = c; g.beginPath(); g.moveTo(S[0], hy + hr * 1.1); g.lineTo(S[0], S[1] + S[3] * 0.1); g.stroke();
    for (let i = 1; i <= 4; i++) { const yy = hy + hr * 1.1 + i * (S[1] + S[3] * 0.1 - hy - hr * 1.1) / 5; g.beginPath(); g.moveTo(S[0] - hr * 0.5, yy); g.lineTo(S[0] + hr * 0.5, yy); g.stroke(); } g.restore(); }
  wrap('drawSusanoo'); wrap('drawBeast');
})();
