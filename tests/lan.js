const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(6000);
for(let i=0;i<8;i++){await p.evaluate(()=>{if(Scene.on)Scene.close()});await p.waitForTimeout(400)}
const L=await p.evaluate(()=>{ZONE8.exit&&ZONE8.exit({instant:true});const l=World.props.filter(p=>p.kind==='lantern');const h=Game.hero;const q=l.sort((a,b)=>Math.hypot(a.x-h.x,a.y-h.y)-Math.hypot(b.x-h.x,b.y-h.y))[0];return q&&[q.x,q.y,l.length]});console.log(L);
for(const [t,n] of [[12,'jour'],[22,'nuit']]){await p.evaluate(([x,y,t])=>{World.time=t;const h=Game.hero;h.x=x+60;h.y=y+40;Cam.z=1.6},[L[0],L[1],t]);await p.waitForTimeout(800);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/map/lanterne-'+n+'.png'})}
console.log('errs',errs);await b.close()})();
