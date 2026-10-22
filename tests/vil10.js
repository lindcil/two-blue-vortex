const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/map/';const PFX=process.argv[2]||'v';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
const shots=[['large',1650,1500,0.22],['rue',1500,1600,1],['quartier',1100,1350,1]];
for(const [n,x,y,z] of shots){await p.evaluate(([x,y,z])=>{clearInterval(window.__au);const h=Game.hero;ZONE8.room=null;World.time=12;h.x=K10*x;h.y=K10*y;Cam.x=h.x;Cam.y=h.y;Cam.z=z;Cam.tz=z;},[x,y,z]);await p.waitForTimeout(1200);await p.evaluate(([x,y,z])=>{Cam.z=z;Cam.tz=z},[x,y,z]);await p.waitForTimeout(300);await p.screenshot({path:SH+PFX+'-'+n+'.png'})}
console.log('errs',errs,await p.evaluate(()=>World.houses10));await b.close()})();
