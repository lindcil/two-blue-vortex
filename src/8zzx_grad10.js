// v0.10.51 — Examen de fin d’Académie (a4) : premier vrai combat d’un nouveau joueur. Mesuré en jeu : le rival (608 PV, coups de 17–31 sur 120 PV) gagnait en ~7 coups pendant que le héros ne lui retirait que 18 %.
// Le rival du diplôme est désormais à 50 % de PV et frappe à 35 % (v0.10.52 : un joueur qui ne fait que cliquer doit pouvoir gagner de justesse) ; les combats de rival plus tardifs (r2, x2, w2) sont inchangés.
(() => {
  const sr = Voie.spawnRival.bind(Voie);
  Voie.spawnRival = function (x, y, lvl) { const r = sr(x, y, lvl); if (this.step === 'a4' || this.pending === 'a4') { r.hp *= 0.5; r.maxHp = r.hp; r.grad10 = 1; } return r; };
  const hu = hurt;
  hurt = function (t, d, s) { if (s && s.grad10 && t && t.isHero) d *= 0.35; return hu.call(this, t, d, ...Array.prototype.slice.call(arguments, 2)); };
})();
// v0.10.53 — Filet de sécurité « trois coups » (a6) : vu une fois au test réel, le sensei disparaissait de la liste active à 2/3 (PV NaN ou retiré) → partie bloquée. S’il n’y a plus de sensei valide, on le réinstalle (la progression 2/3 est conservée).
(() => {
  const up = Voie.update.bind(Voie);
  Voie.update = function (dt) { up(dt); if (this.step !== 'a6' || Talk.on || this.lesson >= 3) return; this.se10T = (this.se10T || 0) - dt; if (this.se10T > 0) return; this.se10T = 1;
    const se = World.foes_.find((f) => f.tag === 'sensei' && !f.gone);
    if (se && Number.isFinite(se.hp) && se.hp > 0) return;
    if (se) { se.hp = se.maxHp = 1e9; return; }
    const T = this.team, n = spawnFoe('sensei', K10 * 2250, K10 * 860, { tag: 'sensei', look: T.sensei.look, n: T.sensei.name, leash: [K10 * 2250, K10 * 860, 300] }); n.aggro = true; n.onTag = () => this.tag(n); };
})();
