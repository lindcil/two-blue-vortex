// v0.10.3 — Animations faites main des techniques de mode (Sharingan, Byakugan, Jōgan, Kāma, Ermite…) : anticipation → frappe → suite.
(() => {
  const k = (t, p) => [t, p];
  // poses de base (écarts au STANCE)
  const P = {
    eye: { head: -0.25, aF: 1.9, eF: 2.6, aB: 0.3, lean: -0.05 },            // main au visage (dōjutsu)
    sign: { aF: 1.3, eF: 2.7, aB: 1.2, eB: 2.6, lean: 0.05, by: 2 },        // mudrā
    coil: { lean: -0.25, aF: -0.6, eF: 1.4, aB: 1.3, by: 6, hF: 0.6, kF: -1, sy: 0.92, sx: 1.06 },
    thrust: { lean: 0.5, aF: 1.6, eF: 0.1, aB: -0.6, hF: 0.7, kF: -0.2, hB: -0.7, sx: 0.94, sy: 1.06 },
    palm: { lean: 0.45, aF: 1.55, eF: 0.15, aB: 1.5, eB: 0.2, hF: 0.6, hB: -0.6, by: 4 },
    spread: { aF: 2.6, eF: 0.3, aB: 2.5, eB: 0.3, head: -0.15, lean: -0.1, by: -2 },
    low: { by: 12, lean: 0.35, hF: 1.1, kF: -1.6, hB: -0.9, kB: -1.2, aF: 0.2, aB: -0.5, sy: 0.9, sx: 1.08 },
    sky: { aF: 3.0, eF: 0.1, aB: 0.6, head: -0.4, lean: -0.2, by: -4, sy: 1.08, sx: 0.95 },
    slam: { aF: 0.4, eF: 0.1, aB: 0.3, eB: 0.1, lean: 0.6, by: 10, hF: 0.9, kF: -1.3, sy: 0.88, sx: 1.1 },
    guard: { aF: 2.0, eF: 2.4, aB: 1.9, eB: 2.4, lean: -0.05, by: 5, hF: 0.5, kF: -0.9, hB: -0.5, kB: -0.9 },
    point: { aF: 1.7, eF: 0.05, aB: 0.2, eB: 1.2, head: 0.05, lean: 0.15 },
    spin: { rot: 0.5, aF: 2.4, eF: 0.4, aB: -2.2, eB: 0.4, by: 4, hF: 0.6, kF: -0.8 },
  };
  const m = (a, b) => ({ ...a, ...b });
  // chaque genre : [anticipation, (pic), frappe] + suite séparée
  const KIND = {
    shot: { pre: [k(0, P.sign), k(0.55, P.coil), k(0.9, m(P.coil, { lean: -0.35, by: 8 })), k(1, P.thrust)], post: [k(0, P.thrust), k(0.5, m(P.thrust, { lean: 0.6, eF: 0.3 })), k(1, {})] },
    fan: { pre: [k(0, P.coil), k(0.7, m(P.coil, { aF: -1.4, eF: 2.4, rot: -0.12 })), k(1, m(P.thrust, { aF: 2.2, rot: 0.15 }))], post: [k(0, m(P.thrust, { rot: 0.15 })), k(0.4, m(P.thrust, { aF: 0.8, rot: 0.1 })), k(1, {})] },
    burst: { pre: [k(0, P.sign), k(0.6, P.guard), k(0.92, m(P.guard, { sy: 0.85, sx: 1.12, by: 10 })), k(1, P.spread)], post: [k(0, P.spread), k(0.45, m(P.spread, { by: 2 })), k(1, {})] },
    zone: { pre: [k(0, P.eye), k(0.7, m(P.eye, { head: -0.35, by: 3 })), k(1, P.point)], post: [k(0, P.point), k(0.6, m(P.point, { aF: 1.4 })), k(1, {})] },
    beam: { pre: [k(0, P.sign), k(0.5, m(P.coil, { aB: 1.6, eB: 1.9 })), k(0.9, m(P.coil, { lean: -0.4, by: 9 })), k(1, P.palm)], post: [k(0, P.palm), k(0.6, m(P.palm, { lean: 0.55, by: 6 })), k(1, {})] },
    dash: { pre: [k(0, P.low), k(0.8, m(P.low, { by: 15, lean: 0.55 })), k(1, m(P.thrust, { lean: 0.75 }))], post: [k(0, m(P.slam, { lean: 0.4 })), k(0.5, m(P.low, { by: 6 })), k(1, {})] },
    mark: { pre: [k(0, P.eye), k(0.75, m(P.eye, { aF: 2.1, head: -0.3 })), k(1, P.point)], post: [k(0, P.point), k(0.5, m(P.point, { head: 0.1 })), k(1, {})] },
    rain: { pre: [k(0, P.sign), k(0.6, m(P.sky, { by: 4, sy: 0.94 })), k(1, P.sky)], post: [k(0, P.sky), k(0.5, m(P.slam, { lean: 0.3 })), k(1, {})] },
    heal: { pre: [k(0, P.sign), k(0.7, m(P.sign, { by: 5, sy: 0.95 })), k(1, P.guard)], post: [k(0, P.guard), k(0.6, m(P.guard, { by: 2 })), k(1, {})] },
  };
  // signatures (nom canon → poses propres)
  const SIG = {
    'Katon : Gōkakyū': { pre: [k(0, P.sign), k(0.6, m(P.sign, { lean: -0.3, by: -3, head: -0.2, sy: 1.05 })), k(1, m(P.thrust, { aF: 1.3, eF: 2.6, head: 0.2, mouth: 1 }))], post: [k(0, m(P.thrust, { mouth: 1, aF: 1.3, eF: 2.6 })), k(0.7, m(P.thrust, { mouth: 0.6 })), k(1, {})] },
    'Amaterasu': { pre: [k(0, P.eye), k(0.85, m(P.eye, { head: -0.45, by: 4, sy: 0.96 })), k(1, m(P.eye, { head: 0.15, aF: 2.3 }))], post: [k(0, m(P.eye, { head: 0.1 })), k(0.7, P.eye), k(1, {})] },
    'Tsukuyomi': { pre: [k(0, P.eye), k(1, m(P.point, { head: 0.2, aF: 0.4, eF: 0.2 }))], post: [k(0, { head: 0.2, lean: -0.1 }), k(1, {})] },
    'Kamui': { pre: [k(0, P.eye), k(0.7, m(P.spread, { head: -0.3 })), k(1, m(P.eye, { aF: 2.2, rot: -0.1 }))], post: [k(0, m(P.eye, { rot: -0.1 })), k(1, {})] },
    'Chidori Nagashi': { pre: [k(0, P.low), k(0.85, m(P.low, { aF: -0.5, eF: 0.2, aB: 0.3 })), k(1, m(P.spread, { by: 8, sy: 0.9 }))], post: [k(0, m(P.spread, { by: 8 })), k(1, {})] },
    'Chidori Eisō': { pre: [k(0, m(P.coil, { aF: -1.2, eF: 0.4 })), k(0.9, m(P.coil, { aF: -1.6, lean: -0.45 })), k(1, m(P.thrust, { aF: 1.6, eF: 0, lean: 0.7 }))], post: [k(0, m(P.thrust, { lean: 0.7 })), k(1, {})] },
    'Kirin': { pre: [k(0, P.sign), k(0.9, m(P.sky, { aB: 0.2 })), k(1, m(P.slam, { aF: 1.0, eF: 0.05, lean: 0.4 }))], post: [k(0, m(P.slam, { aF: 1.0, lean: 0.4 })), k(1, {})] },
    'Kaiten': { pre: [k(0, P.guard), k(0.4, m(P.spin, { rot: -0.6 })), k(0.75, m(P.spin, { rot: 0.6 })), k(1, m(P.spread, { rot: 0 }))], post: [k(0, P.spread), k(1, {})] },
    'Jūken': { pre: [k(0, m(P.low, { aF: 0.6, eF: 0.2, aB: 1.5, eB: 0.1 })), k(1, m(P.palm, { aF: 1.6, eF: 0, lean: 0.7 }))], post: [k(0, P.palm), k(1, {})] },
    'Hakke Kūshō': { pre: [k(0, P.low), k(0.85, m(P.coil, { aF: -0.2, eF: 0.3 })), k(1, m(P.palm, { aB: 0.2, eB: 1.2, lean: 0.65 }))], post: [k(0, m(P.palm, { lean: 0.65 })), k(1, {})] },
    'Hakke 128 Shō': { pre: [k(0, P.low), k(0.6, m(P.palm, { aB: 1.8 })), k(0.8, m(P.palm, { aF: 1.0, aB: 1.6 })), k(1, m(P.palm, { aF: 1.7 }))], post: [k(0, P.palm), k(0.5, m(P.low, { by: 6 })), k(1, {})] },
    'Rasengan invisible': { pre: [k(0, m(P.coil, { aB: 1.6, eB: 1.0, aF: 1.4, eF: 1.1 })), k(0.9, m(P.coil, { aF: 1.4, eF: 1.1, lean: -0.3 })), k(1, m(P.thrust, { aF: 1.5, eF: 0.4 }))], post: [k(0, P.thrust), k(1, {})] },
    'Épée de Totsuka': { pre: [k(0, m(P.coil, { aF: -2.2, eF: 0.4 })), k(0.85, m(P.coil, { aF: -2.6, lean: -0.4 })), k(1, m(P.slam, { aF: 1.4 }))], post: [k(0, m(P.slam, { aF: 1.4 })), k(1, {})] },
  };
  // saveur par famille (par-dessus le genre)
  const FAM = { sharingan: { head: -0.05 }, byakugan: { lean: 0.05, hF: 0.15 }, jogan: { head: -0.08 }, karma: { by: 2, sx: 1.03 }, sage: { by: 4, hF: 0.2, kF: -0.4 } };
  const DUR = { shot: 0.36, fan: 0.32, burst: 0.44, zone: 0.4, beam: 0.42, dash: 0.3, mark: 0.36, rain: 0.42, heal: 0.4 };
  const flav = (K, f) => f ? K.map(([t, p]) => [t, { ...f, ...p }]) : K;
  const animOf = (S) => { const d = S.m8; if (!d) return null; const A = SIG[d.n || S.n] || KIND[d.kind]; if (!A) return null; const f = FAM[d.fam]; return { pre: flav(A.pre, f), post: flav(A.post, f), dur: DUR[d.kind] || 0.36 }; };
  // famille de chaque compétence de mode
  if (window.MODE08) for (const id in SK) { const m8 = id.match(/^m8_([a-z]+)_/); if (m8 && SK[id].m8) SK[id].m8.fam = m8[1]; }
  const cs = castSkill; castSkill = function (u, S, id, isHero) { const r = cs(u, S, id, isHero); if (S && S.m8 && u.act && u.act.k === 'cast' && u.act.S === S) { const A = animOf(S); if (A) { u.act.dur = A.dur; u.act.pose10 = A.pre; } } return r; };
  const fs = fireSkill; fireSkill = function (u, S, id) { const r = fs(u, S, id); if (S && S.m8 && u.act && u.act.k === 'cast' && u.act.S === S && u.act.pose10) { const A = animOf(S); if (A) u.act = { k: 'cast', S, id, t: 0, dur: 0.24, fired: true, pose10: A.post }; u.sq = 0.18; } return r; };
  window.MODEANIM10 = { KIND, SIG, animOf };
})();
