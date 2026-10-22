const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/ult/';const PFX=process.argv[2]||'a';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:960,height:540}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
const t0=Date.now();while(Date.now()-t0<40000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
await p.evaluate(()=>{clearInterval(window.__au);Voie.rank='chunin';Voie.step='free';Game.cine=false;const h=Game.hero;ZONE8.room=null;ZONE8.sec=null;h.x=K10*2850;h.y=K10*1300;Cam.x=h.x;Cam.y=h.y;World.foes_=[];});await p.waitForTimeout(1200);await p.evaluate(()=>{const h=Game.hero;for(let i=0;i<4;i++)spawnFoe('bandit',h.x+220+i*40,h.y+(i%2?40:-40),{});Game.ultV=100;castUlt(h);});
const T=[0.15,0.45,0.75,1.1,1.6];let last=0;for(const t of T){await p.waitForTimeout((t-last)*1000);last=t;await p.screenshot({path:SH+PFX+'-'+t+'.png'})}
console.log('errs',errs.length,errs.slice(0,3),await p.evaluate(()=>Game.ultId));await b.close()})();
