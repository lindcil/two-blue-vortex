const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/look/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});});await p.waitForTimeout(800);
const a=await p.evaluate(`(()=>{const c=document.createElement('canvas');c.width=8*170;c.height=2*300;const g=c.getContext('2d');g.fillStyle='#1b2238';g.fillRect(0,0,c.width,c.height);const h=Game.hero;
 for(let k=0;k<8;k++){const hd=k*Math.PI/4;h.hd=hd;const face=Math.cos(hd)<-0.01?-1:1;
  g.save();g.translate(k*170+85,270);g.scale(0.5,0.5);try{MODE08.drawSusanoo(g,0,0,3,'#7a4ad8',{t:1,build:1,sw:0,face})}catch(e){console.error(e.message)}g.restore();
  g.save();g.translate(k*170+85,570);g.scale(0.5,0.5);try{MODE08.drawBeast(g,0,0,'#ff8a2a',{t:1,build:1,face})}catch(e){console.error(e.message)}g.restore();
  g.fillStyle='#cfd8ee';g.font='14px sans-serif';g.fillText(['→','↘','↓','↙','←','↖','↑','↗'][k],k*170+8,18)}
 return c.toDataURL()})()`);
require('fs').writeFileSync(SH+'geants-8directions.png',Buffer.from(a.split(',')[1],'base64'));console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
