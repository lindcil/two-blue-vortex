// v0.10.18 — mise en scène : les arbres/maisons devant le héros s'estompent (toujours, et surtout pendant l'ultime) ; HUD de quête masqué pendant les cinématiques.
(() => {
  const SZ = { tree: [48, 125], house: [0, 0], torii: [70, 120], tent: [50, 60] };
  const dp = World.drawProp.bind(World);
  World.drawProp = function (g, p) { const h = Game.hero, z = SZ[p.kind]; if (!h || !z || !z[0]) return dp(g, p);
    const K = this.k10 && p.lx !== undefined ? K10 : 1, s = p.s || 1, w = z[0] * s * K, ht = z[1] * s * K;
    const behind = h.y < p.y - 4 && h.y > p.y - ht - 30 * K && Math.abs(h.x - p.x) < w + 14 * K;
    const tgt = behind ? (Game.cine || (h.act && h.act.k === 'ult') ? 0.22 : 0.42) : 1; p._fa = p._fa == null ? 1 : p._fa + (tgt - p._fa) * 0.18;
    if (p._fa > 0.98) return dp(g, p); g.save(); g.globalAlpha *= p._fa; try { dp(g, p); } finally { g.restore(); } };
  // HUD de quête masqué pendant les cinématiques (la bande noire reste propre)
  const st = document.createElement('style'); st.textContent = 'body.cine10 #obj, body.cine10 #dq9, body.cine10 #trk10 { opacity: 0 !important; transition: opacity .2s }'; document.head.appendChild(st);
  setInterval(() => { document.body.classList.toggle('cine10', !!(typeof Cine !== 'undefined' && Cine.on)); }, 100);
})();
