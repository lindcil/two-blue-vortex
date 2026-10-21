const {chromium}=require('playwright-core');const PFX=process.argv[2]||'after';const SH='/workspace/two-blue-vortex/screens/v10/mode10/';require('fs').mkdirSync(SH,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);
// pas manuel : la boucle rAF est suspendue, on avance image par image (1/60 s)
await p.evaluate(()=>{clearInterval(window.__au);const e=document.getElementById('crea8');if(e)e.style.display='none';window.SMOOTH10&&(SMOOTH10.manual=true);window.STEPN=(n)=>{for(let i=0;i<n;i++)Game.update(1/60);Game.render();};});
const setup=()=>p.evaluate(()=>{try{if(Talk.on)Talk.close&&Talk.close()}catch(e){}Talk.on=false;Game.cine=false;Game.paused=false;const h=Game.hero;h.hp=h.maxHp;h.combat=true;h.act=null;h.vx=h.vy=0;for(const f of World.foes_)f.gone=true;const f=spawnFoe('bandit',h.x+75,h.y,{});f.hp=f.maxHp=99999;f.aggro=false;f.passive=false;f.st.stun=99;window.__f=f;h.face=1;h.aimA=0;window.aimAt=()=>0;Cam.x=h.x+40;Cam.y=h.y-30;STEPN(2);});
const shot=async(n)=>p.screenshot({path:SH+PFX+'-'+n+'.png',clip:{x:340,y:160,width:600,height:400}});const L=await p.evaluate(()=>{const o=[];for(const id in SK)if(SK[id].m8&&/_0_0$|_0_1$|_3_0$|_1_0$/.test(id))o.push(id);return o.slice(0,14)});
for(const id of L){await setup();const ok=await p.evaluate((id)=>{const h=Game.hero;h.ch=999;h.cd={};castSkill(h,SK[id],id,false);return !!(h.act&&h.act.pose10)},id);
 for(const [k,F] of [['a-anticipation',8],['b-frappe',14],['c-suite',6]]){await p.evaluate((d)=>STEPN(d),F);await shot(id.replace(/^m8_/,'')+'-'+k);}console.log(id,ok);await p.evaluate(()=>STEPN(40));}

console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
