const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const mob=!!process.env.MOB;const p=await b.newPage(mob?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));
const D='/workspace/two-blue-vortex/screens/v10/np/'+(mob?'mob-':'');require('fs').mkdirSync('/workspace/two-blue-vortex/screens/v10/np',{recursive:true});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1500);let i=0;const s=async(n)=>{await p.screenshot({path:D+(i++)+'-'+n+'.png'})};
await s('title');if(await p.$('#lay07')){await s('layout');await p.click('#lay1');await p.waitForTimeout(400)}
const btns=await p.evaluate(()=>[...document.querySelectorAll('#title button')].filter(b=>b.offsetParent).map(b=>b.id+':'+b.textContent));console.log(btns);
await p.evaluate(()=>{const b=[...document.querySelectorAll('#title button')].find(b=>/voie|path|new|nouvelle|play|jouer/i.test(b.textContent)&&b.offsetParent);b&&b.click()});await p.waitForTimeout(1200);await s('after-play');
for(let k=0;k<8;k++){const t=await p.evaluate(()=>{const v=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().width>0);return v.map(b=>b.id+':'+b.textContent.slice(0,20)).slice(0,12)});console.log(k,t);
 const clicked=await p.evaluate(()=>{const v=[...document.querySelectorAll('button')].filter(b=>b.offsetParent);const b=v.find(b=>/commencer|start|begin|confirm|valider|suivant|next|ok|continuer|continue|créer|create/i.test(b.textContent));if(b){b.click();return b.textContent}return null});await p.waitForTimeout(1500);await s('step'+k);if(!clicked)break}
for(let k=0;k<6;k++){await p.keyboard.press(mob?'Enter':'e');await p.waitForTimeout(1800);await s('play'+k)}
console.log('state',await p.evaluate(()=>[Game.mode,typeof Voie!=='undefined'&&Voie.step,Talk.on,Game.cine]));console.log('errs',errs);await b.close()})();
