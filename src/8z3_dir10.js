// v0.10.7 — Orientation 8 directions : chaque personnage garde un cap (u.hd) issu du déplacement, de la visée souris ou de la cible.
// Rendu : rotation du corps (compression), vue de dos quand il monte, bras et tête orientés vers le cap ; attaques/esquives/techniques visent le vrai cap.
(() => {
  const K = 12; // lissage du cap
  const mouseWorld = () => { const vw = innerWidth, z = clamp(vw / 1150, 0.62, 1.25) * Cam.z; return [Cam.x + (Input.mx - vw / 2) / z, Cam.y + (Input.my - innerHeight / 2) / z]; };
  let mT = 0; addEventListener('mousemove', () => (mT = performance.now()));
  const useMouse = () => Input.lastDev === 'kb' && performance.now() - mT < 2500 && !Input.touch;
  const want = (u) => { const a = u.act; if (a && a.a != null && isFinite(a.a)) return a.a; if (a && (a.k === 'cast' || a.k === 'ult') && isFinite(u.aimA)) return u.aimA;
    const sp = Math.hypot(u.vx || 0, u.vy || 0); if (sp > 40) return Math.atan2(u.vy, u.vx); if (u.isHero && useMouse() && !Game.cine) { const [x, y] = mouseWorld(); return Math.atan2(y - (u.y - 40), x - u.x); } return null; };
  const turn = (a, b, k) => { let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return a + d * k; };
  const upd = (u, dt) => { if (!u) return; if (u.hd == null) u.hd = u.face < 0 ? Math.PI : 0; const w = want(u); if (w != null) u.hd = turn(u.hd, w, 1 - Math.exp(-K * dt)); const c = Math.cos(u.hd); if (Math.abs(c) > 0.25 && !(u.act && u.act.k === 'm1')) u.face = c < 0 ? -1 : 1; };
  const all = () => { const L = [Game.hero]; for (const f of World.foes_) L.push(f); for (const a of Game.allies || []) L.push(a); for (const n of World.npcs || []) L.push(n); for (const c of Game.clones || []) L.push(c); return L; };
  const gu = Game.update.bind(Game); Game.update = function (dt) { const r = gu(dt); if (!this.titleMode && this.hero) for (const u of all()) if (u && !u.gone) upd(u, dt); return r; };
  // visée : souris > déplacement > cible proche > cap
  const aim0 = aimAt; aimAt = function (u) { if (u && u.isHero) { const f = u.aimFoe || u.tgt; if (useMouse()) { const [x, y] = mouseWorld(); const a = Math.atan2(y - (u.y - 40), x - u.x); u.face = Math.cos(a) < 0 ? -1 : 1; return a; }
      const m = Input.move(); if (!f && Math.hypot(m.x, m.y) > 0.3) { const a = Math.atan2(m.y, m.x); if (Math.abs(m.x) > 0.2) u.face = m.x < 0 ? -1 : 1; return a; } if (!f && !nearestFoe(u, 320) && u.hd != null) return u.hd; } return aim0(u); };
  // esquive sans direction : vers le cap (au lieu de reculer uniquement à l'horizontale)
  const dg = dodge; dodge = function (u) { const r = dg(u); const m = Input.move(); if (u && u.act && u.act.k === 'dash' && Math.hypot(m.x, m.y) < 0.1 && useMouse() && u.isHero) { const a = aimAt(u) + Math.PI; u.act.a = a; u.vx = Math.cos(a) * 920; u.vy = Math.sin(a) * 660; } return r; };
  // pose : bras avant et tête vers le cap vertical
  const po = poseOf; poseOf = function (u) { const P = po(u); if (!u || u.hd == null) return P; const vz = -Math.sin(u.hd); const act = u.act && (u.act.k === 'm1' || u.act.k === 'cast' || u.act.k === 'ult');
    const Q = Object.assign({}, P); Q.head = (P.head || 0) - vz * 0.28; if (act) { Q.aF = P.aF + vz * 0.85; Q.lean = P.lean - vz * 0.12; } return Q; };
  // rendu : rotation du corps + vue de dos
  const dr = drawRig; drawRig = function (g, u, tint) { if (!u || u.hd == null || u.bj) return dr(g, u, tint); const vz = -Math.sin(u.hd), az = Math.abs(vz); if (az < 0.2) return dr(g, u, tint);
    const k = 1 - 0.16 * Math.sin(Math.PI * Math.min(1, az)); u._back = !tint && !u.big && vz > 0.45 ? Math.min(1, (vz - 0.45) / 0.3) : 0; const sk = 0.09 * (u.face || 1) * Math.sin(Math.PI * Math.min(1, az)) * (vz > 0 ? -1 : 1); g.save(); g.translate(u.x, u.y); g.transform(k, 0, sk, 1, 0, 0); g.translate(-u.x, -u.y); dr(g, u, tint); g.restore(); u._back = 0; if (u.hand) u.hand.x = u.x + (u.hand.x - u.x) * k;
  };
  // vue de dos : la tête est recouverte par les cheveux (dans le repère de la tête, donc toujours bien placée)
  const dh = drawHead; drawHead = function (g, u, L, C, ink, tint, kid, vel, wav, P) { const r = dh.apply(this, arguments); const a = u && u._back; if (!a) return r; const R = kid ? 12.5 : 11.5, hy = -10;
    g.save(); g.globalAlpha *= a; g.fillStyle = C(L.hair || '#2a2a2a'); g.strokeStyle = ink; g.lineWidth = 2.4; g.beginPath(); g.ellipse(0, hy, R * 1.04, R * 1.02, 0, 0, TAU); g.fill(); g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-R * 0.5, hy - R * 0.1); g.quadraticCurveTo(0, hy + R * 0.45, R * 0.5, hy - R * 0.1); g.stroke();
    if (L.band) { g.fillStyle = C('#1b2240'); g.fillRect(-R, hy - R * 0.5, R * 2, R * 0.34); g.strokeRect(-R, hy - R * 0.5, R * 2, R * 0.34); } g.restore(); return r; };
  window.DIR10 = { upd, mouseWorld };
})();
