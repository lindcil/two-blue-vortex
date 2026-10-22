// v0.8 — Modes à paliers : chaque mode (dōjutsu, clan, manteau, Kāma) monte en paliers ; chaque palier ajoute ses techniques
// (page 2 de l’arc, touche « page ») et son propre ultime. Paliers : maintenir la touche de mode + jauge de combat.
(() => {
  const foes = () => World.foes().filter((f) => !f.passive && f.hp > 0 && !f.gone);
  const near = (x, y, r, ex) => { let b = null, bd = r; for (const f of foes()) { if (ex && ex.has(f)) continue; const d = Math.hypot(f.x - x, f.y - y); if (d < bd) { bd = d; b = f; } } return b; };
  const lit = (g) => { g.globalCompositeOperation = 'lighter'; };
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const add = (p) => Proj.push(Object.assign({ team: 0, hit: new Set(), r: 16, life: 0.6 }, p));
  // ---------- fabrique de techniques : [nom, glyphe, genre, élément, dégâts, options] ----------
  const KIND = {
    shot(u, o, P, a, h) { const sp = o.sp || 620; add({ x: h.x, y: h.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: o.life || 0.9, dmg: o.d * P, el: o.el, r: o.r || 16, src: u, pierce: o.pierce, boom: o.boom, kind: 'm8', draw: (g, p) => { g.save(); lit(g); const R = (o.r || 16); g.fillStyle = rgba(o.c, 0.35); g.beginPath(); g.arc(p.x, p.y, R * 1.7, 0, TAU); g.fill(); g.fillStyle = rgba(o.c, 0.9); g.beginPath(); g.arc(p.x, p.y, R * 0.8, 0, TAU); g.fill(); if (o.shape === 'mag') { g.strokeStyle = rgba(o.c, 0.9); g.lineWidth = 4; g.beginPath(); g.arc(p.x - Math.cos(a) * R, p.y - Math.sin(a) * R, R * 0.7, a - 1.6, a + 1.6); g.stroke(); } if (o.shape === 'arrow') { g.strokeStyle = rgba(o.c, 0.95); g.lineWidth = 5; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - Math.cos(a) * 90, p.y - Math.sin(a) * 90); g.stroke(); } g.restore(); }, onHit: o.stun ? (f) => { f.st && (f.st.stun = o.stun); } : undefined }); FX.glow(h.x, h.y, o.c, 30, 0.2); },
    fan(u, o, P, a, h) { const n = CNT(o, 3); for (let i = 0; i < n; i++) Game.later(i * 0.05, () => KIND.shot(u, Object.assign({}, o, { r: o.r || 11 }), P, a + (i - (n - 1) / 2) * (o.spread || 0.22), u.hand || h)); },
    burst(u, o, P) { const R = o.r || 140; FX.ring(u.x, u.y - 20, o.c, 20, R, 0.45); FX.shock(u.x, u.y, o.c, R, 0.45, 8); aoe(u.x, u.y, R, o.d * P, u, { el: o.el, k: 1.3 }); if (o.stun) for (const f of foes()) if (Math.hypot(f.x - u.x, f.y - u.y) < R) f.st.stun = o.stun; if (o.pull) for (const f of foes()) if (Math.hypot(f.x - u.x, f.y - u.y) < R * 1.6) { f.x = lerp(f.x, u.x, 0.4); f.y = lerp(f.y, u.y, 0.4); } Cam.shake(0.15); },
    zone(u, o, P, a) { const f = near(u.x, u.y, 420), x = f ? f.x : u.x + Math.cos(a) * 200, y = f ? f.y : u.y + Math.sin(a) * 120, R = o.r || 110;
      FX.custom({ x, y, life: 0.9, ground: 1, draw: (g, p, q) => { g.save(); lit(g); g.globalAlpha = 0.6 * (1 - q * 0.5); g.strokeStyle = rgba(o.c, 0.9); g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, R * Math.min(1, q * 3), R * 0.42 * Math.min(1, q * 3), 0, 0, TAU); g.stroke(); g.restore(); } });
      Game.later(0.6, () => { for (let i = 0; i < 7; i++) { const b = i / 7 * TAU; FX.custom({ x, y, life: 0.6, draw: (g, p, q) => { g.save(); lit(g); g.fillStyle = rgba(o.c, 0.7 * (1 - q)); const px = x + Math.cos(b) * R * 0.5, py = y + Math.sin(b) * R * 0.2; g.beginPath(); g.moveTo(px - 10, py); g.lineTo(px, py - 90 * Math.min(1, q * 4)); g.lineTo(px + 10, py); g.fill(); g.restore(); } }); } aoe(x, y, R, o.d * P, u, { el: o.el, k: 1.2, big: 1 }); if (o.stun) for (const f2 of foes()) if (Math.hypot(f2.x - x, f2.y - y) < R) f2.st.stun = o.stun; Cam.shake(0.2); }); },
    beam(u, o, P, a, h) { const L = o.L || 420, W = o.w || 26; const hit = new Set();
      FX.custom({ x: h.x, y: h.y, life: 0.5, draw: (g, p, q) => { g.save(); lit(g); g.translate(h.x, h.y); g.rotate(a); const l = L * Math.min(1, q * 5), w = W * (1 - q * 0.6); for (let k = 0; k < 3; k++) { g.fillStyle = rgba(k === 2 ? '#ffffff' : o.c, [0.25, 0.5, 0.35][k]); g.beginPath(); g.ellipse(l / 2, 0, l / 2, w * [1.4, 0.8, 0.3][k], 0, 0, TAU); g.fill(); } if (o.shape === 'arrow') { g.fillStyle = rgba(o.c, 0.9); g.beginPath(); g.moveTo(l + 30, 0); g.lineTo(l - 10, -18); g.lineTo(l - 10, 18); g.fill(); } g.restore(); } });
      for (const f of foes()) { const dx = f.x - h.x, dy = (f.y - 30) - h.y, t = dx * Math.cos(a) + dy * Math.sin(a), n = Math.abs(-dx * Math.sin(a) + dy * Math.cos(a)); if (t > 0 && t < L && n < W + 26) { hurt(f, o.d * P, u, { el: o.el, k: 1.4 }); if (o.stun) f.st.stun = o.stun; } } Cam.shake(0.12); },
    dash(u, o, P, a) { const D = o.D || 220, x0 = u.x, y0 = u.y; u.iframe = Math.max(u.iframe || 0, 0.35); const hit = new Set(); let t = 0;
      FX.custom({ x: x0, y: y0, life: 0.22, upd: (p, d) => { t += d; u.x += Math.cos(a) * D / 0.22 * d; u.y += Math.sin(a) * D * 0.6 / 0.22 * d; for (const f of foes()) if (!hit.has(f) && Math.hypot(f.x - u.x, f.y - u.y) < 60) { hit.add(f); hurt(f, o.d * P, u, { el: o.el, k: 1.5 }); if (o.stun) f.st.stun = o.stun; } FX.ghost && FX.ghost(u, rgba(o.c, 0.5)); }, draw: () => {} }); },
    mark(u, o, P, a) { const R = o.r || 320; let n = 0; for (const f of foes()) { if (Math.hypot(f.x - u.x, f.y - u.y) > R || n >= (CNT(o, 3))) continue; n++; f.st.stun = o.stun || 1.4; hurt(f, o.d * P, u, { el: o.el }); FX.ring(f.x, f.y - 50, o.c, 8, 40, 0.5); FX.custom({ x: f.x, y: f.y, life: o.stun || 1.4, draw: (g, p, q) => { g.save(); lit(g); g.globalAlpha = 0.8 * (1 - q); g.strokeStyle = o.c; g.lineWidth = 2; g.beginPath(); g.arc(f.x, f.y - 80, 9 + Math.sin(Game.t * 8) * 2, 0, TAU); g.stroke(); g.restore(); } }); } FX.glow(u.x, u.y - 55, o.c, 40, 0.3); },
    rain(u, o, P) { const n = CNT(o, 7); for (let i = 0; i < n; i++) Game.later(i * 0.09, () => { const f = foes()[Math.floor(Math.random() * Math.max(1, foes().length))], x = f && Math.random() < 0.75 ? f.x + rnd(-30, 30) : u.x + rnd(-260, 260), y = f && Math.random() < 0.75 ? f.y + rnd(-20, 20) : u.y + rnd(-160, 160);
      FX.custom({ x, y, life: 0.35, draw: (g, p, q) => { g.save(); lit(g); g.strokeStyle = rgba(o.c, 0.9 * (1 - q)); g.lineWidth = 6 * (1 - q) + 2; g.beginPath(); g.moveTo(x - 60 + q * 60, y - 260 + q * 260); g.lineTo(x, y); g.stroke(); g.restore(); } }); Game.later(0.3, () => { FX.ring(x, y, o.c, 6, 50, 0.3); aoe(x, y, o.r || 55, o.d * P, u, { el: o.el, k: 1 }); }); }); },
    heal(u, o) { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * (o.h || 0.15)); u.shieldT = o.sh || 4; FX.ring(u.x, u.y - 30, o.c, 20, 70, 0.5); FX.text(u.x, u.y - 100, '+', o.c, 18); },
  };
  const CNT = (o, d) => o.cnt || (typeof o.n === 'number' ? o.n : 0) || d;
  const S8 = (n, k, kind, el, d, c, o) => { const r = Object.assign({ n, k, kind, el, d, c }, o || {}); if (o && typeof o.n === 'number') { r.cnt = o.n; r.n = n; } return r; }; // v0.10.28 : le nombre de projectiles écrasait le nom
  // ---------- familles ----------
  const PUR = '#a46bff', RED = '#ff3b4a', BLU = '#4a8cff', GOLD = '#ffb13d', ORA = '#ff8a2a';
  const F = {};
  F.sharingan = { n: 'Sharingan', c: RED, key: 'C', st: [
    { n: 'Sharingan · 1 tomoe', sk: [S8('Shuriken guidés', '手', 'fan', 'yin', 9, '#dfe4ff'), S8('Katon : Gōkakyū', '火', 'shot', 'fire', 24, ORA, { r: 24, boom: 60 }), S8('Kawarimi éclair', '替', 'dash', 'yin', 14, RED), S8('Œil de lecture', '眼', 'mark', 'yin', 6, RED, { stun: 1.1 })], ult: ['Gōryūka', 'rain', 'fire', 26, ORA, { n: 8 }] },
    { n: 'Sharingan · 2 tomoe', sk: [S8('Kenjutsu raiton', '剣', 'dash', 'bolt', 22, '#8fd3ff'), S8('Genjutsu : Kasegui', '幻', 'mark', 'yin', 8, PUR, { stun: 1.8 })], ult: ['Chidori Nagashi', 'burst', 'bolt', 50, '#8fd3ff', { r: 220, stun: 1.2 }] },
    { n: 'Sharingan · 3 tomoe', sk: [S8('Chidori Eisō', '槍', 'beam', 'bolt', 30, '#8fd3ff'), S8('Magen : Narakumi', '獄', 'mark', 'yin', 12, PUR, { stun: 2.2, n: 4 })], ult: ['Kirin', 'rain', 'bolt', 40, '#bfe6ff', { n: 10, r: 70 }] },
    { n: 'Mangekyō Sharingan', sk: [S8('Amaterasu', '天', 'zone', 'fire', 34, '#3a1830', { r: 90 }), S8('Tsukuyomi', '月', 'mark', 'yin', 20, RED, { stun: 3, n: 2 })], ult: ['Kamui', 'burst', 'yin', 70, PUR, { r: 260, pull: 1 }] },
    { n: 'Susanoo · cage thoracique', sus: 1, sk: [S8('Garde des côtes', '肋', 'heal', 'yin', 0, PUR, { h: 0.12, sh: 5 }), S8('Poing spectral', '拳', 'burst', 'yin', 34, PUR, { r: 150 })], ult: ['Étreinte de Susanoo', 'burst', 'yin', 80, PUR, { r: 200, stun: 1.5 }] },
    { n: 'Susanoo · squelette', sus: 2, sk: [S8('Griffe squelettique', '爪', 'fan', 'yin', 18, PUR, { n: 5, spread: 0.18 }), S8('Yasaka no Magatama', '勾', 'fan', 'yin', 22, PUR, { n: 3, shape: 'mag', r: 14 })], ult: ['Bras de Susanoo', 'beam', 'yin', 90, PUR, { L: 560, w: 60 }] },
    { n: 'Susanoo · humanoïde', sus: 3, sk: [S8('Flèche de Susanoo', '矢', 'beam', 'yin', 44, PUR, { L: 700, w: 18, shape: 'arrow' }), S8('Miroir de Yata', '鏡', 'heal', 'yin', 0, '#ffd166', { h: 0.2, sh: 7 })], ult: ['Tempête de magatama', 'rain', 'yin', 50, PUR, { n: 12, r: 70 }] },
    { n: 'Susanoo · samouraï', sus: 4, sk: [S8('Épée de Totsuka', '剣', 'dash', 'yin', 50, PUR, { D: 260 }), S8('Lame flamboyante', '焔', 'beam', 'fire', 56, PUR, { L: 520, w: 48 })], ult: ['Sceau de Totsuka', 'burst', 'yin', 130, PUR, { r: 300, stun: 2.5 }] },
    { n: 'Susanoo parfait', sus: 5, giant: 1, page: [S8('Taille parfaite', '斬', 'beam', 'yin', 70, PUR, { L: 620, w: 90 }), S8('Pluie de magatama', '勾', 'rain', 'yin', 40, PUR, { n: 12, r: 80 }), S8('Flèche d’Indra', '矢', 'beam', 'yin', 90, PUR, { L: 900, w: 24, shape: 'arrow' }), S8('Bouclier de Yata', '鏡', 'heal', 'yin', 0, '#ffd166', { h: 0.25, sh: 8 })], ult: ['Flèche de l’Indra', 'beam', 'yin', 220, PUR, { L: 1100, w: 120, shape: 'arrow' }] },
  ] };
  F.byakugan = { n: 'Byakugan', c: '#e8e8f8', key: 'C', st: [
    { n: 'Byakugan', sk: [S8('Jūken', '柔', 'dash', 'yang', 18, '#cfe0ff'), S8('Hakke Kūshō', '空', 'shot', 'wind', 20, '#cfe0ff', { r: 22 }), S8('Vision 360°', '眼', 'mark', 'yang', 5, '#e8e8f8', { stun: 1, n: 5, r: 420 }), S8('Kaiten', '回', 'burst', 'yang', 24, '#cfe0ff', { r: 130 })], ult: ['Hakke 64 Shō', 'burst', 'yang', 70, '#cfe0ff', { r: 180, stun: 1.6 }] },
    { n: 'Byakugan · champ', sk: [S8('Hakke Hasangeki', '破', 'beam', 'yang', 32, '#cfe0ff', { w: 50 }), S8('Jūho Sōshiken', '獅', 'burst', 'yang', 34, '#8fd3ff', { r: 120 })], ult: ['Hakke 128 Shō', 'rain', 'yang', 34, '#cfe0ff', { n: 12 }] },
    { n: 'Tenseigan · éveil', sk: [S8('Gudōdama', '玉', 'fan', 'yin', 22, '#7ad0ff', { n: 4 }), S8('Garde céleste', '護', 'heal', 'yang', 0, '#7ad0ff', { h: 0.15, sh: 5 })], ult: ['Kinrin Tensei Baku', 'burst', 'yang', 90, '#7ad0ff', { r: 260, pull: 1 }] },
    { n: 'Tenseigan · mode chakra', sk: [S8('Rasengan d’or', '螺', 'shot', 'wind', 40, GOLD, { r: 26, boom: 80 }), S8('Orbes chercheuses', '球', 'rain', 'yin', 24, '#7ad0ff', { n: 8 })], ult: ['Tensei Bakugeki', 'rain', 'yang', 50, '#bfe6ff', { n: 14, r: 80 }] },
    { n: 'Tenseigan parfait', sk: [S8('Rayon des orbes', '光', 'beam', 'yang', 60, '#7ad0ff', { L: 700, w: 30 }), S8('Pas lunaire', '月', 'dash', 'yang', 40, '#cfe0ff', { D: 280 })], ult: ['Chute lunaire', 'zone', 'yang', 180, '#cfe0ff', { r: 260 }] },
  ] };
  F.jogan = { n: 'Jōgan', c: '#8fd3ff', key: 'C', st: [
    { n: 'Jōgan', sk: [S8('Vision du Jōgan', '眼', 'mark', 'yang', 6, '#8fd3ff', { stun: 1.2, n: 4 }), S8('Rasengan invisible', '螺', 'shot', 'wind', 26, '#8fd3ff', { r: 20 }), S8('Pas de faille', '歩', 'dash', 'yin', 16, '#8fd3ff'), S8('Coup de faille', '裂', 'burst', 'yin', 24, '#8fd3ff', { r: 130 })], ult: ['Rasengan géant', 'burst', 'wind', 60, '#8fd3ff', { r: 200 }] },
    { n: 'Jōgan · faille', sk: [S8('Portail', '門', 'dash', 'yin', 26, PUR, { D: 300 }), S8('Lames dimensionnelles', '刃', 'fan', 'yin', 20, PUR, { n: 5 })], ult: ['Fissure dimensionnelle', 'beam', 'yin', 90, PUR, { L: 800, w: 50 }] },
    { n: 'Jōgan · chakra lié', sk: [S8('Fil de chakra', '糸', 'beam', 'yang', 34, '#8fd3ff', { w: 16, stun: 1.2 }), S8('Bulle de garde', '護', 'heal', 'yang', 0, '#8fd3ff', { h: 0.15, sh: 5 })], ult: ['Rasengan Uzuhiko', 'burst', 'wind', 100, '#3aa0ff', { r: 260, pull: 1 }] },
    { n: 'Jōgan éveillé', sk: [S8('Vortex bleu', '渦', 'shot', 'wind', 50, '#3aa0ff', { r: 30, boom: 100 }), S8('Pluie de Rasengans', '雨', 'rain', 'wind', 30, '#8fd3ff', { n: 10 })], ult: ['Deux vortex bleus', 'rain', 'wind', 60, '#3aa0ff', { n: 16, r: 90 }] },
  ] };
  F.karma = { n: 'Kāma', c: '#2a2a3a', key: 'Z', st: [
    { n: 'Kāma', sk: [S8('Absorption', '吸', 'heal', 'yin', 0, PUR, { h: 0.12, sh: 3 }), S8('Coup de Kāma', '撃', 'dash', 'yin', 22, '#30304a'), S8('Tige noire', '杭', 'shot', 'yin', 24, '#30304a', { pierce: 1 }), S8('Marque Kāma', '印', 'mark', 'yin', 8, PUR, { stun: 1.4 })], ult: ['Daikokuten : cube', 'zone', 'yin', 80, '#30304a', { r: 140 }] },
    { n: 'Kāma · lignes', sk: [S8('Bâtons noirs', '棒', 'fan', 'yin', 20, '#30304a', { n: 5 }), S8('Sukunahikona', '小', 'shot', 'yin', 36, PUR, { pierce: 1, sp: 900 })], ult: ['Pieu géant', 'rain', 'yin', 40, '#30304a', { n: 10 }] },
    { n: 'Kāma · corne', sk: [S8('Pulsion Ōtsutsuki', '波', 'burst', 'yin', 40, PUR, { r: 170 }), S8('Clignement', '瞬', 'dash', 'yin', 30, PUR, { D: 300 })], ult: ['Cercueil de Daikokuten', 'burst', 'yin', 110, '#30304a', { r: 240, stun: 2 }] },
    { n: 'Mode Ōtsutsuki', sk: [S8('Rayon divin', '神', 'beam', 'yang', 60, '#e8e8f8', { L: 700, w: 30 }), S8('Absorption totale', '喰', 'burst', 'yin', 50, PUR, { r: 220, pull: 1 })], ult: ['Rasengan de Momoshiki', 'burst', 'yin', 170, PUR, { r: 320 }] },
  ] };
  F.manteau = { n: 'Manteau', c: ORA, key: 'Z', st: [
    { n: 'Manteau de chakra', sk: [S8('Griffe de chakra', '爪', 'dash', 'yang', 18, ORA), S8('Rugissement', '吼', 'burst', 'yang', 20, ORA, { r: 140 }), S8('Bras de chakra', '腕', 'beam', 'yang', 24, ORA, { L: 320, w: 30 }), S8('Bond', '跳', 'dash', 'yang', 12, GOLD, { D: 300 })], ult: ['Rasengan de chakra', 'burst', 'wind', 60, ORA, { r: 200 }] },
    { n: 'Manteau · 1 queue', sk: [S8('Bombe de chakra', '弾', 'shot', 'yang', 30, ORA, { r: 22, boom: 70 }), S8('Coup de queue', '尾', 'burst', 'yang', 30, ORA, { r: 170 })], ult: ['Tempête de queue', 'rain', 'yang', 34, ORA, { n: 10 }] },
    { n: 'Manteau · 4 queues', sk: [S8('Mini Bijūdama', '玉', 'shot', 'yin', 46, '#3a1830', { r: 26, boom: 110 }), S8('Frénésie', '狂', 'heal', 'yang', 0, ORA, { h: 0.18, sh: 4 })], ult: ['Bijūdama', 'beam', 'yin', 140, '#5a2a6a', { L: 800, w: 80 }] },
    { n: 'Mode Bijū', sk: [S8('Rugissement bijū', '咆', 'burst', 'yang', 60, ORA, { r: 240, stun: 1 }), S8('Pluie de griffes', '雨', 'rain', 'yang', 36, ORA, { n: 10 })], ult: ['Bijūdama Rasen', 'burst', 'yin', 170, '#5a2a6a', { r: 320 }] },
    { n: 'Bête géante', beast: 1, giant: 1, page: [S8('Coup de patte', '掌', 'burst', 'yang', 60, ORA, { r: 200 }), S8('Queues balayantes', '尾', 'beam', 'yang', 64, ORA, { L: 560, w: 100 }), S8('Salve de Bijūdama', '玉', 'fan', 'yin', 50, '#5a2a6a', { n: 5, r: 26, boom: 110 }), S8('Hurlement', '吼', 'mark', 'yang', 20, ORA, { stun: 2, n: 8, r: 500 })], ult: ['Bijūdama ultime', 'beam', 'yin', 240, '#5a2a6a', { L: 1100, w: 150 }] },
  ] };
  const clanF = (n, c, st) => ({ n, c, key: 'C', st });
  F.nara = clanF('Ombre éveillée', '#9b8cff', [
    { n: 'Ombre éveillée', sk: [S8('Kage Mane', '影', 'mark', 'yin', 6, '#6a5cff', { stun: 2, n: 3 }), S8('Kage Nui', '縫', 'fan', 'yin', 16, '#6a5cff', { n: 4 }), S8('Kage Kubishibari', '縛', 'burst', 'yin', 22, '#6a5cff', { r: 130, stun: 1 }), S8('Pas d’ombre', '歩', 'dash', 'yin', 12, '#6a5cff')], ult: ['Kage Mane total', 'mark', 'yin', 40, '#6a5cff', { stun: 4, n: 12, r: 600 }] },
    { n: 'Ombre · aiguilles', sk: [S8('Aiguilles d’ombre', '針', 'rain', 'yin', 24, '#6a5cff'), S8('Ombre rampante', '這', 'beam', 'yin', 26, '#6a5cff', { stun: 1.4 })], ult: ['Forêt d’aiguilles', 'zone', 'yin', 90, '#6a5cff', { r: 200 }] },
    { n: 'Ombre · stratège', sk: [S8('Piège stratège', '罠', 'zone', 'yin', 36, '#9b8cff', { stun: 2 }), S8('Garde d’ombre', '護', 'heal', 'yin', 0, '#9b8cff', { h: 0.15, sh: 5 })], ult: ['Kagekubi Shibari', 'burst', 'yin', 110, '#6a5cff', { r: 260, stun: 2.5 }] },
    { n: 'Ombre souveraine', sk: [S8('Marée noire', '潮', 'burst', 'yin', 50, '#6a5cff', { r: 230, pull: 1 }), S8('Lames d’ombre', '刃', 'fan', 'yin', 30, '#6a5cff', { n: 6 })], ult: ['Nuit sans fin', 'rain', 'yin', 60, '#6a5cff', { n: 16, r: 80 }] }]);
  F.akimichi = clanF('Mode Papillon', GOLD, [
    { n: 'Baika', sk: [S8('Baika', '倍', 'burst', 'yang', 22, GOLD, { r: 150 }), S8('Nikudan Sensha', '肉', 'dash', 'yang', 24, GOLD, { D: 300 }), S8('Poing géant', '拳', 'beam', 'yang', 30, GOLD, { L: 300, w: 60 }), S8('Repas', '食', 'heal', 'yang', 0, GOLD, { h: 0.2, sh: 3 })], ult: ['Chō Baika', 'burst', 'yang', 70, GOLD, { r: 230 }] },
    { n: 'Chakra calorique', sk: [S8('Boulet calorique', '弾', 'shot', 'yang', 34, GOLD, { r: 26, boom: 80 }), S8('Pilon', '杵', 'zone', 'yang', 40, GOLD)], ult: ['Pilon géant', 'zone', 'yang', 120, GOLD, { r: 220 }] },
    { n: 'Ailes naissantes', sk: [S8('Écailles', '鱗', 'fan', 'yang', 24, '#ffd166', { n: 5 }), S8('Envol', '翔', 'dash', 'yang', 36, '#ffd166', { D: 320 })], ult: ['Chōdan Bakugeki', 'beam', 'yang', 140, GOLD, { L: 600, w: 90 }] },
    { n: 'Mode Papillon', sk: [S8('Pluie d’écailles', '雨', 'rain', 'yang', 34, '#ffd166', { n: 10 }), S8('Rayon papillon', '蝶', 'beam', 'yang', 50, '#ffd166', { L: 600 })], ult: ['Poing papillon', 'burst', 'yang', 190, GOLD, { r: 300 }] }]);
  F.yamanaka = clanF('Esprit ouvert', '#f49ac1', [
    { n: 'Esprit · lien', sk: [S8('Shintenshin', '心', 'mark', 'yin', 8, '#f49ac1', { stun: 2.2, n: 1 }), S8('Shinranshin', '乱', 'mark', 'yin', 10, '#f49ac1', { stun: 1.5, n: 4 }), S8('Pétales', '花', 'fan', 'yin', 14, '#f49ac1', { n: 5 }), S8('Sondage', '探', 'burst', 'yin', 18, '#f49ac1', { r: 160 })], ult: ['Esprits liés', 'mark', 'yin', 50, '#f49ac1', { stun: 3.5, n: 10, r: 600 }] },
    { n: 'Esprit · transmission', sk: [S8('Onde mentale', '波', 'beam', 'yin', 30, '#f49ac1', { stun: 1 }), S8('Soin des fleurs', '癒', 'heal', 'yang', 0, '#f49ac1', { h: 0.2, sh: 4 })], ult: ['Tempête de pétales', 'rain', 'yin', 40, '#f49ac1', { n: 12 }] },
    { n: 'Esprit ouvert', sk: [S8('Jardin mental', '園', 'zone', 'yin', 44, '#f49ac1', { stun: 2 }), S8('Pluie de pollen', '粉', 'rain', 'yin', 30, '#ffd1e6', { n: 10 })], ult: ['Effondrement mental', 'burst', 'yin', 150, '#f49ac1', { r: 300, stun: 3 }] }]);
  F.aburame = clanF('Ruche éveillée', '#9fd36a', [
    { n: 'Ruche', sk: [S8('Essaim', '蟲', 'fan', 'yin', 12, '#9fd36a', { n: 6 }), S8('Mushi Dama', '玉', 'shot', 'yin', 24, '#9fd36a', { r: 22 }), S8('Mur d’insectes', '壁', 'heal', 'yin', 0, '#9fd36a', { h: 0.1, sh: 5 }), S8('Kikaichū', '喰', 'zone', 'yin', 26, '#9fd36a')], ult: ['Tornade d’insectes', 'burst', 'yin', 70, '#9fd36a', { r: 230, pull: 1 }] },
    { n: 'Ruche · nuée', sk: [S8('Nuée', '群', 'rain', 'yin', 26, '#9fd36a'), S8('Dévoreurs', '食', 'burst', 'yin', 34, '#9fd36a', { r: 170 })], ult: ['Mur vivant', 'zone', 'yin', 120, '#9fd36a', { r: 240 }] },
    { n: 'Ruche éveillée', sk: [S8('Rayon d’essaim', '線', 'beam', 'yin', 44, '#9fd36a', { L: 560 }), S8('Vol de ruche', '飛', 'dash', 'yin', 34, '#9fd36a', { D: 300 })], ult: ['Reine de la ruche', 'rain', 'yin', 60, '#9fd36a', { n: 16, r: 80 }] }]);
  F.inuzuka = clanF('Instinct bestial', '#d8c8a0', [
    { n: 'Instinct', sk: [S8('Tsūga', '牙', 'dash', 'wind', 20, '#d8c8a0'), S8('Gatsūga', '双', 'dash', 'wind', 26, '#d8c8a0', { D: 280 }), S8('Flair', '嗅', 'mark', 'yang', 4, '#d8c8a0', { stun: 1, n: 5, r: 500 }), S8('Hurlement', '吠', 'burst', 'yang', 20, '#d8c8a0', { r: 150 })], ult: ['Garōga', 'beam', 'wind', 80, '#d8c8a0', { L: 600, w: 70 }] },
    { n: 'Jūjin Bunshin', sk: [S8('Crocs jumeaux', '牙', 'fan', 'wind', 22, '#d8c8a0', { n: 4 }), S8('Meute', '群', 'dash', 'wind', 34, '#d8c8a0', { D: 320 })], ult: ['Garōga double', 'rain', 'wind', 44, '#d8c8a0', { n: 10 }] },
    { n: 'Sōtōrō', sk: [S8('Souffle du loup', '息', 'beam', 'wind', 44, '#d8c8a0', { w: 50 }), S8('Hurlement à trois têtes', '咆', 'burst', 'wind', 46, '#d8c8a0', { r: 220, stun: 1 })], ult: ['Sōtōrō : Garōga', 'beam', 'wind', 150, '#d8c8a0', { L: 800, w: 110 }] },
    { n: 'Instinct bestial', sk: [S8('Griffes en pluie', '爪', 'rain', 'wind', 34, '#d8c8a0', { n: 10 }), S8('Territoire', '域', 'zone', 'wind', 50, '#d8c8a0', { r: 160 })], ult: ['Garōga géant', 'burst', 'wind', 190, '#d8c8a0', { r: 320 }] }]);
  F.senju = clanF('Mode Sage', '#7ad07a', [
    { n: 'Mokuton', sk: [S8('Racines', '根', 'zone', 'earth', 24, '#7ad07a', { stun: 1 }), S8('Pieux de bois', '杭', 'fan', 'earth', 16, '#a8d07a', { n: 4 }), S8('Mur de bois', '壁', 'heal', 'earth', 0, '#7ad07a', { h: 0.12, sh: 5 }), S8('Lianes', '蔓', 'beam', 'earth', 22, '#7ad07a', { stun: 1.2 })], ult: ['Jukai Kōtan', 'zone', 'earth', 90, '#7ad07a', { r: 240, stun: 1.5 }] },
    { n: 'Sage · éveil', sk: [S8('Kawazu Kumite', '蛙', 'burst', 'yang', 34, GOLD, { r: 170 }), S8('Senpō : bombe', '仙', 'shot', 'yang', 34, GOLD, { r: 24, boom: 90 })], ult: ['Senpō : Rasengan', 'burst', 'wind', 120, GOLD, { r: 250 }] },
    { n: 'Mode Sage', sk: [S8('Pluie de pieux', '雨', 'rain', 'earth', 30, '#a8d07a', { n: 10 }), S8('Pas du sage', '歩', 'dash', 'yang', 36, GOLD, { D: 300 })], ult: ['Mokuryū', 'beam', 'earth', 150, '#7ad07a', { L: 800, w: 80 }] },
    { n: 'Mode Sage parfait', sk: [S8('Bras de bois', '腕', 'beam', 'earth', 50, '#7ad07a', { L: 600, w: 50 }), S8('Floraison', '花', 'zone', 'earth', 60, '#ffd166', { r: 180 })], ult: ['Mille mains', 'rain', 'earth', 70, GOLD, { n: 18, r: 90 }] }]);
  // ---------- enregistrement : chaque technique et chaque ultime de palier devient une entrée SK ----------
  for (const fk in F) F[fk].st.forEach((s, i) => { const reg = (d, j) => { const id = `m8_${fk}_${i}_${j}`; SK[id] = { n: d.n, el: d.el, k: d.k, cd: d.kind === 'heal' ? 9 : d.kind === 'mark' ? 7 : 4 + Math.min(4, d.d / 15), ch: 12 + Math.min(14, d.d / 4), sign: ['tora', 'mi', 'ushi', 'tori', 'ne', 'tatsu'][(i + j) % 6], m8: d }; return id; };
    s.ids = (s.page || s.sk).map(reg); const [n, kind, el, dmg, c, o] = s.ult; const uid = `m8u_${fk}_${i}`; SK[uid] = { n, el, k: '極', ult: 1, sign: 'tori', m8u: Object.assign({ kind, el, d: dmg, c }, o || {}) }; ULT_NAME[uid] = n; s.ult = uid;
    ULT_FX[uid] = (u, tx, ty, P) => { const D = SK[uid].m8u; u.aimA = Math.atan2(ty - (u.y - 30), tx - u.x); FX.glow(u.x, u.y - 40, D.c, 160, 0.6, { grow: 0.6 }); Cam.shake(0.35); if (MODE08.sus(u)) MODE08.swing(u); KIND[D.kind](u, Object.assign({}, D, { r: D.r }), P * 1.2, u.aimA, { x: u.x + Math.cos(u.aimA) * 30, y: u.y - 40 }); }; });
  const pageOf = (fam, st) => { const S = F[fam].st[st - 1]; if (S.page) return S.ids; const all = []; for (let i = 0; i < st; i++) all.push(...F[fam].st[i].ids); return all.slice(-4); };
  // ---------- état ----------
  const famFor = (key) => { if (Game.mode === 'histoire') return key === 'C' ? 'jogan' : 'karma'; if (key === 'Z') return 'manteau'; const c = Voie.me && Voie.me.clan; return { uchiha: 'sharingan', hyuga: 'byakugan' }[c] || (F[c] ? c : 'sharingan'); };
  const SUSC = { purple: PUR, red: RED, blue: BLU };
  const MODE08 = window.MODE08 = { F, KIND,
    on: () => Game.hero && Game.hero.md,
    susCol() { if (Game.mode === 'voie' && Voie.me) { if (!Voie.me.susC) Voie.me.susC = ['purple', 'red', 'blue'][Math.floor(Math.random() * 3)]; return SUSC[Voie.me.susC]; } return PUR; },
    enter(h, key, st) { const fam = famFor(key); h.md = { fam, key, st: 0, g: 100, up: 0, t: 0 }; this.stage(h, st || 1); Game.page = 1; h.arcA = 0.1; Sfx.play('tech'); if (key === 'C') h.dojT = 9999; else h.beastT = 9999; Game.stat && Game.stat('mode'); return true; },
    stage(h, n) { const M = h.md, Fm = F[M.fam]; n = Math.min(Fm.st.length, n); if (n === M.st) return; M.st = n; M.g = 100; M.up = 0; const S = Fm.st[n - 1]; Game.modeSk = pageOf(M.fam, n); if (!M.ult0) M.ult0 = Game.ultId || 'none'; Game.ultId = S.ult; Game.ultV = Math.max(Game.ultV, n > 1 ? 100 : 60);
      h.eyeFx = M.fam === 'sharingan' ? RED : Fm.c; M.col = S.sus || (M.fam === 'sharingan' && n >= 5) ? this.susCol() : Fm.c; UI.reward(S.n, M.col === '#2a2a3a' ? '#a46bff' : M.col, 1); FX.ring(h.x, h.y - 40, M.col, 20, 200, 0.6); FX.shock(h.x, h.y, M.col, 180, 0.5, 9); Cam.shake(0.25); Game.page = 1; h.arcA = 0.1; flipT = 0.35;
      if (S.sus || S.beast) { M.build = 0; } if (M.fam === 'sharingan' || M.fam === 'byakugan' || M.fam === 'jogan') eyeCut(M.fam, n, M.col); },
    exit(h) { const M = h.md; if (!M) return; if (M.ult0) Game.ultId = M.ult0 === 'none' ? null : M.ult0; h.md = null; Game.modeSk = null; Game.page = 0; h.arcA = 0.1; h.dojT = 0; h.beastT = 0; h.eyeFx = null; h.giant = 0; Cam.tz = 1; UI.toast('Mode épuisé'); },
    sus(u) { return u && u.md && (F[u.md.fam].st[u.md.st - 1].sus || F[u.md.fam].st[u.md.st - 1].beast) ? 1 : 0; },
    swing(u) { u.susSw = 1; },
    flip() { if (!Game.modeSk) { Game.page = 0; return; } Game.page = Game.page ? 0 : 1; if (Game.hero) Game.hero.arcA = 0.1; flipT = 0.35; Sfx.play('pop'); },
  };
  let flipT = 0;
  addEventListener('keydown', (e) => { if (e.repeat || !Game.running || Game.paused || Game.cine) return; const ks = (Save.set.keys && Save.set.keys.page) || ['KeyX']; if (ks.includes(e.code) && !(document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) MODE08.flip(); });
  // pages : Game.skills renvoie la page active ; toute écriture modifie la page de base
  let base = Game.skills; Object.defineProperty(Game, 'skills', { configurable: true, get() { return this.page && this.modeSk ? this.modeSk : base; }, set(v) { base = v; } });
  Object.defineProperty(Game, 'baseSkills', { get() { return base; } });
  const sl = Game.skillLock.bind(Game); Game.skillLock = function (id) { if (SK[id] && SK[id].m8) return null; return sl(id); };
  const ul = Game.ultLock.bind(Game); Game.ultLock = function () { if (this.ultId && SK[this.ultId] && SK[this.ultId].m8u) return null; return ul(); };
  const fs = fireSkill; fireSkill = function (u, S, id) { if (S && S.m8) { const P = pw(u), h = u.hand || { x: u.x + u.face * 20, y: u.y - 40 }; if (MODE08.sus(u)) MODE08.swing(u); if (!isFinite(u.aimA)) { const f = near(u.x, u.y, 600); u.aimA = f ? Math.atan2(f.y - u.y, f.x - u.x) : (u.face < 0 ? Math.PI : 0); } KIND[S.m8.kind](u, S.m8, P * (u.giant ? 1.4 : 1), u.aimA, h); if (u.md) u.md.up += 4; return; } return fs(u, S, id); };
  // touche « page »
  DEFAULT_KEYS.page = ['KeyX']; for (const p in KEY_PRESETS) if (KEY_PRESETS[p] && typeof KEY_PRESETS[p] === 'object') KEY_PRESETS[p].page = KEY_PRESETS[p].page || ['KeyX'];
  if (Save.set.keys && !Save.set.keys.page) Save.set.keys.page = ['KeyX']; if (Save.set.keys && !Save.set.keys.tree) Save.set.keys.tree = ['KeyT'];
  // dégâts : réduction sous Susanoo / bête, jauge de combat
  const ht = hurt; hurt = function (t, dmg, src, o) { if (t && t.isHero && t.md) { const S = F[t.md.fam].st[t.md.st - 1]; if (S.sus) dmg *= 1 - [0, 0.2, 0.3, 0.4, 0.5, 0.7][S.sus]; if (S.beast) dmg *= 0.4; } const r = ht(t, dmg, src, o); if (src && src.isHero && src.md && r !== 0) { src.md.up = Math.min(100, src.md.up + 1.5); src.md.g = Math.min(100, src.md.g + 1.2); } return r; };
  // M1 géant
  const sm = startM1; startM1 = function (u, n) { if (u.isHero && u.giant) { const a = aimAt(u); u.aimA = a; MODE08.swing(u); const P = pw(u); u.act = { k: 'm1', n: 0, t: 0, dur: 0.45, hit: true, a }; Game.later(0.15, () => { const cx = u.x + Math.cos(a) * 140, cy = u.y + Math.sin(a) * 80; aoe(cx, cy, 190, 26 * P, u, { el: 'yin', k: 1.6 }); const c = u.md ? u.md.col : PUR; FX.custom({ x: cx, y: cy, life: 0.3, draw: (g, p, q) => { g.save(); lit(g); g.strokeStyle = rgba(c === '#2a2a3a' ? PUR : c, 0.85 * (1 - q)); g.lineWidth = 26 * (1 - q) + 4; g.lineCap = 'round'; g.beginPath(); g.arc(u.x, u.y - 60, 220, a - 1.3 + q * 0.4, a + 1.3); g.stroke(); g.restore(); } }); Cam.shake(0.2); }); return; } return sm(u, n); };
  // ---------- boucle ----------
  const up = Game.update.bind(Game);
  Game.update = function (dt) { const r = up(dt); const h = this.hero, d = dt || 0; flipT = Math.max(0, flipT - d); if (!h || !this.running || this.paused) return r;
    if (Save.set.keys && !Save.set.keys.page) Save.set.keys.page = ['KeyX']; if (Save.set.keys && !Save.set.keys.tree) Save.set.keys.tree = ['KeyT'];
    const M = h.md; if (M) { const free = !this.cine && h.hp > 0 && !(window.Scene && Scene.on); M.t += d; if (M.build != null) M.build = Math.min(1, M.build + d / 1.4);
      const Fm = F[M.fam], hold = free && Input.is(M.key === 'C' ? 'charge' : 'mode') && !h.act;
      if (this.inCombat() || hold) M.g -= d * (M.st >= Fm.st.length ? 3.2 : 2.2); else M.g -= d * 0.8;
      if (hold) { h.vx *= 0.3; h.vy *= 0.3; M.up = Math.min(100, M.up + d * (this.inCombat() ? 30 : 24)); M.g = Math.min(100, M.g + d * 4); if (Math.random() < 0.5) FX.add({ k: 'spark', x: h.x + rnd(-24, 24), y: h.y - rnd(0, 80), vx: 0, vy: -140, c: M.col === '#2a2a3a' ? PUR : M.col, s: 3, life: 0.5, g: -60 }); }
      if (M.up >= 100 && M.st < Fm.st.length) MODE08.stage(h, M.st + 1); else if (M.up >= 100) M.up = 100;
      const S = Fm.st[M.st - 1]; h.giant = S.giant ? 1 : 0; if (h.giant && !this.cine) Cam.tz = 0.7;
      if (M.g <= 0) MODE08.exit(h); }
    gauge(h); return r; };
  // jauge : réutilise #g07 (barre 1 = mode actif)
  const gauge = (h) => { const M = h.md; if (!M) return; const gd = document.getElementById('g07'); if (!gd) return; gd.style.display = 'flex'; const A = document.getElementById('g07ai'), B = document.getElementById('g07bi'); const c = M.col === '#2a2a3a' ? PUR : M.col;
    A.style.width = M.g + '%'; A.style.background = c; document.getElementById('g07a').textContent = F[M.fam].st[M.st - 1].n; B.style.width = M.up + '%'; B.style.background = 'linear-gradient(90deg,#ffb13d,#a46bff)'; document.getElementById('g07b').textContent = M.st < F[M.fam].st.length ? 'Palier ' + (M.st + 1) + ' (' + Input.label(M.key === 'C' ? 'charge' : 'mode') + ')' : 'Palier max'; };
  // ---------- HUD : indicateur de page + pastilles de palier ----------
  const hh = UI.heroHud.bind(UI); UI.heroHud = function (g, u) { if (flipT > 0 && u === Game.hero) { g.save(); g.translate(u.x, u.y); const s = Math.sin(flipT / 0.35 * Math.PI); g.scale(1 - s * 0.25, 1); g.translate(-u.x, -u.y); hh(g, u); g.restore(); } else hh(g, u); if (u !== Game.hero || !(u.hudA > 0.05)) return;
    g.save(); g.translate(u.x, u.y); g.globalAlpha = u.hudA; const y0 = -118 - (u.giant ? 40 : 0);
    if (Game.modeSk) for (let i = 0; i < 2; i++) { g.fillStyle = (Game.page ? 1 : 0) === i ? '#ffd166' : 'rgba(232,238,252,.35)'; g.beginPath(); g.arc(-58 + i * 9, 18, 3, 0, TAU); g.fill(); }
    const M = u.md; if (M) { const n = F[M.fam].st.length, c = M.col === '#2a2a3a' ? PUR : M.col; for (let i = 0; i < n; i++) { g.fillStyle = i < M.st ? c : 'rgba(11,16,32,.55)'; g.strokeStyle = '#0b1020'; g.lineWidth = 1.5; g.beginPath(); g.arc((i - (n - 1) / 2) * 11, y0, i === M.st - 1 ? 4.5 : 3.5, 0, TAU); g.fill(); g.stroke(); }
      if (M.fam === 'sharingan') { g.translate((n / 2) * 11 + 14, y0); drawEye(g, 8, M.st); } }
    g.restore(); };
  // œil (Sharingan : tomoe / Mangekyō)
  const drawEye = (g, R, st, col) => { g.save(); g.fillStyle = col || '#d0283a'; g.strokeStyle = '#0b1020'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#0b1020';
    if (st >= 4) { g.rotate(Game.t * 0.6); for (let i = 0; i < 3; i++) { g.rotate(TAU / 3); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(R * 0.9, -R * 0.2, R * 0.75, R * 0.55); g.quadraticCurveTo(R * 0.3, R * 0.2, 0, 0); g.fill(); } g.beginPath(); g.arc(0, 0, R * 0.22, 0, TAU); g.fill(); }
    else { g.beginPath(); g.arc(0, 0, R * 0.25, 0, TAU); g.fill(); g.strokeStyle = 'rgba(11,16,32,.6)'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, R * 0.6, 0, TAU); g.stroke(); g.rotate(Game.t * 1.2); for (let i = 0; i < st; i++) { const a = i / st * TAU; const x = Math.cos(a) * R * 0.6, y = Math.sin(a) * R * 0.6; g.beginPath(); g.arc(x, y, R * 0.17, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 1.2) * R * 0.3, y + Math.sin(a + 1.2) * R * 0.3, x + Math.cos(a + 1.9) * R * 0.38, y + Math.sin(a + 1.9) * R * 0.38); g.lineWidth = 1.6; g.strokeStyle = '#0b1020'; g.stroke(); } }
    g.restore(); };
  MODE08.drawEye = drawEye;
  // gros plan de l’œil à chaque palier (bref, sans flash)
  const ec = document.createElement('canvas'); ec.id = 'eye08'; ec.width = 360; ec.height = 160; ec.style.cssText = 'position:fixed;left:50%;top:22%;transform:translateX(-50%);z-index:14;pointer-events:none;opacity:0;transition:opacity .25s;width:min(360px,70vw)'; document.body.appendChild(ec);
  let ecT = null; const eyeCut = (fam, st, col) => { if (Save.set.low) return; const g = ec.getContext('2d'); let t0 = performance.now(); ec.style.opacity = 1; clearTimeout(ecT); ecT = setTimeout(() => (ec.style.opacity = 0), 1100);
    const draw = () => { const t = (performance.now() - t0) / 1000; if (t > 1.5) return; g.clearRect(0, 0, 360, 160); g.save(); g.translate(180, 80); const op = Math.min(1, t * 4); g.fillStyle = '#0b1020'; g.beginPath(); g.ellipse(0, 0, 170, 62 * op, 0, 0, TAU); g.fill(); g.save(); g.beginPath(); g.ellipse(0, 0, 160, 55 * op, 0, 0, TAU); g.clip(); g.fillStyle = '#f4efe6'; g.fillRect(-170, -70, 340, 140);
      if (fam === 'sharingan') { drawEye(g, 48, st); } else if (fam === 'byakugan') { g.fillStyle = st >= 3 ? '#7ad0ff' : '#e8e8f8'; g.beginPath(); g.arc(0, 0, 48, 0, TAU); g.fill(); g.strokeStyle = 'rgba(120,140,200,.6)'; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(Math.cos(i / 12 * TAU) * 20, Math.sin(i / 12 * TAU) * 20); g.lineTo(Math.cos(i / 12 * TAU) * 46, Math.sin(i / 12 * TAU) * 46); g.stroke(); } if (st >= 3) { g.fillStyle = '#3a6ad0'; g.beginPath(); g.arc(0, 0, 14, 0, TAU); g.fill(); } }
      else { g.fillStyle = '#8fd3ff'; g.beginPath(); g.arc(0, 0, 48, 0, TAU); g.fill(); g.strokeStyle = '#2a6ad0'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(0, 0, 12 + i * 4.5, i, i + 2.4); g.stroke(); } }
      g.restore(); g.strokeStyle = '#0b1020'; g.lineWidth = 6; g.beginPath(); g.ellipse(0, 0, 160, 55 * op, 0, 0, TAU); g.stroke(); g.restore(); requestAnimationFrame(draw); }; draw(); };
  // ---------- Susanoo & bête géante ----------
  // contour en flammes : halo coloré (ombre portée) + trait de couleur + cœur clair ; langues de flamme qui ondulent le long du trait
  const flameOutline = (g, path, c, t, w) => { g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; g.shadowColor = c; g.shadowBlur = Save.set.low ? 0 : 16;
    g.strokeStyle = rgba(c, 0.55); g.lineWidth = w * 2.6; g.setLineDash([w * 3 + Math.sin(t * 7) * w, w * 1.4]); g.lineDashOffset = -t * 90; g.stroke(path); g.setLineDash([]);
    g.shadowBlur = 0; g.strokeStyle = rgba(c, 0.95); g.lineWidth = w * 1.1; g.stroke(path); g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(c, 0.6); g.lineWidth = w * 0.4; g.stroke(path); g.restore(); };
  const fillGlow = (g, path, c, a) => { g.save(); g.fillStyle = rgba(c, a * 1.6); g.fill(path); g.restore(); };
  const P2 = () => new Path2D();
  // stage 1..5 ; o : { build 0..1, sw 0..1 (balancement d’épée), t }
  const drawSusanoo = MODE08.drawSusanoo = (g, x, y, lvl, c, o) => { const t = o.t || 0, b = o.build == null ? 1 : o.build, sw = o.sw || 0, K = lvl >= 5 ? 1.5 : 1, face = o.face || 1;
    g.save(); g.translate(x, y); g.scale(K * face, K); const sway = Math.sin(t * 1.6) * 0.03; g.rotate(sway);
    // construction : révélée de bas en haut
    g.beginPath(); g.rect(-400, 40 - 400 * b, 800, 800); g.clip(); g.globalAlpha = 0.25 + 0.75 * b;
    const glow = g.createRadialGradient(0, -110, 10, 0, -110, 170); glow.addColorStop(0, rgba(c, 0.28)); glow.addColorStop(1, rgba(c, 0)); g.save(); g.fillStyle = glow; g.beginPath(); g.ellipse(0, -110, 160, 190, 0, 0, TAU); g.fill(); g.restore();
    // colonne + côtes (toujours)
    const sp = P2(); sp.moveTo(0, -10); sp.lineTo(0, -190); flameOutline(g, sp, c, t, 5);
    const rib = P2(); for (let i = 0; i < 6; i++) { const yy = -60 - i * 22, w = 46 + Math.sin(i / 5 * Math.PI) * 30; rib.moveTo(0, yy); rib.bezierCurveTo(w * 0.6, yy - 18, w, yy + 4, w * 0.75, yy + 22); rib.moveTo(0, yy); rib.bezierCurveTo(-w * 0.6, yy - 18, -w, yy + 4, -w * 0.75, yy + 22); } flameOutline(g, rib, c, t, 4); fillGlow(g, rib, c, 0.06);
    if (lvl >= 2) { // crâne + bras squelettiques
      const sk = P2(); sk.ellipse(0, -222, 30, 34, 0, 0, TAU); flameOutline(g, sk, c, t, 4); fillGlow(g, sk, c, 0.12); g.save(); lit(g); g.fillStyle = rgba(c, 0.9); g.beginPath(); g.ellipse(-11, -226, 6, 4, 0.3, 0, TAU); g.ellipse(11, -226, 6, 4, -0.3, 0, TAU); g.fill(); g.restore();
      const arm = P2(); const sa = -0.6 + sw * 1.8; arm.moveTo(70, -180); arm.lineTo(70 + Math.cos(sa) * 70, -180 + Math.sin(sa) * 70 + 40); arm.lineTo(70 + Math.cos(sa) * 140, -180 + Math.sin(sa) * 40 + 40); arm.moveTo(-70, -180); arm.lineTo(-120, -110); arm.lineTo(-110, -40); flameOutline(g, arm, c, t, 5); }
    if (lvl >= 3) { // chair spectrale : torse, visage de tengu, deuxième paire de bras
      const body = P2(); body.moveTo(-95, -30); body.bezierCurveTo(-120, -120, -110, -190, -60, -205); body.lineTo(60, -205); body.bezierCurveTo(110, -190, 120, -120, 95, -30); body.closePath(); fillGlow(g, body, c, 0.16); flameOutline(g, body, c, t, 6);
      const fc = P2(); fc.moveTo(-34, -250); fc.quadraticCurveTo(0, -268, 34, -250); fc.lineTo(30, -205); fc.quadraticCurveTo(0, -192, -30, -205); fc.closePath(); fillGlow(g, fc, c, 0.22); flameOutline(g, fc, c, t, 3.5);
      const nose = P2(); nose.moveTo(0, -232); nose.lineTo(38, -218); nose.lineTo(0, -214); flameOutline(g, nose, c, t, 3); // nez de tengu
      g.save(); lit(g); g.fillStyle = rgba('#ffffff', 0.85); g.beginPath(); g.ellipse(-13, -236, 7, 3, 0.25, 0, TAU); g.ellipse(13, -236, 7, 3, -0.25, 0, TAU); g.fill(); g.restore();
      const tusk = P2(); tusk.moveTo(-14, -206); tusk.lineTo(-8, -194); tusk.moveTo(14, -206); tusk.lineTo(8, -194); flameOutline(g, tusk, c, t, 2.5);
      // Yasaka no Magatama en orbite
      g.save(); lit(g); for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * TAU / 3, mx = Math.cos(a) * 130, my = -150 + Math.sin(a) * 30; g.fillStyle = rgba(c, 0.7); g.beginPath(); g.arc(mx, my, 9, 0, TAU); g.fill(); g.strokeStyle = rgba(c, 0.7); g.lineWidth = 5; g.beginPath(); g.arc(mx - 6, my + 2, 9, 0.5, 2.6); g.stroke(); } g.restore(); }
    if (lvl >= 4) { // armure de samouraï, cornes, épée, bouclier de Yata
      const arm = P2(); for (let i = 0; i < 3; i++) { const yy = -150 + i * 34; arm.moveTo(-105 + i * 4, yy); arm.quadraticCurveTo(0, yy + 16, 105 - i * 4, yy); } arm.moveTo(-60, -205); arm.quadraticCurveTo(-130, -210, -140, -160); arm.moveTo(60, -205); arm.quadraticCurveTo(130, -210, 140, -160); flameOutline(g, arm, c, t, 4.5);
      const helm = P2(); helm.moveTo(-42, -248); helm.quadraticCurveTo(0, -300, 42, -248); helm.moveTo(-20, -280); helm.quadraticCurveTo(-60, -320, -70, -350); helm.moveTo(20, -280); helm.quadraticCurveTo(60, -320, 70, -350); helm.moveTo(0, -290); helm.lineTo(0, -320); flameOutline(g, helm, c, t, 5); fillGlow(g, helm, c, 0.1);
      // épée
      g.save(); g.translate(120, -170); g.rotate(-1.1 + sw * 2.2); const sw2 = P2(); sw2.moveTo(0, 0); sw2.lineTo(0, -210); sw2.lineTo(10, -230); sw2.lineTo(20, -210); sw2.lineTo(20, 0); sw2.closePath(); fillGlow(g, sw2, c, 0.35); flameOutline(g, sw2, c, t, 3.5); const hd = P2(); hd.rect(-12, 0, 44, 8); hd.rect(4, 8, 12, 34); flameOutline(g, hd, c, t, 3); g.restore();
      if (sw > 0.05) { g.save(); lit(g); g.strokeStyle = rgba(c, 0.6 * sw); g.lineWidth = 30 * sw; g.lineCap = 'round'; g.beginPath(); g.arc(120, -170, 230, -2.7 + sw * 1.4, -1.0 + sw * 2.2); g.stroke(); g.restore(); }
      // bouclier de Yata
      const sh = P2(); for (let i = 0; i < 9; i++) { const a = i / 8 * TAU, r = i % 2 ? 46 : 58; i ? sh.lineTo(-130 + Math.cos(a) * r, -110 + Math.sin(a) * r) : sh.moveTo(-130 + Math.cos(a) * r, -110 + Math.sin(a) * r); } sh.closePath(); fillGlow(g, sh, '#ffd166', 0.12); flameOutline(g, sh, c, t, 3.5); }
    if (lvl >= 5) { // parfait : ailes, deuxième visage, jambes, aura en flammes
      const wg = P2(); for (const s of [-1, 1]) { wg.moveTo(s * 80, -190); wg.bezierCurveTo(s * 220, -300, s * 300, -200, s * 280, -60); wg.bezierCurveTo(s * 230, -120, s * 170, -120, s * 100, -100); } fillGlow(g, wg, c, 0.1); flameOutline(g, wg, c, t, 5);
      const lg = P2(); lg.moveTo(-60, -30); lg.lineTo(-80, 40); lg.moveTo(60, -30); lg.lineTo(80, 40); lg.moveTo(-110, 40); lg.quadraticCurveTo(0, 20, 110, 40); flameOutline(g, lg, c, t, 6);
      g.save(); lit(g); for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, r = 200 + Math.sin(t * 6 + i * 2) * 14; g.fillStyle = rgba(c, 0.12); g.beginPath(); g.moveTo(Math.cos(a) * r * 0.9, -130 + Math.sin(a) * r); g.lineTo(Math.cos(a + 0.12) * (r + 40), -130 + Math.sin(a + 0.12) * (r + 40) - 20); g.lineTo(Math.cos(a + 0.24) * r * 0.9, -130 + Math.sin(a + 0.24) * r); g.fill(); } g.restore(); }
    g.restore(); };
  const drawBeast = MODE08.drawBeast = (g, x, y, c, o) => { const t = o.t || 0, b = o.build == null ? 1 : o.build, K = 1.5, face = o.face || 1; g.save(); g.translate(x, y); g.scale(K * face, K); g.beginPath(); g.rect(-400, 40 - 400 * b, 800, 800); g.clip(); g.globalAlpha = 0.3 + 0.7 * b;
    const body = P2(); body.moveTo(-90, 0); body.bezierCurveTo(-110, -90, -40, -140, 30, -130); body.bezierCurveTo(90, -120, 110, -60, 90, 0); body.closePath(); fillGlow(g, body, c, 0.28); flameOutline(g, body, c, t, 6);
    const hd = P2(); hd.moveTo(30, -130); hd.quadraticCurveTo(60, -190, 110, -170); hd.lineTo(150, -150); hd.lineTo(110, -130); hd.quadraticCurveTo(80, -110, 50, -120); hd.moveTo(60, -175); hd.lineTo(55, -230); hd.lineTo(85, -185); hd.moveTo(90, -172); hd.lineTo(105, -225); hd.lineTo(115, -168); fillGlow(g, hd, c, 0.3); flameOutline(g, hd, c, t, 5);
    g.save(); lit(g); g.fillStyle = '#fff3c0'; g.beginPath(); g.ellipse(100, -160, 8, 3, -0.3, 0, TAU); g.fill(); g.restore();
    const tl = P2(); for (let i = 0; i < 9; i++) { const a = -2.2 - i * 0.12 + Math.sin(t * 2 + i) * 0.12; tl.moveTo(-80, -40); tl.quadraticCurveTo(-80 + Math.cos(a) * 120, -40 + Math.sin(a) * 120, -80 + Math.cos(a - 0.4) * 200, -40 + Math.sin(a - 0.4) * 200); } flameOutline(g, tl, c, t, 7);
    const lg = P2(); lg.moveTo(-60, 0); lg.lineTo(-70, 40); lg.moveTo(60, 0); lg.lineTo(75, 40); flameOutline(g, lg, c, t, 6); g.restore(); };
  // dessin dans le monde, derrière le héros
  FX.custom({ x: 0, y: 0, life: 1e9, ground: 2, draw: (g) => { const h = Game.hero; if (!h || !h.md || h.hp <= 0) return; const M = h.md, S = F[M.fam].st[M.st - 1]; h.susSw = Math.max(0, (h.susSw || 0) - 0.06); const sw = h.susSw ? Math.sin((1 - h.susSw) * Math.PI) : 0;
    if (S.sus) MODE08.drawSusanoo(g, h.x, h.y + 4, S.sus, M.col, { t: Game.t, build: M.build, sw, face: Math.cos(h.aimA || 0) < 0 ? -1 : 1 });
    else if (S.beast) MODE08.drawBeast(g, h.x, h.y + 4, M.col, { t: Game.t, build: M.build, face: Math.cos(h.aimA || 0) < 0 ? -1 : 1 });
    else if (Math.random() < 0.4) FX.add({ k: 'spark', x: h.x + rnd(-22, 22), y: h.y - rnd(0, 70), vx: 0, vy: -120, c: M.col === '#2a2a3a' ? PUR : M.col, s: 2.5, life: 0.45, g: -60 }); } });
  // Susanoo de Sarada (ultime allié) redessiné
  ULT_FX.susanoo = (u, tx, ty, P) => { const c = u.isHero ? MODE08.susCol() : '#ff4a6a'; let sw = 0; FX.custom({ x: u.x, y: u.y, life: 2.2, ground: 2, draw: (g, p, q) => { sw = q > 0.5 && q < 0.8 ? Math.sin((q - 0.5) / 0.3 * Math.PI) : 0; MODE08.drawSusanoo(g, u.x, u.y + 4, 4, c, { t: Game.t, build: Math.min(1, q * 2.5), sw, face: tx < u.x ? -1 : 1 }); } });
    Game.later(1.3, () => { aoe(tx, ty, 200, 70 * P, u, { el: 'yin', k: 2, big: 1 }); FX.shock(tx, ty, c, 200, 0.5, 10); Cam.shake(0.35); }); };
  // ---------- tactile : glisser sur l’arc / bouton page ----------
  let sx = null; addEventListener('touchstart', (e) => { const tt = e.target; if (tt && tt.closest && tt.closest('#touch')) sx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50 && Game.modeSk) MODE08.flip(); }, { passive: true });
  const tb = document.createElement('div'); tb.className = 'tb t07'; tb.id = 'tPage'; tb.textContent = '⇄'; tb.style.cssText = 'position:absolute;right:calc(170px * var(--ts,1));bottom:calc(14px * var(--ts,1));display:none';
  const tc = document.getElementById('touch'); if (tc) { tc.appendChild(tb); tb.addEventListener('touchstart', (e) => { e.preventDefault(); MODE08.flip(); }); }
  setInterval(() => { tb.style.display = Game.modeSk ? '' : 'none'; }, 400);
  // fin de partie / changement de mode de jeu → sortir du mode
  for (const k of ['startStory', 'startVoie', 'start']) if (typeof Game[k] === 'function') { const o = Game[k].bind(Game); Game[k] = function () { if (this.hero && this.hero.md) MODE08.exit(this.hero); this.modeSk = null; this.page = 0; return o.apply(this, arguments); }; }
})();
