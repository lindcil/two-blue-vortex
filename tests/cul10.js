const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(3)}));await p.waitForTimeout(1500);
for(const clan of ['inuzuka','senju','yamanaka','nara']){console.log(clan,await p.evaluate(c=>{const u=CLAN_ULT[c];Game.ultId=u;Game.ultV=100;Game.cine=false;try{fireUlt(Game.hero,u)}catch(e){return 'ERR '+e.message}return [u,SK[u].n,CLAN_ADV[c],SK[CLAN_ADV[c]].n,typeof ULT_FX[u]]},clan));await p.waitForTimeout(3000)}
console.log('errs',errs);await b.close()})();
