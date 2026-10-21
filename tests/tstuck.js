const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text())});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{const w=(s)=>new Promise(r=>setTimeout(r,s*1000));const out=[];
for(const mode of ['voie','histoire']){ if(mode==='voie')Game.startVoie({name:'Test',clan:'nara',look:makeLook(3)});else Game.start(true);await w(0.5);
 while(Talk.on){Talk.next();await w(0.05)}
 const h=Game.hero;hurt(h,5,null,{});const a=h.hurtT;Talk.say([['A','b'],['C','d']]);await w(1);const during=h.hurtT;while(Talk.on){Talk.next();await w(0.05)}await w(0.5);
 out.push([mode,a,during,h.hurtT,Game.cine,h.P&&h.P.lean.toFixed(2)]);}
return out});console.log(JSON.stringify(r),errs);await b.close()})()
