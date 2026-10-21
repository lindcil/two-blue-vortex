const {chromium}=require('playwright-core');const PFX=process.argv[2]||'after';const SH='/workspace/two-blue-vortex/screens/v10/map/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const p=await b.newPage({viewport:{width:1280,height:720}});
p.on('pageerror',e=>errs.push('PE '+e.message+' '+(e.stack||'').split('\n')[1]));p.on('console',m=>{if(m.type()=='error')errs.push(m.text().slice(0,200))});
await p.goto(process.env.U||'file:///workspace/two-blue-vortex/index.html');await p.waitForTimeout(1000);if(await p.$('#lay07'))await p.click('#lay1');
await p.evaluate(()=>{Game.startVoie({name:'Aoi',clan:'uchiha',look:makeLook(9),el:'fire'});window.__au=setInterval(()=>{const sk=document.getElementById('scnskip');if(sk&&sk.offsetParent)sk.click();if(Talk.on&&Talk.t>0.3){if(Talk.showing)Talk.pick(0);else Talk.next()}},200)});
await p.waitForTimeout(4000);await p.evaluate(()=>{if(window.Scene&&Scene.on&&Scene.end)try{Scene.end()}catch(e){}});await p.waitForTimeout(1000);
const info=await p.evaluate(()=>({k10:World.k10,moved:World.moved10,cuts:World.cuts?World.cuts():'n/a',trees:(World.trees10||[]).length,secs:ZONE8.SECS.map(s=>[s.n,Math.round(s.w),Math.round(s.h)]),hero:[Math.round(Game.hero.x),Math.round(Game.hero.y)],room:ZONE8.room&&ZONE8.room.id}));console.log(JSON.stringify(info));
// bordures : overlay de debug pour la capture
await p.evaluate(()=>{ZONE8.room=null;window.__dbg=1;const dg=World.drawGround.bind(World);World.drawGround=function(g){dg(g);if(!window.__dbg)return;g.save();g.strokeStyle='#ff3b6b';g.lineWidth=8;g.setLineDash([30,20]);for(const s of ZONE8.SECS)g.strokeRect(s.x,s.y,s.w,s.h);g.restore();}});
const K=await p.evaluate(()=>World.k10?Math.sqrt(10):1);const shots=[['bordure-village',1600*K,1320*K],['bordure-mur',1600*K,2380*K]];
for(const [n,x,y] of shots){await p.evaluate(([x,y])=>{const h=Game.hero;h.x=x;h.y=y;ZONE8.sec=ZONE8.secAt(x,y);Cam.x=x;Cam.y=y;Cam.tz=0.5;},[x,y]);await p.waitForTimeout(900);await p.screenshot({path:SH+PFX+'-'+n+'.png'});}
// toutes les sections : entrée et transitions
const secs=await p.evaluate(()=>ZONE8.SECS.length);const seen=[];for(let i=0;i<secs;i++){const r=await p.evaluate((i)=>{const s=ZONE8.SECS[i],h=Game.hero;h.x=s.x+s.w/2;h.y=s.y+s.h/2;World.collide(h);return [s.n,Math.round(h.x),Math.round(h.y)]},i);await p.waitForTimeout(500);const cur=await p.evaluate(()=>ZONE8.sec&&ZONE8.sec.n);seen.push(cur);}
console.log('sections',JSON.stringify(seen));
await p.evaluate(()=>{window.__dbg=0;Cam.tz=1});
// carte
await p.evaluate(()=>UI.open('carte'));await p.waitForTimeout(600);await p.screenshot({path:SH+PFX+'-carte.png'});await p.evaluate(()=>UI.close());
// échelle : vue du village
await p.evaluate((KK)=>{const h=Game.hero;h.x=KK*1600+300;h.y=KK*960+200;ZONE8.sec=ZONE8.secAt(h.x,h.y);},K);await p.waitForTimeout(900);await p.screenshot({path:SH+PFX+'-echelle-village.png'});
// saut d'arbre : forêt ouest
const tj=await p.evaluate(()=>{const h=Game.hero;const T=World.trees10||World.props.filter(q=>q.kind==='tree').map(q=>Object.assign(q,{lx:q.x,ly:q.y}));const t=T.find(t=>t.lx<480&&t.ly>800&&t.ly<2000)||T[0];h.x=t.x+500;h.y=t.y+30;ZONE8.sec=ZONE8.secAt(h.x,h.y);h.face=-1;h.vx=-900;h.vy=0;h.runT=2;h.ninjaRun=true;window.__run=setInterval(()=>{Input.virt=Input.virt||{};Input.virt.left=true},50);return !!window.TREE10});
await p.waitForTimeout(600);await p.evaluate(()=>{if(window.TREE10&&TREE10.start)TREE10.start(Game.hero)});
await p.waitForTimeout(140);await p.screenshot({path:SH+PFX+'-saut-arbre-a.png'});await p.waitForTimeout(140);await p.screenshot({path:SH+PFX+'-saut-arbre-b.png'});await p.waitForTimeout(400);await p.screenshot({path:SH+PFX+'-saut-arbre-atterrissage.png'});
const sp=await p.evaluate(()=>{const h=Game.hero;return [Math.round(Math.hypot(h.vx,h.vy)),!!h.ninjaRun]});console.log('speed',sp,'tj',tj);
console.log(PFX,'errs',errs.length,errs.slice(0,5));await b.close()})();
