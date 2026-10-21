// v0.7 — Commandes : A / clic droit = dash, Z = charge de mode (bête), C = charge de chakra, puis au-delà du max → dōjutsu / mode de clan.
(() => {
  const DOJ = { uchiha: ['Sharingan', '#d0283a'], hyuga: ['Byakugan', '#e8e8f8'], nara: ['Ombre éveillée', '#9b8cff'], akimichi: ['Mode Papillon', '#ffb13d'], yamanaka: ['Esprit ouvert', '#f49ac1'], aburame: ['Ruche éveillée', '#9fd36a'], inuzuka: ['Instinct bestial', '#d8c8a0'], senju: ['Sage du bois', '#7ad07a'] };
  const dojOf = () => (Game.mode === 'voie' && Voie.me ? DOJ[Voie.me.clan] || ['Éveil', '#a46bff'] : ['Jōgan', '#8fd3ff']);
  window.CTRL07 = { DOJ, dojOf };
  // jauges
  const css = document.createElement('style'); css.textContent = `#g07{position:fixed;left:50%;bottom:calc(150px * var(--ts));transform:translateX(-50%);display:none;gap:8px;z-index:6;pointer-events:none;font:700 11px var(--f-title);letter-spacing:.06em}
#g07 .g{width:120px;height:9px;border:2px solid #0b1020;border-radius:6px;background:rgba(11,16,32,.6);overflow:hidden;position:relative}#g07 .g i{position:absolute;inset:0;width:0;transition:width .08s}#g07 label{display:block;color:#e8eefc;text-shadow:0 1px 0 #000;text-align:center;margin-bottom:2px}
#lay07{position:fixed;inset:0;z-index:60;background:rgba(6,10,22,.92);display:flex;align-items:center;justify-content:center}#lay07 .b2{background:#0e1630;border:3px solid #0b1020;border-left:6px solid var(--vortex,#3aa0ff);border-radius:14px;padding:22px 26px;max-width:560px;color:#e8eefc;font:16px/1.4 var(--f-body)}#lay07 h2{font:400 24px var(--f-title);margin:0 0 8px}#lay07 button{margin:8px 8px 0 0}
#touch .tb.t07{font-size:15px}`; document.head.appendChild(css);
  const gd = document.createElement('div'); gd.id = 'g07'; gd.innerHTML = '<div><label id="g07a">Chakra</label><div class="g"><i id="g07ai" style="background:#4aa8ff"></i></div></div><div><label id="g07b">Mode</label><div class="g"><i id="g07bi" style="background:#ffb13d"></i></div></div>'; document.body.appendChild(gd);
  const aura = (u, c, n, r) => { if (Save.set.low && Math.random() < 0.6) return; for (let i = 0; i < n; i++) { const a = rnd(0, TAU); FX.add({ k: 'spark', x: u.x + Math.cos(a) * r, y: u.y - rnd(0, 70), vx: rnd(-20, 20), vy: rnd(-160, -60), c, s: rnd(2, 4), life: rnd(0.3, 0.6), g: -60 }); } };
  const up = Game.update.bind(Game);
  Game.update = function (dt) { const r = up(dt); const h = this.hero; if (!h || !this.running || this.paused) return r; const d = dt || 0;
    h.over = h.over || 0; h.beastG = h.beastG || 0; h.dojT = Math.max(0, (h.dojT || 0) - d); h.beastT = Math.max(0, (h.beastT || 0) - d);
    const free = !this.cine && h.hp > 0 && !(window.Scene && Scene.on);
    const chg = free && Input.is('charge') && !h.act, mod = free && Input.is('mode') && !h.act && !h.beastT;
    h.charging = chg || mod;
    if (chg) { this.hint('mode'); h.vx *= 0.3; h.vy *= 0.3; if (h.ch < h.maxCh) { h.ch = Math.min(h.maxCh, h.ch + 55 * d); aura(h, '#6ec0ff', 2, 18); }
      else if (!h.dojT) { h.over = Math.min(100, h.over + 38 * d); aura(h, h.over > 50 ? '#a46bff' : '#ffd166', 3, 22); if (h.over >= 100 && window.MODE08) { h.over = 0; MODE08.enter(h, 'C'); } else if (h.over >= 100) { h.over = 0; h.dojT = 14; const [n, c] = dojOf(); h.eyeFx = c; UI.reward(n, c); FX.ring(h.x, h.y - 40, c, 20, 160, 0.5); FX.shock(h.x, h.y, c, 140, 0.5, 8); Sfx.play('tech'); this.stat && this.stat('mode'); } } }
    else h.over = Math.max(0, h.over - 20 * d);
    if (mod) { h.vx *= 0.3; h.vy *= 0.3; h.beastG = Math.min(100, h.beastG + 30 * d); aura(h, h.beastG > 60 ? '#ff7a2a' : '#ffb13d', 3, 20); if (h.beastG >= 100 && window.MODE08) { h.beastG = 0; MODE08.enter(h, 'Z'); } else if (h.beastG >= 100) { h.beastG = 0; h.beastT = 12; UI.reward('Manteau de chakra', '#ff9a2a'); FX.shock(h.x, h.y, '#ff9a2a', 160, 0.5, 9); Cam.shake(0.2); Sfx.play('tech');
        V.attach(h, 12, (g, p, q) => { const x = p.u.x, y = p.u.y - 38; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35 * (q > 0.9 ? (1 - q) * 10 : 1); for (let k = 0; k < 2; k++) { g.fillStyle = k ? 'rgba(255,190,80,.6)' : 'rgba(255,110,30,.7)'; g.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, rr = (k ? 30 : 40) + Math.sin(Game.t * 10 + i * 1.7) * 6; g.lineTo(x + Math.cos(a) * rr * 0.8, y + Math.sin(a) * rr * 1.2 - (Math.sin(a) < 0 ? 10 : 0)); } g.fill(); } g.restore(); }); } }
    else if (!h.beastT) h.beastG = Math.max(0, h.beastG - 10 * d);
    if (h.beastT > 0 && free) { const m = Input.move(); h.x += m.x * 90 * d; h.y += m.y * 90 * d; if (Math.random() < 0.3) aura(h, '#ff9a2a', 1, 16); }
    if (h.dojT > 0) { if (!h.eyeFx) h.eyeFx = dojOf()[1]; for (const k in h.cd) h.cd[k] = Math.max(0, h.cd[k] - d * 0.5); if (h.dojT < d * 1.5) h.eyeFx = null; }
    // jauges
    const show = h.charging || h.over > 0 || h.beastG > 0 || h.dojT > 0 || h.beastT > 0; gd.style.display = show && !this.titleMode ? 'flex' : 'none';
    if (show) { const [n, c] = dojOf(); const A = document.getElementById('g07ai'), B = document.getElementById('g07bi');
      if (h.dojT > 0) { A.style.width = (h.dojT / 14 * 100) + '%'; A.style.background = c; document.getElementById('g07a').textContent = n; } else if (h.ch < h.maxCh) { A.style.width = (h.ch / h.maxCh * 100) + '%'; A.style.background = '#4aa8ff'; document.getElementById('g07a').textContent = 'Chakra (' + Input.label('charge') + ')'; } else { A.style.width = h.over + '%'; A.style.background = 'linear-gradient(90deg,#ffd166,#a46bff)'; document.getElementById('g07a').textContent = n + ' (' + Input.label('charge') + ')'; }
      B.style.width = (h.beastT > 0 ? h.beastT / 12 * 100 : h.beastG) + '%'; document.getElementById('g07b').textContent = h.beastT > 0 ? 'Manteau' : 'Mode (' + Input.label('mode') + ')'; }
    return r; };
  const ht = hurt; hurt = function (t, dmg, src, o) { if (src && src.isHero) { if (src.dojT > 0) dmg *= 1.25; if (src.beastT > 0) dmg *= 1.2; } if (t && t.isHero && t.charging) dmg *= 1.15; return ht(t, dmg, src, o); };
  // astuces
  const hi = Game.hint.bind(Game);
  Game.hint = function (k) { const M = { dodge: () => `<kbd>${Input.label('dodge')}</kbd> ou clic droit : dash`, charge: () => `Maintiens <kbd>${Input.label('charge')}</kbd> : chakra, puis au-delà du max : ${dojOf()[0]}`, mode: () => `Maintiens <kbd>${Input.label('mode')}</kbd> : manteau de chakra` };
    if (M[k]) { if (this.hints[k]) return; this.hints[k] = 1; this.hintQ = { s: Input.lastDev === 'touch' ? { dodge: '⤳ : dash', charge: 'C : chakra puis éveil', mode: 'Z : manteau' }[k] : M[k](), t: 5 }; return; } return hi(k); };
  const s1 = UI.reward.bind(UI); // déclenche l’astuce chakra au premier manque de chakra
  const ft = FX.text.bind(FX); FX.text = function (x, y, s) { if (s === 'Chakra' && Game.hero && Game.running) Game.hint('charge'); return ft.apply(FX, arguments); };
  // tactile : boutons Z et C
  const ts = Touch.show.bind(Touch); Touch.show = function () { ts(); const t = $('#touch'); for (const [a, l, r, b] of [['mode', 'Z', 330, 220], ['charge', 'C', 340, 300]]) { const d = document.createElement('div'); d.className = 'tb t07'; d.textContent = l; Object.assign(d.style, { right: r + 'px', bottom: b + 'px', width: '58px', height: '58px' }); t.appendChild(d);
      d.addEventListener('touchstart', (e) => { e.preventDefault(); Input.virt[a] = true; }, { passive: false }); d.addEventListener('touchend', (e) => { e.preventDefault(); Input.virt[a] = false; }, { passive: false }); }
    const dg = t.querySelector('.tb[data-a="dodge"]'); if (dg) dg.textContent = 'A'; };
  // 1er lancement : choix de la disposition
  window.addEventListener('load', () => setTimeout(() => { if (!Save.set.layoutAsk || Input.touch) return; const o = document.createElement('div'); o.id = 'lay07';
    o.innerHTML = `<div class="b2"><h2>Tes touches</h2><p>Nouveau : <kbd>Z</kbd> charge ton mode, <kbd>A</kbd> ou clic droit pour le dash, <kbd>C</kbd> charge le chakra, <kbd>1</kbd>–<kbd>4</kbd> techniques.</p><p>Comment veux-tu te déplacer ?</p><button class="b p" id="lay1">Flèches (recommandé)</button><button class="b" id="lay2">ZQSD (charge de mode sur F)</button><p style="font-size:13px;opacity:.7">Modifiable à tout moment dans Réglages › Touches.</p></div>`; document.body.appendChild(o);
    const done = (k) => { Save.set.keys = JSON.parse(JSON.stringify(KEY_PRESETS[k])); Save.set.layoutAsk = 0; Save.saveSet(); o.remove(); }; o.querySelector('#lay1').onclick = () => done('fleches'); o.querySelector('#lay2').onclick = () => done('zqsd'); }, 300));
})();
