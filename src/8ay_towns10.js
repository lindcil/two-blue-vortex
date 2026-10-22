// v0.10.29 — Hameau du Mont Myōboku (sud-est, hors des murs) : quelques maisons de crapauds + statue. Avant le passage à l'échelle K (8b).
(() => {
  const bd = World.build.bind(World);
  World.build = function () { const r = bd(); if (Game.titleMode) return r; const X = 3350, Y = 3900; const near = (o, R) => Math.hypot(o.x - X, o.y - (Y - 20)) < R;
    const cut = this.props.filter((p) => p.kind !== 'house' && p.kind !== 'bridge' && near(p, 470)); this.props = this.props.filter((p) => !cut.includes(p)); this.solids = this.solids.filter((o) => !near({ x: o.x + o.w / 2, y: o.y + o.h / 2 }, 470));
    this.pois.push({ id: 'myoboku', x: X, y: Y - 120, n: 'Mont Myōboku', ic: '蛙' });
    for (const [dx, dy, c] of [[-260, -60, '#4f8a5a'], [-130, -150, '#5f9a4a'], [140, -150, '#4f8a5a'], [270, -60, '#6a8f3a'], [-200, 120, '#5f9a4a'], [210, 120, '#4f8a5a']]) { const w = 84, h = 62; this.solids.push({ x: X + dx - w / 2, y: Y + dy - h, w, h: h * 0.75 }); this.props.push({ kind: 'house', x: X + dx, y: Y + dy, w, h, roof: c, small10: 1 }); }
    this.props.push({ kind: 'toad10', x: X, y: Y - 40 }); this.solids.push({ x: X - 30, y: Y - 64, w: 60, h: 30 }); return r; };
  const dp = World.drawProp.bind(World);
  World.drawProp = function (g, p) { if (p.kind !== 'toad10') return dp(g, p); const { x, y } = p; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x, y + 2, 46, 11, 0, 0, TAU); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.fillStyle = '#8a8f80'; g.fillRect(x - 34, y - 18, 68, 18); g.strokeRect(x - 34, y - 18, 68, 18);
    g.fillStyle = '#6fa060'; g.beginPath(); g.ellipse(x, y - 52, 36, 32, 0, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = '#e8d070'; for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * 18, y - 78, 10, 0, TAU); g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(x + s * 18 - 6, y - 80, 12, 3); g.fillStyle = '#e8d070'; }
    g.strokeStyle = '#c0503a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 24, y - 44); g.quadraticCurveTo(x, y - 34, x + 24, y - 44); g.stroke(); };
})();
