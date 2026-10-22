const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Ino',clan:'yamanaka',look:makeLook(3)});setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(6000);
console.log(await p.evaluate(async()=>{ZONE8.exit&&ZONE8.exit({instant:true});const h=Game.hero;const F=[0,1,2].map(i=>spawnFoe(Object.keys(FOE)[0],h.x+150+i*60,h.y+i*30));const hp0=F.map(f=>f.hp);ULT_FX.ult_shinten(h,h.x+150,h.y,1);await new Promise(r=>setTimeout(r,1500));return [Game.ultId,SK[Game.ultId]&&SK[Game.ultId].n,F.map((f,i)=>Math.round(hp0[i]-f.hp))]}));
await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/ui/shinten-bunshin.png'});console.log('errs',errs);await b.close()})();
