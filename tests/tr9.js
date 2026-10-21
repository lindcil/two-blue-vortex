const {chromium}=require('playwright-core');const SH='/workspace/two-blue-vortex/screens/v09/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' @'+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto('file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{localStorage.removeItem('tbv9_daily');Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9)});window.__au=setInterval(()=>{if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},300)});
const wf=async(js,t=40000)=>{const t0=Date.now();while(Date.now()-t0<t){if(await p.evaluate(js))return true;await p.waitForTimeout(150)}console.log('TIMEOUT',js);return false};
await wf(()=>Voie.step==='a1'&&!Scene.on&&!Talk.on);await p.evaluate(()=>{clearInterval(window.__au);Game.cine=false;ZONE8.enter('entrainement')});await p.waitForTimeout(1800);
console.log('room',await p.evaluate(()=>[ZONE8.room&&ZONE8.room.id,JSON.stringify(DQ9.st.q.map(q=>q.id))]));
await p.evaluate(()=>{const h=Game.hero;const s=TRAIN9.ST[0];h.x=ZONE8.room.x+s[4];h.y=ZONE8.room.y+s[5]+60});await p.waitForTimeout(400);await p.screenshot({path:SH+'train-terrain.png'});
const heal=()=>p.evaluate(()=>{const h=Game.hero;h.hp=h.maxHp});
for(const id of ['sage','boulder','climb','shur','eye','leaf','course','clone']){await heal();await p.evaluate((id)=>{const s=TRAIN9.ST.find(q=>q[0]===id);const h=Game.hero;h.x=ZONE8.room.x+s[4];h.y=ZONE8.room.y+s[5]+(id==='sage'?0:70);Cam.x=h.x;Cam.y=h.y;TRAIN9.start(id)},id);
 if(id==='climb'){await p.keyboard.down('KeyC');for(let i=0;i<14;i++){await p.waitForTimeout(250);const v=await p.evaluate(()=>1);await p.keyboard.up('KeyC');await p.waitForTimeout(180);await p.keyboard.down('KeyC');}await p.keyboard.up('KeyC');}
 else if(id==='boulder'){await p.waitForTimeout(500);await p.evaluate(()=>{const B=World.foes_.filter(f=>f.boulder);B.slice(0,4).forEach(f=>hurt(f,200,Game.hero,{}))});}
 else await p.waitForTimeout(id==='sage'?4500:1800);
 await p.screenshot({path:SH+'train-'+id+'.png'});console.log(id,await p.evaluate(()=>[TRAIN9.cur&&TRAIN9.cur.n,document.getElementById('act9').textContent.slice(0,60)]));
 await p.evaluate(()=>{if(TRAIN9.cur){const c=TRAIN9.cur;c.clean&&c.clean()}});await p.evaluate(()=>{/*abort*/});await p.evaluate(()=>{const a=TRAIN9.cur;if(a){TRAIN9.bxp(a.b,a.xp||35)}});await p.evaluate(()=>{document.getElementById('act9').style.display='none'});
 await p.evaluate(()=>{ /* reset A */ });}
// quêtes : forcer progression
await p.evaluate(()=>{for(const q of DQ9.st.q)DQ9.add(q.id,q.goal)});await p.waitForTimeout(600);await p.screenshot({path:SH+'train-quetes-du-jour.png'});
console.log(await p.evaluate(()=>[document.getElementById('dq9').innerText.replace(/\n/g,' | '),JSON.stringify(Voie.me.bxp),Voie.me.pts,Voie.me.sage||0]));
console.log('errs',errs.length,errs.slice(0,5));await b.close()})();
