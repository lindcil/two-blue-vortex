// v0.10.32 — détails de tête des maîtres (après 8z5 qui remplace drawHead).
(() => {
  const dh = drawHead; drawHead = function (g, u, L, C) { const r0 = dh.apply(this, arguments); const w = u && u.who10; if (!w || (w !== 'bee' && w !== 'momo')) return r0; const r = 10, c = -12;
    g.save(); g.lineJoin = 'round';
    if (w === 'bee') { g.fillStyle = '#111'; g.beginPath(); g.roundRect ? g.roundRect(r - 9.5, c + 0.6, 8.5, 4.6, 1.6) : g.rect(r - 9.5, c + 0.6, 8.5, 4.6); g.fill(); g.strokeStyle = '#111'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(r - 9.5, c + 2.2); g.lineTo(-2, c + 1.4); g.stroke();
      g.fillStyle = '#e8e0d0'; g.beginPath(); g.moveTo(r - 4, c + r - 0.5); g.lineTo(r - 1, c + r + 3.5); g.lineTo(r - 6, c + r + 1); g.closePath(); g.fill(); // bouc
      g.strokeStyle = '#3a2216'; g.lineWidth = 1; g.beginPath(); g.moveTo(1, c + 8); g.quadraticCurveTo(3, c + 4.5, 2, c + 2); g.moveTo(1, c + 8); g.quadraticCurveTo(-1.5, c + 5, -0.5, c + 2.5); g.stroke(); } // tatouage
    else { g.fillStyle = '#f4f0e6'; g.strokeStyle = '#6a6070'; g.lineWidth = 1.1; for (const [hx, ln] of [[1.5, 9], [-3, 7.5]]) { g.beginPath(); g.moveTo(hx - 2.2, c - r + 2.5); g.quadraticCurveTo(hx - 1, c - r - ln * 0.6, hx + 1.5, c - r - ln); g.quadraticCurveTo(hx + 1.2, c - r - ln * 0.4, hx + 2.4, c - r + 2.8); g.closePath(); g.fill(); g.stroke(); }
      g.fillStyle = '#eef0ff'; g.beginPath(); g.arc(r - 5.3, c + 3.2, 2.1, 0, TAU); g.fill(); g.fillStyle = '#b06ad8'; g.beginPath(); g.arc(r - 5.3, c - 4.5, 1.1, 0, TAU); g.fill(); }
    g.restore(); return r0; };
})();
