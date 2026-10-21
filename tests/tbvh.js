const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.start(true);window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},300)});await p.waitForTimeout(3000);
await p.evaluate(()=>{hurt(Game.hero,5,null,{});Histoire.set('c0')});await p.waitForTimeout(700);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v07/26-histoire-transition-chapitre.png'});await p.waitForTimeout(3500);
for(const k of ['KeyQ']){await p.keyboard.press(k)}await p.waitForTimeout(100);const r=await p.evaluate(()=>[Histoire.step,Game.cine,Game.hero.hurtT,Game.hero.act&&Game.hero.act.k,Scene.on]);
await p.keyboard.down('ArrowRight');await p.waitForTimeout(2200);const r2=await p.evaluate(()=>Game.hero.ninjaRun);await p.keyboard.up('ArrowRight');
// créatif
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);await p.click('#bCrea');await p.waitForTimeout(400);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v07/27-creatif-choix-clan-techniques.png'});await p.click('#cGo');await p.waitForTimeout(1500);
const r3=await p.evaluate(()=>[Game.creative,Voie.me.clan,Game.skills.join(','),Voie.obj()[0],Scene.on]);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v07/28-creatif-terrain.png'});
console.log(JSON.stringify([r,r2,r3]),errs);await b.close()})()
