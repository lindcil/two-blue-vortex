const {chromium}=require('playwright-core');const PFX=process.argv[2];const SH='/workspace/two-blue-vortex/screens/v10/anim/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);
const setup=()=>p.evaluate(()=>{const e=document.getElementById('crea8');if(e)e.style.display='none';const h=Game.hero;h.hp=h.maxHp||999;h.combat=true;const fs=World.foes();fs.forEach((f,i)=>{if(i>0)f.gone=true});const f=fs[0];if(f){f.x=h.x+70;f.y=h.y;f.hp=f.maxHp=99999;f.passive=false;f.act=null;f.vx=f.vy=0;f.stunT=9;}h.face=1;h.aimA=0;window.__f=f;});
const slow=(v)=>p.evaluate((v)=>{window.__ts=v;if(!window.__wr){window.__wr=1;const up=Game.update.bind(Game);Game.update=function(dt){return up(dt*(window.__ts??1))}}},v);
await setup();await slow(0.08);
for(const n of [0,1,2]){await setup();await p.evaluate((n)=>{const h=Game.hero;window.aimAt=()=>0;startM1(h,n);h.act.a=0},n);
 for(const [k,ms] of [['a-anticipation',110],['b-frappe',90],['c-suite',300]]){await p.waitForTimeout(ms);await p.screenshot({path:SH+PFX+'-m1-'+(n+1)+'-'+k+'.png'});}
 await p.waitForTimeout(600);}
await setup();await p.evaluate(()=>{const h=Game.hero;h.cd.dodge=0;dodge(h);h.act.a=0;h.vx=920;h.vy=0});
for(const [k,ms] of [['a-depart',60],['b-milieu',140],['c-glissade',260]]){await p.waitForTimeout(ms);await p.screenshot({path:SH+PFX+'-dash-'+k+'.png'});}
await p.waitForTimeout(600);await setup();await p.evaluate(()=>{const h=Game.hero;h.kawa=1.8;hurt(h,10,window.__f,{k:0.4})});
for(const [k,ms] of [['a-fumee',60],['b-buche',250]]){await p.waitForTimeout(ms);await p.screenshot({path:SH+PFX+'-kawarimi-'+k+'.png'});}
await slow(1);await p.evaluate(()=>{const h=Game.hero;h.act=null;h.vx=420;h.vy=0;});await p.waitForTimeout(40);await p.screenshot({path:SH+PFX+'-course.png'});
await p.evaluate(()=>{const f=window.__f;f.guardT=2;f.act=null;Game.hero.x=f.x-90});await p.waitForTimeout(150);await p.screenshot({path:SH+PFX+'-garde.png'});
console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
