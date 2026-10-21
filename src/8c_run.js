// v0.7 — Course ninja : après ~1,6 s de course continue, sprint (bras en arrière, buste penché, 440 px/s).
// Vente de la vitesse (voir RESEARCH.md) : léger dézoom, lignes de vitesse en bord d’écran, traînées de vent, bouffées de poussière aux appuis,
// images rémanentes douces, souffle du vent, inclinaison légère dans les virages, dérapage à l’arrêt. Aucun flash ; tout est atténué si « réduire les flashs ».
(() => {
  const cv = document.createElement('canvas'); cv.id = 'spd07'; Object.assign(cv.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }); document.body.appendChild(cv); const g = cv.getContext('2d');
  let amt = 0, wind = null, ghostT = 0, stepT = 0, wasRun = false, lastFace = 1, tilt = 0;
  const windOn = (v) => { const c = Sfx.ctx; if (!c) return; if (!wind) { const n = c.sampleRate * 2, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; s.loop = true; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 0.6; const gg = c.createGain(); gg.gain.value = 0; s.connect(f); f.connect(gg); gg.connect(Sfx.g || c.destination); s.start(); wind = gg; } wind.gain.setTargetAtTime(v * 0.12 * (Save.set.vol || 0), c.currentTime, 0.15); };
  window.RUN07 = { get amt() { return amt; } };
  const up = Game.update.bind(Game);
  Game.update = function (dt) { const r = up(dt); const h = this.hero, d = dt || 0; if (!h || this.titleMode) return r;
    const run = !!h.ninjaRun && !this.cine && h.hp > 0; amt += ((run ? 1 : 0) - amt) * Math.min(1, d * (run ? 3 : 5));
    if (run) { Cam.tz = 1 - 0.08 * amt; ghostT -= d; stepT -= d; if (ghostT <= 0) { ghostT = Save.set.rf ? 0.12 : 0.07; FX.ghost(h, 'rgba(143,211,255,.5)'); }
      if (stepT <= 0) { stepT = 0.16; FX.dust(h.x - h.vx * 0.03, h.y, 3); }
      if (Math.random() < 0.6) { const L = rnd(30, 70), yy = h.y - rnd(10, 70); FX.custom({ x: h.x, y: yy, life: 0.25, draw: (g2, p, q) => { g2.save(); g2.globalAlpha = 0.5 * (1 - q); g2.strokeStyle = '#e6f6ff'; g2.lineWidth = 2; const a = Math.atan2(h.vy, h.vx) + Math.PI; g2.beginPath(); g2.moveTo(p.x, p.y); g2.lineTo(p.x + Math.cos(a) * L * (1 + q), p.y + Math.sin(a) * L * (1 + q)); g2.stroke(); g2.restore(); } }); }
      if (h.face !== lastFace) tilt = 0.05 * h.face; }
    else if (wasRun && Cam.tz < 1 && !this.cine) Cam.tz = 1;
    if (wasRun && !run && h.hp > 0 && !this.cine && !h.act) { FX.dust(h.x, h.y, 10); h.sq = -0.25; for (let i = 0; i < 4; i++) FX.add({ k: 'spark', x: h.x + rnd(-10, 10), y: h.y, vx: -h.face * rnd(60, 160), vy: rnd(-80, -20), c: '#c9b08a', s: rnd(2, 4), life: 0.4, g: 300 }); }
    tilt *= Math.pow(0.02, d); lastFace = h.face; wasRun = run; windOn(amt);
    const game = document.getElementById('cv'); if (game) game.style.transform = Math.abs(tilt) > 0.002 ? `rotate(${tilt}rad)` : '';
    // lignes de vitesse en bordure (overlay)
    const W2 = innerWidth, H2 = innerHeight; if (cv.width !== W2 || cv.height !== H2) { cv.width = W2; cv.height = H2; } if (amt > 0.01 || cv._d) { g.clearRect(0, 0, W2, H2); cv._d = amt > 0.05; }
    if (amt > 0.05) { g.save(); g.globalAlpha = amt * (Save.set.rf ? 0.25 : 0.4); g.strokeStyle = '#e8eefc'; const n = Save.set.low ? 14 : 34; for (let i = 0; i < n; i++) { const a = (i / n) * TAU + Game.t * 0.7 + Math.sin(i * 13.1); const r0 = Math.max(W2, H2) * (0.42 + 0.06 * Math.sin(Game.t * 9 + i)); const r1 = r0 + 60 + 50 * Math.sin(i * 7.7 + Game.t * 20);
        g.lineWidth = 1 + (i % 3); g.beginPath(); g.moveTo(W2 / 2 + Math.cos(a) * r0, H2 / 2 + Math.sin(a) * r0); g.lineTo(W2 / 2 + Math.cos(a) * r1, H2 / 2 + Math.sin(a) * r1); g.stroke(); } g.restore(); }
    return r; };
})();
