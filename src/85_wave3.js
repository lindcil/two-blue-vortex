// Vague 3 (v0.5) : bijū errants, embuscades, indicateur de sauvegarde.
const Roam = { t: 60, beast: null,
  update(dt) { if (Game.mode !== 'voie' || Story.step !== 'free' || Talk.on || Cine.on) return; const h = Game.hero;
    if (this.beast) { const b = this.beast; if (b.gone || b.hp <= 0) { this.beast = null; return; } if (b.hp < b.maxHp * 0.35 && !b.passive) { b.passive = true; b.casting = null; Game.impact(b.x, b.y, 0.2);
        Talk.say([['', BIJUU[b.bj].n + ' se calme.'], ['', 'Il te jauge… puis s’éloigne.']], () => { FX.smoke(b.x, b.y - 60, 40); b.gone = true; this.beast = null; Game.gainXp(600 * 5); Game.ryo += 2000; UI.reward(BIJUU[b.bj].n + ' apaisé', '#ff9a2e'); Voie.flags.calmed = (Voie.flags.calmed || 0) + 1; Game.save(); }); } return; }
    if (Voie.mis) return; this.t -= dt; if (this.t > 0) return; this.t = 70 + Math.random() * 50;
    if (['chunin', 'jonin'].includes(Voie.rank) && Math.random() < 0.45) { const spots = [[420, 520], [2900, 2700], [380, 2700]]; const [x, y] = spots[(Math.random() * spots.length) | 0]; const bj = ['matatabi', 'songoku', 'gyuki'][(Math.random() * 3) | 0];
      const b = spawnFoe('bijuu', x, y, { tag: 'roam', bj, n: BIJUU[bj].n, size: 1.4, leash: [x, y, 380], hpMul: 0.8 }); this.beast = b; UI.toast(BIJUU[bj].n + ' rôde hors des murs', 1); V.roar(b); return; }
    // embuscade : ninja errant
    const a = Math.random() * TAU, x = clamp(h.x + Math.cos(a) * 380, 120, 3080), y = clamp(h.y + Math.sin(a) * 300, 120, 2880); if (y > 2250 && y < 2350) return;
    const n = Voie.rank === 'genin' ? 1 : 2; for (let i = 0; i < n; i++) { const f = spawnFoe(i ? 'bandit' : 'rogue', x + i * 50, y, { tag: 'amb', leash: [x, y, 420] }); f.aggro = true; FX.smoke(f.x, f.y - 20, 12); }
    UI.toast('Embuscade !', 1); } };
(() => { const vu = Voie.update.bind(Voie); Voie.update = function (dt) { vu(dt); Roam.update(dt); };
  const sv = Game.save.bind(Game); Game.save = function () { sv(); this.savedT = 1.2; };
  const rd = Game.render.bind(Game); Game.render = function () { rd(); if (!(this.savedT > 0) || !this.running) return; this.savedT -= 1 / 60; const vw = innerWidth, vh = innerHeight; const dpr = Math.min(Save.set.low ? 1 : 2, devicePixelRatio || 1); g.setTransform(dpr, 0, 0, dpr, 0, 0); const a = Math.min(1, this.savedT * 2);
    g.save(); g.globalAlpha = a; g.translate(vw - 30, vh - 30); g.rotate(this.t * 5); g.strokeStyle = '#8fd3ff'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 9, 0, 4.4); g.stroke(); g.restore(); }; })();
