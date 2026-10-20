// v0.3 : VFX de mudras, VFX de dash, cinématiques d'ultime façon Storm.
const SIGN_K = { tora: '寅', ushi: '丑', ne: '子', tori: '酉', mi: '巳', tatsu: '辰', inu: '戌', i: '亥', uma: '午', hitsuji: '未', saru: '申', u: '卯' };
const SIGN_SEQ = ['mi', 'hitsuji', 'saru', 'i', 'uma', 'tora'];
V.signFx = (u, el, n = 3, dur = 0.45) => { const c = elc(el || 'wind'); const seq = []; for (let i = 0; i < n - 1; i++) seq.push(SIGN_SEQ[(i * 2 + (u.x | 0)) % SIGN_SEQ.length]); seq.push((u.sign && u.sign.k) || 'tora');
  // tourbillon de chakra autour des mains
  FX.custom({ x: u.x, y: u.y, life: dur + 0.1, draw: (g, p, q) => { const hx = u.x + u.face * 10, hy = u.y - 52 * (u.size || 1); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (let k = 0; k < 3; k++) { g.strokeStyle = c; g.globalAlpha = (1 - q) * (0.75 - k * 0.2); g.lineWidth = 4 - k; const r = 22 + k * 9 - q * 8, a0 = Game.t * (9 + k * 3) + k * 2; g.beginPath(); g.ellipse(hx, hy, r, r * 0.55, 0, a0, a0 + 4.2); g.stroke(); }
    g.restore(); } });
  seq.forEach((s, i) => Game.later(i * dur / n, () => { if (u.hp <= 0) return; const last = i === n - 1; const ox = (i - (n - 1) / 2) * 34;
    FX.custom({ x: u.x, y: u.y, life: last ? 0.7 : 0.45, draw: (g, p, q) => { const x = u.x + ox, y = u.y - 112 * (u.size || 1) - q * 18; g.save(); g.globalAlpha = 1 - q * q; g.globalCompositeOperation = 'lighter'; g.fillStyle = c; g.beginPath(); g.arc(x, y, 17 + q * 6, 0, TAU); g.globalAlpha *= 0.35; g.fill(); g.globalAlpha = 1 - q * q;
      g.globalCompositeOperation = 'source-over'; g.font = "400 22px 'Lilita One', serif"; g.textAlign = 'center'; g.lineWidth = 4; g.strokeStyle = INK; g.strokeText(SIGN_K[s] || '印', x, y + 8); g.fillStyle = '#fff'; g.fillText(SIGN_K[s] || '印', x, y + 8); g.restore(); } });
    for (let k = 0; k < 6; k++) FX.add({ k: 'spark', x: u.x + u.face * 10, y: u.y - 52, vx: rnd(-160, 160), vy: rnd(-220, -40), c, life: rnd(0.2, 0.4), s: rnd(2, 3.5) });
    Sfx.tone && Sfx.tone(520 + i * 120, 760 + i * 120, 0.07, 'triangle', 0.05);
    if (last) { FX.shock(u.x, u.y - 50, c, 70, 0.35, 6); FX.glow(u.x, u.y - 50, c, 60, 0.3); FX.shock(u.x, u.y, c, 50, 0.4, 4); u.sq = 0.2; } })); };
