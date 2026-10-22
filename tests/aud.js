// Checks the features revived by the guard audit (v0.10.58).
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(4000);
const r=await p.evaluate(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));ZONE8.exit({instant:true});const h=Game.hero;const o={};
 h.x=K10*1800;h.y=K10*1700;await W8(1500);o.district=document.getElementById('dist10').textContent;
 o.ult=Object.entries(ULT_NAME).slice(0,3);UI.toast('Camp dispersé');await W8(200);o.toast=[...document.querySelectorAll('body *')].map(e=>e.childElementCount?'':e.textContent).find(t=>/Camp/.test(t));
 o.rfAnim=typeof ANIM10!=='undefined';return o});
console.log(JSON.stringify(r),errs);await b.close()})();
