const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('console',m=>console.log('C',m.text().slice(0,200)));p.on('pageerror',e=>console.log('PE',e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},300)});
await p.waitForTimeout(15000);
console.log(await p.evaluate(async()=>{const o=[Voie.step,Scene.on,Scene.busy,Talk.on];const r=Scene.play(V07.STORY08.k1());for(let i=0;i<6;i++){await new Promise(r=>setTimeout(r,200));o.push([Scene.on,Scene.busy,Scene.bg,Talk.on].join())}o.push(await Promise.race([r,new Promise(r=>setTimeout(()=>r('pending'),10))]));return o}));
await p.screenshot({path:'/tmp/x.png'});await b.close()})();
