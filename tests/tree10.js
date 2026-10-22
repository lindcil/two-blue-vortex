const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/ui/';const PFX=process.argv[2]||'arbre';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
await p.evaluate(()=>{clearInterval(window.__au);Game.lvl=12;});
await p.keyboard.press('t');await p.waitForTimeout(900);await p.screenshot({path:SH+PFX+'.png'});
await p.keyboard.press('Escape');await p.waitForTimeout(400);await p.screenshot({path:SH+PFX+'-hud.png'});
console.log('errs',errs);await b.close()})();
