const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/bg/';require('fs').mkdirSync(SH,{recursive:true});
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.screenshot({path:SH+'titre.png'});await p.click('#bBG');await p.waitForTimeout(400);await p.screenshot({path:SH+'menu.png'});
const MI=+(process.env.MI||0),SI=+(process.env.SI||0);await p.click(`#bg10 button[data-i="${MI}"][data-s="${SI}"]`);await p.waitForTimeout(3500);
console.log(await p.evaluate(()=>{const h=Game.hero,f=BG10.foe;return [Game.skills.join(','),Game.ultId,h.md&&h.md.fam,h.md&&h.md.st,f&&f.n,f&&f.hp,h.hp,Talk.on,Scene.on]}));
await p.evaluate(()=>{const h=Game.hero;let skI=0;window.__b=setInterval(()=>{const f=BG10.foe;if(!f||BG10.over||Game.paused)return;Game.cine=false;const d=dist(f,h),a=Math.atan2(f.y-h.y,f.x-h.x);
 if(Game.ultV>=100&&!Cine.on&&d<300){castUlt(h);return}
 if(!h.act){for(let i=0;i<4;i++){const id=Game.skills[(skI+i)%4];const S=SK[id];if(S&&!(h.cd[id]>0)&&h.ch>=(S.ch||0)&&d<330){skI++;h.aimA=a;castSkill(h,S,id,true);return}}}
 if(h.ch<30){h.ch=Math.min(h.maxCh,h.ch+3)}
 if(d>70){h.vx=Math.cos(a)*260;h.vy=Math.sin(a)*260}else if(!h.act)startM1(h,0);else if(h.act.k==='m1'&&h.act.n<1&&h.act.t>h.act.dur*0.3)h.act.next=true;},50)});
await p.waitForTimeout(6000);await p.screenshot({path:SH+`combat-${MI}-${SI}.png`});
const t0=Date.now();while(Date.now()-t0<120000){if(await p.evaluate(()=>BG10.over))break;await p.waitForTimeout(500)}
console.log(await p.evaluate(()=>[BG10.over,document.querySelector('#bg10r').innerText.replace(/\n/g,' | '),BG10.foe.hp|0,Game.hero.hp|0]));await p.screenshot({path:SH+`fin-${MI}-${SI}.png`});
console.log('errs',errs);await b.close()})();
