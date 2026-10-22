// v0.10.29 — Progression : les modes s'apprennent auprès d'un maître dans une autre ville.
// Mode Ermite : Fukasaku (Mont Myōboku) ouvre la méditation d'ermite. Z sans mode appris = rien (avant : Manteau de Kyūbi pour tout le monde).
(() => {
  const MS = { toad: { n: 'Fukasaku', where: 'Mont Myōboku (sud-est, hors des murs)', x: 3410, y: 3925, look: () => makeLook(2, { hair: '#9a9a8a', hs: 'bald', skin: '#7fae6a', vest: '#6a5a3a' }),
    lines: [['Fukasaku', 'Oh ? Un petit jeune qui grimpe jusqu’au Mont Myōboku ?'], ['Fukasaku', 'Le Senjutsu, c’est l’énergie de la nature. Si tu bouges, elle t’échappe.'], ['Fukasaku', 'Retourne au terrain d’entraînement et médite. Immobile… comme une grenouille.']], reward: 'Maître trouvé : Fukasaku — méditation d’ermite ouverte' } };
  const me = () => Voie.me, inVoie = () => Game.mode === 'voie' && me() && !Game.creative;
  const has = (id) => !!(me() && me().masters && me().masters[id]);
  const T = (s) => (window.LANG10 && LANG10.t ? LANG10.t(s) : s);
  window.MASTER10 = { MS, has, hint(id) { UI.toast(T('Il te faut un maître :') + ' ' + MS[id].n + ' — ' + T(MS[id].where)); } };
  const st = Voie.start.bind(Voie);
  Voie.start = function (sv) { const r = st(sv); if (Game.mode !== 'voie') return r; for (const id in MS) { const M = MS[id];
      Game.extras.push({ id: 'master_' + id, n: M.n, look: M.look(), x: K10 * M.x, y: K10 * M.y, r: 12, face: -1, vx: 0, vy: 0, anim: 0, isNpc: true, master10: id,
        onTalk: () => { const m = me(); if (!m) return; m.masters = m.masters || {}; if (m.masters[id]) { Talk.say([[M.n, m.sage ? 'Ton chakra naturel grandit. Continue de méditer.' : 'Alors, cette méditation ? Immobile, j’ai dit !']]); return; }
          Talk.say(M.lines, () => { m.masters[id] = 1; UI.reward(M.reward, '#7fd36a', 1); Game.save && Game.save(); }); } }); }
    return r; };
  // Z : seul un mode appris s'active en Voie (Ermite si méditation faite ; Manteau réservé aux jinchūriki)
  const en = MODE08.enter.bind(MODE08);
  MODE08.enter = function (h, key, st2) { if (key === 'Z' && inVoie() && h === Game.hero) { const m = me(); if (!(m.sage > 0) && !m.jin) { h.beastG = 0; h.beastT = 0; if (!this._z10 || Game.t - this._z10 > 3) { this._z10 = Game.t; has('toad') ? UI.toast(T('Médite au terrain d’entraînement pour éveiller le Mode Ermite')) : MASTER10.hint('toad'); } return false; } }
    return en(h, key, st2); };
})();
