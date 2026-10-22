// v0.10.28 — Canon : chaque clan a une technique avancée ET un ultime distincts (avant : Inuzuka/Senju/Yamanaka avaient le même nom pour les deux),
// Nara avancé = Kage Nui (couture des ombres), éléments corrigés (Amaterasu = feu, Shinra Tensei = yang, Hakke Kūshō = Jūken/yang).
(() => {
  if (SK.kubishibari) { SK.kubishibari.n = 'Kage Nui'; SK.kubishibari.k = '縫'; }
  const U = [['inuzuka', 'garoga', 'ult_sotoro', 'Sōtōrō : Garōga', 'wind', '狼', 'inu'], ['senju', 'jukai', 'ult_shinsu', 'Mokuton : Shinsūsenju', 'earth', '樹', 'tora'], ['yamanaka', 'shinranshin', 'ult_shinten', 'Shinten Bunshin no Jutsu', 'yin', '心', 'tori']];
  for (const [clan, old, id, n, el, k, sign] of U) { SK[id] = { n, el, k, ult: 1, sign }; if (ULT_FX[old]) ULT_FX[id] = ULT_FX[old]; if (typeof ULT_NAME !== 'undefined') ULT_NAME[id] = n; CLAN_ULT[clan] = id; }
  const EL = { amaterasu: 'fire', m8u_sharingan_3: 'fire', shinra: 'yang', m8_byakugan_0_1: 'yang' };
  for (const id in EL) if (SK[id]) SK[id].el = EL[id];
  const F = window.MODE08 && MODE08.F; if (F) { const a = F.sharingan && F.sharingan.st[3]; if (a) { if (a.sk[0]) a.sk[0].el = 'fire'; if (Array.isArray(a.ult)) a.ult[2] = 'fire'; } const b = F.byakugan && F.byakugan.st[0]; if (b && b.sk[1]) b.sk[1].el = 'yang'; }
  // v0.10.30 : doublons retirés — un seul foyer par technique.
  // Chidori Eisō → arbre Sharingan (Sasuke) ; Hakke Kūshō → arbre Byakugan ; Nikudan Sensha → technique avancée Akimichi (le mode prend Bubun Baika).
  const GONE = { eiso: 'chidori', kusho: 'kaiten' };
  for (const id in GONE) { if (window.TREE8 && TREE8.REQ) delete TREE8.REQ[id]; }
  const ak = F && F.akimichi && F.akimichi.st[0]; if (ak && ak.sk[1]) ak.sk[1].n = 'Bubun Baika'; if (SK.m8_akimichi_0_1) { SK.m8_akimichi_0_1.n = 'Bubun Baika'; delete SK.m8_akimichi_0_1.n_fr; }
  const mig = () => { const m = Voie.me; if (!m) return; const sw = (a) => a && a.forEach((v, i) => { if (GONE[v]) a[i] = a.includes(GONE[v]) ? null : GONE[v]; });
    sw(m.known); if (m.known) m.known = m.known.filter(Boolean); if (Game.mode === 'voie') { sw(Game.skills); Game.skills = Game.skills.map((v) => v || 'bunshin'); } };
  const st = Voie.start.bind(Voie); Voie.start = function (sv) { const r = st(sv); try { mig(); } catch (e) {} return r; };
  window.CANON10 = { GONE, mig };
  // v0.10.42 — Shinten Bunshin no Jutsu (canon : Mind Clone Switch) : l’esprit se divise et prend plusieurs corps à la fois ; les cibles se frappent entre elles.
  if (typeof ULT_FX !== 'undefined') ULT_FX.ult_shinten = (u, tx, ty, P) => { const T = World.foes().filter((f) => !f.passive && Math.hypot(f.x - u.x, f.y - u.y) < 440);
    for (const f of T) { V.mindBeam && V.mindBeam(u, f); f.stun = 2.5; f.st = f.st || {}; f.st.stun = 2.5; hurt(f, 45 * P, u, { el: 'yin', big: 1 }); }
    for (const f of T) { const o = T.filter((x) => x !== f).sort((a, b) => Math.hypot(a.x - f.x, a.y - f.y) - Math.hypot(b.x - f.x, b.y - f.y))[0]; if (o) Game.later(0.6, () => { FX.glow(o.x, o.y - 40, '#c08ae8', 60, 0.3); hurt(o, 25 * P, u, { el: 'yin' }); }); }
    if (T.length === 1) Game.later(0.6, () => hurt(T[0], 20 * P, u, { el: 'yin' })); Game.impact(tx, ty, 0.12); };
})();
