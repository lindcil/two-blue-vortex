const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1400;c.height=560;c.id='tc';c.style='position:fixed;left:0;top:0;z-index:99;background:#1b2238';document.body.appendChild(c)});
for(let t=0;t<12;t++){await p.evaluate(t=>{const g=document.getElementById('tc').getContext('2d');g.clearRect(0,0,1400,560);[1,2,3,4,5].forEach((l,i)=>{g.save();g.translate(0,0);MODE08.drawSusanoo(g,140+i*280,520,l,'#d0283a',{t:t*0.1,build:1,face:1,back:true});g.restore()})},t);}
await p.waitForTimeout(200);await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/ui/susanoo-dos.png',clip:{x:0,y:0,width:1400>1280?1280:1400,height:560}});
await p.evaluate(()=>{const g=document.getElementById('tc').getContext('2d');g.clearRect(0,0,1400,560);[1,2,3,4,5].forEach((l,i)=>MODE08.drawSusanoo(g,140+i*250,520,l,'#d0283a',{t:1,build:1,face:1}))});await p.screenshot({path:'/workspace/two-blue-vortex/screens/v10/ui/susanoo-face.png',clip:{x:0,y:0,width:1280,height:560}});
console.log('errs',errs);await b.close()})();
