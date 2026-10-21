const {chromium}=require('playwright-core');const PFX=process.argv[2]||'after';const SH='/workspace/two-blue-vortex/screens/'+(process.env.D||'v09')+'/';const COL=process.argv[3]||'purple';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);await p.evaluate((c)=>{const e=document.getElementById('crea8');if(e)e.style.display='none';Voie.me.susC=c;const h=Game.hero;for(const f of World.foes())f.gone=true;MODE08.enter(h,'C',1)},COL);
const nm=['','','','','','1-cotes','2-squelette','3-humanoide','4-samourai','5-parfait'];
for(let s=5;s<=9;s++){await p.evaluate((s)=>{MODE08.stage(Game.hero,s)},s);await p.waitForTimeout(500);if(s===8)await p.screenshot({path:SH+PFX+'-susanoo-assemblage.png'});await p.waitForTimeout(1300);await p.screenshot({path:SH+PFX+'-susanoo'+(COL!=='purple'?'-'+COL:'')+'-'+nm[s]+'.png'});
 if(s===8){await p.evaluate(()=>{Game.hero.susSw=1});await p.waitForTimeout(110);await p.screenshot({path:SH+PFX+'-susanoo-coup-epee.png'});}}
console.log(PFX,'errs',errs.length,errs.slice(0,4));await b.close()})();
