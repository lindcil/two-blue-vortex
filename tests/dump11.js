const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});});await p.waitForTimeout(1500);
await p.evaluate(()=>{for(const k of Object.keys(UI))if(/^t_/.test(k)){try{const h=UI[k]();if(typeof h==='string'){const d=document.createElement('div');d.className='dumpx';d.innerHTML=h;document.body.appendChild(d)}}catch(e){}}});await p.waitForTimeout(300);
const r=await p.evaluate(()=>{const S=new Set();const D=LANG10.DATA.en;const add=(t)=>{t=t.trim();if(t&&/[a-zà-ÿ]{3}/i.test(t)&&!D[t])S.add(t)};
  const w=(n)=>{if(n.nodeType===3){if(n.parentNode&&n.parentNode.tagName!=='SCRIPT'&&n.parentNode.tagName!=='STYLE')add(n.textContent)}else for(const c of n.childNodes)w(c)};w(document.body);return [...S]});
console.log(JSON.stringify(r.map(s=>s.slice(0,90)),null,0),errs);await b.close()})();
