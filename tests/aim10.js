const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
await p.evaluate(()=>{clearInterval(window.__au);const h=Game.hero;ZONE8.room=null;h.x=K10*2850;h.y=K10*1300;Cam.x=h.x;Cam.y=h.y;World.foes_=[];Voie.step='free';});await p.waitForTimeout(500);
await p.mouse.move(640+300,360-200);await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const h=Game.hero,out={};const deg=(a)=>Math.round(a*180/Math.PI);const [cx,cy]=AIM10.mw();out.cursor=deg(Math.atan2(cy-(h.y-40),cx-h.x));out.free=deg(aimAt(h));
 const f=spawnFoe('bandit',cx+60,cy+40,{});f.aggro=true;out.snap=deg(aimAt(h));out.toFoe=deg(Math.atan2(f.y-30-(h.y-40),f.x-h.x));
 const g=spawnFoe('bandit',h.x-300,h.y+50,{});out.ignoreFar=deg(aimAt(h));startM1(h,0);out.m1=deg(h.act.a);
 Input.touch=true;out.touchNearest=deg(aimAt(h));out.toG=deg(Math.atan2(g.y-h.y,g.x-h.x));Input.touch=false;Save.set.aim=false;out.off=deg(aimAt(h));Save.set.aim=true;return out});
console.log(JSON.stringify(r));const ok=Math.abs(r.free-r.cursor)<3&&Math.abs(r.snap-r.toFoe)<3&&Math.abs(r.m1-r.toFoe)<3&&Math.abs(r.touchNearest-r.toG)<3;console.log(ok?'AIM OK':'AIM KO','errs',errs);await b.close();process.exit(ok?0:1)})();
