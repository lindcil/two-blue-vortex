const {chromium}=require('playwright-core');const PFX=process.argv[2]||'before';const SH='/workspace/two-blue-vortex/screens/v09/';
const LIST=(process.argv[3]||'housenka,karyu,kamaitachi,shinkugyoku,teppodama,suiro,raikyu,raiju,doryudan,gokakyu,rasen,chidori').split(',');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);await p.evaluate(()=>{const c=document.getElementById('crea8');if(c)c.style.display='none'});
for(const id of LIST){await p.evaluate((id)=>{const h=Game.hero;for(const f of World.foes())f.gone=true;World.foes_=World.foes_.filter(f=>!f.gone);for(let i=0;i<3;i++){const f=spawnFoe('bandit',h.x+260+i*60,h.y-40+i*40);f.passive=0;f.st.stun=99;}h.ch=999;h.cd={};h.act=null;h.iframe=9;Game.cine=false;h.face=1;h.aimA=0;castSkill(h,SK[id],id,true)},id);await p.waitForTimeout(800);console.log(id,await p.evaluate(()=>[Proj.length,Game.hero.lastVar8,Game.hero.act&&Game.hero.act.k,JSON.stringify(Game.hero.cd)]));
 for(const [d,n] of [[260,'a'],[300,'b'],[350,'c']]){await p.waitForTimeout(d);await p.screenshot({path:SH+PFX+'-'+id+'-'+n+'.png'})}await p.waitForTimeout(900);}
console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
