const {chromium}=require('playwright-core');const PFX=process.argv[2]||'after';const SH='/workspace/two-blue-vortex/screens/v10/anim2/';require('fs').mkdirSync(SH,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);
// pas manuel : la boucle rAF est suspendue, on avance image par image (1/60 s)
await p.evaluate(()=>{clearInterval(window.__au);const e=document.getElementById('crea8');if(e)e.style.display='none';window.SMOOTH10&&(SMOOTH10.manual=true);window.STEPN=(n)=>{for(let i=0;i<n;i++)Game.update(1/60);Game.render();};});
const setup=()=>p.evaluate(()=>{try{if(Talk.on)Talk.close&&Talk.close()}catch(e){}Talk.on=false;Game.cine=false;Game.paused=false;const h=Game.hero;h.hp=h.maxHp;h.combat=true;h.act=null;h.vx=h.vy=0;for(const f of World.foes_)f.gone=true;const f=spawnFoe('bandit',h.x+75,h.y,{});f.hp=f.maxHp=99999;f.aggro=false;f.passive=false;f.st.stun=99;window.__f=f;h.face=1;h.aimA=0;window.aimAt=()=>0;Cam.x=h.x+40;Cam.y=h.y-30;STEPN(2);});
const shot=async(n)=>p.screenshot({path:SH+PFX+'-'+n+'.png',clip:{x:340,y:160,width:600,height:400}});
for(const n of [0,1,2]){await setup();await p.evaluate((n)=>{startM1(Game.hero,n);Game.hero.act.a=0},n);const dur=[0.3,0.34,0.46][n];const hitF=Math.ceil(dur*0.32*60)+1;let f=0;
 for(const [k,F] of [['a-anticipation',Math.round(dur*0.2*60)],['b-frappe',hitF+1],['c-suite',Math.round(dur*0.62*60)]]){await p.evaluate((d)=>STEPN(d),F-f);f=F;const sm=await p.evaluate(()=>FX.P.filter(q=>q.k==='smear').length);console.log('m1',n,k,'frame',F,'smears',sm);await shot('m1-'+(n+1)+'-'+k);}
 await p.evaluate(()=>STEPN(40));}
await setup();await p.evaluate(()=>{const h=Game.hero;h.cd.dodge=0;dodge(h);h.act.a=0;h.vx=920;h.vy=0});for(const [k,f] of [['a-depart',2],['b-milieu',6],['c-glissade',9]]){await p.evaluate((f)=>STEPN(f),f);await shot('dash-'+k);}
await p.evaluate(()=>STEPN(30));await setup();await p.evaluate(()=>{const h=Game.hero;h.kawa=1.8;hurt(h,10,window.__f,{k:0.4})});for(const [k,f] of [['a-fumee',3],['b-buche',14]]){await p.evaluate((f)=>STEPN(f),f);await shot('kawarimi-'+k);}
await setup();await p.evaluate(()=>{const f=window.__f;f.guardT=2;f.st.stun=0;f.act=null;STEPN(6)});await shot('garde');
console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
