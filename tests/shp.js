const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);
console.log(await p.evaluate(()=>{return Object.keys(SK).filter(id=>{const S=SK[id];return !(TECH9.src[id]&&TECH9.src[id].hit)&&!(S.m8)&&!S.kind&&!(S.ult||S.m8u)}).join(" ")}));console.log(await p.evaluate(()=>{const c={};for(const id in SK){const S=SK[id];const k=(window.TECH9&&TECH9.src[id]&&TECH9.src[id].hit&&TECH9.src[id].hit.shape)||(S.m8&&S.m8.kind)||S.kind||(S.ult||S.m8u?'ULT':'?');c[k]=(c[k]||0)+1}return JSON.stringify(c)}));await b.close()})();
