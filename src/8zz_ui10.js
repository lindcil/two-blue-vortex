// v0.10.20 — Interface en anglais par défaut : menus HTML (observateur DOM) + noms de techniques / modes / ultimes (FR via l'option de langue)
(() => { if (!window.LANG10) return; const L = LANG10;
  const tr = (s) => { if (L.lang === 'fr') return s; const D = L.DATA[L.lang] || {}; return D[s] != null ? D[s] : s; };
  const trUI = (s) => { if (L.lang === 'fr') return s; const D = L.DATA[L.lang] || {}; if (D[s] != null) return D[s]; const m = s.match(/^([\u3000-\u9fff]+) (.+)$/); if (m) return m[1] + ' ' + trUI(m[2]); const v = L.t(s); if (v !== s || !s.includes(' · ')) return v; return s.split(' · ').map((x) => L.t(x)).join(' · '); };
  // noms de techniques (dessinés sur le canvas) : on garde le FR d'origine dans n_fr
  const names = () => { for (const k in SK) { const S = SK[k]; if (!S || typeof S.n !== 'string') continue; if (S.n_fr == null) S.n_fr = S.n; S.n = tr(S.n_fr); }
    if (window.ULT_NAME) for (const k in ULT_NAME) { ULT_NAME.__fr = ULT_NAME.__fr || {}; if (ULT_NAME.__fr[k] == null) ULT_NAME.__fr[k] = ULT_NAME[k]; ULT_NAME[k] = tr(ULT_NAME.__fr[k]); }
    if (window.MODE08 && MODE08.F) for (const f in MODE08.F) for (const st of MODE08.F[f].st || []) { if (st.n_fr == null) st.n_fr = st.n; if (typeof st.n_fr === 'string') st.n = tr(st.n_fr); } };
  // textes HTML : chaque nœud texte garde sa version FR
  const node = (n) => { const raw = n.__fr != null ? n.__fr : n.textContent, t = raw.trim(); if (!t) return; const v = trUI(t); if (v === t && n.__fr == null) return; if (n.__fr == null) n.__fr = raw; const out = raw.replace(t, v); if (n.textContent !== out) n.textContent = out; };
  const walk = (el) => { if (!el) return; if (el.nodeType === 3) return node(el); if (el.nodeType !== 1 || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return; if (el.placeholder) { el.__ph = el.__ph || el.placeholder; el.placeholder = tr(el.__ph); } for (const c of el.childNodes) walk(c); };
  let busy = 0; const mo = new MutationObserver((ms) => { if (busy) return; busy = 1; try { for (const m of ms) { if (m.type === 'characterData') node(m.target); else for (const a of m.addedNodes) walk(a); } } finally { busy = 0; } });
  const all = () => { busy = 1; try { names(); walk(document.body); } finally { busy = 0; } };
  L.refresh = all; all(); mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  // bascule de langue : retraduit tout
  const hook = () => { const b = document.getElementById('lang10'); if (!b || b.__h) return; b.__h = 1; b.addEventListener('click', () => setTimeout(all, 0)); }; hook(); setInterval(hook, 1000);
})();
