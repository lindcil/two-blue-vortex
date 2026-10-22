// v0.10.45 — Contrôles tactiles en portrait : boutons en arc autour de M1 (en bas à droite), Z/C au-dessus du stick ; plus aucun bouton sur le stick ni hors écran.
(() => {
  const P = { dodge: [105, 180, 64], s1: [105, 148, 58], s2: [108, 121, 58], s3: [108, 88, 58], s4: [182, 90, 58], ult: [182, 114, 72], use: [182, 138, 50] };
  const lay = () => { const t = document.getElementById('touch'); if (!t || t.style.display !== 'block') return; const narrow = innerWidth < 560 && innerHeight > innerWidth;
    for (const d of t.querySelectorAll('.tb')) { if (!d.dataset.o10) d.dataset.o10 = d.style.cssText; if (!narrow) { d.style.cssText = d.dataset.o10; continue; }
      const a = d.dataset.a, txt = d.textContent.trim(); let r, b, s;
      if (a === 'atk') { s = 84; r = 62 - s / 2; b = 72 - s / 2; }
      else if (P[a]) { const [R, deg, S] = P[a], th = deg * Math.PI / 180; s = S; r = 62 - R * Math.cos(th) - s / 2; b = 72 + R * Math.sin(th) - s / 2; }
      else if (txt === 'Z') { d.style.right = 'auto'; d.style.left = '24px'; d.style.bottom = '196px'; continue; }
      else if (txt === 'C') { d.style.right = 'auto'; d.style.left = '96px'; d.style.bottom = '196px'; continue; }
      else continue;
      Object.assign(d.style, { right: Math.round(r) + 'px', bottom: Math.round(b) + 'px', width: s + 'px', height: s + 'px', left: 'auto', top: 'auto' }); } };
  addEventListener('resize', lay); addEventListener('orientationchange', lay);
  const mo = new MutationObserver(() => { clearTimeout(mo.t); mo.t = setTimeout(lay, 50); }); addEventListener('load', () => { const t = document.getElementById('touch'); if (t) mo.observe(t, { childList: true, attributes: true, attributeFilter: ['style'] }); setTimeout(lay, 300); });
  window.TOUCH10 = { lay };
})();
