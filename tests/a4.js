const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});setInterval(()=>{if(window.Scene&&Scene.on)Scene.close();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{await new Promise(r=>setTimeout(r,1500));Voie.set('a4');World.foes_=World.foes_.filter(f=>f.tag!=='yard');Voie.spawnRival(K10*2250,K10*830,1);let R;for(let k=0;k<40&&!(R=World.foes_.find(f=>f.tag==='rival'));k++)await new Promise(r=>setTimeout(r,250));R=World.foes_.find(f=>f.tag==='rival');if(!R)return [Voie.step,Voie.pending,Talk.on,World.foes_.map(f=>f.tag+':'+f.type)];const h=Game.hero;const log=[];const oh=window.hurt;let dealt=0,taken=0,hits=[];
 window.hurt=function(t,d,s){const a=t.hp;const v=oh.apply(this,arguments);if(t===R)dealt+=a-t.hp;if(t===h){taken+=a-t.hp;hits.push(Math.round(a-t.hp))}return v};
 for(let i=0;i<40;i++){h.x=R.x-50;h.y=R.y;h.face=1;h.aimA=0;h.act=null;startM1(h,i%3);await new Promise(r=>setTimeout(r,380))}
 return {Rmax:R.maxHp,Rhp:Math.round(R.hp),dealt:Math.round(dealt),taken:Math.round(taken),hmax:h.maxHp,hits:hits.slice(0,12),hasM1:!!SK.m1}});
console.log(JSON.stringify(r));await b.close()})();
