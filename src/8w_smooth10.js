// v0.9.9 — Fluidité : mélange des poses avec easing (plus de saut entre états),
// tremblement de caméra lissé, sous-étapes pour les smears, et pas manuel déterministe pour les tests (SMOOTH10.step).
(() => {
  const S = window.SMOOTH10 = { STEP: 1 / 60, MAXSTEPS: 4, acc: 0, alpha: 1, on: true, manual: false, k: { base: 26, act: 34, hurt: 40 } };
  const ents = () => { const L = [Game.hero]; try { for (const f of World.foes_ || []) if (!f.gone) L.push(f); for (const a of Game.allies) L.push(a); for (const c of Game.clones) L.push(c); for (const n of World.npcs || []) L.push(n); } catch (e) {} return L; };
  const snap = () => { for (const u of ents()) if (u) { u._px = u.x; u._py = u.y; } S._cx = Cam.x; S._cy = Cam.y; };
  // Pas adaptatif : 60 Hz si le jeu suit, sinon 30 Hz pour ne pas aggraver les FPS sur machine lente (même résultat temporel).
  const stepOnce = (dt, last) => { if (last) snap(); Game.update(dt); };
  function renderInterp() { const a = S.alpha; if (a >= 0.999 || !S.on) return Game.render(); const L = ents(), sv = [];
    for (const u of L) if (u && u._px != null && Math.abs(u.x - u._px) < 200 && Math.abs(u.y - u._py) < 200) { sv.push(u, u.x, u.y); u.x = u._px + (u.x - u._px) * a; u.y = u._py + (u.y - u._py) * a; }
    const cx = Cam.x, cy = Cam.y; if (S._cx != null) { Cam.x = S._cx + (cx - S._cx) * a; Cam.y = S._cy + (cy - S._cy) * a; }
    try { Game.render(); } finally { for (let i = 0; i < sv.length; i += 3) { sv[i].x = sv[i + 1]; sv[i].y = sv[i + 2]; } Cam.x = cx; Cam.y = cy; } }
  let last = performance.now();
  frame = function (now) { const raw = Math.min(0.25, Math.max(0, (now - last) / 1000)); last = now;
    try { if (S.manual) { /* tests : avance pilotée par SMOOTH10.step */ }
      else if (!S.on || Game.titleMode) { Game.update(Math.min(0.05, raw)); S.alpha = 1; Game.render(); }
      else { const step = raw > 0.024 ? 1 / 30 : S.STEP; S.acc = Math.min(S.acc + raw, step * 3); let n = Math.min(3, Math.floor(S.acc / step)); for (let i = 0; i < n; i++) { stepOnce(step, i === n - 1); S.acc -= step; } S.alpha = Math.max(0, Math.min(1, S.acc / step)); renderInterp(); } }
    catch (e) { console.error(e); } requestAnimationFrame(frame); };
  S.step = (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) Game.update(dt); S.alpha = 1; Game.render(); };
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
