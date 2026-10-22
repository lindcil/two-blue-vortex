const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/map/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uzumaki',look:makeLook(3)});setInterval(()=>{if(Talk.on){Talk.t=1;Talk.showing?Talk.pick(0):Talk.next()}},120)});
{const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}}
await p.evaluate(()=>{ZONE8.exit({instant:true});const m=Voie.me;m.masters={};m.heard={};Voie.done=5;Voie.step='free';World.time=12});await p.waitForTimeout(800);
for(const id of ['bee','momo','altar']){await p.evaluate(id=>{const M=Game.extras.find(e=>e.id==='master_'+id);const h=Game.hero;h.x=M.x-70;h.y=M.y+20;h.face=1;M.face=-1;ZONE8.sec=ZONE8.secAt(h.x,h.y);clearInterval(window.__c);window.__c=setInterval(()=>{Cam.x=M.x-30;Cam.y=M.y-40;Cam.z=Cam.tz=1.7},16)},id);await p.waitForTimeout(1200);await p.screenshot({path:SH+'modele-'+id+'.png'})}
await p.waitForTimeout(8000);await p.evaluate(()=>UI.open('carte'));await p.waitForTimeout(600);await p.screenshot({path:SH+'carte-maitres.png'});
console.log(await p.evaluate(()=>JSON.stringify(Voie.me.heard)),'errs',errs);await b.close()})();
