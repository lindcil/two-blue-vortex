// v0.10.33 — Créatif (item 7) : tous les modes/paliers au choix ; techniques (y c. perso) classées auto par élément et par forme ;
// listes : jamais utilisées d'abord (pastille « nouveau »), puis les moins utilisées.
(() => { if (!window.CREA8) return; const C = CREA8, $c = (s) => document.getElementById(s); const T = (s) => (window.LANG10 && LANG10.t ? LANG10.t(s) : s);
  const MAN = { rasen: 'melee', shiden: 'melee', rappa: 'zone', bunshin: 'summon', gokakyu: 'zone', kazekiri: 'proj', suiryu: 'proj', chidori: 'melee', ganchu: 'zone', shadow: 'ctrl', palms: 'melee', expand: 'melee', mind: 'ctrl', insects: 'proj', fang: 'melee', mokuton: 'ctrl', genjutsu: 'ctrl', combo: 'summon', shinranshin: 'ctrl', garoga: 'melee', jukai: 'zone',
    suijinheki: 'support', suiro: 'ctrl', doryuheki: 'support', yomi: 'ctrl', soshuha: 'proj', kaiten: 'zone', kubishibari: 'ctrl', nikudan: 'melee', mushibunshin: 'summon', shuriken8: 'proj', kawarimi8: 'support', senpu: 'melee', dynentry: 'melee', renge: 'melee', kagebuyo: 'melee', kujaku: 'proj', hirudora: 'proj', sekizo: 'melee', kokuangyo: 'ctrl',
    narakumi8: 'ctrl', kasumi: 'ctrl', jubaku: 'ctrl', kori: 'ctrl', nemuri: 'ctrl', shukage: 'proj', hiraishin: 'support', gamabunta: 'summon', fuin: 'ctrl', daibakuha: 'zone', scalpel: 'melee', shosen: 'support', okasho: 'zone', shunshin: 'support' };
  const SHAPE = { proj: 'proj', fan: 'proj', shot: 'proj', chain: 'proj', beam: 'beam', cone: 'beam', circle: 'zone', zone: 'zone', rain: 'zone', burst: 'zone', wall: 'support', dash: 'melee', heal: 'support', mark: 'ctrl' };
  const CAT = { proj: 'Projectile', beam: 'Rayon', zone: 'Zone', melee: 'Corps à corps', ctrl: 'Contrôle', support: 'Soutien', summon: 'Invocation', ult: 'Ultime', other: 'Autre' };
  const catOf = (id) => { const S = SK[id]; if (!S) return 'other'; if (S.ult || S.m8u || S.set) return 'ult'; if (MAN[id]) return MAN[id]; const src = window.TECH9 && TECH9.src[id]; const k = (src && src.hit && src.hit.shape) || (S.m8 && S.m8.kind) || S.kind; return SHAPE[k] || 'other'; };
  // élément auto pour les techniques perso sans élément : d'après la couleur
  const hue = (hex) => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex || ''); if (!m) return null; const [r, g, b] = [1, 2, 3].map((i) => parseInt(m[i], 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.12) return mx > 0.6 ? 'yang' : 'yin'; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
  const elOf = (id) => { const S = SK[id]; let el = S && S.el; if (el && el !== 'none') return el; const src = window.TECH9 && TECH9.src[id]; const h = hue((src && src.c) || (S && S.c)); if (typeof h === 'string') return h; if (h == null) return 'yang';
    return h < 40 || h >= 330 ? 'fire' : h < 70 ? 'bolt' : h < 160 ? 'wind' : h < 250 ? 'water' : 'yin'; };
  const classify = () => { for (const id in SK) { const S = SK[id]; if (!S || !/^custom\d+/.test(id)) continue; if (!S.el || S.el === 'none') { S.el = elOf(id); S.auto10 = 1; } } };
  // utilisation
  let U = {}; try { U = JSON.parse(localStorage.getItem('tbv10_used') || '{}'); } catch (e) {}
  const use = (id) => { if (!id) return; U[id] = (U[id] || 0) + 1; try { localStorage.setItem('tbv10_used', JSON.stringify(U)); } catch (e) {} };
  for (const k of ['castSkill', 'fireSkill']) { const f = window[k]; if (typeof f !== 'function') continue; window[k] = function (u, S, id) { if (u && u.isHero && id) use(id); return f.apply(this, arguments); }; }
  const cu = castUlt; castUlt = function (u) { if (u && u.isHero) use(Game.ultId); return cu.apply(this, arguments); };
  // filtre « forme » + tri jamais-utilisées d'abord
  const flt = document.querySelector('#crea8 .flt'); const sel = document.createElement('select'); sel.id = 'c8cat'; sel.innerHTML = `<option value="">${T('Forme')}</option>` + Object.entries(CAT).map(([k, v]) => `<option value="${k}">${T(v)}</option>`).join(''); flt && flt.appendChild(sel);
  let busy = false; const post = () => { if (busy) return; const ls = $c('c8ls'); if (!ls) return; busy = true; try { classify(); const cat = sel.value; const items = [...ls.querySelectorAll('.it')];
      items.forEach((d, i) => { d.__i = i; const id = d.dataset.id; d.style.display = cat && catOf(id) !== cat ? 'none' : ''; if (!d.querySelector('.nw10') && !U[id]) { const s = document.createElement('b'); s.className = 'nw10'; s.textContent = '●'; s.title = T('Jamais utilisée'); s.style.cssText = 'color:#7fd36a;font-size:9px;margin-left:auto'; d.appendChild(s); } d.title = T(CAT[catOf(id)]) + ' · ' + (U[id] ? U[id] + '×' : T('Jamais utilisée')); });
      if (cat) { const ct = $c('c8ct'); if (ct) ct.textContent = ct.textContent.replace(/^\d+/, String(items.filter((d) => d.style.display !== 'none').length)); }
      items.sort((a, b) => (U[a.dataset.id] || 0) - (U[b.dataset.id] || 0) || a.__i - b.__i).forEach((d) => ls.appendChild(d)); } finally { setTimeout(() => (busy = false), 0); } };
  sel.onchange = post; new MutationObserver(() => post()).observe(document.getElementById('c8ls'), { childList: true });
  // élément : les filtres d'élément voient aussi l'élément auto des perso
  // modes : choix libre famille + palier
  const box = document.createElement('div'); box.className = 'ctl'; box.id = 'c8md';
  const fams = () => Object.keys(MODE08.F || {}); const stN = (f) => (MODE08.F[f].st || []).length;
  box.innerHTML = `<select id="c8mf"></select><select id="c8ms"></select><button id="c8mg">${T('Entrer en mode')}</button><button id="c8mx">${T('Sortir du mode')}</button>`;
  const ctl = document.querySelectorAll('#crea8 .ctl'); (ctl[1] || ctl[0]).after(box);
  const fill = () => { const mf = $c('c8mf'); if (!mf.options.length) mf.innerHTML = fams().map((f) => `<option value="${f}">${T(MODE08.F[f].n)}</option>`).join(''); const n = stN(mf.value); $c('c8ms').innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}">★${i + 1} ${T(MODE08.F[mf.value].st[i].n || '')}</option>`).join(''); };
  setTimeout(fill, 0); $c('c8mf').onchange = fill;
  $c('c8mg').onclick = () => { const h = Game.hero; if (!h) return; const f = $c('c8mf').value, st = +$c('c8ms').value || 1; if (h.md) MODE08.exit(h); MODE08.enter(h, MODE08.F[f].key || 'Z'); if (h.md) { h.md.fam = f; h.md.key = MODE08.F[f].key || h.md.key; h.md.st = 0; MODE08.stage(h, st); } use('mode_' + f); };
  $c('c8mx').onclick = () => { const h = Game.hero; if (h && h.md) MODE08.exit(h); };
  window.CREA10 = { catOf, elOf, U, post };
})();
