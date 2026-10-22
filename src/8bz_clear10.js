// v0.10.30 — Clairières des villes (après l'ajout d'arbres de 8b) : rien ne pousse dans le hameau du Mont Myōboku.
(() => { const bd = World.build.bind(World);
  World.build = function () { const r = bd(); if (Game.titleMode || !this.k10) return r; const C = [[3350, 3860, 470]];
    const inC = (x, y) => C.some(([cx, cy, R]) => Math.hypot(x - K10 * cx, y - K10 * cy) < K10 * R);
    const T = this.props.filter((p) => p.kind === 'tree' && inC(p.x, p.y)); this.props = this.props.filter((p) => !T.includes(p)); if (this.trees10) this.trees10 = this.trees10.filter((p) => !inC(p.x, p.y));
    this.solids = this.solids.filter((o) => !(o.w < 25 * K10 && inC(o.x + o.w / 2, o.y + o.h / 2) && T.some((t) => Math.abs(t.x - (o.x + o.w / 2)) < 2 && Math.abs(t.y - (o.y + o.h / 2) - 3 * K10) < 4 * K10))); return r; };
})();
