const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(900);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.AUTO=1;setInterval(()=>{if(AUTO&&Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
const t0=Date.now();while(Date.now()-t0<30000){if(await p.evaluate(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on))break;await p.waitForTimeout(200)}
await p.evaluate(()=>{ZONE8.exit({instant:true});Game.inCombat=()=>false;Game.ryo=500;AUTO=0});
const D='/workspace/two-blue-vortex/screens/v10/life/';require('fs').mkdirSync(D,{recursive:true});
const shot=async(n)=>{await p.waitForTimeout(700);await p.screenshot({path:D+n})};
const at=async(x,y,t)=>{await p.evaluate(([x,y,t])=>{World.time=t;const h=Game.hero;h.x=x;h.y=y;h.vx=h.vy=0;for(const n of World.npcs)for(let i=0;i<60;i++)npcUpdate(n,0.5);},[x,y,t]);await p.waitForTimeout(400)};
const txt=()=>p.evaluate(()=>[Talk.on,document.body.innerText.match(/(Teuchi|Home|Training|Tenten)[^\n]*\n?[^\n]*/g)]);
// Ichiraku midi
await at(1290*Math.sqrt(10),935*Math.sqrt(10),12.5);console.log('lunch',await p.evaluate(()=>World.npcs.filter(n=>!n.hidden&&Math.hypot(n.x/K10-1290,n.y/K10-920)<120).map(n=>n.id)));
await p.evaluate(()=>{const t=World.npcs.find(n=>n.id==='teuchi');Game.hero.hp=10;Voie.talkNpc(Object.assign(t,{li:2}))});await shot('ichiraku-menu.png');
await p.evaluate(()=>{for(let i=0;i<5&&!Talk.showing;i++)Talk.next();Talk.pick(0)});await p.waitForTimeout(500);console.log('eat',await p.evaluate(()=>[Game.ryo,Game.hero.hp===Game.hero.maxHp]));await shot('ichiraku-repas.png');await p.evaluate(()=>{while(Talk.on)Talk.next()});
// maison nuit
const hm=await p.evaluate(()=>LIFE10.homeXY());await at(hm[0],hm[1]-20,22);console.log('it',await p.evaluate(()=>Game.interactables()&&Game.interactables().s));
await p.evaluate(()=>Game.usePoi(LIFE10.life()[0]));await shot('maison-nuit.png');await p.evaluate(()=>{for(let i=0;i<5&&!Talk.showing;i++)Talk.next();Talk.pick(0)});await p.waitForTimeout(1500);console.log('sleep',await p.evaluate(()=>[World.time,World.day]));await shot('reveil.png');await p.evaluate(()=>{while(Talk.on)Talk.next()});
// entrainement
await at(2850*Math.sqrt(10),1270*Math.sqrt(10),16);await p.evaluate(()=>Game.usePoi(LIFE10.life()[1]));await shot('entrainement.png');await p.evaluate(()=>{for(let i=0;i<5&&!Talk.showing;i++)Talk.next();Talk.pick(1)});await p.waitForTimeout(1200);console.log('train',await p.evaluate(()=>[World.time,Game.xp]));await p.evaluate(()=>{while(Talk.on)Talk.next()});
// kids after school, night lines
console.log('kids',await p.evaluate(()=>World.npcs.filter(n=>n.kid).map(n=>[n.id,Math.round(n.x/K10),Math.round(n.y/K10)])));
await p.evaluate(()=>{const t=World.npcs.find(n=>n.id==='smith');World.time=10;Voie.talkNpc(Object.assign(t,{li:1}))});await shot('boutique-tenten.png');await p.evaluate(()=>{while(Talk.on)Talk.next()});
await p.evaluate(()=>{World.time=23;const g=World.npcs.find(n=>n.id==='kotetsu');Voie.talkNpc(Object.assign(g,{li:1}))});await shot('kotetsu-nuit.png');
console.log('miss',await p.evaluate(()=>[...LANG10.miss]));console.log('errs',errs);await b.close()})();
