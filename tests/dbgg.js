const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('PE',e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'nara',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
const t0=Date.now();while(Date.now()-t0<40000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}await p.waitForTimeout(1500);
await p.evaluate(()=>{ZONE8.exit({instant:true});World.foes_=World.foes_.filter(f=>f.tag!=='yard');Voie.rank='genin';Voie.step='free';Game.cine=false;const h=Game.hero;h.x=1600;h.y=WALL_Y+80;ZONE8.sec=ZONE8.secAt(h.x,h.y)});
for(let i=0;i<5;i++){await p.waitForTimeout(400);console.log(await p.evaluate(()=>{const h=Game.hero;return JSON.stringify([h.x|0,h.y|0,Game.cine,Voie.rank,Voie.step,ZONE8.room&&ZONE8.room.id,document.getElementById('prompt').innerText,Talk.on,Game.running,Game.paused])}))}
await b.close()})();
