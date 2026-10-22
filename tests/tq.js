const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);
await p.evaluate(()=>Game.startVoie({name:'Aoi',clan:'uzumaki',look:makeLook(3)}));await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const n=World.props.filter(q=>q.kind==='tree'&&Math.hypot(q.x/K10-3350,q.y/K10-3860)<470);return [n.length,n.slice(0,3).map(q=>[q.x/K10|0,q.y/K10|0,q.lx]),World.build.toString().slice(0,80)]}));await b.close()})();
