const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await ctx.newPage();
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1500);await (await p.$('#bNew')).tap();await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('#touch > *')].map(d=>[d.className,d.dataset.a,d.textContent.slice(0,3),d.style.cssText.slice(0,120)].join('|')).join('\n')));await b.close()})();
