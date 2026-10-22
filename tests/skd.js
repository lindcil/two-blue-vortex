const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);
const r=await p.evaluate(()=>Object.entries(SK).map(([k,s])=>[k,s.n_fr||s.n,s.el||s.e||'',s.type||s.k||'',s.cd,s.cost||s.ch,s.dmg||'',(s.d||s.desc||'').slice(0,50)].join(' | ')));
console.log(r.length);console.log(r.join('\n'));await b.close()})();
