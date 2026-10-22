// Bot : joue l'Histoire de bout en bout (se rend à chaque objectif, bat les boss, passe les dialogues) puis les missions de Ta voie.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
const res=await p.evaluate(async()=>{const log=[];window.SMOOTH10&&(SMOOTH10.manual=true);const step=(n)=>{for(let i=0;i<n;i++){if(Talk.on){Talk.t=1;if(Talk.showing)Talk.pick(0);else Talk.next()}Game.update(1/30)}};
 const go=(x,y)=>{const h=Game.hero;h.x=x;h.y=y;h.vx=h.vy=0;h.hp=h.maxHp;};
 const beat=(f)=>{const t=World.foes_.filter(f);for(const e of t){e.hp=Math.min(e.hp,e.maxHp*0.25);hurt(e,1,Game.hero,{})}};
 Game.start(true);Game.go&&0;step(10);let last='',stuck=0;
 for(let k=0;k<400&&Histoire.step!=='end';k++){const s=Histoire.step;if(s!==last){log.push('H '+s);last=s;stuck=0}else stuck++;if(stuck>60){log.push('BLOQUÉ '+s+' '+JSON.stringify(World.foes_.filter(f=>f.tag).map(f=>[f.tag,f.hp|0,!!f.gone,!!f.passive,f.x|0,f.y|0])));break}
  const t=Histoire.target();if(s==='c2'&&Game.jura)go(Game.jura.x,Game.jura.y+40);else if(t)go(t[0],t[1]);
  const live=World.foes_.filter(f=>!f.gone&&f.hp>0&&!f.passive&&Histoire.allowAggro(f));if(live.length&&(['p1','p2','p3','c1','c3','k1','k3'].includes(s))){for(const e of live){go(e.x-40,e.y);hurt(e,e.maxHp*0.3,Game.hero,{el:'fire'});}}
  step(6)}
 log.push('fin histoire: '+Histoire.step);
 Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});step(10);const V=Voie;last='';stuck=0;const W8=()=>new Promise(r=>setTimeout(r,20));
 for(let k=0;k<1500;k++){if(window.Scene&&Scene.on){Scene.skip=true;step(2);await W8();if(++k%200==0)log.push('scène longue '+V.step);continue}const s=V.step;if(s!==last){log.push('V '+s+' '+V.rank);last=s;stuck=0}else stuck++;if(stuck>120){log.push('V BLOQUÉ '+s+' '+JSON.stringify(V.obj()));break}
  const t=V.target();if(t&&!['a6'].includes(s))go(t[0],t[1]+20);const yard=World.foes_.filter(f=>f.tag==='yard'&&!f.gone);
  if(s==='a1'&&!Talk.on){if(!yard.length)log.push('a1 sans mannequin');for(const d of yard)V.onHit(d,{isHero:1,act:{k:'m1'}})}
  if(s==='a2'&&!Talk.on)V.onLessonDodge();if(s==='a3'&&!Talk.on){V.flags.l3t=1;V.flags.l3c=1;V.checkL3&&V.checkL3()}
  if((s==='a5'||s==='birth')&&!Talk.on&&stuck%10==5)V.talkIruka&&V.talkIruka();
  if(s==='a6'&&!Talk.on){const se=World.foes_.find(f=>f.tag==='sensei'&&!f.gone);if(se){go(se.x,se.y);if(stuck%5==0)V.tag(se)}}
  if(s==='free'&&!V.mis&&!Talk.on&&stuck%10==5){V.mis=Object.assign({id:'chat'},MISSIONS.chat);V.finishMission()}
  for(const e of World.foes_.filter(f=>!f.gone&&f.hp>0&&!f.passive&&V.allowAggro(f)&&f.tag&&f.tag!=='yard'&&f.tag!=='sensei'))hurt(e,e.maxHp*0.25,Game.hero,{});
  Game.hero.hp=Game.hero.maxHp;step(6);await W8();if(V.step==='fin')break}
 log.push('fin voie: '+V.step+' '+V.rank+' k'+JSON.stringify(World.foes_.filter(f=>f.tag).map(f=>[f.tag,f.hp|0,!!f.gone,!!f.passive,f.x|0,f.y|0]))+' hero '+(Game.hero.x|0)+','+(Game.hero.y|0)+' scene '+(window.Scene&&Scene.on)+' talk '+Talk.on);V.step='free';V.rank='jonin';
 for(const id of Object.keys(MISSIONS)){V.items=[];World.foes_=World.foes_.filter(f=>f.tag!=='mis');V.mis=Object.assign({id},MISSIONS[id]);V.setupMission(V.mis,false);const d0=V.done;let ok=0;
  for(let k=0;k<200&&V.mis;k++){if(id==='chat'&&V.cat){V.cat.onTalk&&V.cat.onTalk()}else{const it=V.items[0];if(it)go(it.x,it.y);else{const t=V.target();if(t)go(t[0],t[1]);for(const e of World.foes_.filter(f=>f.tag==='mis'&&!f.gone&&f.hp>0))hurt(e,e.maxHp*2,Game.hero,{})}}step(4)}
  log.push('mission '+id+(V.mis?' BLOQUÉE':' ok'));V.mis=null}
 return log});
await p.evaluate(()=>{if(window.LANG10&&typeof MISSIONS!=='undefined')for(const m of Object.values(MISSIONS)){LANG10.t(m.r+' · '+m.n);LANG10.t(m.d);LANG10.t(m.n)}});console.log(res.join('\n'));console.log('MISS',JSON.stringify(await p.evaluate(()=>window.LANG10?[...LANG10.miss]:[])));console.log('CMISS',JSON.stringify(await p.evaluate(()=>window.LANG10&&LANG10.cmiss?[...LANG10.cmiss]:[])));console.log('errs',errs.length,errs.slice(0,4));await b.close()})();
