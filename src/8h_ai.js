// v0.8 — IA ennemie plus rusée + rééquilibrage du joueur. Objectif : le spam M1 seul perd contre un groupe normal.
(() => {
  const D = () => Save.set.diff; // 0 Histoire · 1 Normal · 2 Défi
  const HPK = () => [1.1, 1.6, 1.9][D()], DMGK = () => [0.9, 1.3, 1.5][D()], SMART = () => [0.35, 0.8, 1][D()];
  const heavy = (f) => f.boss || (f.size || 1) > 1.1 || f.kind === 'bijuu';
  // --- PV des ennemis + rôles de groupe ---
  const sf = spawnFoe; spawnFoe = function (type, x, y, extra) { const f = sf(type, x, y, extra); if (f && type !== 'dummy' && type !== 'sensei') { f.hp *= HPK(); f.maxHp *= HPK(); const F = FOE[type];
      const grp = World.foes_.filter((o) => o !== f && !o.boss && o.type !== 'dummy' && Math.hypot(o.x - x, o.y - y) < 500).length;
      f.role = f.boss ? 'boss' : F.ranged ? 'range' : ['melee', 'flank', 'melee', 'support', 'flank'][grp % 5]; f.side = Math.random() < 0.5 ? -1 : 1; f.m1n = 0; f.m1w = 0; } return f; };
  // --- dégâts : ennemis plus forts, garde contre le spam M1, esquive, super-armure, joueur affaibli ---
  const ht = hurt; hurt = function (t, dmg, src, o = {}) { const h = Game.hero;
    if (t && t.isHero && src && !src.isHero && !src.isAlly) dmg *= DMGK();
    if (src && src.isHero && t && !t.isHero && !t.isAlly && t.type !== 'dummy') {
      const m1 = src.act && src.act.k === 'm1' && !o.el && !(SK[src.act.id]);
      if (t.dodgeT > 0) { FX.text(t.x, t.y - 90, 'Esquive', '#cfe0ff', 14); return 0; }
      if (m1) { dmg *= 0.7; // M1 plus faible + rendements décroissants
        const now = Game.t; src.m1c = now - (src.m1t || -9) < 1.3 ? (src.m1c || 0) + 1 : 1; src.m1t = now; dmg *= Math.max(0.3, 1 - Math.max(0, src.m1c - 3) * 0.12);
        if (t.guardT > 0) { FX.text(t.x, t.y - 92, 'Garde', '#ffd166', 15); FX.ring(t.x, t.y - 40, '#ffd166', 10, 46, 0.25); dmg *= 0.08; t.parry = (t.parry || 0) + 1; o = Object.assign({}, o, { k: 0 }); if (t.parry >= 2 && !t.counterQ) counter(t, src); return ht(t, dmg, src, o); }
        t.m1n = Game.t - (t.m1w || -9) < 1.6 ? (t.m1n || 0) + 1 : 1; t.m1w = Game.t; const lim = t.boss ? 2 : Math.random() < SMART() ? 3 : 5;
        if (t.m1n >= lim && t.st && !(t.st.stun > 0)) { t.guardT = 1.1; t.m1n = 0; t.parry = 0; t.act = null; } }
      else if (t.guardT > 0) { t.guardT = 0; FX.text(t.x, t.y - 92, 'Garde brisée', '#ff9a2a', 15); if (t.st) t.st.stun = Math.max(t.st.stun || 0, 0.5); }
      if (heavy(t)) o = Object.assign({}, o, { k: (o.k || 1) * 0.15 }); }
    return ht(t, dmg, src, o); };
  const counter = (f, h) => { f.counterQ = 1; f.guardT = 0; FX.text(f.x, f.y - 104, 'Contre !', '#ff6b5e', 18, true); f.sign = { k: 'tora', t: 0 }; f.sq = -0.3;
    Game.later(0.28, () => { f.counterQ = 0; if (f.hp <= 0 || !h || h.hp <= 0) return; const a = Math.atan2(h.y - f.y, h.x - f.x); f.vx += Math.cos(a) * 700; f.vy += Math.sin(a) * 500; f.act = { k: 'm1', n: 2, t: 0.1, dur: 0.34, hit: true, a };
      Game.later(0.08, () => { if (dist(h, f) < 110) { hurt(h, FOE[f.type].dmg * 1.8, f, { k: 2 }); if (h.hp > 0 && !(h.iframe > 0)) { h.stunT = 0.5; h.m1Lock = 0.6; } } V.ink && V.ink(f.x, f.y - 40, a, '#ff6b5e', 80); }); }); };
  // --- le joueur lance une technique télégraphiée : les ennemis proches tentent un pas de côté ---
  const cs = castSkill; castSkill = function (u, S, id, isHero) { const cd0 = u.cd && u.cd[id]; const r = cs.apply(this, arguments);
    if (isHero && u.cd && u.cd[id] > (cd0 || 0)) { u.cd[id] *= 1.3; // recharges plus longues
      for (const f of World.foes()) { if (f.passive || f.type === 'dummy' || f.hp <= 0 || heavy(f) && !f.boss) continue; if (dist(f, u) < 420 && Math.random() < SMART() * (f.boss ? 0.55 : 0.4)) { const a = Math.atan2(f.y - u.y, f.x - u.x) + f.side * Math.PI / 2; Game.later(rnd(0.05, 0.2), () => { if (f.hp <= 0 || (f.st && f.st.stun > 0)) return; f.vx += Math.cos(a) * 760; f.vy += Math.sin(a) * 540; f.dodgeT = 0.28; FX.ghost && FX.ghost(f, 'rgba(200,210,255,.4)'); }); } } }
    return r; };
  // --- M1 : temps de récupération après la 3e frappe, dash moins invulnérable, jauge d’ultime plus lente ---
  const sm = startM1; startM1 = function (u, n) { if (u.isHero && (u.m1Lock > 0 || u.stunT > 0)) return; const r = sm(u, n); if (u.isHero && n === 2) u.m1Lock = 0.38; return r; };
  const dg = dodge; dodge = function (u) { const r = dg(u); if (u.isHero) u.iframe = Math.min(u.iframe, 0.17); return r; };
  const ug = Game.ultGain.bind(Game); Game.ultGain = function (d) { return ug(d * 0.65); };
  // --- boucle : rôles, recul, soins, phases de boss, soins du joueur réduits ---
  const fu = foeUpdate; foeUpdate = function (f, dt) { f.guardT = Math.max(0, (f.guardT || 0) - dt); f.dodgeT = Math.max(0, (f.dodgeT || 0) - dt); f.backT = Math.max(0, (f.backT || 0) - dt);
    const wasAct = f.act && f.act.k === 'rec'; fu(f, dt); if (f.hp <= 0 || f.passive || !f.aggro || f.kind === 'bijuu' || f.type === 'dummy') return;
    const h = Game.hero; if (!h || h.hp <= 0) return; const d = dist(h, f), F = FOE[f.type], sp = F.sp;
    if (f.guardT > 0) { f.vx *= 0.6; f.vy *= 0.6; f.face = h.x < f.x ? -1 : 1; return; }
    if (wasAct && !f.act && f.role !== 'range' && Math.random() < SMART() * 0.6) f.backT = 0.5; // frappe puis recule (appât)
    if (f.act) return;
    if (f.backT > 0) { const a = Math.atan2(f.y - h.y, f.x - h.x); f.vx += Math.cos(a) * sp * dt * 8; f.vy += Math.sin(a) * sp * dt * 8; return; }
    if (f.role === 'flank' && d > 90) { const a = Math.atan2(h.y - f.y, h.x - f.x) + f.side * 0.9 * Math.min(1, d / 300); f.vx += Math.cos(a) * sp * dt * 3; f.vy += Math.sin(a) * sp * dt * 3; }
    if (f.role === 'range' && d < 220) { const a = Math.atan2(f.y - h.y, f.x - h.x); f.vx += Math.cos(a) * sp * dt * 5; f.vy += Math.sin(a) * sp * dt * 5; }
    if (f.role === 'support') { f.cdH = (f.cdH ?? 4) - dt; if (d < 200) { const a = Math.atan2(f.y - h.y, f.x - h.x); f.vx += Math.cos(a) * sp * dt * 4; f.vy += Math.sin(a) * sp * dt * 4; }
      if (f.cdH <= 0) { const w = World.foes().filter((o) => o !== f && o.hp > 0 && o.hp < o.maxHp * 0.8 && dist(o, f) < 320).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]; if (w) { f.cdH = 7; f.sign = { k: 'mi', t: 0 }; w.hp = Math.min(w.maxHp, w.hp + w.maxHp * 0.15); FX.ring(w.x, w.y - 30, '#7ad07a', 10, 60, 0.5); FX.text(w.x, w.y - 100, '+', '#7ad07a', 16); } else f.cdH = 1.5; } }
    // boss : phases
    if (f.boss && f.type !== 'sensei') { const ph = f.hp < f.maxHp * 0.33 ? 3 : f.hp < f.maxHp * 0.66 ? 2 : 1; if (ph > (f.phase || 1)) { f.phase = ph; FX.text(f.x, f.y - 130, 'Phase ' + ph, '#ff6b5e', 22, true); Cam.shake(0.3); f.cdA = 0; f.sp = (f.sp || sp) * 1.15; }
      if ((f.phase || 1) >= 2) { f.cdW = (f.cdW ?? 5) - dt; if (f.cdW <= 0 && d < 380) { f.cdW = f.phase === 3 ? 4.5 : 6.5; const x = f.x, y = f.y, R = 170 + f.phase * 20; f.act = { k: 'cast', t: 0, dur: 0.9 }; f.sign = { k: 'mi', t: 0 };
          FX.add({ k: 'fn', ground: 1, x, y, life: 0.85, draw: (g, p, q) => { g.globalAlpha = 0.3 + q * 0.5; g.strokeStyle = '#ff4a5a'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, R * q, R * 0.45 * q, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(x, y, R, R * 0.45, 0, 0, TAU); g.stroke(); } });
          Game.later(0.85, () => { if (f.hp <= 0) return; FX.shock(x, y, '#ff6b5e', R, 0.4, 9); Cam.shake(0.3); for (const t of [h, ...Game.allies]) if (!t.down && Math.hypot(t.x - x, (t.y - y) / 0.45) < R) hurt(t, F.dmg * 1.6, f, { k: 2 }); }); } } } };
  const up = Game.update.bind(Game); let lastHp = null;
  Game.update = function (dt) { const r = up(dt); const h = this.hero; if (!h || !this.running || this.paused) return r; const d = dt || 0; h.m1Lock = Math.max(0, (h.m1Lock || 0) - d); h.stunT = Math.max(0, (h.stunT || 0) - d);
    if (h.stunT > 0) { h.vx *= 0.5; h.vy *= 0.5; }
    if (lastHp != null && h.hp > lastHp && this.inCombat() && h.hp < h.maxHp) h.hp = lastHp + (h.hp - lastHp) * 0.7; lastHp = h.hp; return r; };
  window.AI08 = { HPK, DMGK };
})();
