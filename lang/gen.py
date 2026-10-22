# Génère src/8z_lang10.js depuis lang/*.tsv (clé = texte source FR, valeur = traduction). Lancer : python3 lang/gen.py
import json,glob,os
D=os.path.dirname(os.path.abspath(__file__));T={}
for f in sorted(glob.glob(D+'/*.tsv')):
  lg=os.path.basename(f)[:-4];T[lg]={}
  for l in open(f,encoding='utf8'):
    l=l.rstrip('\n')
    if '\t' in l: a,b=l.split('\t',1);T[lg][a]=b
js='''// v0.10.5 — Langues : dialogues, objectifs et messages passent par LANG10.t (clé = texte source FR). Données : lang/*.tsv → python3 lang/gen.py
(() => {
  const DATA = %s;
  const L = window.LANG10 = { DATA, miss: new Set(), get lang() { return (Save.set && Save.set.lang) || 'en'; }, set lang(v) { Save.set.lang = v; try { Save.saveSet && Save.saveSet(); } catch (e) {} },
    tpl: {}, t(s) { if (typeof s !== 'string' || this.lang === 'fr') return s; const D = DATA[this.lang]; if (!D) return s; if (D[s] != null) return D[s];
      let P = this.tpl[this.lang]; if (!P) { P = this.tpl[this.lang] = []; for (const k in D) if (k.includes('{}')) P.push([new RegExp('^' + k.split('{}').map((x) => x.replace(/[.*+?^$()|[\\]\\\\]/g, '\\\\$&')).join('([\\\\s\\\\S]*?)') + '$'), D[k]]); }
      let first = null; for (const [re, v] of P) { const m = s.match(re); if (!m) continue; const ms = this.miss, tmp = new Set(); this.miss = tmp; let i = 1; const out = v.replace(/\\{\\}/g, () => this.t(m[i++] || '')); this.miss = ms; if (!tmp.size) return out; if (!first) first = [out, tmp]; } if (first) { for (const x of first[1]) this.miss.add(x); return first[0]; }
      if (/\\s/.test(s) && /[a-zàâçéèêëîïôûùüÿœ’]{3}/i.test(s)) this.miss.add(s); return s; } };
  const T = (s) => L.t(s);
  const tl = (lines) => lines.map((l) => Array.isArray(l) ? [T(l[0]), T(l[1])].concat(l.slice(2)) : l);
  const say = Talk.say.bind(Talk), cho = Talk.choose.bind(Talk);
  Talk.say = (lines, cb) => say(tl(lines), cb);
  Talk.choose = (lines, opts, cb) => cho(tl(lines), opts.map(T), cb);
  for (const S of [typeof Histoire !== 'undefined' && Histoire, typeof Voie !== 'undefined' && Voie]) if (S && S.obj) { const o = S.obj; S.obj = function () { const r = o.apply(this, arguments); return Array.isArray(r) ? r.map(T) : r; }; }
  if (window.UI) for (const k of ['toast', 'reward']) if (UI[k]) { const f = UI[k]; UI[k] = function (s, ...a) { return f.call(this, T(s), ...a); }; }
  // option de langue (menu pause)
  const add = () => { const m = document.getElementById('m10'); if (!m || document.getElementById('lang10')) return; const b = document.createElement('button'); b.id = 'lang10'; b.className = m.querySelector('button') ? m.querySelector('button').className : ''; const lab = () => (b.textContent = L.lang === 'fr' ? 'Langue : FR' : 'Language: EN'); lab();
    b.onclick = () => { L.lang = L.lang === 'fr' ? 'en' : 'fr'; lab(); try { UI.objective(); } catch (e) {} }; m.appendChild(b); };
  add(); setTimeout(add, 500);
})();
'''%json.dumps(T,ensure_ascii=False,indent=0)
open(D+'/../src/8z_lang10.js','w',encoding='utf8').write(js)
print({k:len(v) for k,v in T.items()})
