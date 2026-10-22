const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>console.log('C',m.text().slice(0,200)));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
const r=await p.evaluate(async()=>{clearInterval(window.__au);const h=Game.hero;ZONE8.room=null;Voie.step='free';h.x=K10*2850;h.y=K10*1300;World.foes_=[];const L=[];for(let i=0;i<4;i++)L.push(spawnFoe('bandit',h.x+220+i*40,h.y,{}));
 const hp0=L.map(f=>f.hp|0);const pas=L.map(f=>!!f.passive);const vis=World.foes().length;Game.ultV=100;Game.ultId='ult_renge';castUlt(h);await new Promise(r=>setTimeout(r,12000));return {t:h.act&&h.act.t,hs:Game.hs,paused:Game.paused,run:Game.running,ult:Game.ultId,hp0,hp1:L.map(f=>f.hp|0),pas,vis,act:h.act&&h.act.k,cine:Game.cine}});
console.log(JSON.stringify(r),errs);await b.close()})();
