// Outside mission: accept moves team inside the great gate; compass routes via gate when target is across the wall.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close()},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));while(Talk.on){Talk.next();await W8(100)}ZONE8.exit({instant:true});Voie.rank='genin';Voie.set('free');const h=Game.hero;const D=Voie.desk;h.x=D.x;h.y=D.y+40;await W8(300);
 const o={};const rnd0=Math.random;Math.random=()=>0;Voie.board();await W8(200);o.opts=Talk.opts||null;const i=(Talk.opts||[]).findIndex(s=>/Bandits|bandits/.test(s));Math.random=rnd0;
 if(i<0){Talk.on=false;Voie.mis=Object.assign({id:'bandits'},MISSIONS.bandits);Voie.setupMission(Voie.mis);o.forced=1;if(window.V07)V07.tp(1600,WALL_Y-140)}else{Talk.pick(i);}
 await W8(400);while(Talk.on){Talk.next();await W8(100)}o.stepAfter=Voie.step;Voie.step='free';o.mis=Voie.mis&&Voie.mis.id;o.hero=[Math.round(h.x/K10),Math.round(h.y/K10)];o.tgt=Voie.target().map(v=>Math.round(v/K10));o.mtx=[Voie.mis.tx,Voie.mis.ty].map(v=>Math.round(v/K10));o.step=Voie.step;
 h.x=K10*900;h.y=K10*1500;await W8(200);o.tgtFarInside=Voie.target().map(v=>Math.round(v/K10));return o});
console.log(JSON.stringify(r),errs);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/np/gate-route.png'});await b.close()})();
