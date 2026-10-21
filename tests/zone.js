const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v08/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n,errs.length)};
const wf=async(js,t=30000)=>{const t0=Date.now();while(Date.now()-t0<t){if(await p.evaluate(js))return true;await p.waitForTimeout(150)}console.log('TIMEOUT',js);return false};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'nara',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await wf(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on,40000);await p.waitForTimeout(1500);
console.log('room',await p.evaluate(()=>[ZONE8.room&&ZONE8.room.id,Game.hero.x|0,Game.hero.y|0,World.foes_.filter(f=>f.tag==='yard').map(f=>f.x|0).join()]));await shot('40-terrain-entrainement');
// leçon : frapper les mannequins
await p.evaluate(()=>{clearInterval(window.__au)});
for(let i=0;i<40&&await p.evaluate(()=>Voie.step==='a1');i++){await p.evaluate(()=>{const h=Game.hero;const d=World.foes_.find(f=>f.tag==='yard');if(d){h.x=d.x-50;h.y=d.y;h.face=1}Game.cine=false;if(!h.act)startM1(h,0)});await p.waitForTimeout(400)}
console.log('step',await p.evaluate(()=>Voie.step));
await p.evaluate(()=>{window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
// passer en libre
await p.evaluate(()=>{ZONE8.exit({instant:true});World.foes_=World.foes_.filter(f=>f.tag!=='yard');Voie.rank='genin';Voie.step='free';Game.cine=false;const h=Game.hero;h.x=1500;h.y=1250;ZONE8.sec=ZONE8.secAt(h.x,h.y)});await p.waitForTimeout(500);
console.log('sec',await p.evaluate(()=>ZONE8.sec.n));await shot('41-section-grand-rue');
// franchir une bordure
await p.keyboard.down('ArrowRight');await wf(()=>ZONE8.sec.id===1,8000);await p.waitForTimeout(80);await shot('42-transition-encre');await p.keyboard.up('ArrowRight');await p.waitForTimeout(600);await shot('43-section-marche');console.log('sec2',await p.evaluate(()=>ZONE8.sec.n));
// maison
await p.evaluate(()=>{const h=Game.hero;const hm=World.props.filter(p=>p.kind==='house'&&p.y<WALL_Y-100&&p.x<1500).sort((a,b)=>Math.hypot(a.x-800,a.y-1250)-Math.hypot(b.x-800,b.y-1250))[0];h.x=hm.x;h.y=hm.y+8;ZONE8.sec=ZONE8.secAt(h.x,h.y);Cam.x=h.x;Cam.y=h.y});await p.waitForTimeout(400);await shot('44-porte-maison');
await p.keyboard.press('KeyE');await wf(()=>ZONE8.room&&ZONE8.room.id==='maison',4000);await p.waitForTimeout(700);await shot('45-interieur-maison');
await p.keyboard.down('ArrowDown');await wf(()=>!ZONE8.room,6000);await p.keyboard.up('ArrowDown');await p.waitForTimeout(600);console.log('out',await p.evaluate(()=>[Game.hero.x|0,Game.hero.y|0]));
// mission porte
await p.evaluate(()=>{Voie.step='free';Voie.mis=null;const h=Game.hero;h.x=1600;h.y=WALL_Y+80;ZONE8.sec=ZONE8.secAt(h.x,h.y);Cam.x=h.x;Cam.y=h.y});await p.waitForTimeout(1200);console.log('pre',await p.evaluate(()=>JSON.stringify([Game.hero.x|0,Game.hero.y|0,Game.cine,Talk.on,document.getElementById('prompt').innerText,ZONE8.room&&ZONE8.room.id,Voie.step])));await p.keyboard.press('KeyE');await wf(()=>ZONE8.room&&ZONE8.room.id==='porte',4000);await p.evaluate(()=>{const h=Game.hero;h.y=ZONE8.room.y+700});await p.waitForTimeout(900);await shot('46-mission-porte');
await p.evaluate(()=>{Cam.z=0.62;Cam.tz=0.62});await p.waitForTimeout(800);await shot('47-mission-porte-large');
await p.evaluate(()=>{for(const f of World.foes())hurt(f,1e5,Game.hero,{})});await p.waitForTimeout(1500);await p.evaluate(()=>{for(const f of World.foes())hurt(f,1e5,Game.hero,{})});await p.waitForTimeout(1500);await p.evaluate(()=>{for(const f of World.foes())hurt(f,1e5,Game.hero,{})});await wf(()=>!ZONE8.room,9000);console.log('gate done',await p.evaluate(()=>[Voie.me.pts,!!ZONE8.room]));
// arène rival
await p.evaluate(()=>{Cam.tz=1;Game.cine=false;Voie.spawnRival(1500,1250,1)});await wf(()=>ZONE8.room&&ZONE8.room.id==='arene',4000);await p.waitForTimeout(1200);await shot('48-arene-rival');
await p.evaluate(()=>{const r=World.foes_.find(f=>f.tag==='rival');r.gone=true});await wf(()=>!ZONE8.room,8000);
console.log('ERRORS',errs.length,errs.slice(0,6));await b.close()})();
