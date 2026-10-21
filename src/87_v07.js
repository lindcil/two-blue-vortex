// v0.6.2 — correctif : pose « touché » figée. hurtT du héros n'était jamais décrémenté (seuls ennemis/alliés le faisaient),
// et pendant les cinématiques allyUpdate ne tourne pas. On décrémente partout + remise à zéro à chaque début/fin de scène.
(() => {
  const calm = (u) => { if (!u) return; u.hurtT = 0; u.relT = 0; u.flash = 0; u.sq = 0; if (u.hp > 0) { u.act = null; u.buf = null; u.koT = null; if (u.st) { u.st.stun = 0; u.st.confuse = 0; } } u.vx = u.vy = 0; u.P = null; };
  const calmAll = () => { try { const G = Game; calm(G.hero); for (const a of G.allies || []) if (!a.down) calm(a); for (const c of G.clones || []) calm(c); } catch (e) {} };
  window.TBVcalm = calmAll;
  const up = Game.update.bind(Game);
  Game.update = function (dt) { const r = up(dt); const d = dt || 0; const L = [this.hero, ...(this.allies || []), ...(this.clones || [])];
    for (const u of L) if (u) { if (u.hurtT > 0) u.hurtT = Math.max(0, u.hurtT - d); if (u.flash > 0) u.flash = Math.max(0, u.flash - d); if (this.cine && u.relT > 0) u.relT = Math.max(0, u.relT - d); if (this.cine && u.hp > 0 && u.sq) u.sq *= Math.pow(0.0001, d); }
    // filet de sécurité : plus aucune scène active mais cine resté vrai → on rend la main
    if (this.cine && !Talk.on && !(typeof Cine !== "undefined" && Cine.on) && !(window.Scene && Scene.on)) { this._cineStuck = (this._cineStuck || 0) + d; if (this._cineStuck > 2.5) { this.cine = false; this._cineStuck = 0; calmAll(); } } else this._cineStuck = 0;
    return r; };
  const ts = Talk.say.bind(Talk), tc = Talk.choose.bind(Talk), tn = Talk.next.bind(Talk), tp = Talk.pick.bind(Talk);
  Talk.say = function (l, cb) { calmAll(); return ts(l, cb); };
  Talk.choose = function (l, o, cb) { calmAll(); return tc(l, o, cb); };
  Talk.next = function () { const was = this.on; const r = tn(); if (was && !this.on) calmAll(); return r; };
  Talk.pick = function (i) { calmAll(); return tp(i); };
})();
