const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v10/dialogue/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.start(true)});await p.waitForTimeout(2500);
for(const [lg,n] of [['fr','avant'],['en','apres']]){await p.evaluate((lg)=>{Save.set.lang=lg;Talk.q=[];Talk.on=false;Talk.say([['Sarada','Boruto… c’est vraiment toi ?'],['Boruto','Plus tard. Ce soir, au rocher. Seule.']])},lg);await p.waitForTimeout(600);await p.screenshot({path:SH+n+'-sarada.png'});
 await p.evaluate(()=>Talk.next());await p.waitForTimeout(400);await p.screenshot({path:SH+n+'-boruto.png'});await p.evaluate(()=>{Talk.q=[];Talk.next()});
 await p.evaluate(()=>Talk.choose([['Sarada','Pourquoi je te croirais ?']],['Parce que tu ne m’as jamais oublié.','Ne me crois pas. Regarde.'],()=>{}));await p.waitForTimeout(400);await p.evaluate(()=>Talk.next());await p.waitForTimeout(400);await p.screenshot({path:SH+n+'-choix.png'});await p.evaluate(()=>Talk.pick(0));}
console.log('errs',errs.length,errs.slice(0,3));await b.close()})();
