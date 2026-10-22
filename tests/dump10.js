const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1200);if(await p.$('#lay07'))await p.click('#lay1');
const r=await p.evaluate(()=>{const S=new Set();const walk=(n)=>{if(n.nodeType===3){const t=n.textContent.trim();if(t&&/[a-zA-Zé]{2}/.test(t))S.add(t)}else if(n.nodeType===1){for(const a of ['title','placeholder'])if(n.getAttribute&&n.getAttribute(a))S.add(n.getAttribute(a));for(const c of n.childNodes)walk(c)}};walk(document.body);
 const sk=Object.entries(SK).map(([k,v])=>v.n).filter(Boolean);const d=Object.entries(SK).map(([k,v])=>v.d).filter(Boolean);return {dom:[...S],sk:[...new Set(sk)],d:[...new Set(d)]}});
require('fs').writeFileSync('/tmp/dump.json',JSON.stringify(r,null,0));console.log(r.dom.length,r.sk.length,r.d.length);await b.close()})();
