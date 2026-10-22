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
// v0.10.56 — Garde-fou position : vu une fois au test réel, le sensei avait x/y = NaN (cause non reproduite en 4 runs tracés). Toute unité ennemie dont la position ou la vitesse devient non finie revient à sa dernière position valide, vitesse nulle.
(() => {
  const ok = (v) => typeof v === 'number' && Number.isFinite(v);
  const fu = foeUpdate; foeUpdate = function (f, dt) { const r = fu(f, dt);
    if (!ok(f.x) || !ok(f.y) || !ok(f.vx) || !ok(f.vy)) { f.x = ok(f.lx10) ? f.lx10 : (ok(f.hx) ? f.hx : Game.hero.x + 120); f.y = ok(f.ly10) ? f.ly10 : (ok(f.hy) ? f.hy : Game.hero.y); f.vx = f.vy = 0; if (!f.nanW10) { f.nanW10 = 1; console.warn('[pos10] position non finie corrigée', f.type, f.tag); } }
    else { f.lx10 = f.x; f.ly10 = f.y; } return r; };
})();
// v0.10.56 — Boussole « Prends une mission » : visait 126 unités à côté du bureau (hors portée de E). Elle vise maintenant le bureau lui-même.
(() => { const t0 = Voie.target.bind(Voie); Voie.target = function () { if (this.step === 'free' && !this.mis && this.desk && Game.mode === 'voie') return [this.desk.x, this.desk.y + 30]; return t0(); }; })();
// v0.10.57 — Boussole : si l’objectif est de l’autre côté du mur d’enceinte, elle mène d’abord à la grande porte (le mur n’est franchissable que là).
(() => {
  const via = (t) => { const h = Game.hero; if (!t || !h || (window.ZONE8 && ZONE8.room) || Game.creative || (window.BG10 && BG10.on)) return t; const wy = WALL_Y * K10, gx = 1600 * K10;
    const hIn = h.y < wy, tIn = t[1] < wy; if (hIn === tIn) return t; if (Math.abs(h.x - gx) < 110 && Math.abs(h.y - wy) < 220) return t; return [gx, hIn ? wy - 120 : wy + 160]; };
  for (const S of [typeof Voie !== 'undefined' ? Voie : null, window.Histoire || (typeof Histoire !== 'undefined' ? Histoire : null)]) { if (!S || !S.target) continue; const t0 = S.target.bind(S); S.target = function () { return via(t0()); }; }
})();
