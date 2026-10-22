const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/ui/';const PFX=process.argv[2]||'en';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
if(process.env.FR)await p.evaluate(()=>{LANG10.lang='fr';LANG10.refresh()});await p.screenshot({path:SH+PFX+'-titre.png'});
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});});await p.waitForTimeout(1500);
await p.evaluate(()=>{const d=document.createElement('div');d.style.cssText='position:fixed;inset:40px 200px;overflow:auto;background:#101830ee;color:#dfe6f5;padding:20px;z-index:99;font:14px sans-serif';d.innerHTML=UI.t_ninjutsu();document.body.appendChild(d)});await p.waitForTimeout(300);await p.screenshot({path:SH+PFX+'-techniques.png'});
console.log('errs',errs);await b.close()})();
