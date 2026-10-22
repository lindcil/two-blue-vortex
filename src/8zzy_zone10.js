// v0.10.55 — Zones robustes.
// 1) Un ennemi engagé (aggro, ennemi de quête, ou à moins de 1200 du joueur) reste actif même s’il franchit la limite village / extérieur
//    (recul, téléportation, poursuite). Les quartiers ne sont que des étiquettes ; seules les salles (intérieurs) restent séparées.
// 2) État de salle robuste : si le héros n’est plus dans le rectangle de la salle (téléport de scène, chargement…), on sort de l’état « salle ».
(() => {
  const Z = window.ZONE8; if (!Z) return;
  const outdoor = (u) => u.x <= W * K10 + 40;
  const engaged = (f) => { const h = Game.hero; return !!(f.aggro || f.boss || (f.tag && f.tag !== 'yard' && f.tag !== 'wild' && f.tag !== 'camp' && f.tag !== 'patrol') || (h && Math.hypot(f.x - h.x, f.y - h.y) < 1200)); };
  const keep = (f) => Z.inside(f) || (!Z.room && outdoor(f) && engaged(f));
  const wf = World.foes.bind(World);
  World.foes = function () { if (!Game.hero || Game.titleMode || !(Z.room || Z.sec)) return wf(); return this.foes_.filter((f) => f.hp > 0 && !f.gone && keep(f)); };
  const fu = foeUpdate; foeUpdate = function (f, dt) { if (!Z.room && Game.hero && !Game.titleMode && !Z.inside(f) && outdoor(f) && engaged(f)) { const s = Z.sec; Z.sec = null; try { return fu(f, dt); } finally { Z.sec = s; } } return fu(f, dt); };
  const up = Game.update.bind(Game);
  Game.update = function (dt) { const r = up(dt); const h = this.hero; const R = Z.room;
    if (R && h && !this.titleMode && !(h.x >= R.x - 80 && h.x <= R.x + R.w + 80 && h.y >= R.y - 80 && h.y <= R.y + R.h + 80)) { Z.room = null; Z.sec = Z.secAt(h.x, h.y); }
    return r; };
})();
