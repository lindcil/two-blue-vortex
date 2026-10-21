const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/seals/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);
const png=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1300;c.height=420;const g=c.getContext('2d');g.fillStyle='#1b2238';g.fillRect(0,0,1300,420);const K=[...SEALS10.ORDER,'bunshin'];
 K.forEach((k,i)=>{SEALS10.drawSeal(g,60+i*98,150,k,3,'#8fd3ff',1);SEALS10.drawSeal(g,60+i*98,330,k,1.55,'#ff8a2a',0.8);g.fillStyle='#93a3c6';g.font='12px sans-serif';g.textAlign='center';g.fillText(k,60+i*98,400)});return c.toDataURL()});
require('fs').writeFileSync(SH+'planche-sceaux.png',Buffer.from(png.split(',')[1],'base64'));
if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','bunshin']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(2500);
await p.evaluate(()=>{clearInterval(window.__au);Talk.on=false;Game.cine=false;Game.paused=false;const e=document.getElementById('crea8');if(e)e.style.display='none';SMOOTH10.manual=true;window.STEPN=(n)=>{for(let i=0;i<n;i++)Game.update(1/60);Game.render()}});
const clip={x:390,y:110,width:500,height:400};
for(const id of ['gokakyu','bunshin']){await p.evaluate((id)=>{const h=Game.hero;h.act=null;h.ch=999;h.cd={};castSkill(h,SK[id],id,false)},id);for(const f of [3,9,15]){await p.evaluate((f)=>STEPN(f),f===3?3:6);await p.screenshot({path:SH+'jeu-'+id+'-'+f+'.png',clip})}await p.evaluate(()=>STEPN(60))}
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
