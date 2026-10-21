// v0.9 — Éditeur de techniques / VFX en jeu (dans le Créatif) : réglages en direct, aperçu immédiat, export JSON.
(() => { if (!window.TECH9 || !window.CREA8) return;
  const css = document.createElement('style'); css.textContent = `#ed9{position:fixed;right:0;top:0;bottom:0;width:min(360px,94vw);z-index:26;display:none;flex-direction:column;background:linear-gradient(180deg,rgba(10,14,30,.95),rgba(20,10,30,.95));border-left:2px solid #2a3a6a;color:#e8eefc;font:12px/1.35 var(--f-body);overflow:auto}
#ed9 h2{font:400 18px var(--f-title);margin:10px 12px 4px;color:#ffd166;letter-spacing:.05em}#ed9 .row{display:flex;gap:6px;align-items:center;padding:3px 12px}#ed9 label{flex:0 0 92px;color:#93a3c6}#ed9 input[type=range]{flex:1}#ed9 output{width:42px;text-align:right;color:#ffd166}
#ed9 select,#ed9 button,#ed9 input[type=color]{background:#0e1630;color:#e8eefc;border:1px solid #3a4a7a;border-radius:8px;padding:4px 7px;font:12px var(--f-body);cursor:pointer}#ed9 .go{background:#a46bff;border-color:#a46bff}
#ed9 textarea{margin:4px 12px;height:180px;background:#070a16;color:#bfe6ff;border:1px solid #2a3a6a;border-radius:8px;font:11px/1.3 ui-monospace,monospace;resize:vertical}#ed9 textarea.bad{border-color:#ff5a5a}#ed9 .sec{margin:6px 12px 2px;color:#a46bff;font-weight:700;letter-spacing:.08em}
#ed9 .lay{display:flex;flex-wrap:wrap;gap:4px;padding:2px 12px}#ed9 .lay span{padding:2px 7px;border-radius:10px;border:1px solid #3a4a7a;background:#0e1630;cursor:pointer}#ed9 .lay span:hover{border-color:#ff5a5a;text-decoration:line-through}#ed9 .st{padding:4px 12px;color:#93a3c6}`;
  document.head.appendChild(css);
  const PH = ['charge', 'muzzle', 'travel', 'impact', 'after', 'tele'], PRIM = Object.keys(VFX9.EMIT), SHAPES = Object.keys(TECH9.HIT), BODIES = Object.keys(TECH9.BODY), ELS = ['fire', 'water', 'bolt', 'wind', 'earth', 'yin', 'yang', 'none'];
  const E = document.createElement('div'); E.id = 'ed9'; E.innerHTML = `<h2>Éditeur de techniques</h2>
<div class="row"><select id="e9id"></select><button id="e9new">＋ Nouvelle</button><button id="e9x">✕</button></div>
<div class="row"><button class="go" id="e9go">▶ Tester</button><button id="e9loop">Boucle</button><button id="e9fx">Jouer VFX</button><select id="e9ph">${PH.map((p) => `<option>${p}</option>`).join('')}</select></div>
<div class="sec">BASE</div><div class="row"><label>Élément</label><select id="e9el">${ELS.map((e) => `<option>${e}</option>`).join('')}</select><input type="color" id="e9c"></div>
<div class="row"><label>Forme</label><select id="e9sh">${SHAPES.map((e) => `<option>${e}</option>`).join('')}</select><select id="e9bd">${BODIES.map((e) => `<option>${e}</option>`).join('')}</select></div>
<div id="e9num"></div><div class="sec">COUCHES VFX</div><div id="e9lay"></div>
<div class="row"><select id="e9lp">${PH.map((p) => `<option>${p}</option>`).join('')}</select><select id="e9pr">${PRIM.map((p) => `<option>${p}</option>`).join('')}</select><button id="e9add">＋ couche</button></div>
<div class="sec">JSON</div><textarea id="e9js" spellcheck="false"></textarea>
<div class="row"><button id="e9exp">⇩ Exporter</button><button id="e9all">⇩ Tout</button><button id="e9cp">Copier</button><button id="e9sv">Sauver</button></div><div class="st" id="e9st"></div>`;
  document.body.appendChild(E);
  const $ = (s) => document.getElementById(s); let cur = null, loop = 0;
  const NUM = [['cast', 0, 1.2, 0.01], ['end', 0, 1.2, 0.01], ['cd', 0.5, 20, 0.5], ['ch', 0, 80, 1], ['hit.dmg', 1, 120, 1], ['hit.n', 1, 20, 1], ['hit.every', 0, 0.3, 0.01], ['hit.spread', 0, 1, 0.01], ['hit.jit', 0, 0.8, 0.01], ['hit.sp', 100, 1600, 10], ['hit.r', 4, 260, 1], ['hit.life', 0.1, 3, 0.05], ['hit.range', 100, 800, 10], ['hit.stun', 0, 3, 0.1], ['hit.push', 0, 1200, 10], ['hit.aoe', 0, 260, 5], ['hit.delay', 0, 2, 0.05], ['hit.wave', 0, 300, 5], ['hit.grav', -800, 1200, 10]];
  const getP = (o, k) => k.split('.').reduce((a, b) => (a ? a[b] : undefined), o); const setP = (o, k, v) => { const ks = k.split('.'); let a = o; for (let i = 0; i < ks.length - 1; i++) a = a[ks[i]] = a[ks[i]] || {}; a[ks[ks.length - 1]] = v; };
  const src = () => TECH9.src[cur]; const apply = (from) => { const s = src(); TECH9.def(s); if (from !== 'js') $('e9js').value = JSON.stringify(s, null, 2); $('e9js').classList.remove('bad'); stat(); };
  const fill = () => { const ids = Object.keys(TECH9.src); $('e9id').innerHTML = ids.map((i) => `<option value="${i}"${i === cur ? ' selected' : ''}>${TECH9.src[i].n || i}</option>`).join(''); const s = src(); if (!s) return; s.hit = s.hit || {}; s.vfx = s.vfx || {};
    $('e9el').value = s.el || 'none'; $('e9c').value = s.c || elc(s.el || 'none').slice(0, 7); $('e9sh').value = s.hit.shape || 'proj'; $('e9bd').value = s.hit.body || 'orb';
    const M = TECH9.get(cur); $('e9num').innerHTML = NUM.map(([k, a, b, st]) => { const v = getP(s, k) ?? getP(M, k) ?? 0; return `<div class="row"><label>${k.replace('hit.', '')}</label><input type="range" min="${a}" max="${b}" step="${st}" value="${v}" data-k="${k}"><output>${(+v).toFixed(st < 1 ? 2 : 0)}</output></div>`; }).join('');
    $('e9num').querySelectorAll('input').forEach((i) => (i.oninput = () => { const v = +i.value; setP(src(), i.dataset.k, v); i.nextElementSibling.textContent = v.toFixed(+i.step < 1 ? 2 : 0); apply(); }));
    lay(); $('e9js').value = JSON.stringify(s, null, 2); stat(); };
  const lay = () => { const s = src(); $('e9lay').innerHTML = PH.map((ph) => { let L = s.vfx[ph]; if (L == null) return ''; L = Array.isArray(L) ? L : [L]; return `<div class="row"><label>${ph}</label></div><div class="lay">${L.map((l, i) => `<span data-ph="${ph}" data-i="${i}" title="clic : retirer">${typeof l === 'string' ? '★ ' + l : l.fx}</span>`).join('')}</div>`; }).join('');
    $('e9lay').querySelectorAll('span').forEach((sp) => (sp.onclick = () => { const s = src(); let L = s.vfx[sp.dataset.ph]; L = Array.isArray(L) ? L : [L]; L.splice(+sp.dataset.i, 1); s.vfx[sp.dataset.ph] = L; lay(); apply(); })); };
  const stat = () => { $('e9st').textContent = `${TECH9.count} techniques en données · qualité ${Q9.names[Q9.tier]} · ${FX.P.length}/${FX.cap()} particules · ${Q9.ema.toFixed(1)} ms/image`; };
  const test = () => { CREA8.sel = cur; CREA8.v = null; document.getElementById('c8go').click(); };
  $('e9id').onchange = () => { cur = $('e9id').value; fill(); };
  $('e9el').onchange = () => { src().el = $('e9el').value; const s = src(); for (const ph of PH) if (typeof s.vfx[ph] === 'string') s.vfx[ph] = s.el + '.' + ph; else if (Array.isArray(s.vfx[ph])) s.vfx[ph] = s.vfx[ph].map((l) => (typeof l === 'string' ? s.el + '.' + l.split('.')[1] : l)); lay(); apply(); };
  $('e9c').oninput = () => { src().c = $('e9c').value; apply(); }; $('e9sh').onchange = () => { src().hit.shape = $('e9sh').value; apply(); }; $('e9bd').onchange = () => { src().hit.body = $('e9bd').value; apply(); };
  $('e9add').onclick = () => { const s = src(), ph = $('e9lp').value; let L = s.vfx[ph]; L = L == null ? [] : Array.isArray(L) ? L : [L]; L.push({ fx: $('e9pr').value, c: s.c || elc(s.el) }); s.vfx[ph] = L; lay(); apply(); };
  $('e9js').oninput = () => { try { const o = JSON.parse($('e9js').value); if (!o.id) throw 0; TECH9.src[o.id] = o; cur = o.id; apply('js'); } catch (e) { $('e9js').classList.add('bad'); } };
  $('e9go').onclick = test; $('e9loop').onclick = () => { loop = loop ? (clearInterval(loop), 0) : setInterval(test, 1700); $('e9loop').classList.toggle('go', !!loop); };
  $('e9fx').onclick = () => { const f = World.foes()[0] || Game.hero; const s = TECH9.get(cur); VFX9.play(s.vfx[$('e9ph').value] || [], f.x, f.y - 34, { a: 0, follow: null }); };
  $('e9new').onclick = () => { let n = 1; while (TECH9.src['custom' + n]) n++; const base = JSON.parse(JSON.stringify(TECH9.src[cur] || TECH9.src.teppodama)); base.id = 'custom' + n; base.n = 'Technique perso ' + n; base.glyph = '新'; delete base.variants; TECH9.def(base); cur = base.id; fill(); };
  const dl = (name, txt) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/json' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
  $('e9exp').onclick = () => dl(cur + '.json', TECH9.exportJSON(cur)); $('e9all').onclick = () => dl('techniques.json', TECH9.exportJSON());
  $('e9cp').onclick = () => { try { navigator.clipboard.writeText(TECH9.exportJSON(cur)); UI.toast('JSON copié'); } catch (e) {} };
  $('e9sv').onclick = () => { const L = Object.values(TECH9.src).filter((e) => !TECH9.BUILTIN.includes(e.id) || true); try { localStorage.setItem('tbv9_tech', JSON.stringify(L)); UI.toast('Sauvegardé'); } catch (e) {} };
  $('e9x').onclick = () => (E.style.display = 'none');
  const ED = (window.ED9 = { open(id) { cur = id || cur || TECH9.BUILTIN[0]; E.style.display = 'flex'; fill(); }, close() { E.style.display = 'none'; } });
  // bouton dans le Créatif
  const row = document.querySelector('#crea8 .ctl'); if (row) { const b = document.createElement('button'); b.id = 'c8ed'; b.textContent = '✎ Éditeur'; b.onclick = () => ED.open(CREA8.sel && TECH9.src[CREA8.sel] ? CREA8.sel : null); row.appendChild(b); }
  setInterval(() => { if (E.style.display === 'flex') stat(); }, 1000);
})();
