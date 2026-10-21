// v0.9 — Techniques en données. Une technique = un bloc JSON (temps, animation, zone d’effet, couches VFX, son, variantes).
// Aucun code moteur à écrire : TECH9.def({...}) suffit. Voir ADDING_TECHNIQUES.md.
(() => {
  const R = Math.random, rr = (a, b) => a + R() * (b - a), TAU2 = Math.PI * 2;
  const foes = () => World.foes().filter((f) => !f.passive || f.type === 'dummy');
  const near = (x, y, r, skip) => { let b = null, bd = r; for (const f of foes()) { if (skip && skip.has(f) || f.hp <= 0) continue; const d = Math.hypot(f.x - x, f.y - y); if (d < bd) { bd = d; b = f; } } return b; };
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (a, b) => { if (!isObj(b)) return b === undefined ? a : b; const o = Object.assign({}, a); for (const k in b) o[k] = isObj(a && a[k]) && isObj(b[k]) ? merge(a[k], b[k]) : b[k]; return o; };
  const mul = (o, m) => { if (!m) return o; const r = Object.assign({}, o); for (const k in m) if (typeof r[k] === 'number') r[k] *= m[k]; return r; };
  const DEF = { cast: 0.2, end: 0.2, cd: 5, ch: 20, sign: 'tora', sfx: 'tech', anim: [], hit: { shape: 'proj', n: 1, sp: 640, r: 16, life: 0.8, dmg: 12 }, vfx: {} };
  const T9 = (window.TECH9 = { db: {}, src: {}, cache: {}, cv: null, off: false, count: 0,
    def(e) { if (!e || !e.id) return; this.src[e.id] = JSON.parse(JSON.stringify(e)); const E = merge(DEF, e); this.db[e.id] = E; this.cache = {};
      const S = (SK[e.id] = Object.assign(SK[e.id] || {}, { n: E.n || e.id, el: E.el || 'none', k: E.glyph || '術', cd: E.cd, ch: E.ch, sign: E.sign, t9: 1, v07: 1 }));
      if (window.VAR8 && E.variants) { const vs = VAR8.varsOf(e.id); for (const c in E.variants) { if (!VAR8.CTX[c]) continue; if (!vs.find((v) => v.c === c)) { if (vs.length >= 6) vs.splice(vs.findIndex((v) => !E.variants[v.c]), 1); vs.push({ c, rank: 2 }); } VAR8.SIG[e.id + ':' + c] = (u) => { T9.run(u, e.id, c); return true; }; } }
      this.count = Object.keys(this.db).length; return S; },
    get(id, v) { const key = id + ':' + (v || ''); if (this.cache[key]) return this.cache[key]; const E = this.db[id]; let M = E; const V = v && E.variants && E.variants[v]; if (V) { M = merge(E, V); if (V.mul) M.hit = mul(M.hit, V.mul); } return (this.cache[key] = M); },
    exportJSON(id) { return JSON.stringify(id ? this.src[id] : Object.values(this.src), null, 2); },
    // ---------- exécution ----------
    run(u, id, v) { const M0 = this.get(id, v); if (!M0) return; const M = Object.assign({}, M0, { cast: Math.max(0.03, M0.cast - (u.act && u.act.k === 'cast' ? 0 : 0) - 0.2) }); const P = pw(u), a = isFinite(u.aimA) ? u.aimA : aimAt(u); const hand = () => u.hand || { x: u.x + u.face * 20, y: u.y - 40 }; const ctx = { u, M, P, a, id };
      const T = M.cast + M.end; u.act = { k: 'cast', S: SK[id], id: 'none', t: 0, dur: Math.max(0.2, T) }; u.face = Math.cos(a) < 0 ? -1 : 1;
      // anticipation : couches de charge répétées pendant l’incantation
      const V = M.vfx || {}; if (V.charge) { const n = Math.max(1, Math.round(M.cast / 0.09)); for (let i = 0; i < n; i++) Game.later(i * 0.09, () => { const h = hand(); VFX9.play(V.charge, h.x, h.y, { a, s: 0.6 + 0.6 * i / n }); }); }
      // images clés d’animation
      for (const K of M.anim || []) Game.later(K.t || 0, () => { if (K.sq != null) u.sq = K.sq; if (K.lunge) { u.x += Math.cos(a) * K.lunge; u.y += Math.sin(a) * K.lunge * 0.6; World.collide && World.collide(u); } if (K.iframe) u.iframe = Math.max(u.iframe || 0, K.iframe); if (K.shake) Cam.shake(K.shake); if (K.vfx) { const h = hand(); VFX9.play(K.vfx, h.x, h.y, { a }); } });
      Game.later(M.cast, () => { if (u.hp <= 0) return; const h = hand(); if (V.muzzle) VFX9.play(V.muzzle, h.x + Math.cos(a) * 20, h.y, { a }); if (M.sfx) try { Sfx.play(M.sfx); } catch (e) {} if (M.cam) VFX9.play([Object.assign({ fx: 'cam' }, M.cam)], u.x, u.y);
        (HIT[M.hit.shape] || HIT.proj)(ctx, h); if (V.after) Game.later(0.08, () => VFX9.play(V.after, u.x, u.y, { a: a + Math.PI })); }); },
  });
  const dmgF = (ctx, f, d, o = {}) => { const H = ctx.M.hit; const r = hurt(f, (d ?? H.dmg) * ctx.P, ctx.u, { el: ctx.M.el, k: H.kb ?? 1, big: o.big || H.big }); if (H.stun) f.st.stun = Math.max(f.st.stun || 0, f.boss ? H.stun * 0.4 : H.stun); if (H.slow) f.st.slow = H.slow; if (H.push && !f.boss) { const b = Math.atan2(f.y - ctx.u.y, f.x - ctx.u.x); f.vx += Math.cos(b) * H.push; f.vy += Math.sin(b) * H.push * 0.7; } if (H.pull && !f.boss) { f.x = lerp(f.x, o.px ?? ctx.u.x, H.pull); f.y = lerp(f.y, o.py ?? ctx.u.y, H.pull); } return r; };
  // ---------- corps des projectiles (sprites) ----------
  const BODY = {
    orb(g, p, c, r) { g.globalCompositeOperation = 'lighter'; g.drawImage(SPR9.get('glow', c), p.x - r * 2, p.y - r * 2, r * 4, r * 4); g.drawImage(SPR9.get('core', c), p.x - r, p.y - r, r * 2, r * 2); },
    flame(g, p, c, r) { V.flame(g, p.x, p.y, (p.grow ? r * 0.6 + (p.life0 - p.life) * p.grow : r), Game.t + p.x * 0.01); },
    drop(g, p, c, r) { g.translate(p.x, p.y); g.rotate(Math.atan2(p.vy, p.vx) - Math.PI / 2); g.globalCompositeOperation = 'lighter'; g.drawImage(SPR9.get('glow', c), -r * 1.8, -r * 1.8, r * 3.6, r * 3.6); g.globalCompositeOperation = 'source-over'; g.drawImage(SPR9.get('drop', c), -r, -r * 1.5, r * 2, r * 2.6); },
    blade(g, p, c, r) { g.translate(p.x, p.y); g.rotate(p.spin ? (p.ang = (p.ang || 0) + 0.4) : Math.atan2(p.vy, p.vx)); g.globalCompositeOperation = 'lighter'; g.drawImage(SPR9.get('glow', c), -r * 1.6, -r * 1.6, r * 3.2, r * 3.2); g.drawImage(SPR9.get('cres', c), -r, -r, r * 2, r * 2); if (p.spin) { g.rotate(Math.PI); g.drawImage(SPR9.get('cres', c), -r, -r, r * 2, r * 2); } },
    bolt(g, p, c, r) { g.globalCompositeOperation = 'lighter'; g.drawImage(SPR9.get('glow', c), p.x - r * 2.2, p.y - r * 2.2, r * 4.4, r * 4.4); g.strokeStyle = '#ffffff'; g.lineWidth = 2; for (let k = 0; k < 4; k++) { const b = R() * TAU2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + Math.cos(b) * r * 0.9, p.y + Math.sin(b) * r * 0.9); g.lineTo(p.x + Math.cos(b + 0.5) * r * 1.6, p.y + Math.sin(b + 0.5) * r * 1.6); g.stroke(); } g.drawImage(SPR9.get('core', c), p.x - r * 0.8, p.y - r * 0.8, r * 1.6, r * 1.6); },
    rock(g, p, c, r) { g.translate(p.x, p.y); g.rotate(Game.t * 6 + p.x * 0.01); g.drawImage(SPR9.get('shard', c), -r * 1.2, -r * 1.2, r * 2.4, r * 2.4); },
    beast(g, p, c, r) { // tête d’animal élémentaire (dragon, loup, oiseau) + corps en segments
      const T = p.trail || []; g.globalCompositeOperation = 'lighter'; for (let k = T.length - 1; k >= 0; k -= 2) { const s = r * (1 - k / (T.length + 2)); g.globalAlpha = 0.8; g.drawImage(SPR9.get('core', c), T[k][0] - s, T[k][1] - s + Math.sin(Game.t * 12 + k) * 4, s * 2, s * 2); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.translate(p.x, p.y); g.rotate(Math.atan2(p.vy, p.vx)); g.fillStyle = c; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(r * 1.7, 0); g.lineTo(r * 0.3, -r); g.lineTo(-r * 0.5, -r * 1.4); g.lineTo(-r * 0.4, -r * 0.4); g.lineTo(-r * 0.6, r * 0.6); g.lineTo(r * 0.3, r); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(r * 0.5, -r * 0.35, r * 0.18, 0, TAU2); g.fill(); },
  };
  const spawn = (ctx, x, y, b, H, i) => { const c = ctx.M.c || elc(ctx.M.el); const sp = H.sp; const p = { x, y, vx: Math.cos(b) * sp, vy: Math.sin(b) * sp, life: H.life, life0: H.life, dmg: H.dmg * ctx.P, el: ctx.M.el, r: H.r, src: ctx.u, team: 0, hit: new Set(), kind: 't9', pierce: H.pierce, home: H.home, boom: H.boom ? H.boom : 0, grow: H.grow,
      spin: H.spin, trail: H.body === 'beast' ? [] : null, vfxTravel: ctx.M.vfx.travel, vfxImpact: ctx.M.vfx.impact, draw: (g, p) => (BODY[H.body] || BODY.orb)(g, p, c, p.r) };
    if (H.grav || H.wave || H.ret || H.stun || H.slow || H.push) p.upd = (p, dt) => { if (H.grav) p.vy += H.grav * dt; if (H.wave) { const t = p.life0 - p.life, n = Math.cos(t * 12 + i) * H.wave; p.x += -Math.sin(b) * n * dt; p.y += Math.cos(b) * n * dt; } if (H.ret && !p.back && p.life < p.life0 * 0.5) { p.back = 1; p.hit = new Set(); } if (p.back) { const dx = ctx.u.x - p.x, dy = ctx.u.y - 34 - p.y, d = Math.hypot(dx, dy) || 1; p.vx = dx / d * sp * 1.1; p.vy = dy / d * sp * 1.1; if (d < 30) p.life = 0; } };
    if (H.stun || H.slow || H.push || H.aoe) p.onHit = (p) => { for (const f of p.hit) { if (H.stun) f.st.stun = Math.max(f.st.stun || 0, f.boss ? H.stun * 0.4 : H.stun); if (H.slow) f.st.slow = H.slow; if (H.push && !f.boss) { f.vx += Math.cos(b) * H.push; f.vy += Math.sin(b) * H.push * 0.6; } } if (H.aoe) aoe(p.x, p.y + 34, H.aoe, H.dmg * 0.5 * ctx.P, ctx.u, { el: ctx.M.el, k: 1.2 }); };
    Proj.push(p); return p; };
  // ---------- formes de zone d’effet ----------
  const HIT = {
    proj(ctx, h) { const H = ctx.M.hit, n = H.n || 1; for (let i = 0; i < n; i++) Game.later(i * (H.every || 0), () => { const hh = ctx.u.hand || h; const b = (H.aimEach ? aimAt(ctx.u) : ctx.a) + (n > 1 && !H.every ? (i - (n - 1) / 2) * (H.spread || 0.2) : rr(-1, 1) * (H.jit || 0)); spawn(ctx, hh.x, hh.y, b, H, i); }); },
    circle(ctx, h) { const H = ctx.M.hit, u = ctx.u; let x = u.x, y = u.y; if (H.at === 'aim' || H.at === 'foe') { const f = H.at === 'foe' && near(u.x, u.y, H.range || 400); x = f ? f.x : u.x + Math.cos(ctx.a) * (H.range || 220) * 0.8; y = f ? f.y : u.y + Math.sin(ctx.a) * (H.range || 220) * 0.5; }
      const go = () => { VFX9.play(ctx.M.vfx.impact || [], x, y - 10, { a: ctx.a, s: H.r / 90 }); for (const f of foes()) if (Math.hypot(f.x - x, (f.y - y) * 1.3) < H.r) dmgF(ctx, f, H.dmg, { px: x, py: y }); };
      if (H.delay) { const tel = ctx.M.c || elc(ctx.M.el); FX.custom({ x, y, life: H.delay, ground: 1, draw: (g, p, q) => { g.save(); g.globalAlpha = 0.25 + 0.5 * q; g.strokeStyle = tel; g.lineWidth = 3; g.setLineDash([10, 8]); g.beginPath(); g.ellipse(x, y, H.r * Math.min(1, q * 3), H.r * 0.5 * Math.min(1, q * 3), 0, 0, TAU2); g.stroke(); g.restore(); } }); if (ctx.M.vfx.tele) VFX9.play(ctx.M.vfx.tele, x, y, { a: ctx.a }); Game.later(H.delay, go); } else go();
      for (let k = 1; k < (H.ticks || 1); k++) Game.later((H.delay || 0) + k * (H.every || 0.4), go); },
    cone(ctx, h) { const H = ctx.M.hit, u = ctx.u, a = ctx.a; const n = Math.ceil((H.range || 300) / 60); for (let i = 1; i <= n; i++) Game.later(i * 0.025, () => { const d = i * 60; for (let s = -1; s <= 1; s++) VFX9.play(ctx.M.vfx.travel || [], u.x + Math.cos(a + s * (H.arc || 0.6) * 0.6) * d, u.y - 34 + Math.sin(a + s * (H.arc || 0.6) * 0.6) * d * 0.7, { a, s: 0.6 + i / n }); });
      for (const f of foes()) { const d = Math.hypot(f.x - u.x, f.y - u.y), da = Math.abs(((Math.atan2(f.y - u.y, f.x - u.x) - a + Math.PI * 3) % TAU2) - Math.PI); if (d < (H.range || 300) && da < (H.arc || 0.6)) Game.later(d / 2400, () => { dmgF(ctx, f, H.dmg); VFX9.play(ctx.M.vfx.impact || [], f.x, f.y - 34, { a, s: 0.7 }); }); } },
    beam(ctx, h) { const H = ctx.M.hit, a = ctx.a; VFX9.play([{ fx: 'beam', L: H.L || 500, w: H.w || 20, c: ctx.M.c || elc(ctx.M.el), life: H.dur || 0.4 }], h.x, h.y, { a }); const hit = new Set();
      for (let k = 0; k < (H.ticks || 1); k++) Game.later(k * 0.1, () => { for (const f of foes()) { const dx = f.x - h.x, dy = f.y - 30 - h.y, t = dx * Math.cos(a) + dy * Math.sin(a), nn = Math.abs(-dx * Math.sin(a) + dy * Math.cos(a)); if (t > 0 && t < (H.L || 500) && nn < (H.w || 20) + 26 && (H.ticks > 1 || !hit.has(f))) { hit.add(f); dmgF(ctx, f, H.dmg); } } }); },
    dash(ctx, h) { const H = ctx.M.hit, u = ctx.u, a = ctx.a, D = H.D || 240, dur = H.dur || 0.22; u.iframe = Math.max(u.iframe || 0, dur + 0.1); const hit = new Set(); if (ctx.M.vfx.travel) VFX9.play([{ fx: 'trail', w: 30, life: 0.3, always: 1, c: ctx.M.c || elc(ctx.M.el), oy: -34 }], u.x, u.y, { follow: u });
      FX.custom({ x: u.x, y: u.y, life: dur, upd: (p, d) => { u.x += Math.cos(a) * D / dur * d; u.y += Math.sin(a) * D * 0.6 / dur * d; World.collide && World.collide(u); VFX9.play(ctx.M.vfx.travel || [], u.x, u.y - 34, { a }); for (const f of foes()) if (!hit.has(f) && Math.hypot(f.x - u.x, f.y - u.y) < (H.r || 60)) { hit.add(f); dmgF(ctx, f, H.dmg); VFX9.play(ctx.M.vfx.impact || [], f.x, f.y - 34, { a }); } }, draw: () => {} }); },
    rain(ctx, h) { const H = ctx.M.hit, u = ctx.u; for (let i = 0; i < (H.n || 6); i++) Game.later(i * (H.every || 0.1), () => { const f = near(u.x, u.y, H.range || 420); const x = f && R() < 0.7 ? f.x + rr(-30, 30) : u.x + Math.cos(ctx.a) * 200 + rr(-H.area || -160, H.area || 160), y = f && R() < 0.7 ? f.y + rr(-20, 20) : u.y + rr(-100, 100);
        VFX9.play(ctx.M.vfx.tele || [], x, y, { a: ctx.a }); Game.later(H.delay || 0.25, () => { VFX9.play(ctx.M.vfx.impact || [], x, y - 6, { s: (H.r || 60) / 70 }); for (const g2 of foes()) if (Math.hypot(g2.x - x, (g2.y - y) * 1.3) < (H.r || 60)) dmgF(ctx, g2, H.dmg); }); }); },
    wall(ctx, h) { const H = ctx.M.hit, u = ctx.u, a = ctx.a, x = u.x + Math.cos(a) * (H.dist || 80), y = u.y + Math.sin(a) * 50, wa = a + Math.PI / 2, c = ctx.M.c || elc(ctx.M.el), L = H.len || 120; VFX9.play(ctx.M.vfx.impact || [], x, y, { a });
      FX.custom({ x, y, life: H.life || 3.5, ground: 0, upd: (p) => { for (const pr of Proj) if (pr.team === 1 && Math.hypot(pr.x - x, pr.y + 30 - y) < L * 0.7) { pr.life = 0; VFX9.play(ctx.M.vfx.travel || [], pr.x, pr.y, {}); } },
        draw: (g, p, q) => { const e = ease.out(Math.min(1, q * 8)), f = q > 0.9 ? (1 - q) / 0.1 : 1; g.save(); g.globalAlpha = f; g.translate(x, y); const cx = Math.cos(wa) * L / 2, cy = Math.sin(wa) * L / 4, hh = (H.h || 90) * e; g.fillStyle = c; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-cx, -cy); g.lineTo(cx, cy); g.lineTo(cx, cy - hh); g.lineTo(-cx, -cy - hh); g.closePath(); g.fill(); g.stroke(); g.globalAlpha = 0.25 * f; g.fillStyle = '#fff'; g.fillRect(-4, -hh, 8, hh); g.restore(); } });
      for (const f of foes()) if (Math.hypot(f.x - x, f.y - y) < L * 0.6) dmgF(ctx, f, H.dmg); },
    chain(ctx, h) { const H = ctx.M.hit, hit = new Set(); let px = h.x, py = h.y; const c = ctx.M.c || elc(ctx.M.el); for (let i = 0; i < (H.n || 4); i++) { const f = near(px, py, i ? H.jump || 260 : H.range || 420, hit); if (!f) break; hit.add(f); const x0 = px, y0 = py; px = f.x; py = f.y - 36; const x1 = px, y1 = py;
        Game.later(i * 0.08, () => { FX.add({ k: 'arc9', x: x0, y: y0, x2: x1, y2: y1, c, w: 6, br: 1, life: 0.3 }); VFX9.play(ctx.M.vfx.impact || [], x1, y1, { s: 0.8 }); dmgF(ctx, f, H.dmg * Math.pow(H.falloff || 0.85, i)); }); } },
  };
  T9.HIT = HIT; T9.BODY = BODY;
  // ---------- techniques « moyennes » réécrites en données (VFX en couches, anticipation, suite) ----------
  const D = [
    { id: 'housenka', n: 'Katon : Hōsenka', el: 'fire', glyph: '鳳', cd: 4.5, ch: 22, sign: 'tora', cast: 0.22, end: 0.2, anim: [{ t: 0, sq: 0.18 }, { t: 0.22, sq: -0.2, lunge: -8 }],
      hit: { shape: 'proj', n: 5, every: 0.07, jit: 0.45, sp: 520, r: 14, life: 1.1, dmg: 11, boom: 46, home: 1, body: 'flame', wave: 120 },
      vfx: { charge: 'fire.charge', muzzle: ['fire.muzzle', { fx: 'licks', n: 3, w: 10 }], travel: 'fire.travel', impact: 'fire.impact', after: [{ fx: 'smoke', n: 2 }] },
      variants: { hold: { hit: { n: 9, dmg: 9 }, cast: 0.4 }, air: { hit: { grav: 500, sp: 420, boom: 70 } } } },
    { id: 'karyu', n: 'Katon : Karyū Endan', el: 'fire', glyph: '炎', cd: 6, ch: 28, sign: 'tora', cast: 0.3, end: 0.55, anim: [{ t: 0, sq: 0.25 }, { t: 0.3, sq: -0.25 }, { t: 0.5, shake: 0.12 }],
      hit: { shape: 'proj', n: 14, every: 0.05, jit: 0.16, aimEach: 1, sp: 640, r: 20, life: 0.45, dmg: 4.2, pierce: 1, body: 'flame', grow: 70 },
      vfx: { charge: ['fire.charge', { fx: 'licks', n: 2, w: 6, size: [6, 10] }], muzzle: ['fire.muzzle', { fx: 'dist', r: 60, c: '#ff7a22' }], travel: [{ fx: 'licks', n: 1, w: 12 }, { fx: 'burst', n: 1, c: ['#ffb13d', '#ff4a1a'], spr: 'ember', sp: [30, 110], g: -200, size: [2, 4] }], impact: 'fire.impact' },
      variants: { hold: { hit: { body: 'beast', n: 1, every: 0, r: 30, sp: 560, life: 1.2, dmg: 36, home: 1, aoe: 110 }, c: '#ff7a22' } } },
    { id: 'kamaitachi', n: 'Fūton : Kamaitachi', el: 'wind', glyph: '鎌', cd: 5, ch: 24, sign: 'tori', cast: 0.18, end: 0.22, anim: [{ t: 0.0, sq: 0.15 }, { t: 0.18, lunge: 14, sq: -0.2 }],
      hit: { shape: 'proj', n: 1, sp: 760, r: 30, life: 1.2, dmg: 15, pierce: 1, ret: 1, spin: 1, body: 'blade' },
      vfx: { charge: 'wind.charge', muzzle: ['wind.muzzle', { fx: 'crescents', n: 3, dir: 0, spread: 0.3 }], travel: [{ fx: 'crescents', n: 1, sp: [20, 60], size: [8, 12], life: [0.12, 0.2] }, { fx: 'burst', n: 0.6, c: ['#6fbf5a', '#9fd36b'], spr: 'leaf', sp: [60, 160], size: [3, 5], add: 0, rot: 1, spin: 8, life: [0.4, 0.7] }], impact: 'wind.impact' },
      variants: { combo: { hit: { n: 3, spread: 0.35, dmg: 9 } }, dash: { hit: { shape: 'dash', D: 260, dmg: 18, r: 70 } } } },
    { id: 'shinkugyoku', n: 'Fūton : Shinkūgyoku', el: 'wind', glyph: '玉', cd: 4, ch: 22, sign: 'ne', cast: 0.16, end: 0.3, anim: [{ t: 0, sq: 0.3 }, { t: 0.16, sq: -0.3, lunge: -6 }],
      hit: { shape: 'proj', n: 5, every: 0.09, aimEach: 1, jit: 0.05, sp: 1050, r: 12, life: 0.5, dmg: 9, body: 'orb', push: 260 }, c: '#bfffe0',
      vfx: { charge: 'wind.charge', muzzle: [{ fx: 'ring', r: 30, c: '#d8fff2', life: 0.15 }, { fx: 'dist', r: 40, c: '#bfffe0' }], travel: [{ fx: 'burst', n: 1, c: ['#d8fff2'], spr: 'glow', sp: [10, 30], size: [6, 9], life: [0.12, 0.2] }], impact: 'wind.impact' } },
    { id: 'teppodama', n: 'Suiton : Teppōdama', el: 'water', glyph: '砲', cd: 4.5, ch: 24, sign: 'ushi', cast: 0.28, end: 0.2, anim: [{ t: 0, sq: 0.3 }, { t: 0.28, sq: -0.35, lunge: -10, shake: 0.06 }],
      hit: { shape: 'proj', n: 1, sp: 600, r: 26, life: 0.8, dmg: 32, body: 'drop', aoe: 100, push: 300 },
      vfx: { charge: ['water.charge', { fx: 'burst', conv: 1, n: 8, c: ['#8fd3ff'], spr: 'drop', sp: [60, 120], size: [3, 5], add: 0 }], muzzle: ['water.muzzle', { fx: 'splash', n: 6 }], travel: 'water.travel', impact: ['water.impact', { fx: 'splash', n: 10, s: 1.4 }, { fx: 'cam', shake: 0.12 }] },
      variants: { hold: { hit: { n: 3, spread: 0.25, dmg: 20, r: 20 } }, terrain: { hit: { r: 40, dmg: 40, aoe: 160 } } } },
    { id: 'raikyu', n: 'Raiton : Raikyū', el: 'bolt', glyph: '球', cd: 5, ch: 24, sign: 'tora', cast: 0.2, end: 0.2, anim: [{ t: 0, sq: 0.2 }, { t: 0.2, sq: -0.2 }],
      hit: { shape: 'chain', n: 4, range: 420, jump: 260, dmg: 22, falloff: 0.86, stun: 0.4 },
      vfx: { charge: ['bolt.charge', { fx: 'arcs', n: 2, r: [20, 40] }], muzzle: ['bolt.muzzle', { fx: 'star', c: '#e6d8ff', size: 26 }], impact: 'bolt.impact' },
      variants: { low: { hit: { n: 7, dmg: 18 } }, parry: { hit: { stun: 1.2 } } } },
    { id: 'raiju', n: 'Raiton : Raijū Tsuiga', el: 'bolt', glyph: '獣', cd: 6, ch: 28, sign: 'tatsu', cast: 0.25, end: 0.2, anim: [{ t: 0, sq: 0.2 }, { t: 0.25, lunge: 10 }],
      hit: { shape: 'proj', n: 1, sp: 820, r: 22, life: 1.1, dmg: 30, home: 1, body: 'beast', stun: 0.5 }, c: '#b98cff',
      vfx: { charge: 'bolt.charge', muzzle: 'bolt.muzzle', travel: [{ fx: 'arcs', n: 1, r: [20, 50], w: 3 }, { fx: 'burst', n: 1, c: ['#e6d8ff'], spr: 'ember', sp: [60, 200], size: [1.5, 3], life: [0.1, 0.2], stretch: 1 }], impact: ['bolt.impact', { fx: 'bolt', h: 260 }] },
      variants: { clone: { hit: { n: 2, spread: 0.5, dmg: 22 } } } },
    { id: 'doryudan', n: 'Doton : Doryūdan', el: 'earth', glyph: '龍', cd: 6, ch: 28, sign: 'mi', cast: 0.35, end: 0.35, anim: [{ t: 0, sq: 0.35, vfx: [{ fx: 'chunks', n: 6, oy: 40 }, { fx: 'cam', shake: 0.12 }] }, { t: 0.35, sq: -0.2 }],
      hit: { shape: 'proj', n: 3, every: 0.18, aimEach: 1, jit: 0.15, sp: 560, r: 16, life: 0.9, dmg: 13, body: 'rock', aoe: 60 }, c: '#8a6a44',
      vfx: { charge: 'earth.charge', muzzle: ['earth.muzzle', { fx: 'dustc', n: 4 }], travel: 'earth.travel', impact: 'earth.impact' },
      variants: { terrain: { hit: { n: 5, dmg: 12 } }, hold: { hit: { n: 1, every: 0, r: 34, dmg: 40, aoe: 140, body: 'rock' } } } },
    { id: 'haisekisho', n: 'Katon : Haisekishō', el: 'fire', glyph: '灰', cd: 7, ch: 26, sign: 'mi', cast: 0.3, end: 0.3, anim: [{ t: 0, sq: 0.25 }, { t: 0.3, sq: -0.2 }],
      hit: { shape: 'circle', at: 'foe', range: 380, r: 130, dmg: 40, delay: 1.0, big: 1, slow: 1.2 },
      vfx: { charge: 'fire.charge', muzzle: [{ fx: 'dustc', n: 8, c: '#5a5560', size: [20, 34] }], tele: [{ fx: 'dustc', n: 14, c: '#5a5560', size: [24, 40], life: [0.9, 1.2] }, { fx: 'burst', n: 10, c: ['#ff7a22'], spr: 'ember', sp: [20, 80], size: [2, 3], life: [0.6, 1] }],
        impact: ['fire.impact', { fx: 'licks', n: 12, w: 90 }, { fx: 'shock', c: '#ff7a22', r: 160 }, { fx: 'screen', k: 'flash', a: 0.3 }, { fx: 'cam', shake: 0.3, hitstop: 0.05 }, { fx: 'decal', dk: 'scorch', r: 110, oy: 10 }] } },
    { id: 'daitoppa', n: 'Fūton : Daitoppa', el: 'wind', glyph: '突', cd: 4, ch: 20, sign: 'tori', cast: 0.22, end: 0.25, anim: [{ t: 0, sq: 0.3 }, { t: 0.22, sq: -0.35, lunge: -14 }],
      hit: { shape: 'cone', range: 320, arc: 0.7, dmg: 18, kb: 3, push: 700 },
      vfx: { charge: 'wind.charge', muzzle: [{ fx: 'dist', r: 120, c: '#d8fff2' }, { fx: 'crescents', n: 6, dir: 0, spread: 0.6, sp: [500, 900] }, { fx: 'cam', shake: 0.15 }], travel: [{ fx: 'crescents', n: 1, dir: 0, spread: 0.2, sp: [300, 500], size: [10, 16] }, { fx: 'dustc', n: 1, c: '#c9d3e6' }], impact: 'wind.impact' } },
    { id: 'nagashi', n: 'Raiton : Nagashi', el: 'bolt', glyph: '流', cd: 7, ch: 22, sign: 'ushi', cast: 0.15, end: 0.3, anim: [{ t: 0, sq: 0.3, iframe: 0.35 }, { t: 0.15, sq: -0.3 }],
      hit: { shape: 'circle', at: 'self', r: 160, dmg: 16, stun: 1, kb: 1.2 },
      vfx: { charge: ['bolt.charge', { fx: 'arcs', n: 3, r: [30, 60] }], impact: [{ fx: 'arcs', n: 12, r: [90, 170] }, { fx: 'glow', r: 140, c: '#b98cff', life: 0.3 }, { fx: 'ring', r: 170, c: '#e6d8ff' }, { fx: 'decal', dk: 'burn', r: 120, oy: 20 }, { fx: 'cam', shake: 0.15 }] } },
  ];
  for (const e of D) T9.def(e);
  T9.BUILTIN = D.map((e) => e.id);
  // techniques créées dans l’éditeur (sauvegarde locale)
  try { const L = JSON.parse(localStorage.getItem('tbv9_tech') || '[]'); for (const e of L) T9.def(e); } catch (e) {}
  // ---------- modes : les compétences de palier (données MODE08.F) reçoivent les couches VFX ----------
  if (window.MODE08 && MODE08.KIND) { const K = MODE08.KIND; for (const k of Object.keys(K)) { const f = K[k]; K[k] = function (u, o, P, a, h) { const e = PRE(o.el); const hh = h || u.hand || { x: u.x, y: u.y - 40 }; VFX9.play(o.vfx && o.vfx.muzzle || VFX9.PRESET[e].muzzle, hh.x, hh.y, { a: a || 0, s: 1.2 }); if (k === 'burst' || k === 'heal') VFX9.play(VFX9.PRESET[e].big, u.x, u.y, { s: (o.r || 140) / 160 }); return f.apply(this, arguments); }; } }
  function PRE(e) { return VFX9.PRESET[e] ? e : 'none'; }
  MODE08 && (MODE08.defFamily = (id, fam) => { MODE08.F[id] = fam; });
})();
