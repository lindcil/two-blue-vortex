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
// v0.10.19 — détente de l'ultime : image d'impact sombre (sans flash blanc), secousse, double onde de choc, poussière, écrasement/étirement du héros
(() => { const fu = fireUlt; fireUlt = function (u, id) { const r = fu.apply(this, arguments);
  try { if (u && u.isHero) { const S = SK[id] || {}, c = elc(S.el || 'wind'); Game.impact(u.x, u.y - 40, 0.14); Cam.shake(0.45); Cam.z *= 1.05;
    FX.shock(u.x, u.y - 30, c, 190, 0.45, 12); Game.later(0.08, () => FX.shock(u.x, u.y - 30, '#ffffff', 280, 0.55, 5)); FX.dust && FX.dust(u.x, u.y, 14); u.sq = -0.38; Game.later(0.12, () => { u.sq = 0.22; }); } } catch (e) {}
  return r; }; })();
// v0.10.23 — perf : au plus 24 nombres/textes flottants à la fois (les plus anciens non-« big » partent d'abord)
(() => { const tx = FX.text.bind(FX); FX.text = function (...a) { const T = this.T; if (T.length >= 24) { const i = T.findIndex((t) => !t.big); T.splice(i < 0 ? 0 : i, 1); } return tx(...a); }; })();
// v0.10.23 — perf : nombres/textes flottants rendus une fois en sprite (contour + remplissage), puis simplement redimensionnés
(() => { const C = new Map(), SC = 2;
  const spr = (t) => { const k = t.s + '|' + t.c + '|' + t.size + '|' + (t.dmgN ? 1 : 0); let e = C.get(k); if (e) return e; const font = `${t.size * SC}px ${t.dmgN ? "'TBV Ext', 'Luckiest Guy'" : "'TBV Ext', 'Lilita One'"}, Impact, 'Arial Black', system-ui, sans-serif`;
    const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = font; const w = Math.ceil(g.measureText(t.s).width) + 12 * SC, h = Math.ceil(t.size * SC * 1.5) + 8 * SC; c.width = w; c.height = h;
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.lineJoin = 'round'; g.lineWidth = 5 * SC; g.strokeStyle = INK; const by = Math.round(t.size * SC * 1.15) + 2 * SC; g.strokeText(t.s, w / 2, by); g.fillStyle = t.c; g.fillText(t.s, w / 2, by);
    e = { c, w: w / SC, h: h / SC, by: by / SC }; if (C.size > 400) C.clear(); C.set(k, e); return e; };
  FX.drawText = function (g) { for (const t of this.T) { const q = t.t / t.life; let s = 1; if (t.pop) s = t.t < 0.08 ? lerp(0.4, 1.6, t.t / 0.08) : t.t < 0.22 ? lerp(1.6, 1, ease.back((t.t - 0.08) / 0.14)) : 1; else if (t.big) s = 1 + Math.max(0, 0.4 - t.t * 2);
      const e = spr(t); g.globalAlpha = Math.min(1, (1 - q) * 3); g.drawImage(e.c, t.x - e.w * s / 2, t.y - e.by * s, e.w * s, e.h * s); } g.globalAlpha = 1; };
})();
