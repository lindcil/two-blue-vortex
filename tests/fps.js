const {chromium}=require('playwright-core');const LABEL=process.argv[2]||'x';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.addInitScript(()=>{let s=12345;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}});await p.goto(''+(process.env.U||'file:///workspace/two-blue-vortex/index.html')+'');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),creative:1,el:'fire',sk:['rasen','chidori','gokakyu','karyu']});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
await p.waitForTimeout(2500);const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
await cdp.send('Profiler.enable');setTimeout(()=>cdp.send('Profiler.start'),4000);if(process.argv[4])await p.evaluate(process.argv[4]);const res=await p.evaluate(async()=>{const h=Game.hero;const ty=Object.keys(FOE).filter(k=>!FOE[k].boss&&!/dummy|sensei|bijuu/.test(k));
 for(let i=0;i<40;i++){const f=spawnFoe(ty[i%ty.length],h.x+Math.cos(i)*300+Math.random()*200,h.y+Math.sin(i)*200);}
 CREA8.sel='set_chibaku';document.getElementById('c8go').click();
 const iv=setInterval(()=>{h.hp=h.maxHp;h.iframe=9;h.ch=999;h.cd={};Game.cine=false;const ids=Game.skills;const id=ids[(window.__k=(window.__k||0)+1)%4];if(id&&SK[id]){h.act=null;h.aimA=Math.random()*6;try{fireSkill(h,SK[id],id)}catch(e){}}},250);
 await new Promise(r=>setTimeout(r,3400));
 const ou=Game.update.bind(Game),or=Game.render.bind(Game);let tu=0,tr=0,n=0,fr=0,mx=0;Game.update=function(dt){const t=performance.now();ou(dt);tu+=performance.now()-t};Game.render=function(){const t=performance.now();or();const d=performance.now()-t;tr+=d;n++;};
 let lt=performance.now();const fl=(now)=>{fr++;mx=Math.max(mx,now-lt);lt=now;if(window.__m)requestAnimationFrame(fl)};window.__m=1;requestAnimationFrame(fl);const t0=performance.now();
 const sv=setInterval(()=>{CREA8.sel=['set_chibaku','set_mekkyaku','set_kirin','set_tsunami'][(window.__si=(window.__si||0)+1)%4];document.getElementById('c8go').click()},3000);await new Promise(r=>setTimeout(r,10000));clearInterval(sv);window.__m=0;clearInterval(iv);const T=(performance.now()-t0)/1000;
 return {fps:+(fr/T).toFixed(1),update_ms:+(tu/n).toFixed(2),render_ms:+(tr/n).toFixed(2),frame_ms:+((tu+tr)/n).toFixed(2),worst_ms:+mx.toFixed(0),particles:FX.P.length,foes:World.foes().length,proj:Proj.length}});
if(process.argv[3]){const {profile}=await cdp.send('Profiler.stop');const self={};const dt=profile.timeDeltas;const idx={};profile.nodes.forEach(n=>idx[n.id]=n);profile.samples.forEach((s,i)=>{const n=idx[s];const k=n.callFrame.functionName+':'+n.callFrame.lineNumber;self[k]=(self[k]||0)+(dt[i]||0)});console.log(Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>k+' '+(v/1000|0)).join('\n'))}
console.log(LABEL,JSON.stringify(res),'errs',errs.length,errs.slice(0,3));await b.close()})();
