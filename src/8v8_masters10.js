// v0.10.29 — Progression : les modes s'apprennent auprès d'un maître dans une autre ville.
// Mode Ermite : Fukasaku (Mont Myōboku) ouvre la méditation d'ermite. Z sans mode appris = rien (avant : Manteau de Kyūbi pour tout le monde).
(() => {
  const MS = { toad: { n: 'Fukasaku', where: 'Mont Myōboku (sud-est, hors des murs)', x: 3410, y: 3925, look: () => makeLook(2, { hair: '#9a9a8a', hs: 'bald', skin: '#7fae6a', vest: '#6a5a3a' }),
    lines: [['Fukasaku', 'Oh ? Un petit jeune qui grimpe jusqu’au Mont Myōboku ?'], ['Fukasaku', 'Le Senjutsu, c’est l’énergie de la nature. Si tu bouges, elle t’échappe.'], ['Fukasaku', 'Retourne au terrain d’entraînement et médite. Immobile… comme une grenouille.']], reward: 'Maître trouvé : Fukasaku — méditation d’ermite ouverte' } };
  const me = () => Voie.me, inVoie = () => Game.mode === 'voie' && me() && !Game.creative;
  const has = (id) => !!(me() && me().masters && me().masters[id]);
  const T = (s) => (window.LANG10 && LANG10.t ? LANG10.t(s) : s);
  window.MASTER10 = { MS, has, hint(id) { const m0 = me(); if (m0) { m0.heard = m0.heard || {}; m0.heard[id] = 1; } UI.toast(T('Il te faut un maître :') + ' ' + MS[id].n + ' — ' + T(MS[id].where)); } };
  const st = Voie.start.bind(Voie);
  Voie.start = function (sv) { const r = st(sv); if (Game.mode !== 'voie') return r; for (const id in MS) { const M = MS[id];
      Game.extras.push({ id: 'master_' + id, n: M.n, look: M.look(), altar10: M.altar ? 1 : 0, who10: id, x: K10 * M.x, y: K10 * M.y, r: 12, face: -1, vx: 0, vy: 0, anim: 0, isNpc: true, master10: id, toad10: id === 'toad' ? 1 : 0,
        onTalk: () => { const m = me(); if (!m) return; m.masters = m.masters || {}; if (M.talk) return M.talk(m); if (m.masters[id]) { Talk.say([[M.n, m.sage ? 'Ton chakra naturel grandit. Continue de méditer.' : 'Alors, cette méditation ? Immobile, j’ai dit !']]); return; }
          Talk.say(M.lines, () => { m.masters[id] = 1; UI.reward(M.reward, '#7fd36a', 1); Game.save && Game.save(); }); } }); }
    return r; };
  // Z : seul un mode appris s'active en Voie (Ermite si méditation faite ; Manteau réservé aux jinchūriki)
  const en = MODE08.enter.bind(MODE08);
  MODE08.enter = function (h, key, st2) { if (key === 'Z' && inVoie() && h === Game.hero) { const m = me(); if (!(m.sage > 0) && !m.jin && !m.karma) { h.beastG = 0; h.beastT = 0; if (!this._z10 || Game.t - this._z10 > 3) { this._z10 = Game.t; has('toad') ? UI.toast(T('Médite au terrain d’entraînement pour éveiller le Mode Ermite')) : MASTER10.hint('toad'); } return false; } }
    return en(h, key, st2); };
  // Fukasaku : un vrai petit crapaud (≈ genou du héros), de profil, cape de sage, sourcils blancs.
  const dr = drawRig; drawRig = function (g, u, tint) { if (!u || !u.toad10) return dr(g, u, tint); const f = u.face || -1, b = Math.sin(Game.t * 2.2) * 1.2, x = u.x, y = u.y;
    g.save(); g.translate(x, y); g.scale(f, 1); g.lineWidth = 2.5; g.strokeStyle = INK; g.lineJoin = 'round';
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 2, 26, 7, 0, 0, TAU); g.fill();
    g.fillStyle = '#7f9a6a'; g.beginPath(); g.ellipse(-8, -6, 14, 8, 0, 0, TAU); g.fill(); g.stroke(); // patte arrière
    g.fillStyle = '#c96a2a'; g.beginPath(); g.moveTo(-18, -34 + b); g.quadraticCurveTo(-24, -10, -14, -2); g.lineTo(10, -4); g.quadraticCurveTo(6, -24, 0, -36 + b); g.closePath(); g.fill(); g.stroke(); // cape
    g.fillStyle = '#93ad7c'; g.beginPath(); g.ellipse(2, -24 + b, 17, 15, 0, 0, TAU); g.fill(); g.stroke(); // corps
    g.fillStyle = '#e8e2c8'; g.beginPath(); g.ellipse(8, -20 + b, 9, 10, 0, 0, TAU); g.fill(); // ventre
    g.fillStyle = '#93ad7c'; g.beginPath(); g.ellipse(6, -44 + b, 17, 11, 0, 0, TAU); g.fill(); g.stroke(); // tête
    g.beginPath(); g.ellipse(14, -38 + b, 7, 3, 0.15, 0, Math.PI); g.stroke(); // bouche
    g.fillStyle = '#e8d070'; g.beginPath(); g.arc(9, -52 + b, 5.5, 0, TAU); g.fill(); g.stroke(); g.fillStyle = INK; g.fillRect(8, -53 + b, 5, 2.5); // œil
    g.strokeStyle = '#f4f1e6'; g.lineWidth = 3; g.beginPath(); g.moveTo(2, -58 + b); g.quadraticCurveTo(10, -62 + b, 18, -57 + b); g.stroke(); g.beginPath(); g.moveTo(18, -36 + b); g.quadraticCurveTo(20, -30 + b, 16, -27 + b); g.stroke(); // sourcils + barbiche
    g.strokeStyle = INK; g.lineWidth = 2.5; g.fillStyle = '#7f9a6a'; g.beginPath(); g.ellipse(16, -18 + b, 5, 8, -0.5, 0, TAU); g.fill(); g.stroke(); // bras
    g.beginPath(); g.ellipse(8, -3, 10, 4, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); };
})();
