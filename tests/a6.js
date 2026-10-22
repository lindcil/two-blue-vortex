const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{Voie.set('a5');World.foes_=World.foes_.filter(f=>f.tag!=='yard');await new Promise(r=>setTimeout(r,500));Voie.talkIruka();let S;for(let k=0;k<40&&!(S=World.foes_.find(f=>f.tag==='sensei'));k++)await new Promise(r=>setTimeout(r,250));if(!S)return ['nosensei',Voie.step];
 const h=Game.hero;const out=[];let sw=0,hitTry=0;const oh=window.hurt;let calls=0;window.hurt=function(t){if(t===S)calls++;return oh.apply(this,arguments)};
 for(let i=0;i<60;i++){const d=dist(h,S);if(d>60){h.x=S.x-45;h.y=S.y}h.act=null;startM1(h,i%3);sw++;await new Promise(r=>setTimeout(r,400));}
 return {lesson:Voie.lesson,step:Voie.step,sw,calls,iframe:S.iframe,act:S.act&&S.act.k,allies:Game.allies.length,ai:S.ai}});
console.log(JSON.stringify(r),errs);await b.close()})();
