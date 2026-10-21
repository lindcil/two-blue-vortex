const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v08/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n,errs.length)};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
const t0=Date.now();while(Date.now()-t0<40000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
const cnt=await p.evaluate(()=>{clearInterval(window.__au);Game.cine=false;const me=Voie.me;me.pts=99;for(const b in me.tree)for(let i=0;i<12;i++)TREE8.invest(b);me.el2=me.el2||'wind';const h=Game.hero;h.x=2850;h.y=1300;World.foes_=[];return [VAR8.count(),VAR8.all().length]});console.log('count',JSON.stringify(cnt));
// visuel : Rasengan maintenu avec clone
const setup=async(js,a)=>p.evaluate(js,a);
await setup(()=>{const h=Game.hero;h.hp=h.maxHp;h.iframe=99;h.ch=h.maxCh=999;h.cd={};h.act=null;World.foes_=[];for(let k=0;k<3;k++){const f=spawnFoe('bandit',h.x+260+k*40,h.y-30+k*30,{});f.aggro=false}Game.skills[0]='rasen';VAR8.force='hold';h.aimA=0;h.face=1;castSkill(h,SK.rasen,'rasen',true)});
await p.waitForTimeout(900);await shot('30-rasengan-maintenu-clone');await p.waitForTimeout(500);await shot('31-odama-rasengan');
for(const [id,v,n] of [['rasen','dash','32-rasengan-dash'],['chidori','dash','33-chidori-dash'],['gokakyu','hold','34-gokakyu-maintenu'],['palms','hold','35-hakke-128'],['shuriken8','combo','36-kage-shuriken']]){await setup(([id,v])=>{const h=Game.hero;h.hp=h.maxHp;h.iframe=99;h.ch=999;h.cd={};h.act=null;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<3){const f=spawnFoe('bandit',h.x+150+World.foes_.length*40,h.y-20,{});f.aggro=false}VAR8.force=v;h.aimA=0;h.face=1;fireSkill(h,SK[id],id)},[id,v]);await p.waitForTimeout(v==='hold'?800:300);await shot(n);}
// toutes les variantes de toutes les techniques
const res=await p.evaluate(async()=>{const h=Game.hero;const wait=(ms)=>new Promise(r=>setTimeout(r,ms));let n=0;const by={};
 Game.allies.length||Game.allies.push(makeUnit({x:h.x-60,y:h.y,look:'sarada',isAlly:true,hp:100,maxHp:100,cd:{}}));
 for(const id of VAR8.all()){for(const v of VAR8.varsOf(id)){h.hp=h.maxHp;h.iframe=99;h.ch=999;h.cd={};h.act=null;Game.cine=false;if(isNaN(h.x)){h.x=2850;h.y=1300}
   World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<2){const f=spawnFoe('bandit',h.x+140+World.foes_.length*40,h.y-20,{});f.aggro=false}
   if(v.c==='mode'&&!h.md)MODE08.enter(h,'C');if(v.c!=='mode'&&h.md)MODE08.exit(h);if(v.c==='clone'&&!Game.clones.some(c=>!c.gone))fireSkill(h,SK.bunshin,'bunshin');
   VAR8.force=v.c;h.aimA=0;try{fireSkill(h,SK[id],id)}catch(e){return 'ERR '+id+':'+v.c+' '+e.message}VAR8.force=null;n++;by[v.c]=(by[v.c]||0)+1;await wait(90);FX.P.length=Math.min(FX.P.length,60);Proj.length=0;Game.slow8=0;}}
 return {n,by,x:h.x}});
console.log('fired',JSON.stringify(res));await p.waitForTimeout(1500);
console.log('ERRORS',errs.length,errs.slice(0,6));await b.close()})();
