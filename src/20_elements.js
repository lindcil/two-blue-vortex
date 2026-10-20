/* ============ Éléments et réactions ============ */
const ELS = {
  fire: { n: 'Katon', k: '火', shape: 'tri', c: '#ff7a3d' }, wind: { n: 'Fūton', k: '風', shape: 'swirl', c: '#7ee0a8' }, water: { n: 'Suiton', k: '水', shape: 'drop', c: '#4aa8ff' },
  bolt: { n: 'Raiton', k: '雷', shape: 'zig', c: '#c9a6ff' }, earth: { n: 'Doton', k: '土', shape: 'sq', c: '#c8a46a' }, yin: { n: 'Yin', k: '陰', shape: 'moon', c: '#9b8cff' }, yang: { n: 'Yang', k: '陽', shape: 'sun', c: '#ffd166' },
};
// préréglages daltoniens : couleurs contrastées + formes toujours présentes
const CB = { protan: { fire: '#e69f00', wind: '#56b4e9', water: '#0072b2', bolt: '#f0e442', earth: '#a0785a', yin: '#cc79a7', yang: '#ffffff' }, deutan: { fire: '#e69f00', wind: '#56b4e9', water: '#0072b2', bolt: '#f0e442', earth: '#8c6d46', yin: '#cc79a7', yang: '#ffffff' }, tritan: { fire: '#d55e00', wind: '#009e73', water: '#5aa0ff', bolt: '#ff6fb5', earth: '#b08850', yin: '#8f7fff', yang: '#ffe680' } };
const elc = (e) => (Save.set.cb !== 'none' && CB[Save.set.cb] && CB[Save.set.cb][e]) || (ELS[e] ? ELS[e].c : '#ffffff');
const RX = [
  { id: 'embrase', a: 'fire', b: 'wind', n: 'Embrasement', k: '燎', d: 'La brûlure se propage aux ennemis proches.', m: 1.4, big: 0 },
  { id: 'conduc', a: 'water', b: 'bolt', n: 'Conduction', k: '導', d: 'Choc en chaîne sur les cibles mouillées, étourdit.', m: 1.3, big: 0 },
  { id: 'boue', a: 'earth', b: 'water', n: 'Boue', k: '泥', d: 'Ralentit fortement.', m: 1.1, big: 0 },
  { id: 'vapeur', a: 'fire', b: 'water', n: 'Vapeur', k: '蒸', d: 'Aveugle la cible. Dégâts ×1,5.', m: 1.5, big: 0 },
  { id: 'terre', a: 'bolt', b: 'earth', n: 'Mise à terre', k: '断', d: 'Brise la garde et l’armure.', m: 1.6, big: 0 },
  { id: 'gel', a: 'wind', b: 'water', n: 'Gel', k: '氷', d: 'Fige la cible 1,5 s.', m: 1.2, big: 0 },
  { id: 'lave', a: 'fire', b: 'earth', n: 'Lave', k: '熔', d: 'Laisse une flaque brûlante.', m: 1.3, big: 0 },
  { id: 'surcharge', a: 'fire', b: 'bolt', n: 'Surcharge', k: '爆', d: 'Explosion et recul.', m: 1.7, big: 1 },
  { id: 'mirage', a: 'yin', b: '*', n: 'Mirage', k: '幻', d: 'La cible frappe ses alliés 2 s.', m: 1.2, big: 0 },
  { id: 'vital', a: 'yang', b: '*', n: 'Vitalité', k: '命', d: 'Te soigne d’une part des dégâts.', m: 1.2, big: 0 },
  { id: 'onmyo', a: 'yin', b: 'yang', n: 'Onmyō', k: '陰陽', d: 'Rupture : gros dégâts purs.', m: 2.6, big: 1 },
];
const findRx = (a, b) => { for (const R of RX) if (R.b !== '*' && ((R.a === a && R.b === b) || (R.a === b && R.b === a))) return R; if (a === 'yin' || b === 'yin') return RX.find((r) => r.id === 'mirage'); if (a === 'yang' || b === 'yang') return RX.find((r) => r.id === 'vital'); return null; };
/* Applique un élément : soit pose une aura, soit consomme l'aura présente → réaction. Le Vent propage (Tourbillon). */
function applyEl(src, t, el, dmg) {
  if (!el || !t.aura) return { dmg, rx: null };
  const cur = Object.keys(t.aura).find((k) => t.aura[k] > 0 && k !== el);
  if (!cur) { if (el !== 'wind' || Math.random() < 0.5) t.aura[el] = Math.max(t.aura[el] || 0, 6); return { dmg, rx: null }; }
  // Tourbillon : le Vent propage l'aura existante (Feu → Embrasement prioritaire)
  if (el === 'wind' && cur !== 'fire' && cur !== 'water') { for (const o of World.foes()) if (o !== t && dist(o, t) < 170) { o.aura[cur] = 6; FX.ring(o.x, o.y, elc(cur), 10, 60, 0.4); } delete t.aura[cur]; popRx(t, { n: 'Tourbillon', k: '渦', id: 'swirl' }, elc('wind')); Game.stat('swirl'); return { dmg: dmg * 1.2, rx: 'swirl' }; }
  const R = findRx(cur, el); delete t.aura[cur]; if (!R) { t.aura[el] = 6; return { dmg, rx: null }; }
  let out = dmg * R.m; Game.stat(R.id); Game.seenRx(R.id);
  switch (R.id) {
    case 'embrase': for (const o of World.foes()) if (o !== t && dist(o, t) < 160) { o.st.burn = 3; o.aura.fire = 4; FX.burst(o.x, o.y, elc('fire'), 10); } t.st.burn = 4; break;
    case 'conduc': { let n = 0; for (const o of World.foes()) if (o !== t && dist(o, t) < 220 && n < 4) { n++; FX.bolt(t.x, t.y - 30, o.x, o.y - 30, elc('bolt')); hurt(o, dmg * 0.6, src, { k: 0.2 }); o.st.stun = 0.8; } t.st.stun = 1; break; }
    case 'boue': t.st.slow = 4; FX.puddle(t.x, t.y, '#6b5236', 4); break;
    case 'vapeur': t.st.blind = 3; FX.smoke(t.x, t.y, 14); break;
    case 'terre': t.armor = 0; t.st.stun = 0.5; break;
    case 'gel': t.st.freeze = 1.5; break;
    case 'lave': World.hazard(t.x, t.y, 70, 4, 'fire'); break;
    case 'surcharge': for (const o of World.foes()) if (dist(o, t) < 150) { const a = Math.atan2(o.y - t.y, o.x - t.x); o.vx += Math.cos(a) * 520; o.vy += Math.sin(a) * 520; if (o !== t) hurt(o, dmg * 0.5, src, {}); } FX.ring(t.x, t.y, elc('fire'), 20, 170, 0.5); break;
    case 'mirage': t.st.confuse = 2; break;
    case 'vital': if (src && src.isHero) { src.hp = Math.min(src.maxHp, src.hp + out * 0.3); FX.text(src.x, src.y - 70, '+' + Math.round(out * 0.3), '#7ee0a8'); } break;
    case 'onmyo': t.armor = 0; break;
  }
  popRx(t, R, elc(cur)); if (R.big) Game.impact(t.x, t.y, 0.12); else Game.hitstop(0.05); Sfx.play('rx');
  return { dmg: out, rx: R.id };
}
function popRx(t, R, col) { FX.text(t.x, t.y - 92, R.k + '  ' + R.n, col, 22, true); FX.ring(t.x, t.y - 20, col, 16, 110, 0.45); FX.burst(t.x, t.y - 20, col, 18); }
/* Dessin d'une icône d'élément (forme + idéogramme) — lisible sans la couleur */
function drawElIcon(g, el, x, y, r) { const c = elc(el), E = ELS[el]; g.save(); g.translate(x, y); g.fillStyle = 'rgba(8,12,26,.85)'; g.strokeStyle = c; g.lineWidth = 2;
  g.beginPath(); switch (E.shape) { case 'tri': g.moveTo(0, -r); g.lineTo(r * 0.9, r * 0.7); g.lineTo(-r * 0.9, r * 0.7); g.closePath(); break; case 'drop': g.moveTo(0, -r); g.quadraticCurveTo(r, r * 0.2, 0, r); g.quadraticCurveTo(-r, r * 0.2, 0, -r); break;
    case 'zig': g.moveTo(-r * 0.3, -r); g.lineTo(r * 0.6, -r * 0.1); g.lineTo(0, 0); g.lineTo(r * 0.4, r); g.lineTo(-r * 0.7, 0); g.lineTo(0, -0.1 * r); g.closePath(); break; case 'sq': g.rect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6); break;
    case 'moon': g.arc(0, 0, r, 0.6, TAU - 0.6); g.arc(r * 0.5, 0, r * 0.7, TAU - 1.1, 1.1, true); g.closePath(); break; case 'sun': for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU, rr = i % 2 ? r * 0.7 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); break; default: g.arc(0, 0, r, 0, TAU); }
  g.fill(); g.stroke(); g.fillStyle = c; g.font = `700 ${Math.round(r * 1.05)}px ${'"Zen Kaku Gothic New",serif'}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(E.k, 0, r * 0.08); g.restore(); }