V.dashFx = (u, el) => { const c = elc(el || 'wind'), a = u.act && u.act.a || 0, x0 = u.x, y0 = u.y;
  FX.shock(x0, y0, c, 46, 0.25, 5); FX.dust(x0, y0, 10); for (let k = 0; k < 8; k++) FX.add({ k: 'spark', x: x0, y: y0 - 30, vx: -Math.cos(a) * rnd(100, 300) + rnd(-60, 60), vy: -Math.sin(a) * rnd(60, 200) - rnd(20, 90), c, life: rnd(0.2, 0.35), s: 2.5 });
  // traînée teintée + lignes de vitesse
  const tr = []; FX.custom({ x: x0, y: y0, life: 0.5, upd: () => { if (tr.length < 40) tr.push([u.x, u.y - 34]); }, draw: (g, p, q) => { if (tr.length < 2) return; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [w, al] of [[26, 0.18], [12, 0.45], [4, 0.9]]) { g.strokeStyle = c; g.globalAlpha = al * (1 - q); g.lineWidth = w * (1 - q * 0.6); g.beginPath(); g.moveTo(tr[0][0], tr[0][1]); for (const t of tr) g.lineTo(t[0], t[1]); g.stroke(); }
    g.globalCompositeOperation = 'source-over'; g.strokeStyle = INK; g.globalAlpha = 0.6 * (1 - q); g.lineWidth = 2; for (let k = 0; k < 6; k++) { const t = tr[(k * 5) % tr.length], o = (k - 2.5) * 9; g.beginPath(); g.moveTo(t[0] - Math.cos(a) * 30 - Math.sin(a) * o, t[1] - Math.sin(a) * 30 + Math.cos(a) * o); g.lineTo(t[0] - Math.cos(a) * 90 - Math.sin(a) * o, t[1] - Math.sin(a) * 90 + Math.cos(a) * o); g.stroke(); } g.restore(); } });
  for (let i = 1; i <= 4; i++) Game.later(i * 0.045, () => FX.ghost(u, c));
  Game.later(0.24, () => { FX.dust(u.x, u.y, 8); FX.shock(u.x, u.y, c, 36, 0.22, 4); V.ink(u.x, u.y - 20, a + Math.PI, c); }); };
// coup de pinceau (encre)
V.ink = (x, y, a, c = INK, len = 90) => FX.custom({ x, y, life: 0.45, draw: (g, p, q) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = INK; g.globalAlpha = 0.85 * (1 - q); g.beginPath(); const L = len * Math.min(1, q * 5); g.moveTo(0, -3); g.quadraticCurveTo(L * 0.5, -10, L, 0); g.quadraticCurveTo(L * 0.5, 6, 0, 3); g.fill(); g.fillStyle = c; g.globalAlpha = 0.6 * (1 - q); g.fillRect(L * 0.2, -1, L * 0.6, 2); g.restore(); } });

