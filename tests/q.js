const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();p.on('console',m=>console.log('C',m.text().slice(0,200)));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>[typeof V07, !!V07.STORY08, String(Scene.play).slice(0,120), Scene===window.Scene]));
console.log(await p.evaluate(async()=>{const r=Scene.play(V07.STORY08.k1());await new Promise(r=>setTimeout(r,500));return [Scene.on,Scene.busy,Scene.bg]}));await b.close()})();
