const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('PE',e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','palms']})});await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const h=Game.hero;Game.ultId='set_chibaku';Game.ultV=100;const lk=Game.ultLock();castUlt(h);return JSON.stringify([lk,Game.ultV,Cine.on,Game.cine,Talk.on,Game.paused])}));
for(let i=0;i<4;i++){await p.waitForTimeout(800);console.log(await p.evaluate(()=>JSON.stringify([Cine.on,Game.cine,FX.P.length,Game.skyA])))}
await b.close()})();
