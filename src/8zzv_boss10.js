// v0.10.47 — Barre de boss minimaliste : nom espacé, barre fine avec traînée de dégâts, crans à 25/50/75 %, pourcentage discret. Couvre aussi les boss définis dans FOE (ex. Code).
(() => {
  const isB = (f) => (f.boss || (FOE[f.type] && FOE[f.type].boss) || f.kind === 'bijuu') && f.type !== 'sensei' && !f.passive && f.hp > 0;
  UI.bossHud = function (g, vw, vh) { const h = Game.hero; if (!h) return; const b = World.foes().filter((f) => isB(f) && (f.aggro || f.hp < f.maxHp) && dist(f, h) < 1300).sort((a, c) => dist(a, h) - dist(c, h))[0];
    const now = performance.now(); if (!b) { this.bb10 = null; return; } if (!this.bb10 || this.bb10.f !== b) this.bb10 = { f: b, t0: now, lag: b.hp / b.maxHp };
    const S = this.bb10, pr = Math.max(0, b.hp / b.maxHp); S.lag = pr > S.lag ? pr : S.lag + (pr - S.lag) * 0.045; const ap = Math.min(1, (now - S.t0) / 450);
    const W = Math.min(420, vw * 0.62), x = (vw - W) / 2, y = 30 + (1 - ap) * -20, ts = Save.set.ts || 1;
    g.save(); g.globalAlpha = ap;
    g.font = `${Math.round(13 * ts)}px 'TBV Ext', 'Lilita One', system-ui`; g.textAlign = 'left'; g.fillStyle = '#eef3ff'; const nm = (b.n || '').toUpperCase().split('').join(String.fromCharCode(8202)); g.lineWidth = 3; g.strokeStyle = 'rgba(6,10,22,.85)'; g.strokeText(nm, x, y - 8); g.fillText(nm, x, y - 8);
    g.textAlign = 'right'; g.fillStyle = 'rgba(238,243,255,.7)'; const pc = Math.ceil(pr * 100) + '%'; g.strokeText(pc, x + W, y - 8); g.fillText(pc, x + W, y - 8);
    g.fillStyle = 'rgba(6,10,22,.7)'; g.fillRect(x - 2, y - 2, W + 4, 9);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(x, y, W * S.lag, 5);
    const low = pr < 0.25, pulse = low ? 0.75 + 0.25 * Math.sin(now / 120) : 1; g.globalAlpha = ap * pulse; g.fillStyle = low ? '#ff4a5a' : '#ff6b5e'; g.fillRect(x, y, W * pr, 5); g.globalAlpha = ap;
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y, W * pr, 1.5);
    g.fillStyle = 'rgba(6,10,22,.9)'; for (const k of [0.25, 0.5, 0.75]) g.fillRect(x + W * k - 1, y - 1, 2, 7);
    g.restore(); };
})();
