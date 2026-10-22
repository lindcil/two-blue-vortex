const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));const cdp=await ctx.newCDPSession(p);
const D='/workspace/two-blue-vortex/screens/v10/np/tap-';const R={};
const drag=async(x0,y0,x1,y1,ms)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*i/5,y:y0+(y1-y0)*i/5}]});await p.waitForTimeout(ms);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})};
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1500);R.layoutPrompt=!!(await p.$('#lay07'));R.touchUI=await p.evaluate(()=>getComputedStyle(document.querySelector('#touch')).display);
await p.screenshot({path:D+'0-titre.png'});const bb=await p.$('#bNew');await bb.tap();await p.waitForTimeout(2500);await p.screenshot({path:D+'1-debut.png'});
// avancer le dialogue en tapant
let taps=0;for(let i=0;i<40;i++){const st=await p.evaluate(()=>({talk:Talk.on,scene:window.Scene&&Scene.on,cine:Game.cine,hint:(document.querySelector('#talk i')||{}).textContent}));if(i===1){R.talkHint=st.hint;await p.screenshot({path:D+'2-dialogue.png'})}if(!st.talk&&!st.scene&&!st.cine)break;await p.touchscreen.tap(195,600);taps++;await p.waitForTimeout(450)}
R.tapsToPlay=taps;R.state=await p.evaluate(()=>[Talk.on,window.Scene&&Scene.on,Game.cine,Story.obj&&Story.obj()]);
const s=await p.evaluate(()=>{const r=document.querySelector('#touch .stick').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]});const h0=await p.evaluate(()=>[Game.hero.x,Game.hero.y]);
await drag(s[0],s[1],s[0],s[1]-60,1200);const h1=await p.evaluate(()=>[Game.hero.x,Game.hero.y]);R.stickMoved=Math.round(Math.hypot(h1[0]-h0[0],h1[1]-h0[1]));
const atk=await p.evaluate(()=>{const r=document.querySelector('#touch .tb[data-a=atk]').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]});
await p.evaluate(()=>{window.__a=0;const o=Input.pressed.bind(Input);Input.pressed=function(k){const v=o(k);if(v&&k==='atk')__a++;return v}});await p.touchscreen.tap(atk[0],atk[1]);await p.waitForTimeout(400);R.atkTap=await p.evaluate(()=>__a);
await p.screenshot({path:D+'3-jeu.png'});R.errs=errs;console.log(JSON.stringify(R,null,1));await b.close()})();
