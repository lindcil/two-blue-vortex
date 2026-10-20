/* ============ Création du personnage (mode Ta voie) ============ */
const Create = { st: null, raf: 0,
  open() { const c = Object.keys(CLANS); const clan = pick(c); this.st = { name: pick(NAMES), clan, look: Object.assign(makeLook((Math.random() * 1e6) | 0), CLANS[clan].look, { band: 0, vest: null, apron: null }) }; $('#create').style.display = 'block'; $('#title').style.display = 'none'; this.render(); $('#cName').focus(); this.loop(); },
  render() { const S = this.st, L = S.look; $('#cName').value = S.name;
    const chips = (id, items, cur, on) => { const el = $(id); el.innerHTML = items.map(([k, n, sw]) => `<button class="chip${sw ? ' sw' : ''}${String(k) === String(cur) ? ' on' : ''}" data-k="${k}" ${sw ? `style="background:${k}" aria-label="${n}"` : ''}>${sw ? '' : n}</button>`).join(''); el.querySelectorAll('button').forEach((b) => (b.onclick = () => { on(b.dataset.k); Sfx.init(); Sfx.play('pop'); this.render(); })); };
    chips('#cClan', [...Object.entries(CLANS).map(([k, c]) => [k, c.n]), ['?', '🎲 Au hasard']], S.clan, (k) => { if (k === '?') k = pick(Object.keys(CLANS)); S.clan = k; Object.assign(L, CLANS[k].look); });
    chips('#cHair', HAIRSTYLES.map((h) => [h, { spiky: 'Pointes', bob: 'Carré', long: 'Longs', pony: 'Queue', buns: 'Chignons', pineapple: 'Ananas', buzz: 'Ras', messy: 'Ébouriffés', slick: 'Plaqués', bald: 'Chauve' }[h]]), L.hs, (k) => (L.hs = k));
    chips('#cHc', PAL.hair.map((c) => [c, c, 1]), L.hair, (k) => (L.hair = k)); chips('#cSkin', PAL.skin.map((c) => [c, c, 1]), L.skin, (k) => (L.skin = k)); chips('#cTop', PAL.top.map((c) => [c, c, 1]), L.top, (k) => (L.top = k)); },
  loop() { cancelAnimationFrame(this.raf); const c = $('#cPrev'), x = c.getContext('2d'); const u = makeUnit({ look: this.st.look, x: 0, y: 0, face: 1 }); let t = 0, k = 0;
    const tick = () => { if ($('#create').style.display === 'none') return; t += 0.016; u.anim = t * 3; u.look = this.st.look; k = (t % 6) | 0; u.act = null; u.combat = k % 2 === 1; if (k === 3) { u.act = { k: 'm1', n: ((t * 2.2) | 0) % 3, t: (t * 2.2 % 1) * 0.4, dur: 0.4 }; } if (k === 5) { u.vx = 200; } else u.vx = 0;
      animPose(u, 0.016); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 320, 320); x.fillStyle = 'rgba(0,0,0,.2)'; x.beginPath(); x.ellipse(160, 270, 70, 14, 0, 0, TAU); x.fill(); x.setTransform(3, 0, 0, 3, 160, 270); drawRig(x, u); this.raf = requestAnimationFrame(tick); }; tick(); },
};
$('#cName').addEventListener('input', (e) => (Create.st.name = e.target.value.slice(0, 14)));
$('#cName').addEventListener('keydown', (e) => e.stopPropagation());
$('#cRandN').onclick = () => { Create.st.name = pick(NAMES); Create.render(); };
$('#cBack').onclick = () => { $('#create').style.display = 'none'; $('#title').style.display = 'flex'; };
$('#cGo').onclick = () => { const S = Create.st; S.name = (S.name || '').trim() || pick(NAMES); Game.startVoie({ name: S.name, clan: S.clan, look: S.look }); };
