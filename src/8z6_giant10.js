// v0.10.13 — géants (Susanoo / bête) orientés en 8 directions : compression de profil + vue de dos estompée
(() => { if (!window.MODE08) return;
  const wrap = (name) => { const f = MODE08[name]; if (!f) return; MODE08[name] = function (g, x, y, lvl, c, o) { const h = Game.hero, a = h && h.hd != null ? h.hd : h && h.aimA;
      if (a == null || !isFinite(a)) return f.apply(this, arguments); const vz = -Math.sin(a), az = Math.abs(vz); if (az < 0.2) return f.apply(this, arguments);
      const k = 1 - 0.3 * Math.sin(Math.PI * 0.5 * Math.min(1, az)), back = vz > 0.45 ? Math.min(1, (vz - 0.45) / 0.3) : 0;
      g.save(); g.translate(x, y); g.scale(k, 1 - 0.06 * az); if (back) g.globalAlpha *= 1 - 0.3 * back; g.translate(-x, -y); const r = f.apply(this, arguments); g.restore(); return r; }; };
  wrap('drawSusanoo'); wrap('drawBeast');
})();
