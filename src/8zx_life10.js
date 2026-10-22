// v0.10.37 — Vie de shinobi : répliques selon l'heure, Ichiraku, maison (dormir), entraînement, boutiques, routines jour/nuit des PNJ.
(() => {
  const T = (s) => LANG10.t(s);
  const per = () => { const t = World.time; return t < 5 || t >= 21 ? 3 : t < 11 ? 0 : t < 17 ? 1 : 2; }; // matin, jour, soir, nuit
  const LN = {
    teuchi: [['Le bouillon mijote depuis l’aube. Reviens à midi !'], ['Miso chashu ? Ou le spécial « Naruto » ?', 'Ayame dit que je mets trop de naruto. Impossible.'], ['Dernier service ! Un bol avant de rentrer ?'], []],
    ino: [['Les fleurs du matin tiennent plus longtemps.'], ['Tu as l’air de quelqu’un qui a besoin de fleurs.', 'Un bouquet pour Sakura ? Elle adore les cerisiers… bien sûr.'], ['Je ferme. Inojin, rentre dîner !'], []],
    kotetsu: [['Encore une journée à la porte…'], ['Izumo, on fait une pause ? …Non ? Bon.'], ['Les voyageurs du soir, c’est toujours les pires.'], ['Pas un bruit. J’aime pas quand c’est calme.']],
    izumo: [['Registre du matin : personne. Parfait.'], ['Laissez-passer ? Montre-le, que je le tamponne.'], ['Kotetsu a encore mangé mon onigiri.'], ['Kotetsu dort debout. Ne lui dis rien.']],
    haru: [['On est en retard pour l’Académie !'], ['Iruka-sensei nous a encore donné des clones à faire !'], ['Maman m’appelle. À demain !'], []],
    mei: [['J’ai révisé les mudras toute la nuit !'], ['Shikadai a dormi pendant tout le cours. Encore.'], ['Tu veux voir mon lancer de kunai ? Regarde !'], []],
    taro: [['J’ai pas pris mon petit-déj. Ichiraku, ça compte ?'], ['Un jour je battrai Boruto. Un jour.'], ['Course jusqu’à la stèle ! Le dernier paie les ramens !'], []],
    gen: [['Le matin, le village sent le pain et la sueur.'], ['À midi, Ichiraku. Comme le Septième à ton âge.'], ['Les visages du rocher rougissent au couchant. Regarde.'], []],
    smith: [['J’affûte depuis l’aube. Tu veux voir ?'], ['Lames, kunais, rouleaux. Pas de crédit.'], ['Je ferme bientôt. Achète vite ou reviens demain.'], []],
    guard3: [['Ronde du matin. Rien à signaler.'], ['Circulez. Ordre du Huitième.'], ['Les lanternes s’allument. Restez sur les rues.'], ['Il est tard, gamin. Rentre chez toi.']],
    vend1: [['Les premiers dango sortent du feu !'], ['Dango tout chauds ! Trois pour le prix de deux !'], ['Les derniers de la journée, à moitié prix !'], []],
    vend2: [['Il fait déjà chaud. Belle journée pour ne rien faire.'], ['Tu as entendu ? Code aurait été vu au nord.'], ['Je file chez Ichiraku avant la fermeture.'], []],
  };
  // Routines : déjeuner chez Ichiraku, sortie d'Académie, soirée.
  const SC = { gen: [[12, 14, 1255, 935]], ino: [[12, 13, 1325, 935]], vend2: [[18, 21, 1300, 940]], haru: [[15, 20, 2780, 1300]], taro: [[15, 20, 2840, 1320]], mei: [[15, 20, 2800, 1350]], smith: [[13, 14, 1270, 940]] };
  for (const d of NPC_DEF) if (SC[d.id]) d.sched.unshift(...SC[d.id].map(([a, b, x, y]) => [a, b, K10 * x, K10 * y]));
  const H = () => Game.hero, R = () => Game.ryo || 0;
  const pay = (n) => { if (R() < n) { Talk.say([['', 'Pas assez de ryō.']]); return false; } Game.ryo -= n; return true; };
  const pass = (h) => { World.time += h; while (World.time >= 24) { World.time -= 24; World.day++; } };
  const ok = (s) => FX.text(H().x, H().y - 120, T(s), '#9fe8a0', 18, 1);
  const shop = { teuchi: [['Manger un bol (30 ryō)', () => { if (!pay(30)) return; const h = H(); h.hp = h.maxHp; h.ch = h.maxCh; pass(0.5); ok('Rassasié'); Talk.say([['Teuchi', pick(['Un grand bol, avec supplément œuf. Ça va mieux ?', 'Mange lentement. Le bouillon a mis toute la nuit.', 'Naruto en prenait trois. Toi, un, c’est bien.'])]]); }]],
    vend1: [['Dango (15 ryō)', () => { if (!pay(15)) return; const h = H(); h.hp = Math.min(h.maxHp, h.hp + h.maxHp * 0.35); ok('Dango !'); }]],
    smith: [['Pilule du soldat (60 ryō)', () => { if (!pay(60)) return; H().ch = H().maxCh; ok('Chakra plein'); }], ['Bandages (40 ryō)', () => { if (!pay(40)) return; const h = H(); h.hp = Math.min(h.maxHp, h.hp + h.maxHp * 0.5); ok('Soigné'); }], ['Rouleau d’étude (120 ryō)', () => { if (!pay(120)) return; Game.gainXp(150); }]],
    ino: [['Bouquet (25 ryō)', () => { if (!pay(25)) return; Talk.say([['Ino', 'Bon choix. Les fleurs disent ce qu’on n’ose pas.']]); }]] };
  const base = Voie.talkNpc.bind(Voie);
  Voie.talkNpc = function (n) {
    const L = (LN[n.id] || [])[per()] || []; n.li = (n.li || 0) + 1; const line = L.length && n.li % 3 ? L[n.li % L.length] : null;
    const S = shop[n.id]; if (!line && !S) return base(n);
    const say = line || (L.length ? pick(L) : pick(LN[n.id] ? LN[n.id].flat() : ['…']));
    if (!S) return Talk.say([[n.n, say]]);
    Talk.choose([[n.n, say]], S.map((x) => x[0]).concat(['Au revoir']), (i) => { if (S[i]) S[i][1](); });
  };
  // Lieux de vie : maison (dormir) et terrain d'entraînement.
  const homeXY = () => { const P = World.props.filter((p) => p.kind === 'house' && !p.label && p.x < K10 * 1500 && p.y < K10 * 2100).sort((a, b) => Math.hypot(a.x - K10 * 800, a.y - K10 * 1250) - Math.hypot(b.x - K10 * 800, b.y - K10 * 1250))[0]; return P ? [P.x, P.y + K10 * 50] : [K10 * 800, K10 * 1300]; };
  const fade = (f) => (window.ZONE8 && ZONE8.wipe ? ZONE8.wipe(f) : f());
  const life = () => { const [hx, hy] = homeXY(); return [{ id: 'home10', x: hx, y: hy, n: 'Maison — se reposer' }, { id: 'train10', x: K10 * 2850, y: K10 * 1250, n: 'Terrain d’entraînement — s’entraîner' }]; };
  const gi = Game.interactables.bind(Game);
  Game.interactables = function () { const r = gi(); if (this.mode !== 'voie' || this.inCombat() || document.body.classList.contains('bg10')) return r; const h = this.hero; let best = r; for (const p of life()) { const d = Math.hypot(p.x - h.x, p.y - h.y); if (d < 90 && (!best || d < best.d)) best = { d, k: 'poi', o: p, s: p.n }; } return best; };
  const up = Game.usePoi.bind(Game);
  Game.usePoi = function (p) {
    const h = this.hero;
    if (p.id === 'home10') { const night = World.time >= 19 || World.time < 6;
      return Talk.choose([['', night ? 'La maison. Le futon t’attend.' : 'La maison. Calme, pour une fois.']], [night ? 'Dormir jusqu’au matin' : 'Faire une sieste (2 h)', 'Partir'], (i) => { if (i) return; fade(() => { if (night) { if (World.time >= 19) World.day++; World.time = 7; } else pass(2); h.hp = h.maxHp; h.ch = h.maxCh; try { Game.save(); } catch (e) {} }); Talk.say([['', night ? 'Une nuit sans rêves. Nouveau jour à Konoha.' : 'Une courte sieste. Tu te sens reposé.']]); }); }
    if (p.id === 'train10') return Talk.choose([['', 'Le terrain d’entraînement. Les poteaux portent encore des entailles.']], ['Lancer de kunais (1 h)', 'Marcher sur l’arbre (2 h)', 'Méditer (1 h)', 'Partir'], (i) => { if (i > 2) return; fade(() => { pass([1, 2, 1][i]); if (i === 0) Game.gainXp(60); if (i === 1) { Game.gainXp(140); h.ch = 0; } if (i === 2) h.ch = h.maxCh; }); Talk.say([['', ['Dix kunais, dix cibles. Presque.', 'Le chakra aux pieds… et tu tiens au sommet !', 'Respire. Le chakra circule mieux.'][i]]]); });
    if (p.id === 'ichiraku' && this.mode === 'voie') { const t = World.npcs.find((n) => n.id === 'teuchi' && !n.hidden); if (t) return Voie.talkNpc(Object.assign(t, { li: 2 })); }
    return up(p);
  };
  window.LIFE10 = { per, homeXY, life, LN };
})();
