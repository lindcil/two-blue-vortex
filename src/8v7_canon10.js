// v0.10.28 — Canon : chaque clan a une technique avancée ET un ultime distincts (avant : Inuzuka/Senju/Yamanaka avaient le même nom pour les deux),
// Nara avancé = Kage Nui (couture des ombres), éléments corrigés (Amaterasu = feu, Shinra Tensei = yang, Hakke Kūshō = Jūken/yang).
(() => {
  if (SK.kubishibari) { SK.kubishibari.n = 'Kage Nui'; SK.kubishibari.k = '縫'; }
  const U = [['inuzuka', 'garoga', 'ult_sotoro', 'Sōtōrō : Garōga', 'wind', '狼', 'inu'], ['senju', 'jukai', 'ult_shinsu', 'Mokuton : Shinsūsenju', 'earth', '樹', 'tora'], ['yamanaka', 'shinranshin', 'ult_shinten', 'Shinten Bunshin', 'yin', '心', 'tori']];
  for (const [clan, old, id, n, el, k, sign] of U) { SK[id] = { n, el, k, ult: 1, sign }; if (ULT_FX[old]) ULT_FX[id] = ULT_FX[old]; if (typeof ULT_NAME !== 'undefined') ULT_NAME[id] = n; CLAN_ULT[clan] = id; }
  const EL = { amaterasu: 'fire', m8u_sharingan_3: 'fire', shinra: 'yang', m8_byakugan_0_1: 'yang' };
  for (const id in EL) if (SK[id]) SK[id].el = EL[id];
  const F = window.MODE08 && MODE08.F; if (F) { const a = F.sharingan && F.sharingan.st[3]; if (a) { if (a.sk[0]) a.sk[0].el = 'fire'; if (Array.isArray(a.ult)) a.ult[2] = 'fire'; } const b = F.byakugan && F.byakugan.st[0]; if (b && b.sk[1]) b.sk[1].el = 'yang'; }
})();
