const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{Voie.set('a5');Voie.talkIruka();let S;for(let k=0;k<40&&!(S=World.foes_.find(f=>f.tag==='sensei'));k++)await new Promise(r=>setTimeout(r,250));
 S.hp=NaN;await new Promise(r=>setTimeout(r,1500));const a=World.foes_.filter(f=>f.tag==='sensei'&&f.hp>0).length+':'+World.foes().length;S.gone=true;await new Promise(r=>setTimeout(r,1500));const b2=World.foes_.filter(f=>f.tag==='sensei'&&f.hp>0&&!f.gone).length;return [a,b2,Voie.step,Story===Voie,Voie.update.toString().includes('se10T'),Voie.se10T,Talk.on,Voie.lesson]});
console.log(JSON.stringify(r),errs);await b.close()})();