const ULT_NAME = { uzuhiko: 'Rasengan Uzuhiko', kirin: 'Kirin', goryuka: 'Gōryūka', daibakufu: 'Daibakufu', taigyoku: 'Taigyoku Rasengan', doryu: 'Doryūheki', susanoo: 'Susanoo', daikokuten: 'Daikokuten', bijuudama: 'Bijūdama' };
const Cine = { on: null,
  play(u, id, el, done, o = {}) { const c = elc(el || 'wind'); this.on = { u, id, c, t: 0, dur: o.dur || 3.2, done, tgt: o.tgt, name: o.name || ULT_NAME[id] || (SK[id] && SK[id].n) || 'Ultime', z0: Cam.tz, signs: 0, enemy: o.enemy };
    Game.cine = true; Sfx.play('charge'); },
  skip() { if (this.on) this.on.t = Math.max(this.on.t, this.on.dur - 0.05); },
  update(dt) { const C = this.on; if (!C) return; C.t += dt; const u = C.u, T = C.t;
    if (T > 0.35 && (Input.pressed('atk') || Input.pressed('use') || Input.hit.has('Escape') || Input.hit.has('Space'))) this.skip();
    const tg = C.tgt || u; let fx = u.x, fy = u.y - 40, z = 1.6;
    if (T < 0.5) z = lerp(C.z0, 1.7, T / 0.5); else if (T < 1.3) z = 1.9; else if (T < 2.1) { z = 2.1; fx += u.face * -30; } else if (T < 2.8) { const k = (T - 2.1) / 0.7; fx = lerp(u.x, tg.x, k * k); fy = lerp(u.y, tg.y, k * k) - 40; z = lerp(2.0, 1.25, k); }
    Cam.tz = z; Cam.z = lerp(Cam.z, z, 1 - Math.pow(0.0005, dt)); Cam.x = lerp(Cam.x, fx, 1 - Math.pow(0.0005, dt)); Cam.y = lerp(Cam.y, fy, 1 - Math.pow(0.0005, dt));
    if (T > 1.3 && C.signs < 1) { C.signs = 1; V.signFx(u, null, 4, 0.7); }
    if (T > 1.4 && T < 2.1 && Math.random() < 0.7) FX.mote(u.x + rnd(-160, 160), u.y - 40 + rnd(-140, 100), u.x, u.y - 50, C.c, 0.5);
    if (T > 2.05 && !C.charged) { C.charged = 1; FX.shock(u.x, u.y - 40, C.c, 160, 0.4, 8); Sfx.play('boom'); Cam.shake(0.4); }
    u.anim += dt * 3;
    if (T >= C.dur) { this.on = null; Game.cine = Talk.on; Cam.tz = C.z0 || 1; Game.slowT = 0.9; C.done && C.done(); } },
  draw(g, vw, vh) { const C = this.on; if (!C) return; const T = C.t, u = C.u; const bar = Math.min(1, T / 0.3) * vh * 0.11; g.fillStyle = '#05070f'; g.fillRect(0, 0, vw, bar); g.fillRect(0, vh - bar, vw, bar);
    // cut-in
    if (T > 0.5 && T < 1.45) { const k = Math.min(1, (T - 0.5) / 0.15), out = T > 1.3 ? (T - 1.3) / 0.15 : 0, sx = (1 - k) * vw * (C.enemy ? -1 : 1) - out * vw * (C.enemy ? 1 : -1);
      g.save(); g.translate(sx, 0); g.beginPath(); g.moveTo(0, vh * 0.28); g.lineTo(vw, vh * 0.16); g.lineTo(vw, vh * 0.7); g.lineTo(0, vh * 0.82); g.closePath(); g.fillStyle = C.c; g.fill(); g.save(); g.clip();
      g.fillStyle = 'rgba(5,7,15,.55)'; g.fillRect(0, 0, vw, vh); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; for (let i = 0; i < 26; i++) { const y = ((i * 97 + T * 2600) % (vh * 0.7)) + vh * 0.14; const x = (i * 211) % vw; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 180 + (i % 3) * 80, y - 30); g.stroke(); }
      const s = vh / 260; g.translate(vw * 0.3, vh * 0.92); g.scale(s, s); const P = u.P; drawRig(g, Object.assign({}, u, { x: 0, y: 0, face: C.enemy ? -1 : 1, P, sq: 0, flash: 0, hurtT: 0 })); g.restore();
      g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.font = `400 ${Math.round(vh * 0.075)}px 'TBV Ext','Lilita One',sans-serif`; g.textAlign = 'right'; g.lineWidth = 10; g.strokeStyle = INK; g.strokeText(C.name, vw * 0.94, vh * 0.62); g.fillStyle = '#fff'; g.fillText(C.name, vw * 0.94, vh * 0.62); g.restore(); }
    // lignes de vitesse pendant la charge et la frappe
    if (T > 1.6) { const k = T > 2.1 ? 1 : (T - 1.6) / 0.5; g.strokeStyle = `rgba(11,16,32,${0.5 * k})`; g.lineWidth = 2.5; const cx = vw / 2, cy = vh / 2; for (let i = 0; i < 40; i++) { const an = (i / 40) * TAU + T * 0.7, r0 = Math.max(vw, vh) * (0.36 + ((i * 37) % 10) / 60); g.beginPath(); g.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); g.lineTo(cx + Math.cos(an) * r0 * 1.8, cy + Math.sin(an) * r0 * 1.8); g.stroke(); } }
    if (T > 0.4) { g.font = "400 14px 'Lilita One',sans-serif"; g.textAlign = 'right'; g.fillStyle = 'rgba(238,243,255,.6)'; g.fillText((Input.lastDev === 'touch' ? 'Toucher' : 'J / E') + ' : passer', vw - 18, vh - 14); } } };

