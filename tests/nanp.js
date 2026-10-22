const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));ZONE8.exit({instant:true});const h=Game.hero;const f=spawnFoe('bandit',h.x+200,h.y,{});f.aggro=true;await W8(500);f.x=NaN;f.vy=Infinity;await W8(500);return [f.x,f.y,f.vx,World.foes().includes(f)]});
console.log(JSON.stringify(r),errs);await b.close()})();
