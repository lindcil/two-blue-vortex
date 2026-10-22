// v0.10.25 — aide à la visée : M1 et techniques vers le curseur (aimanté vers l'ennemi le plus proche du curseur) ; sans souris (tactile/manette) : ennemi le plus proche. Réglage « Aide à la visée ».
(() => { let mouse = false; addEventListener('mousemove', () => { if (!Input.touch) mouse = true; }); addEventListener('touchstart', () => { mouse = false; }, { passive: true });
  const mw = () => { const vw = innerWidth, z = clamp(vw / 1150, 0.62, 1.25) * Cam.z; return [Cam.x + (Input.mx - vw / 2) / z, Cam.y + (Input.my - innerHeight / 2) / z]; };
  const foes = () => World.foes().filter((f) => f.hp > 0 && !f.passive && !f.gone);
  const on = () => !Save.set || Save.set.aim !== false;
  const base = aimAt; aimAt = function (u) { if (!u || !u.isHero || !on()) return base(u);
    const pad = Input.lastDev === 'pad' || Input.touch || !mouse; const oy = u.y - 40;
    if (!pad && Input.mx != null) { const [cx, cy] = mw(); const ac = Math.atan2(cy - oy, cx - u.x); let best = null, bs = 1e9;
      for (const f of foes()) { const fy = f.y - 30, d = Math.hypot(f.x - u.x, fy - oy); if (d > 1100) continue; const dc = Math.hypot(f.x - cx, fy - cy); let da = Math.abs(Math.atan2(fy - oy, f.x - u.x) - ac); if (da > Math.PI) da = TAU - da;
        if (dc < 150 || da < 0.3) { const sc = dc + da * 400; if (sc < bs) { bs = sc; best = f; } } }
      const a = best ? Math.atan2(best.y - 30 - oy, best.x - u.x) : ac; u.face = Math.cos(a) < 0 ? -1 : 1; u.aimFoe10 = best; return a; }
    let best = null, bd = 700; for (const f of foes()) { const d = Math.hypot(f.x - u.x, f.y - u.y); if (d < bd) { bd = d; best = f; } }
    if (best) { const a = Math.atan2(best.y - u.y, best.x - u.x); u.face = Math.cos(a) < 0 ? -1 : 1; return a; } return base(u); };
  // réglage
  const tr = UI.t_reglages; if (tr) UI.t_reglages = function () { const S = Save.set; return tr.apply(this, arguments) + this.row('Aide à la visée (curseur / ennemi proche)', this.sel('aim', S.aim !== false, [[true, 'Oui'], [false, 'Non']])); };
  window.AIM10 = { on, mw, get mouse() { return mouse; } };
})();
