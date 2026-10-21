const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v07/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n)};
const wf=async(js,t=30000)=>{const t0=Date.now();while(Date.now()-t0<t){if(await p.evaluate(js))return true;await p.waitForTimeout(150)}console.log('TIMEOUT',js);return false};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(window.__pick||0);else Talk.next()}},350)});
await wf(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on);
await p.evaluate(()=>{Voie.step='a4';Voie.rivalDone('a4',{})});await wf(()=>Scene.bg==='rooftop'&&Scene.wipe<0.05);await p.waitForTimeout(1500);await shot('12-rencontre-equipe-presentations');
await p.evaluate(()=>window.__pick=1);await wf(()=>document.getElementById('scntitle').style.display==='block');await p.waitForTimeout(250);await shot('13-carton-nom-equipe');await p.evaluate(()=>window.__pick=0);
await wf(()=>Voie.step==='a6'&&!Scene.on);
await p.evaluate(()=>{Voie.rank='genin';Voie.step='free';Voie.set('x1')});await wf(()=>document.getElementById('scnq').style.display==='block'&&Scene.bg==='examhall');await p.waitForTimeout(600);await shot('20-examen-ecrit-salle');
for(const k of ['Digit1','Digit2','Digit2']){await p.keyboard.press(k);await p.waitForTimeout(300)}
await wf(()=>Scene.bg==='ichiraku'&&document.getElementById('scnq').style.display==='block');for(let i=0;i<14;i++){await p.keyboard.press('Space');await p.waitForTimeout(60)}await shot('21-ichiraku-ramen-qte');for(let i=0;i<20;i++){await p.keyboard.press('Space');await p.waitForTimeout(50)}
await wf(()=>!Scene.busy&&!Talk.on,40000);
await p.evaluate(()=>{Voie.step='free';Voie.mis=null;clearInterval(window.__au);Voie.board()});await p.waitForTimeout(900);await shot('24-bureau-hokage');await p.evaluate(()=>Talk.pick(3));await p.waitForTimeout(500);
// techniques avec ennemis présents, héros invulnérable
await p.evaluate(()=>{Game.cine=false;const h=Game.hero;h.x=2850;h.y=1300;Cam.x=h.x;Cam.y=h.y;World.foes_=[];});
const techs=await p.evaluate(()=>Object.keys(TECH07));const res={};
for(const id of techs){await p.evaluate((id)=>{const h=Game.hero;h.hp=h.maxHp;h.iframe=5;h.ch=h.maxCh=999;h.cd={};h.act=null;h.face=1;Game.cine=false;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<4){const k=World.foes_.length;const f=spawnFoe('kuro',h.x+170+k*45,h.y-50+k*35,{});f.aggro=false;f.passive=false}window.__hp0=World.foes_.reduce((a,f)=>a+f.hp,0);Game.skills[0]=id;castSkill(h,SK[id],id,true)},id);
  await p.waitForTimeout(id==='haisekisho'?1150:id==='suiro'||id==='yomi'?900:420);await shot('4t-'+id);await p.waitForTimeout(500);res[id]=await p.evaluate(()=>Math.round(window.__hp0-World.foes_.reduce((a,f)=>a+Math.max(0,f.hp),0)))}
console.log('dmg',JSON.stringify(res));
await p.evaluate(()=>{const h=Game.hero;h.ch=10;h.maxCh=200;World.foes_=[];Game.cine=false});await p.keyboard.down('KeyC');await p.waitForTimeout(2200);await shot('50-charge-chakra');await p.waitForTimeout(5000);await p.keyboard.up('KeyC');await p.waitForTimeout(300);await shot('51-dojutsu-active');
console.log('doj',await p.evaluate(()=>[Game.hero.dojT|0,Game.hero.eyeFx]));
console.log('ERRS',errs.slice(0,12));await b.close()})()
