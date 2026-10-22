const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
// balade : téléporte le héros dans toute la carte pour faire dessiner tous les libellés
for(let i=0;i<60;i++){await p.evaluate((i)=>{const h=Game.hero;h.x=K10*(200+(i%10)*450);h.y=K10*(300+Math.floor(i/10)*700);Cam.x=h.x;Cam.y=h.y;},i);await p.waitForTimeout(250)}
for(const k of ['Tab','m','t','Escape']){await p.keyboard.press(k);await p.waitForTimeout(600);await p.keyboard.press('Escape');}
const r=await p.evaluate(()=>[...LANG10.cmiss]);console.log(JSON.stringify(r));await b.close()})();
