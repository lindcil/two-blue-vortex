const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v08/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n,errs.length)};
const wf=async(js,t=30000)=>{const t0=Date.now();while(Date.now()-t0<t){if(await p.evaluate(js))return true;await p.waitForTimeout(150)}console.log('TIMEOUT',js);return false};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},300)});
await wf(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on,40000);
await p.evaluate(()=>{clearInterval(window.__au);Voie.me.clan='uchiha';Voie.me.susC='purple';Voie.rank='chunin';Game.cine=false;const h=Game.hero;h.x=2850;h.y=1300;Cam.x=h.x;Cam.y=h.y;World.foes_=[];h.ch=h.maxCh});
const foes=async()=>p.evaluate(()=>{const h=Game.hero;h.hp=h.maxHp;h.iframe=99;h.ch=h.maxCh=999;h.cd={};h.act=null;Game.cine=false;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<4){const k=World.foes_.length;const f=spawnFoe('kuro',h.x+220+k*50,h.y-60+k*40,{});f.aggro=false}});
await foes();
// activation réelle : maintenir C
await p.keyboard.down('KeyC');await wf(()=>Game.hero.md,12000);await p.keyboard.up('KeyC');await p.waitForTimeout(500);await shot('01-sharingan-1tomoe');
console.log('page',await p.evaluate(()=>[Game.page,Game.skills.join(),Game.baseSkills.join(),Game.ultId]));
// montée réelle par maintien
await p.keyboard.down('KeyC');await wf(()=>Game.hero.md.st===2,12000);await p.keyboard.up('KeyC');await p.waitForTimeout(400);await shot('02-sharingan-2tomoe');
// flip
await p.keyboard.press('KeyX');await p.waitForTimeout(120);await shot('03-flip-anim');await p.waitForTimeout(500);await shot('04-page-base');console.log('afterflip',await p.evaluate(()=>[Game.page,Game.skills.join()]));await p.keyboard.press('KeyX');await p.waitForTimeout(500);await shot('05-page-mode');
const names=['','','','06-sharingan-3tomoe','07-mangekyo','08-susanoo1-cotes','09-susanoo2-squelette','10-susanoo3-humanoide','11-susanoo4-samourai','12-susanoo5-parfait'];
for(let s=3;s<=9;s++){await p.evaluate((s)=>{MODE08.stage(Game.hero,s)},s);await p.waitForTimeout(s>=5?1700:700);await shot(names[s]);}
// moveset géant
await foes();await p.mouse.click(900,360);await p.waitForTimeout(200);await shot('13-susanoo-parfait-coup');
for(let i=0;i<4;i++){await foes();await p.evaluate((i)=>{const h=Game.hero;const id=Game.skills[i];h.aimA=0;castSkill(h,SK[id],id,true)},i);await p.waitForTimeout(450);if(i==2)await shot('14-fleche-indra');}
await p.evaluate(()=>{Game.ultV=100;Game.cine=false});await p.keyboard.press('KeyR');await p.waitForTimeout(2600);await shot('15-ult-parfait');
// toutes familles : tous les skills et ultimes
const res=await p.evaluate(async()=>{const out={};const h=Game.hero;const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
  for(const fam in MODE08.F){MODE08.exit(h);const key=['manteau'].includes(fam)?'Z':'C';const clan={sharingan:'uchiha',byakugan:'hyuga'}[fam]||fam;Voie.me.clan=clan;MODE08.enter(h,key);let tot=0;
   for(let s=1;s<=MODE08.F[fam].st.length;s++){MODE08.stage(h,s);for(const id of Game.skills){h.cd={};h.ch=999;h.act=null;Game.cine=false;World.foes_=World.foes_.filter(f=>f.hp>0);while(World.foes_.length<4){const f=spawnFoe('kuro',h.x+150+World.foes_.length*40,h.y-30,{});f.aggro=false}const h0=World.foes_.reduce((a,f)=>a+f.hp,0);fireSkill(h,SK[id],id);await wait(500);tot+=h0-World.foes_.reduce((a,f)=>a+Math.max(0,f.hp),0);}
    ULT_FX[Game.ultId](h,h.x+200,h.y,1);await wait(300);}
   out[fam]=[MODE08.F[fam].st.length,Math.round(tot)];}
  MODE08.exit(h);return out;});
console.log('fams',JSON.stringify(res));
// Bête géante
await p.evaluate(()=>{const h=Game.hero;MODE08.enter(h,'Z');MODE08.stage(h,5);});await p.waitForTimeout(1700);await shot('16-bete-geante');
// couleurs Susanoo
for(const c of ['red','blue']){await p.evaluate((c)=>{const h=Game.hero;MODE08.exit(h);Voie.me.clan='uchiha';Voie.me.susC=c;MODE08.enter(h,'C');MODE08.stage(h,8)},c);await p.waitForTimeout(1700);await shot('17-susanoo-'+c);}
// épuisement
await p.evaluate(()=>{Game.hero.md.g=0.01});await p.waitForTimeout(300);console.log('exit',await p.evaluate(()=>[!!Game.hero.md,Game.page,Game.skills.join()]));
// Histoire : Jōgan + Kāma
await p.evaluate(()=>{Game.start(true)});await p.waitForTimeout(1500);
const st=await p.evaluate(async()=>{const h=Game.hero;if(!h)return 'nohero';Talk.on&&Talk.end&&Talk.end();Game.cine=false;MODE08.enter(h,'C');MODE08.stage(h,4);const a=Game.ultId;MODE08.exit(h);MODE08.enter(h,'Z');MODE08.stage(h,4);return [a,Game.ultId,h.md.fam]});console.log('story',st);await p.waitForTimeout(800);await shot('18-histoire-mode-otsutsuki');
console.log('ERRORS',errs.length,errs.slice(0,8));await b.close();})();
