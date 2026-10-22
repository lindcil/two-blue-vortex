// Zonage : traverser tout le village (bureau → académie → marché → clans → porte) ne doit déclencher AUCUN changement de zone ; sortir par la porte : 1 seul.
const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/map/';require('fs').mkdirSync(SH,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
const r=await p.evaluate(()=>{clearInterval(window.__au);const h=Game.hero,K=K10;ZONE8.room=null;const route=[[1640,740],[2800,500],[1800,1500],[2800,1600],[4000,1200],[600,1600],[1600,2200],[1600,2600]];let ch=0,last=null,names=[];
 h.x=K*route[0][0];h.y=K*route[0][1];ZONE8.sec=null;
 for(let i=1;i<route.length;i++){const [tx,ty]=route[i].map(v=>v*K);for(let k=0;k<4000;k++){const dx=tx-h.x,dy=ty-h.y,L=Math.hypot(dx,dy);if(L<40)break;h.x+=dx/L*30;h.y+=dy/L*30;World.collide(h);if(Math.hypot(h.x-(h.x),0)>0){}const s=ZONE8.secAt(h.x,h.y);if(last&&s!==last){ch++;names.push(last.n+'→'+s.n+'@'+route[i])}last=s}}
 return {ch,names}});
console.log(JSON.stringify(r));const ok=r.ch===1;
await p.evaluate(()=>{const h=Game.hero;h.x=K10*1640;h.y=K10*760;Cam.x=h.x;Cam.y=h.y;ZONE8.sec=null;Talk.on=false});await p.waitForTimeout(1500);await p.screenshot({path:SH+'village-jour.png'});
console.log(ok?'ZONES OK':'ZONES KO','errs',errs);await b.close();process.exit(ok?0:1)})();
