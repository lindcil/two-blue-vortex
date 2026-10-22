// v0.10.50 — Bout portant : un projectile du joueur naît à la main, parfois déjà « derrière » un ennemi collé à lui (ex. leçon 3 de l’Académie, shuriken sur un mannequin au contact → raté).
// À sa première frame, on teste le segment corps → main : le premier ennemi traversé est touché via le chemin normal (on recule simplement le projectile sur lui).
(() => {
  const pu = projUpdate;
  projUpdate = function (dt) {
    for (const p of Proj) { if (p._pb10) continue; p._pb10 = 1; const u = p.src; if (p.team !== 0 || !u || !u.isHero) continue;
      const ax = u.x, ay = u.y - 34, bx = p.x, by = p.y, L = Math.hypot(bx - ax, by - ay) + 1; let best = null, bt = 2;
      for (const f of World.foes()) { if (f.hp <= 0 || f.gone) continue; const fx = f.x, fy = f.y - 34, t = clamp(((fx - ax) * (bx - ax) + (fy - ay) * (by - ay)) / (L * L), 0, 1); const d = Math.hypot(ax + (bx - ax) * t - fx, ay + (by - ay) * t - fy); if (d < (f.r || 16) + (p.r || 10) && t < bt) { bt = t; best = f; } }
      if (best) { p.x = best.x - p.vx * dt; p.y = best.y - 34 - p.vy * dt; } }
    return pu.apply(this, arguments);
  };
})();
