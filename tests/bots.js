const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
for(const mode of ['spam','good','spam','good']){const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message.slice(0,120)+(e.stack||'').split('\n')[1]));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},250)});
const t0=Date.now();while(Date.now()-t0<40000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
const r=await p.evaluate(async(mode)=>{clearInterval(window.__au);Voie.rank='chunin';Voie.step='free';Game.cine=false;const h=Game.hero;ZONE8.room=null;ZONE8.sec=null;h.x=K10*2850;h.y=K10*1300;h.hp=h.maxHp;h.ch=h.maxCh;h.iframe=0;World.foes_=[];
 for(const [t,dx,dy] of [['bandit',260,-60],['bandit',300,80],['deserter',420,0],['stormer',380,-140]]){const f=spawnFoe(t,h.x+dx,h.y+dy,{});f.aggro=true;}
 const near=()=>World.foes().filter(f=>f.hp>0&&!f.passive).sort((a,b)=>dist(a,h)-dist(b,h))[0];
 let skI=0;const iv=setInterval(()=>{if(h.hp<=0)return;Game.cine=false;const f=near();if(!f)return;const d=dist(f,h),a=Math.atan2(f.y-h.y,f.x-h.x);
  if(mode==='spam'){if(d>70){h.vx=Math.cos(a)*260;h.vy=Math.sin(a)*260}if(!h.act)startM1(h,0);else if(h.act.k==='m1'&&h.act.n<2&&h.act.t>h.act.dur*0.3)h.act.next=true;return;}
  // bon joueur
  const thr=World.foes().find(o=>o.hp>0&&o.act&&o.act.k==='wind'&&dist(o,h)<(FOE[o.type].ranged?400:140));
  if(thr&&!h.cd.dodge&&(!h.act||h.act.k!=='dash')){h.face=thr.x<h.x?1:-1;dodge(h);return}
  if(Game.ultV>=100&&!Cine.on&&d<300){castUlt(h);return}
  if(!h.act){for(let i=0;i<4;i++){const id=Game.skills[(skI+i)%4];const S=SK[id];if(S&&!(h.cd[id]>0)&&h.ch>=S.ch&&d<330&&!Game.skillLock(id)){skI++;h.aimA=a;castSkill(h,S,id,true);return}}}
  if(h.ch<30&&d>260){h.vx=0;h.vy=0;h.ch=Math.min(h.maxCh,h.ch+3);return}
  if(f.guardT>0||((h.m1c||0)>=3&&Game.t-(h.m1t||0)<1)){h.vx=-Math.cos(a)*240;h.vy=-Math.sin(a)*240;return}
  if(d>70){h.vx=Math.cos(a)*260;h.vy=Math.sin(a)*260}else if(!h.act)startM1(h,0);else if(h.act.k==='m1'&&h.act.n<1&&h.act.t>h.act.dur*0.3)h.act.next=true;},50);
 const T0=performance.now();while(performance.now()-T0<100000){await new Promise(r=>setTimeout(r,250));if(h.hp<=0||Game.downing){clearInterval(iv);return {res:'PERDU',t:Math.round((performance.now()-T0)/1000),left:World.foes().filter(f=>f.hp>0).length}}if(!World.foes().some(f=>f.hp>0&&!f.passive)){clearInterval(iv);return {res:'GAGNÉ',t:Math.round((performance.now()-T0)/1000),hp:Math.round(h.hp/h.maxHp*100)+'%'}}}
 clearInterval(iv);return {res:'TEMPS',left:World.foes().filter(f=>f.hp>0).map(f=>Math.round(f.hp))};},mode);
console.log(mode,JSON.stringify(r));await p.close();}
console.log('ERR',errs.length,errs.slice(0,4));await b.close()})();
