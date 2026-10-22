// Audit: every guarded global (typeof X / window.X / X.y && X.y()) must exist after boot + Voie start, else the guarded feature is silently dead.
const {chromium}=require('playwright-core');const ids=require('/tmp/ids.json');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)})});await p.waitForTimeout(3000);
const miss=await p.evaluate((ids)=>ids.filter(id=>{try{const v=(0,eval)(id.startsWith('window.')?id:'typeof '+id.split('.')[0]+"==='undefined'?undefined:"+id);return v===undefined||v===null}catch(e){return true}}),ids);
console.log(JSON.stringify(miss));await b.close()})();
