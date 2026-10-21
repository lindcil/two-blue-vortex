'use strict';
/* ============ Noyau : réglages, sauvegarde, entrées, audio ============ */
const VERSION = '0.10.5';
const K10 = Math.sqrt(10); // v0.9.7 : échelle des cartes extérieures (surface ×10)
const $ = (s) => document.querySelector(s);
const TAU = Math.PI * 2, clamp = (v, a, b) => (v < a ? a : v > b ? b : v), lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a), pick = (a) => a[(Math.random() * a.length) | 0];
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ease = { out: (t) => 1 - Math.pow(1 - t, 3), back: (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2), inout: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) };

const ACTIONS = { up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite', atk: 'Frappe (M1)', dodge: 'Dash / esquive', jump10: 'Saut d’arbre (course)', mode: 'Charge de mode (bête)', charge: 'Charge de chakra (puis dōjutsu)', s1: 'Technique 1', s2: 'Technique 2', s3: 'Technique 3', s4: 'Technique 4', ult: 'Ultime', page: 'Page de techniques (mode)', tree: 'Constellation (arbre)', use: 'Parler / interagir', menu: 'Menu', map: 'Carte' };
const DEFAULT_KEYS = { up: ['ArrowUp'], down: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'], atk: ['Mouse0', 'KeyJ'], dodge: ['KeyQ', 'Mouse2'], jump10: ['Space'], mode: ['KeyW'], charge: ['KeyC'], s1: ['Digit1', 'KeyU'], s2: ['Digit2', 'KeyI'], s3: ['Digit3', 'KeyO'], s4: ['Digit4', 'KeyP'], ult: ['KeyR', 'KeyL'], page: ['KeyX'], tree: ['KeyT'], use: ['KeyE', 'Enter'], menu: ['Escape', 'Tab'], map: ['KeyM'] };
// codes physiques : sur AZERTY, KeyQ = A (dash), KeyW = Z (charge de mode), KeyC = C (chakra). Déplacement : flèches par défaut, préréglage ZQSD au choix (charge de mode → F).
const KEY_PRESETS = { fleches: DEFAULT_KEYS_F(), zqsd: Object.assign(DEFAULT_KEYS_F(), { up: ['KeyW', 'ArrowUp'], down: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], mode: ['KeyF'] }) };
function DEFAULT_KEYS_F() { return JSON.parse(JSON.stringify(DEFAULT_KEYS)); }
const PAD = { atk: 2, dodge: 1, s1: 4, s2: 5, s3: 6, s4: 7, ult: 3, use: 0, menu: 9, map: 8 };
const DEF_SET = { diff: 1, cb: 'none', ts: 1, speed: 1, shake: 1, rf: true, low: false, vol: 0.7, mus: 0.4, hc: false, keys: null, cine: 'first' };
const Save = {
  K: 'tbv_save_v1', S: 'tbv_set_v1',
  set: Object.assign({}, DEF_SET),
  load() { try { const s = JSON.parse(localStorage.getItem(this.S) || 'null'); if (s) this.set = Object.assign({}, DEF_SET, s); } catch (e) {} if (!this.set.keys || this.set.kv !== 7) { this.set.keys = JSON.parse(JSON.stringify(DEFAULT_KEYS)); this.set.kv = 7; this.set.layoutAsk = 1; } for (const k in DEFAULT_KEYS) if (!this.set.keys[k]) this.set.keys[k] = DEFAULT_KEYS[k].slice(); this.apply(); },
  saveSet() { try { localStorage.setItem(this.S, JSON.stringify(this.set)); } catch (e) {} this.apply(); },
  apply() { document.documentElement.style.setProperty('--ts', this.set.ts); document.body.classList.toggle('hc', !!this.set.hc); },
  game() { try { return JSON.parse(localStorage.getItem(this.K) || 'null'); } catch (e) { return null; } },
  write(d) { try { localStorage.setItem(this.K, JSON.stringify(d)); } catch (e) {} },
  wipe() { try { localStorage.removeItem(this.K); } catch (e) {} },
  gameV() { try { return JSON.parse(localStorage.getItem('tbv_voie_v1') || 'null'); } catch (e) { return null; } },
  writeV(d) { try { localStorage.setItem('tbv_voie_v1', JSON.stringify(d)); } catch (e) {} },
  wipeV() { try { localStorage.removeItem('tbv_voie_v1'); } catch (e) {} },
};
const keyName = (c) => { if (!c) return '—'; if (c === 'Mouse0') return 'Clic'; if (c === 'Mouse2') return 'Clic droit'; if (c.startsWith('Key')) { const l = c.slice(3); const az = { W: 'Z', A: 'Q', Q: 'A', Z: 'W', M: ',' }; return Input.azerty && az[l] ? az[l] : l; } if (c.startsWith('Digit')) return c.slice(5); const m = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', ShiftLeft: 'Maj', ShiftRight: 'Maj', Space: 'Espace', Enter: 'Entrée', Escape: 'Échap', Tab: 'Tab' }; return m[c] || c; };
const Input = {
  down: new Set(), hit: new Set(), azerty: true, mx: 0, my: 0, mdown: false, touch: false, stick: { x: 0, y: 0 }, pad: null, padPrev: {}, rebind: null, lastDev: 'kb',
  init() {
    try { if (navigator.keyboard && navigator.keyboard.getLayoutMap) navigator.keyboard.getLayoutMap().then((m) => { this.azerty = m.get('KeyQ') === 'a'; }); } catch (e) {}
    addEventListener('keydown', (e) => { if (this.rebind) { e.preventDefault(); this.rebind(e.code); return; } if (['Tab', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault(); if (!e.repeat) this.hit.add(e.code); this.down.add(e.code); this.lastDev = 'kb'; });
    addEventListener('keyup', (e) => this.down.delete(e.code));
    addEventListener('blur', () => this.down.clear());
    const cv = $('#cv'); cv.addEventListener('mousedown', (e) => { if (e.button === 0 || e.button === 2) { const k = 'Mouse' + e.button; this.hit.add(k); this.down.add(k); this.lastDev = 'kb'; } }); cv.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('mouseup', (e) => this.down.delete('Mouse' + (e.button === 2 ? 2 : 0))); addEventListener('mousemove', (e) => { this.mx = e.clientX; this.my = e.clientY; });
    addEventListener('touchstart', () => { if (!this.touch) { this.touch = true; Touch.show(); } this.lastDev = 'touch'; }, { passive: true });
  },
  is(a) { if (this.virt && this.virt[a]) return true; const ks = Save.set.keys[a] || []; for (const k of ks) if (this.down.has(k)) return true; return this.padIs(a); },
  pressed(a) { if (this.vhit && this.vhit.has(a)) return true; const ks = Save.set.keys[a] || []; for (const k of ks) if (this.hit.has(k)) return true; return this.padHit(a); },
  padIs(a) { const p = this.pad; if (!p) return false; const b = PAD[a]; return b != null && p.buttons[b] && p.buttons[b].pressed; },
  padHit(a) { const p = this.pad; if (!p) return false; const b = PAD[a]; return b != null && p.buttons[b] && p.buttons[b].pressed && !this.padPrev[b]; },
  poll() { this.padPrev = {}; if (this.pad) this.pad.buttons.forEach((b, i) => (this.padPrev[i] = b.pressed)); const ps = navigator.getGamepads ? navigator.getGamepads() : []; this.pad = null; for (const p of ps) if (p && p.connected) { this.pad = p; break; } if (this.pad && this.pad.buttons.some((b) => b.pressed)) this.lastDev = 'pad'; },
  move() { let x = 0, y = 0; if (this.is('left')) x -= 1; if (this.is('right')) x += 1; if (this.is('up')) y -= 1; if (this.is('down')) y += 1;
    const p = this.pad; if (p) { const ax = p.axes[0] || 0, ay = p.axes[1] || 0; if (Math.hypot(ax, ay) > 0.2) { x = ax; y = ay; } if (p.buttons[14] && p.buttons[14].pressed) x = -1; if (p.buttons[15] && p.buttons[15].pressed) x = 1; if (p.buttons[12] && p.buttons[12].pressed) y = -1; if (p.buttons[13] && p.buttons[13].pressed) y = 1; }
    if (Math.hypot(this.stick.x, this.stick.y) > 0.15) { x = this.stick.x; y = this.stick.y; }
    const m = Math.hypot(x, y); return m > 1 ? { x: x / m, y: y / m } : { x, y }; },
  end() { this.hit.clear(); if (this.vhit) this.vhit.clear(); },
  label(a) { if (this.lastDev === 'pad') { const n = { atk: 'X', dodge: 'B', s1: 'LB', s2: 'RB', s3: 'LT', s4: 'RT', ult: 'Y', use: 'A', menu: 'Start', map: 'Select' }; return n[a] || a; } if (this.lastDev === 'touch') return ''; return keyName((Save.set.keys[a] || [])[0]); },
};
const Touch = {
  show() { const t = $('#touch'); t.style.display = 'block'; const btn = [['atk', 'M1', 90, 120, 84], ['dodge', '⤳', 18, 200, 80], ['s1', '1', 190, 60, 60], ['s2', '2', 190, 140, 60], ['s3', '3', 120, 218, 60], ['s4', '4', 40, 280, 60], ['ult', '極', 262, 132, 76], ['use', 'E', 250, 230, 50]];
    Input.virt = {}; Input.vhit = new Set();
    for (const [a, l, r, b, s] of btn) { const d = document.createElement('div'); d.className = 'tb'; d.textContent = l; Object.assign(d.style, { right: r + 'px', bottom: b + 'px', width: s + 'px', height: s + 'px' }); d.dataset.a = a; t.appendChild(d);
      d.addEventListener('touchstart', (e) => { e.preventDefault(); Input.virt[a] = true; Input.vhit.add(a); }, { passive: false }); d.addEventListener('touchend', (e) => { e.preventDefault(); Input.virt[a] = false; }, { passive: false }); }
    const st = t.querySelector('.stick'), kn = t.querySelector('.knob'); let id = null;
    const mv = (e) => { for (const tt of e.changedTouches) if (tt.identifier === id) { const r = st.getBoundingClientRect(); let x = (tt.clientX - r.left - r.width / 2) / (r.width / 2), y = (tt.clientY - r.top - r.height / 2) / (r.height / 2); const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } Input.stick = { x, y }; kn.style.transform = `translate(${x * 44}px,${y * 44}px)`; } };
    st.addEventListener('touchstart', (e) => { e.preventDefault(); id = e.changedTouches[0].identifier; mv(e); }, { passive: false }); st.addEventListener('touchmove', (e) => { e.preventDefault(); mv(e); }, { passive: false });
    st.addEventListener('touchend', () => { id = null; Input.stick = { x: 0, y: 0 }; kn.style.transform = ''; });
    const m = document.createElement('div'); m.className = 'tb'; m.textContent = '☰'; Object.assign(m.style, { right: '20px', top: '20px', bottom: 'auto' }); m.addEventListener('touchstart', (e) => { e.preventDefault(); Input.vhit.add('menu'); }, { passive: false }); t.appendChild(m); },
};
/* Audio de synthèse (aucun fichier à charger) */
const Sfx = {
  ctx: null, init() { if (this.ctx) return; try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); this.g = this.ctx.createGain(); this.g.connect(this.ctx.destination); } catch (e) {} },
  tone(f0, f1, dur, type, vol, delay = 0, noise) { const c = this.ctx; if (!c || !Save.set.vol) return; const t = c.currentTime + delay, g = c.createGain(); g.connect(this.g); this.g.gain.value = Save.set.vol;
    let o; if (noise) { const n = c.sampleRate * dur | 0, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); o = c.createBufferSource(); o.buffer = b; const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur); o.connect(fl); fl.connect(g); }
    else { o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur); o.connect(g); }
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.04); o.start(t); o.stop(t + dur + 0.06); },
  // couches : transitoire (bruit) + corps (grave) + note (monte avec la chaîne, façon points faibles Fortnite)
  hit(lv, combo = 0) { if (lv < 0) { this.tone(900, 200, 0.06, 0, 0.2, 0, 1); this.tone(200, 70, 0.14, 'square', 0.18); return; } this.tone(3000, 400, 0.04, 0, 0.22, 0, 1); this.tone(lv > 1 ? 120 : 170, 45, lv > 1 ? 0.16 : 0.09, 'sine', 0.4);
    const st = [0, 2, 4, 7, 9, 12, 14, 16][Math.min(7, combo)]; this.tone(523 * Math.pow(2, st / 12), 523 * Math.pow(2, st / 12), 0.07, 'triangle', 0.07, 0.01); if (lv > 1) this.tone(1200, 300, 0.25, 0, 0.18, 0.02, 1); },
  play(type, v = 1) { const c = this.ctx; if (!c || !Save.set.vol) return;
    if (type === 'boom') { this.tone(400, 30, 0.9, 0, 0.5, 0, 1); this.tone(70, 25, 0.8, 'sine', 0.5); return; }
    if (type === 'charge') { this.tone(80, 600, 1.4, 'sawtooth', 0.06); this.tone(2000, 6000, 1.2, 0, 0.05, 0, 1); return; }
    if (type === 'roar') { this.tone(160, 60, 0.9, 'sawtooth', 0.22); this.tone(600, 150, 0.9, 0, 0.25, 0, 1); return; }
    if (type === 'pop') { this.tone(500, 1100, 0.08, 'sine', 0.14); this.tone(1100, 1700, 0.08, 'triangle', 0.08, 0.06); return; }
    if (type === 'hit' || type === 'heavy') return this.hit(type === 'heavy' ? 2 : 1, 0);
    const t = c.currentTime, g = c.createGain(); g.connect(this.g); this.g.gain.value = Save.set.vol;
    const P = { swing: [600, 200, 0.06, 'triangle', 0.08], dodge: [300, 900, 0.1, 'sine', 0.12], tech: [220, 880, 0.25, 'sawtooth', 0.14], rx: [440, 1320, 0.3, 'triangle', 0.25], ui: [660, 880, 0.05, 'sine', 0.08], hurt: [200, 80, 0.15, 'square', 0.25], lvl: [523, 1046, 0.5, 'triangle', 0.2] }[type] || [440, 440, 0.1, 'sine', 0.1];
    const o = c.createOscillator(); o.type = P[3]; o.frequency.setValueAtTime(P[0], t); o.frequency.exponentialRampToValueAtTime(Math.max(30, P[1]), t + P[2]); g.gain.setValueAtTime(P[4] * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + P[2] + 0.05); o.connect(g); o.start(t); o.stop(t + P[2] + 0.06);
    if (type === 'swing') this.tone(2500, 800, 0.07, 0, 0.06, 0, 1); if (type === 'lvl') { this.tone(659, 659, 0.3, 'triangle', 0.15, 0.12); this.tone(784, 784, 0.4, 'triangle', 0.15, 0.24); } }
};
