// v0.10.6 — Suivi de quête : flèche de piste plus lisible (distance), repère au sol sur l'objectif, cibles des leçons = mannequins.
(() => {
  for (const S of [typeof Voie !== 'undefined' && Voie]) if (S) { const t0 = S.target; S.target = function () { const s = this.step;
      if (['a1', 'a2', 'a3'].includes(s)) { const d = World.foes_.find((f) => f.tag === 'yard' && !f.gone); if (d) return [d.x, d.y]; }
      if (s === 'a6') { const se = World.foes_.find((f) => f.tag === 'sensei' && !f.gone); if (se) return [se.x, se.y]; }
      return t0.apply(this, arguments); }; }
  // repère au sol (losange qui pulse) à l'emplacement de l'objectif
  FX.custom({ x: 0, y: 0, life: 1e9, ground: 1, draw: (g) => { if (Game.titleMode || !Game.hero || Game.cine) return; let t; try { t = Story.target(); } catch (e) { return; } if (!t) return;
    const [x, y] = t, k = (Game.t * 1.6) % 1; g.save(); g.strokeStyle = 'rgba(58,160,255,' + (0.9 - k * 0.8) + ')'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, 30 + k * 40, (30 + k * 40) * 0.42, 0, 0, TAU); g.stroke();
    const b = Math.sin(Game.t * 4) * 5; g.fillStyle = '#3aa0ff'; g.strokeStyle = '#0b1020'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x, y - 92 + b); g.lineTo(x + 11, y - 76 + b); g.lineTo(x, y - 60 + b); g.lineTo(x - 11, y - 76 + b); g.closePath(); g.fill(); g.stroke(); g.restore(); } });
  window.TRACK10 = 1;
})();
