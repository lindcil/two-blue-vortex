// Real-input Voie onboarding: new game -> dummies -> dodge -> technique -> rival -> team -> sensei bells -> mission board -> first mission.
const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/np/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,150))});
await p.addInitScript(()=>{window.__nan=[];const iv=setInterval(()=>{if(typeof spawnFoe!=='function')return;clearInterval(iv);const sf=spawnFoe;spawnFoe=function(t){const u=sf.apply(this,arguments);if(t==='sensei'){let hp=u.hp,gone=u.gone;Object.defineProperty(u,'hp',{get(){return hp},set(v){if(!Number.isFinite(v)||v<=0)window.__nan.push('hp='+v+' '+new Error().stack.split('\n').slice(2,6).join(' | '));hp=v},configurable:true});Object.defineProperty(u,'gone',{get(){return gone},set(v){if(v)window.__nan.push('gone '+new Error().stack.split('\n').slice(2,6).join(' | '));gone=v},configurable:true})}return u}},50)});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');await p.click('#bNewV');await p.waitForTimeout(1200);await p.click('#cGo');
const seen={};let last='',stuck=0;const T0=Date.now();
for(let it=0;it<900&&Date.now()-T0<+(process.env.TL||330000);it++){
 const s=await p.evaluate(()=>{const h=Game.hero,V=Voie;const sc=Math.min(Math.max(innerWidth/1150,0.62),1.25)*Cam.z;const scr=(o)=>[innerWidth/2+(o.x-Cam.x)*sc,innerHeight/2+(o.y-30-Cam.y)*sc];
  const S=V.step;let t=null,mode='walk';const F=World.foes().filter(f=>f.hp>0&&!f.gone);
  if(S==='a1'||S==='a3'){t=F.filter(f=>f.tag==='yard').sort((a,b)=>dist(a,h)-dist(b,h))[0];mode=S==='a1'?'m1':'s1'}
  else if(S==='a2'){t={x:h.x,y:h.y};mode='dodge';const pr=Proj.find(q=>q.lesson&&Math.hypot(q.x-h.x,q.y-h.y)<140);if(!pr)mode='wait'}
  else if(S==='a4'||S==='a6'){t=F.filter(f=>f.tag==='rival'||f.tag==='sensei')[0];mode='fight'}
  else if(S==='a5'){t=V.iruka;mode='use'}
  else{const g=V.target&&V.target();if(g)t={x:g[0],y:g[1]};mode=V.mis?'fight':'use';const n=F.filter(f=>!f.passive&&!f.dummy).sort((a,b)=>dist(a,h)-dist(b,h))[0];if(n&&dist(n,h)<400){t=n;mode='fight'}}
  return {S,les:V.lesson,mis:V.mis&&V.mis.id,got:V.mis&&V.mis.got,talk:Talk.on,ch:!!Talk.showing,scene:!!(window.Scene&&Scene.on),cine:!!Game.cine,t:t?[t.x-h.x,t.y-h.y,Math.hypot(t.x-h.x,t.y-h.y)]:null,sp:t?scr(t):null,mode,hp:Math.round(h.hp/h.maxHp*100),obj:document.body.innerText.match(/(ACADEMY|ACADÉMIE|MISSION)[^\n]*\n[^\n]*/)?.[0]}});
 globalThis.__ls=s; const key=s.S+(s.mis||'');if(!seen[key]){seen[key]=1;console.log((Date.now()-T0)/1000|0,'s','step',s.S,'mis',s.mis,'obj',JSON.stringify(s.obj));await p.screenshot({path:SH+'voie1-'+key+'.png'})}
 if(s.scene){await p.keyboard.press('Escape');const sk=await p.$('#scnskip');if(sk&&await sk.isVisible().catch(()=>0))await sk.click().catch(()=>{});await p.waitForTimeout(300);continue}
 if(s.talk){if(s.ch)await p.keyboard.press('Digit1');await p.keyboard.press('KeyE');await p.waitForTimeout(350);continue}
 if(s.cine){await p.waitForTimeout(200);continue}
 if(s.S==='free'&&s.mis===null&&seen.freeMisDone)break;
 const sig=JSON.stringify([s.S,s.les,s.mis,s.got]);if(sig===last)stuck++;else{stuck=0;last=sig}
 if(!s.t){await p.waitForTimeout(200);continue}
 const near=s.mode==='use'?50:s.mode==='fight'?90:60;
 if(s.t[2]>near&&s.mode!=='dodge'&&s.mode!=='wait'){const k=[];if(s.t[0]>20)k.push('ArrowRight');if(s.t[0]<-20)k.push('ArrowLeft');if(s.t[1]>20)k.push('ArrowDown');if(s.t[1]<-20)k.push('ArrowUp');for(const x of k)await p.keyboard.down(x);await p.waitForTimeout(s.S==='a6'?120:Math.min(400,60+s.t[2]/2));for(const x of k)await p.keyboard.up(x);if(s.mode==='use'||s.t[2]>(s.S==='a6'?130:250))continue}
 if(s.mode==='dodge'){await p.keyboard.down('ArrowUp');await p.keyboard.press('KeyQ');await p.keyboard.up('ArrowUp');await p.waitForTimeout(250);continue}
 if(s.mode==='wait'){await p.waitForTimeout(120);continue}
 await p.mouse.move(s.sp[0],s.sp[1]);
 if(s.mode==='use'){await p.keyboard.press('KeyE');await p.waitForTimeout(300)}
 else if(s.mode==='s1'){await p.keyboard.press('Digit1');await p.waitForTimeout(500)}
 else{const r=it%7;if(r===3)await p.keyboard.press('Digit1');else if(r===5)await p.keyboard.press('Digit2');else{await p.mouse.down();await p.waitForTimeout(50);await p.mouse.up()}await p.waitForTimeout(220)}
 if(s.S==='free'&&s.mis)seen.freeMisDone=0; if(s.S==='free'&&!s.mis&&seen['freechat'+'']){}
 if((s.S==='a4'||s.S==='a6')&&it%25===0)console.log('A4',JSON.stringify(s.t),s.hp,JSON.stringify(await p.evaluate(()=>{const r=World.foes_.find(f=>f.tag==='rival'||f.tag==='sensei');const h=Game.hero;return r?[Voie.lesson,Math.round(Math.hypot(h.vx,h.vy)),Math.round(Math.hypot(r.vx||0,r.vy||0))].concat([Math.round(r.hp/r.maxHp*100),Math.round(r.x),Math.round(r.y),Math.round(h.x),Math.round(h.y),!!r.passive]):null})));
 if(stuck>0&&stuck%60===0)console.log('STUCK?',sig,JSON.stringify(s))}
console.log('NAN',JSON.stringify(await p.evaluate(()=>window.__nan.slice(0,6))));console.log('LAST',JSON.stringify(globalThis.__ls),JSON.stringify(await p.evaluate(()=>World.foes_.filter(f=>f.tag==='sensei').map(f=>({hp:f.hp,gone:f.gone,x:Math.round(f.x),y:Math.round(f.y),inF:World.foes().includes(f),pas:f.passive})))));const e=await p.evaluate(()=>[Voie.step,Voie.mis&&Voie.mis.id,Voie.done,Voie.rank]);console.log('end',JSON.stringify(e),'secs',(Date.now()-T0)/1000|0);await p.screenshot({path:SH+'voie1-fin.png'});console.log('errs',errs.slice(0,5));await b.close()})();
