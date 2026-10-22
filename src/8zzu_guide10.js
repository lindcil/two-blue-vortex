// v0.10.46 — Guidage : quand l’objectif n’a pas de lieu (ex. « Repousse les Claw Grimes ») mais qu’il reste des ennemis actifs, la boussole pointe vers le plus proche.
(() => {
  const near = () => { const h = Game.hero; if (!h) return null; let b = null, bd = 1e9; for (const f of World.foes()) { if (f.hp <= 0 || f.passive || f.dummy) continue; const d = Math.hypot(f.x - h.x, f.y - h.y); if (d < bd && d < 6000) { bd = d; b = f; } } return b ? [b.x, b.y] : null; };
  for (const S of [window.Histoire || (typeof Histoire !== 'undefined' ? Histoire : null), typeof Voie !== 'undefined' ? Voie : null]) { if (!S || !S.target) continue; const t0 = S.target.bind(S);
    S.target = function () { const t = t0(); if (t) return t; if ((window.BG10 && BG10.on) || Game.creative) return null; return near(); }; }
})();
