const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v07/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
const shot=async(n)=>{await p.screenshot({path:SH+n+'.png'});console.log('shot',n)};
const wf=async(js,t=30000)=>{const t0=Date.now();while(Date.now()-t0<t){if(await p.evaluate(js))return true;await p.waitForTimeout(150)}console.log('TIMEOUT',js);return false};
const auto=(on)=>p.evaluate((on)=>{clearInterval(window.__au);if(on)window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(window.__pick||0);else Talk.next()}},350)},on);
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);
if(await p.$('#lay07')){await shot('01-choix-touches');await p.click('#lay1')}
await p.evaluate(()=>{UI.open&&UI.open('touches')});await p.waitForTimeout(400);await shot('02-ecran-touches');await p.evaluate(()=>{const c=document.getElementById('bClose');c&&c.click()});
// Ta voie
await p.evaluate(()=>{Create.open();});await p.waitForTimeout(300);await shot('03-creation-clan-aleatoire');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)})});await auto(true);
await wf(()=>Scene.bg==='classroom'&&Scene.wipe<0.05);await p.waitForTimeout(600);await shot('10-scene-salle-de-classe');
await wf(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on);console.log('clan',await p.evaluate(()=>[Voie.me.clan,Voie.me.el,Game.skills.join(',')]));
await p.evaluate(()=>{Voie.step='a4';Voie.rivalDone('a4',{})});
await wf(()=>Scene.bg==='graduation'&&Scene.wipe<0.05);await p.waitForTimeout(500);await shot('11-ceremonie-diplome');
await wf(()=>Scene.bg==='rooftop'&&Scene.wipe<0.05);await p.waitForTimeout(1200);await shot('12-rencontre-equipe-presentations');
await p.evaluate(()=>window.__pick=1);await wf(()=>document.getElementById('scntitle').style.display==='block');await p.waitForTimeout(250);await shot('13-carton-nom-equipe');await p.evaluate(()=>window.__pick=0);
await wf(()=>Scene.bg==='bellfield'&&Scene.wipe<0.05);await p.waitForTimeout(500);await shot('14-terrain-clochettes');
await wf(()=>Voie.step==='a6'&&!Scene.on);await p.waitForTimeout(500);console.log('team',await p.evaluate(()=>[Voie.teamName(),Game.skills.join(','),Game.hero.hurtT,Game.cine]));await shot('15-test-clochettes-jeu');
// examen
await p.evaluate(()=>{Voie.rank='genin';Voie.step='free';Voie.set('x1')});
await wf(()=>Scene.bg==='examhall'&&Scene.wipe<0.05);await p.waitForTimeout(400);
await wf(()=>document.getElementById('scnq').style.display==='block');await p.waitForTimeout(800);await shot('20-examen-ecrit-salle');
for(const k of ['Digit1','Digit2','Digit2']){await p.keyboard.press(k);await p.waitForTimeout(300)}
await wf(()=>Scene.bg==='ichiraku'&&document.getElementById('scnq').style.display==='block');for(let i=0;i<14;i++){await p.keyboard.press('Space');await p.waitForTimeout(60)}await shot('21-ichiraku-ramen-qte');for(let i=0;i<20;i++){await p.keyboard.press('Space');await p.waitForTimeout(50)}
await wf(()=>Scene.bg==='arena'&&Scene.wipe<0.05);await p.waitForTimeout(600);await shot('22-arene-spectateurs');
await wf(()=>!Scene.busy&&!Talk.on,40000);await p.waitForTimeout(600);console.log('after exam',await p.evaluate(()=>[Voie.step,Math.round(Game.hero.x),Game.buffT|0]));
// carton de transition
await p.evaluate(()=>{Scene.skipTo('Le lendemain','TRANSITION',['examhall','ichiraku','arena'])});await p.waitForTimeout(900);await shot('23-transition-montage');await p.waitForTimeout(1500);
// bureau du Hokage
await p.evaluate(()=>{Talk.q=[];if(Talk.on)Talk.next();Voie.step='free';Voie.mis=null;window.__pick=3;clearInterval(window.__au);Voie.board()});await p.waitForTimeout(900);await shot('24-bureau-hokage');await p.evaluate(()=>Talk.pick(3));await auto(true);await p.evaluate(()=>window.__pick=0);await p.waitForTimeout(600);
// guerre
await p.evaluate(()=>{Voie.set('w1')});await wf(()=>Scene.bg==='warcamp'&&Scene.wipe<0.05);await p.waitForTimeout(500);await shot('25-camp-de-guerre');await wf(()=>!Scene.busy,30000);
await p.evaluate(()=>{World.foes_=[];Voie.step='free'});
// vignettes : toutes
const ids=await p.evaluate(()=>V07.VG.map(v=>v.id));
for(const id of ids){await p.evaluate((id)=>{V07.playVignette(id)},id);await wf(()=>Scene.bg&&Scene.wipe<0.05&&Talk.on);await p.waitForTimeout(400);
  const hasQ=await wf(()=>document.getElementById('scnq').style.display==='block'||!Scene.busy,8000);await p.waitForTimeout(500);await shot('3v-'+id);
  for(let i=0;i<8;i++){await p.keyboard.press('Space');await p.waitForTimeout(80)}await p.evaluate(()=>document.getElementById('scnskip').click());await wf(()=>!Scene.busy,15000);await p.evaluate(()=>{Talk.q=[];if(Talk.on){if(Talk.showing)Talk.pick(0);else Talk.next()}});await p.waitForTimeout(300)}