// ultimes de clan (mode Ta voie) + Sarada / Kawaki
const CLAN_ULT = { uchiha: 'susanoo', hyuga: 'hakke64', nara: 'kagekubi', akimichi: 'chodan', yamanaka: 'shinranshin', aburame: 'mushidama', inuzuka: 'garoga', senju: 'jukai' };
Object.assign(SK, { susanoo: { n: 'Susanoo', el: 'yin', k: '須', ult: 1, sign: 'tori' }, daikokuten: { n: 'Daikokuten', el: 'yin', k: '黒', ult: 1, sign: 'mi' }, hakke64: { n: 'Hakke 64 Shō', el: 'yang', k: '卦', ult: 1, sign: 'tora' },
  kagekubi: { n: 'Kage Kubi Shibari', el: 'yin', k: '影', ult: 1, sign: 'ne' }, chodan: { n: 'Chōdan Bakugeki', el: 'yang', k: '弾', ult: 1, sign: 'ushi' }, shinranshin: { n: 'Shinranshin', el: 'yin', k: '心', ult: 1, sign: 'tori' },
  mushidama: { n: 'Mushidama', el: 'yin', k: '蟲', ult: 1, sign: 'mi' }, garoga: { n: 'Garōga', el: 'wind', k: '牙', ult: 1, sign: 'inu' }, jukai: { n: 'Jukai Kōtan', el: 'earth', k: '樹', ult: 1, sign: 'tora' } });
