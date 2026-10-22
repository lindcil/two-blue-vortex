const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uzumaki',look:makeLook(3)});Voie.me.sage=0;Voie.me.jin=0;Voie.me.masters={}});await p.waitForTimeout(1500);
console.log('Z locked',await p.evaluate(()=>[MODE08.enter(Game.hero,'Z'),!!Game.hero.md]));
await p.evaluate(()=>{ZONE8.room=null;const M=Game.extras.find(e=>e.master10);const h=Game.hero;h.x=M.x;h.y=M.y+120;Cam.x=h.x;Cam.y=h.y;ZONE8.sec=ZONE8.secAt(h.x,h.y);World.time=12});await p.waitForTimeout(1500);
await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/map/myoboku.png'});
await p.evaluate(()=>Game.extras.find(e=>e.master10).onTalk());await p.waitForTimeout(800);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/map/fukasaku.png'});
for(let i=0;i<6;i++){await p.evaluate(()=>{if(Talk.on){Talk.t=1;Talk.showing?Talk.pick(0):Talk.next()}});await p.waitForTimeout(400)}
console.log('master',await p.evaluate(()=>[MASTER10.has('toad'),MODE08.enter(Game.hero,'Z')]));
await p.evaluate(()=>{Voie.me.sage=1});console.log('after sage',await p.evaluate(()=>[MODE08.enter(Game.hero,'Z'),Game.hero.md&&Game.hero.md.fam]));
console.log('errs',errs);await b.close()})();
