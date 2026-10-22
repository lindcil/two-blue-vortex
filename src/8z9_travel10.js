// v0.10.26 — Voyage rapide depuis la carte (hors combat, dans le village et ses abords).
(() => { const T10 = (s) => (window.LANG10 && LANG10.t ? LANG10.t(s) : s);
  const homeXY = () => { const H = World.props.filter((p) => p.kind === 'house' && !p.label && p.y < K10 * (WALL_Y - 100) && p.x < K10 * 1500).sort((a, b) => Math.hypot(a.x - K10 * 800, a.y - K10 * 1250) - Math.hypot(b.x - K10 * 800, b.y - K10 * 1250))[0]; return H ? [H.x / K10, H.y / K10 + 50] : [800, 1300]; };
  const DEST = [['Bureau du Hokage', () => [1600, 760]], ['Académie', () => [2250, 790]], ['Ichiraku', () => [1290, 920]], ['Rue marchande', () => [1500, 1590]], ['Terrain d’entraînement', () => [2850, 1330]], ['Maison', homeXY], ['Porte du village', () => [1600, WALL_Y - 140]]];
  const ok = () => Game.mode === 'voie' && Game.hero && !Game.creative && !(window.ZONE8 && ZONE8.room) && !Game.cine;
  const go = (i) => { if (!ok()) return; if (Game.inCombat()) { UI.toast && UI.toast(T10('Impossible en combat')); return; } let [x, y] = DEST[i][1](); UI.close(); const f = () => { x *= K10; y *= K10; const hh = Game.hero; hh.x = x; hh.y = y; hh.vx = hh.vy = 0; for (const a of Game.allies) { a.x = x + rnd(-60, 60); a.y = y + rnd(20, 60); } Cam.x = x; Cam.y = y; if (window.ZONE8) ZONE8.sec = ZONE8.secAt(Game.hero.x, Game.hero.y); }; window.ZONE8 ? ZONE8.wipe(f, T10(DEST[i][0])) : f(); };
  window.TRAVEL10 = { DEST, go };
  const tc = UI.t_carte.bind(UI);
  UI.t_carte = function () { const s0 = tc(); if (!ok()) return s0; let s = ''; const dis = Game.inCombat();
    s += `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px"><b style="width:100%;color:var(--dim)">${T10('Voyage rapide')}${dis ? ' — ' + T10('Impossible en combat') : ''}</b>` + DEST.map((d, i) => `<button class="keybtn" ${dis ? 'disabled' : ''} onclick="TRAVEL10.go(${i})">${T10(d[0])}</button>`).join('') + '</div>'; return s + s0; };
})();
