// v0.10.31 — Jinchūriki & Kāma en Voie (items 5-6).
// Killer B (Cascade) → Autel du renard (Sanctuaire) : sceau d'un fragment de Kurama = Manteau (Z). Paliers : revenir voir B après des missions (Manteau → 1 queue → 4 queues → Mode Bijū → Bête).
// Vestige de Momoshiki (Ruines du Sud) : Kāma (Z), paliers en revenant après des missions. Choix du mode Z dans l'onglet Ninjutsu quand plusieurs sont appris.
(() => {
  const MS = MASTER10.MS, me = () => Voie.me, inVoie = () => Game.mode === 'voie' && me() && !Game.creative;
  const T = (s) => (window.LANG10 && LANG10.t ? LANG10.t(s) : s);
  const ready = (m, lv) => (Voie.done || 0) >= lv * 2; // 2 missions de plus par palier
  const up = (m, key, max, M, okLine, waitLine) => { const lv = m[key] || 0; if (lv >= max) { Talk.say([[M.n, okLine]]); return; } if (!ready(m, lv)) { Talk.say([[M.n, waitLine]]); return; }
    m[key] = lv + 1; Talk.say([[M.n, okLine]], () => { UI.reward(T('Palier débloqué') + ' ★' + m[key], '#ffb13d', 1); Game.save && Game.save(); }); };
  MS.bee = { n: 'Killer B', where: 'Cascade (est)', x: 4560, y: 2060, look: () => makeLook(4, { skin: '#7a4a2e', hair: '#e8e0d0', hs: 'buzz', vest: '#e8e8e8', top: '#2a2a2a', bot: '#2a2a2a', band: 1, sword: 1, glasses: 0 }),
    talk(m) { const M = this; if (!m.masters.bee) { Talk.say([[M.n, 'Yo ! Killer B, le jinchūriki à huit queues, ouais !'], [M.n, 'Tu veux le pouvoir d’une bête ? Faut d’abord la regarder en face, idiot, imbécile !'], [M.n, 'Au Sanctuaire du renard, un fragment de Kurama dort. Va le sceller, wee !']], () => { m.masters.bee = 1; UI.reward(T('Maître trouvé : Killer B — va au Sanctuaire du renard'), '#ffb13d', 1); Game.save && Game.save(); }); return; }
      if (!m.jin) { Talk.say([[M.n, 'Le Sanctuaire du renard, au nord-est. Bouge, yo !']]); return; }
      up(m, 'jin', 5, M, 'Ton chakra de bijū grandit, yo ! Un palier de plus.', 'Pas encore, idiot. Reviens après d’autres missions.'); } };
  MS.altar = { n: 'Autel du renard', where: 'Sanctuaire du renard (nord-est)', x: 4300, y: 790, altar: 1, look: () => makeLook(1),
    talk(m) { const M = this; if (m.jin) { Talk.say([[M.n, 'Le sceau tient. Le renard dort… à moitié.']]); return; } if (!m.masters.bee) { Talk.say([[M.n, 'Une chaleur rouge pulse sous la pierre. Il te faudrait un guide.']]); return; }
      Talk.say([[M.n, 'Le chakra rouge s’enroule autour de toi… Le sceau tient.']], () => { m.jin = 1; FX.glow(Game.hero.x, Game.hero.y - 40, '#ff7a2a', 200, 0.8, { grow: 0.6 }); Cam.shake(0.4); UI.reward(T('Jinchūriki ! Manteau de chakra débloqué (Z)'), '#ff7a2a', 1); Game.save && Game.save(); }); } };
  MS.momo = { n: 'Vestige de Momoshiki', where: 'Ruines du Sud', x: 1600, y: 3780, look: () => makeLook(6, { skin: '#ece6f2', hair: '#f2f2f8', hs: 'long', top: '#f0ecf6', bot: '#d8d0e4', cloak: '#f0ecf6', band: 0 }),
    talk(m) { const M = this; if (!m.karma) { Talk.say([[M.n, 'Un être inférieur… mais ce corps fera un réceptacle convenable.'], [M.n, 'Je te laisse ma marque. Le Kāma. Ne me déçois pas.']], () => { m.karma = 1; m.masters.momo = 1; UI.reward(T('Kāma reçu — Mode Kāma débloqué (Z)'), '#a46bff', 1); Game.save && Game.save(); }); return; }
      up(m, 'karma', 4, M, 'Le Kāma s’étend. Tu deviens ce que je suis.', 'Pas encore. Accomplis d’autres missions, réceptacle.'); } };
  // Z : mode choisi parmi ceux appris ; paliers plafonnés par la progression
  const avail = () => { const m = me(); if (!m) return []; const L = []; if (m.sage > 0) L.push('ermite'); if (m.jin) L.push('manteau'); if (m.karma) L.push('karma'); return L; };
  const en = MODE08.enter.bind(MODE08);
  MODE08.enter = function (h, key, st) { if (!(key === 'Z' && inVoie() && h === Game.hero)) return en(h, key, st); const A = avail(); if (!A.length) return en(h, key, st);
    const m = me(), want = A.includes(m.zfam) ? m.zfam : A[0]; const sg = m.sage; if (want !== 'ermite') m.sage = 0; let r; try { r = en(h, key, st); } finally { m.sage = sg; }
    if (r && h.md && h.md.fam !== want) { h.md.fam = want; h.md.st = 0; this.stage(h, 1); } return r; };
  const sgf = MODE08.stage.bind(MODE08);
  MODE08.stage = function (h, n) { if (h === Game.hero && inVoie() && h.md) { const m = me(); if (h.md.fam === 'manteau') n = Math.min(n, m.jin || 1); else if (h.md.fam === 'karma') n = Math.min(n, m.karma || 1); } return sgf(h, n); };
  window.JIN10 = { avail, pick(f) { const m = me(); if (m) { m.zfam = f; UI.render && UI.render(); } } };
  const NM = { ermite: 'Mode Ermite', manteau: 'Manteau de chakra', karma: 'Kāma' };
  const tn = UI.t_ninjutsu.bind(UI);
  UI.t_ninjutsu = function () { const s = tn(); if (!inVoie()) return s; const A = avail(), m = me(); if (!A.length) return s;
    return `<h3 style="font-family:var(--f-title)">${T('Mode (Z)')}</h3><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">` + A.map((f) => `<button class="keybtn" style="${(m.zfam || A[0]) === f ? 'outline:2px solid #ffd166' : ''}" onclick="JIN10.pick('${f}')">${T(NM[f])}${f === 'manteau' ? ' ★' + m.jin : f === 'karma' ? ' ★' + m.karma : ' ★' + m.sage}</button>`).join('') + '</div>' + s; };
  // autel : pierre gravée (dessinée à la place d'un personnage)
  const dr = drawRig; drawRig = function (g, u, tint) { if (!u || !u.altar10) return dr(g, u, tint); const x = u.x, y = u.y, p = 0.5 + 0.5 * Math.sin(Game.t * 2);
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x, y + 2, 40, 10, 0, 0, TAU); g.fill();
    g.fillStyle = '#8a8478'; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x - 22, y - 70); g.quadraticCurveTo(x, y - 84, x + 22, y - 70); g.lineTo(x + 30, y); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = `rgba(255,${100 + 40 * p | 0},40,${0.5 + 0.4 * p})`; g.font = 'bold 26px serif'; g.textAlign = 'center'; g.fillText('封', x, y - 32); g.restore(); };
  // v0.10.32 — modèles : Killer B (lunettes noires, bouc, tatouage de corne, sabres) ; Momoshiki (cornes, yeux pâles, Rinnegan dans les paumes)
  const dr2 = drawRig; drawRig = function (g, u, tint) { const r0 = dr2(g, u, tint); if (!u || u.who10 !== 'momo' || tint) return r0; const f = u.face || 1;
    g.save(); for (const s of [1, -1]) { const x = u.x + f * s * 17, y = u.y - 38 + Math.sin(Game.t * 2 + s) * 1.5; g.fillStyle = '#c8b6ee'; g.beginPath(); g.arc(x, y, 5.5, 0, TAU); g.fill(); g.strokeStyle = '#6a3aa8'; g.lineWidth = 1; for (const rr of [1.5, 3, 4.5]) { g.beginPath(); g.arc(x, y, rr, 0, TAU); g.stroke(); } } g.restore(); return r0; };
  // repères de carte pour les maîtres dont on a entendu parler (rumeurs après des missions)
  const RUM = [['toad', 0, 'Rumeur : un vieux crapaud enseigne le Senjutsu au Mont Myōboku, au sud-est.'], ['bee', 2, 'Rumeur : un ninja qui rappe s’entraîne près de la Cascade, à l’est.'], ['momo', 4, 'Rumeur : d’étranges ruines au sud murmurent un nom… Momoshiki.']];
  setInterval(() => { if (!inVoie() || Game.paused || Talk.on) return; const m = me(); m.heard = m.heard || {}; m.masters = m.masters || {}; if (m.masters.bee) m.heard.altar = 1;
    for (const [id, n, line] of RUM) if (!m.heard[id] && (Voie.done || 0) >= n && Voie.step !== 'birth' && !/^a\d/.test(Voie.step)) { m.heard[id] = 1; UI.toast(T(line)); break; } }, 2500);
  const CL = { toad: ['#7fd36a', '蛙'], bee: ['#ffb13d', '八'], altar: ['#ff7a2a', '封'], momo: ['#a46bff', '輪'] };
  const bc = UI.b_carte.bind(UI); UI.b_carte = function () { bc(); const c = document.getElementById('map'); if (!c || !inVoie()) return; const m = me(), H = m.heard || {}, g = c.getContext('2d'), s = 640 / (World.k10 ? W * K10 : W);
    for (const id in CL) { if (!H[id] && !(m.masters && m.masters[id])) continue; const M = MS[id]; if (!M) continue; const x = K10 * M.x * s, y = K10 * M.y * s, [col, k] = CL[id];
      g.fillStyle = col; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.arc(x, y - 10, 9, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 5, y - 4); g.lineTo(x, y + 4); g.lineTo(x + 5, y - 4); g.fill(); g.fillStyle = INK; g.font = 'bold 11px sans-serif'; g.textAlign = 'center'; g.fillText(k, x, y - 6); } };
})();
