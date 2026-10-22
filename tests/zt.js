// Zone robustness: engaged foe across village/outside edge stays active; stale room state self-heals.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));const o={};ZONE8.exit({instant:true});await W8(400);const h=Game.hero;
 h.x=K10*1600;h.y=K10*2250;await W8(600);o.sec=ZONE8.sec&&ZONE8.sec.n;
 const f=spawnFoe('bandit',K10*1600,K10*2340,{});f.aggro=true;const x0=f.x,y0=f.y;await W8(1500);o.across=[World.foes().includes(f),Math.round(Math.hypot(f.x-x0,f.y-y0))];
 const g=spawnFoe('bandit',K10*1600,K10*2900,{});await W8(500);o.farIdle=World.foes().includes(g);
 // stale room
 ZONE8.room=ZONE8.ROOMS.entrainement;await W8(300);o.room=ZONE8.room&&ZONE8.room.id;o.foesAfter=World.foes().length;
 return o});
console.log(JSON.stringify(r),errs);await b.close()})();
