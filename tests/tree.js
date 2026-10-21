const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v08/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n,errs.length)};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'hyuga',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
const t0=Date.now();while(Date.now()-t0<40000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
await p.evaluate(()=>{clearInterval(window.__au);Game.cine=false});console.log(await p.evaluate(()=>[Game.skills.join(),Game.ultId,JSON.stringify(Voie.me.tree),Voie.me.pts]));
await p.keyboard.press('KeyT');await p.waitForTimeout(200);await shot('20-tree-zoom-visage');await p.waitForTimeout(230);await shot('21-tree-impact');await p.waitForTimeout(700);await shot('22-constellation');
await p.evaluate(()=>{const me=Voie.me;me.pts=40;for(const [b,n] of [['tai',6],['nin',5],['gen',3],['ctrl',4],['elem',5],['body',3],['clan',2]])for(let i=0;i<n;i++)TREE8.invest(b);});await p.waitForTimeout(600);
await p.mouse.move(640,360);await shot('23-constellation-progression');
console.log(await p.evaluate(()=>[Voie.me.known.join(),Game.ultId]));
await p.keyboard.press('Escape');await p.waitForTimeout(400);
// toutes les nouvelles techniques
await p.evaluate(()=>{const h=Game.hero;h.x=2850;h.y=1300;World.foes_=[];});
const ids=await p.evaluate(()=>Object.keys(T8));for(const id of ids){await p.evaluate((id)=>{const h=Game.hero;h.hp=h.maxHp;h.iframe=9;h.ch=h.maxCh=999;h.cd={};h.act=null;Game.cine=false;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<3){const f=spawnFoe('bandit',h.x+120+World.foes_.length*50,h.y-20+World.foes_.length*30,{});f.aggro=false;f.passive=false}Game.skills[0]=id;castSkill(h,SK[id],id,true)},id);await p.waitForTimeout(500);if(['renge','hirudora','gamabunta','kokuangyo','sekizo','fuin'].includes(id)){await p.waitForTimeout(300);await shot('3t-'+id);}}
for(const u of ['ult_renge','ult_kokuangyo','ult_okasho','ult_senko']){await p.evaluate((u)=>{const h=Game.hero;h.iframe=9;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<3){const f=spawnFoe('bandit',h.x+150+World.foes_.length*50,h.y,{});}Game.ultId=u;Game.ultV=100;Game.cine=false;castUlt(h)},u);await p.waitForTimeout(2600);await shot('4u-'+u);}
console.log('ERRORS',errs.length,errs.slice(0,6));await b.close()})();
