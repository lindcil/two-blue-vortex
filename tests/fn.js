const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);
console.log(await p.evaluate(()=>{const o=[];for(const f in MODE08.F){const F=MODE08.F[f];o.push(F.n_fr||F.n);for(const s of F.st)o.push(s.n_fr||s.n)}return [...new Set(o)].filter(s=>!(s in LANG10.DATA.en)).join('\n')}));await b.close()})();