console.log('vign',await p.evaluate(()=>JSON.stringify([Scene.ev,Voie.me.st,Voie.bond])));
// techniques
await auto(false);await p.evaluate(()=>{Talk.q=[];if(Talk.on)Talk.next();Game.cine=false;const h=Game.hero;h.x=2850;h.y=1300;Cam.x=h.x;Cam.y=h.y;World.foes_=[];for(let i=0;i<5;i++)spawnFoe('kuro',h.x+180+i*40,h.y-60+i*30,{});});
const techs=await p.evaluate(()=>Object.keys(TECH07));
for(const [i,id] of techs.entries()){await p.evaluate((id)=>{const h=Game.hero;h.ch=h.maxCh=999;h.cd={};h.act=null;Game.cine=false;for(const f of World.foes_){f.hp=f.maxHp;f.passive=false}if(World.foes_.filter(f=>f.hp>0).length<3)for(let k=0;k<3;k++)spawnFoe('kuro',h.x+200,h.y-40+k*40,{});Game.skills[0]=id;castSkill(h,SK[id],id,true)},id);await p.waitForTimeout(id==='haisekisho'?1100:450);if(['housenka','karyu','haisekisho','kamaitachi','suijinheki','suiro','raikyu','raiju','doryuheki','doryudan','yomi','kaiten','kubishibari','nikudan','jukai','garoga','soshuha'].includes(id))await shot('4t-'+id);await p.waitForTimeout(400)}
// charge C → dojutsu ; Z → manteau
await p.evaluate(()=>{const h=Game.hero;h.ch=10;h.maxCh=200;World.foes_=[];Game.cine=false});await p.keyboard.down('KeyC');await p.waitForTimeout(2200);await shot('50-charge-chakra');await p.waitForTimeout(2400);await p.keyboard.up('KeyC');await p.waitForTimeout(300);await shot('51-dojutsu-active');
await p.keyboard.down('KeyW');await p.waitForTimeout(1800);await shot('52-charge-mode-Z');await p.waitForTimeout(2000);await p.keyboard.up('KeyW');await p.waitForTimeout(300);await shot('53-manteau-chakra');
console.log('modes',await p.evaluate(()=>[Game.hero.dojT|0,Game.hero.beastT|0,Game.hero.eyeFx]));
// sprint
await p.evaluate(()=>{const h=Game.hero;h.x=2000;h.y=1580;World.foes_=[]});await p.keyboard.down('ArrowRight');await p.waitForTimeout(2600);await shot('60-course-ninja-sprint');console.log('run',await p.evaluate(()=>[Game.hero.ninjaRun,Math.round(Math.hypot(Game.hero.vx,Game.hero.vy)),RUN07.amt.toFixed(2)]));await p.keyboard.up('ArrowRight');await p.waitForTimeout(200);await shot('61-derapage');
// dash clic droit
await p.mouse.click(640,360,{button:'right'});await p.waitForTimeout(80);console.log('dash',await p.evaluate(()=>Game.hero.act&&Game.hero.act.k));
// carte agrandie
await p.evaluate(()=>UI.open('carte'));await p.waitForTimeout(500);await shot('70-carte-agrandie');await p.evaluate(()=>document.getElementById('bClose').click());
await p.evaluate(()=>{const h=Game.hero;h.x=1600;h.y=3600;Cam.x=h.x;Cam.y=h.y});await p.waitForTimeout(600);await shot('71-ruines-du-sud');await p.evaluate(()=>{const h=Game.hero;h.x=4200;h.y=800;Cam.x=h.x;Cam.y=h.y});await p.waitForTimeout(600);await shot('72-sanctuaire-est');
// menu : retour aux jeux
await p.evaluate(()=>UI.open('journal'));await p.waitForTimeout(400);await shot('80-journal-nom-equipe-retour-jeux');await p.evaluate(()=>document.getElementById('bClose').click());
console.log('ERRS',errs.slice(0,12));await b.close()})()
