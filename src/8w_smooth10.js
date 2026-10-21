// v0.9.9 — Fluidité : mélange des poses avec easing (plus de saut entre états),
// tremblement de caméra lissé, sous-étapes pour les smears, et pas manuel déterministe pour les tests (SMOOTH10.step).
(() => {
  const S = window.SMOOTH10 = { STEP: 1 / 60, MAXSTEPS: 4, acc: 0, alpha: 1, on: true, manual: false, k: { base: 26, act: 34, hurt: 40 } };
  const fr = frame; frame = function (now) { if (S.manual) { requestAnimationFrame(frame); return; } return fr(now); };
  S.step = (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) Game.update(dt); Game.render(); };
  // ── mélange des poses : chaque pose cible est rejointe par un lissage exponentiel en temps réel (indépendant des FPS)
  const po = poseOf; poseOf = function (u) { const P = po(u); if (!u || !S.on) return P; const now = Game.t, last = u._pt, k = u.act ? S.k.act : u.hurtT > 0 ? S.k.hurt : S.k.base;
    if (!u._pp || last == null || now < last || now - last > 0.5) { u._pp = Object.assign({}, P); u._pt = now; return u._pp; }
    const dt = now - last; if (dt <= 0) return u._pp; u._pt = now; const f = 1 - Math.exp(-k * dt), o = u._pp; for (const key of PK) { const b = P[key] ?? 0, a0 = o[key] ?? 0; o[key] = a0 + (b - a0) * f; } return Object.assign({}, o); };
  // ── caméra : tremblement lissé (bruit continu au lieu d'un tirage aléatoire par image) et zoom en douceur
  const fol = Cam.follow.bind(Cam); Cam.follow = function (t, dt) { fol(t, dt); const s = this.sh * this.sh * 14 * Save.set.shake, T = performance.now() / 1000; this.kx = s * (Math.sin(T * 47) * 0.6 + Math.sin(T * 83 + 1) * 0.4); this.ky = s * (Math.sin(T * 53 + 2) * 0.6 + Math.sin(T * 71) * 0.4); };
  // ── interface : barres et panneaux qui glissent au lieu de sauter
  const st = document.createElement('style'); st.textContent = '#hud [style*="width"],.bar>i,.bar>div,.fill{transition:width .14s ease-out}#dq9,#act9,#toast{transition:opacity .25s ease,transform .25s cubic-bezier(.2,.9,.3,1.2)}';
  document.head.appendChild(st);
})();
