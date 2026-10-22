const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uzumaki',look:makeLook(3)});setInterval(()=>{if(Talk.on){Talk.t=1;Talk.showing?Talk.pick(0):Talk.next()}},150)});await p.waitForTimeout(4000);
await p.evaluate(()=>{ZONE8.room=null;const M=Game.extras.find(e=>e.master10);const h=Game.hero;h.x=M.x-90;h.y=M.y+40;h.face=1;M.face=-1;ZONE8.sec=ZONE8.secAt(h.x,h.y);World.time=12;setInterval(()=>{Cam.x=K10*3350;Cam.y=K10*3880;Cam.z=Cam.tz=0.36},16)});await p.waitForTimeout(1500);
await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/map/myoboku-hameau.png'});
await p.evaluate(()=>{const M=Game.extras.find(e=>e.master10);window.__c=setInterval(()=>{Cam.x=M.x-40;Cam.y=M.y-40;Cam.z=Cam.tz=1.6},16)});await p.waitForTimeout(800);
await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/map/fukasaku-crapaud.png'});console.log('errs',errs);await b.close()})();