const ULT_FX = {
  susanoo(u, tx, ty, P) { FX.custom({ x: u.x, y: u.y, life: 1.6, draw: (g, p, q) => { const a = Math.min(1, q * 4) * (1 - Math.max(0, q - 0.7) / 0.3); g.save(); g.globalAlpha = 0.55 * a; g.globalCompositeOperation = 'lighter'; g.fillStyle = '#b04aff'; g.beginPath(); g.ellipse(u.x, u.y - 120, 90, 150, 0, 0, TAU); g.fill(); g.globalAlpha = a; g.strokeStyle = '#e0b0ff'; g.lineWidth = 4; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(u.x - 70, u.y - 40 - k * 32); g.quadraticCurveTo(u.x, u.y - 60 - k * 32, u.x + 70, u.y - 40 - k * 32); g.stroke(); } g.restore(); } });
    Game.later(0.5, () => { V.ink(u.x, u.y - 100, Math.atan2(ty - u.y, tx - u.x), '#b04aff', 260); FX.shock(tx, ty, '#b04aff', 220, 0.6, 10); Game.impact(tx, ty, 0.2); aoe(tx, ty, 200, 125 * P, u, { el: 'yin', k: 2, big: 1 }); }); },
  daikokuten(u, tx, ty, P, foe) { for (let i = 0; i < 3; i++) { const x = tx + (i - 1) * 90, y = ty + rnd(-30, 30); FX.custom({ x, y, life: 1, ground: 1, draw: (g, p, q) => { g.fillStyle = `rgba(255,60,60,${0.35 * (1 - q)})`; g.fillRect(x - 45, y - 25, 90, 50); } });
    Game.later(0.9 + i * 0.15, () => { FX.custom({ x, y, life: 0.9, draw: (g, p, q) => { const yy = y - 60 - Math.max(0, 1 - q * 6) * 400; g.fillStyle = '#16141f'; g.strokeStyle = '#6a5aa0'; g.lineWidth = 3; g.fillRect(x - 45, yy - 60, 90, 90); g.strokeRect(x - 45, yy - 60, 90, 90); } }); Game.later(0.15, () => { FX.dust(x, y, 16); FX.shock(x, y, '#6a5aa0', 120, 0.4, 8); Cam.shake(0.5); if (foe) { const h = Game.hero; if (Math.abs(h.x - x) < 60 && Math.abs(h.y - y) < 40) hurt(h, 30, u, { k: 2 }); } else aoe(x, y, 80, 50 * P, u, { el: 'yin', k: 2, big: 1 }); }); }); } },
  hakke64(u, tx, ty, P) { V.trigram(u.x, u.y, 1.4); for (let i = 0; i < 16; i++) Game.later(i * 0.05, () => { FX.add({ k: 'spark', x: u.x + u.face * 40, y: u.y - 50, vx: u.face * rnd(200, 400), vy: rnd(-100, 100), c: '#cfe8ff', life: 0.2, s: 3 }); aoe(u.x + u.face * 60, u.y, 90, 7 * P, u, { el: 'yang', k: 0.3 }); }); Game.later(0.85, () => { Game.impact(u.x, u.y, 0.16); aoe(u.x, u.y, 150, 40 * P, u, { el: 'yang', k: 3, big: 1 }); }); },
  kagekubi(u, tx, ty, P) { for (const f of World.foes()) if (!f.passive && Math.hypot(f.x - u.x, f.y - u.y) < 420) { V.shadow(u, f, 1.6); f.stun = 1.6; Game.later(1.2, () => hurt(f, 70 * P, u, { el: 'yin', big: 1 })); } Game.later(1.2, () => Game.impact(tx, ty, 0.14)); },
  chodan(u, tx, ty, P) { V.bigFist(u, Math.atan2(ty - u.y, tx - u.x), (x, y) => { Game.impact(x, y, 0.2); FX.shock(x, y, '#ffb36b', 260, 0.6, 12); aoe(x, y, 200, 120 * P, u, { el: 'yang', k: 3, big: 1 }); }); },
  shinranshin(u, tx, ty, P) { for (const f of World.foes()) if (!f.passive && Math.hypot(f.x - u.x, f.y - u.y) < 420) { V.mindBeam(u, f); f.stun = 2.5; hurt(f, 60 * P, u, { el: 'yin', big: 1 }); } Game.impact(tx, ty, 0.12); },
  mushidama(u, tx, ty, P) { V.swarm(tx, ty, 2.5); for (let i = 0; i < 8; i++) Game.later(i * 0.25, () => aoe(tx, ty, 140, 14 * P, u, { el: 'yin' })); Game.later(2, () => Game.impact(tx, ty, 0.12)); },
  garoga(u, tx, ty, P) { V.drill(u, 0.9, '#d8c8a0'); const a = Math.atan2(ty - u.y, tx - u.x); u.vx = Math.cos(a) * 900; u.vy = Math.sin(a) * 600; u.iframe = 1; for (let i = 0; i < 6; i++) Game.later(i * 0.1, () => aoe(u.x, u.y, 90, 18 * P, u, { el: 'wind', k: 1.5 })); Game.later(0.65, () => { Game.impact(u.x, u.y, 0.14); aoe(u.x, u.y, 140, 40 * P, u, { el: 'wind', k: 2.5, big: 1 }); }); },
  jukai(u, tx, ty, P) { Game.impact(u.x, u.y, 0.14); for (let k = 0; k < 10; k++) V.spikes(u.x, u.y, k / 10 * TAU, 6, 1, (x, y) => aoe(x, y, 46, 22 * P, u, { el: 'earth', k: 1.2 })); } };
// Ultime d'un allié (cut-in court), ou d'un ennemi
function allyUlt(a, id) { const f = nearestFoe(a, 520); if (!f || Cine.on) return; Cine.play(a, id, SK[id].el, () => ULT_FX[id](a, f.x, f.y, 0.9), { dur: 2.4, tgt: f }); }
